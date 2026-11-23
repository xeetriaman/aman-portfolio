/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Keep visited admin pages in the browser for 30 s so switching tabs back is instant.
  experimental: { staleTimes: { dynamic: 30, static: 180 } },
};
export default nextConfig;
