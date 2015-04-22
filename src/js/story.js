'use strict';

import $ from 'jquery';
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

    this.history = [];
    this.state = {};
    this.currentCheckpoint = '';
    this.atCheckpoint = true;

    this._findPassages();
    // this._executeScripts();
    this._setupEvents();
    this._getMetaPassages();
  }

  play() {
		if (window.location.hash == '' || !this.restore(window.location.hash.replace('#', ''))) {
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
		var passage = this.getPassage(query);

		if (!passage) {
			throw new Error(`No passage found with ID or name "${query}"`);
    }

    $.event.trigger('goToPassage:before');

    if (addToHistory) {
  		this.history.push(passage.id);
    }

    if (_.includes(passage.tags, 'checkpoint')) {
      this.checkpoint(passage.name);
    }

		if (this.atCheckpoint) {
			window.history.pushState({ state: this.state, history: this.history, checkpointName: this.checkpointName }, '', '');
    }
		else {
			window.history.replaceState({ state: this.state, history: this.history, checkpointName: this.checkpointName }, '', '');
    }

		this.atCheckpoint = false;

    $('#passage').html(passage.render());
    if (this.header) {
      $('#header .inside').html(this.header.render());
    }
    if (this.footer) {
      $('#footer .inside').html(this.footer.render());
    }

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
    document.title = `${this.name}: ${name}`
    this.currentCheckpoint = name;
		this.atCheckpoint = true;

		$.event.trigger('checkpoint');
  }

  save() {
		$.event.trigger('save:before');
		window.location.hash = this.saveHash;
		$.event.trigger('save:after');
  }

  get saveHash() {
		return btoa(
      JSON.stringify({
        state: this.state,
        history: this.history,
        currentCheckpoint: this.currentCheckpoint
      })
    );
  }

  restore(hash) {
		$.event.trigger('restore:before');

		try {
			var save = JSON.parse(LZString.decompressFromBase64(hash));
			this.state = save.state;
			this.history = save.history;
			this.currentCheckpoint = save.currentCheckpoint;
			this.goToPassage(this.history[this.history.length - 1]);
		}
		catch (e) {
			$.event.trigger('restore:failed');
			return false;
		};

		$.event.trigger('restore:after');
		return true;
  }

  get previousPassage() {
    if (this.history.length <= 1) {
      return null;
    }

    var previous;
    if (previous = this.history[this.history.length - 1]) {
      return previous;
    }
  }

  get nextPassage() {
    if (this.history.length <= 1) {
      return null;
    }

    var next;
    if (next = this.history[this.history.length]) {
      return next;
    }
  }

  get helpers() {
    if (!this._helpers) {
      var helpers = new Helpers(this);
      this._helpers = helpers.all;
    }

    return this._helpers;
  }

  _findPassages() {
    this.passages = [];
    _.each(this.element.children('tw-passagedata'), (passageElement) => {
      passageElement = $(passageElement);
      this.passages[passageElement.attr('pid')] = new Passage({
        story: this,
        element: passageElement
      });
    });
  }

  _executeScripts() {
    _.each(this.element.children('*[type="text/twine-javascript"]'), (scriptElement) => {
      console.log(scriptElement, scriptElement.html());
      eval(scriptElement.html());
    });
  }

  _setupEvents() {
  	$(window).on('popstate', (event) => {
  		var state = event.originalEvent.state;

  		if (state) {
  			this.state = state.state;
  			this.history = state.history;
  			this.currentCheckpoint = state.currentCheckpoint;
  			this.goToPassage(this.history[this.history.length - 1]);
  		}
  		else if (this.history.length < 1) {
  			this.state = {};
  			this.history = [];
  			this.currentCheckpoint = '';
  			this.goToPassage(this.startPassageID);
  		};
  	});

    $('body').on('click', 'a[data-passage]', (event) => {
      var link = $(event.target);
  		this.goToPassage(link.attr('data-passage'), link.attr('history') || true);
  	});

  	$(window).on('hashchange', () => {
  		this.restore(window.location.hash.replace('#', ''));
  	});

  	window.onerror = function (message, url, line) {
      console.error(message, url, line);
  	};
  }

  _getMetaPassages() {
    this.header = this.getPassage('HEADER');
    this.footer = this.getPassage('FOOTER');

    if (this.header) {
      $('#header').removeClass('hidden');
    }
    if (this.footer) {
      $('#footer').removeClass('hidden');
    }
  }
}

export default Story;