const express = require("express")
const jwt = require("jsonwebtoken")
const server = express()

server.listen(3000, () => {
    console.log("Server is up and running")
})

// GENERAL MIDDLEWARES
server.use(express.json())

// ROUTES
const usersRouter = require('./routes/users')
server.use('/users', usersRouter)