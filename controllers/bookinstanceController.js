const async = require('async')
const BookInstance = require('../models/bookinstance')
const Book = require('../models/book')
const {body, validationResult} = require('express-validator')
const {validDate} = require('../controllers/handle_data')
const { Error } = require('mongoose')



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
const createBookInstance = (req, res, next) => {
    const books = async ()=>{
        try {
            let data = await Book.find({}, '_id title').sort({title: 1}).exec()
            res.render('bookinstance_form', {title: 'Create Book Copy', books: data})
        }
        catch(err) {return next(err)}
    }
    books()
}


// POST handle create book instance form
const handleCreateBookInstance = [
    body('book', 'Please select a Book').trim().isLength({min:1}).escape(),
    body('imprint', 'Imprint is required').trim().isLength({min:1}).escape(),
    body('date', 'Date is required').trim().custom(date => validDate(date, 'Invalid Date')),
    body('date').trim().custom(date => {
        let input_date = new Date(date)
        if (Number(input_date) < Date.now()) { throw new Error('Invalid Date Available')}
        return true
    }),
    body('status', 'Status is required').custom(status => {
        let res = ['Available', 'Loaned', 'Maintenance', 'Reserved'].includes(status)
        if(res) return true;
        else throw new Error('Invalid status');
    }).escape(),

    (req, res, next) => {
        const {book, imprint, date, status} = req.body
        const errors = validationResult(req)
        const bookinstance = new BookInstance({
            book,
            imprint,
            date,
            status
        })
        if(!errors.isEmpty()) {
            const books = async () => {
                try {
                    let data = await Book.find({}).sort({title: 1}).exec()
                    return res.render('bookinstance_form', {title: 'Create Book Copy', books: data, bookinstance: bookinstance, user_date: date, errors: errors.array()})
                }
                catch(err) {return next(err)}
            }
            books()
        }
        else {
            // bookinstance.save((err, result) => {
            //     if(err) return next(err)
            //     return res.redirect(result.url)
            // })
        }
    }
]

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