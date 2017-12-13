import React, { Component } from "react";
import firebase from "firebase";

import Ranking from "./components/Ranking";
import Game from "./components/Game";

import "./App.css";
import "./snow.css";

import trees from "./images/trees.png";

const app = firebase.initializeApp({
  databaseURL: "https://santa-s-assistant.firebaseio.com/"
});

let idle;
let setIdle;

class App extends Component {
  state = {
    main: {},
    players: {}
  };

  componentDidMount() {
    const main = firebase.database().ref("currentState");
    const players = firebase.database().ref("users");

    main.on("value", snapshot => {
      this.setState({ main: { ...snapshot.val(), stateType: "active" } });
    });

    players.on("value", snapshot => {
      let snap = snapshot.val();
      if (snap.score == false) {
        snap.score = 0;
      }
      this.setState({ players: snap });
    });

    idle = () => {
      this.setState({ main: { ...this.state.main, stateType: "idle" } });
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.main !== this.state.main) {
      this.resetStateIdle();
    }
  }

  resetStateIdle() {
    clearTimeout(setIdle);
    setIdle = setTimeout(idle, 20000);
  }

  getPlayerName = () => {
    const { main, players } = this.state;

    if (main.stateType === "idle") {
      return (
        <h1>
          <strong>To: </strong>{" "}
          {players && Object.keys(players).length + " people"}
        </h1>
      );
    } else {
      return (
        <h1>
          <strong>To: </strong>{" "}
          {players[main.userId] !== undefined && players[main.userId].name}
        </h1>
      );
    }
  };

  render() {
    const { main, players } = this.state;
    const status = main.stateType;

    return (
      <div className="App">
        <div className="snow" />
        <img src={trees} className="trees" alt="Trees Background" />

        <div className={`player-card-holder ${status !== "idle" && "active"}`}>
          <div className="player-card">
            <h1>
              <strong>From:</strong> Santa
            </h1>
            {this.getPlayerName()}
          </div>
        </div>

        <Ranking main={main} players={players} />
        <Game main={main} players={players} />
      </div>
    );
  }
}

export default App;
