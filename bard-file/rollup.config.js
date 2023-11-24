import resolve from "@rollup/plugin-node-resolve"
import includePaths from 'rollup-plugin-includepaths';
import commonjs from '@rollup/plugin-commonjs';

export default [
  {
    input: "src/bard-file.js",
    output: [
      {
        file: "dist/bard-file.js",
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
