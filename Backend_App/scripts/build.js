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

// storing information for later
let userIdList = [];

// 1. reset any existing database
try {
  // important TODO: reset prisma database here.
  console.log("resetting database...");
  const result = execSync("npx prisma migrate reset --force");
  console.log(result);
  console.log("database reset complete.");
} catch (err) {
  console.error("error resetting db - ", err.message);
  return false;
}

// 2. seed database with sample data
const dbSeed = (async () => {
  console.log("creating random users...");
  try {
    for (i = 0; i < 15; i++) {
      const id = faker.string.uuid();

      // create 15 users
      await prisma.user.create({
        data: {
          id: id,
          username: faker.internet.username(),
          password: faker.internet.password(),

          // TODO
          // avatar: faker.image.avatar(),  -- requires different schema

          createdAt: faker.date.past(),
        },
      });
      userIdList.push(id);
    }
    console.log("created users. Creating new post...");

    // create 15 posts

    // first ... create one post?
    for (i = 0; i < 15; i++) {
      // determine poster id randomly

      const posterId = userIdList[Math.floor(Math.random() * 15)];
      console.log("debug, posterId= ", posterId);

      await prisma.post.create({
        data: {
          id: faker.string.uuid(),
          content: faker.hacker.phrase(),
          creatorId: posterId,
        },
      });
    }
  } catch (err) {
    console.error(err.message);
    return false;
  }
  console.log("done.");
})();
