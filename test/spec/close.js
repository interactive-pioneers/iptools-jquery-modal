'use strict';

/* jshint undef: false, expr: true */
/* global expect */

(function() {

  describe('iptModal', function() {

    var config = {
      height: 500,
      width: 500,
      closeButtonClass: 'modal-test__button-close',
      modalClass: 'modal-test',
      modalId: 'modal-test',
      modifiers: 'modal-test--without-padding',
      overlayClass: 'overlay-test',
      closeOnClickOutside: false
    };

    var pluginName = 'plugin_iptModal';
    var selector = '.js_trigger-modal';
    var object = null;
    var data = {link: '#test'};

    describe('close', function() {

      context('when clicking outside', function() {

        context('with outside click disabled', function() {

          beforeEach(function() {
            object = $(selector).iptModal(config);
          });

          afterEach(function() {
            object.off('success.iptModal close.iptModal');
            object.data(pluginName).destroy();
          });

          it('expected to not close modal', function(done) {
            object.on('success.iptModal', function() {
              $(document).trigger('mouseup');
              expect(object.data(pluginName).getModal()).to.exist;
              done();
            }).data(pluginName).open(data);
          });

        });

        context('with outside click enabled', function() {

          beforeEach(function() {
            config.closeOnClickOutside = true;
            object = $(selector).iptModal(config);
          });

          afterEach(function() {
            config.closeOnClickOutside = false;
            object.off('success.iptModal close.iptModal');
            object.data(pluginName).destroy();
          });

          it('expected to close modal', function(done) {
            object.on('success.iptModal', function() {
              $(document).trigger('touchstart');
              expect(object.data(pluginName).getModal()).to.not.exist;
              done();
            }).data(pluginName).open(data);
          });

          it('expected to emit close event on document mouseup', function(done) {
            object.on('success.iptModal', function() {
              $(document).trigger('mouseup');
            }).on('close.iptModal', function() {
              done();
            }).data(pluginName).open(data);
          });

          it('expected to emit close event on document touchstart', function(done) {
            object.on('success.iptModal', function() {
              $(document).trigger('touchstart');
            }).on('close.iptModal', function() {
              done();
            }).data(pluginName).open(data);
          });

          it('expected to emit close event on close icon click', function(done) {
            object.on('success.iptModal', function() {
              object.data(pluginName).getModal().find('.' + config.closeButtonClass).click();
            }).on('close.iptModal', function() {
              done();
            }).data(pluginName).open(data);
          });

          it('expected to emit close event on API close call', function(done) {
            object.on('success.iptModal', function() {
              object.data(pluginName).close();
            }).on('close.iptModal', function() {
              done();
            }).data(pluginName).open(data);
          });

        });

      });

    });

  });

})();
