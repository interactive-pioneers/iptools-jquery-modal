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
    var style = null;

    describe('init', function() {

      beforeEach(function() {
        object = $(selector).iptModal(config);
      });

      afterEach(function() {
        object.data(pluginName).destroy();
      });

      before(function() {
        style = $(selector).attr('style');
      });

      after(function() {
        $(selector).attr('style', style);
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

      it('expected to have static modal reference', function() {
        object.attr('href', '#test').trigger('click');
        var id = $(object.data(pluginName).getModal()).attr('id');
        return expect(id).to.eql('test');
      });

      it('expected to have dynamic modal reference', function() {
        object.attr('href', 'http://google.com').trigger('click');
        var className = object.data(pluginName).getModal().attr('class');
        var expectedClassName = 'test test--effect-scale test--active';
        return expect(className).to.eql(expectedClassName);
      });

    });

    describe('open', function() {

      beforeEach(function() {
        object = $(selector).iptModal(config);
      });

      afterEach(function() {
        object.data(pluginName).destroy();
      });

      before(function() {
        style = $(selector).attr('style');
      });

      after(function() {
        $(selector).attr('style', style);
      });

      it('expected to toggle static modal with class ' + config.modalClass + '--active', function() {
        object.attr('href', '#test').trigger('click');
        return expect($('#test').hasClass(config.modalClass + '--active')).to.be.ok;
      });

      it('expected to open static modal', function() {
        object.attr('href', '#test').trigger('click');
        return expect($('#test').is(':visible')).to.be.ok;
      });

      it('expected to throw error on static modal not in DOM', function() {
        function injectIncorrectHash() {
          object.data(pluginName).open('#i20395vajdf409394fadfeadfvfwew', 'static');
        }
        return expect(injectIncorrectHash).to.throw(Error);
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
