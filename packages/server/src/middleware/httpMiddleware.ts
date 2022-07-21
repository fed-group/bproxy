import { IHttp } from '../types/http';

export default class httpMiddleware {
  proxy(req: IHttp.HttpIncomingMessage, res: IHttp.HttpServerResponse) {
    res.writeHead(200, {});
    res.end('hello bprxy');
  }
}
