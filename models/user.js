const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = new Schema({
    firstName: {type: String, required: true, maxLength: 50},
    lastName: {type: String, required: true, maxLength: 50},
    dateOfBirth: {type: Date, required: true},
    contact: {type: Number, required: true, maxLength: 10},
    email: {type: String, required: true},
    password: {type: String, required: true},
    role: {type: String, default: 'visiter', required: true},
    createdOn: {type: String, required: true},
})

module.exports = mongoose.model('User', userSchema)