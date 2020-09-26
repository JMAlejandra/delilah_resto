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
    }).then(data => {
        if (data.length === 0) {
            res.status(404).json({ error: "Users not found" })
        } else {
            res.status(200).json(data)
        }
    }).catch(e => res.status(500).send(e))
})

// GETTING A USER BY ID 
router.get('/:id', verifyUserToken, async (req, res) => {
    console.log(res.locals.user)
    try {
        const user_id = res.locals.user.id
        const id = req.params.id
        if (res.locals.user.is_admin === 1 || parseInt(req.params.id) === user_id) {
            const data = await sql.query(queries.getUserById + '?', {
                type: sql.QueryTypes.SELECT,
                replacements: [id]
            })
            if (data.length === 0) {
                return res.status(404).json({ error: "User not found" })
            }
            res.status(200).json(data)
        } else {
            res.status(403).json({ error: "User is not authorized to access the resource" })
        }
    } catch (err) {
        res.status(500).send(`Database Error: ${err.message}`)
    }
})

// UPDATING A USER BY ID
router.put('/:id', verifyUserToken, checkNewUserFields, checkEmailField, hashUserPassword, async (req, res) => {
    try {
        const hashedPassword = res.locals.hashedPassword
        const { full_name, username, email, phone, address } = req.body
        const id = parseInt(req.params.id)
        const userId = parseInt(res.locals.user.id)
        if (!res.locals.user.is_admin && id !== userId)
            return res.status(403).send({ error: "User does not have access to the resource" })
        const data = await sql.query(queries.updateUserById, {
            replacements: {
                id, full_name, username, email, phone, address, user_password: hashedPassword
            }
        })
        if (data[0].affectedRows === 1) {
            res.status(200).json({ message: "User information updated." })
        } else {
            res.status(200).send({ message: "No affected rows. User information remains unchanged." })
        }
    } catch (err) {
        res.status(500).json({ message: "Error updating user." })
    }
})

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