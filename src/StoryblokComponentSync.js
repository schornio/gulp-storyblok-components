'use strict';

const StoryblokManager = require('./StoryblokManager');

class StoryblokComponentSync {

  constructor (spaceId, token) {

    this.manager = new StoryblokManager(spaceId, token);

    this.onFile = this.onFile.bind(this);
    this.onEnd = this.onEnd.bind(this);

    this.components = new Map();

  }

  onFile (file, encoding, callback) {

    const match = file.path.match(/\/([^\/]+)\/[^\/]*$/); // eslint-disable-line no-useless-escape

    if (match) {

      const componentName = match[1];
      const component = JSON.parse(file.contents.toString());

      component.name = componentName;

      this.components.set(componentName, component);

    }

    callback();

  }

  async onEnd (callback) {

    let remoteComponents = await this.manager.getComponents();
    let localComponents = this.components;

    for (const [ componentName, localComponent ] of localComponents) {

      const remoteComponent = remoteComponents.get(componentName);

      if (remoteComponent) {

        const componentId = remoteComponent.id;
        await this.manager.updateComponent(componentId, localComponent);

        console.log(`Updated component "${componentName}"`); // eslint-disable-line no-console

      } else {

        await this.manager.createComponent(localComponent);

        console.log(`Created component "${componentName}"`); // eslint-disable-line no-console

      }

      remoteComponents.delete(componentName);

    }

    for (const [ componentName, remoteComponent ] of remoteComponents) {

      const componentId = remoteComponent.id;
      await this.manager.deleteComponent(componentId);

      console.log(`Deleted component "${componentName}"`); // eslint-disable-line no-console

    }

    callback();

  }

}

module.exports = StoryblokComponentSync;
