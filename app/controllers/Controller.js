/* global define, Backbone, _, $ */
define(function(require){
	//TODO: Create proper layout and extend each page from it
	var template = require('templates/page');
	var controller = Backbone.View.extend({
		id: 'must set your id',
		el: 'body',
		className: 'container',
		template: template,
		compiledTemplate: '',
		
		loadingLabel: i18n.Loading,
		
		dom: {},

		events: {
			'tap #drawerButton': 'drawer',
			'tap #drawerToggle': 'drawer',
			'tap #backButton':   'close'
		},

		checkDrag: function(e){
			console.log(e, 'drag', this.$el.position().top);
		},

		navBar: {},

		initialize: function(options){
			//Grab default objects
			var model = (options && options.model && options.model instanceof Backbone.Model) ? options.model.attributes : {};
			var collection = (options && options.collection && options.collection instanceof Backbone.Collection) ? options.collection.toJSON() : {};

			//Pass to the template, we must enforce the usage of this instead of custom names
			this.compiledTemplate = this.template({
				item: model,
				items: collection,
				nav: this.navBar,
				id: this.id,
				className: this.className
			});

			return this;
		},

		render: function(){

			this.$el.append(this.compiledTemplate);
			this.dom.page = $('body>.page');
			/*
			if(Parse.User.current()){
				this.dom.$drawer = $('#drawerButton');
      			this.dom.$drawerToggle = $('#drawerToggle');
			}*/

			if( _.isFunction(this.onRender) ){
				this.onRender();
			}

			return this;
		},

		onMessage: function(){
			console.log('on message', e);
		},

		blur: function(){
			this.$(':focus').blur();
		},
		
		drawer: function(evnt){

			if(evnt && evnt.preventDefault){
				evnt.preventDefault();
			}
			//Ideally the user drawer won't be available if no user is present
			if( Parse.User.current() ){
				if(this.dom.$drawer.length){
					this.dom.$drawer.toggleClass('show');
				}

				if(this.dom.$drawerToggle.length){
					this.dom.$drawerToggle.toggleClass('show');
				}

				if(this.dom.$drawer.hasClass('show')){
					window.showDrawer();
				}else{
					window.hideDrawer();
				}
			}
		},
		close: function(){
			console.log('close view');
			steroids.layers.pop();
		},

		onRender: function(){
			console.log('on render');
		},

		setTitle: function(str){
			var title = this.$el.find('#title');
			if(title.length){
				title.text(str);
			}
		}
	});

	return controller;
});