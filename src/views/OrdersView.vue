<template>
  <MpBreadcrumbs :items="breadcrumbItems"></MpBreadcrumbs>
  <MpTable :columnNames="columnNames" ref="mpTable"></MpTable>
  <XlsxUploadBtn :onClick="handleXlsxUpload" />
</template>
  
<script>
import ImgCell from '../components/ImgCell.vue'
import MpTable from '../components/MpTable.vue'
import XlsxUploadBtn from "@/components/XlsxUploadBtn.vue";
import * as XLSX from "xlsx";
import MpBreadcrumbs from "@/components/MpBreadcrumbs.vue";

export default {
  name: 'OrdersView',
  components: {
      MpBreadcrumbs,
   XlsxUploadBtn,
    MpTable,
  },
  data() {
    return {
      columnNames: [
        { headerName: 'Фото товара', field: 'img_folder', cellRendererFramework: ImgCell, cellRendererParams: { img_folder: 'img_folder' }, autoHeight: true },
          {headerName: 'Товар', field: 'name', pinned: 'left', minWidth: 170, cellRenderer: params => {
                  const prodId = params.data.prod_id;
                  const name = params.value;

                  if (name) {
                      return `<a href="/product/${prodId}">${name}</a>`;
                  } else {
                      return name;
                  }
              } },
        { headerName: 'SKU', field: 'skus' },
        { headerName: 'Категория товара', field: 'category', cellRenderer: params => {
                const catId = params.data.cat_id;
                return `<a href="/category/products/${catId}">${params.value}</a>`;}  },
        { headerName: 'Размер товара', field: 'size' },
        { headerName: 'Артикул', field: 'article' },
        { headerName: 'Бренд', field: 'brand' },
        { headerName: 'Закупочная цена', field: 'cost_price' },
        { headerName: 'Цена продажи', field: 'sell_price' },
        { headerName: 'Номер заказа', field: 'order_number', valueGetter: () => 'Номер заказа' },
        { headerName: 'Идентификация', field: 'identification', valueGetter: () => 'Идентификация'  },
        { headerName: 'Оплачено', field: 'payed', valueGetter: () => 'да/нет'  },
        { headerName: 'Процент комиссии', field: 'commission_percent' },
        { headerName: 'Склад', field: 'warehouse' },
        { headerName: 'Подтверждён ли еженедельным отчётом', field: 'confirmed', valueGetter: () => 'да/нет' },
        { headerName: 'Номер отчёта', field: 'report_number', valueGetter: () => 'Номер отчёта' },
        { headerName: 'Операция', field: 'operation', valueGetter: () => 'Операция' },
        { headerName: 'К клиенту/От клиента', field: 'delivery_direction', valueGetter: () => 'К клиенту' },
        { headerName: 'Цена логистики', field: 'logistic_cost', valueGetter: () => 'Цена логистики'},
        { headerName: 'Тип поставки', field: 'delivery_type', valueGetter: () => 'Тип поставки' },
        { headerName: 'Дата и время заказа', field: 'date' },
      ],
    }
  },
    computed: {
        breadcrumbItems() {
            return [
                {text: 'Mpland'},
                {text: 'Кабинет Wildberries'},
                {text: 'Мои заказы'},
            ];
        }
    },
 methods: {
  handleXlsxUpload() {
   const tableData = this.$refs.mpTable.getTableData();
   const transformedData = this.transformDataForExport(tableData);
   this.exportToXlsx(transformedData);
  },
  transformDataForExport(data) {
   return data.map((row) => {
    const transformedRow = {};
    for (const key in row) {
     const columnName = this.columnNames.find((col) => col.field === key);
     if (columnName) {
      transformedRow[columnName.headerName] = row[key];
     }
    }
    return transformedRow;
   });
  },
  exportToXlsx(data) {
   const worksheet = XLSX.utils.json_to_sheet(data);
   const workbook = XLSX.utils.book_new();
   XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
   const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
   this.saveAsXlsxFile(wbout, 'заказы.xlsx');
  },
  saveAsXlsxFile(buffer, fileName) {
   const data = new Blob([buffer], { type: 'application/octet-stream' });
   const link = document.createElement('a');
   link.href = URL.createObjectURL(data);
   link.download = fileName;
   link.click();
  },
 },
  async created() {
    let data = await this.$mp.ajax("mp-wb-user", "get-orders")
    if (data.error) {
      alert('Ошибка');
    }
    else {
      this.$refs.mpTable.updateData(data.resp.user_order)
    }
  },
}
</script>
  