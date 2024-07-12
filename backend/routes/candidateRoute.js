const express = require("express");
const {
    signUp,
    getCandidateDetail,
    updateProfile,
    deleteCandidate
} = require("../controllers/candidateController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router.route("/signup").post(signUp);

// router.route("/candidates").get(isAuthenticatedUser, authorizeRoles("admin"), getAllCandidates);

router
    .route("/candidate/:id")
    // .get(getCandidateDetail)
    // .put(updateProfile)
    // .delete(deleteCandidate);

// router
//     .route("/candidate/:id/admin")
//     .get(isAuthenticatedUser, authorizeRoles("admin"), getSingleCandidate);

module.exports = router;
