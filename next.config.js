/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "localhost:5000",
      "localhost",
      "atomik-streaming.tv",
      "atomik-storage.s3.eu-central-1.amazonaws.com",
    ],
  },
};

module.exports = nextConfig;
