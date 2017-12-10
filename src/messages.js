"use strict";

const questions = require("./questions");

module.exports = {
  en: {
    translation: {
      QUESTIONS: questions["QUESTIONS_EN_US"],
      GAME_NAME: "Christmas Trivia", // Be sure to change this for your skill.
      HELP_MESSAGE:
        "I will ask you %s multiple choice questions. Respond with the number of the answer. " +
        "For example, say one, two, three, or four. To start a new game at any time, say, start game. ",
      REPEAT_QUESTION_MESSAGE: "To repeat the last question, say, repeat. ",
      ASK_MESSAGE_START: "Would you like to start playing?",
      HELP_REPROMPT:
        "To give an answer to a question, respond with the number of the answer. ",
      STOP_MESSAGE: "Would you like to keep playing?",
      CANCEL_MESSAGE: "Ok, let's play again soon.",
      NO_MESSAGE: "Ok, we'll play another time. Goodbye!",
      TRIVIA_UNHANDLED: "Try saying a number between 1 and %s",
      HELP_UNHANDLED: "Say yes to continue, or no to end the game.",
      START_UNHANDLED: "Say start to start a new game.",
      NEW_GAME_MESSAGE: "Welcome to %s",
      WELCOME_MESSAGE:
        "I will ask you %s questions, try to get as many right as you can. " +
        "Just say the number of the answer. Let's begin.  <say-as interpret-as='interjection'>good luck</say-as>",
      ANSWER_CORRECT_MESSAGE: "correct. ",
      ANSWER_CORRECT_SOUND:
        '<audio src="https://d2kiyj3ex6fvqh.cloudfront.net/right-answer.mp3" /> ',
      ANSWER_WRONG_MESSAGE: "wrong. ",
      ANSWER_WRONG_SOUND:
        '<audio src="https://d2kiyj3ex6fvqh.cloudfront.net/wrong-answer.mp3" /> ',
      CORRECT_ANSWER_MESSAGE: "The correct answer is %s: %s. ",
      ANSWER_IS_MESSAGE: "That answer is ",
      TELL_QUESTION_MESSAGE:
        'Question %s. <audio src="https://d2kiyj3ex6fvqh.cloudfront.net/stinger.mp3" />, %s ',
      GAME_OVER_MESSAGE:
        "You got %s out of %s questions correct. Thank you for playing!",
      SCORE_IS_MESSAGE: "Your score is %s. ",
      WELCOME_BACK: "Hey %s. Welcome back. ",
      RESUME_GAME:
        "I see you already have a game that you did not complete. Let's continue where you left off! ",
      ALREADY_COMPLETED_MESSAGE:
        "Hey %s, I see you already have completed the Trivia. You scored %s "
    }
  }
};
