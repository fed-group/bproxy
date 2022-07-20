import { IncomingMessage, ServerResponse } from 'http';

declare namespace IHttp {
  interface HttpIncomingMessage extends IncomingMessage {
    requestId: string;
  }

  type HttpServerResponse = ServerResponse;
}
