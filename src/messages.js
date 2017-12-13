"use strict";

const questions = require("./questions");
const compliments = require("./compliments");

module.exports = {
  en: {
    translation: {
      INTRO:
        '<audio src="https://d2kiyj3ex6fvqh.cloudfront.net/santa-1-intro.mp3" />' +
        '<say-as interpret-as="interjection">ta da</say-as>' +
        '<audio src="https://d2kiyj3ex6fvqh.cloudfront.net/santa-2-why-dont-you-say-hello.mp3" /><break time="1s"/>' +
        "Hi Santa" +
        '<audio src="https://d2kiyj3ex6fvqh.cloudfront.net/santa-3-dont-say-it-to-me.mp3" />' +
        "<say-as interpret-as='interjection'>all righty</say-as> <break time='1s'/>I am Alexa. Santa's assistant <say-as interpret-as='interjection'>ahem</say-as><break time='1s'/>I mean Elf." +
        '<audio src="https://d2kiyj3ex6fvqh.cloudfront.net/santa-4-say-alexa-knock-knock.mp3" /><break time="1s"/>' +
        '<audio src="https://d2kiyj3ex6fvqh.cloudfront.net/santa-5-now-i-have-to-go.mp3" />' +
        '<say-as interpret-as="interjection">bon voyage</say-as><break time="1s"/> I guess is just me and you now. Let the games begin!',
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
      NEW_GAME_MESSAGE: "%s Welcome to %s <break time='1s'/>",
      WELCOME_MESSAGE:
        "I will ask you %s questions, try to get as many right as you can. " +
        "Just say the number of the answer. Let's begin.  <say-as interpret-as='interjection'>good luck</say-as><break time='1s'/>",
      ANSWER_CORRECT_MESSAGE: "That is correct. ",
      ANSWER_CORRECT_SOUND:
        '<audio src="https://d2kiyj3ex6fvqh.cloudfront.net/right-answer.mp3" /> ',
      ANSWER_WRONG_MESSAGE: "That is wrong. ",
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
        '<emphasis level="strong">Hey %s</emphasis> , I see you already have completed the Trivia. You scored %s out of %s',
      ANSWER_WRONG_COMMENT: () => {
        let options = [
          "aw man",
          "d’oh",
          "boo hoo",
          "bummer",
          "good grief",
          "oh brother",
          "uh oh",
          "oh boy",
          "ouch"
        ];
        return (
          '<say-as interpret-as="interjection">' +
          randomizeArray(options) +
          '</say-as><break time="1s"/>'
        );
      },
      ANSWER_CORRECT_COMMENT: () => {
        let options = ["bam", "cha ching", "bingo", "boom", "booya", "oh snap"];
        return (
          '<say-as interpret-as="interjection">' +
          randomizeArray(options) +
          '</say-as><break time="1s"/>'
        );
      },
      COMPLIMENT: () => {
        return randomizeArray(compliments) + '<break time="1s"/>';
      }
    }
  }
};

const randomizeArray = options => {
  return options[Math.floor(Math.random() * options.length)];
};
