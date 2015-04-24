'use strict';

import _ from 'lodash';
import $ from 'jquery';
import { Howl } from 'howler';
import toml from 'toml';

class Helpers {
  constructor(story) {
    this.story = story;
    this.exposed = [
      'story',
      'link',
      'show',
      'goTo',
      'random',
      'randomNumber',
      'wait',
      'toggleHeader',
      'toggleFooter',
      'toggleHeaderAndFooter',
      'previousPassage',
      'nextPassage',
      'state',
      'saveLink',
      'restoreLink',
      'config'
    ];
  }

  get all() {
    if (!this._all) {
      this.inject(this._all = {});
    }

    return this._all;
  }

  inject(object) {
    _.each(this.exposed, (helper) => {
      object[helper] = this[helper];
    });

    object.$ = $;
    object._ = _;
    object.Howl = Howl;
    object.toml = toml;

    return object;
  }

  get state() {
    return this.story.state
  }

  link(text, passage, options = {}) {
    var classes = ['passage-link'].concat(options.class);
    if (options.noHistory) {
      classes.push('no-history');
    }

    var history = options.history || true;

		return `<a href="javascript:void(0)" data-history="${history}" data-passage="${passage}" class="${classes.join(' ')}">${text}</a>`;
  }

  saveLink(text = 'Save', options = {}) {
    var classes = ['save-link'].concat(options.class);

		return `<a href="javascript:void(0)" class="${classes.join(' ')}">${text}</a>`;
  }

  restoreLink(text = 'Restore', options = {}) {
    var classes = ['restore-link'].concat(options.class);

		return `<a href="javascript:void(0)" class="${classes.join(' ')}">${text}</a>`;
  }

  show(passage) {
    return this.story.showPassage(passage);
  }

  goTo(passage) {
    return this.story.goToPassage(passage);
  }

  random() {
    if (arguments.length == 1) {
      return _.sample(arguments[0]);
    }
    else {
      return _.sample(arguments);
    }
  }

  randomNumber(min, max, floating = false) {
    return _.random(min, max, floating);
  }

  wait(time, callback) {
    setTimeout(callback, time);
  }

  toggleHeader() {
    $('#header').toggleClass('hidden');
  }

  toggleFooter() {
    $('#footer').toggleClass('hidden');
  }

  toggleHeaderAndFooter() {
    toggleHeader();
    toggleFooter();
  }

  get previousPassage() {
    return this.story.previousPassage;
  }

  get nextPassage() {
    return this.story.nextPassage;
  }

  get config() {
    return this.story.config;
  }
}

export default Helpers;