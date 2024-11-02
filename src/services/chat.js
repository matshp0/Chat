const schemas = require('../schemas/chat');
const chatQueries = require('../data/chat');
const authQueries = require('../data/auth');
const utils = require('../utils');

module.exports = async (fastify, opts) => {
  fastify.get(
    '/chat',
    {
      schema: schemas.getMessages,
      preValidation: utils.checkRequiredCookies('authToken'),
    },
    async (request, reply) => {
      const { authToken } = request.cookies;
      const user = await authQueries.findUserByToken(prisma, authToken);
      if (user) {
        const messages = await chatQueries.getAllMessages(prisma);
        reply.send(messages);
      } else {
        reply.status(401).send({ message: 'User is not authorized' });
      }
    }
  );

  fastify.post(
    '/send-message',
    {
      schema: schemas.writeMessage,
      preValidation: utils.checkRequiredCookies('authToken'),
    },
    async (request, reply) => {
      const { authToken } = request.cookies;
      const user = await authQueries.findUserByToken(prisma, authToken);
      if (user) {
        const userId = user['user_id'];
        const content = request.body.content;
        await chatQueries.writeMessage(prisma, { userId, content });
        reply.send({ message: 'Message sent successfully' });
      } else {
        reply.status(403).send({ message: 'Auth token is expired or invalid' });
      }
    }
  );

  fastify.get(
    '/ws',
    { websocket: true, preValidation: utils.checkRequiredCookies('authToken') },
    async (socket, req) => {
      const { authToken } = req.cookies;
      const user = await authQueries.findUserByToken(prisma, authToken);
      if (!user) {
        socket.close();
        return;
      }
      const userId = user['user_id'];
      socket.on('message', async (message) => {
        try {
          const messageJson = schemas.messageParser(message.toString());
          if (messageJson === undefined) {
            socket.send(`Error : ${schemas.messageParser.message}`);
            return;
          }
          const { username } = await chatQueries.findUsernameById(prisma, {
            userId,
          });
          const { content } = messageJson;
          const { timestamp } = await chatQueries.writeMessage(prisma, {
            userId,
            content,
          });
          for (const connection of fastify.websocketServer.clients) {
            connection.send(JSON.stringify({ username, content, timestamp }));
          }
        } catch (error) {
          console.log(error);
        }
      });
    }
  );
};
