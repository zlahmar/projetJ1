const { randomUUID } = require('crypto');

class Task {
  constructor(titre, description = "", assignee = null, dueDate = null) {
    this._validateTitle(titre);
    this._validateDescription(description);

    this.id = randomUUID();
    this.titre = titre;
    this.description = description;
    this.statut = "TODO";
    this.dateCreation = new Date();
    this.assignee = assignee;
    this.dueDate = dueDate;
  }

  _validateTitle(titre) {
    if (!titre || titre.trim() === '') {
      throw new Error('Title is required');
    }
    if (titre.length > 100) {
      throw new Error('Title cannot exceed 100 characters');
    }
  }

  _validateDescription(description) {
    // La validation de la description sera ajoutée ici plus tard
  }

  update(updates) {
    if (updates.titre !== undefined) {
      this._validateTitle(updates.titre);
      this.titre = updates.titre;
    }
    if (updates.description !== undefined) {
      this._validateDescription(updates.description);
      this.description = updates.description;
    }
  }

  isOverdue() {
    if (this.statut === 'DONE' || !this.dueDate) {
      return false;
    }
    return new Date() > this.dueDate;
  }
}

module.exports = Task; 