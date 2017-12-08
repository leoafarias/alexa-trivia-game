"use strict";

const Alexa = require("alexa-sdk");

module.exports = Alexa.CreateStateHandler(GAME_STATES.HELP, {
  helpTheUser: function(newGame) {
    const askMessage = newGame
      ? this.t("ASK_MESSAGE_START")
      : this.t("REPEAT_QUESTION_MESSAGE") + this.t("STOP_MESSAGE");
    const speechOutput = this.t("HELP_MESSAGE", GAME_LENGTH) + askMessage;
    const repromptText = this.t("HELP_REPROMPT") + askMessage;

    this.response.speak(speechOutput).listen(repromptText);
    this.emit(":responseReady");
  },
  "AMAZON.StartOverIntent": function() {
    this.handler.state = GAME_STATES.START;
    this.emitWithState("StartGame", false);
  },
  "AMAZON.RepeatIntent": function() {
    const newGame = !(
      this.attributes["speechOutput"] && this.attributes["repromptText"]
    );
    this.emitWithState("helpTheUser", newGame);
  },
  "AMAZON.HelpIntent": function() {
    const newGame = !(
      this.attributes["speechOutput"] && this.attributes["repromptText"]
    );
    this.emitWithState("helpTheUser", newGame);
  },
  "AMAZON.YesIntent": function() {
    if (this.attributes["speechOutput"] && this.attributes["repromptText"]) {
      this.handler.state = GAME_STATES.TRIVIA;
      this.emitWithState("AMAZON.RepeatIntent");
    } else {
      this.handler.state = GAME_STATES.START;
      this.emitWithState("StartGame", false);
    }
  },
  "AMAZON.NoIntent": function() {
    const speechOutput = this.t("NO_MESSAGE");
    this.response.speak(speechOutput);
    this.emit(":responseReady");
  },
  "AMAZON.StopIntent": function() {
    const speechOutput = this.t("STOP_MESSAGE");
    this.response.speak(speechOutput).listen(speechOutput);
    this.emit(":responseReady");
  },
  "AMAZON.CancelIntent": function() {
    this.response.speak(this.t("CANCEL_MESSAGE"));
    this.emit(":responseReady");
  },
  Unhandled: function() {
    const speechOutput = this.t("HELP_UNHANDLED");
    this.response.speak(speechOutput).listen(speechOutput);
    this.emit(":responseReady");
  },
  SessionEndedRequest: function() {
    console.log(`Session ended in help state: ${this.event.request.reason}`);
  }
});
