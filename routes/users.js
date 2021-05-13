const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController')

/* GET users listing. */
router.get('/login', function(req, res, next) {
  res.send('login page');
});

router.get('/signup', (req, res) => {
  res.send('signup page')
})

module.exports = router;
