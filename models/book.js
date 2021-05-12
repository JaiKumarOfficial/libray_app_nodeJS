const mongoose = require('mongoose')

const Schema = mongoose.Schema

const bookSchema = new Schema({
    title: {type: String, required: true},
    author: {type: Schema.Types.ObjectId, ref: 'Author', required: true},
    genre: [{type: Schema.Types.ObjectId, ref: 'Genre'}],
    summary: {type: String, required: true},
    isbn: {type: String, required: true},
})

// virtual property
bookSchema.virtual('url').get(function() {
    return '/catalog/book/' + this._id
})

module.exports = mongoose.model('Book', bookSchema)