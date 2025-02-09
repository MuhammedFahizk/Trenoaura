
import { GraphQLError } from "graphql";
import CustomError from "./CustomError.js";

export const errorHandler = (error) => {
  console.error("Global Error:", error);

  if (error instanceof CustomError) {
    return new GraphQLError(error.message, {
      extensions: {
        code: error.statusCode,
        feedback: error.feedback || "An error occurred",
      },
    });
  }

  // Handle unexpected errors
  return new GraphQLError("Internal Server Error", {
    extensions: {
      code: 500,
      feedback: "Something went wrong. Please try again later.",
    },
  });
};
