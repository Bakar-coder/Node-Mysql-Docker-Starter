const config = require('config'),
  Jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token)
    return res
      .status(404)
      .json({ success: false, msg: 'Access denied. No token provided...' });

  try {
    const decoded = Jwt.verify(token, config.get('jwtPrivateKey'));
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ success: false, msg: 'Invalid token!' });
  }
};
