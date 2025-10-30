import axios from "axios";
import errorService from "./errorService.js";

class erpService {
  async getactual_qty(bin: string) {
    if (!process.env.SecretKey || !process.env.PublicKey) {
      throw errorService.ServiceUnavailable("Нет ключей");
    }
    if (!process.env.DomenErp) {
      throw errorService.ServiceUnavailable("Укажи домен ERP в env");
    }
    try {
      const data = await axios.get(
        `http://${process.env.DomenErp}/api/resource/Bin?filters=[["warehouse", "=", "${bin}"], ["actual_qty", ">", 0]]&fields=["item_code", "warehouse", "actual_qty", "name"]&limit_start=0&limit=100&order_by=item_code`,
        {
          headers: {
            Authorization: `token ${process.env.PublicKey}:${process.env.SecretKey}`,
          },
        }
      );
      return data.data;
    } catch (err) {
      throw err instanceof axios.AxiosError
        ? new errorService(err.status ? err.status : 501, err.message)
        : new errorService(500, "Мой код решил, что сегодня выходной.");
    }
  }
  async getPriceList(priceListName: string, itemCode: string[]) {
    try {
      const filters = [
        ["item_code", "in", itemCode],
        ["price_list", "=", priceListName],
        ["selling", "=", 1],
      ];
      const data = await axios.get(
        `http://${process.env.DomenErp}/api/resource/Item%20Price?filters=${JSON.stringify(filters)}&fields=["item_code", "price_list", "price_list_rate", "currency"]`,
        {
          headers: {
            Authorization: `token ${process.env.PublicKey}:${process.env.SecretKey}`,
          },
        }
      );
      return data.data;
    } catch (err) {
      console.log(err);
      throw err instanceof axios.AxiosError
        ? new errorService(err.status ? err.status : 501, err.message)
        : new errorService(500, "Мой код решил, что сегодня выходной.");
    }
  }
}

export default new erpService();
