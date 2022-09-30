/* eslint-disable no-undef */
/*
 * @description: getUserConfig 实现
 * @author: Feng Yinchao
 * @Date: 2022-08-26 17:47:04
 */
import path from 'path';
import fs from 'fs-extra';
import { isEmpty } from 'lodash';
import { Log } from './index';
import { appConfigFileName, appDataPath } from './config';
import dataset, { updateDataSet } from './dataset';
import preload from './preload';
import type { IConfig } from './types/config';

// 获取App配置文件根目录
export const getAppConfigBasePath = (): string => {
  return dataset.currentConfigPath || dataset.prevConfigPath || appDataPath;
};

// 更新dataset config配置
const updateDataSetConfig = (config: IConfig.Config) => {
  if (!isEmpty(config)) {
    updateDataSet('config', config);
  }
};

export const getUserConfig = async (): Promise<null | IConfig.Config> => {
  const configFilePath = path.resolve(getAppConfigBasePath(), appConfigFileName);
  const isConfigFilePathExit = fs.pathExistsSync(configFilePath);

  if (!isConfigFilePathExit) {
    Log(`位于项目根目录的 ${appConfigFileName} 文件不存在`);
    return null;
  }
  try {
    delete require.cache[configFilePath];
    const newConfig = await import(configFilePath);

    if (newConfig.default) {
      const config = preload(newConfig.default);
      updateDataSetConfig(config);

      return config;
    }
  } catch (error) {
    Log('getUserConfig error', error);
    return null;
  }

  return null;
};
