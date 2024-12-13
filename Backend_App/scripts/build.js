require("dotenv").config();
const { faker } = require("@faker-js/faker");

// SET UP DB for various environments.
const prisma = (() => {
  const { PrismaClient } = require("@prisma/client");
  const databaseUrl = process.env.DATABASE_URL;
  return new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
  });
})();

// creating 5 random users
const dbSeed = (async () => {
  console.log("creating random users...");
  try {
    for (i = 0; i < 5; i++) {
      await prisma.user.create({
        data: {
          id: faker.string.uuid(),
          username: faker.internet.username(),
          password: faker.internet.password(),

          createdAt: faker.date.past(),
        },
      });
    }
  } catch (err) {
    console.error(err.message);
    return false;
  }
})();

console.log("done.");
