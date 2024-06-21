<template>
  <div class="mp-help">
    <div
        v-if="window.width > 768"
        class="mp-help__icon"
    >
        <svg-icon
            v-if="!is_open"
            name="help_full"
            @click="is_open = true"
        />
        <div
            v-else
            class="icon-open"
            @click="is_open = false"
        >
            <svg-icon
                name="arrow"
                width="18"
                height="18"
                stroke="#FFFFFF"
            />
        </div>
    </div>
    <div
        v-if="is_open"
        class="mp-help__content"
    >
        <div v-if="window.width <= 768" class="title">Связаться с поддержкой</div>
        <div class="items">
            <a
                v-for="(element, elementIndex) in elements"
                :key="`element-${elementIndex}`"
                :href="element.href"
                class="item"
            >
                <div class="item__icon">
                    <svg-icon
                        :name="element.icon"
                        width="24"
                        height="24"
                        stroke="#FFFFFF"
                    />
                </div>
                <div class="item__name">
                    {{ element.name }}
                </div>
            </a>
        </div>
    </div>
  </div>
</template>

<script>
import SvgIcon from '@/components/controls/SvgIcon.vue'
import windowMixin from '@/mixins/window-mixin'

export default {
    mixins: [windowMixin],
    props: {
        showContent: {
            type: Boolean,
            default: false
        }
    },
    watch: {
        showContent: {
            deep: true,
            immediate: true,
            handler (newValue) {
                this.is_open = newValue
            }
        }
    },
    data () {
        return {
            is_open: false,
            elements: [
                { icon: 'facebook', name: 'Facebook', href: 'https://www.facebook.com/'},
                { icon: 'telegram', name: 'Telegram', href: '/'},
                { icon: 'whatsapp', name: 'WhatsApp', href: '/'}
            ]
        }
    },
    components: {
        SvgIcon
    },
}
</script>

<style lang="scss">
.mp-help{
    &__icon{
        position: absolute;
        right: 20px;
        bottom: 15px;
        .icon-open{
            width: 64px;
            height: 64px;
            border-radius: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: var(--bg-btn);
        }
    }
    &__content{
        padding: 20px;
        width: 200px;
        height: 210px;
        position: absolute;
        bottom: 91px;
        right: 20px;
        border-radius: 12px;
        background-color: var(--bg-secondary);
        .title{
            text-align: left;
            font-size: 36px;
            margin-bottom: 30px;
            color: var(--text-active-color-two);
        }
        .items{
            .item{
                display: flex;
                align-items: center;
                width: 160px;
                height: 50px;
                padding-left: 16px;
                border-radius: 8px;
                background: rgba(71, 51, 102, 0.30);
                box-shadow: 0px 1px 2px 0px rgba(71, 51, 102, 0.18);
                &:not(:last-child){
                    margin-bottom: 10px;
                }
                &__icon{
                    margin-right: 14px;
                }
                &__name{
                    font-size: 16px;
                    font-weight: 400;
                    line-height: 150%;
                    color: var(--text-active-color);
                }
            }
        }
    }
}

@media (max-width: 768px){
    .mp-help{
        &__content{
            border-radius: 0;
            padding-top: 30px;
            background-color: var(--bg-color);
            top: 54px;
            left: 0;
            position: fixed;
            z-index: 2000;
            width: 100%;
            height: calc(100vh - 114px);
            .items{
                .item{
                    height: 60px;
                    padding: 18px 20px;
                    width: 100%;
                    background-color: var(--bg-btn);
                    flex-flow: row-reverse;
                    justify-content: space-between;
                    &:not(:last-child){
                        margin-bottom: 6px;
                    }
                    &__icon{
                        margin-right: 14px;
                    }
                    &__name{
                        font-size: 16px;
                        font-weight: 400;
                        color: var(--text-active-color);
                    }
                }
            }
        }
    }
}
</style>