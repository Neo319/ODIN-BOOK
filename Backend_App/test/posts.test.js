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

let token;

beforeAll(async () => {
  console.log("Setting up test database...");

  const newUser = await request(app)
    .post("/signup")
    .send({ username: "test_user", password: "securepassword" });

  console.log("Test database setup complete.");

  token = getToken();
});

afterAll(async () => {
  // Clean up and disconnect the Prisma Client
  await prisma.$disconnect();
});

app.use(express.urlencoded({ extended: false }));
app.use("/", index);

const getToken = async () => {
  const res = await request(app)
    .post("/login")
    .send({ username: "test_user", password: "securepassword" });

  if (res.body.token) {
    return res.body.token;
  } else {
    return false;
  }
};

console.log("debug-token=", token);

// ---- TESTS BEGIN HERE ----

describe("Posts", () => {
  test("expected routes exist", async () => {
    const res = await request(app).get("/postTest");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test("post route updates db with new post", async () => {
    const res = await request(app)
      .post("/post")
      .set("Authorization", `bearer ${token}`)
      .send({ text: "This is the first test post." });

    console.log("debug:res.body=", res.body, res.status);

    const posts = await prisma.post.findMany();
    expect(posts.length).toBe(1);
  });
});
