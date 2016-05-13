'use strict';

import $ from 'jquery';
import toml from 'toml';
import _ from 'lodash';
import Passage from './passage';
import Helpers from './helpers';

class Story {
  constructor(element) {
    this.element = element;
    this.name = element.attr('name');
    this.startPassageID = parseInt(element.attr('startnode'));
    this.IFID = element.attr('ifid');
    this.creator = element.attr('creator');
    this.creatorVersion = element.attr('creator-version');

    this.history = {
      back: [],
      forward: [],
      current: null
    };

    this.state = {};
    this.currentCheckpoint = '';
    this.atCheckpoint = true;

    this.config = {
      darkTheme: false
    };

    this._findPassages();
    this._displayStyles();
    this._executeScripts();
    this._getMetaPassages();
    this._setupEvents();
    this._useConfig();
  }

  play() {
		if (localStorage.getItem(this.saveKey) == undefined || !this.restore()) {
			this.goToPassage(this.startPassageID);
      this.atCheckpoint = true;
		}
  }

  getPassage(query) {
		if (_.isNumber(query)) {
			return this.passages[query];
    }
		else if (_.isString(query)) {
			return _.findWhere(this.passages, { name: query });
    }
  }

  goToPassage(query, addToHistory = true) {
    $.event.trigger('goToPassage:before');

		const passage = this.getPassage(query);

		if (!passage) {
			throw new Error(`No passage found with ID or name "${query}"`);
    }

    if (addToHistory) {
      if (this.history.current) {
    		this.history.back.push(this.history.current);
      }
      this.history.current = passage.id;
      this.history.forward = [];
    }

    if (_.includes(passage.tags, 'checkpoint')) {
      this.checkpoint(passage.name);
    }

		this.atCheckpoint = false;
    const newPassage = passage.render();

    if (this.history.current == passage.id) {
      $('#passage').html(newPassage);
    }
    this.renderMetaPassages();

    $.event.trigger('goToPassage:after');
  }

  showPassage(query) {
		var passage = this.getPassage(query);

		if (!passage) {
			throw new Error(`No passage found with ID or name "${query}"`);
    }

    $.event.trigger('showPassage:before');
    return passage.render();
    $.event.trigger('showPassage:after');
  }

  checkpoint(name) {
		$.event.trigger('checkpoint:before');
    document.title = `${this.name}: ${name}`
    this.currentCheckpoint = name;
		this.atCheckpoint = true;

    this.save();
		$.event.trigger('checkpoint:after');
  }

  save() {
		$.event.trigger('save:before');
    localStorage.setItem(this.saveKey, this.serialized)
		$.event.trigger('save:after');
  }

  get serialized() {
    return JSON.stringify({
      state: this.state,
      history: this.history,
      currentCheckpoint: this.currentCheckpoint
    });
  }

  get saveKey() {
    return `${this.slug}.save`;
  }

  get slug() {
    return `${this.name.toLowerCase().replace(/[^\w ]+/g,'').replace(/ +/g,'-')}`;
  }

  get saveData() {
    var data;
    if (data = localStorage.getItem(this.saveKey)) {
      return JSON.parse(data);
    }
    else {
      return null;
    }
  }

  restore() {
		$.event.trigger('restore:before');

		try {
      var save = this.saveData;
			this.state = save.state;
			this.history = save.history;
			this.currentCheckpoint = save.currentCheckpoint;
			this.goToPassage(this.history.current, false);
		}
		catch (e) {
			$.event.trigger('restore:failed');
			return false;
		};

		$.event.trigger('restore:after');
		return true;
  }

  reset() {
    $.event.trigger('reset:before');
    localStorage.removeItem(this.saveKey);
    $.event.trigger('reset:after');
  }

  goBack() {
    var id = this.history.back.pop();
    if (id) {
      this.history.forward.push(this.history.current);
      this.history.current = id;

      this.goToPassage(id, false);
    }
    else {
      throw new Error('Cannot go backward. No backward passage.');
    }
  }

  goForward() {
    var id = this.history.forward.pop();
    if (id) {
      this.history.back.push(this.history.current);
      this.history.current = id;

      this.goToPassage(id, false);
    }
    else {
      throw new Error('Cannot go forward. No forward passage.');
    }
  }

  get previousPassage() {
    var id = _.last(this.history.back);
    if (id) {
      return this.getPassage(id);
    }
  }

  get nextPassage() {
    var id = _.last(this.history.forward);
    if (id) {
      return this.getPassage(id);
    }
  }

  get helpers() {
    if (!this._helpers) {
      var helpers = new Helpers(this);
      this._helpers = helpers.all;
    }

    return this._helpers;
  }

  renderMetaPassages() {
    if (this.header) {
      $('#header .inside').html(this.header.render());
    }

    if (this.footer) {
      $('#footer .inside').html(this.footer.render());
    }
  }

  _findPassages() {
    console.log('Parsing passage data...');

    this.passages = [];

    _.each(this.element.children('tw-passagedata'), (passageElement) => {
      passageElement = $(passageElement);
      this.passages[passageElement.attr('pid')] = new Passage({
        story: this,
        element: passageElement
      });
    });
  }

  _displayStyles() {
    console.log('Displaying story styles...');

    const appendStyle = (style) => {
      $('body').append('<style>' + style + '</style>');
    }

    _.each(this.element.children('#twine-user-stylesheet'), (style) => {
      appendStyle($(style).html())
    });

    _.each(_.where(this.passages, { tags: ['stylesheet'] }), (passage) => {
      appendStyle(passage.source);
    });
  }

  _executeScripts() {
    console.log('Executing story scripts...');
    const dummyPassage = this.passages[this.startPassageID];

    _.each(this.element.children('#twine-user-script'), (script) => {
      dummyPassage.parse(`{% ${$(script).html()} %}`);
    });

    _.each(_.where(this.passages, { tags: ['javascript'] }), (passage) => {
      passage.parse(`{% ${passage.source} %}`);
    });
  }

  _setupEvents() {
    console.log('Setting up events...');

    $('body').on('click', 'a[data-passage]', (event) => {
      var link = $(event.target);
      if (link.attr('data-show')) {
        var passage = this.showPassage(link.attr('data-passage'));
        link.replaceWith(passage || '');
      }
      else {
    		this.goToPassage(link.attr('data-passage'), link.attr('history') || true);
      }
  	});

    $('body').on('click', '.save-link', (event) => {
      this.save();
    });

    $('body').on('click', '.restore-link', (event) => {
      this.restore();
    });

    $('body').on('click', '.back-link', (event) => {
      this.goBack();
    });

    $('body').on('click', '.forward-link', (event) => {
      this.goForward();
    });

    $('body').on('click', 'a[href^=#passage]', (e) => {
      const url = e.target.href;
      const passageID = url.split('#passage:')[1];
      try {
        story.goToPassage(passageID);
        e.preventDefault();
      } catch (err) {
        console.error(err);
      }
    });

  	window.onerror = function (message, url, line) {
      console.error(message, url, line);
  	};
  }

  _getMetaPassages() {
    console.log('Looking for meta passages...');

    this.header = this.getPassage('HEADER');
    this.footer = this.getPassage('FOOTER');
    var configPassage = this.getPassage('CONFIG');

    if (this.header) {
      $('#header').removeClass('hidden');
    }
    if (this.footer) {
      $('#footer').removeClass('hidden');
    }

    if (configPassage) {
      this.config = _.defaults(toml.parse(configPassage.source), this.config);
    }
  }

  _useConfig() {
    console.log('Parsing config...');

    if (this.config.darkTheme) {
      $('body').addClass('dark');
    }

    if (this.config.stylesheets) {
      _.each(this.config.stylesheets, (url) => {
        $('head').append(
          `<link href='${url}' rel='stylesheet' type='text/css'>`
        );
      });
    }
  }
}

export default Story;
