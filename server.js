const express = require('express')
const dotenv = require('dotenv');
const logger = require('./Middlewares/logger')
const morgan = require('morgan')
//Load env vars
dotenv.config({ path: './config/config.env' })

const app = express()
const PORT = process.env.PORT || 5000

//Dev Logging Middleware
if (process.env.NODE_ENV === 'development')
    app.use(morgan('dev'))

//using the custom logger middleware 
//app.use(logger)

//Mount routers
app.use('/api/v1', require('./routes/index'))

app.listen(PORT, (req, res) => {
    console.log(`Server running in ${process.env.NODE_ENV} on ${PORT}`)
})