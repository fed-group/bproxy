import { defineBproxyConfig } from '@bproxy/server';

const config = defineBproxyConfig({
  port: 8888,
  https: true,
  // 把线上 html 代理到本地 server
  htmlRule: {
    pattern: '',
    proxyTo: 'localhost:3000',
  },
  // 把静态资源(css,js,font 等)代理到本地 server
  staticRule: [
    {
      pattern: '',
      proxyTo: 'localhost:3000',
    },
  ],
  // mock 服务端数据
  apiRule: [
    {
      pattern: '',
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
