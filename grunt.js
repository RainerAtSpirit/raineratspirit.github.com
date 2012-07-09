module.exports = function (grunt) {
// project configuration
    var SRC_CSS = 'assets/themes/the-program/';

    grunt.initConfig({

        less : {
            css : {
                src : [SRC_CSS + 'style.less'],
                dest : SRC_CSS + 'css/style.css'
            }
        },
        cssmin : {
            css : {
                src : SRC_CSS + 'style.css',
                dest : SRC_CSS + 'style-min.css'
            }
        }
    });

// loading less and css support
    grunt.loadNpmTasks('grunt-less');
    grunt.loadNpmTasks('grunt-css');

// Default task.
    grunt.registerTask('default', 'less cssmin');
}