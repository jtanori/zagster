/*
 * Default Gruntfile for AppGyver Steroids
 * http://www.appgyver.com
 *
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

	grunt.loadNpmTasks("grunt-steroids");
	grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.loadNpmTasks('grunt-jade');


  	grunt.registerTask("steroids-compass", "Compile sass files from the stylesheets and put them in the /dis directory", function() {
	  grunt.extendConfig({
	    compass: {
            options: {
                sassDir: 'www/stylesheets',
                cssDir: 'dist/stylesheets',
                imagesDir: 'www/images',
                fontsDir: 'www/fonts',
                httpImagesPath: '/images',
                relativeAssets: false,
                debugInfo: false
            },
            dis: {}
        }
	  });
	  return grunt.task.run("compass");
	});

	grunt.registerTask("steroids-jade", "Compile jade templates", function() {
	  grunt.extendConfig({
	    jade: {
            dist: {
                files: {
                    'dist/javascripts/templates/': ['app/templates/**.jade']
                },
                options: {
                    dependencies: 'jade',
                    wrap: {
                        wrap: true,
                        amd: true,
                        dependencies: 'jade'
                    }
                }
            }
        }
	  });
	  return grunt.task.run("jade");
	});

  	grunt.registerTask("default", ["steroids-make", "steroids-compass", "steroids-jade"]);

};
