const BookInstance = require('../models/bookinstance')


// GET all Books Instances
const bookInstanceList = (req, res) => {
    res.send('BookInstanceList')
}

// GET specific book instance detail
const bookInstanceDetail = (req, res) => {
    res.send('BookInstanceDetail')
}

// GET create book instance form
const createBookInstance = (req, res) => {
    res.send('CreateBookInstance')
}

// POST handle create book instance form
const handleCreateBookInstance = (req, res) => {
    res.send('handle create book inst')
}

// GET del book instance form
const delBookInstance = (req, res) => {
    res.send('del book isnt')
}

// POST handle del book instance form
const handleDelBookInstance = (req, res) => {
    res.send('handle del book isnt')
}

// GET update book instance form
const updateBookInstance = (req, res) => {
    res.send('update book isnt')
}

// POST handle update book instance form
const handleUpdateBookInstance = (req, res) => {
    res.send('handle update book isnt')
}

module.exports = {
    bookInstanceList,
    bookInstanceDetail,
    createBookInstance,
    handleCreateBookInstance,
    delBookInstance,
    handleDelBookInstance,
    updateBookInstance,
    handleUpdateBookInstance
}