const User = require('../src/user');

describe('User - Gestion des utilisateurs', () => {
  test('devrait créer un utilisateur avec un ID unique et un nom', () => {
    // GIVEN
    const nom = 'Alice';

    // WHEN
    const user = new User(nom);

    // THEN
    expect(user.id).toBeDefined();
    expect(user.nom).toBe(nom);
  });

  test('devrait lever une erreur si le nom est vide', () => {
    // GIVEN
    const nomVide = '';

    // WHEN & THEN
    expect(() => new User(nomVide)).toThrow('User name is required');
  });
}); 