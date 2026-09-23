import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const expectedTag = process.argv[2]

if (!/^v\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(expectedTag ?? '')) {
  console.error(
    'Usage: node scripts/validate-release.mjs vMAJOR.MINOR.PATCH[-prerelease]',
  )
  process.exit(1)
}

const packagePaths = ['core', 'react', 'vue'].map((name) =>
  resolve('packages', name, 'package.json'),
)
const packages = await Promise.all(
  packagePaths.map(async (path) => JSON.parse(await readFile(path, 'utf8'))),
)
const composerPackage = JSON.parse(
  await readFile(resolve('packages', 'laravel', 'composer.json'), 'utf8'),
)
const expectedVersion = expectedTag.slice(1)
const mismatched = packages
  .filter((pkg) => pkg.version !== expectedVersion)
  .map((pkg) => `${pkg.name}: ${pkg.version}`)
const missingLicense = packages
  .filter((pkg) => pkg.license !== 'MIT')
  .map((pkg) => `${pkg.name}: expected MIT license metadata`)

if (composerPackage.license !== 'MIT') {
  missingLicense.push(`${composerPackage.name}: expected MIT license metadata`)
}

if (missingLicense.length > 0) {
  console.error(
    `Release packages must declare MIT:\n${missingLicense.join('\n')}`,
  )
  process.exit(1)
}

if (mismatched.length > 0) {
  console.error(
    `Tag ${expectedTag} does not match package versions:\n${mismatched.join('\n')}`,
  )
  process.exit(1)
}

console.log(
  `${expectedTag} matches all ${packages.length} npm package versions.`,
)
