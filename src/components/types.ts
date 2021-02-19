// reducer

export type Action =
  | { type: Actions.SelectMove, i: number }
  | { type: Actions.SelectSquare, i: number };

export enum Actions {
  SelectSquare = 'selectSquare',
  SelectMove = 'selectMove',
}

export type GameAction =
  | { type: Actions.SelectSquare, i: number }
  | { type: Actions.SelectMove, i: number };

// state

export type SquareValue = 'X' | 'O' | null;

export type BoardState = {
  squares: SquareValue[];
}

export type GameState = {
  boards: BoardState[];
  index: number;
  victoryLine: number[];
  winner: SquareValue;
  tie: boolean;
}

// views

export type ToastProps = {
  message: string;
}

export type SquareProps = {
  key: number;
  index: number;
  value: SquareValue;
  victory: boolean;
  onClick: (event: any) => void;
}

export type BoardProps = {
  squares: SquareValue[];
  victoryLine: number[];
  onClick: (index: number) => void;
}

export type NavProps = {
  boards: BoardState[];
  index: number;
  move: SquareValue;
  onClick: (index: number) => void;
}

export type ButtonProps = {
  label: string;
  onClick: () => void;
  active?: boolean;
}

export type GameProps = {
}
