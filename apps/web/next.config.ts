import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "portal.asfagro.com" },
      { protocol: "http", hostname: "localhost", port: "1337" },
    ],
    // On this shared-hosting box, Next's on-the-fly image resizing
    // (Sharp) is CPU/memory constrained enough that the FIRST request
    // for a given image size can time out and show a broken image —
    // it then works after a reload because the resized version got
    // cached anyway. Serving the original files directly avoids the
    // resize step (and its failure mode) entirely.
    unoptimized: true,
  },
};

export default withNextIntl(nextConfig);
