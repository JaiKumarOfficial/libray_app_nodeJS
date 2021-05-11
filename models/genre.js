const mongoose = require('mongoose')

const Schema = mongoose.Schema

const genreSchema = new Schema({
    name: {type: String, required: true, minLength: 3, maxLength: 100},
})

// virtual properties - name and url
genreSchema.virtual('url').get(function() {
    return '/catagory/genre/' + this._id
})

module.exports = mongoose.model('Genre', genreSchema)