const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const authRoutes = require('./routes/authRoutes')
const configRoutes = require('./routes/configRoutes')
dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

app.use('/', authRoutes)
app.use('/config', configRoutes)

module.exports = app
