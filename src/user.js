const { randomUUID } = require("crypto");
const AppError = require("./errors");

class User {
  constructor(nom, email) {
    // Validation du nom
    if (!nom || nom.trim() === "") {
      throw new AppError("Name is required", "NAME_REQUIRED");
    }
    if (nom.length > 50) {
      throw new AppError("Name cannot exceed 50 characters", "NAME_TOO_LONG");
    }

    // Validation du mail
    if (!email || email.trim() === "") {
      throw new AppError("Email is required", "EMAIL_REQUIRED");
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new AppError("Invalid email format", "EMAIL_INVALID");
    }

    this.id = randomUUID();
    this.nom = nom.trim();
    this.email = email;
    this.dateCreation = new Date();
  }
}

module.exports = User;
