<template>
  <MazInput  
    v-model="groupName"
    label="Введите название группы товаров"
  />
  <br/>
    
  <MazBtn @click="createGroup">Создать новую группу товаров</MazBtn>
  <br/>
  <br/>


  <MpTable
    :columnNames="columnNames"
    ref="mpTable"
  ></MpTable>
  
</template>
  
<script>
  import 'maz-ui/css/main.css'
  import MpTable from '../components/MpTable.vue'
  import MazInput from 'maz-ui/components/MazInput'
  import MazBtn from 'maz-ui/components/MazBtn'
  export default {
    name: 'GroupsView',
    components: {
      MpTable,
      MazInput,
      MazBtn
    },
    data () {
      return {
        columnNames: [
          { headerName: 'Название', field: 'name', pinned: 'left', minWidth: 170, cellRenderer: params => { return '<a href="/app/group/'+params.data.id+'">'+params.value+'</a>'; } },
          { headerName: 'Комментарий wb', field: 'wb_comment' },
          { headerName: 'Комментарий ozon', field: 'ozon_comment' },
          { headerName: 'Наши товары на wb', field: 'group_prods' }
        ],
      }
    },
    methods: {
      createGroup: async function() {
        let data = await this.$mp.ajax("mp-group", "create-group", {name: this.groupName})
        if (data.error) {
          this.errors.push('Ошибка сервера: ' + data.error)
        } 
        else {
          this.getGroups()
        }
      },
      getGroups: async function() {
        let data = await this.$mp.ajax("mp-group", "get-groups")
        if (data.error) {
          alert('Ошибка');
        }
        else {
          for (let i = 0; i < data.resp.groups.length; i++) {
            if (!data.resp.groups[i].comments) {
              continue
            }

            data.resp.groups[i].wb_comment = data.resp.groups[i].comments[0]
            data.resp.groups[i].ozon_comment = data.resp.groups[i].comments[1]
          }

          this.$refs.mpTable.updateData(data.resp.groups)
        }
      }
    },
    async created() {
      this.getGroups()      
    }
  }
 
 
 </script>
  