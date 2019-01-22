#!/usr/bin/env node
'use strict';

const { argv } = require('yargs');
const StoryblokManager = require('./StoryblokManager');

async function main () {

  let manager = new StoryblokManager(argv.space, argv.token);
  let datasourceMap = await manager.getDatasources();
  let datasources = Array.from(datasourceMap.values());

  let datasourcesJSON = JSON.stringify(datasources, null, '  ');

  console.log(datasourcesJSON); // eslint-disable-line no-console

}

main();
