#!/usr/bin/env node

// Usage: npx create-my-template my-app

const spawn = require('cross-spawn');
const fs = require('fs');
const path = require('path');
const { cwd } = require('process');

// Function to get named arguments
function getNamedArgs() {
  const args = {};
  process.argv
    .slice(2)
    .filter((arg) => arg.includes('='))
    .forEach((arg) => {
      const [key, value] = arg.split('=');
      args[key.replace('--', '')] = value;
    });
  return args;
}

// The first argument will be the project name.
const projectName = process.argv[2];

// if projectName is "--list-templates", list the available templates and exit
if (projectName === '--list-templates') {
  const templateDir = path.resolve(__dirname, '../templates');
  const templateNames = fs.readdirSync(templateDir);

  console.log(templateNames.join('\n'));

  process.exit(0);
}

// Create a project directory with the project name.
const currentDir = cwd();
const projectDir = path.resolve(currentDir, projectName);
fs.mkdirSync(projectDir, { recursive: true });

// Get the template name or use 'default'
const namedArgs = getNamedArgs();
const templateName = namedArgs.template || 'default';

// Copy the template
const templateDir = path.resolve(__dirname, '../templates/', templateName);
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
