class TaskManager {
  constructor() {
    this.tasks = [];
  }

  addTask(task) {
    this.tasks.push(task);
  }

  listTasks({ page = 1, limit = 10 } = {}) {
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    return this.tasks.slice(startIndex, endIndex);
  }
}

module.exports = TaskManager; 