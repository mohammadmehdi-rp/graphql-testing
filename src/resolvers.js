
export const resolvers = {
  Query: {
    hello: () => "Hello, world!",
    version: () => "1.0.0",
  },
  Mutation: {
    add: (_parent, { a, b }) => a + b,
  },
};
