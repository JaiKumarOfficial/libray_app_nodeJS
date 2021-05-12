const async = require('async')
const Genre = require('../models/genre')
const Book = require('../models/book')

// Display list of all Genre.
const genreList = (req, res, next) => {
    Genre.find({}).sort('name').exec((err, data) => {
        if (err) return next(err);
        res.render('genre_list', {data: data})
    })
}

// Display detail page for a specific Genre.
const genreDetail = (req, res, next) => {
    let genreId = req.params.id
    async.parallel({
        genre: function(callback) {
            Genre.findById({_id: genreId}).exec(callback)
        },
        books: function(callback) {
            Book.find({genre: genreId}).exec(callback)
        }
    },
    function (err, result) {
        if(err) return next(err)
        if(result.genre == null) {
            let err = new Error('No genre found')
            err.status = 404
            return next(err)
        }
        if(result.books == null) {
            let err = new Error('No Book found for selected genre')
            err.status = 404
            return next(err)
        }
        res.render('genre_detail', {genre: result.genre, books: result.books})
    })
}

// Display Genre create form on GET.
const createGenre = (req, res) => {
    res.send('creat genre')
}

// Handle Genre create on POST.
const handleCreateGenre = (req, res) => {
    res.send('handle create gnre')
}

// Display Genre delete form on GET.
const delGenre = (req, res) => {
    res.send('del genre')
}

// Handle Genre delete on POST.
const handleDelGenre = (req, res) => {
    res.send('handle del genre')
}

// Display Genre update form on GET.
const updategenre = (req, res) => {
    res.send('update genre')
}

// Handle Genre update on POST.
const handleUpdateGenre = (req, res) => {
    res.send('handle update genre')
}

module.exports = {
    genreList,
    genreDetail,
    createGenre,
    handleCreateGenre,
    delGenre,
    handleDelGenre,
    updategenre,
    handleUpdateGenre,
}