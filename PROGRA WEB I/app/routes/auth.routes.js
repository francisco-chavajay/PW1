const express = require('express');
const authCrontroller = require('../controllers/auth.controller');

const authRouter = express();

authRouter.post('/api/authentication/signin', authCrontroller.signin);

authRouter.get('/', (req, res) => {
    res.status(200).send({
        message: "Welcome to API Rest by Andreé"
    });
});

module.exports = authRouter;