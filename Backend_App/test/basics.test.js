require("dotenv").config();
const index = require("../routes/indexRouter.js");
const { execSync } = require("child_process");
const request = require("supertest");

const express = require("express");
const app = express();

//parsing json payloads
app.use(express.json());

// SET UP DB for test environments.
const prisma = (() => {
  const { PrismaClient } = require("@prisma/client");
  const databaseUrl = process.env.TEST_DATABASE_URL;
  return new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
  });
})();

beforeAll(async () => {
  console.log("Setting up test database...");

  // Reset the database schema
  execSync("npx prisma migrate reset --force --skip-generate");

  // Optionally seed the database with a user table and data
  await prisma.user.create({
    data: {
      username: "test_user",
      password: "securepassword", // Ideally hashed
    },
  });

  console.log("Test database setup complete.");
});

afterAll(async () => {
  // Clean up and disconnect the Prisma Client
  await prisma.$disconnect();
});

app.use(express.urlencoded({ extended: false }));
app.use("/", index);

// ----- TESTS BEGIN HERE -----
const databaseUrl = process.env.TEST_DATABASE_URL;

test("database exists", async () => {
  const user = await prisma.user.findFirstOrThrow();

  expect(user).not.toBeNull();
  //
});

test("expected response", async () => {
  const res = await request(app).get("/");

  console.log("debug: ", res.status);

  expect(res.ok).toBe(true);
  expect(res.status).toBe(200);
});
