import { ProxyRequestItem, WsMessageTypeEnum } from '@bproxy/bridge';
import { userConfig, wsServer } from '../dev';
import http from 'http';
import path from 'path';
import fs from 'fs-extra';
import fetch from 'node-fetch';
import { Log } from '../index';
import mime from 'mime';
import { OutgoingHttpHeaders } from 'http';

export const httpMiddleware = {
  async proxy(req: http.IncomingMessage, res: http.ServerResponse) {
    const { htmlRule, staticRule, apiRule } = userConfig;
    if (req.url.includes(htmlRule.pattern)) {
      this.proxyToLocalServer(req, res, htmlRule.proxyTo, true);
    }
    if (req.url.includes(apiRule[0].pattern)) {
      this.proxyToLocalFile(req, res);
    } else if (req.url.includes(staticRule[0].pattern)) {
      this.proxyToLocalServer(req, res, staticRule[0].proxyTo);
    } else {
      // this.proxyToRequest(req, res);
    }
  },

  async proxyToLocalServer(req: http.IncomingMessage, res: http.ServerResponse, server: string, isHtml = false) {
    const response = await fetch(isHtml ? server : `${server}/js/peace-handbook.js`);
    const body = await response.text();
    res.writeHead(response.status, (response.headers as unknown) as OutgoingHttpHeaders);
    res.end(body);
  },

  async proxyToRequest(req: http.IncomingMessage, res: http.ServerResponse) {
    const response = await fetch(req.url);
    const requestHeaders = req.headers;
    const requestContentType = requestHeaders['content-type'];
    const body = await response.text();
    res.writeHead(response.status, (response.headers as unknown) as OutgoingHttpHeaders);
    res.end(body);
    const proxyRequestItem: ProxyRequestItem = {
      type: req.headers.location?.includes('https') ? 'https' : 'http',
      method: req.method,
      status: response.status,
      url: req.url,
      response: body,
    };
    wsServer?.send(
      { type: WsMessageTypeEnum.SERVER_PROXY_REQUEST_RES, payload: { item: proxyRequestItem } },
      wsServer.clientSocket,
    );
    Log(req.url, requestContentType, response.headers);
  },

  async proxyToLocalFile(req: http.IncomingMessage, res: http.ServerResponse) {
    const filepath = path.join(__dirname, '../mock/test.json');
    const readStream = fs.createReadStream(filepath);
    const fileContentType = mime.getType(filepath);
    const headers = {};
    if (fileContentType && !headers['content-type']) {
      headers['content-type'] = fileContentType;
    }
    res.writeHead(200, headers);
    readStream.pipe(res);
    Log(headers);
    const proxyRequestItem: ProxyRequestItem = {
      type: req.headers.location?.includes('https') ? 'https' : 'http',
      method: req.method,
      status: 200,
      url: req.url,
      response: JSON.stringify(await fs.readJSON(filepath)),
    };
    wsServer?.send(
      { type: WsMessageTypeEnum.SERVER_PROXY_REQUEST_RES, payload: { item: proxyRequestItem } },
      wsServer.clientSocket,
    );
  },
};
