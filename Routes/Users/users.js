const express = require('express')
const router = express.Router()
const { getUsers,
    createUser,
    getUserById,
    updateUser,
    deleteUser
} = require('../../Controllers/users')


const User = require('../../Models/User')

const advancedResults = require('./../../Middlewares/advanceResults')
const { protect, authorize } = require('../../Middlewares/auth')

router.use(protect)
router.use(authorize('admin'))

router.route('/').get(advancedResults(User), getUsers).post(createUser)
router.route('/:id').get(getUserById).put(updateUser).delete(deleteUser)

module.exports = router