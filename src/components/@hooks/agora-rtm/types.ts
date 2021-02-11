import { BoardState, SquareValue } from "../../types";

export enum Status {
  Idle = 'Idle',
  Connecting = 'Connecting',
  Connected = 'Connected',
  Waiting = 'Waiting',
  Playing = 'Playing',
}

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
