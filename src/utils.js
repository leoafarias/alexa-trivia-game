const api = require("./api");

function populateGameQuestions(translatedQuestions) {
  const gameQuestions = [];
  const indexList = [];
  let index = translatedQuestions.length;

  if (GAME_LENGTH > index) {
    throw new Error("Invalid Game Length.");
  }

  for (let i = 0; i < translatedQuestions.length; i++) {
    indexList.push(i);
  }

  // Pick GAME_LENGTH random questions from the list to ask the user, make sure there are no repeats.
  for (let j = 0; j < GAME_LENGTH; j++) {
    const rand = Math.floor(Math.random() * index);
    index -= 1;

    const temp = indexList[index];
    indexList[index] = indexList[rand];
    indexList[rand] = temp;
    gameQuestions.push(indexList[index]);
  }

  return gameQuestions;
}

/**
 * Get the answers for a given question, and place the correct answer at the spot marked by the
 * correctAnswerTargetLocation variable. Note that you can have as many answers as you want but
 * only ANSWER_COUNT will be selected.
 * */
function populateRoundAnswers(
  gameQuestionIndexes,
  correctAnswerIndex,
  correctAnswerTargetLocation,
  translatedQuestions
) {
  const answers = [];
  const answersCopy = translatedQuestions[
    gameQuestionIndexes[correctAnswerIndex]
  ][
    Object.keys(translatedQuestions[gameQuestionIndexes[correctAnswerIndex]])[0]
  ].slice();
  let index = answersCopy.length;

  if (index < ANSWER_COUNT) {
    throw new Error("Not enough answers for question.");
  }

  // Shuffle the answers, excluding the first element which is the correct answer.
  for (let j = 1; j < answersCopy.length; j++) {
    const rand = Math.floor(Math.random() * (index - 1)) + 1;
    index -= 1;

    const swapTemp1 = answersCopy[index];
    answersCopy[index] = answersCopy[rand];
    answersCopy[rand] = swapTemp1;
  }

  // Swap the correct answer into the target location
  for (let i = 0; i < ANSWER_COUNT; i++) {
    answers[i] = answersCopy[i];
  }
  const swapTemp2 = answers[0];
  answers[0] = answers[correctAnswerTargetLocation];
  answers[correctAnswerTargetLocation] = swapTemp2;
  return answers;
}

function isAnswerSlotValid(intent) {
  const answerSlotFilled =
    intent && intent.slots && intent.slots.Answer && intent.slots.Answer.value;
  const answerSlotIsInt =
    answerSlotFilled && !isNaN(parseInt(intent.slots.Answer.value, 10));
  return (
    answerSlotIsInt &&
    parseInt(intent.slots.Answer.value, 10) < ANSWER_COUNT + 1 &&
    parseInt(intent.slots.Answer.value, 10) > 0
  );
}

function handleUserGuess(userGaveUp) {
  const answerSlotValid = isAnswerSlotValid(this.event.request.intent);
  let speechOutput = "";
  let speechOutputAnalysis = "";
  const gameQuestions = this.attributes.questions;
  let correctAnswerIndex = parseInt(this.attributes.correctAnswerIndex, 10);
  let currentScore = parseInt(this.attributes.score, 10);
  let currentQuestionIndex = parseInt(this.attributes.currentQuestionIndex, 10);
  const correctAnswerText = this.attributes.correctAnswerText;
  const translatedQuestions = this.t("QUESTIONS");

  if (
    answerSlotValid &&
    parseInt(this.event.request.intent.slots.Answer.value, 10) ===
      this.attributes["correctAnswerIndex"]
  ) {
    currentScore++;
    speechOutputAnalysis =
      this.t("ANSWER_CORRECT_SOUND") +
      this.t("ANSWER_CORRECT_COMMENT")() +
      this.t("ANSWER_CORRECT_MESSAGE") +
      this.t("COMPLIMENT")();
    this.attributes.results[this.attributes.currentQuestionIndex] = "correct";
  } else {
    if (!userGaveUp) {
      speechOutputAnalysis =
        this.t("ANSWER_WRONG_SOUND") +
        this.t("ANSWER_WRONG_COMMENT")() +
        this.t("ANSWER_WRONG_MESSAGE");
      this.attributes.results[this.attributes.currentQuestionIndex] = "wrong";
    }

    speechOutputAnalysis += this.t(
      "CORRECT_ANSWER_MESSAGE",
      correctAnswerIndex,
      correctAnswerText
    );
  }

  // Updates the user with the latest attributes
  api.updateUser(this.attributes["userId"], {
    sessionAttributes: this.attributes,
    score: currentScore,
    started: true,
    completed:
      this.attributes["currentQuestionIndex"] === GAME_LENGTH - 1 ? true : null,
    completedAt:
      this.attributes["currentQuestionIndex"] === GAME_LENGTH - 1
        ? new Date()
        : null
  });

  // Check if we can exit the game session after GAME_LENGTH questions (zero-indexed)
  if (this.attributes["currentQuestionIndex"] === GAME_LENGTH - 1) {
    speechOutput = userGaveUp ? "" : this.t("ANSWER_IS_MESSAGE");
    speechOutput +=
      speechOutputAnalysis +
      this.t(
        "GAME_OVER_MESSAGE",
        currentScore.toString(),
        GAME_LENGTH.toString()
      );

    this.response.speak(speechOutput);
    this.emit(":responseReady");
  } else {
    currentQuestionIndex += 1;
    correctAnswerIndex = Math.floor(Math.random() * ANSWER_COUNT);
    const spokenQuestion = Object.keys(
      translatedQuestions[gameQuestions[currentQuestionIndex]]
    )[0];
    const roundAnswers = populateRoundAnswers.call(
      this,
      gameQuestions,
      currentQuestionIndex,
      correctAnswerIndex,
      translatedQuestions
    );

    const questionIndexForSpeech = currentQuestionIndex + 1;
    let repromptText = this.t(
      "TELL_QUESTION_MESSAGE",
      questionIndexForSpeech.toString(),
      spokenQuestion
    );

    for (let i = 0; i < ANSWER_COUNT; i++) {
      repromptText += `${i + 1}. ${roundAnswers[i]}. `;
    }

    speechOutput += userGaveUp ? "" : this.t("ANSWER_IS_MESSAGE");
    speechOutput +=
      speechOutputAnalysis +
      this.t("SCORE_IS_MESSAGE", currentScore.toString()) +
      repromptText;

    Object.assign(this.attributes, {
      speechOutput: repromptText,
      repromptText: repromptText,
      currentQuestion: translatedQuestions[gameQuestions[currentQuestionIndex]],
      currentQuestionIndex: currentQuestionIndex,
      correctAnswerIndex: correctAnswerIndex + 1,
      answers: roundAnswers,
      questions: gameQuestions,
      score: currentScore,
      correctAnswerText:
        translatedQuestions[gameQuestions[currentQuestionIndex]][
          Object.keys(
            translatedQuestions[gameQuestions[currentQuestionIndex]]
          )[0]
        ][0]
    });
    api.setCurrentState(this.attributes).then(() => {
      this.response.speak(speechOutput).listen(repromptText);
      this.response.cardRenderer(this.t("GAME_NAME", repromptText));
      this.emit(":responseReady");
    });
  }
}

module.exports = {
  populateGameQuestions,
  populateRoundAnswers,
  handleUserGuess
};
