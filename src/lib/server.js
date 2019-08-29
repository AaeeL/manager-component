import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import login from '../routes/login';
import data from '../routes/data';
import token from '../routes/token';

const managerServer = express();
const managerPort = process.env.managerPort || 8000;

managerServer.use(cors());
managerServer.use(bodyParser.json());
managerServer.use(cookieParser());

managerServer.use('/api/manager', login);
managerServer.use('/api/manager', data);
managerServer.use('/api/manager', token);

managerServer.all('*', (req, res) => {
  return res.sendStatus(404);
});

const logToConsole = text => {
  console.log(`${new Date().toLocaleString()} - ${text}`);
};

export const start = () => {
  managerServer.listen(managerPort, () => {
    logToConsole('Server started');
    logToConsole(`Server listening on port: ${managerPort}`);
  });
};
