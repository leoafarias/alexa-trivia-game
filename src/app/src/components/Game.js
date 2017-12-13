import React, { Component } from "react";

class Game extends Component {
  renderOptions = () => {
    const { main } = this.props;
    const question = Object.keys(main.currentQuestion)[0];
    const options = main.answers;

    return Object.keys(options).map(function(key, index) {
      const option = options[key];
      return <li key={key}>{option}</li>;
    });
  };

  render() {
    const { main, players } = this.props;
    const status = main.stateType;
    const question = main.currentQuestion;

    let questionStatus;
    if (main.results) {
      let result = main.results[main.currentQuestion - 1];

      if (result === "correct") {
        questionStatus = "right";
      } else if (result === "wrong") {
        questionStatus = "wrong";
      } else {
        questionStatus = "";
      }
    }

    const player = main.userId;

    if (!question || !players[player]) {
      return <div className="Game" />;
    }

    return (
      <div className={`Game ${main.stateType} ${questionStatus}`}>
        <h3>{Object.keys(main.currentQuestion)[0]}</h3>

        <ul>{this.renderOptions()}</ul>

        <div className={`question-status ${questionStatus}`}>
          <div className="gift-box">
            <div className="gift-top" />
            <div className="gift-bottom" />

            <div className="right-question">Correct!</div>
            <div className="wrong-question">Wrong!</div>
          </div>
        </div>

        <div className="score">
          <strong>Score: </strong> {players[player].score}
        </div>
      </div>
    );
  }
}

export default Game;
