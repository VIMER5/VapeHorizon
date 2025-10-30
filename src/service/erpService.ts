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
        `http://${process.env.DomenErp}/api/resource/Bin?filters=[["warehouse", "=", "${bin}"], ["actual_qty", ">", 0]]&fields=["item_code", "warehouse", "actual_qty"]&limit_start=0&amp;limit=3`,
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
}

export default new erpService();
