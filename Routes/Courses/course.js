const express = require('express')
const router = express.Router({ mergeParams: true })
const { getAllCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse
} = require('../../Controllers/courses')


router.route('/').get(getAllCourses).post(createCourse)
router.route('/:id').get(getCourseById).put(updateCourse).delete(deleteCourse)

module.exports = router