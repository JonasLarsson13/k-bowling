import mongoose from "mongoose";

const laneSchema = new mongoose.Schema({
  laneNr: {
    type: Number,
    required: true,
  },
});

const Lane = mongoose.model("Lane", laneSchema);

export default Lane;
