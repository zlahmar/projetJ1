const { randomUUID } = require('crypto');

class Task {
  constructor(titre, description = "") {
    if (!titre || titre.trim() === '') {
      throw new Error('Title is required');
    }
    if (titre.length > 100) {
      throw new Error('Title cannot exceed 100 characters');
    }

    this.id = randomUUID();
    this.titre = titre;
    this.description = description;
    this.statut = "TODO";
    this.dateCreation = new Date();
  }
}

module.exports = Task; 