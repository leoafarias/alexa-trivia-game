"use strict";

const Alexa = require("alexa-sdk");
const Utils = require("../utils");

module.exports = Alexa.CreateStateHandler(GAME_STATES.TRIVIA, {
  AnswerIntent: function() {
    Utils.handleUserGuess.call(this, false);
  },
  DontKnowIntent: function() {
    Utils.handleUserGuess.call(this, true);
  },
  "AMAZON.StartOverIntent": function() {
    Utils.handleUserGuess.call(this, false);
    // this.handler.state = GAME_STATES.START;
    // this.emitWithState("StartGame", false);
  },
  "AMAZON.RepeatIntent": function(resume) {
    let speechOutput = "";
    // Resume from previous session
    if (resume) {
      speechOutput =
        this.t("WELCOME_BACK", this.attributes["userName"]) +
        this.t("RESUME_GAME");
    }
    this.response
      .speak(speechOutput + this.attributes["speechOutput"])
      .listen(this.attributes["repromptText"]);
    this.emit(":responseReady");
  },
  "AMAZON.HelpIntent": function() {
    this.handler.state = GAME_STATES.HELP;
    this.emitWithState("helpTheUser", false);
  },
  "AMAZON.StopIntent": function() {
    this.handler.state = GAME_STATES.HELP;
    const speechOutput = this.t("STOP_MESSAGE");
    this.response.speak(speechOutput).listen(speechOutput);
    this.emit(":responseReady");
  },
  "AMAZON.CancelIntent": function() {
    this.response.speak(this.t("CANCEL_MESSAGE"));
    this.emit(":responseReady");
  },
  Unhandled: function() {
    const speechOutput = this.t("TRIVIA_UNHANDLED", ANSWER_COUNT.toString());
    this.response.speak(speechOutput).listen(speechOutput);
    this.emit(":responseReady");
  },
  SessionEndedRequest: function() {
    console.log(`Session ended in trivia state: ${this.event.request.reason}`);
  }
});
