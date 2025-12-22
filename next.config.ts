import withPWAInit from "@ducanh2912/next-pwa";

const isDev = process.env.NODE_ENV === "development";

const withPWA = withPWAInit({
  dest: "public",
  disable: false,
  reloadOnOnline: !isDev,
  aggressiveFrontEndNavCaching: !isDev,
  cacheOnFrontEndNav: !isDev,
  
  workboxOptions: {
    disableDevLogs: true, 
    exclude: isDev 
      ? [/middleware-manifest\.json$/, /_next\/static\/development\/.*/, /_next\/static\/webpack\/.*/] 
      : [],
  },
});

export default withPWA({
  reactStrictMode: true,
});