const firebase = require("firebase");

const ref = firebase.database().ref();
const usersRef = ref.child("users");
const gamesRef = ref.child("games");
const stateRef = ref.child("state");

// Adds user to the database
module.exports = {
  checkUser,
  addUser,
  createGame,
  addActivity
};

// Checks to see if a user already exists
const checkUser = (name, id) =>
  new Promise((resolve, reject) => {
    const query = usersRef.child(id);
    // .orderByChild('name')
    // .equalTo(name)
    // .limitToFirst(1)

    query
      .once("value")
      .then(snap => {
        console.log(">>> Return Value >>> ", snap.exists());

        // If user does not exist
        if (snap.exists() === false) {
          addUser(name, id)
            .then(res => {
              resolve(`Nice talking to you ${name}`);
            })
            .catch(err => {
              reject(err);
            });
        } else {
          resolve(`Nice talking to you again ${name}`);
        }
      })
      .catch(err => {
        throw new Error("Firebase could not get user");
      });
  });

const addUser = (name, id) =>
  new Promise((resolve, reject) => {
    console.log(">>> addUser started");

    usersRef
      .child(id)
      .set({
        name: name,
        gameId: null,
        lastAccess: null
      })
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err);
      });
  });

const createGame = userId => {
  console.log(">>> createGame started");

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
    console.log(">>> addActivity started");

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
