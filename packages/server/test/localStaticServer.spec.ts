/*
 * @description: 单侧
 * @author: Feng Yinchao
 * @Date: 2022-08-26 17:47:04
 */
import * as request from 'request';
// eslint-disable-next-line import/no-unresolved
import { IHttp } from 'src/types/http';

const r = request.defaults({
  proxy: 'http://127.0.0.1:8888',
});

describe('http://127.0.0.1:8888/cert', () => {
  it('/cert with data', () => {
    r('http://127.0.0.1:8888/cert', (err, res: IHttp.HttpServerResponse, body: string | null) => {
      const goodReturn = body?.includes('-----BEGIN CERTIFICATE-----');
      expect(goodReturn).toBeTruthy();
    });
  });

  it('/abcd is 404', () => {
    r('http://127.0.0.1:8888/abcd', (err, res: IHttp.HttpServerResponse) => {
      expect(res.statusCode === 404).toBeTruthy();
    });
  });
});
