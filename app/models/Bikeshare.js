/* global define, Backbone */
define(function(require){
	var config = require('config');

	return Backbone.Model.extend({
		defaults: {

		},
		rootUrl: config.API.URL,
		url: function(){
			return this.rootUrl + '/Network/Network?appid=' + config.API.APPID + '&networkid=' + (this.get('NetworkID') || '');
		},
		initialize: function(){
			console.log('initialize bikeshare model');
		}
	});
});