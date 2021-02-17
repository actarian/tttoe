import * as THREE from 'three';

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
  square: THREE.Mesh;
  circle: THREE.Mesh;
  cross: THREE.Mesh;
}

export type CircleProps = {
  circle: THREE.Mesh;
}

export type CrossProps = {
  cross: THREE.Mesh;
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

export type GameProps = {
}

export const MATCAP_WHITE = 'C9C7BE_55514B_888279_7B6E5F'; // EAEAEA_B5B5B5_CCCCCC_D4D4D4
export const MATCAP_BLACK = '2A2A2A_B3B3B3_6D6D6D_848C8C';
