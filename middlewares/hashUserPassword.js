const bcrypt = require('bcrypt')

const hashUserPassword = async (req, res, next) => {
    const { user_password } = req.body
    try {
        const hashedPassword = await bcrypt.hash(user_password, 10)
        res.locals.hashedPassword = hashedPassword
        return next()
    } catch (err) {
        res.status(500).send()
    }
}

module.exports = hashUserPassword