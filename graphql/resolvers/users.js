const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')
const { SECRET_KEY } = require('../../config')
const { UserInputError } = require('apollo-server');
const { validateRegisterInput } = require('../../utils/validators')

function generateJwtToken(user) {
    return jwt.sign({
        id: user.id,
        email: user.email,
        username: user.username
    },
        SECRET_KEY, {
        expiresIn: '1h'
    })
}

module.exports = {
    Mutation: {
        async login(_, { username, password }) {
            const user = await User.findOne({ username });
            const errors = {}
            if (!user) {
                errors.general = "user not found";
                throw new UserInputError('user not found', { errors });
            }
            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                errors.general = "password not match";
                throw new UserInputError('password not match', { errors });
            }

            const token = generateJwtToken(user);
            return {
                ...user._doc,
                id: user._id,
                token
            }

        },
        async register(
            _,
            {
                registerInput: { username, email, password, confirmPassword }
            }
        ) {
            const { valid, errors } = validateRegisterInput(
                username,
                email,
                password,
                confirmPassword
            );
            if (!valid) {
                throw new UserInputError('Errors', { errors });
            }
            const user = await User.findOne({ username });
            if (user) {
                throw new UserInputError('Username is taken', {
                    errors: {
                        username: 'This username is taken'
                    }
                })
            }
            password = await bcrypt.hash(password, 12);
            const newUser = new User({
                email,
                username,
                password,
                createdAt: new Date().toISOString()
            })

            const res = await newUser.save();
            const token = generateJwtToken(res);
            return {
                ...res._doc,
                id: res._id,
                token
            }
        },
        // async createTodo
    }
}