require('dotenv').config()
const jwt = require('jsonwebtoken')



function checkJwt(req, res, next) {
    console.log(req.headers)
    const authHeader = req.headers['authorization']
    const userToken = authHeader && authHeader.split(' ')[1]
    if(userToken == null || userToken == undefined) {
        console.log('no jwt found')
        return next()
    }
    else {
        jwt.verify(userToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if(err) {
                console.log('invalid token')
                return next()
            }
            else {
                req.user = user
                console.log('jwt passed')
                next()
            }
        })
    }
}


module.exports = {
    checkJwt,
}