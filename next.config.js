"use strict";

const makeWithMDX = require("@next/mdx");
const rehypePrism = require("@mapbox/rehype-prism");
const withPlugins = require("next-compose-plugins");

const withMDX = makeWithMDX({
  extension: /\.mdx?$/,
  options: { rehypePlugins: [rehypePrism] },
});

module.exports = withPlugins([withMDX], {
  pageExtensions: ["md", "mdx", "api.ts", "page.tsx"],
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
