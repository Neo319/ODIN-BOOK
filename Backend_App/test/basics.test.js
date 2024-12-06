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
  let token;
  beforeAll(async () => {
    const loginResponse = await request(app)
      .post("/login")
      .send({ username: "uniqueTest", password: "asdf" });

    const jsonData = JSON.parse(loginResponse.text);
    token = jsonData.token;
    expect(token).toBeDefined();
  });

  test("search users returns usernames, ids", async () => {
    // empty search
    const res = await request(app).get("/searchUsers?search=");
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body.result.length).toBe(2);
  });

  // search with params
  test("can search with specific parameters", async () => {
    const res = await request(app).get("/searchUsers?search=user");
    expect(res.body.result.length).toBe(1);
  });

  test("follow request updates db", async () => {
    //get id of user to follow
    const followedUser = await prisma.user.findFirst({
      where: {
        username: "test_user",
      },
      select: {
        id: true,
      },
    });

    console.log(followedUser);

    // making request
    const res = await request(app)
      .post(`/follow/${followedUser.id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.ok).toBe(true);

    // get own user detail
    const res2 = await request(app)
      .get("/user")
      .set("Authorization", `Bearer ${token}`);
    expect(res2.ok).toBe(true);

    console.log(res2.body);
    expect(res2.body.user.following).toBeDefinde;
  });
});
