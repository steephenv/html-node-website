import * as express from 'express';
import { get as getConfig } from 'config';

import { centralApis } from './central';
import { user } from './user';
import { utils } from './utils';
// import { getIslands } from './get-islands';
// import { caseRouter } from './case';
// import { docs } from './document';

import { attachTokenData } from '../access-control/attach-token-data';
// swagger
import { swaggerSpec } from './swagger';

// create router
export const apis = express.Router();

apis.use('/central', attachTokenData, centralApis);
apis.use('/user', user);
apis.use('/utils', utils);
// apis.get('/get-islands', getIslands);
// apis.use('/case', attachTokenData, caseRouter);
// apis.use('/documents', attachTokenData, docs);

// load docs if requested
if (getConfig('app.docs')) {
  // tslint:disable-next-line:no-var-requires
  // const swaggerSpec = require('./swagger');
  // deliver swagger spec
  console.log('> docs enabled'); // tslint:disable-line:no-console
  apis.get('/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
}
