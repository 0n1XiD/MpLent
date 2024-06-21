<template>
   <MpBreadcrumbs :items="breadcrumbItems"></MpBreadcrumbs>
  <MpDateSettings ref="MpDateSettings" label="Бренды" @date-changed="handleDateChange"></MpDateSettings>
  <MpTable
    :columnNames="columnNames"
    ref="mpTable"
    ></MpTable>
    <XlsxUploadBtn :onClick="handleXlsxUpload" />

</template>

<script>
import MpTable from '../components/MpTable.vue'
import MpDateSettings from "@/components/MpDateSettings.vue";
import XlsxUploadBtn from "@/components/XlsxUploadBtn.vue";
import * as XLSX from "xlsx";
import MpBreadcrumbs from "@/components/MpBreadcrumbs.vue";
export default {
  name: 'BrandsView',
  components: {
      MpBreadcrumbs,
      XlsxUploadBtn,
      MpDateSettings,
      MpTable,
  },
  data () {
    return {
      columnNames: [
        { headerName: 'Бренд', field: 'name', pinned: 'left', minWidth: 170, cellRenderer: params => {
                const brandId = params.data.brand_id;
                const brand = params.value;
                if (brand) {
                    return `<a href="/app/brand/products/${brandId}">${params.value}</a>`;
                } else {
                    return brand;
                }
            }},
        { headerName: 'Кол-во товаров', field: 'prods', sort: 'desc' },
        { headerName: 'Кол-во продаж', field: 'sales' },
        { headerName: 'Выручка', field: 'revenue',valueFormatter: this.formatPrice },
        { headerName: 'Выручка на товар', field: 'prod_revenue', valueFormatter: this.formatPrice },
        { headerName: 'Упущенная выручка', field: 'lost_revenue', valueFormatter: this.formatPrice },
      ],
        catName: null
    }
  },
    computed: {
        breadcrumbItems() {
            return [
                {text: 'Mpland'},
                {text: 'Wildberries'},
                {text: 'Бренды категории'},
                {text: this.catName }
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
              let data = await this.$mp.ajax("mp-wb-prod", "get-brands", {
                  categoryId: this.$route.params.categoryId,
                  fromTime: this.formatDateForRequest(this.startDate),
                  toTime: this.formatDateForRequest(this.endDate)
              });

              if (data.error) {
                  alert('Ошибка');
              } else {
                  this.$refs.mpTable.updateData(data.resp.brand);
                  if (this.$route.params.categoryId == 0) {
                      this.catName = "Все категории";
                  } else
                  this.catName = data.resp.cat_name;
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
          this.saveAsXlsxFile(wbout, 'бренды.xlsx');
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
