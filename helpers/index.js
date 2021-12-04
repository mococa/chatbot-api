import jwt from "jsonwebtoken";

export const errorHandler = (error, res) => {
  if (error.errors) {
    console.error(
      "error: " + Object.values(error.errors)[0].properties.message
    );
    return res
      .status(500)
      .json({ message: Object.values(error.errors)[0].properties.message });
  }
  console.error("error: " + error.message);
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
    expiresIn: "60min",
  });
  res.cookie("jwt", token, {
    maxAge: 60 * 60 * 1000,
    ...(process.env.NODE_ENV === "production"
      ? {
          httpOnly: false,
          secure: true,
          domain: process.env.FRONT_END_DOMAIN,
          sameSite: "none",
        }
      : {}),
  });
  return token;
};
export const sleep = (delay) => {
  return new Promise((res, rej) => setTimeout(res, delay));
};
export const jidToPhone = (jid) => {
  return jid.match(/\d+/g).join("");
};
export const phoneToJid = (phone) => {
  const _phone = `55${phone
    .split("-")
    .join("")
    .split(" ")
    .join("")
    .replace(/\(|\)/g, ".")}@s.whatsapp.net`;
  return _phone.length === 13 ? _phone : _phone.slice(2);
};
export const capitalize = (word) => {
  return word.slice(0, 1).toUpperCase() + word.slice(1).toLowerCase();
};
