const sql = require('../mysql')
const queries = require('../sql/queries')
const bcrypt = require('bcrypt')

const authorizeUser = async (req, res, next) => {
    const { username, user_password } = req.body
    try {
        const data = await sql.query(queries.getUserCredentials, {
            type: sql.QueryTypes.SELECT,
            replacements: { username }
        })
        const isPasswordCorrect = await bcrypt.compare(user_password, data[0].user_password)
        if (isPasswordCorrect) {
            return next()
        } else {
            res.status(401).send("The username or password is incorrect")
        }
    } catch (err) {
        res.status(500).send()
    }
}

module.exports = authorizeUser