module.exports.validateRegisterInput = (
    username,
    email,
    password,
    confirmPassword
) => {
    const errors = {};
    if (username.trim() === '') {
        errors.username = 'username must not be empty';
    }

    if (email.trim() === '') {
        errors.email = 'email must not be empty';
    } else {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!re.test(String(email).toLowerCase())) {
            errors.email = 'Email is not valid'
        }
    }

    if (password === '') {
        errors.password = 'password must not be empty';
    }
    else if (password !== confirmPassword) {
        errors.password = 'password must match'
    }

    return {
        errors,
        valid: Object.keys(errors).length < 1
    }
}