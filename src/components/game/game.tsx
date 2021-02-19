import * as React from 'react';
import { useState } from 'react';
import { deepCopy } from '../@hooks/utils/utils';
import { Board } from '../board/board';
import { Nav } from '../nav/nav';
import { Toast } from '../toast/toast';
import { GameProps, GameState, SquareValue } from '../types';
import './game.scss';

export function Game(_: GameProps) {

  const [state, setState] = useState<GameState>({
    boards: [{
      squares: new Array(9).fill(null)
    }],
    index: 0,
    victoryLine: [],
    winner: null,
    tie: false,
  });

  const move = (state.index % 2) === 0 ? 'X' : 'O';

  const selectSquare = (prevState: GameState, i: number): void => {
    const state = deepCopy<GameState>(prevState);
    if (state.winner != null) {
      return;
    }
    const boards = state.boards;
    const squares = boards[state.index].squares.slice(); // copy to next board
    if (squares[i] != null) {
      return;
    }
    squares[i] = (state.index % 2) === 0 ? 'X' : 'O';
    const index = state.index + 1;
    boards.length = index; // truncating array to index
    boards.push({ squares });
    state.index = index;
    checkVictory(state);
    setState(state);
  }

  const selectMove = (prevState: GameState, i: number): void => {
    const state = deepCopy<GameState>(prevState);
    state.index = i;
    checkVictory(state);
    setState(state);
  }

  const onSelectSquare = function(i: number) {
    if (state.boards[state.index].squares[i] == null) {
      selectSquare(state, i);
    }
  }

  const onSelectMove = function(i: number) {
    selectMove(state, i);
  }

  return (
    <div className="tttoe__game">
      <Board squares={state.boards[state.index].squares} victoryLine={state.victoryLine} onClick={i => onSelectSquare(i)} />
      <Nav boards={state.boards} index={state.index} move={move} onClick={(i) => onSelectMove(i)} />
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

function checkVictory(state: GameState): void {
  const squares = state.boards[state.index].squares;
  state.victoryLine = getVictoryLine(squares);
  state.winner = state.victoryLine.length ? squares[state.victoryLine[0]] : null;
  state.tie = !state.winner && squares.reduce((p: boolean, c: SquareValue) => p && c != null, true);
}

function getVictoryLine(squares: SquareValue[]): number[] {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  return lines.reduce((p: number[], line: number[]) => {
    const [a, b, c] = line;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return line;
    } else {
      return p;
    }
  }, []);
}
