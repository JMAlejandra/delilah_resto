const express = require("express")
const router = express.Router()
const sql = require('../mysql')
const queries = require('../sql/queries')
const isObjectEmpty = require("../utils/isObjectEmpty")


// MIDDLEWARES
const verifyUserToken = require("../middlewares/verifyUserToken")
const isUserAdmin = require("../middlewares/isUserAdmin")
const checkNewOrderFields = require("../middlewares/checkNewOrderFields")
const asyncForEach = require("../utils/asyncForEach")

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
        console.log(data[0])
        res.status(200).json(data[0])
    } catch (err) {
        res.status(500).send(`Database Error: ${err.message}`)
    }
})

// CREATE A NEW ORDER
router.post('/', verifyUserToken, checkNewOrderFields, async (req, res) => {
    try {
        const { id_payment_option, products } = req.body
        // get user id 
        const userId = res.locals.user.id
        // gets order id
        const orderTableInfo = await sql.query(`SHOW TABLE STATUS LIKE 'orders';`, { type: sql.QueryTypes.SELECT })
        console.log('orderID = ' + orderTableInfo[0].Auto_increment)
        // calculates order total
        let total = 0
        await asyncForEach(products, async (product) => {
            const id = product.id_product
            const data = await sql.query(queries.getProductPrice, { replacements: { id }, type: sql.QueryTypes.SELECT })
            product.price = data[0].price
            let subtotal = data[0].price * parseInt(product.quantity)
            product.subtotal = parseFloat(subtotal).toString()
            total += data[0].price * parseInt(product.quantity)
        })
        // creates order in orders table
        const newOrder = await sql.query(queries.createNewOrder, {
            replacements: { id_payment_option, id_user: userId, total: parseFloat(total) }
        })
        const orderId = newOrder[0]     // gets order id for the created order
        // creates products_by_order row for each product
        await asyncForEach(products, async (product) => {
            const newProductRow = await sql.query(queries.addNewProductToOrder, {
                replacements: {
                    id_order: orderId,
                    id_product: product.id_product,
                    quantity: product.quantity,
                    price: parseFloat(product.price)
                }
            })
        })
        res.json({ user_id: res.locals.user.id, username: res.locals.user.username, order_id: orderId, order_total: total, order_status: 1, products })
    } catch (err) { res.status(400).json({ DatabaseError: err }) }
})

// UPDATE ORDER STATUS - ADMIN ONLY
router.put('/:id/?', verifyUserToken, isUserAdmin, async (req, res) => {
    try {
        const id_status = parseInt(req.query.id_status)
        const orderId = parseInt(req.params.id)
        const data = await sql.query(queries.updateOrderStatus, { replacements: { id: orderId, id_status } })
        if (data[0].affectedRows === 0) return res.status(202).json({ Message: "Order not updated, no rows were affected" })
        res.status(200).json({ message: "Order updated successfully" })
    } catch (err) {
        res.status(500).send(`Database Error: ${err.message}`)
    }
})

// GET LIST OF ORDER STATUS
router.get('/status/list/', verifyUserToken, async (req, res) => {
    try {
        const data = await sql.query(queries.getListOfOrderStatus, { type: sql.QueryTypes.SELECT })
        if (data.length === 0) return res.status(204)
        res.status(200).json(data)
    } catch (err) {
        res.status(500).send(`Database Error: ${err.message}`)
    }
})

module.exports = router