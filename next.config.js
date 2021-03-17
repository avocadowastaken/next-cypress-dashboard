const makeWithMDX = require("@next/mdx");
const rehypePrism = require("@mapbox/rehype-prism");
const makeWithPrismaPlugin = require("next-prisma-plugin");
const makeWithBundleAnalyzer = require("@next/bundle-analyzer");

const withMDX = makeWithMDX({
  extension: /\.mdx?$/,
  options: { rehypePlugins: [rehypePrism] },
});
const withBundleAnalyzer = makeWithBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const withPrismaPlugin = makeWithPrismaPlugin();

module.exports = (phase, defaultConfig) => {
  let config = withPrismaPlugin(phase, defaultConfig);

  config = withMDX(config);
  config = withBundleAnalyzer(config);

  return {
    ...config,
    pageExtensions: ["tsx", "ts", "mdx", "md"],
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
  };
};
