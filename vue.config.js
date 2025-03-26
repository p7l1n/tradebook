const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
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
