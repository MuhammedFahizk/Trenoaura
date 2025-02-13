import { gql } from "graphql-tag";

export const typeDefs = gql`
  type Query {
    hello: String
    getProfile: ProfilePayload
  }
  type authPayload {
    message: String
    accessToken: String
    refreshToken: String
  }
  type ProfilePayload {
    id: ID
    username: String
    email: String
    role: String
  }

  type RefreshTokenResponse {
    accessToken: String!
  }
  type Mutation {
    registerUser(
      userName: String!
      email: String!
      password: String!
      role: String
    ): authPayload

    signInUser(email: String!, password: String!): authPayload
    refreshAccessToken(refreshToken: String!): RefreshTokenResponse!
  }
`;
