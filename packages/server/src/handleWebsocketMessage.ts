import WSServer from '@bproxy/bridge/wsServer';
import { skip } from 'rxjs';
import { WsMessageTypeEnum } from '@bproxy/bridge';
import { getIpAddress, isMac } from '@bproxy/utils/os';
import {
  getActiveNetworkProxyStatus,
  setActiveNetworkProxy,
  setActiveNetworkProxyStatus,
} from '@bproxy/bridge/systemProxyMac';
import { Log } from './index';
import dataset from './dataset';

const ip = getIpAddress();

export const handleWebsocketMessage = (wsServer: WSServer) => {
  wsServer.message$.pipe(skip(1)).subscribe(msg => {
    const { socket, data } = msg;
    Log('收到消息：', data);
    if (data?.type === WsMessageTypeEnum.CLIENT_SETPROXY) {
      const payload = data.payload;
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
        Log('暂未实现');
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
        Log('暂未实现');
      }
    }
  });
};
