import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { typeDefs } from "./schema.js";
import { resolvers } from "./resolvers.js";
import express from "express";
import cors from "cors";

export async function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();

  app.use(
    "/graphql",
    expressMiddleware(server, { context: async () => ({}) })
  );

  app.get("/", (_req, res) => res.send("OK: GraphQL is at /graphql"));
  return app;
}
