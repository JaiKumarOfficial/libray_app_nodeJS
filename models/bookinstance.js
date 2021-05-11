const mongoose = require('mongoose');
const handle_data = require('../controllers/handle_data')

const Schema = mongoose.Schema;

const BookInstanceSchema = new Schema(
  {
    book: { type: Schema.Types.ObjectId, ref: 'Book', required: true }, //reference to the associated book
    imprint: {type: String, required: true},
    status: {type: String, required: true, enum: ['Available', 'Maintenance', 'Loaned', 'Reserved'], default: 'Maintenance'},
    due_back: {type: Date, default: Date.now}
  }
);



// Virtual for bookinstance's URL
BookInstanceSchema
.virtual('url')
.get(function () {
  return '/catalog/bookinstance/' + this._id;
});

BookInstanceSchema
.virtual('format_date')
.get(function () {
  let new_date = handle_data.formatDate(this.due_back)
  return new_date;
});

//Export model
module.exports = mongoose.model('BookInstance', BookInstanceSchema);