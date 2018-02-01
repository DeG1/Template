var gulp = require('gulp'),
    spritesmith = require('gulp.spritesmith'), // Plugin for sprites
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    useref = require('gulp-useref'),
    gulpif = require('gulp-if'), // Filtering files which are connected to index.html file
    uglify = require('gulp-uglify'), // Minifying js files
    minifyCss = require('gulp-clean-css'), // Minifying css files
    clean = require('gulp-clean');// Cleaning production folder
    
 

// Clean dist
gulp.task('clean', function () {
    return gulp.src('dist', {read: false})
        .pipe(clean());
});


// Build proj in dist folder (First of all running clean which caused to cleaning everything in dist folder and then again build )
gulp.task('build',['clean'], function () { 
    return gulp.src('app/*.html')
        .pipe(useref())
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', minifyCss()))
        .pipe(gulp.dest('dist'));
});



gulp.task('sprite', function () {
  var spriteData = gulp.src('app/images/*.png').pipe(spritesmith({
    imgName: 'sprite.png',
    cssName: '_sprite.scss',
    padding: 20
  }));
  return spriteData.pipe(gulp.dest('app/sass/layout'));
});


gulp.task('sass', function(){
   return gulp.src('app/sass/**/*.scss') // Take sass file
    .pipe(sass()) // transform it into css
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({
       stream:true// browser-sync will inject css and substitute it in DOM
   }))
});


gulp.task('browser-sync', function(){
   browserSync({
          server:{
            baseDir: 'app'// Select which dir have our server
       },
          notify: false // disable notification
   });
});


gulp.task('watch', ['browser-sync', 'sass'], function(){
   gulp.watch('app/sass/**/*.scss', ['sass']); 
   gulp.watch('app/*.html', browserSync.reload);
   gulp.watch('app/js/**/*.js', browserSync.reload);
});