const checkEmailFormat = (email) => {
    const reg = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return reg.test(email);
}

const checkEmailField = (req, res, next) => {
    const { email } = req.body;
    if (checkEmailFormat(email)) {
        return next()
    } else {
        res.status(400).send("Sent email address is not an email")
    }
}

module.exports = checkEmailField