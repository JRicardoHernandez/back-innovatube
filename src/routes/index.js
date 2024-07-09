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

router.post('/v1/reCaptcha',async function(req,res){
    const response_key = req.body["recaptcha"];
    const secret_key = "6LeJNAwqAAAAAAMBTK3Tcyqidc5777YTMXthA3Cg";
    const options = {
        url: `https://www.google.com/recaptcha/api/siteverify?secret=${secret_key}&response=${response_key}`,
        headers: { "Content-Type": "application/x-www-form-urlencoded", 'json': true }
    }
    try {
        const re = await request(options);
        console.log(re.body.success);
        if (!JSON.parse(re.body)['success']) {
           return res.send({ response: "Failed" });
        }
        return res.send({ response: "Successful" });
        } catch (error) {
           return res.send({ response: "Failed" });
        }
});

module.exports = router;