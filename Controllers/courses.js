const Course = require('./../Models/Course')
const Bootcamp = require('../Models/Bootcamp')
const ErrorResponse = require('./../utils/errorResponse')
const asyncHandler = require('../Middlewares/async')

//@desc         Get Courses
//@route        GET /api/v1/courses
//@route        GET /api/v1/bootcamps/:bootcampId/courses
//@access       Public
exports.getAllCourses = asyncHandler(async (req, res, next) => {
    if (req.params.bootcampId) {
        const courses = await Course.find({
            bootcamp: req.params.bootcampId
        })
        return res.status(200).json({
            success: true,
            count: courses.length,
            data: courses
        })
    } else {
        return res.status(200).json(res.advancedResults);
    }
});


//@desc         Get a single course
//@route        GET /api/v1/courses/:id
//@access       Public
exports.getCourseById = asyncHandler(async (req, res, next) => {
    const ID = req.params.id;
    const courseExists = await Course.findById(ID).populate({
        path: 'bootcamp',
        select: 'name description'
    });
    if (!courseExists || courseExists.length === 0) {
        return next(new ErrorResponse(`Course not found with Id of ${ID}`, 404));
    }
    return res.status(200).json({
        success: true,
        data: courseExists
    });
});

//@desc         Create a new course
//@route        POST /api/v1/bootcamps/:bootcampId/courses
//@access       Private
exports.createCourse = asyncHandler(async (req, res, next) => {
    req.body.bootcamp = req.params.bootcampId;
    const bootcamp = await Bootcamp.findById(req.params.bootcampId)
    if (!bootcamp) {
        return next(
            new ErrorResponse(`No Bootcamp with the id  of ${req.params.bootcampId}`),
            404
        )
    }
    const newCourse = await Course.create(req.body);
    if (newCourse) {
        return res.status(201).json({
            success: true,
            message: 'Course created successfully.',
            data: newCourse
        });
    }
});

//@desc         Update course
//@route        PUT /api/v1/courses/:id
//@access       Private
exports.updateCourse = asyncHandler(async (req, res, next) => {
    const ID = req.params.id;
    let course = await Course.findById(ID);
    if (!course) {
        return next(new ErrorResponse(`Course not found with Id of ${ID}`, 404));
    }
    course = await Course.findByIdAndUpdate(ID, req.body, {
        new: true,
        runValidators: true
    })
    return res.status(200).json({
        success: true,
        message: 'course updated successfully',
        data: course
    });
});

//@desc         Delete a course
//@route        DELETE /api/v1/courses/:id
//@access       Private
exports.deleteCourse = asyncHandler(async (req, res, next) => {
    const ID = req.params.id;
    let course = await Course.findById(ID);
    if (!course) {
        return next(new ErrorResponse(`Course not found with Id of ${ID}`, 404));
    }
    await course.remove();
    return res.status(200).json({
        success: true,
        message: 'course deleted successfully',
        data: {}
    });
});