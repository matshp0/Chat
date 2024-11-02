const utils = require('./../utils');

const getAllMessages = async (prisma) => {
  const messages = await prisma.messages.findMany({
    select: {
      timestamp: true,
      content: true,
      users: {
        select: {
          username: true,
        },
      },
    },
  });
  return messages.map((message) => ({
    username: message.users.username,
    timestamp: message.timestamp,
    content: message.content,
  }));
};

const writeMessage = async (prisma, data) => {
  console.log(data);
  const { userId, content } = data;
  return prisma.messages.create({
    data: {
      sender_id: userId,
      content: content,
    },
  });
};

const findUsernameById = async (prisma, data) => {
  return prisma.users.findUnique({
    where: {
      id: data.userId,
    },
    select: {
      username: true,
    },
  });
};

module.exports = utils.wrapExport(utils.dbQueryWrapper, {
  getAllMessages,
  writeMessage,
  findUsernameById,
});
