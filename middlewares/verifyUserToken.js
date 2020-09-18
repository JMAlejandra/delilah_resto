require('dotenv').config()

const jwt = require('jsonwebtoken')

const verifyUserToken = async (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) {
        return res.status(401).json({ error: "Expected user authentication token" })
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).send({ message: "User does not have access to the resource" })
        res.locals.user = user
        next()
    })
}

module.exports = verifyUserToken