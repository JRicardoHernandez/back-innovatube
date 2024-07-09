const express = require('express');
const router = express.Router();

const firebaseAuthController = require('../controllers/firebase-auth-controller');
const userController = require('../controllers/UserController');
const checkIfAuthenticated = require('../middlewares/auth-middleware');

router.post('/v1/register', firebaseAuthController.registerUser);
router.post('/v1/login', firebaseAuthController.loginUser);
router.post('/v1/logout', firebaseAuthController.logoutUser);
router.post('/v1/reset-password', firebaseAuthController.resetPassword);

router.post('/v1/getUserByEmail', checkIfAuthenticated, userController.getUserByEmail);

module.exports = router;