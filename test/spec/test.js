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

      describe('with dynamic modal', function() {

        beforeEach(function() {
          object = $(selector).iptModal(config).attr('href', 'dummy.html');
          $('#test').hide();
        });

        afterEach(function() {
          object.off().data(pluginName).destroy();
        });

        it('expected to display spinner on modal ready', function(done) {
          object.on('ready.iptModal', function() {
            expect($('.' + config.modalClass + '__spinner').is(':visible')).to.eql(true);
          }).on('complete.iptModal', function() {
            // Consider done only on complete event, not sooner.
            // Otherwise conflicts with following test.
            done();
          }).trigger('click');
        });

        it('expected to have correct type', function(done) {
          object.on('complete.iptModal', function() {
            expect(object.data(pluginName).getModal().data('type')).to.eql('dynamic');
            done();
          }).trigger('click');
        });

        it('expected to keep static modal hidden', function(done) {
          object.on('complete.iptModal', function() {
            expect($('#test').is(':hidden')).to.eql(true);
            done();
          }).trigger('click');
        });

        it('expected to have single modal instance', function(done) {
          object.on('complete.iptModal', function() {
            expect($('.' + config.modalClass).length).to.eql(1);
            done();
          }).trigger('click');
        });

      });

      context('with unobtrusive modal', function() {

        beforeEach(function() {
          object = $(selector).iptModal(config).attr('href', 'dummy.html').data('remote', true);
          $('#test').hide();
        });

        afterEach(function() {
          object.off().data('remote', null).data(pluginName).destroy();
        });

        it('expected to display spinner on modal ready', function(done) {
          // XXX: mock-trigger jquery-ujs ajax:complete at the end
          object.on('ready.iptModal', function() {
            expect($('.' + config.modalClass + '__spinner').is(':visible')).to.eql(true);
          }).on('complete.iptModal', function() {
            // XXX: Consider done only on complete event to prevent conflicts in further tests.
            done();
          }).trigger('click').trigger('ajax:complete');
        });

        it('expected to have correct type', function(done) {
          object.on('complete.iptModal', function() {
            expect(object.data(pluginName).getModal().data('type')).to.eql('unobtrusive');
            done();
          }).trigger('click').trigger('ajax:complete');
        });

        it('expected to keep static modal hidden', function(done) {
          object.on('complete.iptModal', function() {
            expect($('#test').is(':hidden')).to.eql(true);
            done();
          }).trigger('click').trigger('ajax:complete');
        });

        it('expected to have single modal instance', function(done) {
          object.on('complete.iptModal', function() {
            expect($('.' + config.modalClass).length).to.eql(1);
            done();
          }).trigger('click').trigger('ajax:complete');
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
