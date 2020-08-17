// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  globals: {
    expect: true, // Used for unit tests.
  },
  parserOptions: {
    sourceType: "module",
  },
  extends: ["prettier"],
  plugins: ["html", "prettier"],
  rules: {
    // https://eslint.org/docs/user-guide/migrating-to-4.0.0#-the-no-multi-spaces-rule-is-more-strict-by-default
    "no-multi-spaces": ["error", { ignoreEOLComments: true }],
    // Require or disallow trailing commas http://eslint.org/docs/rules/comma-dangle
    "comma-dangle": ["error", "always-multiline"],
    // Limit multiple empty lines http://eslint.org/docs/rules/no-multiple-empty-lines
    "no-multiple-empty-lines": ["error", { max: 2 }],
    // Disable padding within blocks http://eslint.org/docs/rules/padded-blocks.html
    "padded-blocks": "off",
    "prettier/prettier": ["error"],
  },
};
