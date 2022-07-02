import http from 'http';
import WSServer from '@bproxy/bridge/wsServer';
import { v4 as uuidv4 } from 'uuid';
import { IBproxyUserConfig, Log } from './index';
import { httpMiddleware } from './middleware/httpMiddleware';
import { handleCertDownLoad } from './handleCertDownLoad';
import { getUserConfig } from './getUserConfig';
import { handleWebsocketMessage } from './handleWebsocketMessage';
import { Socket } from 'net';

let wsServer: WSServer = null;
let userConfig: IBproxyUserConfig = null;

declare module 'http' {
  interface IncomingMessage {
    requestId: string;
  }
}

const dev = async () => {
  userConfig = (await getUserConfig()).config;
  if (!userConfig) {
    return;
  }
  Log('userConfig', userConfig);

  const httpserver = http
    .createServer((req, res) => {
      switch (req.url) {
        // 证书下载
        case '/cert':
          handleCertDownLoad(res);
          break;

        default:
          break;
      }
    })
    .listen(userConfig.port, () => {
      Log(`Secure Server is listening on port ${userConfig.port}`);
    });

  // 代理 http 请求
  httpserver.on('request', (req: http.IncomingMessage, res: http.ServerResponse) => {
    if (req.url.includes('/cert')) {
      return;
    }
    if (!req.requestId) {
      req.requestId = uuidv4();
    }
    httpMiddleware.proxy(req, res);
  });

  // 代理 https 请求
  httpserver.on('connect', (req: http.IncomingMessage, res: http.ServerResponse) => {
    if (!req.requestId) {
      req.requestId = uuidv4();
    }
    httpMiddleware.proxy(req, res);
  });

  // 代理 websocket 请求
  httpserver.on('upgrade', (req: http.IncomingMessage, socket: Socket, head: Buffer) => {
    if (!req.requestId) {
      req.requestId = uuidv4();
    }
    // httpMiddleware.proxy($req, res);
  });

  // websocket server 创建及消息处理
  wsServer = new WSServer(httpserver, true);
  handleWebsocketMessage(wsServer);
};

export { wsServer, dev, userConfig };
