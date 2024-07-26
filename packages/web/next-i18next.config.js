const HttpBackend = require("i18next-http-backend/cjs");
const ChainedBackend = require("i18next-chained-backend").default;
const LocalStorageBackend = require("i18next-localstorage-backend").default;

const isClientSide = typeof window !== "undefined";
const isDev = process.env.NODE_ENV === "development";

module.exports = {
  backend: {
    backendOptions: [
      { expirationTime: 60 * 60 * 1000 },
      {
        /* loadPath: 'https:// somewhere else' */
      },
    ], // 1 hour
    backends: isClientSide ? [LocalStorageBackend, HttpBackend] : [],
  },
  debug: isDev,
  i18n: {
    defaultLocale: "en",
    locales: ["en", "zh", "hi", "es", "de", "fr", "ru", "ja", "ko", "vi"],
    localeDetection: false,
  },
  reloadOnPrerender: isDev,
  localePath: !isClientSide
    ? require("path").resolve("./public/locales")
    : "/locales",
  serializeConfig: false,
  use: isClientSide ? [ChainedBackend] : [],
};
