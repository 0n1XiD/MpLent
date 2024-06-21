<template>
  <MpBreadcrumbs :items="breadcrumbItems"></MpBreadcrumbs>
  <MpDateSettings ref="MpDateSettings" label="Товары поставщика" @date-changed="handleDateChange"></MpDateSettings>
  <MpTable
    :columnNames="columnNames"
    ref="mpTable"
    ></MpTable>
    <XlsxUploadBtn :onClick="handleXlsxUpload" />

</template>

<script>
import MpTable from '../components/MpTable.vue'
import ImgCell from '../components/ImgCell.vue'
import MpDateSettings from "@/components/MpDateSettings.vue";
import MpBreadcrumbs from "@/components/MpBreadcrumbs.vue";
import XlsxUploadBtn from "@/components/XlsxUploadBtn.vue";
export default {
  name: 'SupplierProductsView',
  components: {
      XlsxUploadBtn,
      MpDateSettings,
      MpTable,
      MpBreadcrumbs
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
        { headerName: 'Картинка', field: 'img_folder', cellRendererFramework: ImgCell, cellRendererParams: { img_folder: 'img_folder' }, autoHeight: true },
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
        { headerName: 'Поставщик', field: 'supplier' },
        { headerName: 'Цвет', field: 'color' },
        { headerName: 'Наличие FBS', field: 'stocks_fbs' },
        { headerName: 'Дата', field: 'date' },
        { headerName: 'Цена', field: 'price', valueFormatter: this.formatPrice  },
        { headerName: 'Минимальная цена', field: 'min_price', valueFormatter: this.formatPrice  },
        { headerName: 'Максимальная цена', field: 'max_price', valueFormatter: this.formatPrice  },
        { headerName: 'Средняя цена', field: 'avg_price', valueFormatter: this.formatPrice  },
        { headerName: 'Потенциал выручки', field: 'potential_revenue', valueFormatter: this.formatPrice  },
        { headerName: 'Упущенная выручка', field: 'lost_revenue', valueFormatter: this.formatPrice  },
        { headerName: 'Был в наличии', field: 'days_avail' },
        { headerName: 'Продажи за период', field: 'sales' },
        { headerName: 'Выручка', field: 'revenue', valueFormatter: this.formatPrice  },
      ],
        supplierName: null
    }
  },
    computed: {
        breadcrumbItems() {
            return [
                {text: 'Mpland'},
                {text: 'Wildberries'},
                {text: 'Товары'},
                {text: 'Товары поставщика'},
                {text: this.supplierName }
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
                let data = await this.$mp.ajax("mp-wb-prod", "get-supplier-prods", {
                    supplierId: this.$route.params.supplierId,
                    fromTime: this.formatDateForRequest(this.startDate),
                    toTime: this.formatDateForRequest(this.endDate)
                });

                if (data.error) {
                    alert('Ошибка');
                } else if (data.resp.supplier_product) {
                    this.$refs.mpTable.updateData(data.resp.supplier_product);
                    this.supplierName = data.resp.supplier_product[0]["supplier"];
                } else {
                    this.$refs.mpTable.updateData([]);
                    this.supplierName = '';
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
