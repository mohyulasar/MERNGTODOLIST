const {model, Schema} = require('mongoose');

const todoSchema = new Schema({
    username: String,
    body: String,
    isCompleted: String,
    createdAt: String,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    }
});

module.exports = model('Todo', todoSchema);
