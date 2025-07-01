const TaskManager = require('../src/taskManager');
const UserManager = require('../src/userManager');
const Task = require('../src/task');

describe('TaskManager', () => {
  let taskManager;
  let userManager;
  let userAlice;

  beforeEach(() => {
    userManager = new UserManager();
    taskManager = new TaskManager(userManager);
    userAlice = userManager.addUser('Alice', 'alice@example.com');
  });

  // Test d'ajout simple
  test('devrait ajouter une tâche', () => {
    taskManager.addTask(new Task('Nouvelle Tâche'));
    expect(taskManager.tasks.length).toBe(1);
  });

  // Test de suppression
  test('devrait supprimer une tâche', () => {
    const task = taskManager.addTask(new Task('À supprimer'));
    taskManager.deleteTask(task.id);
    expect(taskManager.tasks.length).toBe(0);
  });
  
  // Test de mise à jour
  test('devrait mettre à jour une tâche', () => {
    const task = taskManager.addTask(new Task('Titre original'));
    taskManager.updateTask(task.id, { titre: 'Nouveau titre' });
    const updatedTask = taskManager.getTaskById(task.id);
    expect(updatedTask.titre).toBe('Nouveau titre');
  });

  // Test de filtrage simple par statut
  test('devrait filtrer les tâches par statut', () => {
    taskManager.addTask(new Task('Tâche 1')); // TODO
    const task2 = new Task('Tâche 2');
    task2.statut = 'DONE';
    taskManager.addTask(task2);
    
    const { data } = taskManager.listTasks({ filter: { status: 'DONE' } });
    expect(data.length).toBe(1);
    expect(data[0].statut).toBe('DONE');
  });

  // Test de recherche simple
  test('devrait rechercher une tâche par mot-clé', () => {
    taskManager.addTask(new Task('Faire du sport'));
    taskManager.addTask(new Task('Apprendre le sport'));
    const { data } = taskManager.listTasks({ filter: { search: 'Apprendre' } });
    expect(data.length).toBe(1);
    expect(data[0].titre).toBe('Apprendre le sport');
  });

  // Test d'assignation
  test('devrait assigner une tâche à un utilisateur', () => {
    const task = taskManager.addTask(new Task('Tâche assignable'));
    taskManager.assignTask(task.id, userAlice.id);
    const result = taskManager.getTaskById(task.id);
    expect(result.assignee.id).toBe(userAlice.id);
  });

  // Test de filtre par utilisateur assigné
  test('devrait filtrer par tâches assignées à un utilisateur', () => {
    taskManager.addTask(new Task('Tâche pour Alice', '', userAlice));
    taskManager.addTask(new Task('Tâche sans assignation'));

    const { data } = taskManager.listTasks({ filter: { assigneeId: userAlice.id } });
    expect(data.length).toBe(1);
  });

  // Test de tri simple par titre
  test('devrait trier les tâches par titre', () => {
    taskManager.addTask(new Task('C'));
    taskManager.addTask(new Task('A'));
    taskManager.addTask(new Task('B'));

    const { data } = taskManager.listTasks({ sort: { field: 'title', order: 'asc' } });
    expect(data.map(t => t.titre)).toEqual(['A', 'B', 'C']);
  });
}); 