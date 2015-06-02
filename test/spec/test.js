'use strict';
/* jshint undef: false */
(function() {
  describe('iptModal', function() {

    var modal = null;

    describe('init', function() {
      beforeEach(function() {
        modal = $('.js_trigger-modal').iptModal();
      });
      it('expected to construct object', function() {
        return expect(modal).to.exist;
      });
    });
  });
})();
