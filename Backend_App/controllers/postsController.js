// Controller for posts and related routes

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const verify = require("../config/jwt");

//jwt secret from .env
const SECRET_KEY = process.env.SECRET_KEY;

//SET UP DB for either test or dev environments.
const prisma = (() => {
  const { PrismaClient } = require("@prisma/client");

  const databaseUrl =
    process.env.NODE_ENV === "test"
      ? process.env.TEST_DATABASE_URL
      : process.env.DATABASE_URL;
  return new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
  });
})();

function test(req, res) {
  res.json({ success: true });
}

const create_post = [
  verify,
  async function (req, res) {
    jwt.verify(req.token, SECRET_KEY, async (error, authData) => {
      if (error) {
        return res.send(error.message);
      }
      try {
        // verify data validity
        const textData = req.body.text;
        if (!textData || textData === "") {
          return res.send({ success: false, message: "missing post data." });
        }

        // add post to database
        const newUser = await prisma.post.create({
          data: {
            content: textData,
            creatorId: authData.user.id,
          },
        });

        return res.status(200).json({ success: true });
      } catch (err) {
        console.log(err.message);
        return res.status(400).send(err.message);
      }
    });
  },
];

async function posts_search(req, res) {
  try {
    const query = req.query.search || null;

    let result;

    query !== null
      ? // search by query
        (result = await prisma.post.findMany({
          where: {
            content: { contains: query },
          },
          take: 10,
          select: {
            id: true,
            content: true,
            creator: {
              select: {
                id: true,
                username: true,
                avatarURL: true,
              },
            },
          },
        }))
      : // search with no query
        (result = await prisma.post.findMany({
          take: 10,
          select: {
            id: true,
            content: true,
            creator: {
              select: {
                id: true,
                username: true,
                avatarURL: true,
              },
            },
          },
        }));

    return res.json({ success: true, result });
  } catch (err) {
    console.error("error searching users -- ", err.message);
    res.status(500).send(err.message);
  }
}

async function post_detail(req, res) {
  try {
    console.log("follow debug - ", req.params);
    const postId = req.params.id;
    if (!postId || postId === "") {
      return res
        .status(400)
        .json({ success: false, message: "missing post id." });
    }

    // get post
    const post = await prisma.post.findUniqueOrThrow({
      where: {
        id: postId,
      },
      select: {
        id: true,
        creatorId: true,
        content: true,
        createdAt: true,
        likes: true,
        creator: {
          select: {
            username: true,
            avatarURL: true,
          },
        },
      },
    });

    // get comments
    const comments = await prisma.comment.findMany({
      where: {
        postId: postId,
      },
      select: {
        id: true,
        content: true,
        creator: {
          select: {
            username: true,
            avatarURL: true,
          },
        },
      },
    });

    res.json({ success: true, result: post, comments: comments });
  } catch (err) {
    console.error("error loading post,", err.message);
    return res.status(400).json({ success: false, message: err.message });
  }
}

const like_post = [
  verify,
  async function (req, res) {
    jwt.verify(req.token, SECRET_KEY, async (error, authData) => {
      if (error) {
        console.error("unknown error", error.message);
        return res.status(500).json({ success: false, message: error.message });
      }
      try {
        // get user and liked post
        const userId = authData.user.id;
        const postId = req.params.id;
        if (!postId || postId === "") {
          return res
            .status(400)
            .json({ success: false, message: "missing post id." });
        }
        const user = await prisma.user.findUnique({
          where: { id: userId },
        });

        console.log("like post debug - user: ", user);

        //update the user's liked posts
        if (!user.likedPostIds.includes(postId)) {
          // update the post with a new like
          const updatePost = await prisma.post.update({
            where: { id: postId },
            data: {
              likes: { increment: 1 },
            },
          });
          // add like to new post
          const updateUser = await prisma.user.update({
            where: {
              id: userId,
            },
            data: {
              likedPostIds: { push: postId },
            },
          });
        } else {
          // remove from likedPosts
          // update the post with a new like
          const updatePost = await prisma.post.update({
            where: { id: postId },
            data: {
              likes: { decrement: 1 },
            },
          });
          const updateUser = await prisma.user.update({
            where: {
              id: userId,
            },
            data: {
              likedPostIds: {
                set: user.likedPostIds.filter((id) => id !== postId),
              },
            },
          });
        }

        return res.json({ success: true });
      } catch (err) {
        console.error("error liking post", err.message);
        return res.status(500).json({ success: false, message: err.message });
      }
    });
  },
];

const comment_post = [
  verify,
  async function (req, res) {
    jwt.verify(req.token, SECRET_KEY, async (error, authData) => {
      if (error) {
        console.error("unknown error", error.message);
        return res.status(500).json({ success: false, message: error.message });
      }
      try {
        //add a comment

        const postId = req.body.id;
        if (!postId || postId === "") {
          return res
            .status(400)
            .json({ success: false, message: "missing post id." });
        }

        const content = req.body.content;
        if (!content || content === "") {
          return res
            .status(400)
            .json({ success: false, message: "missing comment content." });
        }

        // create comment database entry
        await prisma.comment.create({
          data: {
            creatorId: authData.user.id,
            postId,
            content,
          },
        });

        return res.json({ success: true });
      } catch (err) {
        console.error("error commenting", err.message);
        return res.status(500).json({ success: false, message: err.message });
      }
    });
  },
];

module.exports = {
  test,
  create_post,
  posts_search,

  post_detail,
  like_post,
  comment_post,
  //
};
