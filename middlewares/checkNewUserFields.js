const checkNewUserFields = (req, res, next) => {
    const { full_name, username, email, phone, address, user_password } = req.body
    if (!full_name || !username || !email || !phone || !address || !user_password) {
        res.status(400).send("User information missing")
    } else {
        next()
    }
}

module.exports = checkNewUserFields