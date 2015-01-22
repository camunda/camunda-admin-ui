/* jshint browser: true */
/* global define: false*/
'use strict';
define([
  'angular',
  'angular-route',
  'angular-resource',
  'angular-sanitize',
  'angular-ui',
  'ngDefine',
  'jquery-ui-draggable'

  // './directives/main',
  // './filters/main',
  // './pages/main',
  // './resources/main',
  // './services/main',
  // 'camunda-commons-ui',
  // 'angular-resource',
  // 'angular-sanitize',
  // 'angular-ui',
  // 'ngDefine'
], function () {
  var APP_NAME = 'cam.admin';

  var pluginPackages = window.PLUGIN_PACKAGES || [];
  var pluginDependencies = window.PLUGIN_DEPENDENCIES || [];


  require.config({
    packages: pluginPackages
  });


  var dependencies = [
    'camunda-commons-ui'
  ].concat(pluginDependencies.map(function(plugin) {
    return plugin.requirePackageName;
  }));



  require(dependencies, function() {

    var ngDependencies = [
      'ng',
      'ngResource',
      require('camunda-commons-ui').name,
      require('./directives/main').name,
      require('./filters/main').name,
      require('./pages/main').name,
      require('./resources/main').name,
      require('./services/main').name
    ].concat(pluginDependencies.map(function(el){
      return el.ngModuleName;
    }));

    var angular = require('angular');
    var $ = require('jquery');
    var appNgModule = angular.module(APP_NAME, ngDependencies);

    var ModuleConfig = [
      '$routeProvider',
      'UriProvider',
    function(
      $routeProvider,
      UriProvider
    ) {
      $routeProvider.otherwise({ redirectTo: '/dashboard' });

      function getUri(id) {
        var uri = $('base').attr(id);
        if (!id) {
          throw new Error('Uri base for ' + id + ' could not be resolved');
        }

        return uri;
      }

      UriProvider.replace(':appName', 'cockpit');
      UriProvider.replace('app://', getUri('href'));
      UriProvider.replace('adminbase://', getUri('app-root') + '/app/admin/');
      UriProvider.replace('cockpit://', getUri('cockpit-api'));
      UriProvider.replace('admin://', getUri('cockpit-api') + '../admin/');
      UriProvider.replace('plugin://', getUri('cockpit-api') + 'plugin/');
      UriProvider.replace('engine://', getUri('engine-api'));

      UriProvider.replace(':engine', [ '$window', function($window) {
        var uri = $window.location.href;

        var match = uri.match(/\/app\/cockpit\/(\w+)(|\/)/);
        if (match) {
          return match[1];
        } else {
          throw new Error('no process engine selected');
        }
      }]);
    }];

    appNgModule.config(ModuleConfig);

    require([
      'domReady!'
    ], function () {
      angular.bootstrap(document, [ appNgModule.name ]);
      var html = document.getElementsByTagName('html')[0];

      html.setAttribute('ng-app', appNgModule.name);
      if (html.dataset) {
        html.dataset.ngApp = appNgModule.name;
      }

      if (top !== window) {
        window.parent.postMessage({ type: 'loadamd' }, '*');
      }
    });



    /* live-reload
    // loads livereload client library (without breaking other scripts execution)
    require(['jquery'], function($) {
      $('body').append('<script src="//localhost:LIVERELOAD_PORT/livereload.js?snipver=1"></script>');
    });
    /* */
  });
});

