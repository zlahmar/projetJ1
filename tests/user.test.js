const User = require("../src/user");

// US010 - Créer un utilisateur
describe("US010 - Créer un utilisateur", () => {
  // Critère : Création d'un utilisateur avec ID, nom, email, date de création (US010)
  test("devrait créer un utilisateur avec un ID, nom, email et date de création", () => {
    const nom = "Alice";
    const email = "alice@example.com";

    const user = new User(nom, email);

    expect(user.id).toBeDefined();
    expect(user.nom).toBe(nom);
    expect(user.email).toBe(email);
    expect(user.dateCreation).toBeInstanceOf(Date);
  });

  // Critère : Erreur si nom vide (US010)
  test("devrait lever une erreur \"Name is required\" si le nom est vide", () => {
    expect(() => new User(" ", "bob@example.com")).toThrow("Name is required");
  });

  // Critère : Erreur si nom trop long (US010)
  test("devrait lever une erreur \"Name cannot exceed 50 characters\" si le nom est trop long", () => {
    const longName = "a".repeat(51);
    expect(() => new User(longName, "bob@example.com")).toThrow(
      "Name cannot exceed 50 characters"
    );
  });

  // Critère : Erreur si email invalide (US010)
  test("devrait lever une erreur \"Invalid email format\" pour un email invalide", () => {
    expect(() => new User("Charlie", "invalid-email")).toThrow(
      "Invalid email format"
    );
  });

  // Critère : Erreur si email vide (US010)
  test("devrait lever une erreur \"Email is required\" si l'email est vide", () => {
    expect(() => new User("Diana", "")).toThrow("Email is required");
  });
});
