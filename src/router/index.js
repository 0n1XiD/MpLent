import {  createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/auth/LoginView.vue';
import RegisterView from '../views/auth/RegisterView.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    meta: { title: 'Главная' },
    component: () => import('../views/HomeView.vue')
  },
  {
    path: '/orders/',
    name: 'user-orders',
    meta: { title: 'Заказы пользователя' },
    component: () => import('../views/OrdersView.vue')
  },
  {
    path: '/prods-info-upload/',
    name: 'prods-info-upload',
    meta: { title: 'Загрузка обновлений товара' },
    component: () => import('../views/ProdsInfoUpload.vue')
  },
  {
    path: '/orders-info-upload/',
    name: 'orders-info-upload',
    meta: { title: 'Загрузка обновлений заказа' },
    component: () => import('../views/OrdersInfoUpload.vue')
  },
  {
    path: '/user/',
    name: 'user-products',
    meta: { title: 'Товары пользователя' },
    component: () => import('../views/UserProductsView.vue')
  },
  {
    path: '/supplier/products/:supplierId',
    name: 'supplier-products',
    meta: { title: 'Товары поставщика' },
    component: () => import('../views/SupplierProductsView.vue')
  },
  {
    path: '/category/products/:catId',
    name: 'category-products',
    meta: { title: 'Товары категории' },
    component: () => import('../views/CatProductsView.vue')
  },
  {
    path: '/brand/products/:brandId',
    name: 'brand-products',
    meta: { title: 'Товары бренда' },
    component: () => import('../views/BrandProductsView.vue')
  },
  {
    path: '/product/:prodId',
    name: 'product',
    meta: { title: 'Товар' },
    component: () => import('../views/ProductView.vue')
  },
  {
    path: '/brands/:categoryId',
    name: 'brands',
    meta: { title: 'Бренды' },
    component: () => import('../views/BrandsView.vue')
  },
  {
    path: '/suppliers/:categoryId',
    name: 'suppliers',
    meta: { title: 'Поставщики' },
    component: () => import('../views/SuppliersView.vue')
  },
  {
    path: '/categories/:parentCatId',
    name: 'categories',
    meta: { title: 'Категории' },
    component: () => import('../views/CategoriesView.vue')
  },
  {
    path: '/search/products',
    name: 'kw-products-search',
    meta: { title: 'Поиск товаров' },
    component: () => import('../views/KwProdsSearchView.vue')
  },
  {
    path: '/search/categories',
    name: 'categories-search',
    meta: { title: 'Поиск категорий' },
    component: () => import('../views/CategoriesSearchView.vue')
  },
  {
    path: '/groups',
    name: 'groups',
    meta: { title: 'Группы товаров' },
    component: () => import('../views/GroupsView.vue')
  },
  {
    path: '/group/:groupId',
    name: 'group',
    meta: { title: 'Группа товаров'},
    component: () => import('../views/GroupView.vue')
  },
  {
    path: '/login',
    name: 'login',
    meta: { title: 'Вход в систему', layout: 'AuthLayout' },
    component: LoginView
  },
  {
    path: '/register',
    name: 'register',
    meta: { title: 'Регистрация', layout: 'AuthLayout' },
    component: RegisterView
  },
  {
    path: '/register-sms',
    name: 'register-sms',
    meta: { title: 'Смс-подтверждение регистрации' },
    component: () => import('../views/auth/RegisterSmsView.vue')
  },
  {
    path: '/generate-api-key',
    name: 'generate-api-key',
    meta: { title: 'Генерация ключа' },
    component: () => import('../views/GenerateApiKey.vue')
  },
  {
    path: '/edit-wb-token',
    name: 'edit-wb-token',
    meta: { title: 'Редактирование токенов wb' },
    component: () => import('../views/EditWbToken.vue')
  },
  {
    path: '/account',
    name: 'account',
    meta: { title: 'Личный кабинет' },
    component: () => import('../views/UserAccount.vue')
  },
  {
    path: "/:catchAll(.*)",
    name: "404",
    meta: { title: '404: страница не найдена' },
    component: () => import('../views/NotFoundView.vue')
  }
]

const router = createRouter({
  history: createWebHistory("/app/"),
  routes
})

const DEFAULT_TITLE = 'Заголовок по умолчанию';
router.afterEach((to) => {
  document.title = to.meta.title || DEFAULT_TITLE;
});

export default router
