const Author = require('../models/author')
const Book = require('../models/book')
const async = require('async')

// GET all authors
const authorList = (req, res, next) => {
    Author.find({}).sort([['firstName', 'ascending']]).exec((err, data) => {
        if (err) return next(err)
        res.render('author_list', {data: data})
    })
}

// GET specific author
const author = (req, res, next) => {
    const id = req.params.id

    async.parallel({
        author: function(callback) {
            Author.findById(id).exec(callback)
        },
        books: function(callback) {
            Book.find({author: id}).exec(callback)
        },
    },
        (err, result) => {
            if (err) return next(err);
            if (result.author == null) {
                let error = new Error('No author found')
                error.status = 404
                return next(error)
            }
            res.render('author_detail', {author: result.author, books: result.books})
        }
    )
}

//display author create form
const createAuthor = (req, res) => {
    res.send('author form')
}

//handle author create POST
const handleCreateAuthor = (req, res) => {
    res.send('author form post')
}

// del author form GET
const delAuthor = (req, res) => {
    res.send('author del form')
}

// handle del author form POST
const handleDelAuthor = (req, res) => {
    res.send('del author form post')
}

// update author form GET
const updateAuthor = (req, res) => {
    res.send('update author form get')
}

// handle POST update author form
const handleUpdateAuthor = (req, res) => {
    res.send('update author form post')
}

module.exports = {
    authorList,
    author,
    createAuthor,
    handleCreateAuthor,
    delAuthor,
    handleDelAuthor,
    updateAuthor,
    handleUpdateAuthor,
}