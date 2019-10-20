const Sequelize = require('sequelize'),
  Joi = require('joi');

const Product = sequelize.define('product', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    unique: true,
    primaryKey: true
  },
  title: { type: Sequelize.STRING, allowNull: false },
  description: { type: Sequelize.TEXT, allowNull: false },
  price: { type: Sequelize.DOUBLE, allowNull: false },
  image: { type: Sequelize.STRING, allowNull: false }
});

const validateProduct = product => {
  const schema = {
    title: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required()
  };

  return Joi.validate(product, schema);
};

exports.validateProduct = validateProduct;
exports.Product = Product;
