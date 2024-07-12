const mongoose = require("mongoose");
const validator = require("validator");

// Document schema
const documentSchema = new mongoose.Schema({
    fileName: {
        type: String,
        required: [true, "Please provide the file name"],
    },
    fileType: {
        type: String,
        required: [true, "Please specify the file type"],
        enum: ['image', 'pdf'],
    },
    fileUrl: {
        type: String, // URL to the file on Cloudinary
        required: [true, "Please upload the file"],
    }
});

// Address schema
const addressSchema = new mongoose.Schema({
    address: {
        type: String,
        required: [true, "Please enter your address"]
    }
}, { _id: false });

// Candidate schema
const candidateSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "Please enter your first name"],
    },
    lastName: {
        type: String,
        required: [true, "Please enter your last name"],
    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
        unique: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            "Please add a valid email address",
        ],
    },
    dateOfBirth: {
        type: Date,
        required: [true, "Please enter your date of birth"],
        validate: {
            validator: function (value) {
                const ageDiff = Date.now() - value.getTime();
                const ageDate = new Date(ageDiff);
                return Math.abs(ageDate.getUTCFullYear() - 1970) >= 18;
            },
            message: "Age must be at least 18 years",
        },
    },
    address: {
        type: addressSchema,
        required: [true, "Please enter your address"],
    },
    sameAsResidential: {
        type: Boolean,
        required: [true, "Please specify if permanent address is the same as residential address"],
    },
    permanentAddress: {
        type: addressSchema,
        required: function() {
            return !this.sameAsResidential;
        },
        validate: {
            validator: function(value) {
                if (this.sameAsResidential) {
                    return true; // Skip validation if sameAsResidential is true
                }
                return value && value.address; // Validate only if sameAsResidential is false
            },
            message: "Permanent address is required when it is not the same as residential address"
        }
    },
    documents: [documentSchema],
});

module.exports = mongoose.model("Candidate", candidateSchema);
