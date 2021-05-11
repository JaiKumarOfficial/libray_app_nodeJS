const express = require('express');
const router = express.Router();
const {index} = require('../controllers/bookController')

/* GET home page. */
router.get('/', (req, res) => {
    res.redirect('/catalog')
});

module.exports = router;
