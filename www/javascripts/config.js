/* globals define, _, ENV */
define('config', function () {
    'use strict';
    // Production config
    // See below for dev config
    var config = {
        name: '',
        version: '0.1',
        API: {
            URL: 'https://devapi.zagster.com',
            APPID: 'N7Cc2dqgsnPnEcQ92uheW2AnnRHaAP' 
        },

        mapDefault: {
            defaultSearchRange: 3*1000,
            zoom: 14,
            mapId: '',
            zoomControlPosition: 'bottomright',
            circle: {
                color: '#FF872D',      // Stroke color
                opacity: 0.8,         // Stroke opacity
                weight: 1,         // Stroke weight
                fillColor: '#FF872D',  // Fill color
                fillOpacity: 0.1   // Fill opacity
            },
            userMarker: {
                iconUrl: 'http://localhost/images/userMarker.png',
                iconSize: [25, 25],
                iconAnchor: [12.5, 12.5],
                className: 'userMarker'
            }
        },

        defaultGeolocation: {
            enableHighAccuracy: true,
            maximumAge: 1000 * 60 * 5,
            timeout: 1000 * 60 * 2
        },

        spinner: {
            lines: 10, // The number of lines to draw
            length: 12, // The length of each line
            width: 6, // The line thickness
            radius: 12, // The radius of the inner circle
            corners: 1.0, // Corner roundness (0..1)
            rotate: 0, // The rotation offset
            direction: 1, // 1: clockwise, -1: counterclockwise
            color: '#555555', // #rgb or #rrggbb
            speed: 0.9, // Rounds per second
            trail: 40, // Afterglow percentage
            shadow: false, // Whether to render a shadow
            hwaccel: true, // Whether to use hardware acceleration
            className: 'spinner', // The CSS class to assign to the spinner
            zIndex: 2e9, // The z-index (defaults to 2000000000)
            top: 0, // Top position relative to parent in px
            left: -12 // Left position relative to parent in px
        },

        pageSpinner: {
            color: '#fff',
            parentClass: 'pageSpinner',
            length: 15,
            top: 30,
            left: 40,
            width: 4,
            shadow: true,
            radius: 20
        },

        dialogSpinner: {
            width: 2,
            radius: 5,
            length: 6,
            color: '#fff',
            parentClass: 'dialogSpinner',
            left: 5,
            top: 5
        },

        drawerItems: [
            {}
        ],

        views: {
            index: {
                id: 'index',
                location: 'index.html'
            },
            login: {
                id: 'login',
                location: '/views/login/put.html'
            },
            signup: {
                id: 'signup',
                location: '/views/login/new.html'
            },
            find: {
                id: 'findBikeshare',
                location: '/views/login/find.html'
            },
            networks: {
                id: 'networks',
                location: '/views/login/networks.html'
            },
            network: {
                id: 'network',
                location: '/views/login/network.html'
            }
        }
    };
    /*
    if(ENV === 'DEV'){
        var devconf = {
            name: i18n.APPNAME + ' Dev',
            version: '0.1 Dev'

        };
        _.extend(config, devconf);
    }*/

    return config;
});