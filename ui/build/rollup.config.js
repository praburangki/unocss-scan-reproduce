import { posix as path } from 'path';

import { terser } from 'rollup-plugin-terser';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { babel } from '@rollup/plugin-babel';
import alias from '@rollup/plugin-alias';
import { simple as walk } from 'acorn-walk';

import { version } from '../package.json';

const extensions = ['.ts', '.tsx', '.js', '.jsx', '.es6', '.es', '.mjs'];
const banner = `/*!
* Vinicunca v${version}
*/\n`;

export default {
  input: 'src/entry.ts',
  output: [
    {
      file: 'dist/vinicunca.esm.js',
      format: 'es',
      sourcemap: true,
      banner,
    },
    {
      file: 'dist/vinicunca.js',
      name: 'Vinicunca',
      format: 'umd',
      globals: { vue: 'Vue' },
      sourcemap: true,
      banner,
    },
    {
      file: 'dist/vinicunca.min.js',
      name: 'Vinicunca',
      format: 'umd',
      globals: { vue: 'Vue' },
      plugins: [terser({
        format: { comments: /^!/, ecma: 2015, semicolons: false },
      })],
      sourcemap: true,
      banner,
    },
  ],
  external: ['vue'],
  plugins: [
    nodeResolve({ extensions }),
    babel({
      extensions,
      babelHelpers: 'inline',
    }),
    alias({
      entries: [
        { find: /^~\/(.*)/, replacement: path.resolve(__dirname, '../src/$1') },
      ],
    }),
    {
      async buildEnd() {
        const components = Object.create(null);
        const directives = [];

        { // Components
          const { importedIds } = this.getModuleInfo(
            (await this.resolve('src/components/index.ts')).id,
          );

          await Promise.all(importedIds.map(async (id) => {
            const importFrom = path.relative(path.resolve(__dirname, '../src'), id).replace(/\.ts$/, '.mjs');
            const { ast } = this.getModuleInfo(id);
            walk(ast, {
              ExportNamedDeclaration(node) {
                node.specifiers.forEach((node) => {
                  components[node.exported.name] = importFrom;
                });
                node.declaration?.declarations.forEach((node) => {
                  components[node.id.name] = importFrom;
                });
              },
            });
          }));
        }

        this.emitFile({
          type: 'asset',
          fileName: 'json/import-map.json',
          source: JSON.stringify({
            components: Object.fromEntries(Object.entries(components).map((entry) => [entry[0], {
              from: entry[1],
            }])),
            directives,
          }, null, 2),
        });
      },
    },
  ],
};
