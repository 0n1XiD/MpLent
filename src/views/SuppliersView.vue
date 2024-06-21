<template>
    <MpBreadcrumbs :items="breadcrumbItems"></MpBreadcrumbs>
    <MpDateSettings ref="MpDateSettings" label="Поставщики" @date-changed="handleDateChange"></MpDateSettings>
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
import MpBreadcrumbs from "@/components/MpBreadcrumbs.vue";
export default {
  name: 'SuppliersView',
  components: {
      MpBreadcrumbs,
      XlsxUploadBtn,
      MpDateSettings,
    MpTable,
  },
  data () {
    return {
      columnNames: [
        { headerName: 'Поставщик', field: 'name', pinned: 'left', minWidth: 170,cellRenderer: params => {
                const supplierId = params.data.supplier_id;
                const supplier = params.value;
                if (supplier) {
                    return `<a href="/app/supplier/products/${supplierId}">${supplier}</a>`;
                } else {
                    return supplier;
                }
            }},
        { headerName: 'Кол-во товаров', field: 'prods', sort: 'desc' },
        { headerName: 'Кол-во продаж', field: 'sales' },
        { headerName: 'Выручка', field: 'revenue', valueFormatter: this.formatPrice },
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
                {text: 'Поставщики категории'},
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
                let data = await this.$mp.ajax("mp-wb-prod", "get-suppliers", {
                    categoryId: this.$route.params.categoryId,
                    fromTime: this.formatDateForRequest(this.startDate),
                    toTime: this.formatDateForRequest(this.endDate)
                });

                if (data.error) {
                    alert('Ошибка');
                } else {
                    this.$refs.mpTable.updateData(data.resp.supplier);
                    if (this.$route.params.categoryId == 0) {
                        this.catName = "Все категории";
                    } else
                        this.catName = data.resp.cat_name;
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
    },
}
</script>
