import WSClient from './wsClient';
import { debug } from '@bproxy/utils';

export enum WsMessageTypeEnum {
  INIT = 0,
  CONNECTED = 1, // 已连接
  CLOSED = 2, // 已关闭
  CLIENT_SETPROXY = 3, // Client 请求设置系统代理
  SERVER_SETPROXY_RES = 4, // Server 发过来的消息
  CLIENT_GETPROXY = 5,
  SERVER_GETPROXY_RES = 6,
  SERVER_PROXY_REQUEST_RES = 7, // Server 代理的请求结果
}

export interface IWsMessage<T = Record<string, unknown>> {
  type: WsMessageTypeEnum;
  payload?: T;
}

export interface ProxyRequestItem {
  type: 'http' | 'https' | 'websocket';
  method: string;
  status: number;
  response: string;
  [propName: string]: any;
}

const Log = debug('@bproxy/bridge');

export { WSClient, Log };
