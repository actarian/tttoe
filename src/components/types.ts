// reducer

export enum Status {
  Idle = 'Idle',
  Connecting = 'Connecting',
  Connected = 'Connected',
  Waiting = 'Waiting',
  Playing = 'Playing',
}

export type Action =
  | { type: Actions.Connect }
  | { type: Actions.FindMatch }
  | { type: Actions.OnOpponentDidLeave }
  | { type: Actions.SetStatus, status: Status }
  | { type: Actions.SendMessage, message: string }
  | { type: Actions.OnMessage, message: Message }
  | { type: Actions.OnResponse, message: Message }
  | { type: Actions.SelectMove, i: number }
  | { type: Actions.SelectSquare, i: number };

export enum Actions {
  Connect = 'Connect',
  FindMatch = 'FindMatch',
  OnOpponentDidLeave = 'OnOpponentDidLeave',
  SetStatus = 'SetStatus',
  SendMessage = 'SendMessage',
  OnMessage = 'OnMessage',
  OnResponse = 'OnResponse',
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

export type Message = {
  // user: AttributesMap;
  timeStamp: number;
  uid: string;
  text: string;
  remoteId?: string;
  senderId?: string;
  i?: number;
}

export type State = {
  uid: string;
  status: Status;
  messages: Message[];
  opponent: string | null;
  //
  boards: BoardState[];
  index: number;
  victoryLine: number[];
  winner: SquareValue;
  tie: boolean;
  sign: SquareValue;
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
  onClick: (event: any) => void;
}

export type GameProps = {
}
