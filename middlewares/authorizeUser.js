const sql = require('../mysql')
const queries = require('../sql/queries')
const bcrypt = require('bcrypt')

const authorizeUser = async (req, res, next) => {
    const { username, user_password } = req.body
    console.log(req.body)
    try {
        const data = await sql.query(queries.getUserCredentials, {
            type: sql.QueryTypes.SELECT,
            replacements: { username }
        })
        if (!data.length) {
            res.status(404).send("User not found")
        } else {
            const isPasswordCorrect = await bcrypt.compare(user_password, data[0].user_password)
            isPasswordCorrect ? next() : res.status(401).send("The username or password is incorrect")
        }
    } catch (err) {
        res.status(500).json(err)
    }
}

module.exports = authorizeUser