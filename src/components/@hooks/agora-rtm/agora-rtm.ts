/* eslint-disable react-hooks/exhaustive-deps */
import { RtmChannel, RtmClient, RtmMessage } from 'agora-rtm-sdk';
import { useEffect, useReducer, useRef } from 'react';
import { deepCopy } from '../utils/utils';
import { Action, Actions, Message, State, Status } from './types';

export function useAgoraRtm(uid: string, client: RtmClient, channel$: RtmChannel): [State, React.Dispatch<Action>] {

  function makeMessage(message: { text: string, remoteId?: string, senderId?: string }): Message {
    return { timeStamp: Date.now(), uid, ...message };
  }

  const channel = useRef(channel$).current;

  const sendMessage = async (message: { text: string, remoteId?: string, senderId?: string }) => {
    // console.log('AgoraRtm.sendMessage');
    message = makeMessage(message);
    return channel.sendMessage({ text: JSON.stringify(message) });
  };

  const sendMessageToPeer = async (message: { text: string, remoteId?: string, senderId?: string }, remoteId: string) => {
    message = makeMessage(message);
    return client.sendMessageToPeer({ text: JSON.stringify(message) }, remoteId);
  }

  // client.subscribePeersOnlineStatus(peerIds: string[]): Promise<void>
  // client.unsubscribePeersOnlineStatus(peerIds: string[]): Promise<void>

  const [state, dispatch] = useReducer<(prevState: State, action: Action) => State>(reducer, {
    uid, status: Status.Idle, messages: [], opponent: null,
  });

  // const [messages, setMessages] = useState<Message[]>([]);
  // const [currentMessage, setCurrentMessage] = useState<Message>();

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
          sendMessage({ text: action.message }).then(() => {
            console.log('AgoraRtm.sendMessage.sent', action.message);
            // const message = makeMessage({ text: action.message });
            // dispatch({ type: Actions.OnMessage, message });
            //
            // setCurrentMessage(message);
            // setState({ ...state, messages: [...state.messages, message] });
          }).catch((error) => {
            console.log('AgoraRtm.sendMessage', error);
          });
        }
        return prevState;

      case Actions.FindMatch:
        if (prevState.status === Status.Connected) {
          state = deepCopy<State>(prevState);
          state.status = Status.Waiting;
          sendMessage({ text: 'Waiting' }).catch((error) => {
            console.log('AgoraRtm.sendMessage', error);
          });
          return state;
        }
        return prevState;

      case Actions.OnMessage:
        const message = action.message;
        switch (message.text) {
          case 'Waiting':
            if (prevState.status === Status.Waiting && !prevState.opponent) {
              state = deepCopy<State>(prevState);
              state.opponent = message.uid;
              sendMessage({ text: 'Accepting' }).catch((error) => {
                console.log('AgoraRtm.sendMessage', error);
              });
            } else {
              return prevState;
            }
            break;
          case 'Accepting':
            if (prevState.status === Status.Waiting) {
              state = deepCopy<State>(prevState);
              state.opponent = message.uid;
              state.status = Status.Playing;
              sendMessage({ text: 'Confirm' }).catch((error) => {
                console.log('AgoraRtm.sendMessage', error);
              });
            } else {
              return prevState;
            }
            break;
          case 'Confirm':
            if (prevState.status === Status.Waiting && prevState.opponent === message.uid) {
              state = deepCopy<State>(prevState);
              state.status = Status.Playing;
            } else {
              return prevState;
            }
            break;
          default:
            state = deepCopy<State>(prevState);
            state.messages.push(message);
        }
        return state;

      case Actions.OnOpponentDidLeave:
        state = deepCopy<State>(prevState);
        state.opponent = null;
        state.status = Status.Connected;
        return state;

      case Actions.OnResponse:
        state = deepCopy<State>(prevState);
        state.messages.push(action.message);
        return state;

      default:
        throw new Error('unknown action');
    }
  }

  const onMessage = (data: RtmMessage, senderUid: string) => {
    // console.log('AgoraRtm.onMessage', data, uid);
    if (senderUid !== uid && data.messageType === 'TEXT') {
      const message: Message = JSON.parse(data.text) as Message;
      /*
      if (message.messageId && has(`message-${message.messageId}`)) {
        dispatch({ type: Actions.OnResponse, message });
        // channel.emit(`message-${message.messageId}`, message);
      }
      */
      if (!message.remoteId || message.remoteId === uid) {
        dispatch({ type: Actions.OnMessage, message });
      } else if (message.senderId === uid) {
        dispatch({ type: Actions.OnResponse, message });
      }
      // console.log('AgoraRtm.onMessage', message, state.messages);
      // setState(Object.assign({}, state, { messages: state.messages.concat([message]) }));
      // setState({ ...state, messages: [...state.messages, message] });
      // const message = { user, text, uid };
      // setCurrentMessage(message);
    }
  };
  const onMessageRef = useRef(onMessage);
  useEffect(() => { onMessageRef.current = onMessage; });


  const onMemberLeft = (memberId: string) => {
    if (memberId === state.opponent) {
      dispatch({ type: Actions.OnResponse, message });
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
    // setState({ ...state, connected: true });
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

  /*
  useEffect(() => {
    if (currentMessage) {
      setState({ ...state, messages: [...state.messages, currentMessage] });
      // setMessages([...messages, currentMessage]);
    }
  }, [currentMessage]);
  */

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

// usage
// tttoe
// 86c20074dd75415eaa828236b52c5416
/*

import React, { useState } from 'react';

import './App.css';
import useAgoraRtm from './hooks/useAgoraRtm';
import AgoraRTM from 'agora-rtm-sdk';

const client = AgoraRTM.createInstance('YOUR-API-KEY');
const randomUseName = makeRandonUid();
function App() {
  const [textArea, setTextArea] = useState('');
  const { messages, sendMessage } = useAgoraRtm(
    randomUseName,
    client as RtmClient
  );
  const submitMessage = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.charCode === 13) {
      e.preventDefault();
      if (textArea.trim().length === 0) return;
      sendMessage(e.currentTarget.value);
      setTextArea('');
    }
  };
  return (
    <div className="App">
      <div className="d-flex flex-column py-5 px-3">
        {messages.map((data, index) => {
          return (
            <div className="row" key={`chat${index + 1}`}>
              <h5 className="font-size-15" style={{ color: data.user.color }}>
                {`${data.user.name} :`}
              </h5>
              <p className="text-break">{` ${data.message}`}</p>
            </div>
          );
        })}
      </div>
      <div>
        <textarea
          placeholder="Type your message here"
          className="form-control"
          onChange={(e) => setTextArea(e.target.value)}
          aria-label="With textarea"
          value={textArea}
          onKeyPress={submitMessage}
        />
      </div>
    </div>
  );
}

export default App;

*/



/*
import { from, interval, of } from 'rxjs';
import { distinctUntilChanged, map, switchMap } from 'rxjs/operators';

export default class RtmService {

  static singleton_:RtmService;

  static getSingleton() {
    if (!this.singleton_) {
      this.singleton_ = new RtmService();
    }
    return this.singleton_;
  }

  constructor() {
    if (RtmService.singleton_) {
      throw ('RtmService is a singleton');
    }
    this.onMessage = this.onMessage.bind(this);
  }

  createClient(next) {
    const messageClient = this.messageClient = AgoraRTM.createInstance(environment.appKey, { logFilter: AgoraRTM.LOG_FILTER_OFF }); // LOG_FILTER_DEBUG
    messageClient.setParameters({ logFilter: AgoraRTM.LOG_FILTER_OFF });
  }

  join(token, uid:string = 'aaaaa', channelName: string = 'mychannel') {

    // console.log('AgoraService.connect$', preferences, devices);
    if (!this.connecting) {
      this.connecting = true;

    }
    // this.rtmToken$(uid).subscribe(token => {
      // console.log('AgoraService.rtmToken$', token);
      let channel;
      return new Promise((resolve, reject) => {
        const messageClient = this.messageClient;
        messageClient.login({ token: token.token, uid: uid }).then(() => {
          // console.log('AgoraService.messageClient.login.success');
          channel = messageClient.createChannel(channelName);
          return channel.join();
        }).then(() => {
          channel.on('ChannelMessage', this.onMessage);
          this.channel = channel;
          // console.log('AgoraService.joinMessageChannel.success');
          resolve(uid);
        }).catch(reject);
      });
      // then(()=>{
      // this.observeMemberCount();
      // });
    // });
  }

  leaveChannel() {
    this.connecting = false;
    return new Promise((resolve, reject) => {
      this.leaveMessageChannel().then(() => {
        return Promise.all([this.leaveClient(), this.leaveScreenClient()]);
      }, reject);
    });
  }

  leaveMessageChannel() {
    return new Promise((resolve, reject) => {
        // this.unobserveMemberCount();
        const channel = this.channel;
        const messageClient = this.messageClient;
        channel.leave().then(() => {
          this.channel = null;
          messageClient.logout().then(() => {
            this.messageClient = null;
            resolve();
          }, reject);
        }, reject)
      } else {
        return resolve();
      }
    });
  }

  membersCount$(channelId:string) {
    const messageClient = this.messageClient;
    return interval(2000).pipe(
      switchMap(() => from(messageClient.getChannelMemberCount([channelId]))),
      map((counters:any) => counters[channelId]),
      distinctUntilChanged(),
    );
  }

  // rtmToken$(uid) {
  // 	if (this.useToken) {
      // return HttpService.post$('/api/token/rtm', { uid: uid });
    // } else {
  // 		return of({ token: null });
  // 	}
  // }

  newMessageId() {
    return `${this.state.uid}-${Date.now().toString()}`;
  }

  sendRemoteControlRequest() {
    return new Promise((resolve, reject) => {
      this.sendMessage({
        type: MessageType.RequestControl,
        messageId: this.newMessageId(),
      }).then((message) => {
        // console.log('AgoraService.sendRemoteControlRequest.response', message);
        if (message.type === MessageType.RequestControlAccepted) {
          resolve(true);
        } else if (message.type === MessageType.RequestControlRejected) {
          // this.remoteDeviceInfo = undefined
          resolve(false);
        }
      });
    });
  }

  sendMessage(message) {
    return new Promise((resolve, reject) => {
      if (this.state.connected) {
        message.clientId = this.state.uid;
        switch (message.type) {
          case MessageType.ControlInfo:
            break;
        }
        const send = (message, channel) => {
          try {
            const text = JSON.stringify(message);
            if (message.messageId) {
              this.once(`message-${message.messageId}`, (message) => {
                resolve(message);
              });
            }
            channel.sendMessage({ text: text }).then(() => {
              if (!message.messageId) {
                resolve(message);
              }
            }).catch(error => {
              console.log('sendMessage.error', error);
            });
          } catch (error) {
            console.log('sendMessage.error', error);
          }
        }
        const channel = this.channel;
        if (channel) {
          send(message, channel);
        } else {
          try {
            this.once(`channel`, (channel) => {
              send(message, channel);
            });
          } catch (error) {
            reject(error);
          }
        }
      }
    })
  }

  checkBroadcastMessage(message) {
    // filter for broadcast
    // !!! filter events here
    switch (message.type) {
      case MessageType.RequestInfoResult:
        this.broadcastMessage(message);
        break;
      default:
        this.broadcastMessage(message);
    }
  }

  broadcastMessage(message) {
    // MessageService.out(message);
  }

  broadcastEvent(event) {
    MessageService.out({
      type: MessageType.AgoraEvent,
      event,
    });
  }

  onMessage(data, uid) {
    if (uid !== this.state.uid) {
      const message = JSON.parse(data.text);
      if (message.messageId && this.has(`message-${message.messageId}`)) {
        this.emit(`message-${message.messageId}`, message);
      }
      if (message.remoteId && message.remoteId !== this.state.uid && message.remoteId !== this.state.screenUid) {
        return;
      }
      this.checkBroadcastMessage(message);
    }
  }

}
*/
