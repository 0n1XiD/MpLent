<template>
    <MpBreadcrumbs :items="breadcrumbItems"></MpBreadcrumbs>
    <div>
        <h1>Сгенерировать ключ api</h1>
        <form class="generateKeyForm">
            <MazInput v-model="keyName" label="Введите название ключа" />
            <br />
            <MazBtn @click="generateApiKey">Сгенерировать ключ.</MazBtn> &nbsp;
        </form>
        <br />
        <br />

        <div v-if="apiKey">
            <MazBadge outline>
                <a href="#" @click="apiKey = false"></a>
                {{ "Ваш ключ " + keyName + " : " + apiKeyStr }}
            </MazBadge>
            <button @click="copyApiKey">Копировать ключ</button>
        </div>
    </div>
</template>

<script>
import MazBtn from 'maz-ui/components/MazBtn'
import MazBadge from 'maz-ui/components/MazBadge'
import MazInput from 'maz-ui/components/MazInput'
import MpBreadcrumbs from "@/components/MpBreadcrumbs.vue";

export default {
    name: 'GenerateApiKey',
    components: {MpBreadcrumbs, MazBtn, MazBadge, MazInput },
    data() {
        return {
            apiKey: false,
            apiKeyStr: '',
            keyName: '',
        }
    },
    computed: {
        breadcrumbItems() {
            return [
                {text: 'Mpland'},
                {text: 'Кабинет Wildberries'},
                {text: 'API ключи'},
            ];
        }
    },
    methods: {
        generateApiKey: async function () {
            let data = await this.$mp.ajax('mp-gateway', 'set-api-key', { name: this.keyName })
            if (data.error) {
                this.errors.push('Ошибка сервера: ' + data.error)
            }
            if (data.resp.key) {
                this.apiKeyStr = data.resp.key
                this.apiKey = true
            }
        },
        copyApiKey: function () {
            navigator.clipboard.writeText(this.apiKeyStr)
                .then(() => {
                    alert('Ключ скопирован в буфер обмена!')
                })
                .catch((error) => {
                    console.error('Не удалось скопировать ключ: ', error)
                })
        },
    },
}
</script>
