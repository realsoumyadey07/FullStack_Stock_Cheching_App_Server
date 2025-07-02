import mongoose, { Schema, Types } from "mongoose";

const savedSchema = new Schema({
     fundId: {
          type: String,
          required: true
     },
     savedBy: {
          type: Types.ObjectId,
          ref: "User",
          required: true
     },
     
}, {timestamps: true});

export const Saved = mongoose.model("Saved", savedSchema);