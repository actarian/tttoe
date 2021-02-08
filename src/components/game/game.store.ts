import { useReducer } from 'react';
import { deepCopy } from '../@hooks/utils/utils';
import { GameState, SquareValue } from '../types';

export const DEFAULT_STATE: GameState = {
  boards: [{
    squares: new Array(9).fill(null)
  }],
  index: 0,
  victoryLine: [],
  winner: null,
  tie: false,
}

export type GameAction =
  | { type: 'selectSquare', i: number }
  | { type: 'selectMove', i: number };

const selectSquare = (state: any, i: number): GameState => {
  if (state.winner != null) {
    return state;
  }
  const boards = state.boards;
  const squares = boards[state.index].squares.slice(); // copy to next board
  if (squares[i] != null) {
    return state;
  }
  squares[i] = (state.index % 2) === 0 ? 'X' : 'O';
  const index = state.index + 1;
  boards.length = index; // truncating array to index
  boards.push({ squares });
  state.index = index;
  checkVictory(state);
  return state;
}

const selectMove = (state: any, i: number): GameState => {
  state.index = i;
  checkVictory(state);
  // state.winner = getWinner(squares);
  // console.log('selectMove', i, state.index, state.winner);
  return state;
}

export function reducer(state: GameState, action: GameAction) {
  switch (action.type) {
    case 'selectSquare':
      return selectSquare(deepCopy(state), action.i);
    case 'selectMove':
      return selectMove(deepCopy(state), action.i);
    default:
      throw new Error('unknown action');
  }
}

export function useStore(defaultState?: GameState) {
  return useReducer(reducer, defaultState || DEFAULT_STATE);
}

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
