// Dev builds get their own bundle id so they install next to the App Store version
// instead of replacing it (and its diary data).
const IS_DEV = process.env.APP_VARIANT === "development";

module.exports = ({ config }) => {
  if (!IS_DEV) return config;
  return {
    ...config,
    name: `${config.name} (dev)`,
    ios: { ...config.ios, bundleIdentifier: `${config.ios.bundleIdentifier}.dev` },
    android: { ...config.android, package: `${config.android.package}.dev` },
  };
};
