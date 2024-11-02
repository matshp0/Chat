const { PrismaClient } = require('@prisma/client');

let prisma;

if (!global.prisma) {
  prisma = new PrismaClient({
    errorFormat: 'pretty',
  });
  global.prisma = prisma;
} else {
  prisma = global.prisma;
}

module.exports = prisma;
