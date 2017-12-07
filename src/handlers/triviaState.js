"use strict";

const Alexa = require("alexa-sdk");
const Utils = require("../utils");

module.exports = Alexa.CreateStateHandler(global.GAME_STATES.TRIVIA, {
  AnswerIntent: function() {
    Utils.handleUserGuess.call(this, false);
  },
  DontKnowIntent: function() {
    Utils.handleUserGuess.call(this, true);
  },
  "AMAZON.StartOverIntent": function() {
    this.handler.state = global.GAME_STATES.START;
    this.emitWithState("StartGame", false);
  },
  "AMAZON.RepeatIntent": function() {
    this.response
      .speak(this.attributes["speechOutput"])
      .listen(this.attributes["repromptText"]);
    this.emit(":responseReady");
  },
  "AMAZON.HelpIntent": function() {
    this.handler.state = global.GAME_STATES.HELP;
    this.emitWithState("helpTheUser", false);
  },
  "AMAZON.StopIntent": function() {
    this.handler.state = global.GAME_STATES.HELP;
    const speechOutput = this.t("STOP_MESSAGE");
    this.response.speak(speechOutput).listen(speechOutput);
    this.emit(":responseReady");
  },
  "AMAZON.CancelIntent": function() {
    this.response.speak(this.t("CANCEL_MESSAGE"));
    this.emit(":responseReady");
  },
  Unhandled: function() {
    const speechOutput = this.t(
      "TRIVIA_UNHANDLED",
      global.ANSWER_COUNT.toString()
    );
    this.response.speak(speechOutput).listen(speechOutput);
    this.emit(":responseReady");
  },
  SessionEndedRequest: function() {
    console.log(`Session ended in trivia state: ${this.event.request.reason}`);
  }
});
