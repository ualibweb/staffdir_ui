'use strict';
module.exports = function(grunt) {
    // Load all tasks
    require('load-grunt-tasks')(grunt);
    // Show elapsed time
    require('time-grunt')(grunt);
    var serveStatic = require('serve-static');

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
                dest: 'tmp/templates.js',
                module: 'ualib.staffdir.templates'
            }
        },
        concat: {
            dist: {
                options: {
                    separator: ';'
                },
                src: ['tmp/templates.js', 'src/**/*.js'],
                dest: 'dist/staffdir.js'
            },
            demo: {
                options: {
                    process: true
                },
                src: 'src/index.html',
                dest: 'dist/index.html'
            }
        },
        dev_prod_switch: {
            dev: {
                options: {
                    environment: 'dev'
                },
                files: {
                    'dist/index.html': 'dist/index.html'
                }
            },
            live: {
                options: {
                    environment: 'prod'
                },
                files: {
                    'dist/index.html': 'dist/index.html'
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
                    'dist/staffdir.min.js': ['dist/staffdir.js']
                }
            }
        },
        clean: {
            app: ['tmp/']
        },
        watch: {
            less: {
                files: ['src/**/*.less'],
                tasks: ['less:dev']
            },
            ng: {
                files: ['src/**/*.js', 'src/**/*.tpl.html'],
                tasks: ['html2js', 'jshint', 'concat', 'clean', 'ngdocs']
            },
            index: {
                files: ['src/index.html'],
                tasks: ['dev_prod_switch:dev']
            },
            livereload: {
                // Here we watch the files the sass task will compile to
                // These files are sent to the live reload server after sass compiles to them
                options: { livereload: true },
                files: ['dist/**/*', 'docs/**/*']
            }
        },
        connect: {
            live: {
                options: {
                    open: true,
                    keepalive: true,
                    hostname: 'localhost',
                    base: {
                        path: 'dist',
                        options: {
                            index: 'index.html'
                        }
                    },
                    middleware: function(connect) {
                        return [
                            serveStatic('.tmp'),
                            connect().use('/bower_components', serveStatic('./bower_components')),
                            serveStatic('./dist')
                        ];
                    }
                }
            },
            dev: {
                options: {
                    livereload: true,
                    open: true,
                    hostname: 'localhost',
                    base: {
                        path: 'dist',
                        options: {
                            index: 'index.html'
                        }
                    },
                    middleware: function(connect) {
                        return [
                            serveStatic('.tmp'),
                            connect().use('/bower_components', serveStatic('./bower_components')),
                            serveStatic('./dist')
                        ];
                    }
                }
            },
            docs: {
                options: {
                    livereload: true,
                    open: true,
                    hostname: 'localhost',
                    base: {
                        path: 'docs',
                        options: {
                            index: 'index.html'
                        }
                    }
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
        },
        ngdocs: {
            options: {
                dest: 'docs',
                html5Mode: false,
                startPage: 'api/staffdir',
                sourceLink: true,
                title: "Staff Directory UI Docs",
                titleLink: "api/staffdir"
            },
            api: {
                src: ['src/**/*.js', '!src/**/*.spec.js'],
                title: 'API Documentation'
            }
        },
        'gh-pages': {
            options: {
                base: 'docs'
            },
            firstTarget: {
                src: ['**/*']
            }
        },
        auto_install: {
            local: {}
        }
    });

    // Register tasks
    grunt.registerTask('default', [
        'dev-build', 'connect:dev', 'watch'
    ]);
    grunt.registerTask('dev-build', [
        'auto_install',
        'html2js',
        'jshint',
        'less:dev',
        'concat',
        'clean',
        'dev_prod_switch:dev'
    ]);
    grunt.registerTask('live-build', [
        'auto_install',
        'html2js',
        'jshint',
        'ngAnnotate',
        'uglify',
        'less:build',
        'clean',
        'dev_prod_switch:live'
    ]);

    grunt.registerTask('docs', ['connect:docs', 'watch']);
    grunt.registerTask('demo-live', ['live-build', 'connect:live']);
};