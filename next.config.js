/** @type {import('next').NextConfig} */


module.exports = {
  reactStrictMode: true,
  i18n: {
    locales: ['en', 'jp', 'pl'],
    defaultLocale: 'en',
  },
  images: {
    deviceSizes: [320, 420, 768, 1024, 1200],
    loader: "default",
    domains: ["res.cloudinary.com"],
  },
}
