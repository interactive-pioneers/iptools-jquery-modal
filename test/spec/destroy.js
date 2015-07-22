'use strict';

/* jshint undef: false, expr: true */

(function() {

  describe('iptModal', function() {

    var config = {
      height: 500,
      width: 500,
      modalClass: 'modal-test',
      modalId: 'modal-test'
    };

    var pluginName = 'plugin_iptModal';
    var selector = '.js_trigger-modal';
    var object = null;

    describe('destroy', function() {

      beforeEach(function() {
        object = $(selector).iptModal(config);
      });

      afterEach(function() {
        $(selector).off();
      });

      it('expected to remove data', function() {
        object.data(pluginName).destroy();
        return expect(object.data(pluginName)).to.not.be.ok;
      });

      it('expected to stop event emission', function(done) {
        var emission = false;
        object.data(pluginName).destroy();
        $(selector).on('complete.iptModal success.iptModal error.iptModal', function() {
          done();
          emission = true;
          return expect(emission).to.not.be.ok;
        }).trigger('click');
        setTimeout(function() {
          done();
          return expect(emission).to.not.be.ok;
        }, 1500);
      });

    });

  });

})();
