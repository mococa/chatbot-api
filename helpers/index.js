import jwt from "jsonwebtoken";

export const errorHandler = (error, res) => {
  if (error.errors) {
    return res
      .status(500)
      .json({ message: Object.values(error.errors)[0].properties.message });
  }
  return res.status(error.status || 500).json({ message: error.message });
};
export const getJWT = (jwt_token) => {
  return new Promise((resolve, reject) => {
    if (!jwt_token) reject("JWT indefinido");
    jwt.verify(jwt_token, process.env.JWT_SECRET, (err, decoded_token) => {
      if (err || !decoded_token) {
        reject("JWT inválido");
      }
      resolve(decoded_token);
    });
  });
};
export const createToken = (user, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "15min",
  });
  res.cookie("jwt", token, {
    maxAge: 15 * 60 * 1000,
    ...(process.env.NODE_ENV === "production"
      ? {
          httpOnly: false,
          secure: false,
          domain: process.env.FRONT_END_DOMAIN,
          sameSite: "none",
        }
      : {}),
  });
  return token;
};
