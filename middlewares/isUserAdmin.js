const isUserAdmin = async (req, res, next) => {
    const adminUser = res.locals.user
    adminUser.is_admin === 1 ? next() : res.status(403).send({ message: "User does not have access to the resource" })
}

module.exports = isUserAdmin