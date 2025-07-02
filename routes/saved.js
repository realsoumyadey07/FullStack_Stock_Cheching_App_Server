import express from "express";
import { getAllSavedFunds, saveFund, unsaveFund } from "../controllers/saved.js";
import { IsAuthenticated } from "../middlewares/IsAuthenticated.js";

const savedRouter = express.Router();

savedRouter.post("/save-fund", IsAuthenticated, saveFund);
savedRouter.post("/unsave-fund", IsAuthenticated, unsaveFund);
savedRouter.get("/all-saved-funds", IsAuthenticated, getAllSavedFunds);

export default savedRouter;