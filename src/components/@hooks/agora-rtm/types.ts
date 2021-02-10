export enum Status {
  Idle = 'Idle',
  Connecting = 'Connecting',
  Connected = 'Connected',
  Waiting = 'Waiting',
  Playing = 'Playing',
}

export enum Actions {
  Connect = 'Connect',
  SetStatus = 'SetStatus',
  SendMessage = 'SendMessage',
  OnMessage = 'OnMessage',
  OnResponse = 'OnResponse',
  FindMatch = 'FindMatch',
}

export type Message = {
  // user: AttributesMap;
  timeStamp: number;
  uid: string;
  text: string;
  remoteId?: string;
  senderId?: string;
}

export type State = {
  uid: string;
  status: Status;
  messages: Message[];
  opponent: string | null;
}

export type Action =
  | { type: Actions.Connect }
  | { type: Actions.SetStatus, status: Status }
  | { type: Actions.SendMessage, message: string }
  | { type: Actions.OnMessage, message: Message }
  | { type: Actions.OnResponse, message: Message }
  | { type: Actions.FindMatch, message: Message };
