import { getAllLanes } from "../lane/lane.models.js";
import Booking from "./booking.schema.js";

export const createBooking = async (booking) => {
  const newBooking = new Booking(booking);
  await newBooking.save();
  return newBooking;
};

export const checkIfBookingExists = async (
  startTime,
  endTime,
  laneId,
  bookingNr
) => {
  let bookingCount = 0;

  for (const id of laneId) {
    const booking = await Booking.findOne({
      $or: [
        { startTime: { $lt: endTime }, endTime: { $gt: startTime } },
        { startTime: { $gte: startTime, $lt: endTime } },
      ],
      laneId: id,
      bookingNr: { $ne: bookingNr },
    });

    if (booking) {
      bookingCount++;
      if (bookingCount > 0) {
        return booking.laneId;
      }
    }
  }

  return false;
};

export const searchBookingsByDate = async (startDate, endDate) => {
  const lanes = await getAllLanes();

  const bookings = await Booking.aggregate([
    {
      $match: {
        $or: [
          { startTime: { $gte: startDate, $lte: endDate } },
          { endTime: { $gte: startDate, $lte: endDate } },
        ],
      },
    },
    {
      $lookup: {
        from: "lanes",
        localField: "laneId",
        foreignField: "_id",
        as: "lanes",
      },
    },
    {
      $project: {
        _id: 0,
        bookingNr: 1,
        email: 1,
        startTime: 1,
        endTime: 1,
        amountOfGuests: 1,
        shoeSizes: 1,
        totalPrice: 1,
        lanes: "$lanes.laneNr",
      },
    },
  ]);

  const laneBookingsMap = new Map();

  lanes.forEach((lane) => {
    laneBookingsMap.set(lane.laneNr, []);
  });

  bookings.forEach((booking) => {
    booking.lanes.forEach((lane) => {
      const laneBookings = laneBookingsMap.get(lane);
      laneBookings.push({
        bookingNr: booking.bookingNr,
        startTime: booking.startTime,
        endTime: booking.endTime,
      });
    });
  });

  const result = [];
  laneBookingsMap.forEach((laneBookings, laneNr) => {
    if (laneBookings.length > 0) {
      result.push({
        laneNr: laneNr,
        bookings: laneBookings,
      });
    }
  });

  return result;
};

export const getBookingByBookingNr = async (bookingNr) => {
  const booking = await Booking.aggregate([
    { $match: { bookingNr: bookingNr } },
    {
      $lookup: {
        from: "lanes",
        localField: "laneId",
        foreignField: "_id",
        as: "lanes",
      },
    },
    {
      $project: {
        _id: 0,
        email: 1,
        startTime: 1,
        endTime: 1,
        amountOfGuests: 1,
        shoeSizes: 1,
        totalPrice: 1,
        lanes: "$lanes.laneNr",
      },
    },
    {
      $unwind: "$lanes",
    },
    {
      $group: {
        _id: "$_id",
        email: { $first: "$email" },
        startTime: { $first: "$startTime" },
        endTime: { $first: "$endTime" },
        amountOfGuests: { $first: "$amountOfGuests" },
        shoeSizes: { $first: "$shoeSizes" },
        totalPrice: { $first: "$totalPrice" },
        lanes: { $addToSet: "$lanes" },
      },
    },
    {
      $project: {
        _id: 0,
        email: 1,
        startTime: 1,
        endTime: 1,
        amountOfGuests: 1,
        shoeSizes: 1,
        totalPrice: 1,
        lanes: { $slice: ["$lanes", 0, { $size: "$lanes" }] },
      },
    },
  ]);

  return booking[0];
};

export const deleteBookingByBookingNr = async (bookingNr) => {
  const booking = await Booking.findOneAndDelete({ bookingNr: bookingNr });
  return booking;
};

export const updateBookingByBookingNr = async (bookingNr, booking) => {
  const updatedBooking = await Booking.findOneAndUpdate(
    { bookingNr: bookingNr },
    booking,
    { new: true }
  );
  return updatedBooking;
};

export const findOneBookingByBookingNr = async (bookingNr) => {
  const booking = await Booking.findOne({ bookingNr: bookingNr });
  return booking;
};
