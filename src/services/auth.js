const schemas = require('../schemas/auth');
const { generateToken } = require('../utils');
const authDb = require('../data/auth');

module.exports = async (fastify, opts) => {
  fastify.post('/login', { schema: schemas.login }, async (request, reply) => {
    const user = await authDb.authUser(prisma, request.body);
    if (user) {
      const token = generateToken(32);
      await authDb.createSessionKey(prisma, { token, userId: user['id'] });
      reply
        .setCookie('authToken', token, {
          httpOnly: true,
          secure: true,
          path: '/',
          maxAge: 60 * 60,
        })
        .status(200)
        .send({ message: 'Login successful' });
    } else {
      reply.status(401).send({ message: 'Login failed' });
    }
  });

  fastify.post(
    '/register',
    { schema: schemas.register },
    async (request, reply) => {
      const data = request.body;
      const user = await authDb.findUserByUsername(prisma, data.username);
      if (!user) {
        await authDb.addUser(prisma, data);
        reply.status(200).send({ message: 'Register successful' });
      } else {
        reply.status(401).send({ message: 'User already exists' });
      }
    }
  );
};
