const login = {
  response: {
    200: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
        },
      },
    },
    401: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
        },
      },
    },
  },
  body: {
    type: 'object',
    properties: {
      username: { type: 'string', minLength: 1 },
      password: { type: 'string', minLength: 1 },
    },
    required: ['username', 'password'],
    additionalProperties: false,
  },
};

const register = {
  response: {
    200: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
        },
      },
    },
    401: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
        },
      },
    },
  },
  body: {
    type: 'object',
    properties: {
      username: { type: 'string', minLength: 1 },
      password: { type: 'string', minLength: 1 },
    },
    required: ['username', 'password'],
    additionalProperties: false,
  },
};

module.exports = {
  login,
  register,
};
