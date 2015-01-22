/* jshint node: true */
'use strict';

module.exports = function(config) {
  var grunt = config.grunt;
  var commons = require('camunda-commons-ui');
  var _ = commons.utils._;
  var rjsConf = commons.requirejs();


  var deps = [
    'requirejs',
    'angular-route',
    'angular-resource',
    'angular-sanitize',
    'angular-ui',
    'ngDefine',
    'jquery-ui-draggable'
  ];

  var rConf = {
    options: {
      stubModules: ['text'],

      optimize: '<%= (buildTarget === "dist" ? "uglify2" : "none") %>',
      preserveLicenseComments: false,
      generateSourceMaps: true,

      baseUrl: './<%= pkg.gruntConfig.clientDir %>',

      paths: _.extend(rjsConf.paths, {
        // 'camunda-admin-ui': 'admin'
      }),

      shim: _.extend(rjsConf.shim, {}),

      packages: rjsConf.packages.concat([
        {
          name: 'admin',
          location: 'scripts',
          main: 'admin'
        }
      ])
    },


    dependencies: {
      options: {
        create: true,
        name: '<%= pkg.name %>-deps',
        out: '<%= buildTarget %>/scripts/deps.js',
        include: deps.concat([
          // 'camunda-cockpit-ui/require-conf'
        ])
      }
    },

    scripts: {
      options: {
        name: 'admin',
        out: '<%= buildTarget %>/scripts/<%= pkg.name %>.js',
        exclude: deps.concat([
          // 'camunda-cockpit-ui/require-conf'
        ]),
        include: ['admin'], //rjsConf.shim['camunda-cockpit-ui'],

        onModuleBundleComplete: function (data) {
          var buildTarget = grunt.config('buildTarget');
          var livereloadPort = grunt.config('pkg.gruntConfig.livereloadPort');
          if (buildTarget !== 'dist' && livereloadPort) {
            grunt.log.writeln('Enabling livereload for ' + data.name + ' on port: ' + livereloadPort);
            var contents = grunt.file.read(data.path);

            contents = contents
                        .replace(/\/\* live-reload/, '/* live-reload */')
                        .replace(/LIVERELOAD_PORT/g, livereloadPort);

            grunt.file.write(data.path, contents);
          }
        }
      }
    }
  };

  return rConf;
};
