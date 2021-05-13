const async = require('async')
const BookInstance = require('../models/bookinstance')




// GET all Books Instances
const bookInstanceList = (req, res, next) => {
    
    BookInstance.find({}).populate('book').exec((err, data) => {
        if (err) return next(err);
        res.render('bookinstance_list', {data: data})
    })
}

// GET specific book instance detail
const bookInstanceDetail = (req, res, next) => {
    const id = req.params.id

    async.parallel({
        instance: function(callback) {
            BookInstance.findById(id).populate('book').exec(callback)
        },
    }, (err, result) => {
        if (err) return next(err);
        // if (result.instance == null) {
        //     return res.render('bookinstance_detail', {instance: null})
        // }
        res.render('bookinstance_detail', { instance: result.instance, book: result.instance.book })
    })
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