const fs = require('fs');
const path = require('path');

const libs = [
  { name: '@pms/data-access', dist: 'dist/libs/data-access' },
  { name: '@pms/shared-kernel', dist: 'dist/libs/shared-kernel' },
  { name: '@pms/shared-types', dist: 'dist/libs/shared-types' },
  { name: '@pms/feature-auth', dist: 'dist/libs/feature-auth' },
  { name: '@pms/feature-financial', dist: 'dist/libs/feature-financial' },
  { name: '@pms/feature-hobbies', dist: 'dist/libs/feature-hobbies' },
  { name: '@pms/feature-subscription', dist: 'dist/libs/feature-subscription' },
];

libs.forEach(lib => {
  const packageJson = {
    name: lib.name,
    version: '0.0.1',
    private: true,
    main: './src/index.js',
    types: './src/index.d.ts',
  };
  const packageJsonPath = path.join(__dirname, '..', lib.dist, 'package.json');
  fs.mkdirSync(path.dirname(packageJsonPath), { recursive: true });
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log(`Generated ${packageJsonPath}`);
});
