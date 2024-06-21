<template>
    <MpBreadcrumbs :items="breadcrumbItems"></MpBreadcrumbs>
    <h1>Редактирование токенов wildberries</h1>
    <form
        class="addKeyForm"
    >
        <MazInput
            v-model="tokenKey"
            label="Введите ключ"
        />

        <br/>
    <MazBtn @click="addKeyForm">Добавить ключ.</MazBtn>
    </form>
    <br/>
    <br/>


    <div v-for="(token) in wbTokenKeys" :key="token">
        <MazBadge outline>{{ token }}</MazBadge>
    </div>


</template>

<script>
import 'maz-ui/css/main.css'
import MazBtn from 'maz-ui/components/MazBtn'
import MazBadge from 'maz-ui/components/MazBadge'
import MazInput from 'maz-ui/components/MazInput'
import MpBreadcrumbs from "@/components/MpBreadcrumbs.vue";
export default {
  name: 'addKeyForm',
  components: {MpBreadcrumbs, MazBtn, MazBadge, MazInput},
  data () {
      return {
          wbTokenKeys: []
      }
  },
    computed: {
        breadcrumbItems() {
            return [
                {text: 'Mpland'},
                {text: 'Кабинет Wildberries'},
                {text: 'Токены WB'},
            ];
        }
    },
  methods: {
      addKeyForm: async function () {
          let data = await this.$mp.ajax("mp-wb-user", "edit-wb-token", {tokenKey: this.tokenKey, actionKey: "add"})
          if (data.error) {
              this.errors.push('Ошибка сервера: ' + data.error)
          }
      }
  },
    async created() {
        let data = await this.$mp.ajax("mp-wb-user", "get-wb-token", )
        if (data.error) {
            alert('Ошибка');
        } else if (data.resp.token) {
            this.wbTokenKey = data.resp.token
            this.wbTokenKeys = this.wbTokenKey.replace(/[{}]/g, '').split(',')

        }
    }
}
</script>