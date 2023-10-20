import { defineConfig } from "rollup";
import nodeResolve from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";
import typescript from "rollup-plugin-typescript2";
import commonjs from "@rollup/plugin-commonjs";

import { uglify } from "rollup-plugin-uglify";

import pkg from "./package.json";

const extensions = [".ts"];
const noDeclarationFiles = { compilerOptions: { declaration: false } };

const babelRuntimeVersion = pkg.devDependencies["@babel/runtime"].replace(
  /^[^0-9]*/,
  ""
);

const external = [...Object.keys(pkg.dependencies || {})].map((name) =>
  RegExp(`^${name}($|/)`)
);

export default defineConfig([
  // CommonJS
  // {
  //   input: 'src/index.ts',
  //   output: { file: 'lib/index.js', format: 'cjs', indent: false },
  //   external,
  //   plugins: [
  //     nodeResolve({
  //       extensions
  //     }),
  //     typescript({ useTsconfigDeclarationDir: true }),
  //     babel({
  //       extensions,
  //       plugins: [
  //         ['@babel/plugin-transform-runtime', { version: babelRuntimeVersion }],
  //       ],
  //       babelHelpers: 'runtime'
  //     }),
  //     uglify()
  //   ]
  // },

  // ES
  {
    input: "src/index.ts",
    output: { file: "es/index.js", format: "es", indent: false },
    external,
    plugins: [
      nodeResolve({
        extensions,
      }),
      commonjs({
        transformMixedEsModules: true
      }),
      typescript({ tsconfigOverride: noDeclarationFiles, check: false }),
      // typescript({ tsconfigOverride: noDeclarationFiles }),
      babel({
        extensions,
        plugins: [
          [
            "@babel/plugin-transform-runtime",
            { version: babelRuntimeVersion, useESModules: true },
          ],
        ],
        babelHelpers: "runtime",
        exclude: "node_modules/**",
      }),
      uglify(),
    ],
  },
]);
