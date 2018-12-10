import fs from 'fs';
import { isProd } from 'utils/env';
import { resolve as pathResolve } from 'path';
import appRootDir from 'app-root-dir';

export function writeEmailInFile(req, res) {
  const email = `${req.body.email}\n`;
  const file = pathResolve(appRootDir.get(), '/../../unsubscribe-emails');
  fs.appendFile(file, email, (err) => {
    if (err) {
      res.status(400).send(err);
    }
    res.status(200).send(err);
  });
}
