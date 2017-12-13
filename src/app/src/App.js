import React, { Component } from 'react';
import firebase from 'firebase';

import Ranking from './components/Ranking';
import Game from './components/Game';

import './App.css';
import './snow.css';

import trees from './images/trees.png';

let playWith, stopGame, scoreUp, scoreDown, setScore,
answerRight, answerWrong, clearAnswer,
openRanking, closeRanking;

const app = firebase.initializeApp({
  databaseURL: 'https://santa-s-assistant.firebaseio.com/',
});

let idle;
let setIdle;

class App extends Component {

  state = {
    main: {},
    players: {}
  }

  componentDidMount() {
    const main    = firebase.database().ref('currentState');
    const players = firebase.database().ref('users');

    main.on('value', snapshot => {
      this.setState({ main: snapshot.val() });
    });

    players.on('value', snapshot => {
      this.setState({ players: snapshot.val() });
    });

    idle = () => {
      this.setState({ main: { ...this.state.main, stateType: 'idle' } });
    }
    setIdle = setTimeout(idle, 20000);

    this.resetStateIdle();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.main !== this.state.main) {
      this.resetStateIdle();
    }
  }

  resetStateIdle() {
    clearTimeout(setIdle);
    setIdle = setTimeout(idle, 300000);
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
      return <h1><strong>To: </strong> { players[main.userId] !== undefined && players[main.userId].name }</h1>
    }
  }

  setFunctions = () => {
    let { main, players } = this.state;

    const mainFb    = firebase.database().ref('currentState');
    const playersFb = firebase.database().ref('users');

    window.playWith = (player) => {
      main.stateType = player;
      main.status = 'playing';

      mainFb.set(main);
    }

    window.stopGame = () => {
      main.stateType = 'idle';
      main.status = 'idle';
      main.question.status = 'none';

      mainFb.set(main);
    }

    window.scoreUp = () => {
      players[main.userId].score = players[main.userId].score + 1;

      playersFb.set(players);
    }

    window.scoreDown = () => {
      players[main.userId].score = players[main.userId].score - 1;

      playersFb.set(players);
    }

    window.setScore = (score) => {
      players[main.userId].score = score;

      playersFb.set(players);
    }

    window.answerRight = () => {
      main.question.status = 'right';

      mainFb.set(main);
      window.clearAnswer();
    }

    window.answerWrong = () => {
      main.question.status = 'wrong';

      mainFb.set(main);
      window.clearAnswer();
    }

    window.clearAnswer = () => {
      setTimeout(() => {
        main.question.status = 'none';

        mainFb.set(main);
      }, 4000);
    }

    window.openRanking = () => {
      main.stateType = 'idle';
      main.status = 'ranking';
      main.question.status = 'none';

      mainFb.set(main);
    }

    window.closeRanking = () => {
      main.stateType = 'idle';
      main.status = 'idle';
      main.question.status = 'none';

      mainFb.set(main);
    }
  }

  render() {
    this.setFunctions();

    const { main, players } = this.state;
    const status = main.stateType;

    return (
      <div className="App">
        <div className="snow"></div>
        <img src={ trees } className="trees" alt="Trees Background" />

        <div className={`player-card-holder ${ status !== 'idle' && 'active' }`}>
          <div className="player-card">
            <h1><strong>From:</strong> Santa</h1>
            { this.getPlayerName() }
          </div>
        </div>

        <Ranking  main={ main } players={ players } />
        <Game     main={ main } players={ players } />
      </div>
    );
  }
}

export default App;
