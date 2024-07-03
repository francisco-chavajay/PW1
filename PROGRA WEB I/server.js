require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./app/models');

const server = express();

var corsConfig = {
    origin: process.env.CLIENT_HOST //puerto cliente
};

server.use(cors(corsConfig));
server.use(express.json()); //Leer peticiones de tipo JSON
server.use(express.urlencoded({ extended: true })); //Leer peticiones de tipo Form
server.use(require('./app/routes/auth.routes'));
server.use(require('./app/routes/user.routes'));

const Role = db.role;

db.sequelize.sync({ force: true })
    .then(() => {
        console.log('Drop and Resync DB');
        initializeRoles();
    });

function initializeRoles() {
    Role.create({
        id: 1,
        name: 'user'
    });

    Role.create({
        id: 2,
        name: 'moderator'
    });

    Role.create({
        id: 3,
        name: 'admin'
    });
}

const PORT = process.env.PORT || 8082;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});