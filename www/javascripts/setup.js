/* global define */
define('setup', 
    [
        'steroids',
        'preload',
        'jquery', 
        'underscore', 
        'backbone', 
        //'parse',
        'config',
        'jade',
        'nls/main',
        'backbone.validation',
        'hammer',
        'jquery.hammer',
        'aspect',
        'functional',
        'b',
        'g',
        'jquery.g'
    ], 
    function(steroids, steroidsPreload, $, _, Backbone, /*Parse,*/ config, jade, i18n, val, Hammer, $Hammer, Controller){

        //Get jade working (Freaking workaround)
        window.jade = jade;
        //Make the i18n.app object the main i18n file
        //TODO: Fix namespace
        window.i18n = i18n.app;

        //Use #{ } as template delimiters
        _.templateSettings = {
            interpolate: /\#\{(.+?)\}/g
        };
        
        //Extend validation mixin
        Backbone.Validation.mixin.validationString = function(){
            var validation = this.validate();
            var str = [];
            if(!_.isEmpty(validation)){
                _.each(validation, function(i, item){
                    str.push(validation[item]);
                }); 

                return str.join('\n');
            }

            return '';
        };

        //Custom patterns
        _.extend(Backbone.Validation.patterns, {
            phone: /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/
        });
        
        //TODO: Move this to the i18n file
        _.extend(Backbone.Validation.messages, {
            phone: '{0} must be a valid phone number'
        });

        //Extend models to accept validations
        _.extend(Backbone.Model.prototype, Backbone.Validation.mixin);
        
        //Configure validation plugin
        Backbone.Validation.configure({
            labelFormatter: 'label'
        });

        //Extend view to proper close
        Backbone.View.prototype.close = function () {
            this.unbind();
            if (this.onClose) {
                this.onClose();
            }
            this.remove();
            this.trigger('close');
        };

        //History override
        var originalLoadUrl = Backbone.History.prototype.loadUrl;
        Backbone.History.prototype.loadUrl = function (hash) {
            hash = hash || window.location.hash;
            //Save history referers for future usage
            window.referrer = window.referrer || {};
            window.referrer.previous = window.referrer.current;
            window.referrer.current = hash;

            try {
                return originalLoadUrl.apply(this, arguments);

            } catch (e) {
                if (e instanceof Redirect) {
                    Backbone.history.navigate(e.url, {
                        trigger: true
                    });
                } else {
                    Backbone.history.navigate('error', {
                        trigger: true
                    });
                    console.error(e, e.message, e.stack);
                }
            }
        };

        //Sync override
        var originalSync = Backbone.sync;
        Backbone.sync = function(method, model, options){
            
            options || (options = {});

            if (!options.crossDomain) {
              options.crossDomain = true;
            }

            return originalSync(method, model, options);
        };

        //Override WebView
        var originalWebView = steroids.views.WebView;
        steroids.views.WebView = function(options){
            var view = new originalWebView(options);

            if(options.content){
                view.content = options.content;
            }

            if(options.params){
                view.params = options.params;
            }

            return view;
        };

        steroids.views.WebView.prototype = originalWebView.prototype;

        //Override removeLoading
        steroids.views.WebView.prototype.hideLoading = function(){
            this.removeLoading();

            $('body').removeClass('loading');

            if(this.spinner){
                this.spinner.hide();
            }
            if(this.overlay){
                this.overlay.hide();
            }
        };

        //Extend showLoading
        steroids.views.WebView.prototype.showLoading = function(label){
            var $body = $('body');
            var show = function(){
                this.spinner.show();
                this.overlay.show();
            }.bind(this);

            $('body').addClass('loading');

            if(this.spinner){
                show();
            }else{
                this.overlay = $('<div id="spinner-overlay"></div>');
                this.spinner = $('<div id="spinner"></div>');
                $body.append(this.overlay);
                $body.append(this.spinner);
            }

            if( (_.isString(label) && this.spinner) && (this.spinner.html() !== label) ){
                this.spinner.html(label);
            }
        };

        steroids.alert = function(msg){
            this.msg = msg;
            setTimeout(function(){
                alert(this.msg);
            }.bind(this), 1);
        };

        var originalAlert = alert;
        alert = function(str){
            this.str = str;

            setTimeout(function(){
                originalAlert(this.str);
            }.bind(this), 1);
        };
        alert.prototype = originalAlert.prototype;

    }
);