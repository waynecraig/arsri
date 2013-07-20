module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: {
      files: ['release/*']
    },
    jshint: {
      files: {
        src: ['src/**/*.js']
      }
    },
    uglify: {

    },
    cssmin: {

    },
    copy: {
      static: {
        files: [{
          expand: true,
          cwd: 'src/static/',
          src: ['**/*'],
          dest: 'release/static/'
        }]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerTask('default', ['clean', 'jshint', 'copy:static']);

};