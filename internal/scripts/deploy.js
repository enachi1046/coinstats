import fs from 'fs';
import path from 'path';
import node_ssh from 'node-ssh';
import archiver from 'archiver';

const ssh = new node_ssh();
const PROCESS_ID = 2;
const APP_ROOT = path.resolve(__dirname, '../..');

const output = fs.createWriteStream(`${APP_ROOT}/build.zip`);
const archive = archiver('zip', {
  zlib: { level: 9 }
});

output.on('close', async () => {
  console.log(archive.pointer() + ' total bytes');
  console.log('Zipped! Uploading...');
  await ssh.connect({
    host:'ec2-52-24-134-234.us-west-2.compute.amazonaws.com',
    username:'coinstats',
    privateKey: `${APP_ROOT}/keys/coin-stats.pem`,
  });
  await ssh.putFile(`${APP_ROOT}/build.zip`, '/home/coinstats/build.zip');
  console.log('Upload done! Unzipping...');
  const folderName = `/home/coinstats/releases/build-${Date.now()}`;
  await ssh.execCommand(`unzip /home/coinstats/build.zip -d ${folderName}`);
  await ssh.execCommand(`rm /home/coinstats/build.zip`);
  await ssh.execCommand(`cp /home/coinstats/production/.env ${folderName}`);
  console.log('Unzipped! Installing dependencies...');
  await ssh.execCommand('npm i', { cwd: folderName });
  console.log('Updating symlinks...');
  await ssh.execCommand(`rm /home/coinstats/production`);
  await ssh.execCommand(`ln -s ${folderName} /home/coinstats/production`);
  await ssh.execCommand(`pm2 restart ${PROCESS_ID}`);
  console.log('Deployed!');
  process.exit();
});

archive.on('error', function(err) {
  throw err;
});

archive.pipe(output);
archive.glob('./{,!(node_modules|.git)/**/}*.*');
archive.finalize();
