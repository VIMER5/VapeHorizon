import express from "express";
import erpController from "../../controller/erpController.js";

const erpAPI = express.Router();
erpAPI.post("/get_Actual_qty", erpController.getActual_qty);
erpAPI.post("/get_Price", erpController.getPrice);

export default erpAPI;
