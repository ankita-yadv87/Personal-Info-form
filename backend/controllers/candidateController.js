const upload = require('../config/cloudinaryConfig');
const ErrorHandler = require("../services/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncError");
const Candidate = require('../models/candidateModel');

// Signup Controller
exports.signUp = catchAsyncErrors(async (req, res, next) => {
    upload.array('documents', 2)(req, res, async function (err) {
        console.log("req",req)
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

            const documents = req.files.map(file => ({
                fileName: file.originalname,
                fileType: file.mimetype.includes('pdf') ? 'pdf' : 'image',
                fileUrl: file.path
            }));

            if (documents.length < 2) {
                return next(new ErrorHandler("At least two documents are required", 400));
            }

            const candidateData = {
                firstName,
                lastName,
                email,
                dateOfBirth: parsedDateOfBirth,
                address,
                sameAsResidential: JSON.parse(sameAsResidential),
                permanentAddress: JSON.parse(sameAsResidential) ? address : permanentAddress,
                documents
            };

            const candidate = await Candidate.create(candidateData);

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



// Update Profile Controller
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

    const parsedAddress = typeof address === 'string' ? { address } : address;
    const parsedPermanentAddress = typeof permanentAddress === 'string' ? { address: permanentAddress } : permanentAddress;

    const updatedData = {
        firstName,
        lastName,
        email,
        dateOfBirth,
        address: parsedAddress,
        sameAsResidential: JSON.parse(sameAsResidential),
        permanentAddress: JSON.parse(sameAsResidential) ? parsedAddress : parsedPermanentAddress,
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

// Delete Candidate Controller (unchanged)
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
