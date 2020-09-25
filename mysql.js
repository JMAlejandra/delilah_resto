const config = require("./config.json")

const Sequelize = require('sequelize')
/*const database = 'delilahresto'
const user = "root"
const password = ""
const host = "localhost"
const port = ""*/
const database = config.database.name
const user = config.database.user
const password = config.database.password
const host = config.database.host
const port = config.database.port

const sequelize = new Sequelize(`mysql://${user}:${password}@${host}:${port}/${database}`)

module.exports = sequelize;