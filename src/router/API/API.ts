import express from "express";
import erpAPI from "./erpAPI.js";
const api = express.Router();

api.use("/erp", erpAPI);

export default api;
