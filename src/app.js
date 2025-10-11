
import express from "express";
import cors from "cors";
import { json } from "body-parser";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { typeDefs } from "./schema.js";
import { resolvers } from "./resolvers.js";

export async function createApp() {
  const app = express();
  app.use(cors());

  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();

  app.use(
    "/graphql",
    json(),
    expressMiddleware(server, { context: async () => ({}) })
  );

  app.get("/", (_req, res) => res.send("OK: GraphQL is at /graphql"));
  return app;
}
