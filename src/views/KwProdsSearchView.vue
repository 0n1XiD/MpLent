<template>
    <MpBreadcrumbs :items="breadcrumbItems"></MpBreadcrumbs>
    <div>
        <MpSearchDateSettings
                label="Поиск товаров"
                @search-products="handleSearchProducts"
        ></MpSearchDateSettings>

        <br/>
        <br/>

        <MpTable
                :columnNames="columnNames"
                ref="mpTable"
        ></MpTable>
        <XlsxUploadBtn :onClick="handleXlsxUpload" />
    </div>
</template>
  
  <script>
  import ImgCell from '../components/ImgCell.vue'
  import 'maz-ui/css/main.css'
  import MpTable from '../components/MpTable.vue'
  import XlsxUploadBtn from "@/components/XlsxUploadBtn.vue";
  import * as XLSX from "xlsx";
  import MpSearchDateSettings from "@/components/MpSearchDateSettings.vue";
  import MpBreadcrumbs from "@/components/MpBreadcrumbs.vue";

  export default {
    name: 'KwProdSearchView',
    components: {
        MpBreadcrumbs,
        MpSearchDateSettings,
        XlsxUploadBtn,
       MpTable,
    },
    data () {
      return {
        columnNames: [
            { headerName: 'Товар', field: 'name', pinned: 'left', minWidth: 170 },
            { headerName: 'Картинка', field: 'img_folder', cellRendererFramework: ImgCell, cellRendererParams: { img_folder: 'img_folder' }, autoHeight: true },
            { headerName: 'Категория', field: 'cat' },
            { headerName: 'Позиция', field: 'position' },
            { headerName: 'Наличие', field: 'stocks' },
            { headerName: 'Бренд', field: 'brand' },
            { headerName: 'Поставщик', field: 'supplier' },
            { headerName: 'Цвет', field: 'color' },
            { headerName: 'Наличие FBS', field: 'stocks_fbs' },
            { headerName: 'Дата', field: 'date' },
            { headerName: 'Цена', field: 'price', valueFormatter: this.formatPrice },
            { headerName: 'Минимальная цена', field: 'min_price', valueFormatter: this.formatPrice },
            { headerName: 'Максимальная цена', field: 'max_price', valueFormatter: this.formatPrice },
            { headerName: 'Средняя цена', field: 'avg_price', valueFormatter: this.formatPrice },
            { headerName: 'Потенциал выручки', field: 'potential_revenue', valueFormatter: this.formatPrice },
            { headerName: 'Упущенная выручка', field: 'lost_revenue', valueFormatter: this.formatPrice },
            { headerName: 'Был в наличии', field: 'days_avail' },
            { headerName: 'Продажи за период', field: 'sales' },
            { headerName: 'Выручка', field: 'revenue', valueFormatter: this.formatPrice },
        ],
          keyWord: null
      }
    },
      computed: {
          breadcrumbItems() {
              return [
                  {text: 'Mpland'},
                  {text: 'Wildberries'},
                  {text: 'Товары'},
                  {text: 'Поиск товаров'},
                  {text: this.keyWord }
              ];
          }
      },
    methods: {
        async handleSearchProducts({ startDate, endDate, keyWord }) {
            this.startDate = startDate;
            this.endDate = endDate;
            this.keyWord = keyWord;

            if (this.startDate && this.endDate && this.keyWord) {
                let data = await this.$mp.ajax("mp-wb-prod", "get-actual-kw-wb-prods", {
                    keyword: this.keyWord,
                    fromTime: this.formatDateForRequest(this.startDate),
                    toTime: this.formatDateForRequest(this.endDate)
                });

                if (data.error) {
                    this.errors.push('Ошибка сервера: ' + data.error)
                } else {
                    this.$refs.mpTable.updateData(data.resp.product_stat);
                }
            }
        },
        formatPrice(params) {
            const value = params.value;
            return value ? (value / 100).toFixed(2) : '';
        },
        formatDateForRequest(date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}${month}${day}`;
        },
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
            this.saveAsXlsxFile(wbout, 'товары.xlsx');
        },
        saveAsXlsxFile(buffer, fileName) {
            const data = new Blob([buffer], { type: 'application/octet-stream' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(data);
            link.download = fileName;
            link.click();
        },
    }
  }
  </script>
  