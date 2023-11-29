import resolve from "@rollup/plugin-node-resolve"
import includePaths from 'rollup-plugin-includepaths';
import commonjs from '@rollup/plugin-commonjs';

export default [
  {
    input: "./index.js",
    output: [
      {
        file: "../app/assets/javascripts/bard-file.js",
        format: "es",
      },
    ],
    context: "window",
    external: [
      "@rails/activestorage",
    ],
    plugins: [
      resolve(),
      includePaths({
        paths: "src",
      }),
      commonjs(),
    ]
  },
]
