import express from 'express';
import { pingHandler } from '../../controllers/ping.controller.js';

import { validateRequestBody } from '../../validator/index.js';
import { pingSchema } from '../../validator/ping.validator.js';
// import { userSchema } from '../../validator/user.validator.js';


const pingRouter = express.Router();

pingRouter.get(
    "/",
    validateRequestBody(pingSchema),
    pingHandler
  );

// pingRouter.get(
//     "/",
//     validateRequestBody(userSchema),
//     pingHandler
//   );


pingRouter.get('/health', (req, res) => {
    res.status(200).send('OK');

});


export default pingRouter;