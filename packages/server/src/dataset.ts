/* eslint-disable no-undef */
/*
 * @description: updateDataSet
 * @author: Feng Yinchao
 * @Date: 2022-08-26 17:47:04
 */
const dataset: IConfig.DataSet = {
  prevConfigPath: '',
  currentConfigPath: '',
};

export function updateDataSet(key: keyof IConfig.DataSet, value: IConfig.DataSet[keyof IConfig.DataSet]) {
  dataset[key] = value as string & IConfig.Config;
}

export default dataset;
