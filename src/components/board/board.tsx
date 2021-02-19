
import * as React from 'react';
import { Square } from '../square/square';
import { BoardProps } from '../types';
import './board.scss';

export function Board(props: BoardProps) {
  return (
    <div className="tttoe__board">
      {(props.squares.map((v, i) => <Square key={i} index={i} value={v} victory={props.victoryLine.indexOf(i) !== -1} onClick={() => props.onClick(i)} />))}
    </div>
  );
}
