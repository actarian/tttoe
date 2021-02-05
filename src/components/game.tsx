
import * as React from 'react';
import { Board } from './board';
import { getGameState$ } from './game.store';
import { GameProps, GameState } from './types';
import { useObservable } from './use.observable';

export function Game(props: GameProps) { // :React.Component<GameProps>

  const [state, dispatch] = useObservable<GameState>(getGameState$, {
    history: [{
      squares: new Array(9).fill(null)
    }],
    index: 0,
    xIsNext: true,
    winner: null,
  });

  // console.log(state);
  
  const winner = state.winner;
  const status = winner ? 'Winner: ' + winner : 'Next player: ' + (state.xIsNext ? 'X' : 'O');

  const onSelectSquare = (i:number) => {
    if (!state.winner && state.history[state.index].squares[i] == null) {
      dispatch('selectSquare', i);
    }
  }

  return (
    <div className="tttoe__game">
      <Board squares={state.history[state.index].squares} onClick={i => onSelectSquare(i)} />
      <div className="tttoe__info">
        <div>{status}</div>
        <ul>{state.history.map((x, i) => {
          return (
            <li key={i}>
              <button onClick={() => dispatch('selectMove', i)}>{i ? `${i}` : 'reset'}</button>
            </li>
          );
        })}</ul>
      </div>
    </div>
  );
}
