
import { getProfile, refreshAccessToken, registerUser, signInUser } from "../controllers/userController.js";
import { authenticate } from "../middleware/authenticate.js";

export const resolvers = {
  Query: {
    hello: () => "Hello, GraphQL!",

    getProfile: authenticate(async (_, __, context) => {
        return getProfile(context.user);
      }),
  },

  Mutation: {
    registerUser: async (_, args) => registerUser(args),
    signInUser: async (_, args) => signInUser(args),
    refreshAccessToken: async (_, { refreshToken }) => refreshAccessToken(refreshToken),
  },
};
