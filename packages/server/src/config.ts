/* eslint-disable no-undef */
/*
 * @description: 获取配置
 * @author: Feng Yinchao
 * @Date: 2022-08-26 17:47:04
 */
// eslint-disable-next-line import/no-unresolved
import { omit } from 'lodash';
import * as path from 'path';
import { getComputerName } from '@bproxy/utils/os';

// 配置文件名
export const appConfigFileName = 'bproxy.config.js';
// 数据存储目录
export const appDataPath = path.resolve(
  process.env.HOME || process.env.USERPROFILE || process.cwd(),
  './.AppData/bproxy',
);
// 配置文件路径
export const appConfigFilePath = path.resolve(appDataPath, appConfigFileName);
// 错误日志文件
export const appErrorLogFilePath = path.resolve(appDataPath, 'logs/error.log');
// 常规日志文件
export const appInfoLogFilePath = path.resolve(appDataPath, 'logs/info.log');

const config: IConfig.Config = {
  port: 8888,
  https: true,
  rules: [
    {
      url: 'https://www.douyu.com/bproxy',
      target: 'hello bproxy\n',
    },
  ],
  certificate: {
    filename: 'bproxy.ca.crt',
    keyFileName: 'bproxy.ca.key.pem',
    name: `B Proxy CA(${getComputerName()})`,
    organizationName: 'zoborzhang',
    OU: 'https://github.com/zobor/bproxy',
    countryName: 'CN',
    provinceName: 'HuBei',
    localityName: 'WuHan',
    keySize: 2048,
    getDefaultCABasePath(): string {
      return appDataPath;
    },
    getDefaultCACertPath(): string {
      return path.resolve(this.getDefaultCABasePath(), this.filename);
    },
    getDefaultCAKeyPath(): string {
      return path.resolve(this.getDefaultCABasePath(), this.keyFileName);
    },
  },
};
export default config;
// 配置文件模版
export const configTemplate = omit(config, ['certificate']);

export const configTemplateCommonJS = `
module.exports = ${JSON.stringify(configTemplate)};
`;
// 环境变量
export const env = {
  bash: process.env.NODE_ENV === 'bash',
};

export const bproxyPrefixHeader = 'x-bproxy';
