import express from "express";
import {
  httpCreateBooking,
  httpDeleteBooking,
  httpGetBooking,
  httpSearchBookingsByDate,
  httpUpdateBooking,
} from "../controllers/bowling.controllers.js";
import { validateBookingInfo } from "../middleware/booking.middleware.js";

const bowlingRoutes = express.Router();

bowlingRoutes.post("/", validateBookingInfo, httpCreateBooking);
bowlingRoutes.post("/search", httpSearchBookingsByDate);
bowlingRoutes.put("/:bookingNr", validateBookingInfo, httpUpdateBooking);
bowlingRoutes.delete("/:bookingNr", httpDeleteBooking);
bowlingRoutes.get("/:bookingNr", httpGetBooking);

export default bowlingRoutes;
