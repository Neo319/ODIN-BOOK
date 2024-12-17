require("dotenv").config();
const { faker } = require("@faker-js/faker");
const { execSync } = require("child_process");

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

// important TODO: reset prisma database here.
console.log("resetting database...");
execSync("npx prisma migrate reset").then(() => {
  console.log("database reset complete.");
});

// creating 5 random users
const dbSeed = (async () => {
  console.log("creating random users...");
  try {
    for (i = 0; i < 15; i++) {
      // create 15 users
      await prisma.user.create({
        data: {
          id: faker.string.uuid(),
          username: faker.internet.username(),
          password: faker.internet.password(),

          // TODO
          // avatar: faker.image.avatar(),  -- requires different schema

          createdAt: faker.date.past(),
        },
      });

      // create 15 posts
      // include: id, content, creatorId(random select..?), (no comments or likes yet)

      // first ... create one post?
      await prisma.post.create({
        id: faker.string.uuid(),
        content: faker.hacker.phrase(),
        // creatorId: ???
      });
    }
  } catch (err) {
    console.error(err.message);
    return false;
  }
})();

console.log("done.");
