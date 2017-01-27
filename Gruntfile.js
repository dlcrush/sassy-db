module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-mocha');
  grunt.loadNpmTasks('grunt-mocha-cli');

  grunt.initConfig({
      sass: {
          options: {
              sourceMap: false
          },
          dist: {
              files: {
                  'main.css': 'main.scss'
              }
          }
      },
      mochacli: {
         all: ['test/test.js']
      }
  });

  grunt.registerTask('default', ['sass']);
  grunt.registerTask('test', ['mochacli']);
}
