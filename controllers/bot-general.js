import { MessageType } from "@adiwajshing/baileys";
import { capitalize } from "../helpers";
import { WhatsappBot } from "./whatsapp";

export class Chatbot {
  sessions = [];

  static findSession(customer) {
    if (!this.sessions) this.sessions = [];
    return this.sessions.find(
      (session) => session.customer === customer && session.active
    );
  }
  static deleteSession(customer) {
    this.sessions = this.sessions.filter(
      (session) => session.customer !== customer
    );
  }
  static onSessionEnd(session, callback) {
    const self = this;
    //if (session) {
    // session.onCompleted = function () {
    //if (session.active) {
    session.active = false;
    callback(session);
    self.deleteSession(customer);
    //}
    //};
    //}
  }
  static createSession({ customer, questions = [] }) {
    if (!this.sessions) this.sessions = [];
    this.sessions = [
      ...this.sessions.filter((session) => session.customer !== customer),
      {
        customer,
        questions,
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
  }
  static askQuestion({ customer }) {
    const session = this.findSession(customer);
    if (!session)
      throw {
        message: "Sessão não encontrada",
      };
    if (session.questionIndex || 0 <= (session.questions || []).length) {
      this.reply(
        customer,
        session.questions[session.questionIndex || 0]?.question
      );
    }
  }
  static getQuestion({ session }) {
    if (session.questionIndex === undefined) session.questionIndex = 0;
    return session.questions[session.questionIndex || 0] || null;
  }
  static answerQuestion({ message, customer }, callback) {
    const session = this.findSession(customer);
    if (!session)
      throw {
        message: "Sessão não encontrada",
      };
    const question = this.getQuestion({ session });
    let pattern;
    switch (question.type) {
      case "e-mail":
        pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!pattern.test(message))
          return this.reply(
            customer,
            "Por favor, digite um endereço de e-mail válido"
          );
        break;
      case "unique":
        if (
          !question.options
            .map((option) => option.toLowerCase())
            .includes(message.toLowerCase())
        ) {
          return this.reply(
            customer,
            "Por favor, selecione uma das opções:\n" +
              question.options
                .map(capitalize)
                .map((opt) => "  ● " + opt)
                .join("\n")
          );
        }
        break;
      case "number":
        pattern = /\d+/g;
        const match = message.match(pattern);
        if (!match) return this.reply(customer, "Por favor, indique um número");
        message = match.join("");
        break;
      case "phone":
        pattern =
          /^(?:(?:\+|00)?(55)\s?)?(?:\(?([1-9][0-9])\)?\s?)?(?:((?:9\d|[2-9])\d{3})\-?(\d{4}))$/;
        if (!pattern.test(message))
          return this.reply(
            customer,
            "Por favor, digite um número de telefone válido"
          );
        break;
      default:
        break;
    }

    session.answers = [...(session.answers || []), message];
    session.updatedAt = new Date();
    session.questionIndex += 1;
    const nextQuestion = this.getQuestion({ session });
    if (nextQuestion) this.askQuestion({ customer });
    else {
      session.active = false;
      callback(session);
      return;
    }
  }
  static clear() {
    this.sessions = [];
  }

  static reply(to, msg) {
    WhatsappBot.getClient()?.sendMessage(to, msg, MessageType.text);
  }
}
