'use strict';

module.exports = function(grunt) {
  // show elapsed time at the end
  require('time-grunt')(grunt);

  // load tasks on demand (speeds up dev)
  require('jit-grunt')(grunt, {
    scsslint: 'grunt-scss-lint'
  });

  grunt.initConfig({
    yeoman: {
      src: 'src',
      dist: 'dist',
      test: 'test',
      pkg: grunt.file.readJSON('package.json'),
      meta: {
        banner: '/*! <%= yeoman.pkg.name %> - v<%= yeoman.pkg.version %> - ' +
          '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
          '* <%= yeoman.pkg.homepage %>\n' +
          '* Copyright © <%= grunt.template.today("yyyy") %> ' +
          '<%= yeoman.pkg.author.name %>; Licensed <%= yeoman.pkg.license %> */\n'
      },
    },
    watch: {
      qa: {
        files: [
          '<%= yeoman.src %>/iptools-jquery-modal.js',
          '<%= yeoman.test %>/spec/*.js',
          '<%= yeoman.src %>/iptools-jquery-modal.scss'
        ],
        tasks: ['concurrent:qa']
      },
      bdd: {
        files: [
          '<%= yeoman.src %>/iptools-jquery-modal.js',
          '<%= yeoman.test %>/spec/*.js',
          '<%= yeoman.test %>/index.html'
        ],
        tasks: ['test']
      },
      scss: {
        files: [
          '<%= yeoman.src %>/iptools-jquery-modal.scss'
        ],
        tasks: ['scsslint']
      }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        '<%= yeoman.src %>/{,*/}*.js',
        '<%= yeoman.test %>/spec/{,*/}*.js'
      ]
    },
    scsslint: {
      allFiles: [
        '<%= yeoman.src %>/{,*/}*.scss',
      ],
      options: {
        bundleExec: true,
        config: '.scss-lint.yml',
        reporterOutput: 'scss-lint-report.xml',
        colorizeOutput: true
      }
    },
    mocha: {
      all: {
        options: {
          run: true
        },
        src: ['<%= yeoman.test %>/index.html']
      }
    },
    concurrent: {
      qa: {
        tasks: [
          'jshint',
          'jscs',
          'scsslint',
          'mocha'
        ]
      },
      build: {
        tasks: [
          'uglify',
          'sass'
        ]
      }
    },
    uglify: {
      options: {
        banner: '<%= yeoman.meta.banner %>'
      },
      dist: {
        files: {
          '<%= yeoman.dist %>/iptools-jquery-modal.min.js': ['<%= yeoman.src %>/iptools-jquery-modal.js']
        }
      }
    },
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '<%= yeoman.dist %>/*'
          ]
        }]
      }
    },
    sass: {
      options: {
        sourceMap: false
      },
      dist: {
        files: {
          '<%= yeoman.dist %>/iptools-jquery-modal.css' : '<%= yeoman.src %>/iptools-jquery-modal.scss'
        }
      }
    },
    jscs: {
      options: {
        config: '.jscsrc',
        esnext: false,
        verbose: true
      },
      files: {
        src: [
          'Gruntfile.js',
          '<%= yeoman.test %>/spec/*.js',
          '<%= yeoman.src %>/*.js'
        ]
      }
    }
  });

  grunt.registerTask('test', ['mocha']);
  grunt.registerTask('qa', ['concurrent:qa']);

  grunt.registerTask('build', [
    'concurrent:qa',
    'clean:dist',
    'concurrent:build'
  ]);

  grunt.registerTask('default', ['build']);

  grunt.registerTask('travis', ['concurrent:qa']);
};
