const Genre = require('../models/genre')


// Display list of all Genre.
const genreList = (req, res) => {
    res.send('genre list')
}

// Display detail page for a specific Genre.
const genreDetail = (req, res) => {
    res.send('genre detail')
}

// Display Genre create form on GET.
const createGenre = (req, res) => {
    res.send('creat genre')
}

// Handle Genre create on POST.
const handleCreateGenre = (req, res) => {
    res.send('handle create gnre')
}

// Display Genre delete form on GET.
const delGenre = (req, res) => {
    res.send('del genre')
}

// Handle Genre delete on POST.
const handleDelGenre = (req, res) => {
    res.send('handle del genre')
}

// Display Genre update form on GET.
const updategenre = (req, res) => {
    res.send('update genre')
}

// Handle Genre update on POST.
const handleUpdateGenre = (req, res) => {
    res.send('handle update genre')
}

module.exports = {
    genreList,
    genreDetail,
    createGenre,
    handleCreateGenre,
    delGenre,
    handleDelGenre,
    updategenre,
    handleUpdateGenre,
}