/* eslint-disable react-hooks/exhaustive-deps */
import AgoraRTM, { RtmChannel, RtmClient, RtmMessage } from 'agora-rtm-sdk';
import { useEffect, useReducer, useRef } from 'react';
import { selectMove, selectSquare } from '../../game/game.service';
import { Action, Actions, Message, State, Status } from '../../types';
import { deepCopy } from '../utils/utils';

const CLIENT = AgoraRTM.createInstance(process.env.APP_ID as string);
const CHANNEL = CLIENT.createChannel(process.env.CHANNEL_ID as string);
const UID = makeRandonUid();

export function useAgoraRtm(uid: string = UID, client: RtmClient = CLIENT, channel$: RtmChannel = CHANNEL): [State, React.Dispatch<Action>] {

  function makeMessage(message: { text: string, remoteId?: string, senderId?: string, i?: number }): Message {
    return { timeStamp: Date.now(), uid, ...message };
  }

  const channel = useRef(channel$).current;

  const sendMessage = async (message: { text: string, remoteId?: string, senderId?: string, i?: number }) => {
    // console.log('AgoraRtm.sendMessage');
    message = makeMessage(message);
    return channel.sendMessage({ text: JSON.stringify(message) });
  };

  const sendMessageToPeer = async (message: { text: string, remoteId?: string, senderId?: string, i?: number }, remoteId: string) => {
    message = makeMessage(message);
    return client.sendMessageToPeer({ text: JSON.stringify(message) }, remoteId);
  }

  // client.subscribePeersOnlineStatus(peerIds: string[]): Promise<void>
  // client.unsubscribePeersOnlineStatus(peerIds: string[]): Promise<void>

  function reducer(prevState: State, action: Action) {
    // console.log('AgoraRtm.reducer', action.type);
    let state;
    switch (action.type) {

      case Actions.Connect:
        if (prevState.status === Status.Idle) {
          state = deepCopy<State>(prevState);
          state.status = Status.Connecting;
          return state;
        } else {
          return prevState;
        }

      case Actions.SetStatus:
        state = deepCopy<State>(prevState);
        state.status = action.status;
        return state;

      case Actions.SendMessage:
        if (prevState.status === Status.Connected) {
          sendMessage({ text: action.message }).catch((error) => {
            console.log('AgoraRtm.sendMessage', action.type, error);
          });
        }
        return prevState;

      case Actions.FindMatch:
        if (prevState.status === Status.Connected ||
          (prevState.status === Status.Playing && prevState.winner)) {
          state = deepCopy<State>(prevState);
          state.opponent = null;
          state.sign = null;
          // reset
          state.boards = [{ squares: new Array(9).fill(null) }];
          state.index = 0;
          state.victoryLine = [];
          state.winner = null;
          state.tie = false;
          // reset
          state.status = Status.Waiting;
          sendMessage({ text: 'Waiting' }).catch((error) => {
            console.log('AgoraRtm.sendMessage', action.type, error);
          });
          return state;
        }
        return prevState;

      case Actions.OnOpponentDidLeave:
        state = deepCopy<State>(prevState);
        state.opponent = null;
        state.status = Status.Connected;
        return state;

      case Actions.OnResponse:
        state = deepCopy<State>(prevState);
        state.messages.push(action.message);
        return state;

      case Actions.SelectSquare:
        state = selectSquare(deepCopy<State>(prevState), action.i) as State;
        sendMessage({ text: 'SelectSquare', i: action.i }).catch((error) => {
          console.log('AgoraRtm.sendMessage', action.type, error);
        });
        return state;

      case Actions.SelectMove:
        state = selectMove(deepCopy<State>(prevState), action.i) as State;
        return state;

      case Actions.OnMessage:
        const message = action.message;
        switch (message.text) {
          case 'Waiting':
            if (prevState.status === Status.Waiting && !prevState.opponent) {
              state = deepCopy<State>(prevState);
              state.opponent = message.uid;
              sendMessage({ text: 'Accepting' }).catch((error) => {
                console.log('AgoraRtm.sendMessage', action.type, error);
              });
            } else {
              return prevState;
            }
            break;
          case 'Accepting':
            if (prevState.status === Status.Waiting) {
              state = deepCopy<State>(prevState);
              state.opponent = message.uid;
              state.sign = 'X';
              state.status = Status.Playing;
              sendMessage({ text: 'Confirm' }).catch((error) => {
                console.log('AgoraRtm.sendMessage', action.type, error);
              });
            } else {
              return prevState;
            }
            break;
          case 'Confirm':
            if (prevState.status === Status.Waiting && prevState.opponent === message.uid) {
              state = deepCopy<State>(prevState);
              state.sign = 'O';
              state.status = Status.Playing;
            } else {
              return prevState;
            }
            break;
          case 'SelectSquare':
            state = selectSquare(deepCopy<State>(prevState), message.i as number) as State;
            break;
          default:
            state = deepCopy<State>(prevState);
            state.messages.push(message);
        }
        return state;

      default:
        throw new Error('unknown action');
    }
  }

  const [state, dispatch] = useReducer<(prevState: State, action: Action) => State>(reducer, {
    uid, status: Status.Idle, messages: [], opponent: null,
    sign: null,
    boards: [{
      squares: new Array(9).fill(null)
    }],
    index: 0,
    victoryLine: [],
    winner: null,
    tie: false,
  });

  const onMessage = (data: RtmMessage, senderUid: string) => {
    // console.log('AgoraRtm.onMessage', data, uid);
    if (senderUid !== uid && data.messageType === 'TEXT') {
      const message: Message = JSON.parse(data.text) as Message;
      if (!message.remoteId || message.remoteId === uid) {
        dispatch({ type: Actions.OnMessage, message });
      } else if (message.senderId === uid) {
        dispatch({ type: Actions.OnResponse, message });
      }
    }
  };
  const onMessageRef = useRef(onMessage);
  useEffect(() => { onMessageRef.current = onMessage; });

  const onMemberLeft = (memberId: string) => {
    // console.log('onMemberLeft', memberId, state.opponent);
    if (memberId === state.opponent) {
      dispatch({ type: Actions.OnOpponentDidLeave });
    }
  };
  const onMemberLeftRef = useRef(onMemberLeft);
  useEffect(() => { onMemberLeftRef.current = onMemberLeft; });

  useEffect(() => {
    const onMessageListener = (data: RtmMessage, uid: string) => {
      onMessageRef.current(data, uid);
    };
    const onMemberLeftListener = (memberId: string) => {
      onMemberLeftRef.current(memberId);
    }
    // mount
    async function connect() {
      await client.login({
        uid,
      });
      await channel.join();
      channel.on('ChannelMessage', onMessageListener);
      channel.on('MemberLeft', onMemberLeftListener);
      /*
      await client.setLocalUserAttributes({
        uid,
        color,
      });
      const user = await client.getUserAttributes(uid);
      */
    };
    connect();
    // console.log('connect', channel.listenerCount('ChannelMessage'));
    dispatch({ type: Actions.SetStatus, status: Status.Connected });

    // unmount
    return () => {
      channel.off('ChannelMessage', onMessageListener);
      async function disconnect() {
        await channel.leave();
        await client.logout();
      };
      disconnect();
      // console.log('disconnect');
    };
  }, []);

  return [state, dispatch];
};

export function makeRandonUid(length: number = 16) {
  let result = '';
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charsLength = chars.length;
  for (var i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * charsLength));
  }
  return result;
}
