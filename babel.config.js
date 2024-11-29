module.exports = {
  presets: ["babel-preset-expo"],
  plugins: [
    ["react-native-reanimated/plugin"],
    [
      "module:react-native-dotenv",
      {
        moduleName: "@env", // this is how you'll import variables
        path: ".env", // point to your .env file
        safe: false, // set to true if you want stricter type checking
        allowUndefined: true, // allow undefined environment variables
      },
    ],
  ],
};
