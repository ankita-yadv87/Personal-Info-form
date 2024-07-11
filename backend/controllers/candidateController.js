const upload = require('../config/cloudinaryConfig');
const ErrorHandler = require("../services/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncError");
const Candidate = require('../models/candidateModel');

exports.signUp = catchAsyncErrors(async (req, res, next) => {
    upload.array('documents', 2)(req, res, async function (err) {
        if (err) {
            return next(new ErrorHandler(err.message, 500));
        }

        try {
            const {
                firstName,
                lastName,
                email,
                dateOfBirth, 
                address,
                sameAsResidential,
                permanentAddress
            } = req.body;

            const parsedDateOfBirth = new Date(dateOfBirth);
            if (isNaN(parsedDateOfBirth)) {
                return next(new ErrorHandler("Please enter a valid date of birth in format YYYY-MM-DD", 400));
            }

            const parsedAddress = typeof address === 'string' ? JSON.parse(address) : address;
            const parsedSameAsResidential = JSON.parse(sameAsResidential);
            let parsedPermanentAddress = {};

            if (!parsedSameAsResidential) {
                parsedPermanentAddress = typeof permanentAddress === 'string' ? JSON.parse(permanentAddress) : permanentAddress;
                if (!parsedPermanentAddress.street1 || !parsedPermanentAddress.street2) {
                    return next(new ErrorHandler("Permanent address is required when it is not the same as residential address", 400));
                }
            }

            const documents = req.files.map(file => ({
                fileName: file.originalname,
                fileType: file.mimetype.includes('pdf') ? 'pdf' : 'image',
                fileUrl: file.path
            }));

            if (documents.length < 2) {
                return next(new ErrorHandler("At least two documents are required", 400));
            }

            const candidate = await Candidate.create({
                firstName,
                lastName,
                email,
                dateOfBirth: parsedDateOfBirth,
                address: parsedAddress,
                sameAsResidential: parsedSameAsResidential,
                permanentAddress: parsedSameAsResidential ? parsedAddress : parsedPermanentAddress,
                documents
            });

            res.status(201).json({
                success: true,
                candidate,
            });
        } catch (error) {
            console.error(error);
            next(new ErrorHandler(error.message, 500));
        }
    });
});


// Get Candidate Detail
exports.getCandidateDetail = catchAsyncErrors(async (req, res, next) => {
    const candidate = await Candidate.findById(req.params.id);

    if (!candidate) {
        return next(new ErrorHandler("Candidate not found", 404));
    }

    res.status(200).json({
        success: true,
        candidate,
    });
});

// Update Candidate Profile
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
    const {
        firstName,
        lastName,
        email,
        dateOfBirth,
        address,
        sameAsResidential,
        permanentAddress,
        documents
    } = req.body;

    const updatedData = {
        firstName,
        lastName,
        email,
        dateOfBirth,
        address,
        sameAsResidential,
        permanentAddress: sameAsResidential ? address : permanentAddress,
        documents
    };

    const candidate = await Candidate.findByIdAndUpdate(req.params.id, updatedData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    if (!candidate) {
        return next(new ErrorHandler("Candidate not found", 404));
    }

    res.status(200).json({
        success: true,
        candidate,
    });
});

// Get all Candidates
// exports.getAllCandidates = catchAsyncErrors(async (req, res, next) => {
//     const candidates = await Candidate.find();

//     res.status(200).json({
//         success: true,
//         candidates,
//     });
// });

// Get single Candidate
// exports.getSingleCandidate = catchAsyncErrors(async (req, res, next) => {
//     const candidate = await Candidate.findById(req.params.id);

//     if (!candidate) {
//         return next(new ErrorHandler("Candidate not found", 404));
//     }

//     res.status(200).json({
//         success: true,
//         candidate,
//     });
// });

// Delete Candidate
exports.deleteCandidate = catchAsyncErrors(async (req, res, next) => {
    const candidate = await Candidate.findById(req.params.id);

    if (!candidate) {
        return next(new ErrorHandler("Candidate not found", 404));
    }

    await candidate.deleteOne();

    res.status(200).json({
        success: true,
        message: "Candidate Deleted Successfully",
    });
});
