import { defineBproxyConfig } from './getUserConfig';

const config = defineBproxyConfig({
  port: 8888,
  https: true,
  // 把线上 html 代理到本地 server
  htmlRule: {
    pattern: '/topic/template/h5/peace-handbook',
    proxyTo: 'http://localhost:3001',
  },
  // 把静态资源(css,js,font 等)代理到本地 server
  staticRule: [
    {
      pattern: 'https://sta-op-test.douyucdn.cn/front-publish/peace-handbook-live/',
      proxyTo: 'http://localhost:3001',
    },
  ],
  // mock 服务端数据
  apiRule: [
    {
      pattern: 'vvvvvvv',
      proxyTo: '',
    },
  ],
  plugins: [
    function () {
      return '';
    },
  ],
});

export { config };
