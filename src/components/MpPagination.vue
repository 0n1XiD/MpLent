<template>
  <div class="mp-pagination">
    <div
        v-for="(page, pageIndex) in getPagesCount()"
        :key="`page-${pageIndex}`"
        class="mp-pagination__item"
        :class="{
            'inactive': page === '...',
            'active': active_page === page
        }"
        @click="getPage(page)"
    >
        {{ page }}
    </div>
  </div>
</template>

<script>
export default {
    props:{
        pages: {
            type: Number,
            required: true
        },
        active_page: {
            type: Number,
            required: true
        }
    },
    methods:{
        getPagesCount() {
            const pagesValues = []
            if (this.pages < 9) {
                for (const page in this.pages){ pagesValues.push(page) }
            } else if (this.active_page < 5) {
                for (let page = 1; page < 7; page++) {
                    pagesValues.push(page)
                }
                pagesValues.push(`...`)
                pagesValues.push(this.pages)
            } else if (this.active_page >= 5 && this.active_page < this.pages - 4) {
                pagesValues.push(1)
                pagesValues.push(`...`)
                const startPage = this.active_page - 2
                for (let page = startPage; page < this.active_page + 1; page++) {
                    pagesValues.push(page)
                }
                pagesValues.push(this.active_page + 1)
                pagesValues.push(`...`)
                pagesValues.push(this.pages)
            } else {
                pagesValues.push(1)
                pagesValues.push(`...`)
                const startPage = this.pages - 5
                for (let page = startPage; page < this.pages + 1; page++) {
                    pagesValues.push(page)
                }
            }
            return pagesValues
        },
        getPage(page) {
            if (page && page != '...') {
                this.$emit('click', {page});
            }
        }
    }
}
</script>

<style lang="scss">
.mp-pagination{
    display: flex;
    align-items: center;
    &__item{
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        &:not(:last-child) {
            margin-right: 5px;
        }
        &.active, &:hover{
            border-radius: 5px;
            border: 1px solid var(--bg-third);
        }
        &.inactive{
            cursor: default;
            border: none;
        }
    }
}

@media (max-width: 420px) {
    .mp-pagination{
        &__item{
            width: 30px;
            height: 30px;
        }
    }
}

@media (max-width: 320px) {
    .mp-pagination{
        &__item{
            width: 25px;
            height: 25px;
        }
    }
}
</style>