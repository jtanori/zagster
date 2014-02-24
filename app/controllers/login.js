/* global define, Backbone, _, $, jade */
define(function(require){
  
  // View for login/index.html
  var template   = require('templates/login');
  var config     = require('config');
  var Controller = require('controller');

  var index = Controller.extend({
    template: template,
    id: 'login',
    className: '',
    signupView: null,

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


  // View for login/new.html
  var signupTemplate = require('templates/signup');
  var loginModel = require('models/login');
  var signup = Controller.extend({
    template: signupTemplate,
    id: 'signup',
    model: null,
    user: null,

    navBar: {
      leftButton: {
        text: i18n.Cancel,
        id: 'backButton'
      },
      title: i18n.Signup
    },

    loadingLabel: (function () {
      return i18n['__indicator__...'].replace('__indicator__', i18n.Working);
    })(),

    initialize: function() {

      Controller.prototype.initialize.call(this, arguments);

      this.model = new loginModel();

      this.compiledTemplate = this.template({nav: this.navBar});

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