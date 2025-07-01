class AppError extends Error {
  constructor(message, code = "GENERIC_ERROR") {
    super(message);
    this.name = "AppError";
    this.code = code;
  }
}

module.exports = AppError; 