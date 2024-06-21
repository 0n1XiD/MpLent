<template>
    <div>
        <div class="auth-wrapper">
            <div class="auth-content-wrapper">
                <div class="auth-content">
                    <slot></slot>
                </div>
            </div>
        </div>
    </div>
</template>
  
<script>
export default {
    name: "AuthLayout",
};
</script>

<style lang="scss">
@import "@/assets/css/style.scss";

/* App */

.auth-wrapper {
    height: 100vh;
    width: 100vw;
    background-image: url('@/assets/img/background.jpg');
    background-blend-mode: screen, normal;
    background-color: #AD649B;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    display: flex;
}

.auth-content-wrapper{
  height: 100vh;
  width: 100vw;
}

.auth-content {
  padding: 20px 40px;
  position: relative;
  overflow-y: auto;
  overflow-x: hidden;
}

</style>