const sql = require('../mysql')
const queries = require('../sql/queries')
const bcrypt = require('bcrypt')
const checkEmailFormat = require("../utils/checkEmailFormat")

const authorizeUser = async (req, res, next) => {
    const { user_credential, user_password } = req.body
    try {
        let data = [];
        if (!checkEmailFormat(user_credential)) {
            data = await sql.query(queries.getUserCredentialsByUsername, {
                type: sql.QueryTypes.SELECT,
                replacements: { username: user_credential }
            })
        } else {
            data = await sql.query(queries.getUserCredentialsByEmail, {
                type: sql.QueryTypes.SELECT,
                replacements: { email: user_credential }
            })
        }
        if (!data.length) {
            res.status(404).send("User not found")
        } else {
            res.locals.user = {
                id: data[0].id,
                is_admin: data[0].is_admin,
                username: data[0].username
            }
            const isPasswordCorrect = await bcrypt.compare(user_password, data[0].user_password)
            isPasswordCorrect ? next() : res.status(401).send("The username or password is incorrect")
        }
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}

module.exports = authorizeUser