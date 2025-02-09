import { ApolloServer, } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import {typeDefs} from "./typeDefs.js";
import {resolvers} from "./resolvers.js";
import { errorHandler } from "../config/errors/errorHandler.js";

const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: errorHandler, 
});

export default server;
