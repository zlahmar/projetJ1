const User = require("../src/user");

describe("US010 - Créer un utilisateur", () => {
  test("devrait créer un utilisateur avec un ID, nom, email et date de création", () => {
    // GIVEN
    const nom = "Alice";
    const email = "alice@example.com";

    // WHEN
    const user = new User(nom, email);

    // THEN
    expect(user.id).toBeDefined();
    expect(user.nom).toBe(nom);
    expect(user.email).toBe(email);
    expect(user.dateCreation).toBeInstanceOf(Date);
  });

  test("devrait lever une erreur \"Name is required\" si le nom est vide", () => {
    expect(() => new User(" ", "bob@example.com")).toThrow("Name is required");
  });

  test("devrait lever une erreur \"Name cannot exceed 50 characters\" si le nom est trop long", () => {
    const longName = "a".repeat(51);
    expect(() => new User(longName, "bob@example.com")).toThrow(
      "Name cannot exceed 50 characters"
    );
  });

  test("devrait lever une erreur \"Invalid email format\" pour un email invalide", () => {
    expect(() => new User("Charlie", "invalid-email")).toThrow(
      "Invalid email format"
    );
  });

  test("devrait lever une erreur \"Email is required\" si l'email est vide", () => {
    expect(() => new User("Diana", "")).toThrow("Email is required");
  });
});
