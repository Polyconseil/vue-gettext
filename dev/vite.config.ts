import * as path from "path";

export default {
  alias: {
    "/@/": path.resolve(__dirname, "./src"),
    "/@gettext/": path.resolve(__dirname, "../src"),
  },
  optimizeDeps: {
    allowNodeBuiltins: true,
  },
};
