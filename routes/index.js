const router = require('express').Router();
const { getIndex } = require('../controllers/index');

router.route('/').get(getIndex);

module.exports = router;
