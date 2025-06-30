const Task = require('../src/task');

describe('US001 - Créer une tâche', () => {
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
    
    const diffInSeconds = (new Date() - tache.dateCreation) / 1000;
    expect(diffInSeconds).toBeLessThan(2);
  });

  test('devrait lever une erreur si le titre est vide', () => {
    // GIVEN
    const titreVide = "";

    // WHEN & THEN
    expect(() => new Task(titreVide)).toThrow('Title is required');
  });

  test('devrait créer une tâche avec une description valide', () => {
    // GIVEN
    const titre = "Apprendre Jest";
    const description = "Faire le tutoriel officiel de Jest.";

    // WHEN
    const tache = new Task(titre, description);

    // THEN
    expect(tache.titre).toBe(titre);
    expect(tache.description).toBe(description);
  });

  test('devrait lever une erreur si le titre dépasse 100 caractères', () => {
    // GIVEN
    const titreTropLong = 'a'.repeat(101);

    // WHEN & THEN
    expect(() => new Task(titreTropLong)).toThrow('Title cannot exceed 100 characters');
  });
}); 