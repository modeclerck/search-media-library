// One IIFE bundle (a single .js file to copy into config/www/ or to ship via
// HACS), plus the demo page script (dev/).
import * as esbuild from 'esbuild';
import { readFileSync } from 'node:fs';

const serve = process.argv.includes('--serve');
// --dev : même code, mais l'élément s'appelle « search-media-library-dev » pour
// cohabiter avec la version installée par HACS. Sortie dans dist-dev/ (jamais versionnée).
const dev = process.argv.includes('--dev');
const { version } = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'));
const tag = dev ? 'search-media-library-dev' : 'search-media-library';

const shared = {
  bundle: true,
  format: 'iife',
  target: 'es2021',
  minify: !serve,
  sourcemap: serve ? 'inline' : false,
  legalComments: 'eof',
  logLevel: 'info',
  define: {
    __CARD_TAG__: JSON.stringify(tag),
    __CARD_VERSION__: JSON.stringify(dev ? `${version}-dev` : version),
  },
};

const cards = [
  { entryPoints: ['src/search-media-library.ts'], outfile: dev ? 'dist-dev/search-media-library-dev.js' : 'dist/search-media-library.js' },
];
const demos = [
  { entryPoints: ['dev/demo.ts'], outfile: 'dev/demo.js' },
];

if (serve) {
  const ctxs = await Promise.all([...cards, ...demos].map(t => esbuild.context({ ...shared, ...t })));
  await Promise.all(ctxs.map(c => c.watch()));
  // Serves the project root: the demo loads ../dist/search-media-library.js
  const { port } = await ctxs[0].serve({ servedir: '.', host: '127.0.0.1', port: 8765 });
  console.log(`Demo: http://localhost:${port}/dev/`);
} else if (dev) {
  await Promise.all(cards.map(t => esbuild.build({ ...shared, ...t })));
} else {
  await Promise.all([...cards, ...demos].map(t => esbuild.build({ ...shared, ...t })));
}
