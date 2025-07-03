const TaskManager = require("../src/taskManager");
const UserManager = require("../src/userManager");
const Task = require("../src/task");

describe("TaskManager", () => {
  let taskManager;
  let userManager;
  let userAlice;

  beforeEach(() => {
    userManager = new UserManager();
    taskManager = new TaskManager(userManager);
    userAlice = userManager.addUser("Alice", "alice@example.com");
  });

      // Critère : Ajout d'une tâche (US001)
  test("devrait ajouter une tâche", () => {
    taskManager.addTask(new Task("Nouvelle Tâche"));
    expect(taskManager.tasks.length).toBe(1);
  });

      // Critère : Suppression d'une tâche (US005)
  test("devrait supprimer une tâche", () => {
    const task = taskManager.addTask(new Task("À supprimer"));
    taskManager.deleteTask(task.id);
    expect(taskManager.tasks.length).toBe(0);
  });

      // Critère : Modification d'une tâche (US003)
  test("devrait mettre à jour une tâche", () => {
    const task = taskManager.addTask(new Task("Titre original"));
    taskManager.updateTask(task.id, { titre: "Nouveau titre" });
    expect(taskManager.getTaskById(task.id).titre).toBe("Nouveau titre");
  });

      // Critère : Filtre par statut (US008)
  test("devrait filtrer les tâches par statut", () => {
    taskManager.addTask(new Task("Tâche 1"));
    const done = new Task("Tâche 2");
    done.statut = "DONE";
    taskManager.addTask(done);

    const { data } = taskManager.listTasks({ filter: { status: "DONE" } });
    expect(data).toHaveLength(1);
    expect(data[0].statut).toBe("DONE");
  });

      // Critère : Recherche par mot-clé (US007)
  test("devrait rechercher une tâche par mot-clé", () => {
    taskManager.addTask(new Task("Faire du sport"));
    taskManager.addTask(new Task("Apprendre le sport"));
    const { data } = taskManager.listTasks({ filter: { search: "Apprendre" } });
    expect(data).toHaveLength(1);
    expect(data[0].titre).toBe("Apprendre le sport");
  });

    // Critère : Assigner une tâche (US012)
  test("devrait assigner une tâche à un utilisateur", () => {
    const task = taskManager.addTask(new Task("Tâche assignable"));
    taskManager.assignTask(task.id, userAlice.id);
    expect(taskManager.getTaskById(task.id).assignee.id).toBe(userAlice.id);
  });

      // Critère : Filtrer par utilisateur assigné (US013)
  test("devrait filtrer par tâches assignées à un utilisateur", () => {
    taskManager.addTask(new Task("Pour Alice", "", userAlice));
    taskManager.addTask(new Task("Sans assignation"));

    const { data } = taskManager.listTasks({ filter: { assigneeId: userAlice.id } });
    expect(data).toHaveLength(1);
  });

      // Critère : Tri des tâches (US009)
  test("devrait trier les tâches par titre", () => {
    taskManager.addTask(new Task("C"));
    taskManager.addTask(new Task("A"));
    taskManager.addTask(new Task("B"));

    const { data } = taskManager.listTasks({ sort: { field: "title", order: "asc" } });
    expect(data.map((t) => t.titre)).toEqual(["A", "B", "C"]);
  });

  // US014 - Définir une date d'échéance
  describe("US014 - Définir une date d'échéance", () => {
    test("erreur si l'ID n'existe pas", () => {
      expect(() =>
        taskManager.setTaskDueDate("fakeId", new Date())
      ).toThrow("Task not found");
    });

    test("ajoute et supprime une date d'échéance", () => {
      const task = taskManager.addTask(new Task("Duedate"));
      const d = new Date(Date.now() + 1_000);
      taskManager.setTaskDueDate(task.id, d);
      expect(task.dueDate).toEqual(d);

      taskManager.clearTaskDueDate(task.id);
      expect(task.dueDate).toBeNull();
    });
  });

  // US015 - Filtrer les tâches en retard
  describe("US015 - Filtrer les tâches en retard", () => {
    test("listTasks({ dueOverdue: true }) ne retourne que les tâches en retard", () => {
      const tOld = taskManager.addTask(new Task("Tâche old"));
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      taskManager.setTaskDueDate(tOld.id, yesterday);

      const tNew = taskManager.addTask(new Task("Tâche new"));
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      taskManager.setTaskDueDate(tNew.id, tomorrow);

      const { data } = taskManager.listTasks({ filter: { dueOverdue: true } });
      expect(data).toContain(tOld);
      expect(data).not.toContain(tNew);
    });
  });

  // US016 - Définir des priorités et tri/filter
  describe("US016 - Définir des priorités et tri/filter", () => {
    test("tri par priorité asc", () => {
      const tLow = taskManager.addTask(new Task("Low"));
      taskManager.setTaskPriority(tLow.id, "LOW");
      const tCrit = taskManager.addTask(new Task("Crit"));
      taskManager.setTaskPriority(tCrit.id, "CRITICAL");
      const tNorm = taskManager.addTask(new Task("Norm"));

      const { data } = taskManager.listTasks({
        sort: { field: "priority", order: "asc" },
      });
      expect(data.map((t) => t.priority)).toEqual([
        "CRITICAL",
        "NORMAL",
        "LOW",
      ]);
    });

    test("filtre par priorité", () => {
      const tLow = taskManager.addTask(new Task("OnlyLow"));
      taskManager.setTaskPriority(tLow.id, "LOW");
      const { data } = taskManager.listTasks({ filter: { priority: "LOW" } });
      expect(data).toContain(tLow);
    });
  });

  // US017 - Catégoriser avec des tags
  describe("US017 - Catégoriser avec des tags", () => {
    test("listTasks filtre par au moins un tag", () => {
      const a = taskManager.addTask(new Task("A"));
      taskManager.addTaskTags(a.id, "X");
      const b = taskManager.addTask(new Task("B"));
      taskManager.addTaskTags(b.id, "Y");

      const { data } = taskManager.listTasks({ filter: { tags: ["X"] } });
      expect(data).toEqual([a]);
    });

    test("getAllTags renvoie le comptage correct", () => {
      const t1 = taskManager.addTask(new Task("1"));
      taskManager.addTaskTags(t1.id, "foo", "bar");
      const t2 = taskManager.addTask(new Task("2"));
      taskManager.addTaskTags(t2.id, "bar");

      const counts = taskManager.getAllTags();
      expect(counts).toContainEqual({ tag: "foo", count: 1 });
      expect(counts).toContainEqual({ tag: "bar", count: 2 });
    });
  });

  // US018 - Consulter l'historique d'une tâche
  describe("US018 - Consulter l'historique d'une tâche", () => {
    test("retourne les événements triés et paginés", () => {
      const t = taskManager.addTask(new Task("Hist"));
      taskManager.updateTask(t.id, { titre: "1" });
      taskManager.updateTask(t.id, { titre: "2" });

      const { data, pagination } = taskManager.getTaskHistory(t.id, {
        page: 1,
        limit: 2,
      });

      expect(data).toHaveLength(2);
      expect(pagination.total).toBeGreaterThanOrEqual(3);
    });

    test("erreur si ID incorrect", () => {
      expect(() => taskManager.getTaskHistory("nope")).toThrow("Task not found");
    });
  });
});
