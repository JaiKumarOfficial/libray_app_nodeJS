// const mongoose = require('mongoose')
// const Book = require('./models/book')
// const Genre = require('./models/genre')
// const mongoDB = "mongodb+srv://jai:root@cluster0.gcjoz.mongodb.net/local_library?retryWrites=true&w=majority"
// mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true})

// const db = mongoose.connection;

// Book.find({}, 'title author')
//   .populate('author')
//   .exec((err, data) => {
//   console.log(data)
// })

// async function getGenreId(id) {
//   try {
//       return typeof(Genre.find({genre: id}).exec())
//   }
//   catch(err) {
//       return err
//   }
// }

// async function books_genre(id) {
//   try {
//       return Book.find({genre: id}).exec() 
//   }
//   catch(err) {
//       return err
//   }
// }
// (async () => {
// let id = "6099b95438779f1ba4003ec2"
// let [result1, result2] = await Promise.allSettled([getGenreId(id), books_genre(id)])
// console.log(result1, "\n", result2)
// })();

// console.log('not blocking code')

// function toLetterCase(string) {
//   return string.split(" ").map(word => {return word[0].toUpperCase() + word.slice(1)}).join(" ")
// }

// console.log(toLetterCase("this is a test"))
// let o = {a: 1,b:2, c:''}
// let r = {}
// for (let key in o) {
//   if(o[key]) r[key] = o[key]
// }
// console.log(r)
// const obj = {a,c} = o
// console.log(obj)

let date = new Date('01/02/1920')
console.log(`${date.getMonth()<10 ? '0'+String(date.getMonth()+1) : date.getMonth()+1}/${date.getDate()<10 ? '0'+date.getDate() : date.getDate()}/${date.getFullYear()}`)