// Controller for manipulating user data, searching for users, follows, etc.

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

async function user_search(req, res) {
  try {
    const query = req.query.search || null;
    console.log("debug -- user search query: ", query);

    let result;

    query !== null
      ? // search by query
        (result = await prisma.user.findMany({
          where: {
            username: { contains: query },
          },
          take: 10,
          select: {
            username: true,
            id: true,
          },
        }))
      : // search with no query
        (result = await prisma.user.findMany({
          take: 10,
          select: {
            username: true,
            id: true,
          },
        }));

    return res.json({ success: true, result });
  } catch (err) {
    console.error("error searching users -- ", err.message);
    res.status(500).send(err.message);
  }
}

//follow user (by id)
const follow_user = [
  verify,
  async function (req, res) {
    jwt.verify(req.token, SECRET_KEY, async (err, authData) => {
      if (err) {
        return res.status(401).send({ message: "error during authorization." });
      } else {
        try {
          const userId = req.params.userId;

          const followedUser = await prisma.user.findUniqueOrThrow({
            where: {
              id: userId,
            },
          });
          if (!followedUser) {
            return res.status(400).send("user to follow does not exist.");
          }

          // other important checks:
          if (authData.user.followingIds.includes(userId)) {
            return res.json({
              success: false,
              message: "already following this user!",
            });
          }
          if (userId === authData.user.id) {
            return res.json({
              success: false,
              message: "you cannot follow yourself!",
            });
          }

          // ---- updating the following user ----
          await prisma.user.update({
            where: {
              id: authData.user.id,
            },
            data: {
              followingIds: { push: userId },
            },
          });
          // ---- updating followed user ----
          await prisma.user.update({
            where: {
              id: userId,
            },
            data: {
              followedByIds: { push: authData.user.id },
            },
          });

          return res.json({
            success: true,
            message: `User ${authData.username} successfully followed user ${followedUser.id}`,
          });
        } catch (err) {
          console.error("error following user,", err.message);
          return res.status(500).send(err.message);
        }
      }
    });
  },
];

module.exports = {
  user_search,
  follow_user,
  //
};
