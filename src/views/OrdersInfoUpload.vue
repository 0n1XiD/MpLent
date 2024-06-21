<template>
    <MpBreadcrumbs :items="breadcrumbItems"></MpBreadcrumbs>
    <div class="container" id="uploadApp">

        <div v-if="parsingErrorFatal">
            <MazBadge>
                <a href="#" @click="parsingErrorFatal=false">&times;</a>
                {{ parsingFatal }}
            </MazBadge>
        </div>
        <br />
        <div v-if="errorAlert">
            <MazBadge>
                <a href="#" @click="errorAlert=false">&times;</a>
                {{ "Произошла ошибка при загрузке" }}
            </MazBadge>
        </div>
        <br />
        <div v-if="parsingAlert">
            <MazBadge>
                <a href="#" @click="parsingAlert=false">&times;</a>
                {{  parsingErrors }}
            </MazBadge>
        </div>
        <br />
        <div v-if="upDatedProds">
            <MazBadge>
                <a href="#" @click="upDatedProds=false">&times;</a>
                {{ "Данные обновлены"}}
            </MazBadge>
        </div>

        <h3 class="panel-title">Загрузите файл xlsx</h3>
        <input type="file" ref="file" @change="selectXlsx"/>
        <br />
        <br />
        <MazBtn type="button" @click="handleUploadXlsx">Загрузить</MazBtn>
    </div>
    <br />
    <br />

</template>

<script>
import * as XLSX from 'xlsx';
import 'maz-ui/css/main.css'
import MazBtn from 'maz-ui/components/MazBtn'
import MazBadge from 'maz-ui/components/MazBadge'
import MpBreadcrumbs from "@/components/MpBreadcrumbs.vue";
export default {
    data(){
        return {
            selectedFile: null,
            parsingErrorFatal: false,
            errorAlert:false,
            parsingAlert:false,
            parsingError:false,
            upDatedProds:false,
            parsingErrors: '',
            pricesCount: 0,
            parsingFatal: '',
        }
    },
    computed: {
        breadcrumbItems() {
            return [
                {text: 'Mpland'},
                {text: 'Кабинет Wildberries'},
                {text: 'Загрузка обновлений заказов'},
            ];
        }
    },
    name: 'OrdersInfoUpload',
    components: {
        MpBreadcrumbs,
        MazBtn,
        MazBadge
    },
    methods: {
        selectXlsx(event) {
            this.selectedFile = event.target.files[0];
        },
        async handleUploadXlsx() {
            let arrayBuffer = await this.selectedFile.arrayBuffer()
            let book = XLSX.read(arrayBuffer);
            let worksheet = book.Sheets[book.SheetNames[0]]
            const jsonData = XLSX.utils.sheet_to_json(worksheet, {header: 1})

            let data = await this.$mp.ajax("mp-wb-user", "upload-order_info-xlsx", {data: JSON.stringify(jsonData)})
            if (data.resp.parse_field_error) {
                this.parsingErrors = data.resp.parse_field_error;
                this.parsingAlert = true
            }
            if (data.resp.is_updated) {
                this.upDatedProds = true
            }
            if (data.resp.parse_error) {
                this.parsingFatal = data.resp.parse_error;
                this.parsingErrorFatal = true
            }
            if (data.error) {
                this.errorAlert = true;

            }
        }
    }
}
</script>
