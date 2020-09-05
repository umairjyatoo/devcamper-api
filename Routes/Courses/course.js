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
const { protect, authorize } = require('../../Middlewares/auth')


router.route('/').get(advancedResults(Course, {
    path: 'bootcamp',
    select: 'name description'
}), getAllCourses).post(protect, authorize('publisher', 'admin'), createCourse)
router.route('/:id').get(getCourseById).put(protect, authorize('publisher', 'admin'), updateCourse).delete(protect, authorize('publisher', 'admin'), deleteCourse)

module.exports = router