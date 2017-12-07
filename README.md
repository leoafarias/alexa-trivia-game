# Xmas Smart Door - Trivia Game

A fun smart door implementation using Alexa, AWS Lambda & Firebase.

This document will be a rough reference of some ideas for this proof of concept.

## Front-end States

- IDLE - Application displays "From: Santa, To: TOP_RANKED_USER

- LISTENING - Display some type of visual feedback to the user that the its listening, and waiting for the person to talk

- SESSION_STARTED - Show label "From: Santa, To: ACTIVE_USER"

- QUESTION_ASKED - Shows question and order of possible answers

- QUESTION_ANSWERED - Show correct answer, and if the user got it right or wrong

- RANKING - Display ranking of all users and their points

## Game Workflow

1. User approaches door and activates command i.e. "Knock Knock". The first "Knock" is an Alexa wake word, and the second "knock" would the skill name.

1. Door will then ask "Who's there?"

1. Answer should fire the WhosThereIntent, if slot for {person} is not detected, we promopt with the question again.

```json
{
    "userId":{
        "name": "string",
        "gameId": "string",
        "lastAccess": "string"
    }
}
```

```json
{
     "gameId":{
        userId: "string"
        score: int,
        completed: bool
    }
}
```