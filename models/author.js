const mongoose = require('mongoose')
const handle_data = require('../controllers/handle_data')

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
    return '/catalog/author/' + this._id
})

authorSchema.virtual('format_dob').get(function() {
    return handle_data.formatDate(this.dateOfBirth)
})

authorSchema.virtual('format_dod').get(function() {
    return handle_data.formatDate(this.dateOfDeath)
})

authorSchema.virtual('format_dob_mmddyyyy').get(function() {
    return handle_data.formatDate_mmddyyyy(this.dateOfBirth)
})

authorSchema.virtual('format_dod_mmddyyyy').get(function() {
    return handle_data.formatDate_mmddyyyy(this.dateOfDeath)
})

module.exports = mongoose.model('Author', authorSchema)