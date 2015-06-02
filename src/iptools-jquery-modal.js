(function($, document) {

  'use strict';

  var pluginName = 'iptModal';
  var defaults = {
    width: 'auto',
    height: 'auto',
    zIndex: 102,
    closeOnESC: true,
    closeOnClickOutside: true,
    closeButton: true,
    showSpinner: true,
    spinnerHTML: '',
    modalClass: 'modal'
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

    this.contentLink = this.element.attr('data-modal-content');
    this.$content = null;
    this.loaded = false;

    this.$modal = $('<div/>', {
      class: this.settings.modalClass,
      width: this.settings.width,
      height: this.settings.height
    });

    this.effect = this.element.attr('data-modal-effect');
    if (this.effect) {
      this.$modal.addClass(this.settings.modalClass + '--effect-' + this.effect);
    }

    $('body').append(this.$modal);

    this.element.on('click', null, this, this.open);

  }

  IPTModal.prototype = {

    /**
     * opens the modal window
     * @param {event} event - jQuery event
     * @returns {void}
     */
    open: function(event) {

      var self = event.data;

      if (self.loaded) {

        self.show();
        self.bindCloseEvents();

      } else {

        if (/^#/.test(self.contentLink)) {

          var $template = $(self.contentLink);
          if ($template.length === 1) {
            self.$modal.html($template.html());
            self.loaded = true;
            self.show();
            self.bindCloseEvents();
          }

        } else {

          self.showSpinner();

          $.get(self.contentLink).done(function(html) {

            self.$modal.html(html);
            self.loaded = true;
            self.hideSpinner();
            self.show();
            self.bindCloseEvents();

          }).fail(function() {

            self.hideSpinner();

          });

        }

      }

    },

    /**
     * closes the modal
     * @param {event} event - jQuery event
     * @returns void
     */
    close: function(event) {

      var self = event.data;
      self.hide();
      self.unbindCloseEvents();

    },

    /**
     * shows the modal
     * @returns void
     */
    show: function() {

      if (this.settings.closeButton) {

        this.closeButton = $('<div class="' + this.settings.modalClass + '__button-close"></div>');
        this.$modal.append(this.closeButton);

      }
      this.center();
      this.$modal.addClass('modal--active');

    },

    /**
     * hides the modal
     * @returns void
     */
    hide: function() {

      this.$modal.removeClass('modal--active');
      if (this.closeButton) {
        this.closeButton.remove();
      }

    },

    /**
     * shows the spinner if content has to be loaded
     * @returns void
     */
    showSpinner: function() {

      if (this.settings.showSpinner) {
        this.spinner = this.spinner || $('<div class="' + this.settings.modalClass + '__spinner"></div>')
          .append(this.settings.spinnerHTML);
        $('body').append(this.spinner);
        this.spinner.show();
      }

    },

    /**
     * hides the spinner
     * @returns void
     */
    hideSpinner: function() {

      if (this.spinner) {
        this.spinner.hide();
        this.spinner.remove();
      }

    },

    /**
     * centers the modal
     * @returns void
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
     * @returns void
     */
    bindCloseEvents: function() {

      if (this.closeButton) {
        this.closeButton.on('click', null, this, this.close);
      }

      if (this.settings.closeOnESC) {
        $(document).on('keydown.modal', null, this, this.handleKeyDown);
      }

      if (this.settings.closeOnClickOutside) {
        $(document).on('mouseup.body', null, this, this.handleBodyClick);
      }

    },

    /**
     * unbind close events
     * @returns void
     */
    unbindCloseEvents: function() {

      $(document).off('keydown.modal mouseup.body');

    },

    /**
     * handler for keydown event
     * @returns void
     */
    handleKeyDown: function(event) {

      var self = event.data;
      if (event.which === 27) {
        self.close(event);
      }

    },

    /**
     * handler for click outside modal
     */
    handleBodyClick: function(event) {

      var self = event.data;
      if (!self.$modal.is(event.target) && self.$modal.has(event.target).length === 0) {
        self.close(event);
      }

    }

  };

  $.fn[ pluginName ] = function(options) {

    return this.each(function() {

      if (!$.data(this, 'plugin_' + pluginName)) {
        $.data(this, 'plugin_' + pluginName, new IPTModal(this, options));
      }

    });

  };

})(jQuery, document);

