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
    if (!task) {
      throw new Error('Task not found');
    }

    if (userId === null) {
      task.assignee = null;
      return task;
    }

    const user = this.userManager.getUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    task.assignee = user;
    return task;
  }

  getTaskById(id) {
    return this.tasks.find((task) => task.id === id);
  }

  listTasks(options = {}) {
    const {
      page = 1,
      limit = 20,
      sort = { field: 'createdAt', order: 'desc' },
      filter = {},
    } = options;

    if (limit <= 0) {
      throw new Error('Invalid page size');
    }

    const { status, search, assigneeId } = filter;

    // Valider l'utilisateur si l'ID est fourni (et non undefined/null)
    if (assigneeId) {
      if (!this.userManager.getUserById(assigneeId)) {
        throw new Error('User not found');
      }
    }
    
    let filteredTasks = [...this.tasks];

    // --- Logique de Filtrage ---
    if (status) {
      const allowedStatus = ['TODO', 'ONGOING', 'DONE'];
      if (!allowedStatus.includes(status)) {
        throw new Error('Invalid filter status');
      }
      filteredTasks = filteredTasks.filter((task) => task.statut === status);
    }

    if (search) {
      const lowerCaseQuery = search.toLowerCase();
      filteredTasks = filteredTasks.filter(
        (task) =>
          task.titre.toLowerCase().includes(lowerCaseQuery) ||
          (task.description &&
            task.description.toLowerCase().includes(lowerCaseQuery)),
      );
    }
    
    if (assigneeId !== undefined) {
      if (assigneeId === null) {
        filteredTasks = filteredTasks.filter((task) => !task.assignee);
      } else {
        filteredTasks = filteredTasks.filter(
          (task) => task.assignee && task.assignee.id === assigneeId,
        );
      }
    }

    // --- Logique de Tri ---
    const allowedSortBy = ['createdAt', 'title', 'status'];
    if (sort && !allowedSortBy.includes(sort.field)) {
      throw new Error('Invalid sort criteria');
    }

    filteredTasks.sort((a, b) => {
      const fieldA = a[sort.field];
      const fieldB = b[sort.field];
      const order = sort.order === 'asc' ? 1 : -1;

      if (sort.field === 'status') {
        const statusOrder = { TODO: 1, ONGOING: 2, DONE: 3 };
        return (statusOrder[a.statut] - statusOrder[b.statut]) * order;
      }
      if (sort.field === 'title') {
        return a.titre.localeCompare(b.titre) * order;
      }
      // Tri par date par défaut
      return (a.createdAt - b.createdAt) * order;
    });

    // --- Logique de Pagination ---
    const totalItems = filteredTasks.length;
    const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / limit);
    const startIndex = (page - 1) * limit;
    const paginatedData = filteredTasks.slice(startIndex, startIndex + limit);

    return {
      data: paginatedData,
      pagination: {
        totalItems,
        totalPages,
        currentPage: page,
        itemsPerPage: limit,
      },
    };
  }

  findTaskById(taskId) {
    return this.tasks.find((task) => task.id === taskId);
  }

  updateTaskStatus(taskId, status) {
    const allowedStatus = ["TODO", "ONGOING", "DONE"];
    if (!allowedStatus.includes(status)) {
      throw new Error("Invalid status. Allowed values: TODO, ONGOING, DONE");
    }

    const task = this.findTaskById(taskId);
    if (!task) {
      throw new Error("Task not found");
    }

    task.statut = status;
    return task;
  }

  updateTask(taskId, updates) {
    const task = this.findTaskById(taskId);
    if (!task) {
      throw new Error("Task not found");
    }

    // On délègue la logique de mise à jour à la tâche elle-même
    task.update(updates);

    return task;
  }

  deleteTask(taskId) {
    const taskIndex = this.tasks.findIndex((task) => task.id === taskId);

    if (taskIndex === -1) {
      throw new Error("Task not found");
    }

    this.tasks.splice(taskIndex, 1);
  }
}

module.exports = TaskManager;
