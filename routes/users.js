const express = require("express")
const router = express.Router()
const sql = require('../mysql')
const queries = require('../sql/queries')
const jwt = require('jsonwebtoken')

// MIDDLEWARES
const checkEmailField = require("../middlewares/checkEmailField")
const checkNewUserFields = require("../middlewares/checkNewUserFields")
const hashUserPassword = require("../middlewares/hashUserPassword")
const isUserAdmin = require("../middlewares/isUserAdmin")
const authorizeUser = require("../middlewares/authorizeUser")

// CREATING NEW USER
router.post('/', checkNewUserFields, checkEmailField, hashUserPassword, async (req, res) => {
    const hashedPassword = res.locals.hashedPassword
    const { full_name, username, email, phone, address } = req.body
    try {
        const data = await sql.query(queries.createNewUser, {
            replacements: {
                // :full_name, :username, :email, :phone, :address, :user_password, :is_admin
                full_name, username, email, phone, address,
                user_password: hashedPassword,
                is_admin: 0
            }
        })
        res.status(201).send({
            user_id: data[0],
            message: "New User Added"
        })
    } catch (err) {
        if (err.original.errno === 1062) {
            res.status(501).json({
                message: `Error inserting into database`,
                error: err.errors[0].message
            })
        } else {
            res.status(500).json({
                message: `Error creating user.`
            })
        }
    }
})

// LOGGING A USER BY ID
router.post('/login', authorizeUser, async (req, res) => {
    const signature = "thisIsVerySafe"
    const token = jwt.sign(res.locals.user, signature)
    res.append('Authorization', token)
    res.send("done")
})

// GETTING ALL USERS
router.get('/', (req, res) => {
    sql.query(queries.getAllUsers, {
        type: sql.QueryTypes.SELECT
    }).then(r => {
        res.status(200).json(r)
    }).catch(e => res.status(500).send(e))
})

// GETTING A USER BY ID
router.get('/:id', (req, res) => {
    sql.query(queries.getUserById + '?', {
        type: sql.QueryTypes.SELECT,
        replacements: [parseInt(req.params.id)]
    }).then(r => {
        res.status(200).json(r)
    }).catch(e => res.status(500).send(`Database Error: ${e.message}`))
})

// UPDATING A USER BY ID

// UPDATING A USER BY ID - GIVES ADMIN PERMISSIONS

// DELETING A USER BY ID

module.exports = router