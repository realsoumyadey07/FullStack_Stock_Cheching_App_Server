import { AsyncHandler } from "../middlewares/AsyncHandler.js";
import { Saved } from "../models/saved.js";

export const saveFund = AsyncHandler(async (req, res) => {
  try {
    const { fundId } = req.body;
    if (!fundId) {
      return res.status(400).json({
        success: false,
        message: "please provide fundId!",
      });
    }
    const existingFund = await Saved.findOne({ fundId, savedBy: req.user.id });
    if (existingFund) {
      return res.status(400).json({
        success: false,
        message: "Fund is already saved!",
      });
    }
    await Saved.create({
      fundId,
      savedBy: req.user.id,
    });
    return res.status(200).json({
      success: true,
      message: "Fund is saved successfuly!",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error!",
    });
  }
});

export const unsaveFund = AsyncHandler(async (req, res) => {
  try {
    const { fundId } = req.body;
    if (!fundId) {
      return res.status(400).json({
        success: false,
        message: "fundId is required!",
      });
    }
    const deleted = await Saved.findOneAndDelete({ fundId });
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "No saved fund found with this fundId!",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Successfuly unsaved!",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error!",
    });
  }
});

export const getAllSavedFunds = AsyncHandler(async (req, res) => {
  try {
    const savedFunds = await Saved.find({
      savedBy: req.user.id,
    });
    if (savedFunds.length === 0) {
      return res.status(200).json({
        success: true,
        funds: [],
        message: "No saved funds found!",
      });
    }
    return res.status(200).json({
      success: true,
      funds: savedFunds,
      message: "saved funds successfuly fetched!",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error!",
    });
  }
});
