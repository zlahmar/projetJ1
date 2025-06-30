const TaskManager = require('../src/taskManager');
const Task = require('../src/task');

describe('TaskManager - Gestion des tâches', () => {
  let taskManager;

  beforeEach(() => {
    taskManager = new TaskManager();
  });

  test('devrait être initialement vide', () => {
    expect(taskManager.listTasks()).toEqual([]);
  });

  test('devrait ajouter une tâche à la liste', () => {
    // GIVEN
    const task = new Task('Apprendre le TDD');

    // WHEN
    taskManager.addTask(task);
    const tasks = taskManager.listTasks();

    // THEN
    expect(tasks.length).toBe(1);
    expect(tasks[0]).toBe(task);
  });

  describe('Pagination', () => {
    beforeEach(() => {
      // GIVEN
      for (let i = 1; i <= 15; i++) {
        taskManager.addTask(new Task(`Tâche ${i}`));
      }
    });

    test('devrait retourner la première page de 10 tâches par défaut', () => {
      // WHEN
      const tasks = taskManager.listTasks();

      // THEN
      expect(tasks.length).toBe(10);
      expect(tasks[0].titre).toBe('Tâche 1');
    });

    test('devrait retourner la deuxième page', () => {
      // WHEN
      const tasks = taskManager.listTasks({ page: 2, limit: 5 });
      
      // THEN
      expect(tasks.length).toBe(5);
      expect(tasks[0].titre).toBe('Tâche 6');
    });

    test('devrait retourner les tâches restantes sur la dernière page', () => {
      // WHEN
      const tasks = taskManager.listTasks({ page: 2, limit: 10 });

      // THEN
      expect(tasks.length).toBe(5);
      expect(tasks[0].titre).toBe('Tâche 11');
    });
  });
}); 