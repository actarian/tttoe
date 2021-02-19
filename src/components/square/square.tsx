
import * as React from 'react';
import { SquareProps } from '../types';
import './square.scss';

export function Square(props: SquareProps) {
  return (
    <button className={`tttoe__square${props.victory ? ' victory' : ''}`} onClick={(event) => props.onClick(event)}>
      <span>{props.value}</span>
    </button>
  );
}
