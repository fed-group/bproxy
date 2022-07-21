import { IHttp } from 'src/types/http';
import dataset from '../dataset';
import ruleTest from '../ruleTest';

export default class httpMiddleware {
  proxy(req: IHttp.HttpIncomingMessage, res: IHttp.HttpServerResponse) {
    const { rules = [] } = dataset?.config || {};
    const { url } = req;
    res.writeHead(200, {});
    // res.end('hello bproxy');
    res.end(JSON.stringify(ruleTest(rules, url)));
  }
}
