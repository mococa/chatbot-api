import { ClientModel } from "../models/client";
import { FormModel } from "../models/forms";
import { ObjectId } from "mongodb";
export class Client {
  static async findByPhone(phone) {
    if (!phone)
      throw {
        message: "Telefone não informado",
      };
    return await ClientModel.findOne({ phone }).lean();
  }
  static async get(id) {
    if (id) return await ClientModel.findById(id).lean();
    return await ClientModel.find().lean();
  }
  static async getForms(id) {
    if (!id)
      throw {
        message: "ID não informado",
      };
    const forms = await FormModel.find({ client: ObjectId(id) }).populate([
      "questions",
    ]);
    return forms;
  }
}
