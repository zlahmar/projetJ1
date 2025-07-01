const Task = require("../src/task");
const User = require("../src/user");

// US001 - Créer une tâche
describe("US001 - Créer une tâche", () => {
  // Critère : Création d'une tâche avec titre, description, statut, date, assignation (US001)
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

  // Critère : Erreur si titre vide (US001)
  test("devrait lever une erreur si le titre est vide", () => {
    expect(() => new Task("")).toThrow("Title is required");
  });

  // Critère : Création avec description valide (US001)
  test("devrait créer une tâche avec une description valide", () => {
    const titre = "Apprendre Jest";
    const description = "Faire le tutoriel officiel de Jest.";
    const tache = new Task(titre, description);
    expect(tache.titre).toBe(titre);
    expect(tache.description).toBe(description);
  });

  // Critère : Erreur si titre trop long (US001)
  test("devrait lever une erreur si le titre dépasse 100 caractères", () => {
    const longTitre = "a".repeat(101);
    expect(() => new Task(longTitre)).toThrow("Title cannot exceed 100 characters");
  });

  // Critère : Assignation via constructeur (US001)
  test("devrait assigner une tâche à un utilisateur via constructeur", () => {
    const user = new User("Bob", "bob@example.com");
    const task = new Task("Faire le café", "", user);
    expect(task.assignee).toBe(user);
    expect(task.assignee.nom).toBe("Bob");
  });

  describe("Dates d'échéance et statut de retard", () => {
    test("devrait créer une tâche avec une date d'échéance", () => {
      const dueDate = new Date("2024-12-31T23:59:59");
      const task = new Task("Finir le projet", "", null, dueDate);
      expect(task.dueDate).toEqual(dueDate);
    });

    test("devrait considérer une tâche comme non en retard si la date d'échéance est dans le futur", () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const task = new Task("Tâche future", "", null, tomorrow);
      expect(task.isOverdue()).toBe(false);
    });

    test("devrait considérer une tâche comme en retard si la date d'échéance est dans le passé (hier)", () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const task = new Task("Tâche passée", "", null, yesterday);
      expect(task.isOverdue()).toBe(true);
    });

    test("ne devrait pas considérer une tâche comme en retard si elle n'a pas de date d'échéance", () => {
      const task = new Task("Tâche sans date");
      expect(task.isOverdue()).toBe(false);
    });

    test("ne devrait pas considérer une tâche comme en retard si elle est déjà terminée", () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const task = new Task("Tâche terminée", "", null, yesterday);
      task.statut = "DONE";
      expect(task.isOverdue()).toBe(false);
    });

    test("ne devrait pas considérer une tâche comme en retard si échéance aujourd'hui", () => {
      const today = new Date();
      const task = new Task("Échéance aujourd'hui", "", null, today);
      expect(task.isOverdue()).toBe(false);
    });
  });

  test("devrait nettoyer les espaces du titre à la création", () => {
    const task = new Task("  Mon titre avec espaces  ");
    expect(task.titre).toBe("Mon titre avec espaces");
  });
});


// US014 - Définir une date d'échéance
describe("US014 - Définir une date d'échéance", () => {
  let task;
  beforeEach(() => {
    task = new Task("Tâche échéance");
  });

  // Critère : setDueDate accepte une Date valide (US014)
  test("setDueDate accepte une Date valide", () => {
    const future = new Date(Date.now() + 5_000);
    task.setDueDate(future);
    expect(task.dueDate).toEqual(future);
  });

  // Critère : Modifier une date d'échéance existante (US014)
  test("modifie une date d'échéance existante", () => {
    const d1 = new Date(Date.now() + 5_000);
    const d2 = new Date(Date.now() + 10_000);
    task.setDueDate(d1);
    task.setDueDate(d2);
    expect(task.dueDate).toEqual(d2);
  });

  // Critère : clearDueDate supprime la date d'échéance (US014)
  test("clearDueDate supprime la date d'échéance", () => {
    const d = new Date();
    task.setDueDate(d);
    task.clearDueDate();
    expect(task.dueDate).toBeNull();
  });

  // Critère : Erreur si format de date invalide (US014)
  test("erreur si format de date invalide", () => {
    expect(() => task.setDueDate("not a date")).toThrow("Invalid date format");
  });

  // Critère : Warning si échéance passée (US014)
  test("enregistre un warning dans l'historique si échéance passée", () => {
    const past = new Date();
    past.setDate(past.getDate() - 1);
    task.setDueDate(past);
    const evt = task.history.find((e) => e.type === "SET_DUE_DATE");
    expect(evt.data.warning).toBe(true);
  });
});


// US016 - Définir des priorités
describe("US016 - Définir des priorités", () => {
  let task;
  beforeEach(() => {
    task = new Task("Tâche priorité");
  });

  // Critère : Priorité par défaut (US016)
  test("priorité par défaut est NORMAL", () => {
    expect(task.priority).toBe("NORMAL");
  });

  // Critère : setPriority accepte LOW, NORMAL, HIGH, CRITICAL (US016)
  test.each(["LOW", "NORMAL", "HIGH", "CRITICAL"])(
    "setPriority accepte %s",
    (p) => {
      task.setPriority(p);
      expect(task.priority).toBe(p);
    }
  );

  // Critère : Erreur si priorité invalide (US016)
  test("erreur si priorité invalide", () => {
    expect(() => task.setPriority("WRONG")).toThrow(/Invalid priority/);
  });
});


// US017 - Catégoriser avec des tags
describe("US017 - Catégoriser avec des tags", () => {
  let task;
  beforeEach(() => {
    task = new Task("Tâche tags");
  });

  test("ajoute et supprime des tags", () => {
    task.addTags("UI", "backend");
    expect(task.tags).toEqual(["UI", "backend"]);
    task.removeTag("UI");
    expect(task.tags).toEqual(["backend"]);
  });

  test("n'ajoute pas de doublons et préserve l'ordre", () => {
    task.addTags("A", "B");
    task.addTags("B", "C");
    expect(task.tags).toEqual(["A", "B", "C"]);
  });

  test("erreur si tag vide ou trop long", () => {
    expect(() => task.addTags("", "X")).toThrow("Invalid tag validation");
    expect(() => task.addTags("A".repeat(21))).toThrow("Invalid tag validation");
  });
});


// US018 - Consulter l'historique d'une tâche
describe("US018 - Consulter l'historique d'une tâche", () => {
  let task;
  beforeEach(() => {
    task = new Task("Tâche historique");
  });

  // Critère : Enregistre l'événement CREATION (US018)
  test("enregistre l'événement CREATION", () => {
    const evt = task.history.find((e) => e.type === "CREATION");
    expect(evt).toBeDefined();
    expect(evt.data.titre).toBe("Tâche historique");
  });

  // Critère : Enregistre les mises à jour de titre et description (US018)
  test("enregistre les mises à jour de titre et description", () => {
    task.update({ titre: "Nouveau titre", description: "Desc" });
    const evTitle = task.history.find((e) => e.type === "UPDATE_TITLE");
    const evDesc = task.history.find((e) => e.type === "UPDATE_DESCRIPTION");
    expect(evTitle.data.from).toBe("Tâche historique");
    expect(evTitle.data.to).toBe("Nouveau titre");
    expect(evDesc.data.to).toBe("Desc");
  });

  // Critère : Enregistre changements de priorité, tags, dueDate (US018)
  test("enregistre les changements de priorité, tags et dueDate", () => {
    task.setPriority("HIGH");
    task.addTags("foo");
    const d = new Date();
    task.setDueDate(d);
    const types = task.history.map((e) => e.type);
    expect(types).toContain("SET_PRIORITY");
    expect(types).toContain("ADD_TAG");
    expect(types).toContain("SET_DUE_DATE");
  });
});
