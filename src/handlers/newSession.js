"use strict";

const api = require("../api");

module.exports = {
  LaunchRequest: function() {
    // this.handler.state = GAME_STATES.START;
    // this.emitWithState('StartGame', true);
    const speechOutput = "Who is there?";
    this.response.speak(speechOutput).listen(speechOutput);
    this.emit(":responseReady");
  },
  WhosThereIntent: function() {
    const personSlot = this.event.request.intent.slots.person;

    // If user matches the current person slot
    if (
      personSlot.resolutions.resolutionsPerAuthority[0].status.code !==
      "ER_SUCCESS_MATCH"
    ) {
      // TODO: Do random respojnses if it doesnt understand
      console.log(personSlot.value.toLowerCase());
      const speechOutput = "Sorry... Who is this?";
      const repromptSpeech = "Can you say your name one more time?";
      this.emit(":ask", speechOutput, repromptSpeech);
    } else {
      let user = (this.attributes["user"] = personSlot.value.toLowerCase());
      let userId = (this.attributes["userId"] =
        personSlot.resolutions.resolutionsPerAuthority[0].values[0].value.id);
      let userName = (this.attributes["userName"] =
        personSlot.resolutions.resolutionsPerAuthority[0].values[0].value.name);

      // Welcome back {name}
      // it has been {time} since we last talked
      // we can continue where you left off
      api
        .userExists(userName, userId)
        .then(res => {
          if (res) {
            api.updateUser(userId, {
              lastAccess: new Date()
            });

            // Check if the game has been completed
            if (res.completed) {
            } else {
              // Set last stored attributes to resume the game
              Object.assign(this.attributes, res.sessionAttributes);
              this.handler.state = GAME_STATES.TRIVIA;
              this.emitWithState("AMAZON.RepeatIntent", true);
            }
          } else {
            api
              .addUser(userName, userId)
              .then(res => {
                this.handler.state = GAME_STATES.START;
                this.emitWithState("StartGame", true);
              })
              .catch(err => {
                console.error(err);
              });
          }
        })
        .catch(err => {
          console.error(">>> addUser >>> err ", err);
          this.emit(":tell", `Somethign went wrong ${user}`);
        });
    }
  },
  "AMAZON.StartOverIntent": function() {
    this.handler.state = GAME_STATES.START;
    this.emitWithState("StartGame", true);
  },
  "AMAZON.HelpIntent": function() {
    this.handler.state = GAME_STATES.HELP;
    this.emitWithState("helpTheUser", true);
  },
  Unhandled: function() {
    const speechOutput = this.t("START_UNHANDLED");
    this.response.speak(speechOutput).listen(speechOutput);
    this.emit(":responseReady");
  }
};
