import { MessageType } from "@adiwajshing/baileys";
import { WhatsappBot } from "./whatsapp";

export class Chatbot {
  sessions = [];
  answers = [];

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
  static onSessionEnd(customer, callback) {
    const session = this.findSession(customer);
    const self = this;
    if (session && session.active) {
      session.onCompleted = () => {
        callback(session);
        self.deleteSession(customer);
      };
    }
  }
  static createSession({ customer, allQuestions = [] }) {
    if (!this.sessions) this.sessions = [];
    this.sessions = [
      ...this.sessions.filter((session) => session.customer !== customer),
      {
        customer,
        allQuestions,
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
    if (session.question || 0 <= (session.allQuestions || []).length) {
      this.reply(customer, session.allQuestions[session.question || 0]);
    }
  }
  static answerQuestion({ message, customer }) {
    const session = this.findSession(customer);
    if (!session)
      throw {
        message: "Sessão não encontrada",
      };
    session.message = [...(session.message || []), message];
    session.question =
      session.question === undefined ? 0 : session.question + 1 || 0;
    session.updatedAt = new Date();
    if (session.question <= session.allQuestions.length) {
      if (session.allQuestions[session.question + 1]) {
        this.reply(customer, session.allQuestions[session.question + 1]);
      } else {
        session.onCompleted();
        session.active = false;
      }
    }
  }
  static clear() {
    this.sessions = [];
  }

  // static async ask(questions = [], data = {}) {
  //   const message = data?.message?.conversation;
  //   const author = data?.key?.remoteJid;
  //   // oi -> Oi
  //   this.reply(author, questions[0]);

  //   if (!this.answers) this.answers = [];

  //   let questionIndex = this.answers.filter(
  //     (answer) => answer.author === author
  //   ).length;

  //   if (questions.length === questionIndex) {
  //     return this.reply(author, "já acabou já mano para!!!!");
  //   }

  //   if (questionIndex <= questions.length) {
  //     this.reply(author, questions[questionIndex]);
  //   }

  //   this.answers.push({ message, author, when: new Date() });

  //   const author_answers = this.answers.filter(
  //     (answer) => answer.author === author
  //   );

  //   if (author_answers.length >= questions.length) {
  //     this.reply(
  //       author,
  //       `Suas respostas foram: ${author_answers
  //         .map((answer) => answer.message)
  //         .join(", ")}`
  //     );
  //   }
  // }

  static reply(to, msg) {
    WhatsappBot.getClient()?.sendMessage(to, msg, MessageType.text);
  }
}
