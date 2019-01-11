'use strict';

const endpoint = 'https://api.storyblok.com/v1/spaces';

const request = require('request-promise-native');
const timeout = require('./timeout');

class StoryblokComponentManager {

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

  async deleteComponent(componentId) {

    await request({

      method: 'DELETE',
      uri: `${endpoint}/${this.spaceId}/components/${componentId}`,

      headers: {
        'Authorization': this.token
      },

    });

  }

}

module.exports = StoryblokComponentManager;
