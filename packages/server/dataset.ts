const dataset: IConfig.DataSet = {
  prevConfigPath: '',
  currentConfigPath: '',
};

export function updateDataSet(key: keyof IConfig.DataSet, value: string & IConfig.Config) {
  dataset[key] = value;
}

export default dataset;
