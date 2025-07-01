class TaskManager {
  constructor(userManager) {
    this.tasks = [];
    this.userManager = userManager;
  }

  addTask(task) {
    this.tasks.push(task);
    return task;
  }

  assignTask(taskId, userId) {
    const task = this.getTaskById(taskId);
    if (!task) throw new Error("Task not found");

    const old = task.assignee;
    if (userId === null) {
      task.assignee = null;
    } else {
      const user = this.userManager.getUserById(userId);
      if (!user) throw new Error("User not found");
      task.assignee = user;
    }
    task._recordEvent("ASSIGN", { from: old, to: task.assignee });
    return task;
  }

  getTaskById(id) {
    return this.tasks.find((t) => t.id === id);
  }

  listTasks(options = {}) {
    const {
      page = 1,
      limit = 20,
      sort = { field: "createdAt", order: "desc" },
      filter = {},
    } = options;

    let filtered = [...this.tasks];

    if (filter.status) {
      filtered = filtered.filter((t) => t.statut === filter.status);
    }
    if (filter.search) {
      const q = filter.search.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.titre.toLowerCase().includes(q) ||
          (t.description && t.description.toLowerCase().includes(q))
      );
    }
    if (filter.assigneeId !== undefined) {
      filtered = filtered.filter((t) =>
        filter.assigneeId === null
          ? !t.assignee
          : t.assignee && t.assignee.id === filter.assigneeId
      );
    }
    if (filter.dueOverdue === true) {
      filtered = filtered.filter((t) => t.isOverdue());
    }
    if (filter.priority) {
      filtered = filtered.filter((t) => t.priority === filter.priority);
    }
    if (filter.tags && Array.isArray(filter.tags)) {
      filtered = filtered.filter((t) =>
        t.tags.some((tag) => filter.tags.includes(tag))
      );
    }

    const order = sort.order === "asc" ? 1 : -1;
    if (sort.field === "title") {
      filtered.sort((a, b) => a.titre.localeCompare(b.titre) * order);
    } else if (sort.field === "status") {
      const map = { TODO: 1, ONGOING: 2, DONE: 3 };
      filtered.sort((a, b) => (map[a.statut] - map[b.statut]) * order);
    } else if (sort.field === "priority") {
      const map = { CRITICAL: 1, HIGH: 2, NORMAL: 3, LOW: 4 };
      filtered.sort((a, b) => (map[a.priority] - map[b.priority]) * order);
    } else {
      filtered.sort((a, b) => (a.dateCreation - b.dateCreation) * order);
    }

    const totalItems = filtered.length;
    const totalPages = totalItems ? Math.ceil(totalItems / limit) : 0;
    const start = (page - 1) * limit;
    const data = filtered.slice(start, start + limit);

    return {
      data,
      pagination: { totalItems, totalPages, currentPage: page, itemsPerPage: limit },
    };
  }

  updateTask(taskId, updates) {
    const task = this.getTaskById(taskId);
    if (!task) throw new Error("Task not found");
    return task.update(updates);
  }

  updateTaskStatus(taskId, status) {
    const task = this.getTaskById(taskId);
    if (!task) throw new Error("Task not found");
    return task.updateStatus(status);
  }

  setTaskDueDate(taskId, date) {
    const task = this.getTaskById(taskId);
    if (!task) throw new Error("Task not found");
    return task.setDueDate(date);
  }

  clearTaskDueDate(taskId) {
    const task = this.getTaskById(taskId);
    if (!task) throw new Error("Task not found");
    return task.clearDueDate();
  }

  setTaskPriority(taskId, priority) {
    const task = this.getTaskById(taskId);
    if (!task) throw new Error("Task not found");
    return task.setPriority(priority);
  }

  addTaskTags(taskId, ...tags) {
    const task = this.getTaskById(taskId);
    if (!task) throw new Error("Task not found");
    return task.addTags(...tags);
  }

  removeTaskTag(taskId, tag) {
    const task = this.getTaskById(taskId);
    if (!task) throw new Error("Task not found");
    return task.removeTag(tag);
  }

  getAllTags() {
    const counts = this.tasks.reduce((acc, t) => {
      t.tags.forEach((tag) => (acc[tag] = (acc[tag] || 0) + 1));
      return acc;
    }, {});
    return Object.entries(counts).map(([tag, count]) => ({ tag, count }));
  }

  getTaskHistory(taskId, { page = 1, limit = 20 } = {}) {
    const task = this.getTaskById(taskId);
    if (!task) throw new Error("Task not found");
    const sorted = [...task.history].sort(
      (a, b) => b.date.getTime() - a.date.getTime()
    );
    const total = sorted.length;
    const totalPages = total ? Math.ceil(total / limit) : 0;
    const start = (page - 1) * limit;
    return {
      data: sorted.slice(start, start + limit),
      pagination: { total, totalPages, currentPage: page, itemsPerPage: limit },
    };
  }

  deleteTask(taskId) {
    const idx = this.tasks.findIndex((t) => t.id === taskId);
    if (idx === -1) throw new Error("Task not found");
    this.tasks.splice(idx, 1);
  }
}

module.exports = TaskManager;
