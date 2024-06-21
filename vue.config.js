const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  css: {
    loaderOptions: {
      scss: {
        additionalData: `
          @import "~@/assets/css/vendor/reset.scss";
          @import "~@/assets/css/vendor/colors.scss";
          @import "~@/assets/css/vendor/variables.scss";
          @import "~@/assets/css/fonts.scss";
        `
      },
    }
  },
})