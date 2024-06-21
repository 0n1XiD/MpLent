<template>
    <img v-lazy="'https://mpinsider.ru/app/img1/data/' + params.value + '/1.jpg'" style="width: 100%; height: 100%; object-fit: contain"/>
</template>

<script>
export default {
    props: ['params']
}
</script>