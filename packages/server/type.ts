interface ResponseCallbackParams {
  response: any;
  fetch: any;
  request: any;
  rules: any;
  body: any;
}
type MatchRegxFunction = (url: string) => boolean;
type ResponseHandler = (params: ResponseCallbackParams) => void;

interface ProxyRule {
  url?: string;
  target?: string;
  regx?: RegExp | string | MatchRegxFunction;
  host?: string;
  file?: string;
  path?: string;
  response?: string | ResponseHandler;
  redirect?: string;
  redirectTarget?: string;
  rewrite?: (path: string) => string;
  proxy?: string;
  responseHeaders?: {
    [key: string]: any;
  };
  requestHeaders?: {
    [key: string]: any;
  };
  statusCode?: number;
  filepath?: string;
  // 模拟弱网
  delay?: number;
  // 禁止缓存
  disableCache?: boolean;
  // 页面调试
  debug?: boolean | 'vconsole';
}

type IPluginFn = (...args: any[]) => string;

export interface IBproxyUserConfig {
  port: number;
  https?: string[] | boolean;
  htmlRule: {
    pattern: string;
    proxyTo: string;
  };
  staticRule: {
    pattern: string;
    proxyTo: string;
  }[];
  apiRule: {
    pattern: string;
    proxyTo: string;
  }[];
  plugins: IPluginFn[];
}
