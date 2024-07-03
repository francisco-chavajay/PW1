const express = require('express');
const verifySignUp = require('../middleware/verifySignUp');
const authJWT = require('../middleware/authJWT');
const userController = require('../controllers/user.controller');

const userRouter = express();

userRouter.post(
    '/api/user/signup',
    [
        verifySignUp.checkDuplicateUsernameOrEmail,
        verifySignUp.checkRolesExisted
    ],
    userController.signup
);

userRouter.get('/api/test/all', userController.allAccess);

userRouter.get(
    '/api/test/user',
    authJWT.verifyToken,
    userController.userBoard
);

userRouter.get(
    '/api/test/moderator',
    [
        authJWT.verifyToken,
        authJWT.isModerator
    ],
    userController.moderatorBoard
);

userRouter.get(
    '/api/test/admin',
    [
        authJWT.verifyToken,
        authJWT.isAdmin
    ],
    userController.adminBoard
);

module.exports = userRouter;