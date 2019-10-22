const { Product, validateProduct } = require('../../models/Product');

exports.postProduct = async (req, res) => {
  if (!req.user.isAdmin)
    return res.status(403).json({
      success: false,
      msg: 'Access denied! - only admin users can add products...'
    });

  const { title, price, description } = req.body;
  const images = req.files;

  if (!images)
    return res
      .status(400)
      .json({ success: false, msg: 'image feild is not allowed to be empty!' });

  const { error } = validateProduct(req.body);
  if (error) return res.status(400).json(error.details[0].message);

  let image = images.image;
  const imgSize = 1024 * 1024 * 5;

  if (
    image.mimetype !== 'image/png' &&
    image.mimetype !== 'image/jpg' &&
    image.mimetype !== 'image/jpeg'
  )
    return res.status(400).json({
      success: false,
      msg: 'Un supported image file. should upload only png, jpeg, jpg images'
    });

  if (image.size > imgSize)
    return res.status(400).json({
      success: false,
      msg: 'image size too big! - it should be less than or equal to 5mb.'
    });

  const imgName = `${Date.now() + image.name}`;

  image.name = imgName;

  let product = await Product.findOne({ where: { title } });
  if (product)
    return res.status(400).json({
      success: false,
      msg: 'product with the same title exists...'
    });

  image.name = `${Date.now()}-${image.name}`;

  await image.mv(`./uploads/${imgName}`);
  product = await Product.create({
    title,
    description,
    price,
    image: image.name,
    userId: req.user.id
  });

  res.json({ success: true, msg: 'Add product successfully...', product });
};
