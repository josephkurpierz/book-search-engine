const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID
    username: String
    email: String
    books: [Book]
  }

  type Book{
    _id: ID
    author: String 
    // author is probably not formated right....authors:[String]?
    description: String
    title: String

  }

  type Auth {
    token: ID!
    user: User
  }

  type Query { 
    me: User
    users: [User]
  }

  type Mutation{
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
  }
`;

module.exports = typeDefs;