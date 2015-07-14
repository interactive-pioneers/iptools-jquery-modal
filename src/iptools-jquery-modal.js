(function($, window, document) {

  'use strict';

  var pluginName = 'iptModal';

  /*
   * Component handles modals of 2 types:
   *   - Static. Detect containers by ID of href hash.
   *   - Dynamic. Create container on the fly for URI href.
   */
  var TYPES = {
    STATIC: 'static',
    DYNAMIC: 'dynamic'
  };

  var classes = {
    activeModifier: '--active',
    effectModifierPrefix: '--effect-',
    modal: 'modal',
    spinner: 'modal__spinner--default'
  };

  var dataAttributes = {
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

  var $modal = null;
  var $spinner = null;
  var $closeButton = null;

  var loaded = false;
  var settings = null;
  var contentLink = null;
  var effect = null;
  var type = TYPES.STATIC;
  var self = null;

  /**
   * IPTModal.
   * @constructor
   * @param {object} element - jQuery element
   * @param {object} options - plugin options
   */
  function IPTModal(element, options) {

    this.element = $(element);
    self = this;

    settings = $.extend({}, defaults, options);

    contentLink = this.element.attr('href');
    $modal = buildModal(contentLink);

    effect = this.element.data(dataAttributes.effect);
    if (effect) {
      $modal.addClass(settings.modalClass + classes.effectModifierPrefix + effect);
    }

    addEventListeners();
  }

  IPTModal.prototype.getSettings = function() {
    return settings;
  };

  IPTModal.prototype.getModal = function() {
    return $modal;
  };

  IPTModal.prototype.destroy = function() {
    unbindTemporaryEvents();
    this.element.off('click' + '.' + pluginName).removeData('plugin_' + pluginName);
  };

  IPTModal.prototype.open = function(signatureLink) {
    if (signatureLink) {
      contentLink = signatureLink;
      $modal = buildModal(contentLink);
    }
    switch (type) {
      case TYPES.STATIC:
        loaded = true;
        show();
        bindTemporaryEvents();
        break;
      default:
        showSpinner();
        $.get(contentLink).done(function(html) {
          $modal.html(html);
          addCloseButton();
          loaded = true;
          hideSpinner();
          show();
          bindTemporaryEvents();
        }).fail(function() {
          hideSpinner();
        });
    }
  };

  IPTModal.prototype.close = function() {
    hide();
    unbindTemporaryEvents();
  };

  function show() {
    center();
    $modal.addClass(settings.modalClass + classes.activeModifier);
  }

  function hide() {
    $modal.removeClass(settings.modalClass + classes.activeModifier);
  }

  function addEventListeners() {
    self.element.on('click' + '.' + pluginName, handleModalLinkClicked);
  }

  function buildModal(link) {
    if (link.charAt(0) === '#') {
      if ($(link).length === 0) {
        throw new Error('Static modal not found! Please revise markup.');
      }
      type = TYPES.STATIC;
      return $(link).addClass(settings.modalClass);
    }
    type = TYPES.DYNAMIC;
    return $('<div/>', {
        class: settings.modalClass,
        width: settings.width,
        height: settings.height
      })
      .addClass(settings.modalClass)
      .appendTo('body');
  }

  function addCloseButton() {
    if (settings.closeButton) {
      $closeButton = $('<div/>')
        .addClass(settings.modalClass + '__button-close')
        .appendTo($modal);
    }
  }

  function showSpinner() {
    if (settings.showSpinner) {
      if (!$spinner) {
        $spinner = $('<div/>')
          .addClass(settings.modalClass + '__spinner')
          .addClass(settings.spinnerClass)
          .append(settings.spinnerHTML);
      }
      $('body').append($spinner);
      $spinner.show();
    }
  }

  function hideSpinner() {
    if ($spinner) {
      $spinner.hide();
      $spinner.remove();
    }
  }

  function center() {
    $modal.css({
      display: 'block',
      position: 'fixed',
      top: '50%',
      left: '50%',
      marginTop: -$modal.outerHeight() * 0.5,
      marginLeft: -$modal.outerWidth() * 0.5,
      zIndex: settings.zIndex
    });
  }

  function bindTemporaryEvents() {
    if ($closeButton) {
      $closeButton.on('click' + '.' + pluginName, close);
    }

    if (settings.closeOnESC) {
      $(document).on('keydown' + '.' + pluginName, handleKeyDown);
    }

    if (settings.closeOnClickOutside) {
      $(document).on('mouseup' + '.' + pluginName, handleBodyClick);
    }

    $(window).on('resize' + '.' + pluginName, handleResize);
  }

  function unbindTemporaryEvents() {
    $(document).off('keydown' + '.' + pluginName + ' mouseup' + '.' + pluginName);
    $(window).off('resize' + '.' + pluginName);
  }

  function handleKeyDown(event) {
    if (event.which === 27) {
      event.data.close(event);
    }
  }

  function handleBodyClick(event) {
    if (!$modal.is(event.target) && $modal.has(event.target).length === 0) {
      event.data.close(event);
    }
  }

  function handleResize(event) {
    var target = event.data;
    if (typeof(target.resizeTimeout) !== 'undefined') {
      clearTimeout(target.resizeTimeout);
    }
    target.resizeTimeout = setTimeout(function() {
      center();
    }, 250);
  }

  function handleModalLinkClicked(event) {
    event.preventDefault();
    self.open();
  }

  $.fn[pluginName] = function(options) {
    return this.each(function() {
      if (!$.data(this, 'plugin_' + pluginName)) {
        $.data(this, 'plugin_' + pluginName, new IPTModal(this, options));
      }
    });
  };

})(jQuery, window, document);
