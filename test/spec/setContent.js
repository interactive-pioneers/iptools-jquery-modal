 'use strict';

/* jshint undef: false, expr: true */
/* global expect */

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

    describe('setContent', function() {

      before(function() {
        object = $(selector).iptModal(config);
      });

      after(function() {
        object.off('success.iptModal').off('complete.iptModal').off('error.iptModal').data(pluginName).destroy();
      });

      it('expected to set content in modal', function(done) {
        object.on('success.iptModal', function() {
          var content = 'Dummy content';
          object.data(pluginName).setContent(content);
          var actual = object.data(pluginName).getModal().find('.' + config.modalClass + '__content').html();
          expect(actual).to.equal(content);
          done();
        }).trigger('click');
      });

    });
  });
})();
