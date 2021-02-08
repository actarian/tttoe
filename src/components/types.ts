export type SquareValue = 'X' | 'O' | null;

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
  onClick: (event: any) => void;
}

export type BoardState = {
  squares: SquareValue[];
}

export type GameProps = {
}

export type GameAction =
  | { type: 'selectSquare', i: number }
  | { type: 'selectMove', i: number };

export type GameState = {
  boards: BoardState[];
  index: number;
  victoryLine: number[];
  winner: SquareValue;
  tie: boolean;
}
