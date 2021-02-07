import { useReducer } from "react";
import { deepCopy } from "../observable/use.observable";
import { GameState } from "../types";
import { checkVictory } from "./game.store$";

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

export function useStore(defaultState: GameState) {
  return useReducer(reducer, defaultState);
}

/*
const initialState = {count: 0};

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return {count: state.count + 1};
    case 'decrement':
      return {count: state.count - 1};
    default:
      throw new Error();
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <>
      Count: {state.count}
      <button onClick={() => dispatch({type: 'decrement'})}>-</button>
      <button onClick={() => dispatch({type: 'increment'})}>+</button>
    </>
  );
}
*/
