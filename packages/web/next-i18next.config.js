const isBrowser = typeof window !== "undefined";
const isDev = process.env.NODE_ENV === "development";

module.exports = {
  debug: isDev,
  i18n: {
    defaultLocale: "en",
    locales: ["en", "zh", "hi", "es", "de", "fr", "ru", "ja", "ko"],
    localeDetection: false,
  },
  reloadOnPrerender: isDev,
  localePath: !isBrowser
    ? require("path").resolve("./public/locales")
    : "/locales",
  serializeConfig: false,
};
