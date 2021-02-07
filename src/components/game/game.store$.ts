
import { ObservableFactoryResult, ObservableReducer, ObservableReducers, useReducer$ } from '../observable/use.observable';
import { GameState, SquareValue } from '../types';

const selectSquare: ObservableReducer<GameState> = <GameState>(state: any, i: number): GameState => {
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
  // state.winner = getWinner(squares);
  // console.log('selectSquare', i, squares[i], state.index, state.winner);
  return state;
}

const selectMove: ObservableReducer<GameState> = <GameState>(state: any, i: number): GameState => {
  state.index = i;
  checkVictory(state);
  // state.winner = getWinner(squares);
  // console.log('selectMove', i, state.index, state.winner);
  return state;
}

const reducer$: ObservableReducers<GameState> = {
  selectSquare,
  selectMove,
};

export function gameStore$(defaultState: GameState): ObservableFactoryResult<GameState> {
  return useReducer$<GameState>(reducer$, defaultState);
}

export function checkVictory(state: GameState): void {
  const squares = state.boards[state.index].squares;
  state.victoryLine = getVictoryLine(squares);
  state.winner = state.victoryLine.length ? squares[state.victoryLine[0]] : null;
  state.tie = !state.winner && squares.reduce((p: boolean, c: SquareValue) => p && c != null, true);
}

export function getVictoryLine(squares: SquareValue[]): number[] {
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

/*

function reducer(state:GameState, action: ObservableAction):GameState {
  switch (action.key) {
    case 'increment':
      state.index ++;
      return state;
    case 'decrement':
      state.index --;
      return state;
    default:
      throw new Error();
  }
}

function getWinner(squares: SquareValue[]): SquareValue {
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

export function gameState$(action$: Subject<ObservableAction>, defaultState: GameState): Observable<GameState> {
  return observableReducer__$<GameState>(action$, defaultState, actions);
}
*/
/*
export function getGameState$(action$: Subject<ObservableAction>, defaultState: GameState): Observable<GameState> {
  const state$ = action$.pipe(
    scan((state:GameState, action:ObservableAction) => {
      return actions[action.key](deepCopy(state) as GameState, ...action.args);
    }, defaultState),
    startWith(defaultState),
  );
  return state$;
}
*/
