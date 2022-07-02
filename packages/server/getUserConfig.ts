import path from 'path';
import fs from 'fs-extra';
import { build } from 'esbuild';
import { IBproxyUserConfig, Log } from './index';

export const getUserConfig = async () => {
  const configFileName = 'bproxy.config.ts';
  const configFilePath = path.join(process.cwd(), configFileName);
  const isConfigFilePathExit = fs.pathExistsSync(configFilePath);
  if (!isConfigFilePathExit) {
    Log('位于项目根目录的 bproxy.config.ts 文件不存在');
    return { config: null };
  } else {
    await build({
      format: 'cjs',
      logLevel: 'error',
      outdir: __dirname,
      bundle: true,
      external: ['esbuild'],
      platform: 'node',
      entryPoints: [configFilePath],
    });
    let configFile;
    try {
      configFile = path.resolve(__dirname, 'bproxy.config.js');
      delete require.cache[configFile];
      return await import(configFile);
    } catch (error) {
      Log('getUserConfig error', error);
      return { config: null };
    } finally {
      fs.remove(configFile);
    }
  }
};

export function defineBproxyConfig(config: IBproxyUserConfig): IBproxyUserConfig {
  const defaultConfig = {
    port: 8888,
    https: true,
    rules: [],
  };
  return { ...defaultConfig, ...config };
}
