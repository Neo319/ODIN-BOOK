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

// SIGN UP & create a user
async function signup_post(req, res) {
  const { username, password } = req.body;
  console.log("creating new user = ", username);

  if (!username || !password) {
    return res
      .status(401)
      .send({ message: "Error: missing signup credentials." });
  }

  try {
    result = await prisma.user.create({
      data: {
        username: username,
        password: bcrypt.hashSync(password),
      },
    });
  } catch (err) {
    console.error("error during db creation", err.message);
    return res
      .status(400)
      .send({ message: "error during signup -- " + err.message });
  }

  res.json({
    message: "Signup POST request completed.",
    success: true,
  });
}

// LOGIN & create jsonwebtoken.
async function login_post(req, res) {
  // getting credentials
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).send({ message: "Error: incomplete request." });
  }
  // Find user
  try {
    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });
    if (!user) {
      return res.status(401).send({ message: "User was not found!" });
    }
    // compare passwords
    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      return res.status(401).send({ message: "Incorrect password!" });
    }

    // --- authorization success: create JWT token ---
    const token = jwt.sign({ user: user }, SECRET_KEY, {
      // token options
      expiresIn: "10000s",
    });
    res.json({
      message: "Login request success.",
      token: token,
      success: true,
    });
  } catch (err) {
    return res.status(403).send({ message: "Error during login." });
  }
}

// Return user DETAIL.
const user_detail = [
  verify,
  async function (req, res) {
    jwt.verify(req.token, SECRET_KEY, async (err, authData) => {
      if (err) {
        return res.status(401).send({ message: "error during authorization." });
      } else {
        try {
          const posts = await prisma.post.findMany({
            where: {
              creatorId: authData.user.id,
            },
          });

          // getting comments
          const comments = await prisma.comment.findMany({
            where: {
              creatorId: authData.user.id,
            },
          });

          const result = {
            username: authData.user.username,
            id: authData.user.id,
            bio: authData.user.bio,
            avatarURL: authData.user.avatarUrl,
            createdAt: authData.user.createdAt,

            followingIds: authData.user.followingIds,
            followedByIds: authData.user.followedByIds,

            posts: posts,
            likedPostIds: authData.user.likedPostIds,
            comments: comments,
          };

          return res.json(result);
        } catch (err) {
          console.error(err.message);
          return res.status(400).send(err.message);
        }
      }
    });
  },
];

module.exports = {
  signup_post,
  login_post,
  user_detail,
  //
};
