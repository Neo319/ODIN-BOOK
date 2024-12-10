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
    console.log("debug -- post search query: ", query);

    let result;

    query !== null
      ? // search by query
        (result = await prisma.post.findMany({
          where: {
            content: { contains: query },
          },
          take: 10,
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

module.exports = {
  test,
  create_post,
  posts_search,
  //
};
