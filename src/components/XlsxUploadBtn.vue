<!--<template>-->
<!--    <button class="xlsx-btn" @click="handleButtonClick">Выгрузить Excel </button>-->
<!--</template>-->

<script>
export default {
    name: "XlsxUploadBtn",
    props: {
        onClick: {
            type: Function,
            required: true,
        },
    },
    methods: {
        handleButtonClick() {
            // Вызов переданного обработчика клика
            this.onClick();
        },
    },
};
</script>

<style scoped>
.xlsx-btn {
    display: flex;
    justify-content: flex-start;

}
</style>
