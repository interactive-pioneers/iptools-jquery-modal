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
        return expect(object.data(pluginName).settings.height).to.equal(config.height);
      });

      it('expected to set width to ' + config.width, function() {
        return expect(object.data(pluginName).settings.width).to.equal(config.width);
      });

      it('expected to have static modal reference', function() {
        object.attr('href', '#hash').trigger('click');
        var id = $(object.data(pluginName).$modal).attr('id');
        return expect(id).to.eql('test');
      });

      it('expected to have dynamic modal reference', function() {
        object.attr('href', 'http://google.com').trigger('click');
        var className = $(object.data(pluginName).$modal).attr('class');
        return expect(className).to.eql(config.modalClass);
      });

    });

    describe('open', function() {

      beforeEach(function() {
        object = $(selector).iptModal(config);
      });

      afterEach(function() {
        object.data(pluginName).destroy();
      });

      it('expected to toggle static modal with class ' + config.modalClass + '--active', function() {
        object.trigger('click');
        console.log('classes', object.attr('class'));
        return expect($('#test').hasClass(config.modalClass + '--active')).to.be.ok;
      });

      it('expected to open static visible modal', function() {
        object.trigger('click');
        return expect($('#test').visible()).to.be.ok;
      });
    });

    describe('destroy', function() {

      beforeEach(function() {
        object = $(selector).iptModal(config);
      });

      it('expected to remove data', function() {
        object.data(pluginName).destroy();
        return expect(object.data(pluginName)).to.not.be.ok;
      });

    });

  });
})();
