'use strict';
/* jshint undef: false */
(function() {
  describe('iptoolsModal', function() {

    var modal = null;

    describe('init', function() {
      beforeEach(function() {
        modal = $('.js_trigger-modal').iptoolsModal();
      });
      it('expected to construct object', function() {
        return expect(modal).to.exist;
      });
    });
  });
})();
