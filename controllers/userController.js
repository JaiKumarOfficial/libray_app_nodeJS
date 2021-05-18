function get_register_form(req, res, next) {
    res.send('get register form')
}

function post_register_form() {

}

function get_login_form(req, res, next) {
    res.send('get login form')
}

function post_login_form() {

}

module.exports = {
    get_register_form,
    post_register_form,
    get_login_form,
    post_login_form,
}