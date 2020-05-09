module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: ["airbnb-base", "plugin:prettier/recommended"],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
  },
  rules: {
    // "no-console": "warn",
    // "promise/always-return": "warn",
    // "promise/no-return-wrap": "warn",
    // "promise/param-names": "warn",
    // "promise/catch-or-return": "warn",
    // "promise/no-native": "off",
    // "promise/no-nesting": "warn",
    // "promise/no-promise-in-callback": "warn",
    // "promise/no-callback-in-promise": "warn",
    // "promise/no-return-in-finally": "warn",
    // "prefer-arrow-callback": "warn",
  },
};
