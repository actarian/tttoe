import * as React from 'react';
import { Dispatch } from 'react';
import { Board } from '../board/board';
import { Nav } from '../nav/nav';
import { Toast } from '../toast/toast';
import { Action, Actions, GameAction, GameProps, GameState } from '../types';
import './game.scss';
import { useStore } from './game.service';

export function Game(_: GameProps) {

  const [state, dispatch] = useStore();

  const move = (state.index % 2) === 0 ? 'X' : 'O';

  return (
    <div className="tttoe__game">
      <Board squares={state.boards[state.index].squares} victoryLine={state.victoryLine} onClick={i => onSelectSquare(state, dispatch, i)} />
      <Nav boards={state.boards} index={state.index} move={move} onClick={(i) => dispatch({ type: Actions.SelectMove, i })} />
      {state.winner && (
        <Toast message={`${state.winner} wins!`} />
      )}
      {state.tie && (
        <Toast message={`tie!`} />
      )}
    </div>
  );
}

// pure

function onSelectSquare(state: GameState, dispatch: Dispatch<GameAction> | Dispatch<Action>, i: number) {
  if (state.boards[state.index].squares[i] == null) {
    dispatch({ type: Actions.SelectSquare, i });
  }
}
