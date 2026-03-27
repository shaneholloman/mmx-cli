import { $ } from 'bun';
import { createHash } from 'crypto';
import { readFileSync, writeFileSync } from 'fs';

const VERSION = process.env.VERSION ?? 'dev';

const targets = [
  { bunTarget: 'bun-linux-x64',         platform: 'linux-x64',        output: 'minimax-linux-x64',        archive: 'minimax-linux-x64.tar.gz' },
  { bunTarget: 'bun-linux-x64-musl',    platform: 'linux-x64-musl',   output: 'minimax-linux-x64-musl',   archive: 'minimax-linux-x64-musl.tar.gz' },
  { bunTarget: 'bun-linux-arm64',       platform: 'linux-arm64',      output: 'minimax-linux-arm64',      archive: 'minimax-linux-arm64.tar.gz' },
  { bunTarget: 'bun-linux-arm64-musl',  platform: 'linux-arm64-musl', output: 'minimax-linux-arm64-musl', archive: 'minimax-linux-arm64-musl.tar.gz' },
  { bunTarget: 'bun-darwin-x64',        platform: 'darwin-x64',       output: 'minimax-darwin-x64',       archive: 'minimax-darwin-x64.tar.gz' },
  { bunTarget: 'bun-darwin-arm64',      platform: 'darwin-arm64',     output: 'minimax-darwin-arm64',     archive: 'minimax-darwin-arm64.tar.gz' },
  { bunTarget: 'bun-windows-x64',       platform: 'windows-x64',      output: 'minimax-windows-x64.exe',  archive: 'minimax-windows-x64.zip' },
];

function sha256(path: string): string {
  return createHash('sha256').update(readFileSync(path)).digest('hex');
}

console.log(`Building minimax-cli ${VERSION}...\n`);

const manifest: {
  version: string;
  platforms: Record<string, { archive: string; checksum: string }>;
} = { version: VERSION, platforms: {} };

for (const { bunTarget, platform, output, archive } of targets) {
  const outPath = `dist/${output}`;
  const archivePath = `dist/${archive}`;
  process.stdout.write(`  ${output}...`);
  await $`bun build src/main.ts \
    --compile \
    --minify \
    --target ${bunTarget} \
    --outfile ${outPath} \
    --define "process.env.CLI_VERSION='${VERSION}'"`.quiet();

  // Compress: tar.gz for unix, zip for windows
  if (archive.endsWith('.zip')) {
    await $`zip -j ${archivePath} ${outPath}`.quiet();
  } else {
    await $`tar -czf ${archivePath} -C dist ${output}`.quiet();
  }

  manifest.platforms[platform] = { archive, checksum: sha256(archivePath) };
  console.log(' ✓');
}

writeFileSync('dist/manifest.json', JSON.stringify(manifest, null, 2));
console.log('  manifest.json ✓');
console.log(`\nDone. ${targets.length} archives in dist/`);
