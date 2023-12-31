import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  const authToken = req.headers.authorization;
  if (!authToken) {
    return res
      .status(401)
      .json({ status: false, message: "Aucun token fourni, accès refusé." });
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
      message: "Token invalide, accès refusé.",
    });
  }
};

const verifyTokenAndBeAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (!req.user.isAdmin) {
      return res.status(403).json({
        status: false,
        message: "Accès non autorisé, réservé à l'administrateur uniquement.",
      });
    }
    next();
  });
};

const verifyTokenAndOnlyUser = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id !== req.params.id) {
      return res.status(403).json({
        status: false,
        message: "Accès non autorisé, uniquement pour l'utilisateur lui-même.",
      });
    }
    next();
  });
};

const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (
      req.user.id !== req.params.id &&
      !req.user.isAdmin &&
      req.user.id !== req.params.userId
    ) {
      return res.status(403).json({
        status: false,
        message:
          "Accès non autorisé, réservé à l'utilisateur lui-même ou à l'administrateur.",
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
