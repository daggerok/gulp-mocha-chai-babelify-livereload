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
srcMain     = 'src/main.js',
srcBundle   = 'sources.js',
testMain    = 'test/main.test.js',
testBundle  = 'tests.js',
any         = 'resources/**/*.*',
dist        = 'dist/',
anySrc      = 'src/**/*.*',
anyTest     = 'test/**/*.*',
brwCfg      = {
  debug: true,
  insertGlobals: false,
},
es6Cfg      = {
  presets: ['es2015'],
  plugins: ['transform-runtime']
},
resources   = [
  'node_modules/chai/chai.js',
  'node_modules/mocha/mocha.js',
  'node_modules/mocha/mocha.css',
  any
]

gulp.task('sources', () => {
  return browserify(brwCfg)
    .add(srcMain)
    .transform(babelify, es6Cfg)
    .bundle()
    .on('error', console.log)
    .pipe(stream(srcBundle))
    .pipe(gulp.dest(dist))
})

gulp.task('tests', ['sources'], () => {
  return browserify(brwCfg)
    .add(testMain)
    .transform(babelify, es6Cfg)
    .bundle()
    .on('error', console.log)
    .pipe(stream(testBundle))
    .pipe(gulp.dest(dist))
    .pipe(livereload())
})

gulp.task('resources', () => {
  return gulp.src(resources)
    .pipe(gulp.dest(dist))
    .pipe(livereload())
})

gulp.task('default', ['sources', 'tests', 'resources'])

gulp.task('tdd', ['default'], () => {
  livereload.listen({ basePath: dist })
  
  gulp.watch([anySrc, anyTest], ['sources', 'tests'])
  gulp.watch([any], ['resources'])

  return gulp.src(dist)
      .pipe(open({ uri: 'http://localhost:3000' }))
})
