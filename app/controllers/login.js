/* global define, Backbone, _, $, jade */
define(function(require){
  // Load config file
  var config     = require('config');
  // Base Controller
  var Controller = require('controller');


  /******************************************
  *******************************************
  ************ ACCESS CONTROLLER
  *******************************************
  ******************************************/
  var index = Controller.extend({
    id: 'access',
    className: '',

    initialize: function() {
      //Preload views
      this.signupView = this.constructor.signup();
      this.loginView = this.constructor.login();

      //Assign template
      this.template = this.constructor.template();

      //Initialize parent class
      Controller.prototype.initialize.call(this, arguments);

      this.render();

      this.$el.hammer();

      return this;
    },

    //Custom added events
    events: (function () {
        var events = _.extend({}, Controller.prototype.events, {
          'tap #login': 'login',
          'tap #signup': 'signup'
        });

        return events;
    })(),
    
    //Navigate to login view
    login: function(){
      try{
        steroids.preload(this.loginView, this.loginView.id, function(){
          steroids.layers.push({
            view: this.loginView,
            navigationBar: false
          });
        }.bind(this));
      }catch(e){
        alert('A problem has occurred, please try again.');
      }
    },

    //Navigate to signup view
    signup: function(){
      try{
        steroids.preload(this.signupView, this.signupView.id, function(){
          steroids.layers.push({
            view: this.signupView,
            navigationBar: false
          });
        }.bind(this));
      }catch(e){
        alert('A problem has occurred, please try again.');
      }
    }

  }, {
    signup: function(){
      var config = require('config');

      if(!this._signupView && !(this._signupView instanceof steroids.views.WebView)){
        this._signupView = new steroids.views.WebView({location: config.views.signup.location, id: config.views.signup.id});
      }
      //Preload view
      steroids.preload(this._signupView, this._signupView.id);

      return this._signupView;

    },

    login: function(){
      var config = require('config');

      if(!this._loginView && !(this._loginView instanceof steroids.views.WebView)){
        this._loginView = new steroids.views.WebView({location: config.views.login.location, id: config.views.login.id});
      }
      //Preload view
      steroids.preload(this._loginView, this._loginView.id);

      return this._loginView;

    },

    template: function(){
      if(!this._template || !(_.isFunction(this._template))){
        this._template = require('templates/access');
      }

      return this._template;
    }
  });

  
  /******************************************
  *******************************************
  ************ LOGIN CONTROLLER
  *******************************************
  ******************************************/
  var put = Controller.extend({
    id: 'login',
    className: '',
    navBar: {
      leftButton: {
        text: i18n.Cancel,
        id: 'backButton'
      },
      rightButton: {
        text: i18n.Login,
        id: 'backButton'
      }
    },
    initialize: function() {
      // Assign template
      this.template = this.constructor.template();

      //Initialize base class
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

  }, {
    template: function(){
      if(!this._template || !(_.isFunction(this._template))){
        this._template = require('templates/login');
      }

      return this._template;
    }
  });


  /******************************************
  *******************************************
  ************ JOIN CONTROLLER
  *******************************************
  ******************************************/
  var signup = Controller.extend({
    id: 'signup',
    className: '',

    navBar: {
      leftButton: {
        text: i18n.Cancel,
        id: 'backButton',
        className: 'btn-primary'
      },
      title: i18n.Join,
      rightButton: {
        text: i18n.Next,
        id: 'rightButton',
        className: 'btn-warning'
      }
    },

    loadingLabel: (function () {
      return i18n['__indicator__...'].replace('__indicator__', i18n.Working);
    })(),

    initialize: function() {
      // Assign template and model
      this.template = this.constructor.template();
      this.model = this.constructor.model();
      this.findView = this.constructor.find();

      //Initialize base class
      Controller.prototype.initialize.call(this, arguments);

      this.render();

      this.$el.hammer();

      return this;
    },

    events: (function () {
        var events = _.extend({}, Controller.prototype.events, {
          'submit form': 'submit',
          'tap #rightButton': 'submit',
          'keyup #password': 'onEnter'
        });

        return events;
    })(),

    onRender: function(){

      this.dom.form          = $('#signupForm');
      this.dom.form.name     = $('#name');
      this.dom.form.lastName = $('#lastName');
      this.dom.form.email    = $('#email');
      this.dom.form.mobile   = $('#mobile');
      this.dom.form.password = $('#password');
    
    },
    /**
    * Check if the Enter key has been touched in the keyboard
    * since we don't have a 'submit' button visible in the registration
    * form, we can't really listen for it being touched
    */
    onEnter: function(e){
      if(e.keyCode === 13){
        this.submit(e);
      }
    },

    /**
    * Grabs registration data and puts it in the login model
    * validates data in model and moves to the next screen
    * if valid data is provided
    */
    submit: function(e){
      e.preventDefault();

      //Hides the keyboard
      this.blur();

      var form = this.dom.form;
      var data = {
        firstName   : form.name.val(),
        lastName    : form.lastName.val(),
        email       : form.email.val(),
        phone       : form.mobile.val(),
        password    : form.password.val()
      };

      this.model.set(data).validate();
      
      if(this.model.isValid()){
        //Show spinner
        steroids.view.showLoading(this.loadingLabel);

        /* TODO: Remove when CORS*/
        /* Bootstrap login, remove once CORS gets to work */
        steroids.view.hideLoading();
        //View has been preloaded already, let's send the data to it
        window.postMessage( JSON.stringify({message: 'signup:ready', model: this.model.toJSON()}) );
        steroids.layers.push({
          view: this.findView,
          navigationBar: false
        });
        //TODO: Save to local
        return;
        /* END TODO */
        
        //Save the user
        this.model
          .save()
          .done(function(){
            steroids.view.hideLoading();
            //View has been preloaded already, let's send the data to it
            window.postMessage( JSON.stringify({message: 'signup:ready', model: this.model.toJSON()}) );
            steroids.layers.push({
              view: this.findView,
              navigationBar: false
            });

          }.bind(this))
          .fail(function(){
            steroids.view.hideLoading();
            alert('an error occurred while saving');
          });

      }else{
        alert('Validation error: ' + this.model.validationString());
      }

    }

  }, {
    /**
    * Initializes and return login model
    */
    model: function(){
      if(!this._model || !this._model instanceof Backbone.Model){
        this._model = new (require('models/login'))();
      }

      return this._model;
    },
    /**
    * Initializes and returns template
    */
    template: function(){
      if(!this._template || !_.isFunction(this._template)){
        this._template = require('templates/signup');
      }

      return this._template;
    },
    /**
    * Preload "find" view/controller
    */
    find: function(){
      var config = require('config');

      if(!this._findView && !(this._findView instanceof steroids.views.WebView)){
        this._findView = new steroids.views.WebView({location: config.views.find.location, id: config.views.find.id});
      }
      //Preload view
      steroids.preload(this._findView, this._findView.id);

      return this._findView;

    }
  });

  /******************************************
  *******************************************
  ************ FIND BIKESHARE CONTROLLER
  *******************************************
  ******************************************/
  var find = Controller.extend({
    id: 'findBikeshare',
    className: '',

    navBar: {
      leftButton: {
        text: i18n.Back,
        id: 'backButton'
      },
      title: i18n.Join
    },

    initialize: function() {
      // Assign template and model
      this.template = this.constructor.template();
      this.collection = this.constructor.collection();
      this.networksView = this.constructor.networks();

      //Initialize base class
      Controller.prototype.initialize.call(this, arguments);

      window.addEventListener('message', this.onMessage.bind(this), false);

      this.render();

      this.$el.hammer();

      return this;
    },

    events: (function () {
        var events = _.extend({}, Controller.prototype.events, {
          'submit form': 'submit'
        });

        return events;
    })(),

    onMessage: function(m){
      try{
        var data = JSON.parse(m.data);

        switch(data.message){
          case 'signup:ready':
            //DO signup stuff here
          break;
        }
      }catch(e){
        console.log('Error on message', e, e.stack, e.message);
      }
    },

    onRender: function(){

      this.dom.form          = $('#findBikeshareForm');
      this.dom.form.zip      = $('#zip');
    
    },

    submit: function(e){
      e.preventDefault();

      //Hides the keyboard
      this.blur();

      //By pass search for now
      //this.results();
      //return;

      var form = this.dom.form;

      this.collection
        .setTerm(form.zip.val() || null)
        .fetch()
        .then(this.results.bind(this))
        .fail(this.onResultsError.bind(this));

    },

    results: function(){
      //TODO: Send results to view
      window.postMessage(JSON.stringify({message: 'netowork:results', collection: this.collection.toJSON()}));
      //Save results to local
      steroids.preload(this.networksView, this.networksView.id, function(){
        steroids.layers.push({
          view: this.networksView,
          navigationBar: false
        });
      }.bind(this));
      return;
    },

    onResultsError: function(){
      alert('No networks found');
    }

  }, {
    //Class methods
    collection: function(){
      if(!this._collection || !this._collection instanceof Backbone.Collection){
        this._collection = new (require('models/Bikeshares'))();
      }

      return this._collection;
    },

    template: function(){
      if(!this._template || !_.isFunction(this._template)){
        this._template = require('templates/find_bikeshare');
      }

      return this._template;
    },

    networks: function(){
      var config = require('config');

      if(!this._networksView && !(this._networksView instanceof steroids.views.WebView)){
        this._networksView = new steroids.views.WebView({location: config.views.networks.location, id: config.views.networks.id});
      }
      //Preload view
      steroids.preload(this._networksView, this._networksView.id);

      return this._networksView;

    }
  });


  /******************************************
  *******************************************
  ************ CHOOSE BIKESHARE MODULE
  *******************************************
  ******************************************/
  // Item view
  var NetworkItem = Backbone.View.extend({
    template: require('templates/network_item'),
    tagName: 'li',
    className: 'network-item',
    initialize: function(options){
      if(options && options.model){
        this.listenTo(this.model, 'change', this.render, this);
      }else {
        this.model = this.constructor.model();
      }

      this.render();
    },
    render: function(){
      var data = this.model.toJSON() || {};
      var content = this.template(data);
      this.$el.html(content);

      return this;
    }
  }, {
    model: function(){
      if(!this._model){
        this._model = new (require('models/Bikeshare'))();
      }

      return this._model;
    }
  });
  // Controller
  var networks = Controller.extend({
    id: 'chooseBikeshare',
    className: '',
    tagName: 'ul',

    navBar: {
      leftButton: {
        text: i18n.Back,
        id: 'backButton'
      },
      title: i18n.Join
    },

    initialize: function() {
      // Assign template and model
      this.template = this.constructor.template();
      this.collection = this.constructor.collection();
      this.networkView = this.constructor.network();

      window.addEventListener('message', this.onMessage.bind(this), false);

      //Initialize base class
      Controller.prototype.initialize.call(this, arguments);

      this.listenTo(this.collection, 'reset', this.addAll, this);
      this.listenTo(this.collection, 'add', this.addOne, this);

      this.render();

      this.$el.hammer();

      return this;
    },

    events: (function () {
        var events = _.extend({}, Controller.prototype.events, {
          'tap #bikeshareList li': 'choose'
        });

        return events;
    })(),

    onRender: function(){

      this.dom.list          = $('#bikeshareList');
    
    },

    onMessage: function(m){
      try{
        var data = JSON.parse(m.data);

        switch(data.message){
          case 'network:results':
            //List networks
            this.collection.reset(data.collection);
          break;
        }
      }catch(e){
        console.log('Error on message:', e, e.message, e.stack);
      }
    },

    addAll: function(){
      this.collection.each(this.addOne.bind(this));

      return this;
    },

    addOne: function(model){
      var view = new NetworkItem({model: model});
      this.dom.list.append(view.$el);

      return this;
    },

    choose: function(){
      alert('choosing bikeshare');
    }

  }, {
    //Class methods
    collection: function(){
      if(!this._collection || !this._collection instanceof Backbone.Collection){
        this._collection = new (require('models/Bikeshares'))();
      }

      return this._collection;
    },

    template: function(){
      if(!this._template || !_.isFunction(this._template)){
        this._template = require('templates/networks');
      }

      return this._template;
    },

    network: function(){
      var config = require('config');

      if(!this._networkView && !(this._networkView instanceof steroids.views.WebView)){
        this._networkView = new steroids.views.WebView({location: config.views.network.location, id: config.views.network.id});
      }
      //Preload view
      steroids.preload(this._networkView, this._networkView.id);

      return this._networkView;

    }
  });


  /******************************************
  *******************************************
  ************ BIKESHARE CONTROLLER
  *******************************************
  ******************************************/
  var network = Controller.extend({
    id: 'bikeshare',
    className: '',

    navBar: {
      leftButton: {
        text: i18n.Back,
        id: 'backButton'
      },
      title: i18n.Join,
      leftButton: {
        text: i18n.Next,
        id: 'rightButton'
      },
    },

    initialize: function() {
      // Assign template and model
      this.template = this.constructor.template();
      this.model = this.constructor.model();

      //Initialize base class
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

  }, {
    //Class methods
    model: function(){
      if(!this._model || !this._model instanceof Backbone.Model){
        this._model = new (require('models/Bikeshare'))();
      }

      return this._model;
    },

    template: function(){
      if(!this._template || !_.isFunction(this._template)){
        this._template = require('templates/network');
      }

      return this._template;
    }
  });

  return {
    'index': index,
    'new': signup,
    'put': put,
    'find': find,
    'networks': networks,
    'network': network
  };
});