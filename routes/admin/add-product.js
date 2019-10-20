const router = require('express').Router();
const auth = require('../../middleware/auth');
const { postProduct } = require('../../controllers/admin/add-product');

router.route('/add-product').post(auth, postProduct);

module.exports = router;
