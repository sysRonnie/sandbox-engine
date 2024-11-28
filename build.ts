import * as esbuild from 'esbuild'

await esbuild.build({
  entryPoints: ['src/main.ts'],
  bundle: true,
  outfile: 'src/main.js',
  platform: "browser", // Ensure it's browser-compatible
  format: "esm", // Use ES Module format
  target: "esnext", // Modern JavaScript
  minify: true, // Minify the output
  treeShaking: true,
})