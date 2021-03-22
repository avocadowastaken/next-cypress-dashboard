"use strict";

module.exports = (api) => {
  const target = api.caller((caller) => !!caller && caller.target);

  api.cache(() => [target].join(","));

  return {
    presets: ["next/babel"],
    plugins: [
      target === "web" && [
        "babel-plugin-direct-import",
        {
          modules: [
            "@material-ui/lab",
            "@material-ui/core",
            "@material-ui/icons",
          ],
        },
      ],
    ].filter(Boolean),
  };
};
