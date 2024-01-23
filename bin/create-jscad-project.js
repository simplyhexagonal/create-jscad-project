#!/usr/bin/env node

// Usage: npx create-my-template my-app

const spawn = require('cross-spawn');
const fs = require('fs');
const path = require('path');
const { cwd } = require('process');

// The first argument will be the project name.
const projectName = process.argv[2];

// Create a project directory with the project name.
const currentDir = cwd();
const projectDir = path.resolve(currentDir, projectName);
fs.mkdirSync(projectDir, { recursive: true });

// A common approach to building a starter template is to
// create a `template` folder which will house the template
// and the files we want to create.
const templateDir = path.resolve(__dirname, '../template');
fs.cpSync(templateDir, projectDir, { recursive: true });

const projectPackageJson = require(path.join(projectDir, 'package.json'));

// Update the project's package.json with the new project name
projectPackageJson.name = projectName;

fs.writeFileSync(
  path.join(projectDir, 'package.json'),
  JSON.stringify(projectPackageJson, null, 2)
);

// Run `npm install` in the project directory to install
// the dependencies. We are using a third-party library
// called `cross-spawn` for cross-platform support.
// (Node has issues spawning child processes in Windows).
spawn.sync('npm', ['install'], { stdio: 'inherit', cwd: projectDir });

console.log('\n🎉 Success! Your new project is ready.\n');
console.log(`Created ${projectName} at ${projectDir}\n`);
console.log(`To get started you can now run:\n\ncode ${projectDir}\n`);
