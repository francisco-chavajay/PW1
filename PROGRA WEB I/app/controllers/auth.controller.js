require('dotenv').config();
const db = require('../models');
const JWT = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const User = db.user;

const authCrontroller = {};

authCrontroller.signin = (req, res) => {
    User.findOne({
        where: {
            username: req.body.username
        }
    }).then(user => {
        if (!user) {
            return res.status(404).send({
                message: 'User not found'
            });
        }

        const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

        if (!passwordIsValid) {
            return res.status(401).send({
                accessToken: null,
                message: 'Invalid password'
            });
        }

        const token = JWT.sign(
            { id: user.id },
            process.env.JWT_SECRET,
            {
                algorithm: 'HS256',
                allowInsecureKeySizes: true,
                expiresIn: 86400, //24 horas 
            }
        );

        let authorities = [];

        user.getRoles()
            .then(roles => {
                for (let i = 0; i < roles.length; i++) {
                    authorities.push(`ROLE_${roles[i].name.toUpperCase()}`);
                }

                res.status(200).send({
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    roles: authorities,
                    accessToken: token
                });
            });
    }).catch(err => {
        res.status(500).send({ message: err.message });
    });
};

module.exports = authCrontroller;
