const express = require('express');
const router = express.Router();
const request = require('request');

const firebaseAuthController = require('../controllers/firebase-auth-controller');
const userController = require('../controllers/UserController');
// const captcha = require('../config/captcha');
const checkIfAuthenticated = require('../middlewares/auth-middleware');

// router.post('/v1/reCaptcha', captcha.createAssessment);

router.post('/v1/register', firebaseAuthController.registerUser);
router.post('/v1/login', firebaseAuthController.loginUser);
router.post('/v1/logout', firebaseAuthController.logoutUser);
router.post('/v1/reset-password', firebaseAuthController.resetPassword);

router.post('/v1/createFavorite', checkIfAuthenticated, userController.createFavorite);
router.post('/v1/getFavorite', checkIfAuthenticated, userController.getFavorite);
router.post('/v1/deleteFavorite', checkIfAuthenticated, userController.deleteFavorite);
router.post('/v1/getUserByEmail', checkIfAuthenticated, userController.getUserByEmail);

router.post('/v1/reCaptcha',function(req,res){
    /* Browse generates the google-recapcha-response key on form submit.
    if its blank or null means user has not selected,
    the captcha then blow error loop occurs.*/
    if(req.body['recaptcha'] === undefined || req.body['recaptcha'] === '' || req.body['recaptcha'] === null) {
    return res.status(400).json({"responseCode" : 1,"responseDesc" : "Validate captcha first"});
    }
     
    let secretKey = "6Leb4gsqAAAAALccRM86Qy0frmwTydWdF_qYnTX3"; // Put your secret key here.
    let verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['recaptcha'] + "&remoteip=" + req.socket.remoteAddress;
    // Google will respond with success or error scenario on url request sent.
    // console.log(req.socket, req.ip, verificationUrl);
    request(verificationUrl,function(error,response,body) {
        body = JSON.parse(body);
        // Success will be true or false depending upon captcha validation.
        if(body.success !== undefined && !body.success) {
        return res.status(400).json({"responseCode" : 1,"responseDesc" : "Captcha verification has Failed. Try again."});
        }
        res.status(400).json({"responseCode" : 0,"responseDesc" : "Captcha validated succesfully!"});
    });
});

module.exports = router;