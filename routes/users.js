const router = require('express').Router();
const {
  getRegister,
  getLogin,
  postRegister,
  postLogin
} = require('../controllers/users');

router
  .route('/register')
  .get(getRegister)
  .post(postRegister);

router
  .route('/login')
  .get(getLogin)
  .post(postLogin);

module.exports = router;
