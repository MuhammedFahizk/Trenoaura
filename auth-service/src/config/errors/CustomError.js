import { GraphQLError } from "graphql";

class CustomError extends GraphQLError {
  constructor(message, code = "INTERNAL_SERVER_ERROR", status = 500, feedback = "Something went wrong.") {
    super(message, {
      extensions: {
        name: "CustomError",
        code,
        http: { status },
        feedback,
      },
    });

  }
}

export default CustomError;