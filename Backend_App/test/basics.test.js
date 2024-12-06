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

test("database exists", async () => {
  const user = await prisma.user.findFirstOrThrow();

  expect(user).not.toBeNull();
  //
});

test("expected response exists", async () => {
  const res = await request(app).get("/");

  expect(res.ok).toBe(true);
  expect(res.status).toBe(200);
});

// LOGGING IN, ETC TESTS
describe("Login", () => {
  let token; // Variable to store the token

  beforeAll(async () => {
    const response = await request(app)
      .post("/signup")
      .send({ username: "uniqueTest", password: "asdf" });

    //check response status
    expect(response.status).toBe(200);

    const loginResponse = await request(app)
      .post("/login")
      .send({ username: "uniqueTest", password: "asdf" });

    const jsonData = JSON.parse(loginResponse.text);
    // TOKEN FOUND HERE

    token = jsonData.token;
    expect(token).toBeDefined();
  });

  test("sends token on success", async () => {
    expect(token).not.toBeNull();
    expect(token).toBeDefined();
  });
  test("logins fail with incorrect data", async () => {
    const response = await request(app)
      .post("/login")
      .send({ username: "incorrect", password: "incorrect" });
    expect(response.ok).toBeFalsy();
  });
  test("cannot login with incorrect password", async () => {
    const response = await request(app)
      .post("/login")
      .send({ username: "uniqueTest", password: "incorrect" });
    expect(response.ok).toBeFalsy();
  });

  test("user detail returns json object", async () => {
    const res = await request(app)
      .get("/user")
      .set("Authorization", `Bearer ${token}`);

    expect(res.ok).toBe(true);
    expect(res.body.username).toBe("uniqueTest");
  });
});

// TESTS FOR USER-RELATED ROUTES
describe("User", () => {
  // beforeAll create needed tokens & db content
  // 1. find test1 function...
  test("usersController found", async () => {
    const res = await request(app).get("/test1");

    expect(res.ok).toBe(true);
  });

  test("search users returns usernames, ids", async () => {
    // empty search
    const res = await request(app).get("/searchUsers?search=search");
    console.log(res.body);
    console.log(res.status);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body.result[1].username).toBe("uniqueTest");
  });

  // search with params
});
