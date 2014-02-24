define(function () {
	'use strict';
    return Backbone.Model.extend({
        defaults: {
        	username:  null,
            email:     null,
            password: null,
            confirmation: null
        },

        labels: {
        	username:     i18n.Username,
            email:        i18n['Email Address'],
            password:     i18n.Password,
            confirmation: i18n['Password confirmation']
        },

        validation: {
        	username: {
        		required: true
        	},
            email: {
                required: true,
                pattern: 'email'
            },
            password: {
                required: true,
                minLength: 5
            },
            confirmation: {
                required: true,
                fn: 'confirmPassword'
            }
        },
        confirmPassword: function (value, attr, computedState) {
            if (value !== computedState.password) {
                return i18n['Password confirmation does not match Password'];
            } else if (_.isEmpty(value)) {
                return i18n['Password confirmation is required'];
            }
        },
        url: '',
        initialize: function () {}
    });
});