const { randomUUID } = require("crypto");

class User {
  constructor(nom, email) {
    // Validation du nom
    if (!nom || nom.trim() === "") {
      throw new Error("Name is required");
    }
    if (nom.length > 50) {
      throw new Error("Name cannot exceed 50 characters");
    }

    // Validation de l'email
    if (!email || email.trim() === "") {
      throw new Error("Email is required");
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Invalid email format");
    }

    this.id = randomUUID();
    this.nom = nom.trim();
    this.email = email;
    this.dateCreation = new Date();
  }
}

module.exports = User;
