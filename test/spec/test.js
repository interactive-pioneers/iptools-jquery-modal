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
        return expect(object.data(pluginName).getSettings().height).to.equal(config.height);
      });

      it('expected to set width to ' + config.width, function() {
        return expect(object.data(pluginName).getSettings().width).to.equal(config.width);
      });

    });

    describe('open', function() {

      context('with static modal', function() {

        beforeEach(function() {
          object = $(selector).iptModal(config);
        });

        afterEach(function() {
          object.data(pluginName).destroy();
        });

        it('expected to have static modal ID', function() {
          object.attr('href', '#test').trigger('click');
          return expect(object.data(pluginName).getModal().attr('id')).to.eql('test');
        });

        it('expected to have correct type', function() {
          object.attr('href', '#test').trigger('click');
          return expect(object.data(pluginName).getModal().data('type')).to.eql('static');
        });

        it('expected to have class ' + config.modalClass + '--active', function() {
          object.attr('href', '#test').trigger('click');
          return expect($('#test').hasClass(config.modalClass + '--active')).to.be.ok;
        });

        it('expected to toggle visibility', function() {
          object.attr('href', '#test').trigger('click');
          return expect($('#test').is(':visible')).to.be.ok;
        });

        it('expected to throw error if modal is not in DOM', function() {
          function test() {
            object.data(pluginName).open('#i20395vajdf409394fadfeadfvfwew');
          }
          return expect(test).to.throw();
        });

        it('expected to throw error if modal open receives no data', function() {
          function test() {
            object.data(pluginName).open();
          }
          return expect(test).to.throw();
        });

        it('expected to throw error if modal open receives empty object', function() {
          function test() {
            object.data(pluginName).open({});
          }
          return expect(test).to.throw();
        });

        it('expected to throw error if modal open receives incorrect object', function() {
          function test() {
            object.data(pluginName).open({something: 'something'});
          }
          return expect(test).to.throw();
        });

        it('expected to throw error if modal open receives incorrect link', function() {
          function test() {
            object.data(pluginName).open({link: '#34902h0bsifdg5049w45u409-asd'});
          }
          return expect(test).to.throw();
        });

        it('expected to not throw error if modal open receives correct link', function() {
          function test() {
            object.data(pluginName).open({link: '#test'});
          }
          return expect(test).to.not.throw();
        });
      });

      context('with dynamic modal', function() {

        beforeEach(function() {
          object = $(selector).iptModal(config);
          $('#test').hide();
        });

        afterEach(function() {
          object.data(pluginName).destroy();
        });

        it('expected to have correct type', function() {
          object.attr('href', 'http://google.com').trigger('click');
          return expect(object.data(pluginName).getModal().data('type')).to.eql('dynamic');
        });

        it('expected to keep static modal hidden', function() {
          object.attr('href', 'http://google.com').trigger('click');
          return expect($('#test').is(':hidden')).to.be.ok;
        });

        it('expected to have single modal instance', function() {
          object.attr('href', 'http://google.com').trigger('click');
          return expect($('.' + object.data(pluginName).getSettings().modalClass).length).to.eql(1);
        });

        // FIXME running twice for whatever reason
        xit('expected to have complete AJAX request', function(done) {
          object.attr('href', 'index.html').on('complete.iptModal', function() {
            done();
          });
          object.trigger('click');
        });

        it('expected to display spinner', function() {
          object.attr('href', 'http://google.com').trigger('click');
          return expect($('.test__spinner').is(':visible')).to.be.ok;
        });

      });

      context('with unobtrusive modal', function() {

        beforeEach(function() {
          object = $(selector).iptModal(config).data('remote', true);
          $('#test').hide();
        });

        afterEach(function() {
          object.data('remote', null).data(pluginName).destroy();
        });

        it('expected to have correct type', function() {
          object.attr('href', 'http://google.com').trigger('click');
          return expect(object.data(pluginName).getModal().data('type')).to.eql('unobtrusive');
        });

        it('expected to keep static modal hidden', function() {
          object.attr('href', 'http://google.com').trigger('click');
          return expect($('#test').is(':hidden')).to.be.ok;
        });

        it('expected to display spinner', function() {
          object.attr('href', 'http://google.com').trigger('click');
          return expect($('.test__spinner').is(':visible')).to.be.ok;
        });

        it('expected to have single instance on multiple clicks', function() {
          object.attr('href', 'http://google.com').trigger('click').trigger('click');
          return expect($('.test').length).to.eql(1);
        });

        it('expected to have single spinner on multiple clicks', function() {
          object.attr('href', 'http://google.com').trigger('click').trigger('click');
          return expect($('.test__spinner').length).to.eql(1);
        });

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
