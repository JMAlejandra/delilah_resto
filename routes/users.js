const express = require("express")
const router = express.Router()
const sql = require('../mysql')
const queries = require('../sql/queries')

// MIDDLEWARES
const checkEmailField = require('../middlewares/checkEmailField')
const checkNewUserFields = require("../middlewares/checkNewUserFields")

// CREATING NEW USER
router.post('/', checkNewUserFields, checkEmailField, (req, res) => {
    res.send("test")
})

// LOGGING A USER BY ID

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

// DELETING A USER BY ID


module.exports = router