const { randomUUID } = require('crypto');

class User {
  constructor(nom) {
    if (!nom || nom.trim() === '') {
      throw new Error('User name is required');
    }
    this.id = randomUUID();
    this.nom = nom;
  }
}

module.exports = User; 