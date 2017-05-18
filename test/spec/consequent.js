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
      modalId: 'modal-test'
    };

    var pluginName = 'plugin_iptModal';
    var selector = '.js_trigger-modal';
    var object = null;

    describe('open', function() {

      before(function() {
        object = $(selector).iptModal(config);
      });

      after(function() {
        object.off('success.iptModal').off('complete.iptModal').off('error.iptModal').data(pluginName).destroy();
      });

      context('when called consequently', function() {

        afterEach(function() {
          // XXX: remove success handler each time to cut interference.
          object.off('success.iptModal');
        });

        it('expected to create initial modal', function(done) {
          object.on('success.iptModal', function() {
            expect(object.data(pluginName).getModal()).to.exist;
            $('.' + config.closeButtonClass).trigger('click');
            done();
          }).trigger('click');
        });

        it('expected to have no modal', function() {
          expect(object.data(pluginName).getModal()).to.not.exist;
        });

        it('expected to have overlay with fade-out class', function() {
          expect(object.data(pluginName).getOverlay().hasClass('overlay--fade-out')).to.be.ok;
        });

        it('expected to create modal on 2nd call', function(done) {
          object.on('success.iptModal', function() {
            expect(object.data(pluginName).getModal()).to.exist;
            done();
          }).trigger('click');
        });

      });

    });
  });
})();
