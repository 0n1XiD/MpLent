<template>
  <div class="categories">
    <MpBreadcrumbs :items="breadcrumbItems"></MpBreadcrumbs>
    <div class="page-title">
      Категории
    </div>
    <div class="categories__manipulation">
      <div class="tabs">
        <div
            v-for="(tab, tabIndex) in tabs"
            :key="`tab-${tabIndex}-0`"
            class="tabs__element"
            :class="{'tab-active': active_tab === tab.value}"
            @click="active_tab = tab.value"
        >
          {{ tab.name }}
        </div>
      </div>
      <div class="filter">
        <div class="filter__btns">
          <button-custom purple name="FBS"/>
          <button-custom pink name="FBO"/>
        </div>
        <div class="filter__date">
          <div
            v-if="showSelectedPeriodText()"
            class="select-period"
            @click="$refs.date_picker.openMenu()"
          >
            Выбрать период
          </div>
          <vue-date-picker
            ref="date_picker"
            v-model="startDate"
            :format="dateFormat"
            range
            multi-calendars
            :multi-static="false"
          />
        </div>
      </div>
    </div>
    <MpTable :data="tableColumns"/>
  </div>
</template>

<script>
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import * as XLSX from "xlsx";
import MpBreadcrumbs from "@/components/MpBreadcrumbs.vue";
import MpTable from "@/components/MpTable.vue";
import ButtonCustom from "@/components/controls/ButtonCustom.vue";
import windowMixin from '@/mixins/window-mixin'

export default {
  name: 'CategoriesView',
  components: {
    MpBreadcrumbs,
    MpTable,
    VueDatePicker,
    ButtonCustom,
  },
  mixins: [windowMixin],
  data () {
    return {
      columnNames: [
        { headerName: 'Категория', field: 'name', pinned: 'left', minWidth: 170, cellRenderer: params => { return '<a href="/app/categories/'+params.data.id+'">'+params.value+'</a>'; } },
        { headerName: 'Кол-во товаров', field: 'prod_count', sort: 'desc' },
        { headerName: 'Кол-во поставщиков', field: 'supplier_count' },
        { headerName: 'Отзывов в среднем', field: 'feedbacks_avg' },
        { headerName: 'Цена товара средняя', field: 'price_avg', valueFormatter: this.formatPrice },
        { headerName: 'Рейтинг средний', field: 'rating_avg' },
      ],
      tableColumns: [
        { headerName: 'Категория', type:'link', fields: [{name: 'Аксессуары', url: "#"}, {name: 'Женщины', url: "#"}]},
        { headerName: 'Кол-во товаров', type:'number', fields: [{name: '131'}, {name: '1234'}]},
        { headerName: 'Кол-во поставщиков', type:'number', fields: [{name: '12'}, {name: '15'}]},
        { headerName: 'Отзывов в среднем', type:'number', fields: [{name: '14'}, {name: '17'}]},
        { headerName: 'Цена товара средняя', type:'price', fields: [{name: '241.51'}, {name: '2456.91'}]},
        { headerName: 'Рейтинг средний', type:'rating', fields: [{name: '12'}, {name: '+1'}]},
      ],
      catName: null,
      active_tab: 'categories',
      tabs: [
        {name: 'Категории', value: 'categories'},
        {name: 'Товары', value: 'goods'},
        {name: 'Подкатегории', value: 'subcategories'},
        {name: 'Продавцы', value: 'sellers'},
        {name: 'Бренды', value: 'brands'}
      ],
      startDate: null,
      endDate: null,
      active_page: 1
    }
  },
    computed: {
        breadcrumbItems() {
            return [
                {text: 'Mpland'},
                {text: 'Wildberries'},
                {text: 'Категории'},
                // {text: this.catName }
            ];

        }
    },
  methods: {
      dateFormat (date) {
        if (date[0] && date[1]){
          const startDate = date[0]
          const endDate = date[1]
          const dayStart = this.formatDateString(startDate.getDate());
          const monthStart = this.formatDateString(startDate.getMonth() + 1);
          const yearStart = startDate.getFullYear();
  
          const dayEnd = this.formatDateString(endDate.getDate());
          const monthEnd = this.formatDateString(endDate.getMonth() + 1);
          const yearEnd = endDate.getFullYear();
  
          return `${dayStart}.${monthStart}.${yearStart} - ${dayEnd}.${monthEnd}.${yearEnd}`;
        }
      },
      formatDateString(dateNumber){
        if (dateNumber < parseInt(10)){ return `0${dateNumber}`}
        return dateNumber
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
      showSelectedPeriodText() {
        if (this.window.width > 768) { return true }
        else if (this.window.width < 768 && !this.startDate && !this.endDate) { return true }
        return false
      }
  },
  async created() {
    let data = await this.$mp.ajax("mp-wb-prod", "get-category-childs", {parentCatID: this.$route.params.parentCatId})
    if (data.error) {
      alert('Ошибка');
    }
    else {
      this.$refs.mpTable.updateData(data.resp.childs)
      if (data.resp.parent_category_name) document.title = data.resp.parent_category_name, this.catName = data.resp.parent_category_name
        else {
          this.catName = "Все категории";
      }

    }
  },
}
</script>

<style lang="scss" scoped>
.categories{
  .page-title{
    margin-bottom: 14px;
  }
  &__manipulation{
    justify-content: space-between;
    display: flex;
    align-items: center;
    margin-bottom: 40px;
    flex-wrap: wrap;
    gap: 20px;
    .tabs{
      overflow: auto;
      display: flex;
      align-items: center;
      &::-webkit-scrollbar {
        width: 0 !important
      }
      &__element{
        cursor: pointer;
        color: var(--text-inactive-color);
        &:not(:last-child){
          margin-right: 24px;
        }
        &.tab-active{
          border-bottom: 1px solid var(--bg-third);
          font-size: 15px;
          color: var(--text-active-color-two);
        }
      }
    }
    .filter{
      display: flex;
      align-items: center;
      &__btns{
        margin-right: 30px;
        display: flex;
        align-items: center;
        .btn:first-child{
          margin-right: 10px;
        }
      }
      &__date{
        padding: 0 10px;
        background: $white;
        height: 40px;
        box-shadow: 0px 2px 4px 0px rgba(0, 50, 95, 0.03);
        border-radius: 5px;
        .select-period{
          cursor: pointer;
          width: fit-content;
          white-space: nowrap;
          font-size: 13px;
          color: var(--text-inactive-color);
          display: flex;
          align-items: center;
          padding: 0 15px 0 5px;
          border-right: 1px solid rgba(41, 41, 41, 0.15);
        }
        display: flex;
        align-items: center;
      }
    }
  }
}
</style>
