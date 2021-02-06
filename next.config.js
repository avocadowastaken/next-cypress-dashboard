const makeWithMDX = require("@next/mdx");

const withMDX = makeWithMDX({
  extension: /\.mdx?$/,
});

module.exports = withMDX({
  pageExtensions: ["tsx", "ts", "js", "mdx", "md"],

  async rewrites() {
    return [
      {
        source: "/runs/:path*",
        destination: "/api/cypress/runs/:path*",
      },
      {
        source: "/instances/:path*",
        destination: "/api/cypress/instances/:path*",
      },
    ];
  },
});
