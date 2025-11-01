import { Request, Response, NextFunction } from "express";
import erpService from "../service/erpService.js";
import errorService from "../service/errorService.js";

class erpController {
  async gett(req: Request, res: Response, next: NextFunction) {
    try {
      throw errorService.badRequest("dd");
    } catch (err) {
      next(err);
    }
  }

  async getProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const dataUser = req.body;
      if (
        !dataUser ||
        !dataUser.binName ||
        !dataUser.priceListName ||
        !dataUser.itemGroup ||
        typeof dataUser.limit_start != "number" ||
        typeof dataUser.limit_page_length != "number"
      ) {
        throw errorService.badRequest(
          "Обязательные аргументы: binName:string, priceListName:string, itemGroup:string, limit_start:number, limit_page_length: number"
        );
      }
      const dataErp = await erpService.getProducts(
        dataUser.binName,
        dataUser.priceListName,
        dataUser.itemGroup,
        dataUser.limit_start,
        dataUser.limit_page_length
      );
      res.status(200).json(dataErp);
    } catch (err) {
      next(err);
    }
  }
}

export default new erpController();
