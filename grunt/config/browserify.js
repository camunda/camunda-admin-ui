module.exports = function(config, browserifyConfig) {
  'use strict';

  browserifyConfig.admin_scripts = {
    options: {
      browserifyOptions: {
        standalone: 'CamundaAdminUi'
      },
      watch: true,
      transform: [
        [ 'exposify',
          {
            expose: {
             // do not embed angular, instead, use window.angular
             'angular': 'angular',
            }
          }
        ]
      ],
      postBundleCB: function(err, src, next) {

        console.log(typeof src);

        console.log('bundle is complete', err);

        var buildMode = config.grunt.config('buildMode');
        var livereloadPort = config.grunt.config('pkg.gruntConfig.livereloadPort');
        if (buildMode !== 'prod' && livereloadPort) {
          config.grunt.log.writeln('Enabling livereload for admin on port: ' + livereloadPort);
          //var contents = grunt.file.read(data.path);
          var contents = src.toString();

          contents = contents
                      .replace(/\/\* live-reload/, '/* live-reload */')
                      .replace(/LIVERELOAD_PORT/g, livereloadPort);

          next(err, new Buffer(contents));
        } else {
          next(err, src);
        }

      }
    },
    src: ['./<%= pkg.gruntConfig.adminSourceDir %>/scripts/camunda-admin-ui.js'],
    dest: '<%= pkg.gruntConfig.adminBuildTarget %>/scripts/camunda-admin-ui.js'
  };

};
