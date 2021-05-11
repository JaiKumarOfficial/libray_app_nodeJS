const mongoose = require('mongoose')

const Schema = mongoose.Schema

const authorSchema = new Schema({
    firstName: {type: String, required: true, maxLength: 50},
    lastName: {type: String, required: true, maxLength: 50},
    dateOfBirth: {type: Date},
    dateOfDeath: {type: Date},
})

// virtual properties - name and url
authorSchema.virtual('name').get(function() {
    return this.lastName + ", " + this.firstName
})

authorSchema.virtual('url').get(function() {
    return '/catagory/author/' + this._id
})

module.exports = mongoose.model('Author', authorSchema)