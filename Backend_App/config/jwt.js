//configuration for jsonwebtoken

// JSON WEB TOKEN MIDDLEWARE
function verifyToken(req, res, next) {
  // 1. Get auth header value.
  const bearerHeader = req.headers["authorization"];
  // Ensure bearerHeader is not undefined
  if (typeof bearerHeader !== "undefined") {
    //Split at the space
    const bearer = bearerHeader.split(` `); // seperate token by the space, creates array
    // Get token from array
    const bearerToken = bearer[1];
    // Set the Token
    req.token = bearerToken;
    //calling next middleware
    next();
  } else {
    // forbidden
    res.sendStatus(401);
  }
}

module.exports = verifyToken;
