import { gql } from "graphql-tag";

export const typeDefs = gql`
  type Query {
    hello: String
  }
  type authPayload {
    message: String
    accessToken: String
    refreshToken: String
  }
  type Mutation {
    registerUser(
      userName: String!
      email: String!
      password: String!
      role: String
    ): authPayload
    signInUser(email: String!, password: String!): authPayload
  }
`;
