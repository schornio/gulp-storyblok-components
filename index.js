'use strict';

const through = require('through2');
const StoryblokComponentManager = require('./src/StoryblokComponentManager');


class StoryblokComponentSync {

  constructor (spaceId, token) {

    this.manager = new StoryblokComponentManager(spaceId, token);

    this.onFile = this.onFile.bind(this);
    this.onEnd = this.onEnd.bind(this);

    this.components = new Map();

  }

  onFile (file, encoding, callback) {

    const match = file.path.match(/\/([^\/]+)\/[^\/]*$/);

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

        console.log(`Updated ${componentName}`);

      } else {

        await this.manager.createComponent(localComponent);

        console.log(`Created ${componentName}`);

      }

      remoteComponents.delete(componentName);

    }

    for (const [ componentName, remoteComponent ] of remoteComponents) {

      const componentId = remoteComponent.id;
      await this.manager.deleteComponent(componentId);

      console.log(`Deleted ${componentName}`);

    }

    callback();

  }

}

module.exports = function(spaceId, token) {

  const componentSync = new StoryblokComponentSync(spaceId, token);
  const stream = through.obj(
    componentSync.onFile,
    componentSync.onEnd
  );
  return stream;

};
