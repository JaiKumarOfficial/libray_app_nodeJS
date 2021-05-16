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
        res.render('bookinstance_list', {data: data, title: 'All Book Instances'})
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
        if (!req.query.error)
            res.render('bookinstance_detail', { title: 'Book Instance', instance: result.instance, book: result.instance.book })
        else { res.render('bookinstance_detail', { title: 'Book Instance', instance: result.instance, book: result.instance.book, err: true })}
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
            bookinstance.save((err, result) => {
                if(err) return next(err)
                return res.redirect(result.url)
            })
        }
    }
]

// GET del book instance form *** - REFRACTED CODE, NO NEED FOR GET DELETE
const delBookInstance = (req, res, next) => {
    // BookInstance.findById(req.params.id).populate('book').exec((err, result) => {
    //     if(err) return next(err)
    //     if (result == null) return res.json({success: true, msg: 'Instance not found'})
    //     if (result.status != 'Available') {
    //         return res.redirect('/catalog/bookinstance/' + result._id + '?error=true')
    //     }
    //     res.render('delete_bookinstance', {title: 'Delete Book Instance', instance: result})
    // })
}

// POST handle del book instance form
const handleDelBookInstance = (req, res, next) => {
    BookInstance.findById(req.params.id).populate('book').exec((err, result) => {
        if(err) return next(err)
        if (result == null) return res.json({success: true, msg: 'Instance not found'})
        if (result.status != 'Available') {
            return res.redirect('/catalog/bookinstance/' + result._id + '?error=true')
        }
        (async () => {
            try {
                let result = await BookInstance.findByIdAndDelete(req.params.id).exec()
                res.redirect('/catalog/book/'+req.query.book)
            }
            catch(err){
                return next(err)
            }
        })();
    })
}

// GET update book instance form
const updateBookInstance = (req, res) => {
    res.render('update_bookinstance', {title: 'Update Book Instance',})
}

// POST handle update book instance form
const handleUpdateBookInstance = [
    // status must be correct value if selected
    body('status').trim().custom(status => {
        let res = ['Available', 'Loaned', 'Maintenance', 'Reserved'].includes(status)
        if(res) return true;
        else throw new Error('Invalid status');
    }).optional({checkFalsy: true}).escape(),

    // validate date if present
    body('due_back').trim().custom(date => validDate(date, 'Invalid Date')).optional({checkFalsy: true}),

    // date should be > current date if present
    body('due_back').trim().custom(date => {
        let input_date = new Date(date)
        if (Number(input_date) < Date.now()) { throw new Error('Invalid Date')}
        return true
    }).optional({checkFalsy: true}),

    // if status is maintenance or loaned or reserved then date must not be empty
    body('due_back', 'Date is required').if(body('status').custom(status=>{
        let res = ['Loaned', 'Maintenance', 'Reserved'].includes(status)
        if(res) return true 
        else false
    })).notEmpty(),

    // there should be atleast one input
    body('due_back').if(body('status').isEmpty()).notEmpty().withMessage('Please provide at least one input'),

    (req, res, next) => {
        const id = req.params.id
        const errors = validationResult(req)
        const {status, due_back} = req.body

        if(!errors.isEmpty()) {
            let instance = {status, due_back}
            return res.render('update_bookinstance', {title: 'Update Book Instance', errors: errors.array(), instance: instance})
        }
        const update = {}
        let obj = {status, due_back}
        for (key in obj) {
            if(obj[key]) update[key] = obj[key]
        }
        BookInstance.findByIdAndUpdate(id, update).exec((err, result) => {
            if(err) return next(err)
            res.redirect(result.url)
        })
    }
]

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