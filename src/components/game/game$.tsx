
import * as React from 'react';
import { Board } from '../board/board';
// import { useSharedStore$ } from '../observable/use.observable';
import { useStore$ } from '../observable/use.observable';
import { Toast } from '../toast/toast';
import { GameProps, GameState } from '../types';
import './game.scss';
import { gameStore$ } from './game.store$';

export function Game$(_: GameProps) { // :React.Component<GameProps>

  const [state, next] = useStore$<GameState>(gameStore$, {
    boards: [{
      squares: new Array(9).fill(null)
    }],
    index: 0,
    victoryLine: [],
    winner: null,
    tie: false,
  });

  const move = (state.index % 2) === 0 ? 'X' : 'O';

  const onSelectSquare = (i: number) => {
    if (!state.winner && state.boards[state.index].squares[i] == null) {
      next('selectSquare', i);
    }
  }

  return (
    <div className="tttoe__game">
      <Board squares={state.boards[state.index].squares} victoryLine={state.victoryLine} onClick={i => onSelectSquare(i)} />
      <ul className="tttoe__nav">
        {state.boards.map((_, i) => (
          <li key={i}>
            <button className={state.index === i ? 'active' : void 0} onClick={() => next('selectMove', i)}>
              {i == 0 ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M13.5 2c-5.621 0-10.211 4.443-10.475 10h-3.025l5 6.625 5-6.625h-2.975c.257-3.351 3.06-6 6.475-6 3.584 0 6.5 2.916 6.5 6.5s-2.916 6.5-6.5 6.5c-1.863 0-3.542-.793-4.728-2.053l-2.427 3.216c1.877 1.754 4.389 2.837 7.155 2.837 5.79 0 10.5-4.71 10.5-10.5s-4.71-10.5-10.5-10.5z" /></svg>
              ) : (
                  `${i}`
                )}
            </button>
          </li>
        ))}
        <li>{move}</li>
      </ul>
      {state.winner && (
        <Toast message={`${state.winner} wins!`} />
      )}
      {state.tie && (
        <Toast message={`tie!`} />
      )}
    </div>
  );
}
