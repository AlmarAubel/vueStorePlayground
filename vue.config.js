module.exports = {
  configureWebpack() {
    return {
      devtool: "source-map",
    };
  },

  pluginOptions: {
    webpack: {
      dir: ["./webpack"],
    },
  },
};
