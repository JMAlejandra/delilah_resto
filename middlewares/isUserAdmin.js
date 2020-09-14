const isUserAdmin = async (req, res, next) => {
    const adminUser = res.locals.adminUser
    console.log(adminUser)
    adminUser.is_admin === 1 ? next() : res.status(403).send({ message: "User does not have access to the resource" })
}

module.exports = isUserAdmin