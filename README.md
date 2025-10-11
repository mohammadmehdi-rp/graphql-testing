
# GraphQL Testing (Dockerized, with Jest)

A tiny, **production-like** GraphQL service with **thorough tests** and **Dockerization**.

# Pull The Image, Build And Run
- docker pull rajabpourshirazy/graphql-testing:graphql-testing
- docker run --rm -p 4000:4000 <dockerhub-username>/graphql-testing:1.0.0

## What you get
- **GraphQL API** with one query and one mutation
- **Integration tests** (Jest + Supertest)
- **Dockerfile** and **docker-compose.yml**
- **Step-by-step commands** to run and test locally and in Docker

## Project Structure
```
.
├── Dockerfile
├── docker-compose.yml
├── .dockerignore
├── postman
├── package.json
├── README.md  
├── src
│   ├── app.js         ← builds the Express + Apollo app 
│   ├── resolvers.js   ← business logic
│   ├── schema.js      ← GraphQL schema
│   └── server.js      ← starts the HTTP server 
└── __tests__
    └── graphql.test.js
```

## Quickstart (with Docker)

```bash
# 1) Build the image
docker build -t graphql-testing .

# 2) Run the server on port 4000
docker run --rm -p 4000:4000 graphql-testing

# 3) Query it 
Use postman and import two files into postman

# Expected JSON:
# { "data": { "hello": "Hello, world!" } }

# 4) Run the tests inside Docker (no local Node needed)
docker run --rm graphql-testing npm test
```

## GraphQL: example queries & mutations

**Query**
```graphql
{
  hello
  version
}
```
**Response**
```json
{
  "data": { "hello": "Hello, world!", "version": "1.0.0" }
}
```

**Mutation (with variables)**
```graphql
mutation($a: Int!, $b: Int!) {
  add(a: $a, b: $b)
}
```
**Variables**
```json
{ "a": 3, "b": 4 }
```
**Response**
```json
{ "data": { "add": 7 } }
```

## Notes
- The app is created in **`src/app.js`** so tests can import an **in-memory Express app** without binding a port.
- The **GraphQL schema** is tiny but complete: a Query and a Mutation.
- **Integration tests** hit the real `/graphql` endpoint (via Supertest), which is the closest to how clients will use the service.
- The Docker image intentionally includes dev dependencies so the same image can run tests. In a real prod build you might use multi-stage builds.

## Files

### `package.json`
(Already in the repository root.)

> **Why `--experimental-vm-modules`?** Apollo Server v4 is ESM-only. This flag ensures Jest can run ESM smoothly across Node versions. With newer Jest/Node it may not be required, but it’s the most portable for a course.

## Verification checklist 
- [ ] `docker build` succeeds without warnings
- [ ] `docker run -p 4000:4000` serves `OK` at `/` and GraphQL at `/graphql`
- [ ] `curl` example returns expected JSON
- [ ] `docker run … npm test` passes all tests
- [ ] Changing the resolver (e.g., `version`) reflects in responses and tests

## Troubleshooting
- **Port already in use**: change `PORT` env var, e.g. `docker run -e PORT=5000 -p 5000:5000 graphql-testing`.
- **Jest + ESM quirks**: the `--experimental-vm-modules` flag in `npm test` handles most environments. If you still see ESM errors, ensure Node >= 20.

## Assignment
Add a **`ping`** field that always returns **`"pong"`**, plus one integration test. This verifies schema editing, resolver wiring, and test workflow.

### Files to edit
- `src/schema.js`
- `src/resolvers.js`
- `__tests__/graphql.test.js`

### Steps

**Update the schema** (`src/schema.js`)
```diff
 export const typeDefs = /* GraphQL */ `
   type Query {
     hello: String!
     version: String!
+    ping: String!
   }

   type Mutation {
     add(a: Int!, b: Int!): Int!
   }
 ```

**Add the resolver (src/resolvers.js)**
```diff
 export const resolvers = {
   Query: {
     hello: () => "Hello, world!",
     version: () => "1.0.0",
+    ping: () => "pong",
   },
   Mutation: {
     add: (_parent, { a, b }) => a + b,
   },
 };
```

**Add one test (__tests__/graphql.test.js)**
```diff
test("ping returns pong", async () => {
  const res = await request(app)
    .post("/graphql")
    .send({ query: "{ ping }" })
    .expect(200);

  expect(res.body.data.ping).toBe("pong");
});
```
**Run & verify**
```diff
docker build -t graphql-testing .
docker run --rm -p 4000:4000 graphql-testing

# New query
curl -X POST http://localhost:4000/graphql \
  -H 'Content-Type: application/json' \
  -d '{"query":"{ ping }"}'
# Expected: { "data": { "ping": "pong" } }

# Tests
docker run --rm graphql-testing npm test
```
