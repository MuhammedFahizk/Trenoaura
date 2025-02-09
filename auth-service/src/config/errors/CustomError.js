// src/utils/customError.js

class CustomError extends Error {
  constructor(message, statusCode = 500, feedback = "") {
    super(message);
    this.name = "CustomError";
    this.statusCode = statusCode;
    this.feedback = feedback || message;
  }

  toJSON() {
    return {
      error: this.name,
      message: this.message,
      statusCode: this.statusCode,
      feedback: this.feedback,
    };
  }
}

export default CustomError;
