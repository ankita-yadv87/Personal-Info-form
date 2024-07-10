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
    file: {
        type: Buffer, // Assuming the file will be stored as binary data
        required: [true, "Please upload the file"],
    }
});

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
        validate: [validator.isEmail, "Please enter a valid email"],
    },
    dateOfBirth: {
        type: Date,
        required: [true, "Please enter your date of birth"],
        validate: {
            validator: function(value) {
                const ageDiff = Date.now() - value.getTime();
                const ageDate = new Date(ageDiff);
                return Math.abs(ageDate.getUTCFullYear() - 1970) >= 18;
            },
            message: "Age must be at least 18 years"
        }
    },
    address: {
        street1: {
            type: String,
            required: [true, "Please enter your residential street address"],
        },
        street2: {
            type: String,
        },
        city: {
            type: String,
            required: [true, "Please enter your city"],
        },
        state: {
            type: String,
            required: [true, "Please enter your state"],
        },
        zip: {
            type: String,
            required: [true, "Please enter your zip code"],
        }
    },
    sameAsResidential: {
        type: Boolean,
        default: false,
    },
    permanentAddress: {
        street1: {
            type: String,
            required: function() { return !this.sameAsResidential; },
        },
        street2: {
            type: String,
        },
        city: {
            type: String,
            required: function() { return !this.sameAsResidential; },
        },
        state: {
            type: String,
            required: function() { return !this.sameAsResidential; },
        },
        zip: {
            type: String,
            required: function() { return !this.sameAsResidential; },
        }
    },
    documents: {
        type: [documentSchema],
        validate: {
            validator: function(value) {
                return value.length >= 2;
            },
            message: "At least two documents are required"
        }
    }
});

module.exports = mongoose.model("Candidate", candidateSchema);
