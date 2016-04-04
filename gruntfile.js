module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    concat: {
      options: {
        seperator: ';'
      },
      dist: {
        src: [
          'src/scripts/*.js'
        ],
        dest: 'dist/fantasy-football.combined.js'
      }
    },

    copy: {
      main: {
        files: [
          {
            expand: true,
            flatten: true,
            src: [
              'src/loader*.js',
              'src/templates/*.hbs',
              'src/library/*.js'
            ],
            dest: 'dist/'
          }
        ]
      }
    },

    clean: [
      'dist'
    ],

    watch: {
      scripts: {
        files: [
          'src/**/*'
        ],
        tasks: [
          'build'
        ],
        options: {
          spawn: false
        }
      }
    },

    less: {
      dist: {
        files: {
          './dist/styles.css': './src/styles/style.less'
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-less');

  grunt.registerTask('build', ['clean', 'concat', 'copy', 'less']);
  grunt.registerTask('default', ['build']);
};
