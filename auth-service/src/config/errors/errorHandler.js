import { GraphQLError } from "graphql";
import CustomError from "../errors/CustomError.js";

export const errorHandler = (error) => {
  console.error("Global Error:", error);

  console.log("Actual Error Type:", error.name);
console.log("Error Instance Check:", error instanceof CustomError);
console.log("Error Object:", error);
  // Check if the error is an instance of CustomError
  if (error.extensions.name === "CustomError") {
    console.log('hia');
    
    return new GraphQLError(error.message, {
      extensions: {
        code: error.extensions.code || "CUSTOM_ERROR",
        http: {
          status: error.extensions.status || 400,
        },
        feedback: error.extensions.feedback || "An error occurred", 
      },
    });
  }

  return new GraphQLError("Internal Server Error", {
    extensions: {
      code: "INTERNAL_SERVER_ERROR",
      http: { status: 500 },
      feedback: "Something went wrong. Please try again later.",
    },
  });
};
