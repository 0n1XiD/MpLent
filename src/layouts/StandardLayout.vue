<template>
    <div>
        <Header />
        <div class="dashboard-wrapper">
          <Sidebar @navClick="show_help = !show_help"/>
          <div class="dashboard-content-wrapper">
            <div class="dashboard-content">
                <slot></slot>
            </div>
          </div>
        </div>
        <mp-help :show-content="show_help"/>
    </div>
</template>
  
<script>
import Header from '@/components/MpHeader.vue';
import Sidebar from '@/components/MpSidebar.vue';
import MpHelp from '@/components/MpHelp.vue';

export default {
    data() {
      return {
        show_help: false
      }
    },
    components: {
        Header,
        Sidebar,
        MpHelp
    },
    name: "StandardLayout",
};
</script>

<style lang="scss">
@import "@/assets/css/style.scss";

/* App */
#app{
  overflow-x: hidden;
}

.dashboard-wrapper {
  height: 100vh;
  width: 100vw;
  background: none;
  display: flex;
}

.dashboard-content-wrapper{
  margin-top: 70px;
  margin-left: 240px;
  height: calc(100vh - 70px);
  width: calc(100vw - 240px);
}

.dashboard-content {
  padding: 20px 40px;
  position: relative;
  overflow-y: auto;
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

@media (max-width: 768px){
  .dashboard-content-wrapper{
      width: 100%;
      margin-top: 54px;
      margin-left: 0;
      height: calc(100vh - (54px + 60px));
  }
  .dashboard-content {
    height: inherit;
    padding: 15px 20px;
  }
}

</style>