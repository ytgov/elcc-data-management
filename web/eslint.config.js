// https://github.com/typescript-eslint/typescript-eslint/issues/251
export default {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:vue/vue3-recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  overrides: [],
  parser: "vue-eslint-parser",
  parserOptions: {
    ecmaVersion: "latest",
    extraFileExtensions: [".vue"],
    parser: "@typescript-eslint/parser",
    tsconfigRootDir: __dirname,
    project: ["./tsconfig.node.json", "./tsconfig.json"],
    sourceType: "module",
  },
  plugins: ["vue", "@typescript-eslint"],
  rules: {},
}
