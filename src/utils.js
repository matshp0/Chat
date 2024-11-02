const crypto = require('crypto');

const generateToken = (size) => {
  const key = crypto.randomBytes(size);
  return key.toString('hex');
};

const dbQueryWrapper =
  (callback) =>
  async (...args) => {
    try {
      console.log(`Calling ${callback.name} with arguments ${args}`);
      return callback(...args);
    } catch (error) {
      console.error(`Error retrieving messages in ${callback.name}`);
      throw error;
    }
  };

const wrapExport = (wrapper, obj) => {
  const result = {};
  for (const func in obj) {
    result[func] = wrapper(obj[func]);
  }
  return result;
};

const checkRequiredCookies = (...cookies) => {
  return async (request, reply) => {
    const missingCookies = [];
    for (const cookie of cookies) {
      if (!request.cookies[cookie]) {
        missingCookies.push(cookie);
      }
    }
    if (missingCookies.length) {
      reply
        .status(400)
        .send({ message: `Missing required cookies: ${missingCookies}` });
    }
  };
};

module.exports = {
  generateToken,
  dbQueryWrapper,
  wrapExport,
  checkRequiredCookies,
};
