const Ajv = require('ajv/dist/jtd');
const ajv = new Ajv();

const message = {
  properties: {
    content: { type: 'string' },
  },
};

const messageParser = ajv.compileParser(message);

const getMessages = {
  response: {
    200: {
      type: 'array',
      items: {},
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
};

const writeMessage = {
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
      content: {
        type: 'string',
      },
    },
    required: ['content'],
  },
};

module.exports = {
  getMessages,
  writeMessage,
  messageParser,
};
