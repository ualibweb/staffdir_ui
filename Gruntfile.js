'use strict';
module.exports = function(grunt) {
    // Load all tasks
    require('load-grunt-tasks')(grunt);
    // Show elapsed time
    require('time-grunt')(grunt);


    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        bower: 'bower_components',
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: [
                'Gruntfile.js',
                'src/**/*.js'
            ]
        },
        less: {
            dev: {
                files: {
                    'dist/staffdir.css': 'src/main.less'
                },
                options: {
                    compress: false
                }
            },
            build: {
                files: {
                    'dist/staffdir.min.css': 'src/main.less'
                },
                options: {
                    compress: true
                }
            }
        },
        html2js:{
            dev: {
                src: ['src/**/*.tpl.html', '!src/staff-directory-listing.tpl.html', '!src/staff-card/staff-card-sm.tpl.html'],
                dest: 'dist/staffdir-templates.js',
                module: 'ualib.staffdir.templates'
            }
        },
        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: 'src/**/*.js',
                dest: 'dist/staffdir.js'
            },
            index: {
                src: 'src/index.html',
                dest: 'dist/index.html',
                options: {
                    process: true
                }
            }
        },
        ngAnnotate: {
            options: {
                singleQuotes: true
            },
            app: {
                files: [
                    {
                        'dist/staffdir.js': ['dist/staffdir.js']
                    }
                ]
            }
        },
        uglify: {
            options: {
                mangle: true
            },
            app: {
                files: {
                    'dist/staffdir.min.js': ['dist/staffdir-templates.js', 'dist/staffdir.js']
                }
            }
        },
        bump: {
            options: {
                files: ['package.json', 'bower.json'],
                updateConfigs: ['pkg'],
                commit: false,
                commitMessage: 'Release v%VERSION%',
                commitFiles: ['package.json', 'bower.json'],
                createTag: true,
                tagName: 'v%VERSION%',
                tagMessage: 'Version %VERSION%',
                push: false,
                pushTo: 'origin',
                gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d',
                globalReplace: false,
                prereleaseName: false,
                regExp: false
            }
        }
    });

    // Register tasks
    grunt.registerTask('default', [
        'dev'
    ]);
    grunt.registerTask('dev', [
        'html2js',
        'jshint',
        'less:dev',
        'concat'
    ]);
    grunt.registerTask('build', [
        'html2js',
        'jshint',
        'ngAnnotate',
        'uglify',
        'less:build',
        'concat:index'
    ]);
};