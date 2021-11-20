import { ObjectId } from "bson";
import { BlockModel } from "../models/forms";

export class Block {
  static async get(user_id) {
    return await BlockModel.find({ user: ObjectId(user_id) });
  }
  static async create({ question, answer, keywords = [] }, user_id) {
    await BlockModel.create({ question, answer, keywords, user: user_id });
    return this.get(user_id);
  }
  static async edit({ question, answer, keywords = [], id }, user_id) {
    if (!id) {
      throw {
        message: "Por favor, insira um ID de um bloco para editá-lo",
        status: 400,
      };
    }
    const block = await BlockModel.findById(id);
    if (!block) {
      throw {
        message: "Bloco não encontrado",
        status: 404,
      };
    }
    block.question = question;
    block.answer = answer;
    block.keywords = keywords;

    await block.save();
    return this.get(user_id);
  }
}
