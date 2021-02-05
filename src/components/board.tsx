
import * as React from 'react';
import { Square } from './square';
import { BoardProps } from './types';

export class Board extends React.Component<BoardProps> {
  render() {
    return (
      <div className="tttoe__board">
        {this.props.squares.map((square, i) => <Square key={i} value={square} onClick={() => this.props.onClick(i)} />)}
      </div>
    );
  }
}
