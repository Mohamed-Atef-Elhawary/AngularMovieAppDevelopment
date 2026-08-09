import fs from 'fs';
import path from 'path';

const dirPath = path.join(process.cwd(), 'src', 'environments');
const envFile = path.join(dirPath, 'environment.ts');
const envDevFile = path.join(dirPath, 'environment.development.ts');

const apikey = process.env.apikey;
const s = process.env.s;
const APIURL = process.env.APIURL;
const firebaseConfig = {
  apiKey: process.env.firebaseApiKey,
  authDomain: process.env.authDomain,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId,
};
const content = `export const environment = {
apikey:"${apikey}",
s:"${s}",
APIURL:"${APIURL}",
firebaseConfig:${JSON.stringify(firebaseConfig)}
};`;

if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath, { recursive: true });
}

fs.writeFileSync(envFile, content);
fs.writeFileSync(envDevFile, content);

console.log('Environments created successfully!');
