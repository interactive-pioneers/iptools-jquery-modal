(function($, window, document) {

  'use strict';

  var pluginName = 'iptModal';

  function IPTModal(element, options) {

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
      overlay: 'overlay',
      spinnerModifier: '--default',
      modal: {
        name: 'modal',
        verticalAlignTop: 'modal--vertical-align-top',
        verticalAlignCenter: 'modal--vertical-align-center'
      },
      elements: {
        closeButton: '__button-close',
        spinner: '__spinner',
        content: '__content'
      }
    };

    var dataAttributes = {
      effect: 'modal-effect'
    };

    var defaults = {
      animationDuration: 500,
      closeOnESC: true,
      closeOnClickOutside: true,
      closeButton: true,
      closeButtonClass: classes.modal.name + classes.elements.closeButton,
      addCloseButtonToOverlay: false,
      overlayClass: classes.overlay,
      modalClass: classes.modal.name,
      modalId: classes.modal.name,
      modalVAlignTopClass: classes.modal.verticalAlignTop,
      modalVAlignCenterClass: classes.modal.verticalAlignCenter,
      modifiers: '',
      showSpinner: true,
      spinnerClass: classes.modal.name + classes.elements.spinner + classes.spinnerModifier,
      spinnerHTML: '',
      width: '80%',
      height: 'auto',
      zIndex: 102
    };

    this.element = $(element);

    var settings = $.extend({}, defaults, options);
    var contentLink = null;
    var dynamicContentLink = null;
    var $spinner = null;
    var $overlay = null;
    var $modal = null;
    var $closeButton = null;
    var effect = null;
    var loaded = false;
    var active = false;
    var resizeTimeout = 0;
    var type = TYPES.STATIC;
    var self = this;

    this.getSettings = function() {
      return settings;
    };

    this.getModal = function() {
      return $modal;
    };

    this.getOverlay = function() {
      return $overlay;
    };

    this.getEffect = function() {
      return effect;
    };

    this.active = function() {
      return $modal.hasClass(settings.modalClass + classes.activeModifier);
    };

    this.destroy = function() {
      unbindTemporaryEvents();
      unbindUnobtrusiveEvents();
      removeModal();
      removeOverlay();
      this.element.off(getNamespacedEvent('click')).removeData('plugin_' + pluginName);
    };

    this.open = function(data) {
      if (!data) {
        throw new Error('Data for modal launch missing!');
      } else if (!data.link) {
        throw new Error('Link to modal content missing!');
      }
      addOverlay();
      $modal = buildModal(data).appendTo($overlay);
      triggerReady();
      switch (type) {
        case TYPES.STATIC:
          self.setContent($(contentLink).html()); //NOTE: usecase: href attribute contains a jquery selector
          triggerSuccess();
          break;
        case TYPES.DYNAMIC:
          $.get(dynamicContentLink).done(function(html) {
            self.setContent(html);
            triggerSuccess();
          }).fail(function() {
            triggerError();
          });
          break;
        case TYPES.UNOBTRUSIVE:
          bindUnobtrusiveEvents();
          break;
        default:
          throw new Error('Invalid modal type!');
      }
    };

    this.close = function() {
      hideModal();
      hideOverlay();
      unbindTemporaryEvents();
      unbindUnobtrusiveEvents();
      removeModal();
    };

    this.setContent = function(content) {
      $modal.find('.' + settings.modalClass + classes.elements.content).html(content);
    };

    function getModifiers() {
      return settings.modifiers.length > 0 ? ' ' + settings.modifiers : '';
    }

    function removeModal() {
      if ($modal) {
        $modal.remove();
        $modal = null;
        loaded = false;
      }
    }

    function unbindUnobtrusiveEvents() {
      self.element.off('ajax:complete').off('ajax:success').off('ajax:error');
    }

    function unbindTemporaryEvents() {
      $(document)
        .off(getNamespacedEvent('keydown'))
        .off(getNamespacedEvent('mouseup'))
        .off(getNamespacedEvent('touchstart'));
      $(window).off(getNamespacedEvent('resize'));
    }

    function addEventListeners() {
      self.element.on(getNamespacedEvent('click'), handleModalLinkClicked);
    }

    function handleModalLinkClicked(event) {
      event.preventDefault();
      var $trigger = $(event.currentTarget);
      self.open({
        link: detectAjaxUrl($trigger),
        unobtrusive: $trigger.data('remote')
      });
    }

    function buildModal(data) {
      removeModal();
      type = detectModalType(data);
      var $modalContent = $('<div/>')
        .addClass(settings.modalClass + classes.elements.content);
      return $('<div/>', {
          class: settings.modalClass + getModifiers(),
          id: settings.modalId,
          width: settings.width,
          height: settings.height
        })
        .css('z-index', settings.zIndex)
        .data('type', type)
        .append($modalContent);
    }

    function triggerReady() {
      loaded = false;
      showOverlay();
      if (settings.showSpinner) {
        showSpinner();
      }
      self.element.trigger(getNamespacedEvent('ready'));
    }

    function triggerComplete() {
      hideSpinner();
      self.element.trigger(getNamespacedEvent('complete'));
    }

    function triggerSuccess() {
      triggerComplete();
      loaded = true;
      addCloseButton();
      bindTemporaryEvents();
      showModal();
      self.element.trigger(getNamespacedEvent('success'));
    }

    function triggerError() {
      triggerComplete();
      hideOverlay();
      self.element.trigger(getNamespacedEvent('error'));
    }

    function getNamespacedEvent(name) {
      return name + '.' + pluginName;
    }

    function showModal() {
      if (effect) {
        $modal.addClass(settings.modalClass + classes.effectModifierPrefix + effect);
      }
      center();
      $modal.addClass(settings.modalClass + classes.activeModifier);
    }

    function hideModal() {
      $modal.removeClass(settings.modalClass + classes.activeModifier);
    }

    function detectModalType(data) {
      if (data.unobtrusive) {
        return TYPES.UNOBTRUSIVE;
      } else if (data.link && data.link.charAt(0) === '#' && !data.unobtrusive) {
        if ($(data.link).length === 0) {
          throw new Error('Modal content not found!');
        }
        return TYPES.STATIC;
      } else {
        return TYPES.DYNAMIC;
      }
    }

    function detectAjaxUrl(element){
      var tagName = element.prop('tagName').toLowerCase();

      if (tagName === 'a'){
        return element.attr('href');
      }
      if (tagName === 'button'){
        // satisfy jquery ujs usecase buttonClickSelector
        // https://github.com/rails/jquery-ujs/blob/master/src/rails.js#L132
        return element.data('url');
      }
    }

    function addCloseButton() {
      if (settings.closeButton) {
        $closeButton = $('<div/>')
          .addClass(settings.closeButtonClass)
          .appendTo(settings.addCloseButtonToOverlay ? $overlay : $modal);
      }
    }

    function addOverlay() {
      if (!$overlay) {
        $overlay = $('<div/>')
          .addClass(settings.overlayClass)
          .appendTo('body');
      }
    }

    function removeOverlay() {
      if ($overlay) {
        $overlay.remove();
        $overlay = null;
      }
    }

    function showOverlay() {
      active = true;
      $('body').css('overflow', 'hidden');
      if (!$overlay) {
        addOverlay();
      }
      $overlay.stop().fadeIn(settings.animationDuration);
    }

    function hideOverlay() {
      if ($overlay) {
        $overlay.stop().fadeOut(settings.animationDuration);
      }
      $('body').css('overflow', 'auto');
      active = false;
    }

    function showSpinner() {
      if (!$spinner) {
        $spinner = $('<div/>')
          .addClass(settings.modalClass + classes.elements.spinner)
          .addClass(settings.spinnerClass)
          .append(settings.spinnerHTML);
      }
      $spinner.appendTo($overlay).show();
    }

    function hideSpinner() {
      if ($spinner) {
        $spinner.hide();
        $spinner.remove();
      }
    }

    function center() {
      var modalOuterHeight = $modal.outerHeight();
      var overlayHeight = $overlay.height();
      if (modalOuterHeight > overlayHeight) {
        $modal.removeClass(settings.modalVAlignCenterClass)
          .addClass(settings.modalVAlignTopClass);
      } else {
        $modal.removeClass(settings.modalVAlignTopClass)
          .addClass(settings.modalVAlignCenterClass);
      }
    }

    function bindTemporaryEvents() {
      if ($closeButton) {
        $closeButton.on(getNamespacedEvent('click'), self.close);
      }

      if (settings.closeOnESC) {
        $(document).on(getNamespacedEvent('keydown'), handleKeyDown);
      }

      if (settings.closeOnClickOutside) {
        $(document)
          .on(getNamespacedEvent('mouseup'), handleBodyClick)
          .on(getNamespacedEvent('touchstart'), handleBodyClick);
      }

      $(window).on(getNamespacedEvent('resize'), handleResize);
    }

    function bindUnobtrusiveEvents() {
      self.element.on('ajax:complete', handleUnobtrusiveAjaxComplete)
        .on('ajax:success', handleUnobtrusiveAjaxSuccess)
        .on('ajax:error', handleUnobtrusiveAjaxError);
    }

    function handleUnobtrusiveAjaxComplete() {
      triggerComplete();
    }

    function handleUnobtrusiveAjaxSuccess() {
      triggerSuccess();
    }

    function handleUnobtrusiveAjaxError() {
      triggerError();
    }

    function handleKeyDown(event) {
      if (active && event.which === 27) {
        self.close();
      }
    }

    function handleBodyClick(event) {
      if (active && !$modal.is(event.target) && $modal.has(event.target).length === 0) {
        self.close();
      }
    }

    function handleResize() {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(function() {
        center();
      }, 250);
    }

    function init() {
      effect = self.element.data(dataAttributes.effect);
      contentLink = self.element.attr('href');
      dynamicContentLink = detectAjaxUrl(self.element);
      addEventListeners();
    }

    init();
  }

  $.fn[pluginName] = function(options) {
    return this.each(function() {
      if (!$.data(this, 'plugin_' + pluginName)) {
        $.data(this, 'plugin_' + pluginName, new IPTModal(this, options));
      }
    });
  };

})(jQuery, window, document);
