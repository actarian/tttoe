
import * as React from 'react';
import { Board } from './board';

export interface IGameProps {
}

export interface IBoardState {
  squares: ('X' | 'O' | null)[];
}

export interface IGameState {
  history: IBoardState[];
  index: number;
  xIsNext: boolean;
}

export class Game extends React.Component<IGameProps, IGameState> {

  // rxjs with react
  // https://dev.to/bigab/rxjs-with-react-actions-and-subjects-3e5j

  constructor(props: any) {
    super(props);
    this.state = {
      history: [{
        squares: new Array(9).fill(null)
      }],
      index: 0,
      xIsNext: true
    };
  }

  onClick(i: number) {
    const history = this.state.history.slice();
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares
      }]),
      index: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  navTo(i: number) {
    this.setState({
      index: i,
      xIsNext: (i % 2) === 0
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.index];
    const winner = calculateWinner(current.squares);
    const status = winner ? 'Winner: ' + winner : 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    return (
      <div className="tttoe__game">
        <Board squares={current.squares} onClick={i => this.onClick(i)} />
        <div className="tttoe__info">
          <div>{status}</div>
          <ol>{history.map((x, i) => {
            const label: string = i ? 'Go to move #' + i : 'Go to game start';
            return (
              <li key={i}>
                <button onClick={() => this.navTo(i)}>{label}</button>
              </li>
            );
          })}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares: ('X' | 'O' | null)[]): 'X' | 'O' | null {
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
