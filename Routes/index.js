const router = module.exports = require('express')()

router.use('/bootcamps', require('./Bootcamps/bootcamp'))
router.use('/courses', require('./Courses/course'))
router.use('/auth', require('./auth'))