import express from 'express';
import bookingRouter from './booking.router.js';

const v1Router = express.Router();

v1Router.use('/', bookingRouter);


export default v1Router;


