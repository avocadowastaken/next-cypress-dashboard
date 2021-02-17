const { cypressEsbuildPreprocessor } = require("cypress-esbuild-preprocessor");

module.exports = (on) => {
  on("file:preprocessor", cypressEsbuildPreprocessor());
};
