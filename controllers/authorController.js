const Author = require('../models/author')
const Book = require('../models/book')
const async = require('async')
const {body, ValidationResult, validationResult} = require('express-validator')

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
const createAuthor = (req, res, next) => {
    res.render('author_form', {title: 'Author Form'})
}

//handle author create POST
const handleCreateAuthor = [
    body('firstName', 'First Name is required').trim().isLength({min: 1, max: 50}).escape(),
    body('lastName', 'Last Name is required').trim().isLength({min: 1, max: 50}).escape(),
    body('dateOfBirth').optional({checkFalsy: true}).trim().custom(date => {
        if(isNaN(Date.parse(date))) {
            throw new Error('Invalid Date of Birth')
        }
        return true;
    }), 
    body('dateOfDeath').optional({checkFalsy: true}).trim().custom(date => {
        if(isNaN(Date.parse(date))) {
            throw new Error('Invalid Date of Death')
        }
        return true;
    }), 
    
    (req, res, next) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()) {
            return res.render('author_form', {title: 'Create Author', errors: errors.array()})
        }
        let {firstName, lastName, dateOfBirth, dateOfDeath} = req.body
        Author.findOne({firstName: {$regex: firstName, $options: 'i'}, lastName: {$regex: lastName, $options: 'i'}})
        .exec((err, result) => {
            if(err) return next(err)
            if(result) {
                return res.render('author_form', {title: 'Create Author', errors: [{msg: 'Author already exists'}]})
            }
        })
        let input_data = {
            firstName,
            lastName,
        }
        if(dateOfBirth != "") input_data.dateOfBirth = dateOfBirth
        if(dateOfDeath != "") input_data.dateOfDeath = dateOfDeath

        const author = new Author(input_data)
        author.save((err, result) => {
            if(err) return next(err)
            res.redirect(result.url)
        })
        
    }
]

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