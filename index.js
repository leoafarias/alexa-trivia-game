const Alexa = require("alexa-sdk");
const firebase = require("firebase");
const messages = require("./src/messages");
const config = require("./config");

global.ANSWER_COUNT = 3; // The number of possible answers per trivia question.
global.GAME_LENGTH = 5; // The number of questions per trivia game.
global.GAME_STATES = {
  TRIVIA: "_TRIVIAMODE", // Asking trivia questions.
  START: "_STARTMODE", // Entry point, start the game.
  HELP: "_HELPMODE" // The user is asking for help.
};

exports.handler = function(event, context) {
  context.callbackWaitsForEmptyEventLoop = false;

  // Hack for firebase init on lambda
  if (firebase.apps.length === 0) {
    firebase.initializeApp(config.firebaseConfig);
  }

  const alexa = Alexa.handler(event, context);
  alexa.appId = config.appId;
  // To enable string internationalization (i18n) features, set a resources object.
  alexa.resources = messages;
  alexa.registerHandlers(
    require("./src/handlers/newSession"),
    require("./src/handlers/startState"),
    require("./src/handlers/triviaState"),
    require("./src/handlers/helpState")
  );
  alexa.execute();
};
