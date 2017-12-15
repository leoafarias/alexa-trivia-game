const firebase = require("firebase");

const ref = firebase.database().ref();
const usersRef = ref.child("users");
const configRef = ref.child("config");
const currentStateRef = ref.child("currentState");

// Checks to see if a user already exists
const userExists = (user, userId) =>
  new Promise((resolve, reject) => {
    const query = usersRef.child(userId);

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

// Adds activity to the database
const setCurrentState = attributes =>
  new Promise((resolve, reject) => {
    currentStateRef
      .set(attributes)
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err);
        throw new Error("Error happened when changing the state");
      });
  });

const checkIntro = () =>
  new Promise((resolve, reject) => {
    const query = configRef.child("intro");
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
        throw new Error("Something wrong happened when checking intro");
      });
    return;
  });

module.exports = {
  userExists,
  updateUser,
  addUser,
  setCurrentState,
  checkIntro
};
