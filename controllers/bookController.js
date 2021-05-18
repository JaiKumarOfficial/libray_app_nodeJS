const Book = require('../models/book');
const Author = require('../models/author')
const Genre = require('../models/genre')
const BookInstance = require('../models/bookinstance')
const async = require('async');
const {body, validationResult} = require('express-validator');
const { Error } = require('mongoose');
const book = require('../models/book');


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
            return res.render('book_form', {title: 'Create Book', authors: result.authors})
        }
        res.render('book_form', {title: 'Create Book', authors: result.authors, genres: result.genres});
    })
};

// Handle book create on POST.
exports.book_create_post = [
    body('title', 'Title is required').trim().isLength({min: 1}).escape(),
    body('summary', 'Summary is required').trim().isLength({min: 1}).escape(),
    body('author', 'Author is required').trim().isLength({min: 1}).escape(),
    body('isbn', 'ISBN is required').trim().isLength({min: 1}).escape(),
    body('isbn').if(body('isbn').notEmpty()).isNumeric().withMessage('ISBN is numeric only'),
    body('genre.*').escape(),
    body('genre', 'Genre is required').exists(),
    body('isbn').custom(isbn => {
        return Book.findOne({isbn: isbn}).then(res => {
            if(res != null) {
                return Promise.reject('ISBN already exists')
            }
        })
    }),

    function(req, res, next) {
        if(req.db_error) return next(req.db_error)
        const errors = validationResult(req)
        let {title, summary, author, isbn, genre} = req.body
        const book = new Book({
            title,
            summary,
            author,
            isbn,
            genre,
        })
        console.log(errors.errors)
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
                    return res.render('book_form', {title: 'Create Book', authors: result.authors, book: book, errors: errors.array()})
                }

                return res.render('book_form', {title: 'Create Book', authors: result.authors, genres: result.genres, book: book, errors: errors.array()});
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
exports.book_update_get = function(req, res, next) {
    const id = req.params.id
    async.parallel({
        book: function(callback) {
            Book.findById(id).populate('author genre').exec(callback)
        },
        genres: function(callback) {
            Genre.find().sort({name: 1}).exec(callback)
        },
        authors: function(callback) {
            Author.find().sort({lastName: 1}).exec(callback)
        }
    }, (err, result) => {
        if(err) return next(err)
        if(result.book == null) return res.json({success: true, msg: 'Book not found'})
        res.render('update_book', {title: 'Update Book', book: result.book, authors: result.authors, genres: result.genres})
    })
};

// Handle book update on POST.
exports.book_update_post = [
    body('title', 'Title is Required').trim().isLength({min: 1}).escape(),
    body('summary', 'Summary is Required').trim().isLength({min: 1}).escape(),
    body('author', 'Author is Required').trim().isLength({min: 1}).escape(),
    body('isbn', 'ISBN is Required').trim().isLength({min: 1}).escape(),
    body('isbn').if(body('isbn').notEmpty()).isNumeric().withMessage('ISBN is numeric only'),
    body('genre', 'Genre is required').exists(),
    // check ISBN conflict in db 
    body('genre.*', 'Genre is Required').trim().isLength({min: 1}).escape(),
    
    function(req, res, next) {
        const isbn = req.body.isbn
        const errors = validationResult(req)
        const update_book = {...req.body}
        if(!Array.isArray(update_book.genre)) {
            update_book.genre = new Array(update_book.genre)
        }
        async function handleValidation() {
            
            try {
                let book_isbn = await Book.findById(req.params.id).select('isbn').exec()
                if (book_isbn.isbn != isbn) {
                    let result = await Book.findOne({isbn : isbn}).exec()
                    if(result != null) {
                        errors.errors.push({
                            value: isbn,
                            msg: 'ISBN already exists',
                            param: 'isbn',
                            location: 'body'
                        })
                    }
                }
            }
            catch(err){
                if(err) return next(err)
            }
            if(!errors.isEmpty()){
                async.parallel({
                    genres: function(callback) {
                        Genre.find().sort({name: 1}).exec(callback)
                    },
                    authors: function(callback) {
                        Author.find().sort({lastName: 1}).exec(callback)
                    }
                }, (err, result) => {
                    if(err) return next(err)
                    return res.render('update_book', {title: 'Update Book', book: update_book, authors: result.authors, genres: result.genres, errors: errors.array()})
                })
            } 
            else {
                Book.findByIdAndUpdate(req.params.id, update_book).exec((err, result) => {
                    if(err) return next(err)
                    res.redirect(result.url)
                })
            }  
        }
        handleValidation()
    }
]