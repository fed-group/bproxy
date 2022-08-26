/*
 * @description: localStaicServer
 * @author: Feng Yinchao
 * @Date: 2022-08-26 17:47:04
 */
import fs from 'fs-extra';
import mime from 'mime';
import * as URL from 'url';
// eslint-disable-next-line import/no-unresolved
import { IHttp } from 'src/types/http';
import config, { appConfigFileName } from './config';
import { Log } from './index';

function return404(res: IHttp.HttpServerResponse) {
  res.writeHead(404, {});
  res.end('404, bad request');
}

function downLoadCertificat(res: IHttp.HttpServerResponse) {
  const certFilePath = config.certificate.getDefaultCACertPath();
  try {
    if (!fs.existsSync(certFilePath)) {
      return404(res);
    } else {
      const mimetype = mime.getType(certFilePath);
      res.setHeader('Content-disposition', `attachment; filename=${appConfigFileName}`);
      res.setHeader('Content-type', `${mimetype}; charset=utf-8`);
      fs.createReadStream(certFilePath).pipe(res);
    }
  } catch (err) {
    Log(err);
  }
}

export default function localStaicServer(req: IHttp.HttpIncomingMessage, res: IHttp.HttpServerResponse) {
  const { url } = req;
  const { pathname } = URL.parse(url);

  switch (pathname) {
    case '/cert':
      downLoadCertificat(res);
      break;
    default:
      return404(res);
      break;
  }
}
