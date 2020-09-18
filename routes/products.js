const express = require("express")
const router = express.Router()
const sql = require('../mysql')
const queries = require('../sql/queries')
const jwt = require('jsonwebtoken')

// MIDDLEWARES
const verifyUserToken = require("../middlewares/verifyUserToken")
const isUserAdmin = require("../middlewares/isUserAdmin")
const checkNewProductFields = require("../middlewares/checkNewProductsFields")

// GETTING ALL PRODUCTS
router.get('/', verifyUserToken, async (req, res) => {
    try {
        let data = []
        if (parseInt(res.locals.user.is_admin) === 1) {
            console.log("admin")
            data = await sql.query(queries.getAllProducts,
                { type: sql.QueryTypes.SELECT, }
            )
        } else {
            console.log("no admin")
            data = await sql.query(queries.getAllEnabledProducts,
                { type: sql.QueryTypes.SELECT, }
            )
        }
        if (data.length === 0) {
            return res.status(404).json({ error: "Products not found" })
        }
        res.status(200).json(data)
    } catch (err) {
        res.status(500).send(`Database Error: ${err.message}`)
    }
})

// GETTING A PRODUCT BY ID 
router.get('/:id', verifyUserToken, async (req, res) => {
    try {
        let data = []
        if (parseInt(res.locals.user.is_admin) === 1) {
            data = await sql.query(queries.getProductById, {
                type: sql.QueryTypes.SELECT,
                replacements: { id: parseInt(req.params.id) }
            })
        } else {
            data = await sql.query(queries.getEnabledProductById, {
                type: sql.QueryTypes.SELECT,
                replacements: { id: parseInt(req.params.id) }
            })
        }
        if (data.length === 0) {
            return res.status(404).json({ error: "Product ID not found" })
        }
        res.status(200).json(data)
    } catch (err) {
        res.status(500).send(`Database Error: ${err.message}`)
    }
})

// CREATING A NEW PRODUCT - ADMIN ONLY
router.post('/', verifyUserToken, isUserAdmin, checkNewProductFields, async (req, res) => {
    try {
        const { description, price, image_url, is_favorite, is_enabled } = req.body
        const data = await sql.query(queries.createNewProduct, {
            replacements: {
                description, image_url,
                price: parseFloat(price),
                is_favorite: parseInt(is_favorite),
                is_enabled: parseInt(is_enabled)
            }
        })
        if (data[1] === 0) return res.status(404).json({ error: "Product not created" })
        res.status(200).json({ message: "New product created successfully", id_product: data[0] })
    } catch (err) {
        res.status(500).send(`Database Error: ${err.message}`)
    }
})

// UPDATING A PRODUCT BY ID - ADMIN ONLY
router.put('/:id', verifyUserToken, isUserAdmin, checkNewProductFields, async (req, res) => {
    try {
        const { description, price, image_url, is_favorite, is_enabled } = req.body
        const id = req.params.id
        const data = await sql.query(queries.updateProductById, {
            replacements: {
                id, description, image_url,
                price: parseFloat(price),
                is_favorite: parseInt(is_favorite),
                is_enabled: parseInt(is_enabled)
            }
        })
        if (data[0].affectedRows === 0) return res.status(404).json({ Message: "Product not updated, no rows were affected" })
        res.status(200).json({ message: "Product updated successfully" })
    } catch (err) {
        res.status(500).send(`Database Error: ${err.message}`)
    }
})

// DELETING A PRODUCT BY ID - ADMIN ONLY
router.delete('/:id', verifyUserToken, isUserAdmin, async (req, res) => {
    try {
        const data = await sql.query(queries.deleteProductById,
            {
                replacements: { id: parseInt(req.params.id) }
            })
        if (data[0].affectedRows === 0) {
            return res.status(404).json({ error: "Product ID not found" })
        }
        res.status(200).json({ message: "Product deleted successfully" })
    } catch (err) {
        res.status(500).send(`Database Error: ${err.message}`)
    }
})

module.exports = router