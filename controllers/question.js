import { QuestionModel } from "../models/question";
import { SettingsModel } from "../models/settings";

export class Question {
  static async get() {
    const questions = await QuestionModel.find().lean();
    const settings = await SettingsModel.findOne().lean();
    if (settings?.questionsOrder?.length) {
      const reorderedQuestions = Array.from(
        new Set([
          ...settings.questionsOrder
            .map((question) =>
              questions.find((q) => String(q._id) === question)
            )
            .filter((el) => el),
          ...questions,
        ])
      );
      return reorderedQuestions;
    }
    return questions;
  }
  static async create(
    { title, question, color, type, keywords = [] },
    user_id
  ) {
    await QuestionModel.create({
      title,
      question,
      type,
      color,
      keywords,
      createdBy: user_id,
    });
    return this.get();
  }
  static async edit({ title, color, question, answer, keywords = [], id }) {
    if (!id) {
      throw {
        message: "ID da pergunta não identificado",
        status: 400,
      };
    }
    const block = await QuestionModel.findById(id);
    if (!block) {
      throw {
        message: "Bloco não encontrado",
        status: 404,
      };
    }
    block.title = title;
    block.color = color;
    block.question = question;
    block.answer = answer;
    block.keywords = keywords;

    await block.save();
    return this.get();
  }
  static async reorder({ questionsIds }) {
    if (!questionsIds)
      throw {
        message: "IDs das perguntas não informados",
      };
    await SettingsModel.findOneAndUpdate(
      {},
      {
        $set: { questionsOrder: questionsIds },
      },
      { upsert: true }
    );
    return await this.get();
  }
  static async delete({ id }) {
    if (!id)
      throw {
        message: "ID não informado",
      };
    await QuestionModel.findByIdAndDelete(id);
    return await this.get();
  }
}
