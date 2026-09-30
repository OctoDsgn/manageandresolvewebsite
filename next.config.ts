import type { NextConfig } from "next";

// Allow next/image to optimise media uploaded to the headless WordPress CMS.
const wordpressUrl = process.env.WORDPRESS_URL ? new URL(process.env.WORDPRESS_URL) : null;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: wordpressUrl
      ? [
          {
            protocol: wordpressUrl.protocol.replace(":", "") as "http" | "https",
            hostname: wordpressUrl.hostname,
            port: wordpressUrl.port,
            pathname: "/wp-content/uploads/**",
          },
        ]
      : [],
  },
};

export default nextConfig;
