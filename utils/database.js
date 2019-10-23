const Sequelize = require('sequelize'),
  sequelize = new Sequelize('ecommerce-shop', 'root', 'password', {
    dialect: 'mysql',
    host: 'localhost'
  });

module.exports = sequelize;
global.sequelize = sequelize;
