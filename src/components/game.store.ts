
import { Observable, Subject } from 'rxjs';
import { scan, startWith } from 'rxjs/operators';
import { GameState, SquareValue } from './types';
import { deepCopy, ObservableAction, ObservableReducer, ObservableReducers } from './use.observable';

const selectSquare:ObservableReducer = <GameState>(state: any, i: number): GameState => {      
  if (state.winner != null) {
    return state;
  }
  const squares = state.history[state.index].squares.slice();
  if (squares[i] != null) {
    return state;
  }
  squares[i] = state.xIsNext ? 'X' : 'O';
  state.history.length = state.index + 1;
  state.history.push({ squares });
  state.index = state.history.length - 1;
  state.xIsNext = (state.index % 2) === 0;
  state.winner = calculateWinner(squares);
  // console.log('selectSquare', i, squares[i], state.index, state.winner);
  return state;
}

const selectMove:ObservableReducer = <GameState>(state: any, i: number): GameState => {
  state.index = i;
  state.xIsNext = (i % 2) === 0;
  const squares = state.history[state.index].squares;
  state.winner = calculateWinner(squares);
  // console.log('selectMove', i, state.index, state.winner);
  return state;
}

const actions: ObservableReducers = {
  selectSquare,
  selectMove,
};

export function getGameState$(action$: Subject<ObservableAction>, defaultState: GameState): Observable<GameState> {  
  const state$ = action$.pipe(
    scan((state:GameState, action:ObservableAction) => {
      return actions[action.key](deepCopy(state) as GameState, ...action.args);
    }, defaultState),
    startWith(defaultState),
  );
  return state$;
}

function calculateWinner(squares: SquareValue[]): SquareValue {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
