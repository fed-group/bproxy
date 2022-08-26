/* eslint-disable no-param-reassign */
/*
 * @description: WSServer
 * @author: Feng Yinchao
 * @Date: 2022-08-26 17:47:04
 */
import ws from 'ws';
import { Server as HTTPServer } from 'http';
import { Server as HTTPSServer } from 'https';
import { BehaviorSubject } from 'rxjs';
import { IWsMessage, Log, WsMessageTypeEnum } from './index';

declare module 'ws' {
  interface WebSocket {
    alive: boolean;
  }
}

class WSServer {
  private wsServer?: ws.Server;

  message$ = new BehaviorSubject<{ socket: ws.WebSocket; data: IWsMessage }>({
    socket: null,
    data: { type: WsMessageTypeEnum.INIT },
  });

  clientSocket: ws.WebSocket | null;

  constructor(server: HTTPServer | HTTPSServer, noServerMode = false) {
    let wsServer: ws.Server = null;
    if (!noServerMode) {
      wsServer = new ws.Server({ server });
    } else {
      wsServer = new ws.Server({ noServer: true });
      server.on('upgrade', (request, socket, head) => {
        wsServer.handleUpgrade(request, socket, head, socket2 => {
          wsServer.emit('connection', socket2, request);
        });
      });
    }
    wsServer.on('connection', (socket, request) => {
      const path = request.url;
      if (path === '/client') {
        this.clientSocket = socket;
      }

      // 心跳监控
      socket.alive = true;
      socket.on('pong', () => {
        socket.alive = true;
      });
      socket.on('message', (message: string) => {
        const formatedMessage: IWsMessage = JSON.parse(message);
        this.message$.next({ data: formatedMessage, socket });
      });
    });
    this.wsServer = wsServer;
    this.checkAlive();
  }

  private checkAlive() {
    setInterval(() => {
      this.wsServer.clients.forEach((socket: ws.WebSocket) => {
        if (!socket.alive) {
          Log('===socket断开连接');
          return socket.terminate();
        }
        socket.alive = false;
        socket.ping(null, false);
      });
    }, 10000);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, class-methods-use-this
  send(message: IWsMessage, socket: ws.WebSocket) {
    const strMessage = JSON.stringify(message);
    socket?.send(strMessage);
  }

  broadCastMessage(message: IWsMessage) {
    this.wsServer.clients.forEach(client => {
      client.send(`Hello, broadcast message -> ${message}`);
    });
  }
}

export default WSServer;
