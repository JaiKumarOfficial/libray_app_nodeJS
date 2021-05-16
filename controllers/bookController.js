const Book = require('../models/book');
const Author = require('../models/author')
const Genre = require('../models/genre')
const BookInstance = require('../models/bookinstance')
const async = require('async');
const {body, validationResult} = require('express-validator')


exports.index = function(req, res) {
    async.parallel({
        // async parallel fn on getting all count values for home page
        book_count(callback) {
            Book.countDocuments({}, callback)
        },
        author_count(callback) {
            Author.countDocuments({}, callback)
        },
        genre_count(callback) {
            Genre.countDocuments({}, callback)
        },
        book_instance_count(callback) {
            BookInstance.countDocuments({}, callback)
        },
        book_instance_available_count(callback) {
            BookInstance.countDocuments({
                status: 'Available'
            }, callback)
        }
    }, (err, result) => {
        if(err) console.log(err)
        res.render('index', {title: 'ELDER LIBRARY', error: err, data: result})
    })
};

// Display list of all books.
exports.book_list = function(req, res, next) {
    
    let bookList = async () =>{
        try {
            let data = await Book.find({}).populate('author').select('title author').exec()
            res.render('book_list', {title: 'All Books', data: data})
        }
        catch(err) {
            next(err)
        }
    }
    bookList();
};

// Display detail page for a specific book.
exports.book_detail = function(req, res, next) {
    let id = req.params.id;
    async.parallel({
        book: function(callback) {
            Book.findById(id).populate('author genre').exec(callback)
        },
        instances: function(callback) {
            BookInstance.find({book: id}).exec(callback)
        }
    },
        (err, result) => {
            if(err) return next(err)
            if(result.book == null) {
                let error = new Error('no book found')
                return next(error)
            }
            res.render('book_detail', {title: 'Book', book: result.book, instances: result.instances, copies: req.query.copies})
        }
    )
};

// Display book create form on GET.
exports.book_create_get = function(req, res, next) {
    async.parallel({
        genres: function(callback) {
            Genre.find().sort({name: 1}).exec(callback)
        },
        authors: function(callback) {
            Author.find().sort({lastName: 1}).exec(callback)
        }
    }, (err, result) => {
        if (err) return next(err)
        if (result.authors == null) {
            let error = new Error('No authors found')
            next(error)
        }
        if (result.genres == null) {
            return res.render('book_form', {title: 'Creat Book', authors: result.authors})
        }
        res.render('book_form', {title: 'Creat Book', authors: result.authors, genres: result.genres});
    })
};

// Handle book create on POST.
exports.book_create_post = [
    body('title', 'Title is required').trim().isLength({min: 1}).escape(),
    body('summary', 'Summary is required').trim().isLength({min: 1}).escape(),
    body('author', 'Author is required').trim().isLength({min: 1}).escape(),
    body('isbn', 'ISBN is required').trim().isNumeric().withMessage('ISBN is numeric only').isLength({min: 1}).escape(),
    body('genre.*').escape(),

    function(req, res, next) {
        console.log(req.body)
        const errors = validationResult(req)
        let {title, summary, author, isbn, genre} = req.body
        const book = new Book({
            title,
            summary,
            author,
            isbn,
            genre,
        })
        console.log(book)
        if(!errors.isEmpty()) {
            return async.parallel({
                genres: function(callback) {
                    Genre.find().sort({name: 1}).exec(callback)
                },
                authors: function(callback) {
                    Author.find().sort({name: 1}).exec(callback)
                }
            }, (err, result) => {
                if (err) return next(err)
                if (result.authors == null) {
                    let error = new Error('No authors found')
                    next(error)
                }
                if (result.genres == null) {
                    return res.render('book_form', {title: 'Creat Book', authors: result.authors, book: book, errors: errors.array()})
                }

                return res.render('book_form', {title: 'Creat Book', authors: result.authors, genres: result.genres, book: book, errors: errors.array()});
            })
        }
        Book.findOne({isbn: isbn}).exec((err, result) => {
            if(err) return next(err)
            if(result) {
                return res.redirect(result.url)
            }
            book.save((err, result) => {
                if(err) return next(err)
                res.redirect(result.url)
            })
        })
        
    }
]

// Display book delete form on GET.
exports.book_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Book delete GET');
};

// Handle book delete on POST.
exports.book_delete_post = function(req, res, next) {
    const id = req.params.id
    BookInstance.findOne({book: id}).exec((err, result) => {
        if(err) return next(err);
        if(result != null) {
            return res.redirect('/catalog/book/'+id+'?copies=true')
        }
        Book.findByIdAndDelete(id).exec(err => {
            if(err) return next(err)
            res.redirect('/catalog/books')
        })
    })
};

// Display book update form on GET.
exports.book_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Book update GET');
};

// Handle book update on POST.
exports.book_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Book update POST');
};