const { getDefaultConfig } = require("expo/metro-config");

module.exports = (() => {
    const config = getDefaultConfig(__dirname);

    const { transformer, resolver } = config;

    config.transformer = {
        ...transformer,
        babelTransformerPath: require.resolve("react-native-svg-transformer/expo"),
    };
    config.resolver = {
        ...resolver,
        assetExts: resolver.assetExts.filter((ext) => ext !== "svg"),
        sourceExts: [...resolver.sourceExts, "svg"],
    };

    config.resolver.unstable_conditionNames = ["browser", "require", "react-native"];

    // Set custom port
    config.server = {
        ...config.server,
        port: 8082, // Change this to any available port you prefer
    };

    return config;
})();
