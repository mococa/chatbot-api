import { getJWT } from "../helpers";
//import { BlockModel } from "../models/block";
import { UserModel } from "../models/user";
import { Question } from "./question";

export class User {
  static async get({ username, password }) {
    return await UserModel.findOne(
      { username, password },
      { password: 0 }
    ).lean();
  }
  static async create({ username, password, passwordConfirmation }) {
    if (password !== passwordConfirmation) {
      throw {
        message:
          "Senhas não coincidem. Por favor, verifique-as e tente novamente",
      };
    }
    const user = await UserModel.findOne({ username });
    if (user) {
      throw {
        message:
          "Este nome de usuário já está em uso. Por favor, escolha outro",
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
        message:
          "Usuário ou senha incorretos. Por favor, verifique os dados inseridos",
        status: 404,
      };
    }
    const questions = await Question.get();
    return { ...user, questions };
  }
  static async getByToken(token) {
    const { id } = await getJWT(token);
    if (!id) {
      throw {
        message: "Por favor, realize logon novamente.",
      };
    }
    const user = await UserModel.findById(id, { password: 0 }).lean();
    const questions = await Question.get();
    return { ...user, questions };
  }
}
