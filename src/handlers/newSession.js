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

      api
        .userExists(userName, userId)
        .then(res => {
          // Check if user exists
          if (res) {
            // Set last stored attributes of the user
            Object.assign(this.attributes, res.sessionAttributes);

            // Update the user with the last access
            api.updateUser(userId, {
              lastAccess: new Date()
            });

            // Check if the game has been completed
            if (res.completed) {
              this.emit(
                ":tell",
                this.t(
                  "ALREADY_COMPLETED_MESSAGE",
                  res.name,
                  res.score,
                  GAME_LENGTH
                )
              );
            } else if (res.started) {
              // Its not completed but has it been started?
              this.handler.state = GAME_STATES.TRIVIA;
              this.emitWithState("AMAZON.RepeatIntent", true);
            } else {
              // User created but session never started. Start session
              this.handler.state = GAME_STATES.START;
              this.emitWithState("StartGame", true);
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
