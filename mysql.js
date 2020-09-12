const Sequelize = require('sequelize')
const database = 'delilahresto'
const user = "root"
const password = ""
const host = "localhost"
const port = ""

const sequelize = new Sequelize(`mysql://${user}:${password}@${host}:${port}/${database}`)

module.exports = sequelize;