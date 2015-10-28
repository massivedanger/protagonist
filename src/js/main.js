'use strict';

import Story from './story';
import $ from 'jquery';

$(document).ready(() => {
  console.log('Loading Twine story...');
  var story = new Story($('tw-storydata'));
  console.log(`Playing ${story.name}...`);
  story.play();

  window.story = story;
});
