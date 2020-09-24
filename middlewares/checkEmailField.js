const checkEmailFormat = require("../utils/checkEmailFormat")

const checkEmailField = (req, res, next) => {
    const { email } = req.body;
    if (checkEmailFormat(email)) {
        return next()
    } else {
        res.status(400).send("Sent email address is not an email")
    }
}

module.exports = checkEmailField