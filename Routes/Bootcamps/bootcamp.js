const express = require('express')
const router = express.Router()
const { getAllBootcamps,
    getBootcampById,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp,
    getBootcampsInRadius
} = require('../../Controllers/bootcamps')

//Include other resource routers
const courseRouter = require('../Courses/course')

//Re-route into other resource routers
router.use('/:bootcampId/courses', courseRouter)

router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius)
router.route('/').get(getAllBootcamps).post(createBootcamp)
router.route('/:id').get(getBootcampById).put(updateBootcamp).delete(deleteBootcamp)

module.exports = router