<template>
   <MpBreadcrumbs :items="breadcrumbItems"></MpBreadcrumbs>
   <MpDateSettings ref="MpDateSettings"  label="Продукт" @date-changed="handleDateChange"></MpDateSettings>
  <MpTable
  :columnNames="columnNames"
  ref="mpTable"
  ></MpTable>
    <XlsxUploadBtn :onClick="handleXlsxUpload($refs.mpTable)" />

    <h4>Статистика изменений информации о товаре за период</h4>
  
  <MpTableChange
  :columnNames="columnNames2"
  ref="MpTableChange"
  ></MpTableChange>
    <XlsxUploadBtn :onClick="handleXlsxUpload" />

    <h4>Статистика изменений по продажам товара за период</h4>
  
  <MpTableSalesDataChange
  :columnNames="columnNames3"
  ref="MpTableSalesDataChange"
  ></MpTableSalesDataChange>
    <XlsxUploadBtn :onClick="handleXlsxUpload" />

    <h4>Статистика изменений по продажам по складам товара за период</h4>

  <MpTableStocksSalesDataChange
  :columnNames="columnNames4"
  ref="MpTableStocksSalesDataChange"
  ></MpTableStocksSalesDataChange>
    <XlsxUploadBtn :onClick="handleXlsxUpload" />

    <h4>Статистика по выдаче товара в категориях за период</h4>

  <MpTablePos
  :columnNames="[]"
   ref="MpTablePos"
  ></MpTablePos>
    <XlsxUploadBtn :onClick="handleXlsxUpload" />

</template>

<script>

import ImgCell from '../components/ImgCell.vue'
import MpTable from '../components/MpTable.vue'
import MpTableChange from '../components/MpTable.vue'
import MpTableSalesDataChange from '../components/MpTable.vue'
import MpTableStocksSalesDataChange from '../components/MpTable.vue'
import MpTablePos from '../components/MpTable.vue'
import MpDateSettings from "@/components/MpDateSettings.vue";
import XlsxUploadBtn from "@/components/XlsxUploadBtn.vue";
import * as XLSX from "xlsx";
import MpBreadcrumbs from "@/components/MpBreadcrumbs.vue";

export default {
  name: 'ProductView',
  components: {
      MpBreadcrumbs,
      XlsxUploadBtn,
      MpDateSettings,
    MpTable,
    MpTableChange,
    MpTableSalesDataChange,
    MpTableStocksSalesDataChange,
    MpTablePos,
  },
  data () {
    return {
      columnNames: [
        { headerName: 'Товар', field: 'name', pinned: 'left', minWidth: 170 },
        { headerName: 'Изображение', field: 'img_folder', cellRendererFramework: ImgCell, cellRendererParams: { img_folder: 'img_folder' }, autoHeight: true},
        { headerName: 'Кол-во продаж', field: 'sales' },
        { headerName: 'Выручка ', field: 'revenue', valueFormatter: this.formatPrice },
        { headerName: 'Упущенная выручка', field: 'lost_revenue', valueFormatter: this.formatPrice },
        { headerName: 'Среднее кол-во заказов в день', field: 'sales_per_day' },
        { headerName: 'Средний оборот в день', field: 'revenue_per_day', valueFormatter: this.formatPrice },
        { headerName: 'Среднее кол-во дней в наличии', field: 'days_avail' },
        { headerName: 'Категория', field: 'cat' },
      ],

      columnNames2: [
        { headerName: 'Дата изменения', field: 'date' },
        { headerName: 'Цена', field: 'price', valueFormatter: this.formatPrice },
        { headerName: 'Продажи', field: 'purchases' },
        { headerName: 'Кол-во товаров на складах', field: 'stocks' },
        { headerName: 'Отзывы', field: 'feedbacks' },
        { headerName: 'Рейтинг', field: 'rating' },
        { headerName: 'Кол-во товара готовое к продаже по модели fbs', field: 'stocks_fbs' },
        { headerName: 'Поставщик', field: 'supplier' },
        { headerName: 'Бренд', field: 'brand' },
        { headerName: 'Описание', field: 'descr' },
      ],
      columnNames3: [
        { headerName: 'Дата изменения', field: 'date', minWidth: 170 },
        { headerName: 'Продажи', field: 'sold' },
        { headerName: 'Остаток', field: 'stocks' },
        { headerName: 'Цена', field: 'price', valueFormatter: this.formatPrice },
        { headerName: 'Цена без скидки', field: 'no_discount_price', valueFormatter: this.formatPrice },
        { headerName: 'Сумма продаж', field: 'revenue', valueFormatter: this.formatPrice  },
      ],
      columnNames4: [
        { headerName: 'Дата изменения', field: 'date', minWidth: 170 },
        { headerName: 'склад', field: 'warehouse' },
        { headerName: 'размер', field: 'size' },
        { headerName: 'Продажи', field: 'sold'},
      ],
        productName: null
    }
  },
    computed: {
        breadcrumbItems() {
            return [
                {text: 'Mpland'},
                {text: 'Wildberries'},
                {text: 'Товар'},
                {text: this.productName }
            ];
        }
    },
    async mounted() {
        const startDate = this.$refs.MpDateSettings.startDate;
        const endDate = this.$refs.MpDateSettings.endDate;
        await this.handleDateChange(startDate, endDate);
    },
    methods: {
        async handleDateChange(startDate, endDate) {
            this.startDate = startDate;
            this.endDate = endDate;

            if (this.startDate && this.endDate) {
                let data = await this.$mp.ajax("mp-wb-prod", "get-prod", {
                    prodId: this.$route.params.prodId,
                    fromTime: this.formatDateForRequest(this.startDate),
                    toTime: this.formatDateForRequest(this.endDate)
                });

                if (data.error) {
                    alert('Ошибка');
                } if (data.resp.product){
                    // noinspection JSDeprecatedSymbols
                    this.$refs.mpTable.updateData([data.resp.product])
                    this.productName = data.resp.product.name;
                } if (data.resp.product_change) {
                    this.$refs.MpTableChange.updateData(data.resp.product_change)
                } if (data.resp.product_sales_change) {
                    this.$refs.MpTableSalesDataChange.updateData(data.resp.product_sales_change)
                } if (data.resp.product_stocks_sales_change) {
                    this.$refs.MpTableStocksSalesDataChange.updateData(data.resp.product_stocks_sales_change)
                } if (data.resp.product_cat_stat) {
                    this.$refs.MpTablePos.updateData(data.resp.product_cat_stat)

                    let columns = []
                    columns[0] = {
                        headerName: 'Категория',
                        field: 'cat',
                        minWidth: 170
                    }

                    let uniqueDates = data.resp.product_cat_stat
                        .map(x => new Date(x.date))
                        .sort((first, second) => {
                            if (first.getTime() > second.getTime()) {
                                return 1;
                            }
                            if (first.getTime() < second.getTime()) {
                                return -1;
                            }

                            return 0;
                        })
                        .map(date => {
                            const day = String(date.getDate()).padStart(2, '0')
                            const month = String(date.getMonth() + 1).padStart(2, '0')
                            const year = String(date.getFullYear())
                            return `${day}-${month}-${year}`
                        })
                        .filter((value, index, self) => {
                            return self.indexOf(value) === index;
                        })

                    for (let i = 0; i < uniqueDates.length; i++) {
                        let stringDate = uniqueDates[i]
                        columns[i+1] = {
                            headerName: stringDate,
                            field: stringDate
                        }
                    }

                    this.$refs.MpTablePos.prepareColumns(columns)

                    let rows = []
                    let j = 0

                    data.resp.product_cat_stat.forEach(prodCatStat => {
                        let row = rows.find(x => x.cat === prodCatStat.cat)
                        let date = new Date(prodCatStat.date)
                        const day = String(date.getDate()).padStart(2, '0')
                        const month = String(date.getMonth() + 1).padStart(2, '0')
                        const year = String(date.getFullYear())
                        const stringDate = `${day}-${month}-${year}`

                        if (row) {
                            row[stringDate] = prodCatStat.position
                        }
                        else {
                            row = { cat: prodCatStat.cat }
                            uniqueDates.forEach(x => row[x] = '-')
                            row[stringDate] = prodCatStat.position
                            rows[j] = row
                            j++
                        }
                    })

                    let sortedRows = rows.sort(x => x.catName)

                    this.$refs.MpTablePos.updateData(sortedRows);
                }
                else {
                    this.$refs.mpTable.updateData([]);
                    this.$refs.MpTableChange.updateData([]);
                    this.$refs.MpTableSalesDataChange.updateData([]);
                    this.$refs.MpTableStocksSalesDataChange.updateData([]);
                    this.$refs.MpTablePos.updateData([])
                    this.productName = '';
                }
            }
        },
        formatDateForRequest(date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}${month}${day}`;
        },
        formatPrice(params) {
            const value = params.value;
            return value ? (value / 100).toFixed(2) : '';
        },
        handleXlsxUpload(tableRef) {
            return () => {
                const tableData = tableRef.getTableData();
                const transformedData = this.transformDataForExport(tableData);
                this.exportToXlsx(transformedData);
            };
        },
        transformDataForExport(data) {
            return data.map((row) => {
                const transformedRow = {};
                for (const key in row) {
                    if (key !== 'img_folder') {
                        const columnName = this.columnNames.find((col) => col.field === key);
                        if (columnName) {
                            transformedRow[columnName.headerName] = row[key];
                        }
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
            this.saveAsXlsxFile(wbout, 'товар.xlsx');
        },
        saveAsXlsxFile(buffer, fileName) {
            const data = new Blob([buffer], { type: 'application/octet-stream' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(data);
            link.download = fileName;
            link.click();
        },
    },
}
</script>
