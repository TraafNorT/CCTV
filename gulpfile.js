const { watch, series, parallel, src, dest} = require('gulp');
const browsersync = require('browser-sync').create();

function stylecompile (cb) {
  return src('style/style.css')
    .pipe(dest('output/'));
  cb();
}

function scriptscompile (cb) {
  return src([
    'script/main.js',
    'script/camDraw.js'
  ])
    .pipe(dest('output/'));
  cb();
}

function htmlcompile (cb) {
  return src('site/index.html')
    .pipe(dest('output/'));
  cb()
}

function server (cb) {
  browsersync.init({
    server: {
      baseDir: './output'
    }
  });
  watch(['*.js','*.css','*.html']).on('change', browsersync.reload);
  cb();
}

exports.default = series(scriptscompile, stylecompile, htmlcompile, server)
