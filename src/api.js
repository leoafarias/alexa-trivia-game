const firebase = require("firebase");

const ref = firebase.database().ref();
const usersRef = ref.child("users");
const gamesRef = ref.child("games");
const stateRef = ref.child("state");

// Checks to see if a user already exists
const userExists = (user, userId) =>
  new Promise((resolve, reject) => {
    const query = usersRef.child(userId);
    // .orderByChild('user')
    // .equalTo(user)
    // .limitToFirst(1)

    query
      .once("value")
      .then(snap => {
        if (snap.exists() === true) {
          resolve(snap.val());
        } else {
          resolve(false);
        }
      })
      .catch(err => {
        reject(err);
      });
  });

const addUser = (user, userId) =>
  new Promise((resolve, reject) => {
    usersRef
      .child(userId)
      .set({
        name: user,
        lastAccess: new Date(),
        sessionAttributes: null,
        started: false,
        score: null,
        completed: null,
        completedAt: null
      })
      .then(() => {
        resolve();
      })
      .catch(err => {
        reject(err);
      });
  });

const updateUser = (userId, obj) => {
  usersRef.child(userId).update(obj);
};

const createGame = userId => {
  gamesRef
    .push({
      userId: userId,
      score: null,
      completed: false
    })
    .then(res => {
      resolve(res);
    })
    .catch(err => {
      reject(err);
    });
};

// Adds activity to the database
const addActivity = (type, value) =>
  new Promise((resolve, reject) => {
    activityRef
      .push({
        type,
        value
      })
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err);
      });
  });

module.exports = {
  userExists,
  updateUser,
  addUser,
  createGame,
  addActivity
};
