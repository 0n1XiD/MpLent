<template>
  <div
      class="sidebar"
      @mouseleave="show_menu = false"
  >
    <div
        v-if="window.width > 768"
        class="sidebar__marketplace"
    >
        <svg-icon name="wildberries" />
        <svg-icon name="arrow" />
    </div>
    <div class="sidebar__nav">
        <div
            v-for="(group, groupIndex) in getNavGroup()"
            :key="`group-${groupIndex}-0`"
            class="nav-group"
        >
            <div
                v-for="(item, itemIndex) in group.items"
                :key="`item-${itemIndex}-0`"
                class="item"
                :class="{'item_active': item.link === this.$route.path}"
                @mouseenter="show_menu = true"
                @click="itemNavClick(item)"
            >
                <div class="item__icon">
                    <svg-icon
                        :name="item.icon"
                        :stroke="getItemColor(item)"
                        :fill="getItemColor(item)"
                        width="20"
                        height="20"
                    />
                </div>
                <div
                    v-if="window.width > 768"
                    class="item__name"
                >
                    {{ item.name }}
                </div>
            </div>
            <!-- <router-link 
                v-for="(item, itemIndex) in group.items"
                :key="`item-${itemIndex}-0`"
                :to="item.link"
                class="item"
                @click="show_menu = true"
            >
                <div class="item__icon">
                    <svg-icon
                        :name="item.icon"
                        :stroke="getItemColor(item)"
                        :fill="getItemColor(item)"
                        width="20"
                        height="20"
                    />
                </div>
                <div
                    v-if="window.width > 768"
                    class="item__name"
                >
                    {{ item.name }}
                </div>
            </router-link> -->
        </div>
    </div>
    <div
        v-if="show_menu && window.width > 768"
        class="sidebar__menu"
    >
        <div
            v-for="(group, groupIndex) in menu_groups"
            :key="`group-${groupIndex}-0`"
            class="menu-group"
        >
            <router-link 
                v-for="(item, itemIndex) in group.items"
                :key="`menu-item-${itemIndex}-0`"
                :to="item.link"
                class="menu-item"
            >
                <div class="menu-item__icon">
                    <svg-icon
                        :name="item.icon"
                        :stroke="getMenuItemColor(item)"
                        :fill="getMenuItemColor(item)"
                    />
                </div>
                <div
                    class="menu-item__name"
                >
                    {{ item.name }}
                </div>
            </router-link>
        </div>
    </div>
    <div
        v-if="show_menu && window.width > 768"
        class="sidebar__bg-wrapper"
        @mouseenter="show_menu = false"
    ></div>
  </div>
</template>

<script>
import windowMixin from '@/mixins/window-mixin'
import SvgIcon from '@/components/controls/SvgIcon.vue'

export default {
  components: {
    SvgIcon
  },
  mixins: [windowMixin],

  data () {
    return{
      nav_groups: [
        {
            items: [
                { name: 'Категории', icon: 'categories', link: '/categories/0', color: '#473366'},
                { name: 'Бренды', icon: 'brands', link: '/brands/0', color: '#473366'},
                { name: 'Поставщики', icon: 'suppliers', link: '/suppliers/0', color: '#473366'},
                { name: 'Пользователь', icon: 'user_2', link: '/account', color: '#473366'},
                { name: 'Товары', icon: 'products', link: '/category/products/1', color: '#473366'},
            ]
        },
        {
            items: [
                { name: 'Загрузка цен', icon: 'downloading_prices', link: '/', color: '#473366'},
                { name: 'API ключи', icon: 'api_keys', link: '/generate-api-key', color: '#473366'},
            ]
        },
        {
            items: [
                { name: 'Мои заказы', icon: 'my_orders', link: '/orders/', color: '#473366'},
                { name: 'Мои товары', icon: 'my_products', link: '/user', color: '#473366'},
                { name: 'Расчет поставки', icon: 'calculation_supply', link: '/calculation-supply', color: '#473366'},
            ]
        },
        {
            items: [
                { name: 'Кабинет WB', icon: 'cabinet', link: '/wb', color: '#473366'},
            ]
        }
      ],
      show_menu: false,
      menu_groups: [
        {
            items: [
                { name: 'Поиск категорий', icon: 'categories_search', link: '/categories/0', color: '#473366'},
            ]
        },
        {
            items: [
                { name: 'Поиск товаров', icon: 'product_search', link: '/categories/2', color: '#473366'},
                { name: 'Группы товаров', icon: 'product_groups', link: '/brands/0', color: '#473366'},
                { name: 'Товары категории', icon: 'category_products', link: '/suppliers/0', color: '#473366'},
                { name: 'Товары бренда', icon: 'brand_products', link: '/account', color: '#473366'},
                { name: 'Товар поставщка', icon: 'product_placement', link: '/category/products/1', color: '#473366'},
            ]
        },
      ],
    }
  },
  methods: {
    getNavGroup(){
        if (this.window.width <= 768) {
            const newMenu = []
            for (const group of this.nav_groups) {
                newMenu.push({ items: [group.items[0]] })
            }
            newMenu.push({ items: [
                { name: 'Категории', icon: 'help_small', event: 'help', is_active: false},
            ] })
            return newMenu
        }
        return this.nav_groups
    },
    getItemColor(item){
        if (item.color) {
            if (item.link === this.$route.path) { return '#FFFFFF' }
            return item.color
        }
        return 'none'
    },
    getMenuItemColor(item){
        if (item.link === this.$route.path) { return '#AD649B' }
        return item.color
    },
    itemNavClick(item){
        if (item.link) { this.$router.push(item.link) }
        if (item.event){ this.$emit('navClick', item.event)}
    },
    setActiveNav(item) {
        if (window.width <= 768) {
            for (const navItem of this.getNavGroup()) {
                navItem.is_active = false
            }
            item.is_active = true
        }
    }
  }
}
</script>

<style lang="scss" scoped>
.sidebar{
    overflow-x: visible;
    position: fixed;
    z-index: 999;
    background: $white;
    min-width: 240px;
    width: 240px;
    height: calc(100vh - 70px);
    margin-top: 70px;
    left: 0;
    bottom: 0;
    &__marketplace{
        display: flex;
        align-items: center;
        justify-content: space-between;
        cursor: pointer;
        padding: 14px 26px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    }
    &__nav{
        padding: 30px 26px;
        .nav-group{
            &:not(:last-child){
                margin-bottom: 26px;
            }
            .item{
                cursor: pointer;
                display: flex;
                align-items: center;
                padding: 10px;
                border-radius: 7px;
                &:not(:last-child){
                    margin-bottom: 6px;
                }
                &_active{
                    background: var(--bg-secondary);
                    .item__name{
                        color: var(--text-active-color) !important;
                    }
                }
                &__icon{
                    margin-right: 12px;
                }
                &__name{
                }
            }
        }
    }
    &__menu{
        position: absolute;
        left: 240px;
        top: 0;
        height: calc(100vh - 70px);
        background: $white;
        width: 240px;
        min-width: 240px;
        padding: 71px 26px;
        z-index: 999;
        border-left: 1px solid rgba(0, 0, 0, 0.10);
        .menu-group{
            &:not(:last-child){
                margin-bottom: 24px;
            }
            .menu-item{
                padding: 10px;
                display: flex;
                align-items: center;
                &:not(:last-child){
                    margin-bottom: 6px;
                }
                &__icon{
                    margin-right: 12px;
                }
                &__name{
                    text-wrap: nowrap;
                }
                &:hover{
                    .menu-item__name{
                        color: var(--bg-btn);
                    }
                }
            }
        }
    }
    &__bg-wrapper{
        position: fixed;
        display: flex;
        align-items: center;
        justify-content: center;
        left: 480px;
        top: 0;
        width: 100%;
        height: 100%;
        background: var(--bg-third);
        backdrop-filter: blur(2px);
        z-index: -1;
        opacity: 0.15000000596046448;
    }
}

@media (max-width: 768px){
    .sidebar{
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: fixed;
        height: 60px;
        width: 100%;
        bottom: 0;
        top: auto;
        margin-top: 0;
        &__nav{
            width: 100%;
            padding: 0;
            display: flex;
            justify-content: space-evenly;
            align-items: center;
            .nav-group{
                &:not(:last-child){
                    margin-bottom: 0;
                }
                .item{
                    &__icon{
                        margin-right: 0;
                    }
                }
            }
        }
    }
}

</style>