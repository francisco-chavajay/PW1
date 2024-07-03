const db = require('../models');
const bcrypt = require('bcryptjs');
const Op = db.Sequelize.Op;

const User = db.user;
const Role = db.role;

const userController = {};

userController.signup = async (req, res) => {

    let transaction = await db.sequelize.transaction();

    try {
        const user = await User.create({
            username: req.body.username,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 8)
        }, { transaction });

        if (req.body.roles) {
            const roles = await Role.findAll({
                where: {
                    name: {
                        [Op.or]: req.body.roles
                    }
                }
            }, { transaction });

            await user.setRoles(roles, { transaction });
        }
        else {
            await user.setRoles([1], { transaction });
        }

        await transaction.commit();

        res.status(201).send({
            message: 'The user was registered successfully :)'
        });
    }
    catch (err) {
        if (transaction) {
            await transaction.rollback();
        }

        res.status(500).send({
            message: err.message
        });
    }
};

userController.allAccess = (req, res) => {
    res.status(200).send("Public Content.");
};

userController.userBoard = (req, res) => {
    res.status(200).send("User Content.");
};

userController.adminBoard = (req, res) => {
    res.status(200).send("Admin Content.");
};

userController.moderatorBoard = (req, res) => {
    res.status(200).send("Moderator Content.");
};

module.exports = userController;
