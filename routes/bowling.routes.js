import express from "express";
import {
  httpCreateBooking,
  httpDeleteBooking,
  httpGetBooking,
  httpUpdateBooking,
  httpSearchBookedLanesByDate,
} from "../controllers/bowling.controllers.js";
import { validateBookingInfo } from "../middleware/booking.middleware.js";

const bowlingRoutes = express.Router();

bowlingRoutes.post("/", validateBookingInfo, httpCreateBooking);
bowlingRoutes.put("/:bookingNr", validateBookingInfo, httpUpdateBooking);
bowlingRoutes.delete("/:bookingNr", httpDeleteBooking);
bowlingRoutes.get("/:bookingNr", httpGetBooking);
bowlingRoutes.post("/search", httpSearchBookedLanesByDate);

export default bowlingRoutes;
