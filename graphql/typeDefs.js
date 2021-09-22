const { gql } = require('apollo-server');

module.exports = gql`
type Todo {
  id: ID!
  body: String!
  createdAt: String!
  username: String!
  isCompleted: String!
}
type User{
    id: ID!
    email: String!
    token: String!
    username: String!
    createdAt: String!

}
input InputTodo {
  body: String!
  isCompleted: String!
}
input UpdateTodoInput {
  id: ID!
  body: String!
  createdAt: String!
  username: String!
  isCompleted: String!
}
input RegisterInput{
    username: String!
    password: String!
    confirmPassword: String!
    email: String!
}
input LoginInput{
    username: String!
    password: String!
}
type Query {
  getTodoList: [Todo]
  getTodo(todoId: ID!): Todo
}
type Mutation{
    register(registerInput: RegisterInput): User!
    login(username: String!, password: String!): User!
    createTodo(body:String!): Todo!
    deleteTodo(todoId: ID!): String!
    updateTodo(updateTodoInput: UpdateTodoInput!): Todo!
}
`;