import { IWsMessage, Log, WsMessageTypeEnum } from './index';
import { BehaviorSubject } from 'rxjs';

interface IWsClientConfig {
  url: string;
}

class WSClient {
  private websocket: WebSocket;
  private websocketUrl: string;
  private reconnectCount = 0;
  message$ = new BehaviorSubject<IWsMessage>({ type: WsMessageTypeEnum.INIT });

  constructor(config: IWsClientConfig) {
    const { url } = config;
    if (url) {
      this.websocketUrl = url;
      this.connect(url);
    }
  }

  private connect(url: string) {
    this.websocket = new WebSocket(url);
    this.websocket.onopen = () => {
      this.message$.next({ type: WsMessageTypeEnum.CONNECTED, payload: { msg: '已连接' } });
    };
    this.websocket.onclose = () => {
      this.message$.next({ type: WsMessageTypeEnum.CLOSED, payload: { msg: '已断开' } });
    };
    this.websocket.onmessage = e => {
      const data: IWsMessage = JSON.parse(e.data);
      this.message$.next(data);
    };
  }

  send(data: IWsMessage) {
    if (this.websocket?.readyState === WebSocket.OPEN) {
      this.websocket.send(JSON.stringify(data));
    }
  }

  reconnect() {
    const timer = setInterval(() => {
      this.reconnectCount += 1;
      if (this.websocket.readyState === WebSocket.OPEN) {
        clearInterval(timer);
        return;
      }
      this.connect(this.websocketUrl);
      if (this.reconnectCount > 10) {
        clearInterval(timer);
      }
    }, 1500);
  }
}

export default WSClient;
