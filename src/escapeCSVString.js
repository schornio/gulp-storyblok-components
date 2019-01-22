'use strict';

module.exports = (bareString) => {

  if (bareString.match(/[",]/)) {

    let csvString = bareString.replace(/"/g, '""');
    return `"${csvString}"`;

  }

  return bareString;

};
