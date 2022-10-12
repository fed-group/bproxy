/*
 * @description: 控制条
 * @author: Feng Yinchao
 * @Date: 2022-10-11 17:23:28
 */
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { WsMessageTypeEnum } from '@bproxy/bridge';
import { ClearOutlined, MacCommandOutlined, PlayCircleOutlined } from '../components/UI';

import './Controller.scss';
import { useStore } from '../store';
import { wsClient } from '../App';
import { Log } from '../index';

const Controller = () => {
  const [connected, setConnected] = useState(false);

  const { paused, togglePause, resetList } = useStore(state => state);
  const [proxySeted, setProxySeted] = useState(false);

  const setProxy = () => {
    wsClient.send({ type: WsMessageTypeEnum.CLIENT_SETPROXY, payload: { on: !proxySeted } });
  };

  useEffect(() => {
    if (connected) {
      wsClient.send({ type: WsMessageTypeEnum.CLIENT_GETPROXY, payload: { msg: '请求代理状态' } });
    }
  }, [connected]);

  useEffect(() => {
    const sub = wsClient.message$.subscribe(message => {
      Log(JSON.stringify(message));
      console.log('===message', message);
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
        // case WsMessageTypeEnum.SERVER_PROXY_REQUEST_RES:
        //   // eslint-disable-next-line no-case-declarations
        //   const item = message.payload.item as ProxyRequestItem;
        //   addItemIntoList(item);
        //   break;
        default:
          break;
      }
    });
    return () => {
      sub.unsubscribe();
    };
  }, []);

  return (
    <div className="controller">
      {!connected ? <div className="disconnected">bproxy 已经停止工作，等待连接中...</div> : null}
      <div
        onClick={togglePause}
        className={classNames({
          disabled: paused,
        })}
      >
        <PlayCircleOutlined />
        <span>日志开关</span>
      </div>
      <div onClick={resetList}>
        <ClearOutlined />
        <span>清理日志</span>
      </div>
      <div
        className={classNames({
          [proxySeted ? 'warn' : 'disabled']: true,
        })}
        onClick={setProxy}
      >
        <MacCommandOutlined />
        <span>{proxySeted ? '已开系统代理' : '系统代理'}</span>
      </div>
    </div>
  );
};

export default Controller;
