import { cp, mkdir, rm } from 'fs/promises';
import { existsSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(scriptDir, '..');
const sourceDir = resolve(repoRoot, 'downloads');
const targetDir = resolve(repoRoot, 'apps/site/public/downloads');

async function main() {
  if (!existsSync(sourceDir)) {
    console.warn(`No downloads directory found at ${sourceDir}. Skipping sync.`);
    return;
  }

  await rm(targetDir, { recursive: true, force: true });
  await mkdir(targetDir, { recursive: true });
  await cp(sourceDir, targetDir, { recursive: true });
  console.log(`Synced downloads → ${targetDir}`);
}

main().catch((error) => {
  console.error('Failed to sync downloads:', error);
  process.exit(1);
});
