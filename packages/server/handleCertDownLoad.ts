import fs from 'fs-extra';
import path from 'path';
import mime from 'mime';
import Certificate from './certificate';

export const handleCertDownLoad = async res => {
  const CA = Certificate.CreateRootCA();
  const certDir = `${__dirname}/cert`;
  const certFileName = `${certDir}/cert.ca.cer`;
  const certKeyFileName = `${certDir}/key.ca.cer`;

  await fs.remove(certDir);
  await fs.ensureDir(certDir);
  await fs.outputFile(certFileName, CA.certificate);
  await fs.outputFile(certKeyFileName, CA.privateKey);
  const filename = path.basename(certFileName);
  const mimetype = mime.getType(certFileName);
  // 设置下载文件名
  res.setHeader('Content-disposition', 'attachment; filename=' + filename);
  // 设置 content-type
  res.setHeader('Content-type', mimetype);
  fs.createReadStream(certFileName).pipe(res);
};
