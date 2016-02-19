'use strict';

/* jshint undef: false */
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

    describe('init', function() {

      beforeEach(function() {
        object = $(selector).iptModal(config);
      });

      afterEach(function() {
        object.data(pluginName).destroy();
      });

      it('expected to construct object', function() {
        return expect(object).to.be.an.object;
      });

      it('expected to set height to ' + config.height, function() {
        return expect(object.data(pluginName).getSettings().height).to.equal(config.height);
      });

      it('expected to set width to ' + config.width, function() {
        return expect(object.data(pluginName).getSettings().width).to.equal(config.width);
      });

      context('when multiple instances', function() {

        var config2 = {
          height: 600,
          width: 600,
          modalClass: 'modal-test2',
          modalId: 'modal-test2'
        };
        var object2 = null;
        var selector2 = '.js_trigger-modal2';

        before(function() {
          object2 = $(selector2).iptModal(config2);
        });

        after(function() {
          object2.data(pluginName).destroy();
        });

        it('expected to construct 2 objects', function() {
          return expect(object.data(pluginName)).to.be.an.object && expect(object2.data(pluginName)).to.be.an.object;
        });

        it('expected to set 1st instance width to ' + config.width, function() {
          return expect(object.data(pluginName).getSettings().width).to.equal(config.width);
        });

        it('expected to set 2nd instance width to ' + config2.width, function() {
          return expect(object2.data(pluginName).getSettings().width).to.equal(config2.width);
        });

        it('expected to have correct 1st instance effect', function() {
          return expect(object.data(pluginName).getEffect()).to.equal($(selector).data('modal-effect'));
        });

        it('expected to have correct 2nd instance effect', function() {
          return expect(object2.data(pluginName).getEffect()).to.equal($(selector2).data('modal-effect'));
        });

      });

    });

  });

})();
