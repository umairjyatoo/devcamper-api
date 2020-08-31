
//@desc         GET ALL BOOTCAMPS
//@route        GET /api/v1/bootcamps
//@access       Public
exports.getAllBootcamps = async (req, res, next) => {
    res.status(200).json({
        success: true,
        message: 'Show all bootcamps'
    });
}

//@desc         GET A SINGLE BOOTCAMP
//@route        GET /api/v1/bootcamps/:id
//@access       Public
exports.getBootcampById = async (req, res, next) => {
    res.status(200).json({
        success: true,
        message: `Show the bootcamp with id ${req.params.id}`
    });
}

//@desc         CREATE NEW BOOTCAMP
//@route        POST /api/v1/bootcamps
//@access       Private
exports.createBootcamp = async (req, res, next) => {
    res.status(201).json({
        success: true,
        message: 'Bootcamp created successfully'
    });
}

//@desc         UPDATE AN EXISTING BOOTCAMP
//@route        PUT /api/v1/bootcamps/:id
//@access       Private
exports.updateBootcamp = async (req, res, next) => {
    res.status(200).json({
        success: true,
        message: 'Bootcamp updated successfully'
    });
}

//@desc         DELETE AN EXISTING BOOTCAMP
//@route        DELETE /api/v1/bootcamps/:id
//@access       Private
exports.deleteBootcamp = async (req, res, next) => {
    res.status(200).json({
        success: true,
        message: 'Bootcamp deleted successfully'
    });
}

