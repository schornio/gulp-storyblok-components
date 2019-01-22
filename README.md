# gulp-storyblok

Push `components` and `datasources` to storyblok

## Usage

Push `components`:

```javascript

const config = require('path-to-config.json');
const { task, src } = require('gulp');
const { pushComponents } = require('@schornio/gulp-storyblok');


task('push-components', () => {
  return src('path-to-components-config.json')
    .pipe(pushComponents(
      config.storyblok.spaceId,
      config.storyblok.managementToken
    ));
});
```

Push `datasources`:

```javascript

const config = require('path-to-config.json');
const { task, src } = require('gulp');
const { pushDatasources } = require('@schornio/gulp-storyblok');


task('push-datasources', () => {
  return src('path-to-datasources-config.json')
    .pipe(pushDatasources(
      config.storyblok.spaceId,
      config.storyblok.managementToken
    ));
});
```
