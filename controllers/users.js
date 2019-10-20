const { User, validateRegister, validateLogin } = require('../models/User');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const validEmail = require('../utils/emailValidation');

// User registration api
exports.getRegister = async (req, res) => {
  res.json('Register user.');
};

/*=====================================================================================================
                                      User registration api endpoint
=====================================================================================================*/
exports.postRegister = async (req, res) => {
  let {
    first_name,
    last_name,
    username,
    email,
    passwd,
    passwd2,
    is_admin
  } = req.body;

  // input validation
  const { error } = validateRegister(req.body);
  if (error) return res.status(400).json(error.details[0].message);

  if (!validEmail(email))
    return res.status(400).json({
      success: false,
      msg: 'entered an invalid email address, enter a correct email and retry.'
    });

  if (!passwd2)
    return res.status(400).json({
      success: false,
      msg: 'Confirm password field is not allowed to be empty!'
    });

  if (passwd !== passwd2)
    return res.status(400).json({
      success: false,
      msg: "passwords don't match, please match your password."
    });

  // get user from database
  let user = await User.findOne({ where: { email: email } });
  if (user)
    return res.status(400).json({
      success: false,
      msg: 'User with the same credentails already exists...'
    });

  // define user avatar
  const avatar = gravatar.url(email, { s: '200', r: 'retro', d: 'mm' });

  // password incryption
  const salt = await bcrypt.genSalt(12);
  passwd = await bcrypt.hash(passwd, salt);

  // create user and save user to the database
  user = User.create({
    first_name: first_name,
    last_name: last_name,
    username: username,
    email: email,
    avatar,
    passwd: passwd,
    is_admin
  });

  return res.json({ success: true, msg: 'user registration successful.' });
};

exports.getLogin = async (req, res) => {};

/*====================================================================================================== 
                                            User login endpoint 
======================================================================================================*/
exports.postLogin = async (req, res) => {
  const { email, passwd } = req.body;

  // input validation
  const { error } = validateLogin(req.body);
  if (error) return res.status(400).json(error.details[0].message);

  // find user
  let user = await User.findOne({ where: { email: email } });

  if (!user)
    return res.status(400).json({
      success: false,
      msg: 'Invalid email or password.'
    });

  // verify user password
  const validPassword = await bcrypt.compare(passwd, user.passwd);

  //  login user

  if (!validPassword)
    return res.status(400).json({
      success: false,
      msg: 'Invalid email or password.'
    });

  user = {
    id: user.id,
    firstName: user.first_name,
    lastName: user.last_name,
    username: user.username,
    email: user.email,
    avatar: user.avatar,
    isAdmin: user.is_admin,
    created: user.createdAt
  };

  // create token
  const token = await jwt.sign(user, config.get('jwtPrivateKey'), {
    expiresIn: 3600
  });

  // add token to headers and return
  return res
    .header('x-auth-token', token)
    .header('access-control-expose-headers', 'x-auth-token')
    .json({ success: true, msg: 'Login successful', token });
};
