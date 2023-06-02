import express from "express";
import bowlingRoutes from "./bowling.routes.js";
import laneRoutes from "./lane.routes.js";

const api = express.Router();

api.use("/bowling", bowlingRoutes);
api.use("/lane", laneRoutes);

export default api;
