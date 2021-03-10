// const package = [
//   "vue-modules",
//   "vue",
//   "normal-modules",
//   "normal"
// ];

module.exports = {
  css: {
    loaderOptions: {
      sass: {
        prependData: `@import "@/assets/sass/variables.scss";`
      }
    }
  }
  // chainWebpack: config => {

  //   // SVG config
  //   const svgRule = config.module.rule('svg');
  //   svgRule.uses.clear();
  //   svgRule
  //     .use('babel-loader')
  //     .loader('babel-loader')
  //     .end()
  //     .use('vue-svg-loader')
  //     .loader('vue-svg-loader');

  //   //SASS config
  //   package.forEach(match => {
  //     config.module.rule('sass')
  //     .oneOf(match)
  //     .use('sass-loader')
  //     .tap(opt => Object
  //       .assign(opt, {
  //         data: `@import '@/assets/sass/variables.scss'`
  //       })
  //     )
  //   });
  // }
};
