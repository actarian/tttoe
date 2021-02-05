export type SquareValue = 'X' | 'O' | null;

export type SquareProps = {
    key: number;
    value: SquareValue;
    onClick: (event: any) => void;
}

export type BoardProps = {
    squares: SquareValue[];
    onClick: (event: any) => void;
}

export type BoardState = {
    squares: SquareValue[];
}

export type GameProps = {
}

export type GameState = {
    history: BoardState[];
    index: number;
    xIsNext: boolean;
    winner: SquareValue;
}
