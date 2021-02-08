const makeWithMDX = require("@next/mdx");
const makeWithPrismaPlugin = require("next-prisma-plugin");

const withMDX = makeWithMDX({
  extension: /\.mdx?$/,
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
