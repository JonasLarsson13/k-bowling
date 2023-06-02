import { parse, format, endOfDay } from "date-fns";
import {
  createBooking,
  getBookingByBookingNr,
  searchBookingsByDate,
  deleteBookingByBookingNr,
  updateBookingByBookingNr,
} from "../models/booking/booking.models.js";

export const httpCreateBooking = async (req, res) => {
  const {
    email,
    amountOfGuests,
    shoeSizes,
    laneId,
    startTime,
    totalPrice,
    endTime,
  } = req.body;

  try {
    const newBooking = {
      email,
      amountOfGuests,
      shoeSizes,
      laneId,
      startTime,
      endTime,
      totalPrice,
    };
    const createdBooking = await createBooking(newBooking);

    return res.status(201).json({
      success: true,
      bookingNr: createdBooking.bookingNr,
      message: `Booking successfully created! You are welcome ${startTime}`,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const httpSearchBookingsByDate = async (req, res) => {
  const { startDate, endDate } = req.body;

  try {
    const parsedStartDate = parse(startDate, "dd/MM", new Date());
    const formattedStartDate = format(new Date(parsedStartDate), "yyyy-MM-dd");
    const parsedEndDate = parse(endDate, "dd/MM", new Date());
    const formattedEndDate = format(
      endOfDay(new Date(parsedEndDate)),
      "yyyy-MM-dd HH:mm"
    );
    const bookings = await searchBookingsByDate(
      formattedStartDate,
      formattedEndDate
    );
    if (!bookings || bookings.length === 0)
      return res.status(404).json({
        success: true,
        message: "No bookings found between that dates",
      });
    return res.status(200).json({ success: true, bookings });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const httpGetBooking = async (req, res) => {
  const { bookingNr } = req.params;

  try {
    const booking = await getBookingByBookingNr(bookingNr);
    if (!booking)
      return res.status(404).json({
        success: false,
        message: "No booking found with that booking number",
      });

    return res.status(200).json({ success: true, booking });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const httpDeleteBooking = async (req, res) => {
  const { bookingNr } = req.params;

  try {
    const deleteBooking = await deleteBookingByBookingNr(bookingNr);
    if (deleteBooking === null)
      return res.status(404).json({
        success: false,
        message: "No booking found with that booking number",
      });
    return res.status(200).json({ success: true, message: "Booking deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const httpUpdateBooking = async (req, res) => {
  const {
    email,
    amountOfGuests,
    shoeSizes,
    laneId,
    startTime,
    totalPrice,
    endTime,
  } = req.body;
  const { bookingNr } = req.params;

  try {
    const updatedBooking = {
      email,
      amountOfGuests,
      shoeSizes,
      laneId,
      startTime,
      totalPrice,
      endTime,
    };
    const newBooking = await updateBookingByBookingNr(
      bookingNr,
      updatedBooking
    );
    if (newBooking === null) return res.status(404).json({ success: false });
    return res
      .status(200)
      .json({ success: true, bookingNr, message: "Booking updated" });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
