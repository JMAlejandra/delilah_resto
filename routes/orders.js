const express = require("express")
const router = express.Router()
const sql = require('../mysql')
const queries = require('../sql/queries')
const isObjectEmpty = require("../utils/isObjectEmpty")

// MIDDLEWARES
const verifyUserToken = require("../middlewares/verifyUserToken")
const isUserAdmin = require("../middlewares/isUserAdmin")

// GET ALL ORDERS - BOARD
router.get('/', verifyUserToken, isUserAdmin, async (req, res) => {
    try {
        const data = await sql.query(queries.getOrdersBoard, { type: sql.QueryTypes.SELECT, })
        if (!data) return res.status(404).json({ message: "No orders were found." })
        res.status(200).json(data[0])
    } catch (err) {
        res.status(500).send(`Database Error: ${err.message}`)
    }
})

// GET ORDER BY ID - DETAILS
router.get('/:id', verifyUserToken, async (req, res) => {
    try {
        let data = []
        if (res.locals.user.is_admin) {     // ADMINS CAN ACCESS ANY ORDER, OTHER USERS ONLY ACCESS THEIR OWN ORDERS
            data = await sql.query(queries.getOrderDetailsById, {
                type: sql.QueryTypes.SELECT,
                replacements: { order_id: parseInt(req.params.id) }
            })
        } else {
            data = await sql.query(queries.getUserOrderDetailsById, {
                type: sql.QueryTypes.SELECT,
                replacements: { order_id: parseInt(req.params.id), user_id: res.locals.user.id }
            })
        }
        if (isObjectEmpty(data[0])) return res.status(404).json({ message: "Order was not found." })
        res.status(200).json(data[0])
    } catch (err) {
        res.status(500).send(`Database Error: ${err.message}`)
    }
})

module.exports = router