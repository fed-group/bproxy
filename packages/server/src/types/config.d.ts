/*
 * @description: IConfig
 * @author: Feng Yinchao
 * @Date: 2022-08-26 17:47:04
 */
export declare namespace IConfig {
  interface Header {
    [key: string]: string | number | boolean | null;
  }
  type IUrlRule = {
    url: string;
    target: string;
  };
  type IRegExpRule = {
    regx: string;
    target: string;
  };
  type IFileRule = {
    file: string;
    target: string;
  };

  type IRule = IUrlRule | IRegExpRule | IFileRule;

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
    sslAll?: boolean;
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
