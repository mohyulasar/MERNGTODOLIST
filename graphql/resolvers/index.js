const todoResolvers = require('./todos');
const userResolvers = require('./users');

module.exports = {
    Query: {
        ...todoResolvers.Query,
    },
    Mutation: {
        ...userResolvers.Mutation,
        ...todoResolvers.Mutation
    }
}