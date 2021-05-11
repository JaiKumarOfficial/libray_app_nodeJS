const Book = require('../models/book');
const Author = require('../models/author')
const Genre = require('../models/genre')
const BookInstance = require('../models/bookinstance')
const async = require('async')


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
            res.render('book_list', {data: data})
        }
        catch(err) {
            next(err)
        }
    }
    bookList();
};

// Display detail page for a specific book.
exports.book_detail = function(req, res) {
    res.send('NOT IMPLEMENTED: Book detail: ' + req.params.id);
};

// Display book create form on GET.
exports.book_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Book create GET');
};

// Handle book create on POST.
exports.book_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Book create POST');
};

// Display book delete form on GET.
exports.book_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Book delete GET');
};

// Handle book delete on POST.
exports.book_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Book delete POST');
};

// Display book update form on GET.
exports.book_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Book update GET');
};

// Handle book update on POST.
exports.book_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Book update POST');
};