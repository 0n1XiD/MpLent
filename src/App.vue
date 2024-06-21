<template>
    <div id="app">
        <AuthLayout v-if="this.$route.meta.layout">
          <router-view/>
        </AuthLayout>
        <StandardLayout v-else>
          <router-view/>
        </StandardLayout>
    </div>
</template>

<script>
import AuthLayout from './layouts/AuthLayout.vue';
import StandardLayout from './layouts/StandardLayout.vue';

export default {
  name: "App",
  components: {
    AuthLayout,
    StandardLayout
  }
};
</script>

<style lang="scss">
@import "@/assets/css/style.scss";

/* App */
#app{
  overflow-x: hidden;
}

#app {
  font-family: 'Gotham Pro', 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
nav {
  padding: 30px;
}
nav a {
  font-weight: bold;
  color: #2c3e50;
}
nav a.router-link-exact-active {
  color: #42b983;
}
/* Auth form */
.authForm {
  display: inline-block;
  max-width: 350px;
  text-align: left;
}
.authForm > div {
  margin-bottom: 15px;
}
.authForm .errors {
  color: red;
}

.searchForm {
  display: inline-block;
  max-width: 700px;
  min-width: 700px;
  text-align: center;
}

</style>
