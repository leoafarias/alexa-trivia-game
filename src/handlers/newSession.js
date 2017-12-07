"use strict";

const Api = require("../api");

module.exports = {
  LaunchRequest: function() {
    // this.handler.state = global.GAME_STATES.START;
    // this.emitWithState('StartGame', true);
    const speechOutput = "Who is there?";
    this.response.speak(speechOutput).listen(speechOutput);
    this.emit(":responseReady");
  },
  WhosThereIntent: function() {
    const personSlot = this.event.request.intent.slots.person;

    if (
      personSlot.resolutions.resolutionsPerAuthority[0].status.code ===
      "ER_SUCCESS_MATCH"
    ) {
      const person = personSlot.value.toLowerCase();
      const id =
        personSlot.resolutions.resolutionsPerAuthority[0].values[0].value.id;
      const name =
        personSlot.resolutions.resolutionsPerAuthority[0].values[0].value.name;

      console.log(
        `DialogState: ${
          personSlot.resolutions.resolutionsPerAuthority[0].status.code
        }`
      );
      console.log(`Person Slot: => ${person}`);
      console.log(`Person ID: ${id}`);
      console.log(`Person Name: ${name}`);

      Api.checkUser(person, id)
        .then(res => {
          console.log(">>> addUser >>> success ");
          this.emit(":tell", res);
        })
        .catch(err => {
          console.error(">>> addUser >>> err ", err);
          this.emit(":tell", `Somethign went wrong ${person}`);
        });
    } else {
      // TODO: Do random respojnses if it doesnt understand
      const speechOutput = "Sorry... Who is this?";
      const repromptSpeech = "Can you say one more time?";
      this.emit(":ask", speechOutput, repromptSpeech);
    }

    // this.handler.state = global.GAME_STATES.START;
    // this.emitWithState('StartGame', true);
  },
  "AMAZON.StartOverIntent": function() {
    this.handler.state = global.GAME_STATES.START;
    this.emitWithState("StartGame", true);
  },
  "AMAZON.HelpIntent": function() {
    this.handler.state = global.GAME_STATES.HELP;
    this.emitWithState("helpTheUser", true);
  },
  Unhandled: function() {
    const speechOutput = this.t("START_UNHANDLED");
    this.response.speak(speechOutput).listen(speechOutput);
    this.emit(":responseReady");
  }
};
