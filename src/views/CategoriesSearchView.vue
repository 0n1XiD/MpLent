<template>
    <MpBreadcrumbs :items="breadcrumbItems"></MpBreadcrumbs>
  <form
    class="searchForm"
  >
    <MazInput  
      v-model="categoryName"
      label="Введите строку для поиска категорий по названию"
    />
    <br/>
    
    <MazBtn @click="searchCategories">Поиск категорий</MazBtn>
  </form>
  <br/>
  <br/>

  <MpTable
    :columnNames="columnNames"
    ref="mpTable"
  ></MpTable>
    <XlsxUploadBtn :onClick="handleXlsxUpload" />

</template>
  
  <script>
  import 'maz-ui/css/main.css'
  import MazInput from 'maz-ui/components/MazInput'
  import MazBtn from 'maz-ui/components/MazBtn'
  import MpTable from '../components/MpTable.vue'
  import XlsxUploadBtn from "@/components/XlsxUploadBtn.vue";
  import * as XLSX from "xlsx";
  import MpBreadcrumbs from "@/components/MpBreadcrumbs.vue";

  export default {
    name: 'CategoriesSearchView',
    components: {
        MpBreadcrumbs,
        XlsxUploadBtn,
       MpTable, MazInput, MazBtn
    },
    data () {
      return {
        columnNames: [
          { headerName: 'Категория', field: 'name', pinned: 'left', minWidth: 170, cellRenderer: params => { return '<a href="/app/categories/'+params.data.id+'">'+params.value+'</a>'; } },
          { headerName: 'Кол-во товаров', field: 'prod_count', sort: 'desc' },
          { headerName: 'Кол-во поставщиков', field: 'supplier_count' },
          { headerName: 'Отзывов в среднем', field: 'feedbacks_avg' },
          { headerName: 'Цена товара средняя', field: 'price_avg',valueFormatter: this.formatPrice },
          { headerName: 'Рейтинг средний', field: 'rating_avg' },
        ],
          categoryName: null
      }
    },
      computed: {
          breadcrumbItems() {
              return [
                  {text: 'Mpland'},
                  {text: 'Wildberries'},
                  {text: 'Категории'},
                  {text: 'Поиск категорий'},
                  {text: this.categoryName }
              ];
          }
      },
    methods: {
      searchCategories: async function() {
        let data = await this.$mp.ajax("mp-wb-prod", "get-categories-by-name", {name: this.categoryName})
        if (data.error) {
          this.errors.push('Ошибка сервера: ' + data.error)
        } 
        else {
          this.$refs.mpTable.updateData(data.resp.categories)
        }
      },
        formatPrice(params) {
            const value = params.value;
            return value ? (value / 100).toFixed(2) : '';
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
            this.saveAsXlsxFile(wbout, 'категории.xlsx');
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
  