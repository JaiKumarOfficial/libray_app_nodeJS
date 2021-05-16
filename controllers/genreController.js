const async = require('async')
const Genre = require('../models/genre')
const Book = require('../models/book')
const { body, validationResult } = require('express-validator')

// Display list of all Genre.
const genreList = (req, res, next) => {
    Genre.find({}).sort('name').exec((err, data) => {
        if (err) return next(err);
        res.render('genre_list', {title: 'All Genres', data: data})
    })
}

// Display detail page for a specific Genre.
const genreDetail = (req, res, next) => {
    let genreId = req.params.id
    const queryError = req.query.books
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
        res.render('genre_detail', {title: 'Genre', genre: result.genre, books: result.books, queryError})
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
        })
        const genre = new Genre({name: req.body.name})
        const saveGenre = async () => {
            try {
                let result = await genre.save()
                res.redirect(result.url)
            }
            catch(err) {
                if (err) return next(err)
            }
        }
        saveGenre();
    }
]

// Display Genre delete form on GET.
const delGenre = (req, res) => {
    res.send('del genre')
}

// Handle Genre delete on POST.
const handleDelGenre = (req, res, next) => {
    const id = req.params.id
    
    Book.findOne({genre: id}).exec((err, result) => {
        if(err) return next(err)
        if (result != null) {
            return res.redirect('/catalog/genre/' + id + '?books=true')
        }
        (async () => {
            try {
                let result = await Genre.findByIdAndDelete(id).exec()
                res.redirect('/catalog/genres')
            }
            catch(err){
                return next(err)
            }
        })();
    })
    //res.send('handle del genre')
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