/*
 * @description: Client APP 入口
 * @author: Feng Yinchao
 * @Date: 2022-08-26 17:47:04
 */
import 'animate.css';
// import './App.scss';
import { WsMessageTypeEnum, WSClient, ProxyRequestItem } from '@bproxy/bridge';
import { useEffect, useRef, useState } from 'react';
import { Log } from './index';

const wsClient = new WSClient({ url: 'ws://localhost:8888/client' });

const App = () => {
  const [connected, setConnected] = useState(false);
  const [proxySeted, setProxySeted] = useState(false);
  const [proxyRequestItems, setProxyRequestItems] = useState<ProxyRequestItem[]>([]);
  const originalItems = useRef([]);
  const setProxy = () => {
    wsClient.send({ type: WsMessageTypeEnum.CLIENT_SETPROXY, payload: { on: !proxySeted } });
  };

  useEffect(() => {
    const sub = wsClient.message$.subscribe(message => {
      Log(JSON.stringify(message));
      switch (message.type) {
        case WsMessageTypeEnum.CONNECTED:
          setConnected(true);
          break;
        case WsMessageTypeEnum.CLOSED:
          setConnected(false);
          break;
        case WsMessageTypeEnum.SERVER_GETPROXY_RES:
          setProxySeted(message.payload.msg === 'ok');
          break;
        case WsMessageTypeEnum.SERVER_PROXY_REQUEST_RES:
          // eslint-disable-next-line no-case-declarations
          const item = message.payload.item as ProxyRequestItem;
          originalItems.current.push(item);
          setProxyRequestItems([...originalItems.current]);
          break;
        default:
          break;
      }
    });
    return () => {
      sub.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (connected) {
      wsClient.send({ type: WsMessageTypeEnum.CLIENT_GETPROXY, payload: { msg: '请求代理状态' } });
    }
  }, [connected]);
  return (
    <div>
      <p>Websocket{connected ? '已连接' : '已断开'}</p>
      <p>
        系统代理{proxySeted ? '已开启' : '已关闭'}
        <button onClick={setProxy}>{proxySeted ? '取消代理' : '设置代理'}</button>
      </p>
      <ul>
        {proxyRequestItems.map((item, key) => (
          <li key={key}>
            {item.type} {item.status} {item.url} {item.response}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
