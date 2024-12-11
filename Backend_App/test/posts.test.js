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

  execSync("npx prisma migrate reset --force");

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

    expect(res.body.result.length).toBe(1);
    expect(res.body.result[0].content).toEqual("This is the first test post.");
  });

  test("posts can be viewed in detail via id", async () => {
    const postId = (await prisma.post.findFirstOrThrow()).id;

    const res = await request(app).get(`/post/${postId}`);

    expect(res.status).toBe(200);
    expect(res.body.result.content).toEqual("This is the first test post.");
  });
});

describe("Likes", () => {
  test("adding a like to a post updates db", async () => {
    const postId = (await prisma.post.findFirstOrThrow()).id;

    const res = await request(app)
      .post(`/post/${postId}/like`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    const likes = (
      await prisma.user.findUniqueOrThrow({ where: { username: "test_user" } })
    ).likedPostIds;

    expect(likes).toBeDefined();
    expect(likes.length).toBe(1);
  });

  test("can view number of likes on posts", async () => {
    const postId = (await prisma.post.findFirstOrThrow()).id;
    const res = await request(app).get(`/post/${postId}`);

    expect(res.body.result.likes).toBe(1);
  });

  test("can view own liked posts", async () => {
    const newToken = (
      await request(app)
        .post("/login")
        .send({ username: "test_user", password: "securepassword" })
    ).body.token;
    // ---- IMPORTANT NOTE: a new token must be generated to access new information because jwts are stateless.  ----

    const res = await request(app)
      .get("/user")
      .set("Authorization", `Bearer ${newToken}`);

    const user = await prisma.user.findFirst({
      where: {
        username: "test_user",
      },
    });

    expect(res.body.likedPostIds.length).toBe(1);
  });

  test("likes cannot be added more than once (instead un-likes)", async () => {
    const newToken = (
      await request(app)
        .post("/login")
        .send({ username: "test_user", password: "securepassword" })
    ).body.token;

    const postId = (await prisma.post.findFirstOrThrow()).id;
    const res = await request(app)
      .post(`/post/${postId}/like`)
      .set("Authorization", `Bearer ${newToken}`);

    const user = await prisma.user.findFirstOrThrow({
      where: { username: "test_user" },
    });
    expect(user.likedPostIds.length).toBe(0);
  });
});

describe("comments", () => {
  test("adding a comment updates db", async () => {
    const postId = (await prisma.post.findFirstOrThrow()).id;
    const res = await request(app)
      .post(`/post/${postId}/comment`)
      .send({ id: postId, content: "This is a test comment" })
      .set("Authorization", `Bearer ${token}`);

    const postComments = await prisma.comment.findFirstOrThrow();
    console.log(postComments);

    expect(postComments).toBeDefined();
  });

  test("can access comments from an individual post", async () => {
    const post = await prisma.post.findFirstOrThrow();
    const res = await request(app).get(`/post/${post.id}`);

    console.log(res.body);

    expect(res.body.comments).toBeDefined();
    expect(res.body.comments.length).toBe(1);
  });

  //todo:
  // can access comments from a user's profile.
});
