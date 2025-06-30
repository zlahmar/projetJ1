const Task = require("../src/task");
const User = require("../src/user");

describe("US001 - Créer une tâche", () => {
  test("devrait créer une tâche avec un ID unique, un titre, une description vide, un statut 'TODO' et une date de création", () => {
    // GIVEN
    const titre = "Faire les courses";

    // WHEN
    const tache = new Task(titre);

    // THEN
    expect(tache.id).toBeDefined();
    expect(tache.titre).toBe(titre);
    expect(tache.description).toBe("");
    expect(tache.statut).toBe("TODO");
    expect(tache.dateCreation).toBeInstanceOf(Date);
    expect(tache.assignee).toBeNull();

    const diffInSeconds = (new Date() - tache.dateCreation) / 1000;
    expect(diffInSeconds).toBeLessThan(2);
  });

  test("devrait lever une erreur si le titre est vide", () => {
    // GIVEN
    const titreVide = "";

    // WHEN & THEN
    expect(() => new Task(titreVide)).toThrow("Title is required");
  });

  test("devrait créer une tâche avec une description valide", () => {
    // GIVEN
    const titre = "Apprendre Jest";
    const description = "Faire le tutoriel officiel de Jest.";

    // WHEN
    const tache = new Task(titre, description);

    // THEN
    expect(tache.titre).toBe(titre);
    expect(tache.description).toBe(description);
  });

  test("devrait lever une erreur si le titre dépasse 100 caractères", () => {
    // GIVEN
    const titreTropLong = "a".repeat(101);

    // WHEN & THEN
    expect(() => new Task(titreTropLong)).toThrow(
      "Title cannot exceed 100 characters",
    );
  });

  test("devrait assigner une tâche à un utilisateur", () => {
    // GIVEN
    const user = new User("Bob");
    const task = new Task("Faire le café", "", user);

    // THEN
    expect(task.assignee).toBe(user);
    expect(task.assignee.nom).toBe("Bob");
  });

  describe("Dates d'échéance et statut de retard", () => {
    test("devrait créer une tâche avec une date d'échéance", () => {
      // GIVEN
      const dueDate = new Date("2024-12-31T23:59:59");
      // WHEN
      const task = new Task("Finir le projet", "", null, dueDate);
      // THEN
      expect(task.dueDate).toEqual(dueDate);
    });

    test("devrait considérer une tâche comme non en retard si la date d'échéance est dans le futur", () => {
      // GIVEN
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const task = new Task("Tâche future", "", null, tomorrow);
      // THEN
      expect(task.isOverdue()).toBe(false);
    });

    test("devrait considérer une tâche comme en retard si la date d'échéance est dans le passé", () => {
      // GIVEN
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const task = new Task("Tâche passée", "", null, yesterday);
      // THEN
      expect(task.isOverdue()).toBe(true);
    });

    test("ne devrait pas considérer une tâche comme en retard si elle n'a pas de date d'échéance", () => {
      // GIVEN
      const task = new Task("Tâche sans date");
      // THEN
      expect(task.isOverdue()).toBe(false);
    });

    test("ne devrait pas considérer une tâche comme en retard si elle est déjà terminée", () => {
      // GIVEN
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const task = new Task("Tâche terminée", "", null, yesterday);
      task.statut = "DONE"; // On anticipe un futur statut
      // THEN
      expect(task.isOverdue()).toBe(false);
    });
  });

  test("devrait nettoyer les espaces du titre à la création", () => {
    // GIVEN
    const titreAvecEspaces = "  Mon titre avec espaces  ";
    // WHEN
    const task = new Task(titreAvecEspaces);
    // THEN
    expect(task.titre).toBe("Mon titre avec espaces");
  });
});
