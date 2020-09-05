const Bootcamp = require('./../Models/Bootcamp')
const ErrorResponse = require('./../utils/errorResponse')
const asyncHandler = require('../Middlewares/async')
const geocoder = require('../utils/geocoder')
const path = require('path');
const fs = require('fs');

//@desc         GET ALL BOOTCAMPS WITH ADVANCE FILTERING
//@route        GET /api/v1/bootcamps/...
//@access       Public
exports.getAllBootcamps = asyncHandler(async (req, res, next) => {
    return res.status(200).json(res.advancedResults);
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

    //Add user to req.body
    req.body.user = req.user.id

    //Check for the published bootcamp
    const publishedBootcamp = await Bootcamp.findOne({ user: req.user.id })

    //If the user is not an admin, they can only add one bootcamp
    if (publishedBootcamp && req.user.role !== 'admin') {
        return next(new ErrorResponse(`The user with id ${req.user.id} has already published a bootcamp`, 400))
    }

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
    const bootcamp = await Bootcamp.findById(ID);
    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with Id of ${ID}`, 404));
    }
    bootcamp.remove();
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


//@desc         UPLOAD PHOTO FOR BOOTCAMP
//@route        PUT /api/v1/bootcamps/:id/photo
//@access       Private
exports.bootcampUploadPhoto = asyncHandler(async (req, res, next) => {
    // let dirName = path.normalize('/public/uploads');
    // if (!fs.existsSync(dirName)) {
    //     fs.mkdirSync(dirName)
    // }
    const ID = req.params.id;
    const bootcamp = await Bootcamp.findById(ID);
    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with Id of ${ID}`, 404));
    }
    if (!req.files) {
        return next(new ErrorResponse(`Please upload a file`, 400));
    }

    const file = req.files.file

    //Make sure the uploaded file is a photo
    if (!file.mimetype.startsWith('image')) {
        return next(new ErrorResponse(`Please upload an image file`, 400));

    }

    //Check file size
    if (file.size > process.env.MAX_FILE_UPLOAD) {
        return next(new ErrorResponse(`Please upload an image file of size less than ${process.env.MAX_FILE_UPLOAD}`, 400));
    }

    //Create custom file name
    file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`

    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
        if (err) {
            console.error(err)
            return next(new ErrorResponse(`Problem with file upload`, 500));
        }

        await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name })
        res.status(200).json({
            success: true,
            message: 'Photo uploaded successfully',
            data: file.name
        });
    })

});