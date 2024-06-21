<template>
    <header class="header">
        <div
            v-if="!search_active"
            class="header__additional-content"
        >
            <div class="logotype">
                <svg-icon
                    name="logo"
                    :width="getLogoSize().width"
                    :height="getLogoSize().height"
                />
            </div>
            <div
                v-if="window.width < 768"
                class="marketplace"
            >
                <svg-icon
                    name="wb_small"
                    width="40"
                    height="40"
                />
                <div class="marketplace__drop-down">
                    <svg-icon name="arrow"/>
                </div>
            </div>
        </div>
        <div class="header__content">
            <div
                class="search"
                :class="{'search_active': search_active}"
            >
                <input-field
                    v-if="window.width > 768 || search_active"
                    v-model="search"
                    search
                    id="search"
                    placeholder="Найти..."
                    ref="search"
                    @blur="unfocusSearch()"
                />
                <svg-icon
                    v-else
                    name="search"
                    width="24"
                    height="24"
                    @click="focusSearch()"
                />
            </div>
            <div
                v-if="!search_active"
                class="notification"
            >
                <svg-icon name="notification"/>
            </div>
            <div
                v-if="!search_active"
                class="settings"
            >
                <svg-icon name="user"/>
                <div
                    v-if="window.width > 768"
                    class="settings__text"
                >настройки</div>
            </div>
        </div>

        <!-- <button class="dropdown-toggle" @click="toggleDropdown">{{ isDropdownVisible ? 'Закрыть' : 'Меню' }}</button>
        <ul class="dropdown-menu" :class="{ 'show': isDropdownVisible }" @click="handleMenuClick" id="dropdownMenu">
            <nav v-if="!['/login','/register','/register-sms'].includes(this.$route.path)">
                        <router-link to="/">Главная</router-link> |
                        <router-link to="/categories/0">Категории</router-link> |
                        <router-link to="/search/categories">Поиск категорий</router-link> |
                        <router-link :to="`/search/products`">Поиск товаров</router-link> |
                        <router-link :to="`/brands/0`">Бренды категорий</router-link> |
                        <router-link :to="`/suppliers/0`">Поставщики категорий</router-link> |
                        <router-link :to="`/supplier/products/73851`">Товары поставщика</router-link> |
                        <router-link :to="`/category/products/1`">Товары категории</router-link> |
                        <router-link :to="`/brand/products/149`">Товары бренда</router-link> |
                        <router-link :to="`/product/158437525`">Товар</router-link> |
                        <router-link :to="`/user`">Мои товары</router-link> |
                        <router-link :to="`/prods-info-upload/`">Загрузка обновлений товара</router-link> |
                        <router-link :to="`/orders-info-upload/`">Загрузка обновлений заказа</router-link> |
                        <router-link :to="`/orders/`">Мои заказы</router-link> |
                        <router-link :to="`/generate-api-key`">Api ключ</router-link> |
                        <router-link :to="`/edit-wb-token`">Токены wb</router-link> |
                        <router-link :to="`/account`">ЛК</router-link> |
                    </nav>
                </ul> -->

        <!-- Логотип -->
<!--        <img src="logo.png" alt="Логотип">-->

<!--        &lt;!&ndash; Поле поиска &ndash;&gt;-->
<!--        <input type="text" placeholder="Поиск...">-->

<!--        &lt;!&ndash; Кнопка уведомлений &ndash;&gt;-->
<!--        <button>Уведомления</button>-->

<!--        &lt;!&ndash; Личный кабинет&ndash;&gt;-->
<!--        <button>Личный кабинет</button>-->
    </header>
</template>

<script>
import InputField from '@/components/controls/InputField.vue';
import windowMixin from '@/mixins/window-mixin'
import SvgIcon from '@/components/controls/SvgIcon.vue'

export default {
    components: {
        InputField,
        SvgIcon
    },

    mixins: [windowMixin],

    data() {
        return {
            fromTime: "",
            toTime: "",
            isDropdownVisible: false,
            search: '',
            search_active: false
        };
    },

    created() {
        // Получаем текущую дату и вычисляем дату, которая была месяц назад
        const toTime = new Date();
        const fromTime = new Date(toTime.getFullYear(), toTime.getMonth() - 1, toTime.getDate());

        // Присваиваем значения вычисленных дат свойствам компонента
        this.fromTime = fromTime.toISOString().slice(0, 10).replace(/-/g, '');
        this.toTime = toTime.toISOString().slice(0, 10).replace(/-/g, '');
    },
    methods: {
        toggleDropdown() {
            this.isDropdownVisible = !this.isDropdownVisible;
        },
        getLogoSize() {
            if (this.window.width < 768) { return { width: 86, height: 25 }}
            return { width: 128, height: 35 }
        },
        focusSearch (){
            this.search_active = true
            this.$nextTick(function () {
                const el = document.getElementById('search');
                el.focus();
            })
        },
        unfocusSearch() {
            this.search_active = false
        }
    },
};
</script>

<style lang="scss" scoped>
.header{
    height: 70px;
    display: flex;
    align-items: center;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 1000;
    &__additional-content{
        display: flex;
        align-items: center;
        padding-left: 26px;
        min-width: 240px;
        width: 240px;
        height: 100%;
        background-color: var(--bg-third);
        .marketplace{
            position: relative;
            margin-left: 24px;
            &__drop-down{
                width: 14px;
                height: 14px;
                display: flex;
                align-items: center;
                justify-content: center;
                position: absolute;
                bottom: 5px;
                right: 0;
                border-radius: 100%;
                background-color: $white;
            }
        }
    }
    &__content{
        padding: 0 40px;
        width: 100%;
        height: 100%;
        background: var(--bg-secondary);
        justify-content: space-between;
        display: flex;
        align-items: center;
        .search{
            margin-right: 50px;
            width: 100%;
        }
        .notification{
            cursor: pointer;
            margin-right: 47px;
            width: fit-content;
            height: fit-content;
            padding: 10px;
            border: 1px solid rgba(255, 255, 255, 0.3);
            border-radius: 5px;
        }
        .settings{
            cursor: pointer;
            display: flex;
            align-items: center;
            &__icon{
                margin-right: 10px;
            }
            &__text{
                color: var(--text-active-color);
            }
        }
    }
}

.dropdown-toggle{
    display: none;
}
.dropdown-menu {
    /*display: none;*/
    list-style: none;
    padding: 0;
}

.show {
    display: block;
}

@media (max-width: 768px){
    .header{
        height: 54px;
        &__additional-content{
            min-width: auto;
            width: auto;
            background: var(--bg-secondary);
        }
        &__content{
            display: flex;
            justify-content: flex-end;
            .search{
                width: fit-content;
                margin-right: 26px;
                &_active{
                    margin-right: 0;
                    width: 100%;
                }
            }
            .notification{
                cursor: pointer;
                margin-right: 26px;
                width: fit-content;
                height: fit-content;
                padding: 10px;
                border: none;
            }
        }
    }
}

</style>









