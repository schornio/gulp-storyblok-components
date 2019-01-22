#!/usr/bin/env node
'use strict';

const { argv } = require('yargs');
const StoryblokManager = require('./StoryblokManager');

async function main () {

  let manager = new StoryblokManager(argv.space, argv.token);
  let componentsMap = await manager.getComponents();
  let componens = Array.from(componentsMap.values());

  let componensJSON = JSON.stringify(componens, null, '  ');

  console.log(componensJSON); // eslint-disable-line no-console

}

main();
