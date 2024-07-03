const db = require('../models');

const ROLES = db.ROLES;
const User = db.user;

const verifySignUp = {};

verifySignUp.checkDuplicateUsernameOrEmail = (req, res, next) => {
    //Buscando si ya existe el username
    User.findOne({
        where: {
            username: req.body.username
        }
    }).then(user => {
        if (user) {
            return res.status(400).json({
                message: 'Ups! Username is already in use, please try using another username'
            });
        }
    });

    //Buscando si ya existe el email
    User.findOne({
        where: {
            email: req.body.email
        }
    }).then(user => {
        if (user) {
            return res.status(400).send({
                message: 'Ups! Email is already in use, please try using another email'
            });
        }
    });

    //Sino encuentra un username o un email el middleware avanza
    next();
};

verifySignUp.checkRolesExisted = (req, res, next) => {
    if (req.body.roles) {
        for (let i = 0; i < req.body.roles.length; i++) {
            if (!ROLES.includes(req.body.roles[i])) {
                return res.status(400).send({
                    message: `Failed! ${req.body.roles[i]} isn't a valid role`
                });
            }
        }
    }

    next();
};

module.exports = verifySignUp;
