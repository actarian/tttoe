import { useReducer } from 'react';
import { ObservableAction, ObservableHook, useReducer$, useSharedReducer$ } from '../@hooks/observable/observable';
import { deepCopy } from '../@hooks/utils/utils';
import { Actions, GameAction, GameState, SquareValue } from '../types';

export const DEFAULT_STATE: GameState = {
  boards: [{
    squares: new Array(9).fill(null)
  }],
  index: 0,
  victoryLine: [],
  winner: null,
  tie: false,
}

export const selectSquare = (state: GameState, i: number): GameState => {
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

export const selectMove = (state: GameState, i: number): GameState => {
  state.index = i;
  checkVictory(state);
  return state;
}

// private

function reducer(prevState: GameState, action: GameAction) {
  switch (action.type) {
    case Actions.SelectSquare:
      return selectSquare(deepCopy<GameState>(prevState), action.i);
    case Actions.SelectMove:
      return selectMove(deepCopy<GameState>(prevState), action.i);
    default:
      throw new Error('unknown action');
  }
}

function reducer$(state: GameState, action: ObservableAction) {
  switch (action.type) {
    case Actions.SelectSquare:
      return selectSquare(state, action.i);
    case Actions.SelectMove:
      return selectMove(state, action.i);
    default:
      throw new Error('unknown action');
  }
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

// public

export function useStore(defaultState?: GameState) {
  return useReducer(reducer, defaultState || DEFAULT_STATE);
}

export function useStore$(defaultState?: GameState): ObservableHook<GameState> {
  return useReducer$<GameState>(reducer$, defaultState || DEFAULT_STATE);
}

export function useSharedStore$(defaultState?: GameState): ObservableHook<GameState> {
  return useSharedReducer$<GameState>(reducer$, defaultState || DEFAULT_STATE);
}
