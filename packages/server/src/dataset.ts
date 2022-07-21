const dataset: IConfig.DataSet = {
  prevConfigPath: '',
  currentConfigPath: '',
};

export function updateDataSet(key: keyof IConfig.DataSet, value: IConfig.DataSet[keyof IConfig.DataSet]) {
  dataset[key] = value as string & IConfig.Config;
}

export default dataset;
