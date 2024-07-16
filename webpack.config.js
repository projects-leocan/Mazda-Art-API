const path = require("path");

module.exports = {
  mode: "production",
  entry: "./app.js",
  output: {
    path: path.join(__dirname, "dist"),
    publicPath: "/",
    filename: "final.js",
  },
  target: "node",
  module: {
    rules: [
      {
        test: /\.cs$/,
        use: "raw-loader", // or another appropriate loader
      },
      {
        test: /\.html$/,
        use: "html-loader",
      },
      // Add other loaders as needed
    ],
  },
};
