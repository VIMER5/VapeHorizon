import $erpAPI from "../axios/erpAPI.js";
import axios from "axios";
import errorService from "./errorService.js";

class erpService {
  private async getAllItemsByGroup(nameGroup: string) {
    try {
      const allItems = await $erpAPI.post(`method/frappe.client.get_list`, {
        doctype: "Item",
        fields: ["name", "image", "brand"],
        filters: [["item_group", "=", nameGroup]],
        order_by: "name",
        limit_page_length: 100000,
      });
      return allItems.data.message;
    } catch (err) {
      throw err instanceof axios.AxiosError ? new errorService(err.status ? err.status : 501, err.message) : err;
    }
  }
  private async getItemsNameWithQuantity(
    binName: string,
    allItemsName: [string],
    limit_start: number = 0,
    limit_page_length: number = 100
  ) {
    try {
      const binResponse = await $erpAPI.post(`method/frappe.client.get_list`, {
        doctype: "Bin",
        fields: ["item_code", "actual_qty", "warehouse"],
        filters: [
          ["warehouse", "=", binName],
          ["actual_qty", ">", 0],
          ["item_code", "in", allItemsName],
        ],
        order_by: "item_code",
        limit_start: limit_start,
        limit_page_length: limit_page_length,
      });
      return binResponse.data.message;
    } catch (err) {
      throw err instanceof axios.AxiosError ? new errorService(err.status ? err.status : 501, err.message) : err;
    }
  }

  private async getPriceList(priceListName: string, ItemsName: [string]) {
    try {
      const PriceList = await $erpAPI.post(`method/frappe.client.get_list`, {
        doctype: "Item Price",
        fields: ["item_code", "price_list_rate", "currency", "selling", "price_list"],
        filters: [
          ["price_list", "=", priceListName],
          ["selling", "=", 1],
          ["item_code", "in", ItemsName],
        ],
        order_by: "item_code",
        limit_page_length: 100000,
      });
      return PriceList.data.message;
    } catch (err) {
      throw err instanceof axios.AxiosError ? new errorService(err.status ? err.status : 501, err.message) : err;
    }
  }

  async getProducts(
    binName: string,
    priceListName: string,
    itemGroup: string,
    limit_start: number,
    limit_page_length: number
  ) {
    try {
      // все товары в N группе
      const allItems = await this.getAllItemsByGroup(itemGroup);
      if (allItems.length === 0) return [];
      const allItemsName = allItems.map((item: any) => item.name);

      // проверяем наличие товаров по остаткам
      const binResponse = await this.getItemsNameWithQuantity(binName, allItemsName, limit_start, limit_page_length);
      const allItemsNameWithQuantity = binResponse.map((item: any) => item.item_code);

      //Выгрузка прайс-листа.
      const PriceList = await this.getPriceList(priceListName, allItemsNameWithQuantity);

      //парсинг данных
      const dataErp = binResponse.map(function (item: any) {
        const tempPriceLisItem = PriceList.find((itemPriceList: any) => item.item_code == itemPriceList.item_code);
        const tempitemInfo = allItems.find((itemInAllItems: any) => item.item_code == itemInAllItems.name);
        return {
          ...item,
          PriceList: {
            price_list_rate: tempPriceLisItem ? tempPriceLisItem.price_list_rate : null,
            currency: tempPriceLisItem ? tempPriceLisItem.currency : null,
          },
          itemInfo: {
            ...tempitemInfo,
          },
        };
      });

      return dataErp;
    } catch (err) {
      throw err instanceof axios.AxiosError ? new errorService(err.status ? err.status : 501, err.message) : err;
    }
  }

  async createSalesOrder() {
    try {
      const response = await $erpAPI.post(`method/frappe.client.insert`, {
        doc: {
          doctype: "Sales Order",

          customer: "Клиент опт",
          transaction_date: new Date().toISOString().split("T")[0],
          delivery_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          set_warehouse: "1 - VH",
          selling_price_list: "опт3к",
          items: [
            {
              item_code: "САМОУБИЙЦА V2 DANGER - Lit Energy гранат",
              qty: 20,
            },
          ],
        },
      });

      return response.data.message;
    } catch (err) {
      throw err instanceof axios.AxiosError ? new errorService(err.status ? err.status : 501, err.message) : err;
    }
  }
}

export default new erpService();
