import { IHttp } from '../types/http';

export default class httpsMiddleware {
  proxy(req: IHttp.HttpIncomingMessage, res: IHttp.HttpServerResponse) {
    const { url } = req;

    res.end(url);
  }
}
