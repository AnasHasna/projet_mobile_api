import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  const authToken = req.headers.authorization;
  if (!authToken) {
    return res
      .status(401)
      .json({ status: false, message: "no token provided, access denied" });
  }
  // get the token from Bearer token
  const token = authToken.split(" ")[1];
  try {
    const decodedPayload = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decodedPayload;
    // get the work to next middleware
    next();
  } catch (error) {
    return res.status(401).json({
      status: false,
      message: "invalid token, access denied",
    });
  }
};

const verifyTokenAndBeAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (!req.user.isAdmin) {
      return res
        .status(403)
        .json({ status: false, message: "not allowed to access,only admin" });
    }
    next();
  });
};

const verifyTokenAndOnlyUser = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id !== req.params.id) {
      return res.status(403).json({
        status: false,
        message: "not allow to access,only user himself",
      });
    }
    next();
  });
};

const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    console.log(req.user);
    console.log(req.params);
    if (
      req.user.id !== req.params.id &&
      !req.user.isAdmin &&
      req.user.id !== req.params.userId
    ) {
      return res.status(403).json({
        status: false,
        message: "not allowed to access,only user himself or admin",
      });
    }
    next();
  });
};
export {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndBeAdmin,
  verifyTokenAndOnlyUser,
};
