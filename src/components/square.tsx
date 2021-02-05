
import * as React from 'react';
import { SquareProps } from './types';

export function Square(props: SquareProps) {
  return (
    <button className="tttoe__square" onClick={props.onClick}>{props.value}</button>
  );
}
