<template>
    <p>Группа товаров: {{ groupName }}</p>
    <p>Комментарий: {{ groupComment }}</p>

    <div id="app">
        <input type="radio" value="Wildberries" v-model="marketplace" v-on:change="refreshGroupComment">
        <label>Wildberries</label>
        <br>
        <input type="radio" value="Ozon" v-model="marketplace" v-on:change="refreshGroupComment">
        <label>Ozon</label>
        <br>
    </div>

    <MazInput v-model="newGroupComment" label="Введите комментарий" />
    <br />

    <MazBtn @click="updateGroupComment">Изменить комментарий для маркетплейса</MazBtn>
    <br />
    <br />

    <MazInput v-model="vendorCode" label="Введите артикул товара" />
    <br />

    <MazBtn @click="addProdByVendorCode">Добавить товар по артикулу</MazBtn>
    <br />
    <br />

    <MazBtn @click="addSearchKeywords">Добавить запросы</MazBtn>
    <br />
    <br />

    <MpTable :columnNames="columnNames" ref="mpTable"></MpTable>

    <p>Комментарий: {{ selectedRowsString }}</p>
</template>

<script>
import 'maz-ui/css/main.css'
import MpTable from '../components/MpTable.vue'
import MazInput from 'maz-ui/components/MazInput'
import MazBtn from 'maz-ui/components/MazBtn'
export default {
    name: 'GroupView',
    components: {
        MpTable,
        MazInput,
        MazBtn,
    },
    data() {
        return {
            columnNames: [
                { headerName: 'ID', field: 'id', pinned: 'left', minWidth: 170 },
                { headerName: 'Название', field: 'name' },
                { headerName: 'Себестоимость', field: 'cost_price' },
                { headerName: 'Цена', field: 'price' },
                { headerName: 'Процент комиссии', field: 'commission_percent' },
                { headerName: 'Артикул', field: 'vendor_code' },
                { headerName: 'Комментарий wb', field: 'wb_comment' },
                { headerName: 'Комментарий ozon', field: 'ozon_comment' },
            ],
            gridApi: null,
            groupName: '',
            groupComment: '',
            newGroupComment: '',
            comment: '',
            selectedRowsString: '',
            marketplace: 'Wildberries'
        }
    },
    methods: {
        updateGroupProdTable: function (tableData) {
            for (let i = 0; i < tableData.length; i++) {
                if (!tableData[i].comments) {
                    continue
                }

                tableData[i].wb_comment = tableData[i].comments[0]
                tableData[i].ozon_comment = tableData[i].comments[1]
            }

            this.$refs.mpTable.updateData(tableData)
        },
        getMarketplaceIndex: function (marketplace) {
            let marketplaceIndex
            switch (marketplace) {
                case 'Wildberries':
                    marketplaceIndex = 0
                    break
                case 'Ozon':
                    marketplaceIndex = 1
                    break
            }

            return marketplaceIndex
        },
        refreshGroupComment: function () {
            if (!this.groupComments) {
                return
            }

            let marketplaceIndex = this.getMarketplaceIndex(this.marketplace)
            this.groupComment = this.groupComments[marketplaceIndex]
            this.newGroupComment = this.groupComment
        },
        getGroupProds: async function () {
            let data = await this.$mp.ajax("mp-group", "get-group", { groupId: this.$route.params.groupId })
            if (data.error) {
                alert('Ошибка');
            }
            else {
                return data.resp
            }
        },
        addProdByVendorCode: async function () {
            let data = await this.$mp.ajax("mp-group", "add-group-prod-by-vendor", { groupId: this.$route.params.groupId, vendorCode: this.vendorCode })
            if (data.error) {
                this.errors.push('Ошибка сервера: ' + data.error)
            }
            else {
                if (!data.resp.is_prod_exist) {
                    alert('Товара с заданным артикулом не существует')
                }
                else {
                    let groupData = await this.getGroupProds()
                    if (groupData) {
                        this.updateGroupProdTable(groupData.group_prods)
                    }
                }
            }
        },
        updateGroupComment: async function () {
            let marketplaceId
            let marketplaceToUpdate = this.marketplace
            switch (this.marketplace) {
                case 'Wildberries':
                    marketplaceId = 0
                    break
                case 'Ozon':
                    marketplaceId = 1
                    break
            }

            let comment = this.newGroupComment

            let data = await this.$mp.ajax("mp-group", "update-group-comment", { groupId: this.$route.params.groupId, marketplaceId: marketplaceId, comment: comment })
            if (data.error) {
                this.errors.push('Ошибка сервера: ' + data.error)
            }
            else {
                let marketplaceIndex = this.getMarketplaceIndex(marketplaceToUpdate)

                this.groupComments[marketplaceIndex] = comment
                this.refreshGroupComment()
            }
        },
        addSearchKeywords: async function () {
            var selectedRows = this.gridApi.getSelectedRows();

            this.selectedRowsString = ''

            selectedRows.forEach(function (selectedRow, index) {
                if (index > 0) {
                    this.selectedRowsString += ', ';
                }
                this.selectedRowsString += selectedRow.id;
            });
        }
    },
    async created() {
        let groupData = await this.getGroupProds()
        if (groupData) {
            this.updateGroupProdTable(groupData.group_prods)
            this.groupName = groupData.name

            if (groupData.comments) {
                this.groupComments = groupData.comments
            } else {
                this.groupComments = new Array()
            }

            this.refreshGroupComment()
        }
    }
}
</script>