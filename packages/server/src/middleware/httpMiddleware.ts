/*
 * @description: httpMiddleware 实现
 * @author: Feng Yinchao
 * @Date: 2022-08-26 17:47:04
 */
import request from 'request';
import pako from 'pako';
import type WSServer from '@bproxy/bridge/wsServer';
import { WsMessageTypeEnum } from '@bproxy/bridge';
import { get } from 'lodash';
import type { IHttp } from '../types/http';
import dataset from '../dataset';
import { matcher } from '../helpers/matcher';
import { Log } from '../index';
import { getPostBody } from '../helpers/utils';

export default class httpMiddleware {
  static async proxy(req: IHttp.HttpIncomingMessage, res: IHttp.HttpServerResponse, wsServer: WSServer): Promise<void> {
    const { rules = [] } = dataset?.config || {};
    const { url } = req;
    const matchResult = matcher(rules, url);
    const requestHeaders = req.headers;
    // 构造 body 数据
    const isPostOrPutMethod = ['post', 'put'].includes(req.method.toLowerCase());
    let postBodyData: Buffer | undefined;

    if (isPostOrPutMethod) {
      postBodyData = await getPostBody(req);
    }
    Log(matchResult, rules, url);
    // 准备发送给客户端的消息数据
    const responseMessage = {
      url,
      method: 'GET',
      requestHeaders,
      requestId: req.requestId,
      responseBody: '',
      matched: matchResult.matched,
    };
    // 构建 option 对象，传给 request 发起请求
    const option = {
      url: url || req.url,
      method: req.method,
      headers: requestHeaders,
      body: postBodyData || null,
      encoding: null,
      strictSSL: false,
      rejectUnauthorized: false,
      followRedirect: false,
    };
    if (matchResult.matched) {
      const body: Buffer[] = [];
      let originalResponseHeaders = null;
      request(option)
        .on('response', response => {
          originalResponseHeaders = response.headers;
          responseMessage.method = response.request.method;
        })
        .on('data', data => {
          body.push(data as Buffer);
        })
        .on('end', () => {
          const buf = Buffer.concat(body);
          const encoding = get(originalResponseHeaders, '["content-encoding"]');
          const isGzip = encoding === 'gzip';
          let responseText = '';
          if (isGzip) {
            responseText = pako.ungzip(new Uint8Array(buf), { to: 'string' });
          } else if (!encoding) {
            responseText = buf.toString();
          }

          responseMessage.responseBody = responseText;

          wsServer.send(
            { type: WsMessageTypeEnum.SERVER_PROXY_REQUEST_RES, payload: { item: responseMessage } },
            wsServer.clientSocket,
          );
        })
        .pipe(res);
    } else {
      request(option)
        .on('end', () => {
          wsServer.send(
            { type: WsMessageTypeEnum.SERVER_PROXY_REQUEST_RES, payload: { item: responseMessage } },
            wsServer.clientSocket,
          );
        })
        .pipe(res);
    }
  }
}

// {
//   statusCode: 200,
//   body: undefined,
//   headers: {
//     server: 'Tengine',
//     date: 'Fri, 30 Sep 2022 09:36:04 GMT',
//     'content-type': 'text/html;charset=utf-8',
//     'content-length': '29479',
//     connection: 'close',
//     'content-encoding': 'gzip',
//     'access-control-allow-origin': '*',
//     'access-control-allow-credentials': 'true',
//     'access-control-allow-methods': 'GET, POST, OPTIONS',
//     'access-control-allow-headers': 'DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type'
//   },
//   request: {
//     uri: Url {
//       protocol: 'http:',
//       slashes: true,
//       auth: null,
//       host: 'live.dz11.com',
//       port: 80,
//       hostname: 'live.dz11.com',
//       hash: null,
//       search: null,
//       query: null,
//       pathname: '/',
//       path: '/',
//       href: 'http://live.dz11.com/'
//     },
//     method: 'GET',
//     headers: {}
//   }
// }
