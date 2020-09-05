const express = require('express')
const dotenv = require('dotenv');
const logger = require('./Middlewares/logger')
const morgan = require('morgan')
const connectDB = require('./config/db')
const colors = require('colors');
const errorHandler = require('./Middlewares/error')
const expressFileUpload = require('express-fileupload');
const path = require('path');
const cookieParser = require('cookie-parser');
//Load env vars
dotenv.config({ path: './config/config.env' })

//Connect to the database
connectDB();

const app = express()
//Body parser
app.use(express.json())

//Cookie parser
app.use(cookieParser())

const PORT = process.env.PORT || 5000

//Dev Logging Middleware
if (process.env.NODE_ENV === 'development')
    app.use(morgan('dev'))

//File uploading
app.use(expressFileUpload());

app.use(express.static(path.join(__dirname, 'public')))
//using the custom logger middleware 
//app.use(logger)

//Mount routers
app.use('/api/v1', require('./routes/index'))

//Error Handler Middleware
app.use(errorHandler)

const server = app.listen(PORT, (req, res) => {
    console.log(`Server running in ${process.env.NODE_ENV} on ${PORT}`.yellow.bold)
})

//Handle the unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`.red.bold)
    //close server and exit process
    server.close(() => {
        process.exit(1)
    })
})