module.exports = {
  productionSourceMap: true,
  configureWebpack: (config) => {
    config.devtool = "source-map";
  },

  pluginOptions: {
    webpack: {
      dir: ["./webpack"],
    },
  },
};
