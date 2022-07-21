declare namespace IConfig {
  interface IRule {
    url: string | RegExp | function;
    target: number | string;
    delay?: number;
    disableCache?: boolean;
    debug?: true | 'vconsole';
    file?: string;
    path?: string;
    redirect?: string;
    rewrite?: (pathname: string) => string;
  }
  interface Certificate {
    filename: string;
    keyFileName: string;
    name: string;
    organizationName: string;
    OU: string;
    countryName: string;
    provinceName: string;
    localityName: string;
    keySize: number;
    getDefaultCABasePath: () => string;
    getDefaultCACertPath: () => string;
    getDefaultCAKeyPath: () => string;
  }
  interface Config {
    port: number;
    https: boolean | string[];
    rules: IRule[];
    certificate: Certificate;
  }
  interface DataSet {
    // 上一次的配置文件目录
    prevConfigPath?: string;
    // 当前配置文件的目录
    currentConfigPath?: string;
    // 当前的配置
    config?: Config;
  }
}
