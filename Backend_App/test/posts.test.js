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

  token = await getToken();
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
      .set("Authorization", `Bearer ${token}`)
      .send({ text: "This is the first test post." });

    const posts = await prisma.post.findMany();
    expect(posts.length).toBe(1);
    expect(posts[0].content).toEqual("This is the first test post.");
  });

  test("user can see own posts in user detail", async () => {
    const res = await request(app)
      .get("/user")
      .set("Authorization", `Bearer ${token}`);

    expect(res.body.posts.length).toBe(1);
  });

  test("user can search for others' posts", async () => {
    const res = await request(app).get("/searchPosts?search=This");

    console.log("debug-post search=", res.body);

    expect(res.body.result.length).toBe(1);
    expect(res.body.result[0].content).toEqual("This is the first test post.");
  });
});
