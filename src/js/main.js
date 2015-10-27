'use strict';

import Story from './story';
import $ from 'jquery';

$(document).ready(() => {
  console.log('Loading Twine story...');
  var story = new Story($('tw-storydata'));
  console.log(`Playing ${story.name}...`);
  story.play();

  window.story = story;

  $('a[href^=#passage]').on('click', (e) => {
    const url = e.target.href;
    const passageID = url.split('#passage:')[1];
    try {
      story.goToPassage(passageID);
      e.preventDefault();
    } catch (err) {
      console.error(err);
    }
  });
});
