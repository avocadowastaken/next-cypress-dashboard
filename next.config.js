const makeWithMDX = require("@next/mdx");

const withMDX = makeWithMDX({
  extension: /\.mdx?$/,
});

module.exports = withMDX({
  pageExtensions: ["tsx", "ts", "js", "mdx", "md"],

  async rewrites() {
    return [
      {
        source: "/runs",
        destination: "/api/runs",
      },

      {
        source: "/runs/:runId/instances",
        destination: "/api/runs/:runId/instances",
      },

      {
        source: "/instances/:instanceId",
        destination: "/api/instances/:instanceId",
      },

      {
        source: "/instances/:instanceId/stdout",
        destination: "/api/instances/:instanceId/stdout",
      },
    ];
  },
});
