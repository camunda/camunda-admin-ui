module.exports = function(config, browserifyConfig) {
  'use strict';

  browserifyConfig.admin_scripts = {
    options: {
      browserifyOptions: {
        standalone: 'CamundaAdminUi'
      },
      transform: [
        [ 'exposify',
          {
            expose: {
             // do not embed angular, instead, use window.angular
             'angular': 'angular',
            }
          }
        ]
      ]
    },
    src: ['./<%= pkg.gruntConfig.adminSourceDir %>/scripts/camunda-admin-ui.js'],
    dest: '<%= pkg.gruntConfig.adminBuildTarget %>/scripts/camunda-admin-ui.js'
  };

};
