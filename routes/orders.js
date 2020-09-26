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
        res.status(200).json(data)
    } catch (err) {
        res.status(500).send(`Server Error: ${err.message}`)
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
                replacements: { order_id: parseInt(req.params.id), user_id: parseInt(res.locals.user.id) }
            })
        }
        if (data.length > 0) {
            if (isObjectEmpty(data[0])) {
                res.status(404).json({ message: "Order was not found." })
            } else {
                const orderData = await sql.query(queries.getOrderInfoById, {
                    type: sql.QueryTypes.SELECT,
                    replacements: { order_id: parseInt(req.params.id) }
                })
                res.status(200).json({ order_information: orderData[0], products: data })
            }
        } else {
            res.status(404).json({ message: "Order was not found." })
        }
    } catch (err) {
        res.status(500).send(`Server Error: ${err.message}`)
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
        res.status(201).json({ user_id: res.locals.user.id, username: res.locals.user.username, order_id: orderId, order_total: total, order_status: 1, products })
    } catch (err) { res.status(500).json({ Error: err }) }
})

// UPDATE ORDER STATUS - ADMIN ONLY
router.put('/:id/?', verifyUserToken, isUserAdmin, async (req, res) => {
    try {
        const id_status = parseInt(req.query.id_status)
        const orderId = parseInt(req.params.id)
        const data = await sql.query(queries.updateOrderStatus, { replacements: { id: orderId, id_status } })
        if (data[0].affectedRows === 0) return res.status(200).json({ Message: "Order not updated, no rows were affected" })
        res.status(200).json({ message: "Order updated successfully" })
    } catch (err) {
        res.status(500).send(`Server Error: ${err.message}`)
    }
})

// GET LIST OF ORDER STATUS
router.get('/status/list/', verifyUserToken, async (req, res) => {
    try {
        //const data2 = await sql.query(`select * from payment_options; `, { type: sql.QueryTypes.SELECT })
        const data = await sql.query(queries.getListOfOrderStatus, { type: sql.QueryTypes.SELECT })
        if (data.length === 0) return res.status(204)
        res.status(200).json(data)
    } catch (err) {
        res.status(500).send(`Server Error: ${err.message}`)
    }
})

// GET LIST OF PAYMENT METHODS
router.get('/payments/list/', verifyUserToken, async (req, res) => {
    try {
        const data = await sql.query(`select * from payment_options; `, { type: sql.QueryTypes.SELECT })
        if (data.length === 0) return res.status(204)
        res.status(200).json(data)
    } catch (err) {
        res.status(500).send(`Server Error: ${err.message}`)
    }
})

// DELETE ORDER BY ID
router.delete('/:id', verifyUserToken, isUserAdmin, async (req, res) => {
    try {
        const orderId = parseInt(req.params.id)
        const productsData = await sql.query(queries.deleteOrderProductsById, { replacements: { id: orderId } })
        const orderData = await sql.query(queries.deleteOrderById, { replacements: { id: orderId } })
        if (productsData[0].affectedRows === 0 || orderData[0].affectedRows === 0)
            return res.status(404).json({ error: "Order ID not found" })
        res.status(200).json({ message: "Order deleted successfully" })
    } catch (err) {
        console.log(err)
        res.status(500).send(`Server Error: ${err.message}`)
    }
})

module.exports = router