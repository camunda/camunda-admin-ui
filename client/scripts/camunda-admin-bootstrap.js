define('camunda-admin-bootstrap', [
  'ngDefine'
], function () {
  'use strict';

  var pluginPackages = window.PLUGIN_PACKAGES || [];
  var pluginDependencies = window.PLUGIN_DEPENDENCIES || [];

  require.config({
    packages: pluginPackages,
    baseUrl: '../'
  });

  var dependencies = ['./scripts/camunda-admin-ui'].concat(pluginDependencies.map(function(plugin) {
    return plugin.requirePackageName;
  }));

  require(dependencies, function(camundaAdminUi) {
    camundaAdminUi(pluginDependencies);
  });
});

require.config({
  baseUrl: '../../../lib'
});

require(['camunda-admin-bootstrap'], function(){});
