/*
 * @description:  os 操作相关 helper
 * @author: Feng Yinchao
 * @Date: 2022-08-26 17:47:04
 */
import os from 'os';

// 获取系统名称
export const getOsName = () => {
  return os.platform();
};

// 获取计算机用户名
export const getComputerName = () => {
  return os.hostname().replace(/\.\w+/g, '');
};

export const getIpAddress = () => {
  const ifaces = os.networkInterfaces();
  const Ips: string[] = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const dev in ifaces) {
    if (['以太网', 'en0'].includes(dev)) {
      (ifaces[dev] || []).forEach(details => {
        if (details.family === 'IPv4') {
          Ips.push(details.address);
        }
      });
    }
  }
  return Ips;
};

export const isMac = getOsName().includes('darwin');
