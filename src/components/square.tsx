
import * as React from 'react';

export interface ISquareProps {
  key: number;
  value: 'X' | 'O' | null;
  onClick: (event: any) => void;
}

export function Square(props: ISquareProps) {
  return (
    <button className="tttoe__square" onClick={props.onClick}>{props.value}</button>
  );
}
