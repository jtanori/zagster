/* global define, Backbone, i18n */
define(['config'], function (config) {
	'use strict';
    return Backbone.Model.extend({
        urlRoot: config.API.URL,
        url: function(){
            return this.urlRoot + '/User/CreateUser2?appid=' + config.API.APPID;
        },
        defaults: {
        	firstName:     null,
            lastName:      null,
            email:         null,
            phone:         null,
            password:      null
        },

        labels: {
        	firstName:     i18n['First Name'],
            lastName:      i18n['Last Name'],
            email:         i18n['Email Address'],
            phone:         i18n['Mobile Number'],
            password:      i18n.Password
        },

        validation: {
        	firstName: {
        		required: true
        	},
            lastName: {
                required: true
            },
            email: {
                required: true,
                pattern: 'email'
            },
            phone: {
                required: true,
                pattern: 'number'
            },
            password: {
                required: true,
                minLength: 5
            }
        },
        confirmPassword: function (value, attr, computedState) {
            if (value !== computedState.password) {
                return i18n['Password confirmation does not match Password'];
            } else if (_.isEmpty(value)) {
                return i18n['Password confirmation is required'];
            }
        },
        initialize: function () {}
    });
});