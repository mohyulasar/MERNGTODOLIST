const Todo = require('../../models/Todo');
const checkAuth = require('../../utils/check-auth');
const { AuthenticationError } = require('apollo-server')

module.exports = {
    Query: {
        async getTodoList() {
            try {
                let todoList = await Todo.find();
                todoList = todoList.map(todo => {
                    if (todo.isCompleted == undefined || todo.isCompleted == null || !todo.isCompleted) {
                        todo.isCompleted = false
                    }
                    return todo;
                })
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
                isCompleted: false,
                createdAt: new Date().toISOString(),
            });
            const todo = await newTodo.save();
            todo.isCompleted = false;
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
        async updateTodo(_, {
            updateTodoInput: { id, body, createdAt, username, isCompleted }
        }, context) {
            const user = checkAuth(context);
            try {
                const oldTodo = await Todo.findById(id);
                console.log(oldTodo.username, user.username)
                // if (user.username == oldTodo.username && oldTodo) {
                    // oldTodo.body = updatedTodo.body;
                    oldTodo.isCompleted = isCompleted;
                    await oldTodo.save();
                    return oldTodo;
                // }
                // else {
                //     throw new AuthenticationError('Not Allowed')
                // }
            }
            catch (err) {
                throw new Error(err);
            }
        },

    }
}