#! /usr/bin/env node
// @flow
import randomWord from 'random-word';
import prog from 'caporal';
import fs from 'fs';
import path from 'path';
import deployCommand from './deploy';

const packageJson = fs.readFileSync(
  path.resolve(__dirname, '../package.json'),
  'utf8',
);

prog
  .version(JSON.parse(packageJson).version)
  .argument('<directory>', 'Directory to deploy e.g. ./build')
  .argument(
    '[domain]',
    'Domain to depoly to e.g. domain.com',
    null,
    [randomWord(), randomWord(), Date.now()].join('-'),
  )
  .action(async args => {
    try {
      await deployCommand(args);
      process.exit(0);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      process.exit(1);
    }
  });

prog.parse(process.argv);
