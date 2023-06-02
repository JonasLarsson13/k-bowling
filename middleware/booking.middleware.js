import { format, addHours } from "date-fns";
import { getLaneIdByLaneNr } from "../models/lane/lane.models.js";
import {
  emailValidation,
  checkIfBowlingHallIsOpen,
  checkIfTimeIsInTheFuture,
  checkIfTimeIsFullHour,
  checkIfGuestsAndShoesAreEqual,
  checkIfNumbersAreSame,
} from "../utils/validations.js";
import {
  checkIfBookingExists,
  findOneBookingByBookingNr,
} from "../models/booking/booking.models.js";

export const validateBookingInfo = async (req, res, next) => {
  const { email, amountOfGuests, shoeSizes, laneNr, startTime } = req.body;
  const { bookingNr } = req.params;

  if (bookingNr) {
    const booking = await findOneBookingByBookingNr(bookingNr);
    if (!booking)
      return res.status(404).json({
        success: false,
        message: "No booking found with that booking number",
      });
  }

  // Check if email is provided and validate email
  const validateEmail = emailValidation(email);
  if (!validateEmail)
    return res
      .status(400)
      .json({ success: false, message: "Email is not valid" });

  // Check if selected time is between 10:00 and 21:00
  const isBowlingHallOpen = checkIfBowlingHallIsOpen(startTime);
  if (!isBowlingHallOpen)
    return res.status(400).json({
      success: false,
      message: "Selected time must be between 10:00 and 21:00",
    });

  // Check if selected time is in the future
  const isTimeInTheFuture = checkIfTimeIsInTheFuture(startTime);
  if (!isTimeInTheFuture)
    return res.status(400).json({
      success: false,
      message: "Selected time must be in the future",
    });

  // Check if selected time is full hour
  const isTimeFullHour = checkIfTimeIsFullHour(startTime);
  if (!isTimeFullHour)
    return res.status(400).json({
      success: false,
      message: "Selected time must be full hour",
    });

  // Check if amount of guests is over 1
  if (amountOfGuests < 1)
    return res
      .status(400)
      .json({ success: false, message: "Amount of guests must be over 1" });

  // Check if amount of guests and shoe sizes are equal
  const isGuestsAndShoesEqual = checkIfGuestsAndShoesAreEqual(
    amountOfGuests,
    shoeSizes.length
  );
  if (!isGuestsAndShoesEqual)
    return res.status(400).json({
      success: false,
      message: "Amount of guests and shoes must be equal",
    });

  // Check if lane is provided and if lane numbers are different
  if (!laneNr)
    return res
      .status(400)
      .json({ success: false, message: "Lane is required" });

  const isNumbersSame = checkIfNumbersAreSame(laneNr);
  if (!isNumbersSame)
    return res
      .status(400)
      .json({ success: false, message: "Lane numbers must be different" });

  // Check if lane exists, if laneNrs is an array go through all ids and save them to an array
  const laneId = [];
  for (const lane of laneNr) {
    const laneIdChecking = await getLaneIdByLaneNr(lane);
    if (!laneIdChecking)
      return res.status(400).json({
        success: false,
        message: `Lane number ${lane} does not exist`,
      });
    laneId.push(laneIdChecking);
  }
  req.body.laneId = laneId;

  const endTime = format(addHours(new Date(startTime), 1), "yyyy-MM-dd HH:mm");

  // Check if booking already exists
  const bookingExists = await checkIfBookingExists(
    startTime,
    endTime,
    laneId,
    bookingNr
  );
  if (bookingExists)
    return res.status(400).json({
      success: false,
      message: "Selected lane is taken that time, try another lane or time",
    });

  const lanePrice = laneNr.length * 100;
  const guestPrice = amountOfGuests * 120;
  const totalPrice = lanePrice + guestPrice;

  req.body.totalPrice = totalPrice;
  req.body.endTime = endTime;
  next();
};
