require('dotenv').config();
const JWT = require('jsonwebtoken');
const db = require('../models');

const User = db.user;

const authJWT = {};

authJWT.verifyToken = (req, res, next) => {
    let token = req.headers['x-access-token'];

    if (!token) {
        return res.status(403).send({
            message: 'No token provided'
        });
    }

    JWT.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send({
                message: 'Unauthorized!'
            });
        }

        req.userId = decoded.id;
        next();
    });
};

authJWT.isAdmin = (req, res, next) => {
    User.findByPk(req.userId)
        .then(user => {
            user.getRoles()
                .then(roles => {
                    for (let i = 0; i < roles.length; i++) {
                        if (roles[i].name === 'admin') {
                            next();
                            return;
                        }
                    }

                    return res.status(403).send({
                        message: 'Admin role required'
                    });
                });
        });
};

authJWT.isModerator = (req, res, next) => {
    User.findByPk(req.userId)
        .then(user => {
            user.getRoles()
                .then(roles => {
                    for (let i = 0; i < roles.length; i++) {
                        if (roles[i].name === 'moderator') {
                            next();
                            return;
                        }
                    }

                    return res.status(403).send({
                        message: 'Moderator role required'
                    });
                });
        });
};

authJWT.isModeratorOrAdmin = (req, res, next) => {
    User.findByPk(req.userId)
        .then(user => {
            user.getRoles()
                .then(roles => {
                    for (let i = 0; i < roles.length; i++) {
                        if (roles[i].name === 'moderator' || roles[i].name === 'admin') {
                            next();
                            return;
                        }
                    }

                    return res.status(403).send({
                        message: 'Moderator or Admin role required'
                    });
                });
        });
};


module.exports = authJWT;