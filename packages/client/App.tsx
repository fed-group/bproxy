/*
 * @description: Client APP 入口
 * @author: Feng Yinchao
 * @Date: 2022-08-26 17:47:04
 */
import 'animate.css';
import './App.scss';
import { WSClient } from '@bproxy/bridge';
import ControllerBar from './modules/Controller';
import Table from './modules/Table';

export const wsClient = new WSClient({ url: 'ws://localhost:8888/client' });

const App = () => (
  <>
    <ControllerBar />
    <Table />
  </>
);

export default App;
