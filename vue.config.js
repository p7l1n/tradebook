const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  devServer: {
    https: true,
  },
  transpileDependencies: true,
  css: {
    loaderOptions: {
      sass: {
        additionalData: `
          @import "@/assets/styles/colors.scss";
          @import "@/assets/styles/base.scss";
          @import "@/assets/styles/_fonts.scss";
          @import "@/assets/styles/_element-ui.scss";
        `,
      },
    },
  },
});
