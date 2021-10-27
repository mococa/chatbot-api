import { getJWT } from "../helpers";
import { BlockModel } from "../models/block";
import { UserModel } from "../models/user";

export class User {
  static async get({ username, password }) {
    return await UserModel.findOne({ username, password }, { password: 0 });
  }
  static async create({ username, password }) {
    const user = await UserModel.findOne({ username });
    if (user) {
      throw {
        message: "Este nome de usuário já está em uso",
        status: 403,
      };
    }
    await UserModel.create({ username, password });
    return this.get({ username, password });
  }
  static async login({ username, password }) {
    if (!username || !password) {
      throw {
        message: "Por favor, preencha todos os campos necessários.",
        status: 400,
      };
    }
    const user = await this.get({ username, password });
    if (!user) {
      throw {
        message: "Usuário ou senha incorretos.",
        status: 404,
      };
    }
    return user;
  }
  static async getByToken(token) {
    const { id } = await getJWT(token);
    if (!id) {
      throw {
        message: "Por favor, realize logon novamente.",
      };
    }
    const user = await UserModel.findById(id, { password: 0 }).lean();
    const blocks = await BlockModel.find({ user: user._id }, { user: 0 });
    return { ...user, blocks };
  }
}
