/*
 * @description:httpsMiddleware 代理实现
 * @author: Feng Yinchao
 * @Date: 2022-08-26 17:47:04
 */
// eslint-disable-next-line import/no-unresolved
import { IHttp } from 'src/types/http';

export default class httpsMiddleware {
  static proxy(req: IHttp.HttpIncomingMessage, res: IHttp.HttpServerResponse) {
    const { url } = req;

    res.end(url);
  }
}
