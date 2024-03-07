import mongoose, { Types } from "mongoose";
const Schema = mongoose.Schema;

export const CasesSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  timeframe: {
    type: String,
    required: true,
  },
  main_service: {
    type: String,
    required: true,
  },
  extra_service: {
    type: String,
    required: true,
  },
  return_on_investment: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  cover_image: {
    type: String,
    required: true,
  },
});
