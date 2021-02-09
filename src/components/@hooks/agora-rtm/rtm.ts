/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from 'react';
import { AttributesMap, RtmClient, RtmMessage } from './types';

export type IMessage = {
  user: AttributesMap;
  message: string;
}

const USER_ID = Math.floor(Math.random() * 1000000001);

const useAgoraRtm = (userName: string, client: RtmClient) => {

  const [messages, setMessages] = useState<IMessage[]>([]);

  const channel = useRef(client.createChannel('channelId')).current;

  const color = useRef('red').current;

  const initRtm = async () => {
    await client.login({
      uid: USER_ID.toString(),
    });
    await channel.join();
    await client.setLocalUserAttributes({
      name: userName,
      color,
    });
  };

  useEffect(() => {
    initRtm();
    // eslint-disable-next-line consistent-return
  }, []);

  useEffect(() => {
    channel.on('ChannelMessage', (data, uid) => {
      handleMessageReceived(data, uid);
    });
  }, []);

  const handleMessageReceived = async (data: RtmMessage, uid: string) => {
    const user = await client.getUserAttributes(uid);
    console.log(data);
    if (data.messageType === 'TEXT') {
      const newMessageData = { user, message: data.text };
      setCurrentMessage(newMessageData);
    }
  };

  const [currentMessage, setCurrentMessage] = useState<IMessage>();

  const sendChannelMessage = async (text: string) => {
    channel
      .sendMessage({ text })
      .then(() => {
        setCurrentMessage({
          user: { name: 'Current User (Me)', color },
          message: text,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (currentMessage) {
      setMessages([...messages, currentMessage]);
    }
  }, [currentMessage]);

  return { sendChannelMessage, messages };
};

export default useAgoraRtm;

export function makeid(length: number) {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
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
import { RtmClient } from './types/AgoraRTMTypes';

const client = AgoraRTM.createInstance('YOUR-API-KEY');
const randomUseName = makeid(5);
function App() {
  const [textArea, setTextArea] = useState('');
  const { messages, sendChannelMessage } = useAgoraRtm(
    randomUseName,
    client as RtmClient
  );
  const submitMessage = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.charCode === 13) {
      e.preventDefault();
      if (textArea.trim().length === 0) return;
      sendChannelMessage(e.currentTarget.value);
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
