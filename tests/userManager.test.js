const UserManager = require('../src/userManager');
const User = require('../src/user');

describe('UserManager', () => {
  let userManager;

  beforeEach(() => {
    userManager = new UserManager();
  });

  test('devrait ajouter un nouvel utilisateur', () => {
    // WHEN
    const user = userManager.addUser('Alice', 'alice@example.com');

    // THEN
    expect(user).toBeInstanceOf(User);
    expect(userManager.getUserById(user.id)).toEqual(user);
  });

  test('devrait lever une erreur "Email already in use" si l\'email est déjà utilisé', () => {
    // GIVEN
    userManager.addUser('Alice', 'alice@example.com');

    // WHEN & THEN
    expect(() => userManager.addUser('Alicia', 'alice@example.com')).toThrow(
      'Email already in use',
    );
  });

  test('devrait retourner null si aucun utilisateur n\'est trouvé par ID', () => {
    // WHEN
    const user = userManager.getUserById('id-non-existant');

    // THEN
    expect(user).toBeNull();
  });

  describe('US011 - Lister les utilisateurs', () => {
    beforeEach(() => {
      // GIVEN
      userManager.addUser('Charlie', 'charlie@example.com'); // Will be sorted 2nd
      userManager.addUser('Alice', 'alice@example.com');   // Will be sorted 1st
      userManager.addUser('Bob', 'bob@example.com');       // Will be sorted 3rd
    });

    test('devrait retourner une liste vide si aucun utilisateur n\'existe', () => {
      // GIVEN
      userManager = new UserManager();

      // WHEN
      const result = userManager.listUsers();

      // THEN
      expect(result.data).toEqual([]);
      expect(result.pagination.totalItems).toBe(0);
    });

    test('devrait retourner tous les utilisateurs triés par nom par défaut', () => {
      // WHEN
      const result = userManager.listUsers();

      // THEN
      expect(result.data.length).toBe(3);
      expect(result.data[0].nom).toBe('Alice');
      expect(result.data[1].nom).toBe('Bob');
      expect(result.data[2].nom).toBe('Charlie');
    });

    test('devrait retourner une liste paginée d\'utilisateurs', () => {
      // WHEN
      const result = userManager.listUsers({ page: 1, limit: 2 });

      // THEN
      expect(result.data.length).toBe(2);
      expect(result.data[0].nom).toBe('Alice');
      expect(result.data[1].nom).toBe('Bob');
      expect(result.pagination.currentPage).toBe(1);
      expect(result.pagination.totalPages).toBe(2);
      expect(result.pagination.totalItems).toBe(3);
    });

    test('devrait retourner la deuxième page de la liste paginée', () => {
      // WHEN
      const result = userManager.listUsers({ page: 2, limit: 2 });

      // THEN
      expect(result.data.length).toBe(1);
      expect(result.data[0].nom).toBe('Charlie');
      expect(result.pagination.currentPage).toBe(2);
    });
  });
}); 