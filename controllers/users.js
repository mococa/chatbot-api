import { ObjectId } from "bson";
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
}
