const Author = require('../models/author')

// GET all authors
const authorList = (req, res, next) => {
    Author.find({}).sort([['firstName', 'ascending']]).exec((err, data) => {
        if (err) return next(err)
        res.render('author_list', {data: data})
    })
}

// GET specific author
const author = (req, res) => {
    //const {name} = req.params
    res.send('author')
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