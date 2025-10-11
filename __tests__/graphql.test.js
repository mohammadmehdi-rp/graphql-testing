
import request from "supertest";
import { createApp } from "../src/app.js";

let app;
beforeAll(async () => { app = await createApp(); });

test("hello query returns greeting", async () => {
  const res = await request(app).post("/graphql").send({ query: "{ hello }" }).expect(200);
  expect(res.body.data.hello).toBe("Hello, world!");
});

test("version query returns a string", async () => {
  const res = await request(app).post("/graphql").send({ query: "{ version }" }).expect(200);
  expect(typeof res.body.data.version).toBe("string");
});

test("add mutation returns correct sum", async () => {
  const res = await request(app).post("/graphql").send({
    query: "mutation($a:Int!, $b:Int!){ add(a:$a, b:$b) }",
    variables: { a: 3, b: 4 },
  }).expect(200);
  expect(res.body.data.add).toBe(7);
});
