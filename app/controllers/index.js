/* global define, Backbone, _, $, jade */
define(function(require){
  // View for search/index.html
  var template = require('templates/index');
  var config = require('config');
  var Controller = require('controller');

  var index = Controller.extend({
    template: template,
    id: 'index',
    className: '',

    initialize: function() {

      Controller.prototype.initialize.call(this, arguments);

      this.render();

      this.$el.hammer();

      return this;
    },

    events: (function () {
        var events = _.extend({}, Controller.prototype.events, {
        });

        return events;
    })()

  });


  // View for index/new.html
  var signupTemplate = require('templates/signup');
  var signup = Controller.extend({
    template: template,
    id: 'signup',
    className: '',

    initialize: function() {

      Controller.prototype.initialize.call(this, arguments);

      this.render();

      this.$el.hammer();

      return this;
    },

    events: (function () {
        var events = _.extend({}, Controller.prototype.events, {
        });

        return events;
    })()

  });

  return {
    'index': index,
    'new': signup
  };
});