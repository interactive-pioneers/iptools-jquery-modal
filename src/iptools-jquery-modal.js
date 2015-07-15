(function($, window, document) {

  'use strict';

  var pluginName = 'iptModal';

  /*
   * Component handles modals of 2 types:
   *   - Static. Detect container by ID of href hash.
   *   - Dynamic. Create container on the fly for URI href.
   *   - Unobtrusive. Create container on the fly for jquery-ujs.
   */
  var TYPES = {
    STATIC: 'static',
    DYNAMIC: 'dynamic',
    UNOBTRUSIVE: 'unobtrusive'
  };

  var classes = {
    activeModifier: '--active',
    effectModifierPrefix: '--effect-',
    modal: 'modal',
    spinnerModifier: '--default',
    elements: {
      closeButton: '__button-close',
      spinner: '__spinner'
    }
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
    spinnerClass: classes.elements.spinner + classes.spinnerModifier,
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
    $modal = buildModal({link: contentLink});

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
    this.element.off(getNamespacedEvent('click')).removeData('plugin_' + pluginName);
  };

  IPTModal.prototype.open = function(data) {
    if (!data) {
      throw new Error('Data for modal launch missing!');
    } else if (!data.link) {
      throw new Error('Link for modal content missing!');
    }
    $modal = buildModal(data);
    switch (type) {
      case TYPES.STATIC:
        loaded = true;
        show();
        bindTemporaryEvents();
        break;
      case TYPES.DYNAMIC:
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
        break;
      default:
        showSpinner();
    }
  };

  IPTModal.prototype.close = function() {
    hide();
    unbindTemporaryEvents();
  };

  function getNamespacedEvent(name) {
    return name + '.' + pluginName;
  }

  function show() {
    center();
    $modal.addClass(settings.modalClass + classes.activeModifier);
  }

  function hide() {
    $modal.removeClass(settings.modalClass + classes.activeModifier);
  }

  function addEventListeners() {
    self.element.on(getNamespacedEvent('click'), handleModalLinkClicked);
  }

  function buildModal(data) {
    if (isStaticModalRequest(data)) {
      if ($(data.link).length === 0) {
        throw new Error('Modal content not found!');
      }
      type = TYPES.STATIC;
      return $(data.link)
        .addClass(settings.modalClass)
        .data('type', type);
    }
    type = isUnobtrusiveModalRequest(data) ? TYPES.UNOBTRUSIVE : TYPES.DYNAMIC;
    return $('<div/>', {
        class: settings.modalClass,
        width: settings.width,
        height: settings.height
      })
      .addClass(settings.modalClass)
      .data('type', type)
      .appendTo('body');
  }

  function isStaticModalRequest(data) {
    return data.link.charAt(0) === '#' && !data.unobtrusive;
  }

  function isUnobtrusiveModalRequest(data) {
    return data.unobtrusive ? true : false;
  }

  function addCloseButton() {
    if (settings.closeButton) {
      $closeButton = $('<div/>')
        .addClass(settings.modalClass + classes.elements.closeButton)
        .appendTo($modal);
    }
  }

  function showSpinner() {
    if (settings.showSpinner) {
      if (!$spinner) {
        $spinner = $('<div/>')
          .addClass(settings.modalClass + classes.elements.spinner)
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
      $closeButton.on(getNamespacedEvent('click'), close);
    }

    if (settings.closeOnESC) {
      $(document).on(getNamespacedEvent('keydown'), handleKeyDown);
    }

    if (settings.closeOnClickOutside) {
      $(document).on(getNamespacedEvent('mouseup'), handleBodyClick);
    }

    $(window).on(getNamespacedEvent('resize'), handleResize);
  }

  function unbindTemporaryEvents() {
    $(document).off(getNamespacedEvent('keydown') + ' ' + getNamespacedEvent('mouseup'));
    $(window).off(getNamespacedEvent('resize'));
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
    // FIXME: IE8 support
    var $trigger = $(event.currentTarget);
    self.open({
      link: $trigger.attr('href'),
      unobtrusive: $trigger.data('remote')
    });
  }

  $.fn[pluginName] = function(options) {
    return this.each(function() {
      if (!$.data(this, 'plugin_' + pluginName)) {
        $.data(this, 'plugin_' + pluginName, new IPTModal(this, options));
      }
    });
  };

})(jQuery, window, document);
