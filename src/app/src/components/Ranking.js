import React, { Component } from 'react';

class Ranking extends Component {

  renderRanking = () => {
    let { players } = this.props;
    let pos = 1;

    let rankedPlayers = Object.keys(players).map(key => {
      return players[key];
    })

    rankedPlayers = rankedPlayers.sort(function(a, b) {
      return b['score'] - a['score'];
    });

    return rankedPlayers.map(function(player, index) {
      let trophy = null;

      if(pos === 1){ trophy = <i className="gold fa fa-trophy"></i>; }
      if(pos === 2){ trophy = <i className="silver fa fa-trophy"></i>; }
      if(pos === 3){ trophy = <i className="bronze fa fa-trophy"></i>; }

      pos++;

      return <li key={ index } className={ pos <= 4 ? 'big' : ''}>{ trophy } { player.name } <span>({ player.score })</span></li>

   });

  }

  render() {
    const { main, players } = this.props;
    const status = main.stateType;

    return (
      <div className={`Ranking ${ status === 'idle' && 'active' }`}>
        <h3>Ranking</h3>
        <ul>
          { this.renderRanking() }
        </ul>
      </div>
    );
  }
}

export default Ranking;
