import React, { Component } from 'react';

class Game extends Component {

  renderOptions = () => {
    const { main } = this.props;
    const question = main.question;
    const options = question.options;

    return Object.keys(options).map(function(key, index) {
      const option = options[key];

      return <li key={ key }>{ option }</li>

   });
  }

  render() {
    const { main, players } = this.props;
    const status = main.status;
    const question = main.question;
    const questionStatus = main.question !== undefined ? main.question.status : null;

    const player = main.isPlaying;

    if( !question || !players[player] ) { return <div className="Game"></div> }

    return (
      <div className={`Game ${ status === 'playing' && 'active' } ${ questionStatus }`}>
        <h3>{ question.title }</h3>

        <ul>
          { this.renderOptions() }
        </ul>

        <div className={`question-status ${ questionStatus }`}>
          <div className="gift-box">
            <div className="gift-top"></div>
            <div className="gift-bottom"></div>

            <div className="right-question">Correct!</div>
            <div className="wrong-question">Wrong!</div>
          </div>
        </div>

        <div className="score"><strong>Score: </strong> { players[player].score } </div>
      </div>
    );
  }
}

export default Game;
