const { randomUUID } = require("crypto");
const AppError = require("./errors");

const ALLOWED_PRIORITIES = ["LOW", "NORMAL", "HIGH", "CRITICAL"];

class Task {
  constructor(titre, description = "", assignee = null, dueDate = null) {
    this._validateTitle(titre);
    this._validateDescription(description);

    this.id = randomUUID();
    this.titre = titre.trim();
    this.description = description;
    this.statut = "TODO";
    this.dateCreation = new Date();
    this.assignee = assignee;
    this.dueDate = dueDate;
    this.priority = "NORMAL";
    this.tags = [];
    this.history = [];

    this._recordEvent("CREATION", { titre: this.titre });
  }

  _validateTitle(titre) {
    if (!titre || titre.trim() === "") throw new AppError("Title is required", "TITLE_REQUIRED");
    if (titre.length > 100) throw new AppError("Title cannot exceed 100 characters", "TITLE_TOO_LONG");
  }

  _validateDescription(description) {
    if (description && description.length > 500)
      throw new AppError("Description cannot exceed 500 characters", "DESCRIPTION_TOO_LONG");
  }

  _validatePriority(priority) {
    if (!ALLOWED_PRIORITIES.includes(priority))
      throw new AppError(
        `Invalid priority. Allowed values: ${ALLOWED_PRIORITIES.join(", ")}`,
        "PRIORITY_INVALID"
      );
  }

  _validateTag(tag) {
    if (!tag || tag.trim() === "" || tag.length > 20) {
      throw new AppError("Invalid tag validation", "TAG_INVALID");
    }
  }

  _recordEvent(type, data) {
    this.history.push({
      date: new Date(),
      type,
      data,
    });
  }

  update({ titre, description }) {
    if (titre !== undefined) {
      this._validateTitle(titre);
      const old = this.titre;
      this.titre = titre.trim();
      this._recordEvent("UPDATE_TITLE", { from: old, to: this.titre });
    }
    if (description !== undefined) {
      this._validateDescription(description);
      const old = this.description;
      this.description = description;
      this._recordEvent("UPDATE_DESCRIPTION", { from: old, to: this.description });
    }
    return this;
  }

  setDueDate(date) {
    const old = this.dueDate;
    if (!(date instanceof Date) || isNaN(date)) {
      throw new AppError("Invalid date format", "DATE_INVALID");
    }
    const isPast = date < new Date();
    this.dueDate = date;
    this._recordEvent("SET_DUE_DATE", { from: old, to: date, warning: isPast });
    return this;
  }

  clearDueDate() {
    const old = this.dueDate;
    this.dueDate = null;
    this._recordEvent("CLEAR_DUE_DATE", { from: old });
    return this;
  }

  setPriority(priority) {
    this._validatePriority(priority);
    const old = this.priority;
    this.priority = priority;
    this._recordEvent("SET_PRIORITY", { from: old, to: priority });
    return this;
  }

  addTags(...newTags) {
    newTags.forEach((tag) => {
      this._validateTag(tag);
      if (!this.tags.includes(tag)) {
        this.tags.push(tag);
        this._recordEvent("ADD_TAG", { tag });
      }
    });
    return this;
  }

  removeTag(tagToRemove) {
    const idx = this.tags.indexOf(tagToRemove);
    if (idx !== -1) {
      this.tags.splice(idx, 1);
      this._recordEvent("REMOVE_TAG", { tag: tagToRemove });
    }
    return this;
  }

  updateStatus(newStatus) {
    const allowed = ["TODO", "ONGOING", "DONE"];
    if (!allowed.includes(newStatus)) {
      throw new AppError(`Invalid status. Allowed values: ${allowed.join(", ")}`, "STATUS_INVALID");
    }
    const old = this.statut;
    this.statut = newStatus;
    this._recordEvent("UPDATE_STATUS", { from: old, to: newStatus });
    return this;
  }

  isOverdue() {
    if (this.statut === "DONE" || !this.dueDate) return false;
    // On ne marque pas en retard si échéance aujourd'hui
    const now = new Date();
    return now > this.dueDate && now.toDateString() !== this.dueDate.toDateString();
  }
}

module.exports = Task;
