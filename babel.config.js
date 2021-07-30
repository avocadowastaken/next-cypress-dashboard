"use strict";

module.exports = (api) => {
  const target = api.caller((caller) => caller.target);

  api.cache.using(() => JSON.stringify({ target }));

  const presets = ["next/babel"];
  const plugins = [];

  if (target === "web") {
    plugins.push([
      "babel-plugin-direct-import",
      {
        modules: [
          "@material-ui/lab",
          "@material-ui/core",
          "@material-ui/icons",
        ],
      },
    ]);
  }

  return { presets, plugins };
};