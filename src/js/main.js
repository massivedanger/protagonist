'use strict';

import $ from 'jquery';
import _ from 'lodash';
import Story from './story';

window.$ = $;
window._ = _;

$(document).ready(() => {
  console.log('Loading Twine story...');
  var story = new Story($('tw-storydata'));
  console.log(`Playing ${story.name}...`);
  story.play();

  window.story = story;
});
