const TaskManager = require('../src/taskManager');
const Task = require('../src/task');
const User = require('../src/user');

describe('TaskManager - Gestion des tâches', () => {
  let taskManager;

  beforeEach(() => {
    taskManager = new TaskManager();
  });

  test('devrait être initialement vide', () => {
    expect(taskManager.listTasks().data).toEqual([]);
  });

  test('devrait ajouter une tâche à la liste', () => {
    // GIVEN
    const task = new Task('Apprendre le TDD');

    // WHEN
    taskManager.addTask(task);
    const result = taskManager.listTasks();

    // THEN
    expect(result.data.length).toBe(1);
    expect(result.data[0]).toBe(task);
  });

  describe('Filtrage par utilisateur', () => {
    let userAlice, userBob;

    beforeEach(() => {
      // GIVEN
      userAlice = new User('Alice');
      userBob = new User('Bob');

      taskManager.addTask(new Task('Tâche 1 pour Alice', '', userAlice));
      taskManager.addTask(new Task('Tâche 1 pour Bob', '', userBob));
      taskManager.addTask(new Task('Tâche 2 pour Alice', '', userAlice));
      taskManager.addTask(new Task('Tâche sans assignee'));
    });

    test('devrait retourner uniquement les tâches assignées à un utilisateur spécifique', () => {
      // WHEN
      const result = taskManager.listTasks({ assigneeId: userAlice.id });

      // THEN
      expect(result.data.length).toBe(2);
      expect(result.data[0].assignee.id).toBe(userAlice.id);
      expect(result.data[1].assignee.id).toBe(userAlice.id);
    });

    test('devrait retourner une liste vide si aucune tâche n\'est assignée à un utilisateur', () => {
      // GIVEN
      const userCharlie = new User('Charlie');

      // WHEN
      const result = taskManager.listTasks({ assigneeId: userCharlie.id });

      // THEN
      expect(result.data.length).toBe(0);
    });

    test('devrait fonctionner avec la pagination', () => {
      // GIVEN
      taskManager.addTask(new Task('Tâche 3 pour Alice', '', userAlice));
      taskManager.addTask(new Task('Tâche 4 pour Alice', '', userAlice));
      
      // WHEN
      const result = taskManager.listTasks({ assigneeId: userAlice.id, page: 2, limit: 2 });

      // THEN
      expect(result.data.length).toBe(2);
      expect(result.data[0].titre).toBe('Tâche 3 pour Alice');
      expect(result.pagination.totalItems).toBe(4);
      expect(result.pagination.totalPages).toBe(2);
    });
  });

  describe('US006 - Lister mes tâches avec pagination', () => {
    beforeEach(() => {
      // GIVEN 25 tasks
      for (let i = 1; i <= 25; i++) {
        taskManager.addTask(new Task(`Tâche ${i}`));
      }
    });

    test('devrait retourner la première page avec une taille de 20 par défaut', () => {
      // WHEN
      const result = taskManager.listTasks();

      // THEN
      expect(result.data.length).toBe(20);
      expect(result.data[0].titre).toBe('Tâche 1');
      expect(result.pagination.currentPage).toBe(1);
      expect(result.pagination.totalPages).toBe(2);
      expect(result.pagination.totalItems).toBe(25);
    });

    test('devrait retourner la deuxième page avec les bonnes informations', () => {
        // WHEN
        const result = taskManager.listTasks({ page: 2, limit: 10 });
  
        // THEN
        expect(result.data.length).toBe(10);
        expect(result.data[0].titre).toBe('Tâche 11');
        expect(result.pagination.currentPage).toBe(2);
        expect(result.pagination.totalPages).toBe(3);
        expect(result.pagination.totalItems).toBe(25);
    });

    test('devrait retourner une liste vide pour une page hors limites', () => {
        // WHEN
        const result = taskManager.listTasks({ page: 99, limit: 20 });
  
        // THEN
        expect(result.data.length).toBe(0);
        expect(result.pagination.currentPage).toBe(99);
        expect(result.pagination.totalPages).toBe(2);
        expect(result.pagination.totalItems).toBe(25);
    });
    
    test('devrait retourner une pagination correcte pour une liste vide', () => {
        // GIVEN
        taskManager = new TaskManager(); // Reset to empty

        // WHEN
        const result = taskManager.listTasks();
  
        // THEN
        expect(result.data.length).toBe(0);
        expect(result.pagination.totalItems).toBe(0);
        expect(result.pagination.totalPages).toBe(0);
        expect(result.pagination.currentPage).toBe(1);
    });

    test.each([0, -1, -10])('devrait lever une erreur pour une taille de page invalide (%s)', (limit) => {
        expect(() => {
            taskManager.listTasks({ limit });
          }).toThrow('Invalid page size');
    });
  });

  describe('US004 - Changer le statut d\'une tâche', () => {
    let task;

    beforeEach(() => {
      task = new Task('Ma tâche');
      taskManager.addTask(task);
    });

    test('devrait changer le statut d\'une tâche à "ONGOING"', () => {
      // WHEN
      const updatedTask = taskManager.updateTaskStatus(task.id, 'ONGOING');
      // THEN
      expect(updatedTask.statut).toBe('ONGOING');
    });

    test('devrait changer le statut d\'une tâche à "DONE"', () => {
      // WHEN
      const updatedTask = taskManager.updateTaskStatus(task.id, 'DONE');
      // THEN
      expect(updatedTask.statut).toBe('DONE');
    });

    test('devrait lever une erreur pour un statut invalide', () => {
      // WHEN & THEN
      expect(() => {
        taskManager.updateTaskStatus(task.id, 'INVALID_STATUS');
      }).toThrow('Invalid status. Allowed values: TODO, ONGOING, DONE');
    });

    test('devrait lever une erreur si la tâche n\'existe pas', () => {
      // WHEN & THEN
      expect(() => {
        taskManager.updateTaskStatus('id-inexistant', 'TODO');
      }).toThrow('Task not found');
    });
  });

  describe('US003 - Modifier une tâche', () => {
    let task;
    const originalDescription = 'Description initiale';

    beforeEach(() => {
      task = new Task('Titre initial', originalDescription);
      taskManager.addTask(task);
    });

    test('devrait mettre à jour uniquement le titre', () => {
      const updatedTask = taskManager.updateTask(task.id, { titre: 'Nouveau titre' });
      expect(updatedTask.titre).toBe('Nouveau titre');
      expect(updatedTask.description).toBe(originalDescription);
    });

    test('devrait mettre à jour uniquement la description', () => {
      const updatedTask = taskManager.updateTask(task.id, { description: 'Nouvelle description' });
      expect(updatedTask.titre).toBe('Titre initial');
      expect(updatedTask.description).toBe('Nouvelle description');
    });

    test('devrait mettre à jour le titre et la description', () => {
      const updatedTask = taskManager.updateTask(task.id, { titre: 'Autre titre', description: 'Autre description' });
      expect(updatedTask.titre).toBe('Autre titre');
      expect(updatedTask.description).toBe('Autre description');
    });

    test('devrait ignorer les champs non modifiables', () => {
      const originalId = task.id;
      const originalDate = task.dateCreation;
      const updatedTask = taskManager.updateTask(task.id, { titre: 'Nouveau titre', id: 'fake-id', statut: 'DONE' });
      
      expect(updatedTask.titre).toBe('Nouveau titre');
      expect(updatedTask.id).toBe(originalId);
      expect(updatedTask.dateCreation).toBe(originalDate);
      expect(updatedTask.statut).toBe('TODO');
    });

    test('devrait refuser un titre vide', () => {
      expect(() => {
        taskManager.updateTask(task.id, { titre: ' ' });
      }).toThrow('Title is required');
    });

    test('devrait refuser un titre trop long', () => {
      expect(() => {
        taskManager.updateTask(task.id, { titre: 'a'.repeat(101) });
      }).toThrow('Title cannot exceed 100 characters');
    });

    test('devrait refuser la modification d\'une tâche inexistante', () => {
        expect(() => {
          taskManager.updateTask('id-inexistant', { titre: 'Nouveau' });
        }).toThrow('Task not found');
      });
  });

  describe('US005 - Supprimer une tâche', () => {
    let taskToDelete;

    beforeEach(() => {
      taskToDelete = new Task('Tâche à supprimer');
      taskManager.addTask(taskToDelete);
      taskManager.addTask(new Task('Autre tâche'));
    });

    test('devrait supprimer une tâche de la liste', () => {
      // WHEN
      taskManager.deleteTask(taskToDelete.id);
      
      // THEN
      const tasks = taskManager.listTasks();
      expect(tasks.data.length).toBe(1);
      expect(tasks.data[0].titre).toBe('Autre tâche');
    });

    test('devrait lever une erreur "Task not found" après suppression', () => {
      // GIVEN
      const deletedTaskId = taskToDelete.id;
      taskManager.deleteTask(deletedTaskId);

      // WHEN & THEN
      expect(taskManager.findTaskById(deletedTaskId)).toBeUndefined();
      expect(() => taskManager.updateTaskStatus(deletedTaskId, 'DONE')).toThrow('Task not found');
      expect(() => taskManager.updateTask(deletedTaskId, { titre: 'nouveau' })).toThrow('Task not found');
      expect(() => taskManager.deleteTask(deletedTaskId)).toThrow('Task not found');
    });

    test('devrait lever une erreur si on tente de supprimer une tâche inexistante', () => {
      // WHEN & THEN
      expect(() => taskManager.deleteTask('id-inexistant')).toThrow('Task not found');
    });
  });
}); 