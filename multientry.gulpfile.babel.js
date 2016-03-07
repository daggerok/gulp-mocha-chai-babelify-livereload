import gulp       from 'gulp'
import foreach    from 'gulp-foreach'
import path       from 'path'
import browserify from 'browserify'
import babelify   from 'babelify'
import stream     from 'vinyl-source-stream'
import concat     from 'gulp-concat'
import livereload from 'gulp-livereload'
import open       from 'gulp-open'

let
src     = 'src/**/*.*',
sources = 'sources.js',
mocha   = 'mocha/',
test    = 'test/**/*.*',
tests   = 'tests.js',
any     = 'mocha/**/*.*',
dist    = 'dist/',
brwCfg  = {
  debug: true,
  insertGlobals: true,
},
es6Cfg  = {
  presets: ['es2015'],
  plugins: ['transform-runtime']
}

gulp.task('sources', (done) => {
  gulp.src(src)
    .pipe(foreach((s, file) => {
      return browserify(brwCfg)
      .add(file.path)
      .transform(babelify, es6Cfg)
      .bundle()
    }))
    .on('error', console.log)
    .pipe(stream(sources))
    .pipe(gulp.dest(dist))
    .pipe(livereload())

  return done()
})

gulp.task('tests', ['sources'], (done) => {
  return gulp.src(test)
    .pipe(foreach((s, file) => {
      return browserify(brwCfg)
      .add(file.path)
      .transform(babelify, es6Cfg)
      .bundle()
    }))
    .on('error', console.log)
    .pipe(stream(tests))
    .pipe(gulp.dest(dist))
    .pipe(livereload())

})

gulp.task('deploy', () => {
  return gulp.src([
      'node_modules/chai/chai.js',
      any
    ])
    .pipe(gulp.dest(dist))
    .pipe(livereload())
})

gulp.task('default', ['sources', 'tests', 'deploy'])

gulp.task('tdd', ['default'], () => {
  livereload.listen({ basePath: dist })
  
  gulp.watch([src, test], ['tests'])
  gulp.watch([any], ['deploy'])

  return gulp.src(dist)
      .pipe(open({ uri: 'http://localhost:3000' }))
})
