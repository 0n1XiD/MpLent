<template>
  <div class="mptable" v-if="window.width > 992">
    <div class="columns">
      <div class="columns__item"
        v-for="(column, columnIndex) in data"
        :key="`column-${columnIndex}`"
      >
        <div class="header">
          {{ column.headerName }}
        </div>
        <div class="items">
          <div class="items__item"
            v-for="(field, fieldIndex) in column.fields"
            :key="`field-${fieldIndex}-${columnIndex}`"
          >
            <div 
              class="number" 
              v-if="column.type == 'number' || column.type === 'rating'" 
              :class="{'number number_positive': field.name.slice(0, 1) === '+' && column.type === 'rating'}"
            >
              {{ field.name }}
            </div>
            <div class="number" v-else-if="column.type == 'price'">
              {{ field.name.slice(0, -3) }}<span class="number__penny">{{ field.name.slice(-3) }}</span>
            </div>
            <router-link class="link" v-else-if="column.type == 'link'" :to="field.url">
              {{ field.name }}
            </router-link>          
          </div>        
        </div>
      </div>
    </div>
    <div class="footer">
      <div class="footer__excel">
        <ButtonCustom pink><img :src="require(`@/assets/img/svg/excel.svg`)" :alt="'excel'">Выгрузить Excel</ButtonCustom>
      </div>
      <div class="footer__pagination">
        <MpPagination
          :pages="23"
          :active_page="active_page"
          @click="changeActivePage($event)"
        />
      </div>
      <div class="footer__showed">
        Показано 0 из 15
      </div>
    </div>
  </div>
  <div class="mptable" v-if="window.width <= 992">
    <div class="cards">
      <div class="cards__item"
        v-for="(card, cardIndex) in data[0].fields"
        :key="`card-${cardIndex}`"
      >
        <div class="grid">
          <div 
            class="grid__item"
            v-for="(item, itemIndex) in data"
            :key="`item-${itemIndex}`"
          >
            <div class="header">
              {{ item.headerName }}
            </div>
            <div class="item">
              <div 
                class="number" 
                v-if="item.type == 'number' || item.type === 'rating'" 
                :class="{'number number_positive': item.fields[cardIndex].name.slice(0, 1) === '+' && item.type === 'rating'}"
              >
              {{ item.fields[cardIndex].name }}
              </div>
              <div class="number" v-else-if="item.type == 'price'">
                {{ item.fields[cardIndex].name.slice(0, -3) }}<span class="number__penny">{{ item.fields[cardIndex].name.slice(-3) }}</span>
              </div>
              <router-link class="link" v-else-if="item.type == 'link'" :to="item.fields[cardIndex].url">
                {{ item.fields[cardIndex].name }}
              </router-link>
              
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="footer">
      <div class="footer__excel">
        <ButtonCustom pink><img :src="require(`@/assets/img/svg/excel.svg`)" :alt="'excel'">Выгрузить Excel</ButtonCustom>
      </div>
      <div class="footer__pagination">
        <MpPagination
          :pages="23"
          :active_page="active_page"
          @click="changeActivePage($event)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import ButtonCustom from "@/components/controls/ButtonCustom.vue";
import windowMixin from '@/mixins/window-mixin'
import MpPagination from "@/components/MpPagination.vue"

export default {
  name: 'MpTable',
  components: {
    ButtonCustom,
    MpPagination
  },

  mixins: [windowMixin],

  props: {
    data: Array,
  },
  data: function () {
    return {
      active_page: 1,
      fields_length: null
    };
  },
  beforeMount() {

  },
  created() {
    this.fields_length = this.data[0].fields.length;
  },
  methods: {
    // updateData(newRows) {
    //   this.rowData = newRows
    //   if (this.gridApi) this.gridApi.setRowData(this.rowData);
    // },
    // onGridReady(params) {
    //   this.gridApi = params.api;
    //   if (this.rowData) this.gridApi.setRowData(this.rowData);
    // },
    changeActivePage(e) {
        if (e.page) {
          this.active_page = e.page
          console.log(this.active_page)
        }
      },
    onGridReady() {
      this.rowData = this.table_data
    },
    prepareColumns(columnNames) {
      this.columnDefs = columnNames
    },

    getTableData() {
        const rowData = [];
        if (this.gridApi) {
            this.gridApi.forEachNode((node) => {
                rowData.push(node.data);
            });
        }
        return rowData;
    },
  },
}
</script>

<style lang="scss">
.mptable {
    border-radius: 7px;
    background: #FFF;
    box-shadow: 0px 2px 4px 0px rgba(0, 50, 95, 0.03);
    width: 100%;
    height: 100%;
    padding: 30px !important;
    padding-top: 25px !important;
    .columns{
      display: flex;
      &__item{
        width: 20%;
        .header{
          cursor: pointer;
          margin-bottom: 20px;
          height: fit-content;  
          color: #70567B;
          font-family: Gotham Pro;
          font-size: 12px;
          font-style: normal;
          font-weight: 400;
          text-align: left;
          height: 26px;
          display: flex;
          align-items: center;
          line-height: normal;
          padding-left: 12px;
          border-right: 1px solid rgba(0, 0, 0, 0.10);
        }
        .items{
          margin-bottom: 29px;
          width: 100%;
          padding: 22px 0;
          border-top: 1px solid rgba(0, 0, 0, 0.10); 
          border-bottom: 1px solid rgba(0, 0, 0, 0.10); 
          &__item{
            padding-left: 12px;
            text-align: left;
            &:not(:last-child){
              margin-bottom: 37px;
            }
            .number{
              color: #473366;
              font-family: Gotham Pro;
              font-size: 15px;
              font-style: normal;
              font-weight: 400;
              line-height: 120%; 
              &__penny{
                color: rgba(112, 86, 123, 0.6);
              }
              &_positive{
                color: #188F54;
              }
            }
            .link{
              border-bottom: 1px solid #7256C2;
              color: #7256C2;
              font-family: Gotham Pro;
              font-size: 15px;
              font-style: normal;
              font-weight: 700;
              line-height: 120%;
            }
          }
        }
        &:first-child{
          .header{
            padding-left: 0;
          }
          .items{
            &__item{
              padding-left: 0;
            }
          }
        }
        &:last-child{
          .header{
            border-right: 0; 
          }
        }
      }
    }

    .footer{
      display: flex;
      align-items: center;
      justify-content: space-between;
      &__excel{
        .btn{
          border-radius: 5px;
          background: #AD649B;
          padding: 8px 15px;
          img{
            margin-right: 12px;
          }
        }
      }
      &__showed{
        color: rgba(71, 51, 102, 0.8);
      }
    }
}

@media (max-width: 992px) {
  .mptable {
    padding: 0 !important;
    padding-top: 20px !important;
    .cards{
      &__item{
        border-bottom: 1px solid rgba(0, 0, 0, 0.10);;
        padding-bottom: 24px;
        &:not(:first-child){
          padding-top: 24px;
        }
        .grid{
          padding-left: 20px;
          display: grid;
          text-align: left;
          grid-template-columns: repeat(2, 1fr);
          grid-column-gap: 10px;
          grid-row-gap: 1em;
          &__item{
            .header{
              margin-bottom: 6px;
              color: rgba(112, 86, 123, 0.5);
              font-family: Gotham Pro;
              font-size: 11px;
              font-style: normal;
              font-weight: 400;
              line-height: normal;
            }
            .item{
              .number{
                color: #473366;
                font-family: Gotham Pro;
                font-size: 15px;
                font-style: normal;
                font-weight: 400;
                line-height: 120%; 
                &__penny{
                  color: rgba(112, 86, 123, 0.6);
                }
                &_positive{
                  color: #188F54;
                }
              }
              .link{
                border-bottom: 1px solid #7256C2;
                color: #7256C2;
                font-family: Gotham Pro;
                font-size: 15px;
                font-style: normal;
                font-weight: 700;
                line-height: 120%;
              }
            }
          }
        }
      }
    }
    .footer{
      padding: 0 20px;
      padding-bottom: 27px;
      margin-top: 18px;
      flex-direction: column-reverse;
      &__excel{
        margin-top: 20px;
        width: 100%;
        height: 40px;
        .btn{
          width: 100%;
          height: 40px;
        }
      }
    }
  }
}
</style>
