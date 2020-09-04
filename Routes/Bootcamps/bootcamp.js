const express = require('express')
const router = express.Router()
const { getAllBootcamps,
    getBootcampById,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp
} = require('../../Controllers/bootcamps')


router.route('/').get(getAllBootcamps).post(createBootcamp)
router.route('/:id').get(getBootcampById).put(updateBootcamp).delete(deleteBootcamp)

module.exports = router