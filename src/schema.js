
export const typeDefs = /* GraphQL */ `
  type Query {
    hello: String!
    version: String!
  }
  type Mutation {
    add(a: Int!, b: Int!): Int!
  }
`;
