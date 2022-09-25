const { Book, User } = require("../models");
const { AuthenticationError } = require("apollo-server-express");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    //equivalent to getSingleUser in user-controller
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id })
          .select("-__v -password")
          .populate("books");
        return userData;
      }
      throw new AuthenticationError('Not logged in"');
    },
  },
  Mutation: {
    //equivalent to async createUser in user-controller
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);
      console.log({ user }, { token });
      return { token, user };
    },
    // equivalent to login in user-controller
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError("Incorrect credentials");
      }
      const correctPW = await user.isCorrectPassword(password);
      if (!correctPW) {
        throw new AuthenticationError("Incorrect credentials");
      }
      const token = signToken(user);
      return { token, user };
    },
    //equivalent to saveBook from user-controller
    saveBook: async (parent, { bookData }, context) => {
      if (context.user) {
        const user = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $push: { savedBooks: bookData } },
          { new: true }
        );
        return user;
      }
      throw new AuthenticationError("not logged in");
    },
    removeBook: async (parent, { bookId }, context) => {
      if (context.user) {
        const user = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookID } } },
          { new: true }
        );
        return user;
      }
      throw new AuthenticationError("Not logged in");
    },
  },
};

module.export = resolvers;
