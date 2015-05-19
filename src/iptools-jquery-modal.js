;(function($, document) {

  'use strict';

  var pluginName = 'iptoolsModal';
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

  function iptoolsModal(element, options) {

    this.element = $(element);
    this.settings = $.extend({}, defaults, options);
    this._defaults = defaults;
    this._name = pluginName;

    this.contentLink = this.element.attr('data-modal-content');
    this.$content = null;
    this.loaded = false;

    this.$modal = $('<div/>', { class: this.settings.modalClass, width: this.settings.width, height: this.settings.height });

    this.effect = this.element.attr('data-modal-effect');
    if (this.effect) this.$modal.addClass(this.settings.modalClass + '--effect-' + this.effect);

    $('body').append(this.$modal);

    this.element.on('click', null, this, this.open);

    return this.$modal;

  }

  iptoolsModal.prototype = {

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

    close: function(event) {

      var self = event.data;
      self.hide();
      self.unbindCloseEvents();

    },

    show: function() {

      if (this.settings.closeButton) {

        this.closeButton = $('<div class="' + this.settings.modalClass + '__button-close"></div>');
        this.$modal.append(this.closeButton);

      }
      this.center();
      this.$modal.addClass('modal--active');

    },

    hide: function() {

      this.$modal.removeClass('modal--active');
      if (this.closeButton) this.closeButton.remove();

    },

    showSpinner: function() {

      if (this.settings.showSpinner) {
        this.spinner = this.spinner || $('<div class="' + this.settings.modalClass + '__spinner"></div>')
          .append(this.settings.spinnerHTML);
        $('body').append(this.spinner);
        this.spinner.show();
      }

    },

    hideSpinner: function() {

      if (this.spinner) {
        this.spinner.hide();
        this.spinner.remove();
      }

    },

    center: function() {

      this.$modal.css({
        position: 'fixed',
        top: '50%',
        left: '50%',
        marginTop: - this.$modal.outerHeight() * 0.5,
        marginLeft: - this.$modal.outerWidth() * 0.5,
        zIndex: this.settings.zIndex
      });

    },

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

    unbindCloseEvents: function() {

      $(document).off('keydown.modal mouseup.body');

    },

    handleKeyDown: function(event) {

      var self = event.data;
      if (event.which === 27) self.close(event);

    },

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
        $.data(this, 'plugin_' + pluginName, new iptoolsModal(this, options));
      }

    });

  };

})(jQuery, document);
