const isValidEmail = email => {
  return /^[^\s@]+@[^\@]+\.[^\s@]+$/.test(email);
};

module.exports = isValidEmail;
