/**
 * @type {Gulp}
 */
var gulp = require('gulp'),
    babel = require( "gulp-babel"),
    concat = require( 'gulp-concat');

/**
 * @type {{src: string, dest: string}}
 */
var dirs = {
    src: 'src',
    dest: 'dist'
};

gulp.task('default', ['build']);

/**
 * combine all files into one js file and then compile es6 into es5
 *
 */
gulp.task('build', function() {
    /**
     * @type {Array}
     */
    var folders = [
        'twbs_core',
        'main',
        'twbs_managers',
        'twbs_scenes'
    ];

    folders.forEach(function (name) {
        gulp.src(dirs.src+'/'+name+'/*.js')
            .pipe(concat(name+'.js'))
            .pipe(babel())
            .pipe(gulp.dest(dirs.dest+'/js'));
    });



});
