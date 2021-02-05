
import * as React from 'react';
import { Square } from './square';

export interface IBoardProps {
  squares: ("X" | "O" | null)[];
  onClick: (event: any) => void;
}

export class Board extends React.Component<IBoardProps> {
  render() {
    return (
      <div className="tttoe__board">
        {this.props.squares.map((square, i) => <Square key={i} value={square} onClick={() => this.props.onClick(i)} />)}
      </div>
    );
  }
}
