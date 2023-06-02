import { addLane, getAllLanes } from "../models/lane/lane.models.js";

export const httpAddLane = async (req, res) => {
  const { lane } = req.body;
  try {
    const newLane = await addLane(lane);
    return res.status(201).json(newLane);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

export const httpGetAllLanes = async (req, res) => {
  try {
    const lanes = await getAllLanes();
    return res.status(200).json(lanes);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};
