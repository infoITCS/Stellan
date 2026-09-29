import { readdir, readFile } from 'node:fs/promises';
import { extname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = fileURLToPath(new URL('..', import.meta.url));
const sourceRoots = ['src', 'scripts', 'tests'];
const extensions = new Set(['.ts', '.tsx', '.mjs', '.js', '.json', '.css', '.html', '.svg', '.webmanifest']);

async function collect(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const target = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await collect(target));
    else if (extensions.has(extname(entry.name)) || entry.name.endsWith('.webmanifest')) files.push(target);
  }
  return files;
}

const files = [];
for (const root of sourceRoots) files.push(...await collect(join(projectRoot, root)));
files.push(join(projectRoot, 'package.json'), join(projectRoot, 'tsconfig.json'), join(projectRoot, 'vite.config.ts'), join(projectRoot, 'index.html'));

const forbiddenDependencies = ['react-router', '@reach/router', 'next/router', 'lucide-react', '@heroicons', 'framer-motion', 'bootstrap', 'tailwindcss', 'styled-components', 'react-helmet', 'next-seo', 'analytics'];
const failures = [];

for (const file of files) {
  const content = await readFile(file, 'utf8');
  const label = relative(projectRoot, file);
  if (/^\s*\/\//m.test(content) || /^\s*\/\*/m.test(content)) failures.push(`${label} contains a comment`);
  if (file.endsWith('package.json')) {
    for (const dependency of forbiddenDependencies) {
      if (content.toLowerCase().includes(dependency)) failures.push(`${label} references forbidden dependency ${dependency}`);
    }
  }
  if (/<(?:script|img|link)\b[^>]*(?:src|href)=["']https?:\/\//i.test(content)) failures.push(`${label} contains an external asset request`);
}

if (failures.length > 0) {
  process.stderr.write(`${failures.join('\n')}\n`);
  process.exitCode = 1;
} else {
  process.stdout.write(`Lint checks passed for ${files.length} files.\n`);
}
