const makeWithMDX = require("@next/mdx");
const rehypePrism = require("@mapbox/rehype-prism");
const makeWithPrismaPlugin = require("next-prisma-plugin");

const withMDX = makeWithMDX({
  extension: /\.mdx?$/,
  options: { rehypePlugins: [rehypePrism] },
});

const withPrismaPlugin = makeWithPrismaPlugin();

module.exports = (phase, thing) => {
  const prismaConfig = withPrismaPlugin(phase, thing);
  const mdxConfig = withMDX(prismaConfig);

  return {
    ...mdxConfig,
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
