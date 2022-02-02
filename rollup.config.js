import path from "path";
import { terser } from "rollup-plugin-terser";
import css from "rollup-plugin-postcss";
import image from "@rollup/plugin-image";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import {
  chromeExtension,
  // simpleReloader,
} from "rollup-plugin-chrome-extension";
import { emptyDir } from "rollup-plugin-empty-dir";
import replace from "@rollup/plugin-replace";
import zip from "rollup-plugin-zip";

const isProduction = process.env.NODE_ENV === "production";

const getConfig = {
  input: `src/manifest.v3.ts`,
  output: {
    dir: "dist/",
    format: "esm",
    chunkFileNames: path.join("chunks", "[name].js"),
  },
  plugins: [
    replace({
      "process.env.NODE_ENV": JSON.stringify(
        isProduction ? "production" : "development"
      ),
      preventAssignment: true,
    }),
    chromeExtension(),
    // simpleReloader(),
    resolve(),
    commonjs({
      include: "node_modules/**",
    }),
    typescript(),
    css(),
    image(),
    emptyDir(),
    isProduction && terser(),
    isProduction && zip({ dir: "dist/" }),
  ],
  // * Ignore Warnings
  onwarn: (w) => {
    w;
  },
};

export default getConfig;
