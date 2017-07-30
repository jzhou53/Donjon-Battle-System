
var gulp = require('gulp');
var babel = require( "gulp-babel");
var concat = require( 'gulp-concat');


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
    var folders = [
        'twbs_core',
        'main',
        'twbs_managers'
    ];
    //noinspection JSUnresolvedFunction
    folders.forEach(function (name) {
        gulp.src(dirs.src+'/'+name+'/*.js')
            .pipe(concat(name+'.js'))
            .pipe(babel())
            .pipe(gulp.dest(dirs.dest+'/js'));
    });




});
