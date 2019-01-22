'use strict';

const StoryblokManager = require('./StoryblokManager');

class StoryblokDatasourceSync {

  constructor (spaceId, token) {

    this.manager = new StoryblokManager(spaceId, token);

    this.onFile = this.onFile.bind(this);
    this.onEnd = this.onEnd.bind(this);

    this.datasourceContainers = new Map();

  }

  onFile (file, encoding, callback) {

    const datasourceContainer = JSON.parse(file.contents.toString());

    this.datasourceContainers.set(datasourceContainer.slug, datasourceContainer);

    callback();

  }

  async onEnd (callback) {

    const remoteDatasources = await this.manager.getDatasources();

    for (const [ datasourceSlug, datasourceContainer ] of this.datasourceContainers.entries()) {

      const remoteDatasource = remoteDatasources.get(datasourceSlug);

      if (remoteDatasource) {

        await this.manager.deleteDatasource(remoteDatasource.id);

      }

      await this.manager.createDatasource(datasourceContainer);

      console.log(`Created datasource "${datasourceSlug}"`); // eslint-disable-line no-console

    }

    callback();

  }

}

module.exports = StoryblokDatasourceSync;
