
# GraphQL Testing (Dockerized, with Jest)

A tiny, **production-like** GraphQL service with **thorough tests** and **Dockerization**. Perfect for a Software Design course: minimal moving parts, crystal-clear structure, and exact procedures.

---

## What you get
- **GraphQL API** with one query and one mutation
- **Integration tests** (Jest + Supertest)
- **Dockerfile** and **docker-compose.yml**
- **Step-by-step commands** to run and test locally and in Docker
- Lots of comments for teaching

---

## Project Structure
```
.
├── Dockerfile
├── docker-compose.yml
├── .dockerignore
├── package.json
├── README.md  ← (this file)
├── src
│   ├── app.js         ← builds the Express + Apollo app (no network bind)
│   ├── resolvers.js   ← business logic
│   ├── schema.js      ← GraphQL schema (SDL)
│   └── server.js      ← starts the HTTP server (binds PORT)
└── __tests__
    └── graphql.test.js
```

---

## Prerequisites (only if running locally without Docker)
- Node.js **>= 20**
- npm **>= 9**

> If you use Docker, you don’t need Node installed locally.

---

## Quickstart (with Docker)

```bash
# 1) Build the image
docker build -t graphql-testing .

# 2) Run the server on port 4000
docker run --rm -p 4000:4000 graphql-testing

# 3) Query it (in a second terminal)
curl -X POST http://localhost:4000/graphql   -H 'Content-Type: application/json'   -d '{"query":"{ hello }"}'

# Expected JSON:
# { "data": { "hello": "Hello, world!" } }

# 4) Run the tests inside Docker (no local Node needed)
docker run --rm graphql-testing npm test
```

### Using docker-compose (optional, same behavior)
```bash
# Start the app
docker compose up --build app
# Run tests (separate service)
docker compose run --rm test
```

---

## Quickstart (locally, without Docker)
```bash
# 1) Install dependencies
npm ci

# 2) Start the server on port 4000
npm start

# 3) Run tests
npm test

# 4) Try a query
curl -X POST http://localhost:4000/graphql   -H 'Content-Type: application/json'   -d '{"query":"{ hello }"}'
```

---

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

---

## Teaching Notes
- The app is created in **`src/app.js`** so tests can import an **in-memory Express app** without binding a port.
- The **GraphQL schema** is tiny but complete: a Query and a Mutation.
- **Integration tests** hit the real `/graphql` endpoint (via Supertest), which is the closest to how clients will use the service.
- The Docker image intentionally includes dev dependencies so the same image can run tests. In a real prod build you might use multi-stage builds.

---

## Files

### `package.json`
(Already in the repository root.)

> **Why `--experimental-vm-modules`?** Apollo Server v4 is ESM-only. This flag ensures Jest can run ESM smoothly across Node versions. With newer Jest/Node it may not be required, but it’s the most portable for a course.

---

## Verification checklist (for graders)
- [ ] `docker build` succeeds without warnings
- [ ] `docker run -p 4000:4000` serves `OK` at `/` and GraphQL at `/graphql`
- [ ] `curl` example returns expected JSON
- [ ] `docker run … npm test` passes all tests
- [ ] Changing the resolver (e.g., `version`) reflects in responses and tests

---

## Troubleshooting
- **Port already in use**: change `PORT` env var, e.g. `docker run -e PORT=5000 -p 5000:5000 graphql-testing`.
- **Jest + ESM quirks**: the `--experimental-vm-modules` flag in `npm test` handles most environments. If you still see ESM errors, ensure Node >= 20.
- **Windows path issues**: prefer Docker or WSL2 for a uniform environment.

---

## Extension ideas (assignments)
- Add a `Book` type with `id`, `title`, `author` and implement `books` query
- Validate inputs in `add` (e.g., forbid negatives) and write a failing test first (TDD)
- Add GitHub Actions CI to run `npm test` on pull requests
- Mount a volume in `docker-compose` for hot reloading with `npm run dev`
