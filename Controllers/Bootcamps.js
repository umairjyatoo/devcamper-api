const Bootcamp = require('./../Models/Bootcamp')
const ErrorResponse = require('./../utils/errorResponse')
const asyncHandler = require('../Middlewares/async')
const geocoder = require('../utils/geocoder')

//@desc         GET ALL BOOTCAMPS WITH ADVANCE FILTERING
//@route        GET /api/v1/bootcamps/...
//@access       Public
exports.getAllBootcamps = asyncHandler(async (req, res, next) => {
    let query;
    let queryStr = JSON.stringify(req.query)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    query = Bootcamp.find(JSON.parse(queryStr));
    const allBootcamps = await query;
    return res.status(200).json({
        success: true,
        count: allBootcamps.length,
        data: allBootcamps
    });
});


//@desc         GET A SINGLE BOOTCAMP
//@route        GET /api/v1/bootcamps/:id
//@access       Public
exports.getBootcampById = asyncHandler(async (req, res, next) => {
    const ID = req.params.id;
    const bootcampExists = await Bootcamp.findById(ID);
    if (!bootcampExists || bootcampExists.length === 0) {
        return next(new ErrorResponse(`Bootcamp not found with Id of ${ID}`, 404));
    }
    return res.status(200).json({
        success: true,
        data: bootcampExists
    });
});

//@desc         CREATE NEW BOOTCAMP
//@route        POST /api/v1/bootcamps
//@access       Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
    // const existingBootcamp = await Bootcamp.find({
    //     name: req.body.name
    // })
    // if (existingBootcamp && existingBootcamp.length > 0) {
    //     return res.status(200).json({
    //         success: true,
    //         data: null,
    //         message: 'Bootcamp already exists with this name.'
    //     });
    // }
    const newBootcamp = await Bootcamp.create(req.body);
    if (newBootcamp) {
        return res.status(201).json({
            success: true,
            message: 'Bootcamp created successfully.',
            data: newBootcamp
        });
    }
});

//@desc         UPDATE AN EXISTING BOOTCAMP
//@route        PUT /api/v1/bootcamps/:id
//@access       Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
    const ID = req.params.id;
    const bootcamp = await Bootcamp.findByIdAndUpdate(ID, req.body, {
        new: true,
        runValidators: true
    });
    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with Id of ${ID}`, 404));
    }
    return res.status(200).json({
        success: true,
        message: 'Bootcamp updated successfully',
        data: bootcamp
    });
});

//@desc         DELETE AN EXISTING BOOTCAMP
//@route        DELETE /api/v1/bootcamps/:id
//@access       Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
    const ID = req.params.id;
    const bootcamp = await Bootcamp.findByIdAndDelete(ID);
    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with Id of ${ID}`, 404));
    }
    res.status(200).json({
        success: true,
        message: 'Bootcamp deleted successfully',
        data: {}
    });
});



//@desc         GET BOOTCAMPS WITHIN A RADIUS
//@route        GET /api/v1/bootcamps/radius/:zipcode/:distance
//@access       Private
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
    const { zipcode, distance } = req.params;

    //Get Lat/Lng from geocoder
    const loc = await geocoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;

    // Calculate radius using radians
    //Divide distance by radius of earth
    //Earth radius is 3963 miles / 6378 kms
    const radius = distance / 3963;

    const bootcamps = await Bootcamp.find({
        location: {
            $geoWithin: { $centerSphere: [[lng, lat], radius] }
        }
    })

    res.status(200).json({
        success: true,
        count: bootcamps.length,
        data: bootcamps
    })

});