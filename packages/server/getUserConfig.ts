import path from 'path';
import fs from 'fs-extra';
import { Log } from './index';
import { appConfigFileName, appDataPath } from './config';
import dataset from './dataset';

// 获取App配置文件根目录
export const getAppConfigBasePath = (): string => {
  return dataset.currentConfigPath || dataset.prevConfigPath || appDataPath;
};

export const getUserConfig = async (): Promise<null | IConfig.Config> => {
  const configFilePath = path.resolve(getAppConfigBasePath(), appConfigFileName);
  const isConfigFilePathExit = fs.pathExistsSync(configFilePath);
  if (!isConfigFilePathExit) {
    Log(`位于项目根目录的 ${appConfigFileName} 文件不存在`);
    return null;
  } else {
    try {
      delete require.cache[configFilePath];
      return require(configFilePath);
    } catch (error) {
      Log('getUserConfig error', error);
      return null;
    }
  }
};
