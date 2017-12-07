"use strict";

const Alexa = require("alexa-sdk");
const Utils = require("../utils");

module.exports = Alexa.CreateStateHandler(global.GAME_STATES.START, {
  StartGame: function(newGame) {
    let speechOutput = newGame
      ? this.t("NEW_GAME_MESSAGE", this.t("GAME_NAME")) +
        this.t("WELCOME_MESSAGE", global.GAME_LENGTH.toString())
      : "";
    // Select global.GAME_LENGTH questions for the game
    const translatedQuestions = this.t("QUESTIONS");
    const gameQuestions = Utils.populateGameQuestions(translatedQuestions);
    // Generate a random index for the correct answer, from 0 to 3
    const correctAnswerIndex = Math.floor(Math.random() * global.ANSWER_COUNT);
    // Select and shuffle the answers for each question
    const roundAnswers = Utils.populateRoundAnswers(
      gameQuestions,
      0,
      correctAnswerIndex,
      translatedQuestions
    );
    const currentQuestionIndex = 0;
    const spokenQuestion = Object.keys(
      translatedQuestions[gameQuestions[currentQuestionIndex]]
    )[0];
    let repromptText = this.t("TELL_QUESTION_MESSAGE", "1", spokenQuestion);

    for (let i = 0; i < global.ANSWER_COUNT; i++) {
      repromptText += `${i + 1}. ${roundAnswers[i]}. `;
    }

    speechOutput += repromptText;

    Object.assign(this.attributes, {
      speechOutput: repromptText,
      repromptText: repromptText,
      currentQuestionIndex: currentQuestionIndex,
      correctAnswerIndex: correctAnswerIndex + 1,
      questions: gameQuestions,
      score: 0,
      correctAnswerText:
        translatedQuestions[gameQuestions[currentQuestionIndex]][
          Object.keys(
            translatedQuestions[gameQuestions[currentQuestionIndex]]
          )[0]
        ][0]
    });

    // Set the current state to trivia mode. The skill will now use handlers defined in triviaStateHandlers
    this.handler.state = global.GAME_STATES.TRIVIA;

    this.response.speak(speechOutput).listen(repromptText);
    this.response.cardRenderer(this.t("GAME_NAME"), repromptText);
    this.emit(":responseReady");
  }
});
