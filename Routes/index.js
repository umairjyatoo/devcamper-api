const router = module.exports = require('express')()

router.use('/bootcamps', require('./Bootcamps/bootcamp'))