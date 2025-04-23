import withPWA from 'next-pwa';

const nextConfig = {
  reactStrictMode: true,
  // Other Next.js config here...
};

export default withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development', // Disable in dev mode
})(nextConfig);
