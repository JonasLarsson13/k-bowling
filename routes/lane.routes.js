import express from "express";
import {
  httpAddLane,
  httpGetAllLanes,
} from "../controllers/lane.controllers.js";

const laneRoutes = express.Router();

laneRoutes.get("/", httpGetAllLanes);
laneRoutes.post("/", httpAddLane);

export default laneRoutes;
