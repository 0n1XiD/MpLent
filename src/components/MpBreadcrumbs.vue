<template>
    <router-link to="/" class="breadcrambs">
        <div class="breadcrambs__item" v-for="(item, index) in items" :key="index">
            <span>{{ item.text }}</span>
        </div>
    </router-link>
</template>

<script>
export default {
    name: 'MpBreadcrumbs',
    props: {
        items: {
            type: Array,
            required: true
        }
    }
}
</script>

<style lang="scss" scoped>
.breadcrambs{
    width: fit-content;
    margin-bottom: 50px;
    display: flex;
    align-items: center;
    &__item{
        cursor: pointer;
        &:not(:last-child){
            padding-right: 10px;
            &::after{
                padding-left: 10px;
                content: '/';
            }
        }
        &:hover{
            color: $purple;
        }
        text-decoration: none;
        font-size: 12px;
        color: var(--text-inactive-color);
    }
}
</style>