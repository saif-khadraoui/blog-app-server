const mongoose = require("mongoose");

const UsersSchema = mongoose.Schema({
    username: {
        type: String,
        require: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    firstName:{
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: true
    }
})

const UsersModel = mongoose.model('users', UsersSchema);

module.exports = UsersModel;