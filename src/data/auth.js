const cron = require('node-cron');
const utils = require('../utils');

const authUser = async (prisma, data) => {
  return prisma.users.findFirst({
    where: data,
  });
};

const findUserByUsername = async (prisma, username) => {
  return prisma.users.findUnique({
    where: {
      username: username,
    },
  });
};

const addUser = async (prisma, data) => {
  return prisma.users.create({
    data,
  });
};

const createSessionKey = async (prisma, data) => {
  const { userId, token } = data;
  return await prisma.session_keys.create({
    data: {
      session_key: token,
      user_id: userId,
      expire_at: new Date(Date.now() + 60 * 60 * 1000),
    },
  });
};

const deleteExpiredSessions = async (prisma) => {
  cron.schedule('*/10 * * * * *', async () => {
    await prisma.session_keys.deleteMany({
      where: {
        expire_at: {
          lt: new Date(),
        },
      },
    });
  });
};

const findUserByToken = async (prisma, token) => {
  return prisma.session_keys.findUnique({
    where: {
      session_key: token,
    },
  });
};

deleteExpiredSessions(prisma);

module.exports = utils.wrapExport(utils.dbQueryWrapper, {
  authUser,
  createSessionKey,
  findUserByUsername,
  addUser,
  findUserByToken,
});
