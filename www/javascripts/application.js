/* global require */
require.config({
	paths: {
		//Core libs
		'jquery':              '/components/jquery/jquery.min',
		'parse':               '/components/parse-js-sdk/lib/parse.min',
		'backbone':            '/components/backbone/backbone',
		'underscore':          '/components/lodash/dist/lodash',
		'steroids':            '/components/steroids-js/steroids',
		'preload':             '/components/steroids-webview-preload-with-amd/preload.amd',
		//Hammer
		'hammer':              '/vendor/hammerjs/hammer.min',
		'jquery.hammer':       '/vendor/hammerjs/jquery.hammer.min',
		'b':                   '/components/sass-bootstrap/dist/js/bootstrap.min',
		'g':                   '/components/greensock-js/src/minified/TweenLite.min',
		'jquery.g':            '/components/greensock-js/src/minified/jquery.gsap.min',
		//Helpers
		'jade':                '/javascripts/templates/jade',
		'i18n':                '/javascripts/i18n',
        'async':               '/components/requirejs-plugins/src/async',
        'backbone.validation': '/components/backbone.validation/dist/backbone-validation-amd-min',
        'aspect':              '/components/aspect.js/src/aspect',
        'functional':          '/components/aspect.js/src/functional',
        //MVC paths
        'models':              '/models',
        'controllers':         '/controllers',
        'controller':          '/controllers/Controller'
	},
	shim: {
		'jquery': {
			exports: '$'
		},
		'underscore': {
			exports: '_'
		},
		'backbone': {
			deps: ['jquery', 'underscore'],
			exports: 'Backbone'
		},
		'backbone.validation': {
			deps: ['backbone'],
			exports: 'Backbone.Validation'
		},
		'b': {
			deps: ['jquery']
		},
		'parse': {
			exports: 'Parse'
		},
		'jade': {
			exports: 'jade'
		},
		'hammer': {
            exports: 'Hammer'
        },
		'jquery.hammer': {
			deps: ['jquery']
		},
		'setup': {
			deps: ['parse']
		},
		'ftscroller': {
			exports: 'FTScroller'
		},
		'controller': {
			deps: ['backbone'],
			exports: 'Controller'
		},
		'steroids': {
			exports: 'steroids'
		},
		'preload': {
			deps: ['steroids'],
			exports: 'steroids.preload'
		},
		'jquery.g': {
			deps: ['jquery', 'g']
		}
	},
	//Default to english
    config: {
        i18n: {
            locale: 'en-us'
        }
    }
});

require(['setup'], function(){

	//Call controller
	var $controller = $('script#requirecontroller');
	var controller = $controller.attr('controller');

	//PUT GLOBAL STUFF HERE
	//Enable drawer for all views
	if( (controller !== 'drawer') ){

		window.defaultAuthAnimation = new steroids.Animation('flipHorizontalFromLeft');
		window.defaultReverseAuthAnimation = new steroids.Animation('flipHorizontalFromRight');
		window.defaultModalAnimation = new steroids.Animation('curlUp');//Not to be used in modals but "fake" modals

		//Preload the loginView for now
		window.loginView = new steroids.views.WebView({location: 'views/login/index.html', id: 'loginView'});

		if(Parse.User.current()){
			window.drawer = new steroids.views.WebView({location: 'views/drawer/index.html', id: 'drawer'});
			window.showDrawer = function(){

				steroids.preload(
					window.drawer, window.drawer.id,
					function(){

						steroids.drawers.show({
							view: window.drawer,
							edge: steroids.screen.edges.LEFT
						}, {
							onSuccess: function(){
								setTimeout(function(){
									if(window.drawer.isReady){
										window.postMessage(JSON.stringify({message: 'drawer.link', pageId: $('body>.page').attr('id')}));
									}
								}, 200);
							},
							onFailuer: function(){
								console.log('can not show drawer at this time', this, arguments);
							}
						});

					}, 
					function(){
						console.log('drawer can not be preloaded', arguments, this);
					}
				);

			};

			window.hideDrawer = function(){
				steroids.drawers.hideAll();
				//steroids.screen.unfreeze();
			};

			window.enableDrawerUI = function(){
				var $button = $('#drawerButton');
				var $toggle = $('#drawerToggle');

				if($button.length && $button.hasClass('show')){
					$button.removeClass('show');
				}

				if($toggle.length && $toggle.hasClass('show')){
					$toggle.removeClass('toggle');
				}
			};

			window.disableDrawerUI = function(){
				var $button = $('#drawerButton');
				var $toggle = $('#drawerToggle');

				if($button.length && !$button.hasClass('show')){
					$button.addClass('show');
				}

				if($toggle.length && !$toggle.hasClass('show')){
					$toggle.addClass('toggle');
				}
			};

			window.drawerReady = function(e){
				var data = JSON.parse(e.data);

				if(data.message === 'drawer.ready'){
					window.drawer.isReady = true;

					window.postMessage( JSON.stringify({message: 'drawer.link', pageId: $('body>.page').attr('id')}) );
				}
			};

			window.addEventListener('message', window.drawerReady, false);

			//Open root pages
			window.onPage = function(e){
				var data = JSON.parse(e.data);

				if( data.message !== 'page.open'){
					return;
				}

				var $id = $('body>.page').length ? $('body>.page').attr('id') : false;

				if( _.isString(data.pageId) && _.isString(data.location) ) {

					var onSuccess = function(){
						//Grab or create the global view
						var view = window[this.pageId] || new steroids.views.WebView({location: this.location, id: this.pageId});
						//Lock the screen
						//steroids.screen.freeze();

						//Preload the desired view
						if(this.pageId === 'index'){//Index is the top most
							setTimeout(function(){
								steroids.layers.popAll();
							}, 200);
							return;
						}

						//All other views will be children of the search(index) view
						steroids.preload(
							view, view.id, 
							function(){//Alright

								setTimeout(function(){
									steroids.layers.push({
										view: this,
										keepLoading: true,
										navigationBar: false
									}, {
										onSuccess: function(){
											steroids.view.removeLoading();
										},
										onFailure: function(){
											console.log('can not open modal', arguments, this);
										}
									});
								}.bind(this), 200);

							}.bind(view),
							function(){//Fuck!
								console.log('can not preload view', this, arguments)
							}.bind(view)
						);
					}.bind(data);

					if(data.from === 'drawer'){
						window.enableDrawerUI();

						steroids.drawers.hide({}, {
							onSuccess: onSuccess
						});
					}else{
						onSuccess();
					}
				}
			};

			window.addEventListener('message', window.onPage, false);
			//Order page


			//Logout stuff
			if( controller !== 'login' || controller !== 'signup'){

				window.onSignout = function(e){
					var data = JSON.parse(e.data);

					if(data.message === 'signout'){

						Parse.User.logOut();

						steroids.drawers.hide({}, {
							onSuccess: function(){
								steroids.preload(window.loginView, window.loginView.id, function(){
									setTimeout(function(){
										steroids.preload(window.loginView, window.loginView.id, function(){
											steroids.layers.push({
												view: window.loginView,
												animation: defaultAuthAnimation,
												navigationBar: false
											});
										});
									}, 100);
								});
							}
						});
						
					}
				}

				window.addEventListener('message', window.onSignout, false);
			}
		}

	}

	//Get the fire started
	window.postMessage( JSON.stringify({message: 'requireready', controller: controller}) );
});