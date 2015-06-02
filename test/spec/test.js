'use strict';
/* jshint undef: false */
(function() {
  describe('iptModal', function() {

    var config = {
      height: 500,
      width: 500,
      modalClass: 'test'
    };

    var pluginName = 'plugin_iptModal';

    var object = null;

    describe('init', function() {

      beforeEach(function() {
        object = $('.js_trigger-modal').iptModal(config);
      });

      it('expected to construct object', function() {
        return expect(object).to.be.an.object;
      });

      it('expected to set height to ' + config.height, function() {
        return expect(object.data(pluginName).settings.height).to.equal(config.height);
      });

      it('expected to set width to ' + config.width, function() {
        return expect(object.data(pluginName).settings.width).to.equal(config.width);
      });

      it('expected to set modalClass to ' + config.modalClass, function() {
        return expect(object.data(pluginName).settings.modalClass).to.equal(config.modalClass);
      });

      it('expected to have class tooltip--active', function() {
        object.trigger('click');
        return expect(object.data(pluginName).$modal.hasClass('modal--active')).to.be.ok;
      });

    });
  });
})();
