<template>
    <MpBreadcrumbs :items="breadcrumbItems"></MpBreadcrumbs>
    <MpDateSettings ref="MpDateSettings"  label="Пользователь" @date-changed="handleDateChange"></MpDateSettings>
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
import MpBreadcrumbs from "@/components/MpBreadcrumbs.vue";
export default {
  name: 'UserProductsView',
  components: {
      MpBreadcrumbs,
      XlsxUploadBtn,
      MpDateSettings,
    MpTable,
  },
  data () {
    return {
      columnNames: [
        { headerName: 'Товар', field: 'name', pinned: 'left', minWidth: 170, cellRenderer: params => {
                const prodId = params.data.prod_id;
                const name = params.value;

                if (name) {
                    return `<a href="/product/${prodId}">${name}</a>`;
                } else {
                    return name;
                }
            } },
        { headerName: 'Артикул поставщика (sku)', field: 'sku' },
        { headerName: 'Картинка', field: 'img_folder', cellRendererFramework: ImgCell, cellRendererParams: { img_folder: 'img_folder' }, autoHeight: true },
        { headerName: 'Категория', field: 'cat' },
        { headerName: 'Дней на сайте', field: 'days_on_site' },
        { headerName: 'Наличие на складе', field: 'stocks' },
        { headerName: 'Бренд', field: 'brand' },
        { headerName: 'Поставщик', field: 'supplier' },
        { headerName: 'Комиссия fbs в рублях', field: 'rub_commission_fbs', valueFormatter: this.formatPrice },
        { headerName: 'Комиссия fbo в рублях', field: 'rub_commission_fbo', valueFormatter: this.formatPrice },
        { headerName: 'Комиссия fbs в процентах', field: 'percent_commission_fbs' },
        { headerName: 'Комиссия fbo в процентах', field: 'percent_commission_fbo' },
        { headerName: 'Наличие FBS', field: 'stocks_fbs' },
        { headerName: 'Закупочная цена', field: 'cost_price', valueFormatter: this.formatPrice },
        { headerName: 'Цена', field: 'price', valueFormatter: this.formatPrice },
        { headerName: 'Цена без скидки', field: 'price_without_discount', valueFormatter: this.formatPrice },
        { headerName: 'Размер', field: 'size' },
        { headerName: 'Был в наличии', field: 'days_avail' },
        { headerName: 'Кол-во заказов за период', field: 'sales_per_period' },
        { headerName: 'Оборот за период', field: 'revenue_per_period', valueFormatter: this.formatPrice },
        { headerName: 'Время, в течение которого товар закончится при текущей скорости заказов', field: 'remain_time' },
        { headerName: 'Скорость заказов', field: 'sales_spd' },
        { headerName: 'Кол-во продаж за все время', field: 'sales' },
        { headerName: 'Оборот за все время', field: 'revenue' , valueFormatter: this.formatPrice},
        { headerName: 'Выручка', field: 'revenue', valueFormatter: this.formatPrice },
      ],
    }
  },
    computed: {
        breadcrumbItems() {
            return [
                {text: 'Mpland'},
                {text: 'Кабинет Wildberries'},
                {text: 'Мои товары'},
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
                let data = await this.$mp.ajax("mp-wb-user", "get_user_prod_list", {
                    fromTime: this.formatDateForRequest(this.startDate),
                    toTime: this.formatDateForRequest(this.endDate)
                });

                if (data.error) {
                    alert('Ошибка');
                } else {
                    this.$refs.mpTable.updateData(data.resp.user_products);
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
    }
}
</script>
