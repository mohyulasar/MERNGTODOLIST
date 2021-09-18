const Todo = require('../../models/Todo');
const checkAuth = require('../../utils/check-auth');
const { AuthenticationError } = require('apollo-server')

module.exports = {
    Query: {
        async getTodoList() {
            try {
                const todoList = await Todo.find();
                return todoList;
            }
            catch (err) {
                throw new Error(err)
            }
        },
        async getTodo(_, { todoId }) {
            try {
                const todo = await Todo.findById(todoId);
                if (todo) {
                    return todo;
                }
                else {
                    throw new Error("Todo not found")
                }
            }
            catch (err) {
                throw new Error(err)
            }
        }
    },
    Mutation: {
        async createTodo(_, { body }, context) {
            const user = checkAuth(context);
            const newTodo = new Todo({
                body,
                user: user.id,
                username: user.username,
                isCompleted: user.isCompleted,
                createdAt: new Date().toISOString(),
            });
            const todo = await newTodo.save();
            return todo;

        },
        async deleteTodo(_, { todoId }, context) {
            const user = checkAuth(context);

            try {
                const todo = await Todo.findById(todoId);
                if (user.username == todo.username) {
                    await todo.deleteTodo();
                    return 'Todo is deleted';
                }
                else {
                    throw new AuthenticationError('Not Allowed')
                }
            }
            catch (err) {
                throw new Error(err);
            }
        },
        async updateTodo(_, { todoId, updatedTodo }, context) {
            const user = checkAuth(context);

            try {
                const oldTodo = await Todo.findById(todoId);
                if (user.username == oldTodo.username && oldTodo ) {
                    oldTodo.body = updatedTodo.body;
                    oldTodo.isCompleted= updatedTodo.isCompleted;
                    await oldTodo.save();
                    return oldTodo;
                }
                else {
                    throw new AuthenticationError('Not Allowed')
                }
            }
            catch (err) {
                throw new Error(err);
            }
        },

    }
}