import Lane from "./lane.schema.js";

export const addLane = async (lane) => {
  const newLane = new Lane({ laneNr: lane });
  await newLane.save();
  return newLane;
};

export const getAllLanes = async () => {
  const lanes = await Lane.find({}, { _id: 0, laneNr: 1 });
  return lanes;
};

export const getLaneIdByLaneNr = async (laneNr) => {
  if (!laneNr) return false;
  const lane = await Lane.findOne({ laneNr: laneNr });
  if (!lane) return false;
  return lane._id;
};
