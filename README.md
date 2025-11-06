API запросы

1) GET /api/erp/getItemGroups - все группы товаров
   аргументов нет

2) POST /api/erp/getProduct - получить актульные товары со склада
   обязательные аргументы:
   "binName": "1 - VH",  - склад
   "priceListName": "опт3к", -  прайс лист
   "itemGroup": "Жидкость",  - группа товара
   "limit_start": 0,  - с какой позиции выгружать
   "limit_page_length": 3  - сколько выгрузить
