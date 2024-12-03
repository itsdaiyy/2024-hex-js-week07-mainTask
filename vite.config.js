import { resolve } from "path";

export default {
  base: "/2024-hex-js-week07-mainTask/",
  root: resolve(__dirname, "src"),
  build: {
    outDir: "../dist",
  },
  server: {
    port: 8080,
  },
};
