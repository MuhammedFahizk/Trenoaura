import { startStandaloneServer } from "@apollo/server/standalone";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import server from "./graphql/index.js";
import { authContext } from "./graphql/context.js";

dotenv.config();
connectDB();

const startServer = async () => {
  const { url } = await startStandaloneServer(server, {
    listen: { port: process.env.PORT },
    context: async ({ req }) => {
        return authContext({ req });
      },
  });

  console.log(`🚀 Server ready at ${url}`);
};

startServer();
