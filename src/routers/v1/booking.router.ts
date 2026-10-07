import express from 'express';
import { validateRequestBody } from '../../validator/index.js';
import { createBookingSchema } from '../../validator/booking.validator.js';
import { confirmBookingHandler, createBookingHandler } from '../../controllers/booking.controller.js';



const bookingRouter = express.Router();

bookingRouter.post(
    "/",
    validateRequestBody(createBookingSchema),
    createBookingHandler
  );

  bookingRouter.post("/confirm/:idempotencyKey", confirmBookingHandler);
  
export default bookingRouter;