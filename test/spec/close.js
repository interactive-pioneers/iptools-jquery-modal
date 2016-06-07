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
            object.off('success.iptModal');
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
            object.off('success.iptModal');
            object.data(pluginName).destroy();
          });

          it('expected to close modal', function(done) {
            object.on('success.iptModal', function() {
              $(document).trigger('touchstart');
              expect(object.data(pluginName).getModal()).to.not.exist;
              done();
            }).data(pluginName).open(data);
          });

        });

      });

    });

  });

})();
