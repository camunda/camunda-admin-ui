define('camunda-admin-bootstrap', [
  'ngDefine'
], function () {
  'use strict';

  var pluginPackages = window.PLUGIN_PACKAGES || [];
  var pluginDependencies = window.PLUGIN_DEPENDENCIES || [];

  require.config({
    packages: pluginPackages
  });

  var dependencies = ['./scripts/camunda-admin-ui'].concat(pluginDependencies.map(function(plugin) {
    return plugin.requirePackageName;
  }));

  console.log('these are my dependencies', dependencies);

  require(dependencies, function(camundaAdminUi) {
    console.log(camundaAdminUi);
    camundaAdminUi(pluginDependencies);

  });
});

require(['camunda-admin-bootstrap'], function(){});
