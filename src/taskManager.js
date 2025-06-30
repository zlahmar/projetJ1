class TaskManager {
  constructor() {
    this.tasks = [];
  }

  addTask(task) {
    this.tasks.push(task);
  }

  listTasks({ page = 1, limit = 20, assigneeId = null } = {}) {
    if (limit <= 0) {
      throw new Error('Invalid page size');
    }

    let tasksToProcess = this.tasks;

    if (assigneeId) {
      tasksToProcess = tasksToProcess.filter(task => task.assignee && task.assignee.id === assigneeId);
    }

    const totalItems = tasksToProcess.length;
    const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / limit);

    const startIndex = (page - 1) * limit;
    const paginatedData = tasksToProcess.slice(startIndex, startIndex + limit);

    return {
      data: paginatedData,
      pagination: {
        totalItems,
        totalPages,
        currentPage: page,
        pageSize: limit
      }
    };
  }

  findTaskById(taskId) {
    return this.tasks.find(task => task.id === taskId);
  }

  updateTaskStatus(taskId, status) {
    const allowedStatus = ['TODO', 'ONGOING', 'DONE'];
    if (!allowedStatus.includes(status)) {
      throw new Error('Invalid status. Allowed values: TODO, ONGOING, DONE');
    }

    const task = this.findTaskById(taskId);
    if (!task) {
      throw new Error('Task not found');
    }

    task.statut = status;
    return task;
  }

  updateTask(taskId, updates) {
    const task = this.findTaskById(taskId);
    if (!task) {
      throw new Error('Task not found');
    }

    // On délègue la logique de mise à jour à la tâche elle-même
    task.update(updates);

    return task;
  }

  deleteTask(taskId) {
    const taskIndex = this.tasks.findIndex(task => task.id === taskId);

    if (taskIndex === -1) {
      throw new Error('Task not found');
    }

    this.tasks.splice(taskIndex, 1);
  }
}

module.exports = TaskManager; 