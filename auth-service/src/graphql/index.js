import { ApolloServer } from "@apollo/server";
import { typeDefs } from "./typeDefs.js";
import { resolvers } from "./resolvers.js";
import { errorHandler } from "../config/errors/errorHandler.js";

const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: (error) => errorHandler(error),
  introspection: true,
});

export default server;
