/* eslint-disable no-unused-vars */
/*
 * @description:
 * @author: Feng Yinchao
 * @Date: 2022-08-26 17:47:04
 */
import fs from 'fs-extra';
import http from 'http';
import { Socket } from 'net';
import { v4 as uuidv4 } from 'uuid';
import inject from '@bproxy/utils/inject';
// eslint-disable-next-line import/no-unresolved
import { IHttp } from 'src/types/http';
import config, { appConfigFilePath, appDataPath, configTemplateCommonJS } from './config';
import { getUserConfig } from './getUserConfig';
import { Log } from './index';
import localStaicServer from './localStaicServer';
import httpMiddleware from './middleware/httpMiddleware';
import httpsMiddleware from './middleware/httpsMiddleware';

function beforeAppStart() {
  // 创建app data 目录
  if (!fs.existsSync(appDataPath)) {
    fs.mkdirpSync(appDataPath);
  }
  // 创建默认配置文件
  if (!fs.existsSync(appConfigFilePath)) {
    fs.writeFileSync(appConfigFilePath, configTemplateCommonJS);
  }

  const certFilePath = config.certificate.getDefaultCACertPath();
  if (!fs.existsSync(certFilePath)) {
    // TODO, 创建证书
  }
}

function setRequestId(req: IHttp.HttpIncomingMessage) {
  if (!req.requestId) {
    req.requestId = uuidv4();
  }
}

function isLocalHost(url: string) {
  return url.startsWith('http://127.0.0.1') || url.startsWith('http://localhost');
}

const dev = async () => {
  // 启动前检查配置文件，证书等
  beforeAppStart();
  // 加载用户的配置文件
  const userConfig = await getUserConfig();
  if (!userConfig) {
    Log('userConfig is empty');
    process.exit(0);
  }
  Log('userConfig', userConfig);

  // 启动代理服务器
  const httpserver = http
    .createServer(() => undefined)
    .listen(userConfig.port, () => {
      Log(`Secure Server is listening on port ${userConfig.port}`);
    });

  // 代理 http 请求
  httpserver.on('request', (req: IHttp.HttpIncomingMessage, res: IHttp.HttpServerResponse) => {
    if (isLocalHost(req.url)) {
      // 本地资源服务
      localStaicServer(req, res);
      return;
    }
    setRequestId(req);
    httpMiddleware.proxy(req, res);
  });

  // 代理 https 请求
  httpserver.on('connect', (req: IHttp.HttpIncomingMessage, res: IHttp.HttpServerResponse) => {
    setRequestId(req);
    httpsMiddleware.proxy(req, res);
  });

  // 代理 websocket 请求
  httpserver.on('upgrade', (req: IHttp.HttpIncomingMessage, socket: Socket, head: Buffer) => {
    setRequestId(req);
  });

  // websocket server 创建及消息处理
  // wsServer = new WSServer(httpserver, true);
  // handleWebsocketMessage(wsServer);
};

// eslint-disable-next-line import/prefer-default-export
export { dev };
