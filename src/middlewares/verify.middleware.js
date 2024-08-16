import User from "../models/user.model.js";
import JWT from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["x-auth-token"];

  if (!authHeader) {
    return res.status(401).json({ errors: [{ msg: "Please Login" }] });
  }

  const token = authHeader;
  JWT.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
    if (err) {
      return res.status(401).json({ errors: [{ msg: "Invalid Token" }] });
    } else {
      try {
        const user = await User.findOne({ email: decodedToken.email }).select(
          "-password"
        );
        req.user = user;
        next();
      } catch (error) {
        res.status(500).json({ errors: [{ msg: err.message }] });
      }
    }
  });
};

export default verifyToken;
