module.exports = function(grunt) {

  grunt.initConfig({
    uglify: {
      build: {
		  files: {
			  'dist/js/app.js' : ['lib/atomic.js', 'core/plugin.js', 'core/repository.js']
		  }
      }
  	},
	cssmin: {
	  target: {
		files: [{
		  expand: true,
		  cwd: 'assets/style',
		  src: ['*.css', '!*.min.css'],
		  dest: 'dist/style',
		  ext: '.min.css'
		}]
	  }
  },
  connect: {
    server: {
      options: {
        port: 8000,
        hostname: 'localhost',
		base: '.',
		keepalive: true
      }
    }
  }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-connect');

  grunt.registerTask('default', ['uglify', 'cssmin', 'connect']);

};
