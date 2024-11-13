import { resolve } from "path";

export default {
  // base 的寫法：
  // base: '/Repository 的名稱/'
  base: "/2024-hex-js-week06-mainTask/",
  root: resolve(__dirname, "src"),
  build: {
    outDir: "../dist",
  },
  server: {
    port: 8080,
  },
};
