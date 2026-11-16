import { cpSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const build = join(root, 'site', 'dist');
if (!existsSync(join(build, 'index.html'))) {
  throw new Error('Build the app first: npm --prefix site run build');
}
for (const entry of ['index.html', 'assets', 'icon.svg', 'robots.txt', 'sitemap.xml']) {
  cpSync(join(build, entry), join(root, entry), { recursive: true });
}
console.log('Copied the build to the GitHub Pages root.');
