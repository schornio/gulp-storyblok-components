'use strict';

const endpoint = 'https://api.storyblok.com/v1/spaces';

const request = require('request-promise-native');
const timeout = require('./timeout');
const escapeCSVString = require('./escapeCSVString');

class StoryblokManager {

  constructor (spaceId, token) {

    this.spaceId = spaceId;
    this.token = token;

  }

  async getComponents () {

    const response = await request({

      json: true,

      method: 'GET',
      uri: `${endpoint}/${this.spaceId}/components`,

      headers: {
        'Authorization': this.token
      },

    });

    await timeout(334); // wait 1/3 sec (see: https://www.storyblok.com/docs/management-api/authentication#rate-limits)

    let components = new Map();

    for (const component of response.components) {

      components.set(component.name, component);

    }

    return components;

  }

  async createComponent (component) {

    await request({

      json: true,

      method: 'POST',
      uri: `${endpoint}/${this.spaceId}/components`,

      body: {
        component,
      },

      headers: {
        'Authorization': this.token
      },

    });

    await timeout(334); // wait 1/3 sec (see: https://www.storyblok.com/docs/management-api/authentication#rate-limits)

  }

  async updateComponent (componentId, component) {

    await request({

      json: true,

      method: 'PUT',
      uri: `${endpoint}/${this.spaceId}/components/${componentId}`,

      body: {
        component,
      },

      headers: {
        'Authorization': this.token
      },

    });

    await timeout(334); // wait 1/3 sec (see: https://www.storyblok.com/docs/management-api/authentication#rate-limits)

  }

  async deleteComponent (componentId) {

    await request({

      method: 'DELETE',
      uri: `${endpoint}/${this.spaceId}/components/${componentId}`,

      headers: {
        'Authorization': this.token
      },

    });

  }

  async getDatasources () {

    const response = await request({

      json: true,

      method: 'GET',
      uri: `${endpoint}/${this.spaceId}/datasources`,

      headers: {
        'Authorization': this.token
      },

    });

    await timeout(334); // wait 1/3 sec (see: https://www.storyblok.com/docs/management-api/authentication#rate-limits)

    let datasources = new Map();

    for (const datasource of response.datasources) {

      datasources.set(datasource.slug, datasource);

    }

    return datasources;

  }

  async createDatasource (datasourceContainer) {

    const datasource = {
      name: datasourceContainer.name,
      slug: datasourceContainer.slug,
    };

    const response = await request({

      json: true,

      method: 'POST',
      uri: `${endpoint}/${this.spaceId}/datasources`,

      body: {
        datasource,
      },

      headers: {
        'Authorization': this.token
      },

    });

    await timeout(334); // wait 1/3 sec (see: https://www.storyblok.com/docs/management-api/authentication#rate-limits)

    if (datasourceContainer.entries) {

      let datasourceId = response.datasource.id;
      await this.createDatasourceEntries(datasourceId, datasourceContainer);

    }

  }

  async createDatasourceEntries (datasource_id, datasourceContainer) {

    let csv = datasourceContainer.entries
      .map((entry) =>
        `${escapeCSVString(entry.name)},${escapeCSVString(entry.value)}\n`
      ).join('');

    csv = `name,value\n${csv}`;

    await request({

      json: true,

      method: 'POST',
      uri: `${endpoint}/${this.spaceId}/datasource_entries/import`,

      body: {
        datasource_id,
        csv,
      },

      headers: {
        'Authorization': this.token
      },

    });

  }

  async deleteDatasource (datasourceId) {

    await request({

      json: true,

      method: 'DELETE',
      uri: `${endpoint}/${this.spaceId}/datasources/${datasourceId}`,

      headers: {
        'Authorization': this.token
      },

    });

    await timeout(334); // wait 1/3 sec (see: https://www.storyblok.com/docs/management-api/authentication#rate-limits)

  }

}

module.exports = StoryblokManager;
