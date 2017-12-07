const Alexa = require("alexa-sdk");
const firebase = require("firebase");
const questions = require("./src/questions");
const messages = require("./src/messages");
const config = require("./config");

// Handlers
const newSessionHandlers = require("./src/handlers/newSession");
const triviaStateHandlers = require("./src/handlers/triviaState");
const startStateHandlers = require("./src/handlers/startState");
const helpStateHandlers = require("./src/handlers/helpState");

let ref, usersRef, activityRef;

// global.__base = __dirname + "/";

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
    firebase.initializeApp(config);
  }

  const alexa = Alexa.handler(event, context);
  alexa.appId = config.appId;
  // To enable string internationalization (i18n) features, set a resources object.
  alexa.resources = messages;
  alexa.registerHandlers(
    newSessionHandlers,
    startStateHandlers,
    triviaStateHandlers,
    helpStateHandlers
  );
  alexa.execute();
};
