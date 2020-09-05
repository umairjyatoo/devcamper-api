const express = require('express')
const router = express.Router({ mergeParams: true })
const { getAllCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse
} = require('../../Controllers/courses')
const Course = require('../../Models/Course')
const advancedResults = require('./../../Middlewares/advanceResults')


router.route('/').get(advancedResults(Course, {
    path: 'bootcamp',
    select: 'name description'
}), getAllCourses).post(createCourse)
router.route('/:id').get(getCourseById).put(updateCourse).delete(deleteCourse)

module.exports = router