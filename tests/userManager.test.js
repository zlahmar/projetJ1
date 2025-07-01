const UserManager = require('../src/userManager');
const User = require('../src/user');

describe('UserManager', () => {
  let userManager;

  beforeEach(() => {
    userManager = new UserManager();
  });

  test('devrait ajouter un nouvel utilisateur', () => {
    // Critère : Ajout d'un utilisateur (US010)
    const user = userManager.addUser('Alice', 'alice@example.com');

    expect(user).toBeInstanceOf(User);
    expect(userManager.getUserById(user.id)).toEqual(user);
  });

  test('devrait lever une erreur "Email already in use" si l\'email est déjà utilisé', () => {
    // Critère : Erreur si email déjà utilisé (US010)
    userManager.addUser('Alice', 'alice@example.com');

    expect(() => userManager.addUser('Alicia', 'alice@example.com')).toThrow(
      'Email already in use',
    );
  });

      // Critère : Retourne null si utilisateur non trouvé (US010)
  test('devrait retourner null si aucun utilisateur n\'est trouvé par ID', () => {
    const user = userManager.getUserById('id-non-existant');

    expect(user).toBeNull();
  });

  // US011 - Lister les utilisateurs
  describe('US011 - Lister les utilisateurs', () => {
    beforeEach(() => {
      userManager.addUser('Charlie', 'charlie@example.com');
      userManager.addUser('Alice', 'alice@example.com');
      userManager.addUser('Bob', 'bob@example.com');
    });

          // Critère : Liste vide si aucun utilisateur (US011)
    test('devrait retourner une liste vide si aucun utilisateur n\'existe', () => {
      userManager = new UserManager();

      const result = userManager.listUsers();

      expect(result.data).toEqual([]);
      expect(result.pagination.totalItems).toBe(0);
    });

          // Critère : Tri par nom par défaut (US011)
    test('devrait retourner tous les utilisateurs triés par nom par défaut', () => {
      const result = userManager.listUsers();

      expect(result.data.length).toBe(3);
      expect(result.data[0].nom).toBe('Alice');
      expect(result.data[1].nom).toBe('Bob');
      expect(result.data[2].nom).toBe('Charlie');
    });

          // Critère : Pagination des utilisateurs (US011)
    test('devrait retourner une liste paginée d\'utilisateurs', () => {
      const result = userManager.listUsers({ page: 1, limit: 2 });

      expect(result.data.length).toBe(2);
      expect(result.data[0].nom).toBe('Alice');
      expect(result.data[1].nom).toBe('Bob');
      expect(result.pagination.currentPage).toBe(1);
      expect(result.pagination.totalPages).toBe(2);
      expect(result.pagination.totalItems).toBe(3);
    });

          // Critère : Pagination, accès à la 2eme page (US011)
    test('devrait retourner la deuxième page de la liste paginée', () => {
      const result = userManager.listUsers({ page: 2, limit: 2 });

      expect(result.data.length).toBe(1);
      expect(result.data[0].nom).toBe('Charlie');
      expect(result.pagination.currentPage).toBe(2);
    });
  });
}); 