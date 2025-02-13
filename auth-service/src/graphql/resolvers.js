
import { registerUser, signInUser } from "../controllers/userController.js";
import { authenticate } from "../middleware/authenticate.js";

export const resolvers = {
  Query: {
    hello: () => "Hello, GraphQL!",

    getProfile: authenticate(async (_, __, context) => {
      console.log("🔍 User in getProfile:", context);

      return {
        id: context.user.id,
        //   name: context.user.name,
        //   email: context.user.email,
      };
    }),
  },

  Mutation: {
    registerUser: async (_, args) => registerUser(args),
    signInUser: async (_, args) => signInUser(args),
  },
};
