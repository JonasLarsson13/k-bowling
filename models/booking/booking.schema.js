import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    bookingNr: {
      type: String,
      default: `bnr-${Math.floor(Math.random() * 1000000) + 1}-${
        Math.floor(Math.random() * 10000) + 1
      }`,
    },
    email: {
      type: String,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    laneId: {
      type: Array,
      ref: "Lane",
      required: true,
    },
    amountOfGuests: {
      type: Number,
      required: true,
    },
    shoeSizes: {
      type: Array,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
