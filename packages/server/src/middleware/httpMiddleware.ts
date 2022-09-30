/*
 * @description: httpMiddleware 实现
 * @author: Feng Yinchao
 * @Date: 2022-08-26 17:47:04
 */
import type { IHttp } from '../types/http';
import dataset from '../dataset';
import { matcher } from '../helpers/matcher';

export default class httpMiddleware {
  static proxy(req: IHttp.HttpIncomingMessage, res: IHttp.HttpServerResponse): void {
    const { rules = [] } = dataset?.config || {};
    const { url } = req;
    res.writeHead(200, {});
    // res.end('hello bproxy');
    res.end(JSON.stringify(matcher(rules, url)));
  }
}
