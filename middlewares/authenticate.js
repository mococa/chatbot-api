import jwt from "jsonwebtoken";
export const check_authentication = (req, res, next) => {
  const token = req.cookies["jwt"];
  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    req.user_id = id;
    next();
  } catch (err) {
    res.cookie("jwt", "expired", { maxAge: 1 });
    return res.status(405).json({
      message: "Sua sessão expirou. Por favor, realize logon novamente",
    });
  }
};
