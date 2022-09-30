/*
 * @description: getPostBody
 * @author: Feng Yinchao
 * @Date: 2022-09-30 19:56:30
 */
import type { IHttp } from '../types/http';

export const getPostBody = (req: IHttp.HttpIncomingMessage): Promise<Buffer> => {
  return new Promise(resolve => {
    const body: Array<Buffer> = [];
    req.on('data', (chunk: Buffer) => {
      body.push(chunk);
    });
    req.on('end', () => {
      resolve(Buffer.concat(body));
    });
  });
};
