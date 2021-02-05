
import * as React from 'react';

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

export class GameState {
  component!: React.Component<IGameProps, IGameState>;

  constructor(component: React.Component<IGameProps, IGameState>) {
    const state = {
      history: [{
        squares: new Array(9).fill(null)
      }],
      index: 0,
      xIsNext: true
    };
    component.state = state;
  }

  canMove(i: number):boolean {
    const history = this.component.state.history;
    const current = history[history.length - 1];
    const squares = current.squares;
    if (calculateWinner(squares) || squares[i]) {
      return false;
    } else {
      return true;
    }
  }

  onClick(i: number) {
    if (this.canMove(i)) {
      const state = this.component.state;
      const history = state.history.slice();
      const current = history[history.length - 1];
      const squares = current.squares.slice();
      squares[i] = state.xIsNext ? 'X' : 'O';
      this.component.setState({
        history: history.concat([{
          squares: squares
        }]),
        index: history.length,
        xIsNext: !state.xIsNext
      });
    }
  }

  navTo(i: number) {
    this.component.setState({
      index: i,
      xIsNext: (i % 2) === 0,
    });
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
