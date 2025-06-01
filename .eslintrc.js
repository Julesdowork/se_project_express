module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: ["eslint:recommended", "airbnb-base", "prettier"],
  overrides: [
    {
      env: {
        node: true,
      },
      files: [".eslintrc.{js,cjs}"],
      parserOptions: {
        sourceType: "script",
      },
    },
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {
    "no-console": ["warn", { allow: ["error"] }],
    "no-underscore-dangle": ["error", { allow: ["_id"] }],
    "no-param-reassign": [
      "error",
      { props: true, ignorePropertyModificationsFor: ["user", "req"] },
    ],
    "no-unused-vars": ["error", { argsIgnorePattern: "next" }],
  },
};
