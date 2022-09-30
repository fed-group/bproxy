/*
 * @description: handleWebsocketMessage
 * @author: Feng Yinchao
 * @Date: 2022-08-26 17:47:04
 */
import WSServer from '@bproxy/bridge/wsServer';
import { skip } from 'rxjs';
import { WsMessageTypeEnum } from '@bproxy/bridge';
import { getIpAddress, isMac } from '@bproxy/utils/os';
import {
  getActiveNetworkProxyStatus,
  setActiveNetworkProxy,
  setActiveNetworkProxyStatus,
} from '@bproxy/bridge/systemProxyMac';
import { setSystemProxy, getSystemProxyStatus, disableSystemProxy } from '@bproxy/bridge/systemProxyWindow';
import { Log } from './index';
import dataset from './dataset';

const ip = getIpAddress();

// eslint-disable-next-line import/prefer-default-export
export const handleWebsocketMessage = (wsServer: WSServer) => {
  wsServer.message$.pipe(skip(1)).subscribe(async msg => {
    const { socket, data } = msg;
    Log('收到消息：', data);
    if (data?.type === WsMessageTypeEnum.CLIENT_SETPROXY) {
      const { payload } = data;
      if (isMac) {
        if (payload.on) {
          setActiveNetworkProxy({ host: ip[0], port: dataset?.config?.port?.toString() });
        } else {
          setActiveNetworkProxyStatus('off');
        }
        const res = getActiveNetworkProxyStatus();
        wsServer.send(
          { type: WsMessageTypeEnum.SERVER_GETPROXY_RES, payload: { msg: res['Wi-Fi'] ? 'ok' : 'error' } },
          socket,
        );
      } else {
        if (payload.on) {
          await setSystemProxy({ hostname: ip[0], port: dataset?.config?.port?.toString() });
        } else {
          await disableSystemProxy();
        }
        const res = await getSystemProxyStatus({});
        wsServer.send({ type: WsMessageTypeEnum.SERVER_GETPROXY_RES, payload: { msg: res ? 'ok' : 'error' } }, socket);
      }
    }
    if (data?.type === WsMessageTypeEnum.CLIENT_GETPROXY) {
      if (isMac) {
        const res = getActiveNetworkProxyStatus();
        wsServer.send(
          { type: WsMessageTypeEnum.SERVER_GETPROXY_RES, payload: { msg: res['Wi-Fi'] ? 'ok' : 'error' } },
          socket,
        );
      } else {
        const res = await getSystemProxyStatus({});
        wsServer.send({ type: WsMessageTypeEnum.SERVER_GETPROXY_RES, payload: { msg: res ? 'ok' : 'error' } }, socket);
      }
    }
  });
};
