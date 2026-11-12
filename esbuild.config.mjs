// One IIFE bundle (a single .js file to copy into config/www/ or to ship via
// HACS), plus the demo page script (dev/).
import * as esbuild from 'esbuild';

const serve = process.argv.includes('--serve');

const shared = {
  bundle: true,
  format: 'iife',
  target: 'es2021',
  minify: !serve,
  sourcemap: serve ? 'inline' : false,
  legalComments: 'eof',
  logLevel: 'info',
};

const cards = [
  { entryPoints: ['src/search-media-library.ts'], outfile: 'dist/search-media-library.js' },
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
} else {
  await Promise.all([...cards, ...demos].map(t => esbuild.build({ ...shared, ...t })));
}
