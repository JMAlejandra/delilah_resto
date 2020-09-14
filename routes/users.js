require('dotenv').config()

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
const verifyUserToken = require('../middlewares/verifyUserToken')

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
    const signature = process.env.ACCESS_TOKEN_SECRET
    const token = jwt.sign(res.locals.user, signature)
    res.append('Authorization', `Bearer ${token}`)
    res.status(200).send("User logged in succesfully")
})

// GETTING ALL USERS
router.get('/', verifyUserToken, isUserAdmin, (req, res) => {
    sql.query(queries.getAllUsers, {
        type: sql.QueryTypes.SELECT
    }).then(r => {
        res.status(200).json(r)
    }).catch(e => res.status(500).send(e))
})

// GETTING A USER BY ID
router.get('/:id', verifyUserToken, async (req, res) => {
    console.log(res.locals.user)
    try {
        const id = res.locals.user.id
        if (parseInt(req.params.id) === id) {
            const data = await sql.query(queries.getUserById + '?', {
                type: sql.QueryTypes.SELECT,
                replacements: [id]
            })
            res.status(200).json(data)
        } else {
            res.status(403).json({ error: "User is not authorized to access the resource" })
        }
    } catch (err) {
        res.status(500).send(`Database Error: ${err.message}`)
    }
})

// UPDATING A USER BY ID

// UPDATING A USER BY ID - GIVES ADMIN PERMISSIONS
router.put('/', verifyUserToken, isUserAdmin, async (req, res) => {
    const { is_admin, id } = req.query
    const role = is_admin == "true" ? 1 : 0
    try {
        const data = await sql.query(queries.updateUserRole, {
            replacements: {
                id: parseInt(id),
                is_admin: role
            }
        })
        if (data[0].affectedRows === 1) {
            res.status(200).json({ message: "User permissions updated." })
        } else {
            res.status(200).send({ message: "User already had the new permissions. Permissions remain unchanged." })
        }
    } catch (err) {
        res.status(500).json({ message: "Error updating user permissions" })
    }
})

// DELETING A USER BY ID

module.exports = router