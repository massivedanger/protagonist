'use strict';

import _ from 'lodash';
import $ from 'jquery';
import toml from 'toml';

class Helpers {
  constructor(story) {
    this.story = story;
    this.exposed = [
      'link',
      'showLink',
      'show',
      'goTo',
      'random',
      'randomNumber',
      'toggleHeader',
      'toggleFooter',
      'toggleDarkTheme',
      'state',
      'saveLink',
      'restoreLink',
      'backLink',
      'forwardLink',
      'config',
      'buildLink',
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
    object.toml = toml;

    return object;
  }

  get state() {
    return this.story.state;
  }

  link(text, passage) {
    return this.buildLink({
      text: text,
      classes: ['passage-link'],
      data: {
        history: (options.history || true),
        passage: passage
      }
    });
  }

  showLink(text, passage) {
    return this.buildLink({
      text: text,
      classes: ['passage-show-link'],
      data: {
        passage: passage,
        show: true
      }
    });
  }

  saveLink(text = 'Save') {
    return this.buildLink({
      text: text,
      classes: ['save-link']
    });
  }

  restoreLink(text = 'Restore') {
    return this.buildLink({
      text: text,
      classes: ['restore-link']
    });
  }

  backLink(text = 'Back') {
    return this.buildLink({
      text: text,
      classes: ['back-link']
    });
  }

  forwardLink(text = 'Forward') {
    return this.buildLink({
      text: text,
      classes: ['forward-link']
    });
  }

  buildLink(options = {}) {
    var link = $('<a></a>')
      .attr('href', options.href || 'javascript:void(0)')
      .attr('class', options.classes ? options.classes.join(' ') : 'link')
      .html(options.text);

    if (options.data) {
      for (var key in options.data) {
        link.attr(`data-${key}`, options.data[key]);
      }
    }

    return link.prop('outerHTML');
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

  toggleHeader() {
    $('#header').toggleClass('hidden');
  }

  toggleFooter() {
    $('#footer').toggleClass('hidden');
  }

  toggleDarkTheme() {
    $('body').toggleClass('dark');
    this.story.config.darkTheme = $('body').hasClass('dark');
  }

  get config() {
    return this.story.config;
  }
}

export default Helpers;