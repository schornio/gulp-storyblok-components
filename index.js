'use strict';

const through = require('through2');

const StoryblokComponentSync = require('./src/StoryblokComponentSync');
const StoryblokDatasourceSync = require('./src/StoryblokDatasourceSync');

function pushComponents (spaceId, token) {

  const componentSync = new StoryblokComponentSync(spaceId, token);
  const stream = through.obj(
    componentSync.onFile,
    componentSync.onEnd
  );
  return stream;

}

function pushDatasources (spaceId, token) {

  const datasourceSync = new StoryblokDatasourceSync(spaceId, token);
  const stream = through.obj(
    datasourceSync.onFile,
    datasourceSync.onEnd
  );
  return stream;

}

module.exports = {

  pushComponents,
  pushDatasources,

};
