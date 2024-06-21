<template>
    <MpBreadcrumbs :items="breadcrumbItems"></MpBreadcrumbs>
   <MpDateSettings ref="MpDateSettings"  label="Товары категории" @date-changed="handleDateChange"></MpDateSettings>
  <MpTable
    :columnNames="columnNames"
    ref="mpTable"
    ></MpTable>
    <XlsxUploadBtn :onClick="handleXlsxUpload" />

</template>

<script>
import ImgCell from '../components/ImgCell.vue'
import MpTable from '../components/MpTable.vue'
import MpDateSettings from "@/components/MpDateSettings.vue";
import XlsxUploadBtn from "@/components/XlsxUploadBtn.vue";
import * as XLSX from "xlsx";
import MpBreadcrumbs from "@/components/MpBreadcrumbs.vue";
export default {
  name: 'CatProductsView',
  components: {
      MpBreadcrumbs,
      XlsxUploadBtn,
      MpDateSettings,
      MpTable,

  },
  data () {
    return {
      columnNames: [
          {headerName: 'Товар', field: 'name', pinned: 'left', minWidth: 170, cellRenderer: params => {
                  const prodId = params.data.prod_id;
                  const name = params.value;

                  if (name) {
                      return `<a href="/product/${prodId}">${name}</a>`;
                  } else {
                      return name;
                  }
              } },
        { headerName: 'Картинка', field: 'imgFolder', cellRendererFramework: ImgCell, cellRendererParams: { img_folder: 'img_folder' }, autoHeight: true },
        { headerName: 'Категория', field: 'cat' },
        { headerName: 'Позиция', field: 'position' },
        { headerName: 'Наличие', field: 'stocks' },
        { headerName: 'Бренд', field: 'brand', cellRenderer: params => {
                const brandId = params.data.brand_id;
                const brand = params.value;
                if (brand) {
                    return `<a href="/app/brand/products/${brandId}">${params.value}</a>`;
                } else {
                    return brand;
                    }
                }},
        { headerName: 'Поставщик', field: 'supplier', cellRenderer: params => {
                const supplierId = params.data.supplier_id;
                const supplier = params.value;
                if (supplier) {
                    return `<a href="/app/supplier/products/${supplierId}">${supplier}</a>`;
                } else {
                    return supplier;
                }
        } },
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
        categoryName: null
    }
  },
    computed: {
        breadcrumbItems() {
            return [
                {text: 'Mpland'},
                {text: 'Wildberries'},
                {text: 'Товары'},
                {text: 'Товары категории'},
                {text: this.categoryName }
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
                let data = await this.$mp.ajax("mp-wb-prod", "get-cat-prods", {
                    catId: this.$route.params.catId,
                    fromTime: this.formatDateForRequest(this.startDate),
                    toTime: this.formatDateForRequest(this.endDate)
                });

                if (data.error) {
                    alert('Ошибка');
                } else if (data.resp.cat_product){
                    this.$refs.mpTable.updateData(data.resp.cat_product);
                    this.categoryName = data.resp.cat_product[0]["cat"];
                } else {
                    this.$refs.mpTable.updateData([]);
                    this.categoryName = '';
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
            this.saveAsXlsxFile(wbout, 'товары категории.xlsx');
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
