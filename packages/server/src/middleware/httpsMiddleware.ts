/*
 * @description:httpsMiddleware 代理实现
 * @author: Feng Yinchao
 * @Date: 2022-08-26 17:47:04
 */
import url from 'url';
import net from 'net';
import type { Socket } from 'net';
import type { IHttp } from '../types/http';
import { createHttpHeader } from '../helpers/utils';

export default class httpsMiddleware {
  static proxy(req: IHttp.HttpIncomingMessage, socket: Socket, head: Buffer): void {
    const httpsUrl = `https://${req.url}`;
    const { port, hostname } = url.parse(httpsUrl);
    const socketAgent = net.connect(Number(port), hostname, () => {
      const agent = 'bproxy Agent';
      const header = createHttpHeader(`HTTP/${req.httpVersion} 200 Connection Established`, {
        'Proxy-agent': `${agent}`,
      });
      socket
        .on('error', () => {
          socketAgent.end();
          socketAgent.destroy();
        })
        .write(header);

      socketAgent.write(head);
      socketAgent.pipe(socket).pipe(socketAgent);
    });
    socketAgent.on('error', () => {
      socketAgent.end();
    });
  }
}
