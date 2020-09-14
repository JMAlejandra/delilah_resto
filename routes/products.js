const express = require("express")
const router = express.Router()
const sql = require('../mysql')
const queries = require('../sql/queries')
const jwt = require('jsonwebtoken')

// MIDDLEWARES
const verifyUserToken = require("../middlewares/verifyUserToken")

// GETTING ALL PRODUCTS
router.get('/', verifyUserToken, async (req, res) => {
    try {
        const data = await sql.query(queries.getAllProducts, {
            type: sql.QueryTypes.SELECT,
        })
        if (data.length === 0) {
            res.status(404).json({ error: "Products not found" })
        } else {
            res.status(200).json(data)
        }
    } catch (err) {
        res.status(500).send(`Database Error: ${err.message}`)
    }
})

// GETTING A PRODUCT BY ID 
router.get('/:id', verifyUserToken, async (req, res) => {
    try {
        let data = []
        if (parseInt(res.locals.user.is_admin) === 1) {
            console.log("admin")
            data = await sql.query(queries.getProductById, {
                type: sql.QueryTypes.SELECT,
                replacements: { id: parseInt(req.params.id) }
            })
        } else {
            console.log("no admin")
            data = await sql.query(queries.getEnabledProductById, {
                type: sql.QueryTypes.SELECT,
                replacements: { id: parseInt(req.params.id) }
            })
        }
        if (data.length === 0) {
            res.status(404).json({ error: "Product not found" })
        } else {
            res.status(200).json(data)
        }
    } catch (err) {
        res.status(500).send(`Database Error: ${err.message}`)
    }
})

// CREATING A NEW PRODUCT - ADMIN ONLY

// UPDATING A PRODUCT BY ID - ADMIN ONLY

// DELETING A PRODUCT BY ID - ADMIN ONLY

module.exports = router