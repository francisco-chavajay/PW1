const Sequelize = require('sequelize');
const dbConfig = require('../config/db.config');
const userModel = require('../models/user.model');
const roleModel = require('../models/role.model');

const sequelizeConfig = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD,
    {
        host: dbConfig.HOST,
        dialect: dbConfig.dialect,
        pool: {
            max: dbConfig.pool.max,
            min: dbConfig.pool.min,
            acquire: dbConfig.pool.acquire,
            idle: dbConfig.pool.idle
        }
    }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelizeConfig;

db.user = userModel(sequelizeConfig, Sequelize);
db.role = roleModel(sequelizeConfig, Sequelize);

db.user.belongsToMany(db.role, {
    through: 'user_roles'
});

db.role.belongsToMany(db.user, {
    through: 'user_roles'
});

db.ROLES = ['user', 'admin', 'moderator'];

module.exports = db;