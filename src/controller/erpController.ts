import { Request, Response } from "express";
import erpService from "../service/erpService.js";
import errorService from "../service/errorService.js";

class erpController {
  async getActual_qty(req: Request, res: Response) {
    try {
      const dataUser: string = req.body.binName;
      if (dataUser && dataUser.length > 1) {
        const dataErp = await erpService.getactual_qty(dataUser);
        res.status(200).json(dataErp);
      } else {
        throw errorService.badRequest("Нужно название склада");
      }
    } catch (err) {
      err instanceof errorService
        ? res.status(err.status).json(err.message)
        : res.status(500).json("Мой код решил, что сегодня выходной.");
    }
  }
  async getPrice(req: Request, res: Response) {
    try {
      const data = req.body;
      if (!data || !data.priceListName || !data.itemCode) {
        throw errorService.badRequest("передайте priceListName:string и itemCode[string]");
      }
      const dataErp = await erpService.getPriceList(data.priceListName, data.itemCode);
      res.status(200).json(dataErp);
    } catch (err) {
      err instanceof errorService
        ? res.status(err.status).json(err.message)
        : res.status(500).json("Мой код решил, что сегодня выходной.");
    }
  }
}

export default new erpController();
