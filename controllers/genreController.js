const async = require('async')
const Genre = require('../models/genre')
const Book = require('../models/book')
const { body, validationResult } = require('express-validator')

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
    res.render('genre_form', {title: 'Create Genre'})
}

// Handle Genre create on POST.
const handleCreateGenre = [
    // running two middleware functions
    // first is validation and sanitization of user input
    // second is handle valid input data

    // validation and sanitization 
    body('name', 'Genre name is required').trim().isLength({min: 1}).escape(),
    
    // handle checked user input
    (req, res, next) => {
        const result = validationResult(req)
        if(!result.isEmpty()) {
            return res.render('genre_form', {title: 'Create Genre', errors: result.errors})
        }

        // check if genre already exists
        Genre.findOne({name: {$regex: req.body.name, $options: 'i'}}).exec((err, result) => {
            if (err) return next(err)
            if (result) {
                let errors = [
                    {msg: 'Genre already exists'}
                ]
                return res.render('genre_form', {title: 'Create Genre', errors: errors})
            }
            const genre = new Genre({name: req.body.name})
            genre.save((err, result) => {
                if (err) return next(err)
                res.redirect(result.url, 201)
            })
        })
        
    }
]

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