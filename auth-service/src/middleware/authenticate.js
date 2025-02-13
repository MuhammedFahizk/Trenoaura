import AuthError from "../config/errors/AuthError.js";

export const authenticate = (resolver) => {
    return (parent, args, context, info) => {
      if (!context.user) {
        throw new AuthError("Authentication required", "You must be logged in to perform this action.");
      }
      return resolver(parent, args, context, info);
    };
  };