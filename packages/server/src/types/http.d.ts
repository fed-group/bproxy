/*
 * @description: IHttp 类型定义补充
 * @author: Feng Yinchao
 * @Date: 2022-08-26 17:47:04
 */
import type { IncomingMessage, ServerResponse } from 'http';

declare namespace IHttp {
  interface HttpIncomingMessage extends IncomingMessage {
    requestId: string;
  }

  type HttpServerResponse = ServerResponse;
}
