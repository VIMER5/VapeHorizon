import express from "express";
import erpController from "../../controller/erpController.js";

const erpAPI = express.Router();
erpAPI.post("/get_Actual_qty", erpController.getActual_qty);

export default erpAPI;
