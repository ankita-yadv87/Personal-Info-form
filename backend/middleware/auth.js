const ErrorHandler = require("../services/errorhandler");
const catchAsyncErrors = require("./catchAsyncError");
const jwt = require("jsonwebtoken");
const User = require("../models/candidateModel");

exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  // console.log("req.cookies",req.cookies)
  // const {token}  = req.cookies; //taking token from cookies
  const { authorization } = req.headers; // Take the token from headers

  if (!authorization) {
    return next(new ErrorHandler("Please Login to access this resource", 401));
  }

  // Verifying token with secret key
  const token = authorization.split(' ')[1]; // Extract token from "Bearer <token>"
  const data = jwt.verify(token, process.env.JWT_SECRET);

  req.user = await User.findById(data.id);

  next();

 // console.log(token);
  // if (!token) {
  //   return next(new ErrorHandler("Please Login to access this resource", 401));
  // }

  //verifying token with secret key 
  // const data = jwt.verify(token, process.env.JWT_SECRET);
  
  // req.user = await User.findById(data.id);

  // next();
});

exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
 
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role: ${req.user.role} is not allowed to access this resouce `,
          403
        )
      );
    }
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  };
};
