const Sequelize = require('sequelize');
const sequelize = new Sequelize('node_complete_guide', 'node_sql', 'password', {
  dialect: 'mysql',
  host: 'localhost'
});
module.exports = sequelize;
global.sequelize = sequelize;
