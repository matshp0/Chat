const path = require('path');
const prisma = require('./data/prisma');

require('dotenv').config({ path: '../.env' });

const fastify = require('fastify')({
  logger: true,
});

fastify
  .register(require('@fastify/cookie'))
  .register(require('@fastify/websocket'))
  .register(require('@fastify/static'), {
    root: path.join(__dirname, '../public'),
  });

fastify
  .register(require('./services/auth'))
  .register(require('./services/chat'));

fastify.listen({ port: process.env.PORT, host: '0.0.0.0' }, (err, address) => {
  if (err) throw err;
  console.log(`Server is running on ${address}`);
});
