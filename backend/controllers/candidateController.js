const ErrorHandler = require("../services/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncError");
const Candidate = require("../models/candidateModel");

// Candidate signup
exports.signUp = catchAsyncErrors(async (req, res, next) => {
    try {
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

        if (!documents || documents.length < 2) {
            return next(new ErrorHandler("At least two documents are required", 400));
        }

        const candidate = await Candidate.create({
            firstName,
            lastName,
            email,
            dateOfBirth,
            address,
            sameAsResidential,
            permanentAddress: sameAsResidential ? address : permanentAddress,
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
