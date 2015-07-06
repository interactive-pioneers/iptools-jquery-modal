(function($, window, document) {

  'use strict';

  var pluginName = 'iptModal';

  var classes = {
    activeModifier: '--active',
    effectModifierPrefix: '--effect-',
    modal: 'modal',
    spinner: 'modal__spinner--default'
  };

  var dataAttributes = {
    modalContent: 'modal-content',
    effect: 'modal-effect'
  };

  var defaults = {
    width: 'auto',
    height: 'auto',
    zIndex: 102,
    closeOnESC: true,
    closeOnClickOutside: true,
    closeButton: true,
    modalClass: classes.modal,
    showSpinner: true,
    spinnerClass: classes.spinner,
    spinnerHTML: ''
  };

  /**
   * IPTModal
   * @constructor
   * @param {object} element - jQuery element
   * @param {object} options - plugin options
   */
  function IPTModal(element, options) {

    this.element = $(element);
    this.settings = $.extend({}, defaults, options);
    this._defaults = defaults;
    this._name = pluginName;

    this.contentLink = this.element.data(dataAttributes.modalContent);
    this.$content = null;
    this.loaded = false;

    this.$modal = $('<div/>', {
      class: this.settings.modalClass,
      width: this.settings.width,
      height: this.settings.height
    });

    this.effect = this.element.data(dataAttributes.effect);
    if (this.effect) {
      this.$modal.addClass(this.settings.modalClass + classes.effectModifierPrefix + this.effect);
    }

    $('body').append(this.$modal);

    this.addEventListeners();

  }

  IPTModal.prototype = {

    /**
     * opens the modal window
     * @param {event} event - jQuery event
     * @returns {undefined}
     */
    open: function(event) {

      var self = event.data;

      if (self.loaded) {

        self.show();
        self.bindTemporaryEvents();

      } else {

        if (/^#/.test(self.contentLink)) {

          var $template = $(self.contentLink);
          if ($template.length === 1) {
            self.$modal.html($template.html());
            self.addCloseButton();
            self.loaded = true;
            self.show();
            self.bindTemporaryEvents();
          }

        } else {

          self.showSpinner();

          $.get(self.contentLink).done(function(html) {

            self.$modal.html(html);
            self.addCloseButton();
            self.loaded = true;
            self.hideSpinner();
            self.show();
            self.bindTemporaryEvents();

          }).fail(function() {

            self.hideSpinner();

          });

        }

      }

      event.preventDefault();

    },

    /**
     * closes the modal
     * @param {event} event - jQuery event
     * @returns {undefined}
     */
    close: function(event) {

      var self = event.data;
      self.hide();
      self.unbindTemporaryEvents();

    },

    /**
     * shows the modal
     * @returns {undefined}
     */
    show: function() {

      this.center();
      this.$modal.addClass(this.settings.modalClass + classes.activeModifier);

    },

    /**
     * hides the modal
     * @returns {undefined}
     */
    hide: function() {

      this.$modal.removeClass(this.settings.modalClass + classes.activeModifier);

    },

    /**
     * add a close button to the modal
     * @returns {undefined}
     */
    addCloseButton: function() {

      if (this.settings.closeButton) {
        this.closeButton = $('<div/>')
          .addClass(this.settings.modalClass + '__button-close')
          .appendTo(this.$modal);
      }

    },

    /**
     * shows the spinner if content has to be loaded
     * @returns {undefined}
     */
    showSpinner: function() {

      if (this.settings.showSpinner) {
        if (!this.spinner) {
          this.spinner = $('<div/>')
            .addClass(this.settings.modalClass + '__spinner')
            .addClass(this.settings.spinnerClass)
            .append(this.settings.spinnerHTML);
        }
        $('body').append(this.spinner);
        this.spinner.show();
      }

    },

    /**
     * hides the spinner
     * @returns {undefined}
     */
    hideSpinner: function() {

      if (this.spinner) {
        this.spinner.hide();
        this.spinner.remove();
      }

    },

    /**
     * centers the modal
     * @returns {undefined}
     */
    center: function() {

      this.$modal.css({
        position: 'fixed',
        top: '50%',
        left: '50%',
        marginTop: -this.$modal.outerHeight() * 0.5,
        marginLeft: -this.$modal.outerWidth() * 0.5,
        zIndex: this.settings.zIndex
      });

    },

    /**
     * bind events to close modal
     * @returns {undefined}
     */
    bindTemporaryEvents: function() {

      if (this.closeButton) {
        this.closeButton.on('click' + '.' + this._name, null, this, this.close);
      }

      if (this.settings.closeOnESC) {
        $(document).on('keydown' + '.' + this._name, null, this, this.handleKeyDown);
      }

      if (this.settings.closeOnClickOutside) {
        $(document).on('mouseup' + '.' + this._name, null, this, this.handleBodyClick);
      }

      $(window).on('resize' + '.' + this._name, null, this, this.handleResize);

    },

    /**
     * unbind close events
     * @returns {undefined}
     */
    unbindTemporaryEvents: function() {

      $(document).off('keydown' + '.' + this._name + ' mouseup' + '.' + this._name);
      $(window).off('resize' + '.' + this._name);

    },

    /**
     * handler for keydown event
     * @returns {undefined}
     */
    handleKeyDown: function(event) {

      var self = event.data;
      if (event.which === 27) {
        self.close(event);
      }

    },

    /**
     * handle clicks outside modal
     * @returns {undefined}
     */
    handleBodyClick: function(event) {

      var self = event.data;
      if (!self.$modal.is(event.target) && self.$modal.has(event.target).length === 0) {
        self.close(event);
      }

    },

    /**
     * handles browser resizing
     * @param {event} event - jQuery event
     * @returns {undefined}
     */
    handleResize: function(event) {

      var self = event.data;
      if (typeof(self.resizeTimeout) !== 'undefined') {
        clearTimeout(self.resizeTimeout);
      }
      self.resizeTimeout = setTimeout(function() {
        self.center();
      }, 250);

    },

    /**
     * add event listeners to element
     * @returns {undefined}
     */
    addEventListeners: function() {

      this.element.on('click' + '.' + this._name, null, this, this.open);

    },

    /**
     * destroy method
     * @returns {undefined}
     */
    destroy: function() {

      this.unbindTemporaryEvents();
      this.element.off('click' + '.' + this._name);
      this.element.removeData('plugin_' + pluginName);

    }

  };

  $.fn[pluginName] = function(options) {

    return this.each(function() {

      if (!$.data(this, 'plugin_' + pluginName)) {
        $.data(this, 'plugin_' + pluginName, new IPTModal(this, options));
      }

    });

  };

})(jQuery, window, document);
