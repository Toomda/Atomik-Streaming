/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "atomik-storage.s3.eu-central-1.amazonaws.com",
        // hostname: "d3e4lv2sngpnw7.cloudfront.net",
        port: "",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "cdn.pixabay.com",
      },
    ],
  },
};

module.exports = nextConfig;
