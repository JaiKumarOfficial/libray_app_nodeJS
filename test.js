const mongoose = require('mongoose')
const Book = require('./models/book')

const mongoDB = "mongodb+srv://jai:root@cluster0.gcjoz.mongodb.net/local_library?retryWrites=true&w=majority"
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true})

const db = mongoose.connection;

Book.find({}, 'title author')
  .populate('author')
  .exec((err, data) => {
  console.log(data)
})

