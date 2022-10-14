import path from 'path';
import fs from 'fs/promises';
import { readFileSync } from 'fs';

import fg from 'fast-glob';
import dts from 'rollup-plugin-dts';
import alias from '@rollup/plugin-alias';
import mm from 'micromatch';

import importMap from '../dist/json/import-map.json';

function createTypesConfig({ input, output, renderChunk, filter }) {
  input = `types-temp/${input}`;
  let files = fg.sync(input);

  if (filter) {
    files = filter(files);
  }

  return files.map((file) => {
    const outputFile = output.replace('*', mm.capture(input, file)[0]);

    return {
      input: file,
      output: [{ file: outputFile, format: 'es' }],
      plugins: [
        dts(),
        alias({
          entries: [
            { find: /^~\/(.*)/, replacement: path.resolve(__dirname, '../types-temp/$1') },
          ],
        }),
        renderChunk ? { renderChunk } : undefined,
      ],
    };
  });
}

export default [
  createTypesConfig({
    input: 'init.d.ts',
    output: 'lib/index.d.ts',
    renderChunk: async (code) => {
      const components = Object.keys(importMap.components).map((name) => (
        `    ${name}: typeof import('vinicunca/components')['${name}']`
      )).join('\n');

      const shims = (await fs.readFile(path.resolve(__dirname, '../src/shims.d.ts'), { encoding: 'utf8' }))
        .replace(/^\s+\/\/ @skip-build\s+.*$/gm, '')
        .replace(/^\s+\/\/ @generate-components$/gm, components);

      return code += `\n\n${shims}`;
    },
  }),

  createTypesConfig({ input: 'entry.d.ts', output: 'dist/vinicunca.d.ts' }),

  createTypesConfig({ input: 'components/index.d.ts', output: 'lib/components/index.d.ts' }),

  createTypesConfig({
    input: 'components/*/index.d.ts',
    output: 'lib/components/*/index.d.ts',
    filter: (files) => {
      const index = readFileSync(path.resolve(__dirname, '../src/components/index.ts'), { encoding: 'utf8' });
      const block = Array.from(index.matchAll(/^\/\/ export \* from '\.\/(.*)'$/gm), (m) => m[1]);
      return files.filter((file) => !block.some((name) => file.includes(`/${name}/`)));
    },
  })
].flat();
