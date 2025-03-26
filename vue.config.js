const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  devServer: {
    proxy: {
      '^/api': {
        target: 'http://194.87.146.150:5000',
        ws: true,
        changeOrigin: true
      },
    }
  },
  transpileDependencies: true,
  css: {
    loaderOptions: {
      sass: {
        additionalData: `
          @import "@/assets/styles/colors.scss";
          @import "@/assets/styles/base.scss";
        `,
      },
    },
  },
});
