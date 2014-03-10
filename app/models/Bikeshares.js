/* global define, Backbone */
define(function(require){
	var config = require('config');
	var model = require('models/Bikeshare');

	return Backbone.Collection.extend({
		model: model,
		term: '',
		url: function(){
			var config = this.constructor.config();

			return config.API.URL + '/Network/NetworkSearch?appid=' + config.API.APPID + '&term=' + this.term;
		},
		initialize: function(){
			console.log('initialize bikeshare collection');
		},
		setTerm: function(t){
			alert('term:' + t);
			try{
				if(!t){ throw new Error('Error: can not set en empty term in Bikeshares collection');}

				this.term = "" + t;
			}catch(e){
				//TODO: Better error handling
				alert('an error has occurred');
				console.log(e, e.message, e.stack);
			}finally {
				return this;
			}
		}
	}, {
		config: function(){
			this._config = this._config || require('config');

			return this._config;
		}
	})
});