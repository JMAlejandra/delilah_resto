const express = require("express")
const jwt = require("jsonwebtoken")
const server = express()

server.listen(3000, () => {
    console.log("Server is up and running")
})

// GENERAL MIDDLEWARES
server.use(express.json())

// ROUTES
// Users
const usersRouter = require('./routes/users')
server.use('/users', usersRouter)

// products
const productsRouter = require('./routes/products')
server.use('/products', productsRouter)