'use strict';

/* ==========================================
あとでconfigとしてまとめたいもの、CONFIGここから
============================================= */

const proxySite = '';

/* ---------------
  各種読み込み先のパス
  各種dist先のパス
--------------- */
const rootPaths = {
  src: 'source/',
  dst: 'public/'
}

// 使ってるtoolsをまとめる
const tools = {
  sass: 'sass/',
  js:   'js/',
  img:  'img/',
  ejs:  'ejs/',
  data: 'data/'
}

// 各種assetsのdist先
const assetsRoot = rootPaths.dst + 'assets/';

// dist先のassetsをまとめる
const assets = {
  css: 'css/',
  js:   'js/',
  img:  'img/'
}

// 使ってるdata各種をまとめる
const data = {
  csv:  'csv/',
  json: 'json/'
}

// dataのパスをまとめる
const dataCsv  = tools.data + data.csv;
const dataJson = tools.data + data.json;


// sitemapCSVのURL
const dataFile = {
  dataname: {
    sitemap: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSOmbyBeIRQ52JL9l0AN70RERLvL3Mnys1v08M_o-JWdR7sAYunDCeuAXBxzUIzcaUIqLmNT5RlyD5m/pub?gid=1826907314&single=true&output=csv',
    shopdate: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSOmbyBeIRQ52JL9l0AN70RERLvL3Mnys1v08M_o-JWdR7sAYunDCeuAXBxzUIzcaUIqLmNT5RlyD5m/pub?gid=1970705233&single=true&output=csv'
  }
}


/* ==========================================
ここまで
============================================= */


// BASE
//--------------------
import 'babel-polyfill';
import gulp   from 'gulp';
import fs     from 'fs';
import path   from 'path';

// UTILITY
//--------------------
import babel                from 'gulp-babel';
import browserSync          from 'browser-sync';
import cached               from 'gulp-cached';
import prettify             from 'gulp-jsbeautifier';
import changed              from 'gulp-changed';
import cssmqpacker          from 'css-mqpacker';
import csso                 from 'gulp-csso';
import cssnext              from 'postcss-cssnext';
import del                  from 'del';
import ejs                  from 'gulp-ejs';
import frontMatter          from 'gulp-front-matter';
import https                from 'https';
import minimist             from 'minimist';
import progeny              from 'gulp-progeny';
import rename               from 'gulp-rename';
import csvtojson            from 'gulp-csvtojson';
import notify               from 'gulp-notify';
import plumber              from 'gulp-plumber';
import convertEncoding      from 'gulp-convert-encoding';
import sass                 from 'gulp-sass';
import sourcemaps           from 'gulp-sourcemaps';
import postcssflexbugsfixes from 'postcss-flexbugs-fixes';
import postcss              from 'gulp-postcss';
import request              from 'request';
import webpack              from 'webpack';
import webpackStream        from 'webpack-stream';
import imagemin             from 'gulp-imagemin';
import pngquant             from 'imagemin-pngquant';
import mozjpeg              from 'imagemin-mozjpeg';


// minimist
//--------------------
export function check(done) {
  var argv = minimist(process.argv.slice(2));
  console.dir(argv);

  done();
}

// csvをjsonファイルに変換
//--------------------

gulp.task('mkdirRoots', done => {
  for (let key in rootPaths) {
    fs.mkdir(rootPaths[key]);
  }

  done();
});

gulp.task('mkdirTools', done => {
  for (let key in tools) {
    fs.mkdir(rootPaths.src + tools[key]);
  }

  done();
});

gulp.task('mkdirData', done => {
  for (let key in data) {
    fs.mkdir(rootPaths.src + tools.data + data[key]);
  }

  done();
});

gulp.task('csvCreate', done => {
  for (let key in dataFile.dataname) {
    let csvFilePath = rootPaths.src + dataCsv + key + '.csv';
    let URL = dataFile.dataname[key];

    https.get(URL, function (res) {
      let responseString = '';
      let resultObject = '';

      res.on('data', function(chunk) {
        responseString += chunk;
      });

      res.on('end', function() {
        fs.appendFile(csvFilePath , responseString);
      });
    });

    console.log('CSVファイル出力に成功しました');
  }

  done();
});

gulp.task('csvToJson', done => {
  setTimeout(() => {
    return gulp.src( rootPaths.src + dataCsv + '*.csv' )
    .pipe(csvtojson({ toArrayString: true }))
    .pipe(prettify())
    .pipe(gulp.dest( rootPaths.src + dataJson ));
  }, 3000);

  done();
});

export function fileCreate() {
  return gulp.series(
    'mkdirRoots',
    'mkdirTools',
    'mkdirData',
    'csvCreate',
    'csvToJson'
  )();
}


// BROWSER-SYNC
//--------------------
export function sync(done) {
  browserSync({
    server: {
      baseDir: 'public/',
      index  : 'index.html'
    }
  });

  done();
}

export function reload(done) {
  browserSync.reload();

  done();
}

// EJS
// --------------------
export function html(done) {
  gulp.src( rootPaths.src + tools.ejs + '**/*.ejs' )
  .pipe(cached('html'))
  .pipe(progeny())
  .pipe(plumber({
    errorHandler: notify.onError('<%= error.message %>')
  }))
  .pipe(ejs({}, {}, {"ext": ".html"}))
  .pipe(gulp.dest( rootPaths.dst ));

  done();
}

// SASS
// --------------------
const sassOptions = {
  outputStyle: 'expanded',
  sourceMap: true,
  sourceComments: false
};

const postcssProcessors = [
  cssnext({
    browsers: ['last 2 versions'],
    features: {
      rem: {
        rootValue: 10
      },
      grid: true
    }
  }),
  postcssflexbugsfixes(),
  cssmqpacker()
];

export function css(done) {
  return gulp.src( rootPaths.src + tools.sass + '**/*.scss' )
  .pipe(plumber({
    errorHandler: notify.onError('<%= error.message %>')
  }))
  .pipe(cached('css'))
  .pipe(progeny())
  .pipe(sourcemaps.init())
  .pipe(sass(sassOptions))
  .pipe(gulp.dest( assetsRoot + assets.css ))
  .pipe(postcss(postcssProcessors))
  .pipe(csso())
  .pipe(sourcemaps.write('/maps/'))
  .pipe(gulp.dest( assetsRoot + assets.css ))
  .pipe(browserSync.reload({ stream:true }));
  done();
}


// JS
// --------------------
// webpackでbandle
// webpackの設定ファイルの読み込み
import webpackConfig from './webpack.config';

export function js(done) {
  return webpackStream(webpackConfig, webpack)
  .pipe(cached('js'))
  .pipe(progeny())
  .pipe(gulp.dest( assetsRoot + assets.js ));

  done();
}


// IMAGE-MIN
// --------------------
const imgType = {
  jpg: 'jpeg',
  gif: 'gif',
  svg: 'svg',
  png: 'png',
}

export function img(done) {
  return gulp.src( rootPaths.src + tools.img + '/**/*.{jpg,png,gif,svg}' )
  .pipe(plumber({
    errorHandler: notify.onError('<%= error.message %>')
  }))
  .pipe(changed( assetsRoot + assets.img ))
  .pipe(imagemin([
    pngquant({
      quality: '65-80', // 画質
      speed: 1, // 最低のスピード
      floyd: 0, // ディザリングなし
    }),
    mozjpeg({
      quality: 85, // 画質
      progressive: true
    }),
    imagemin.svgo(),
    imagemin.optipng(),
    imagemin.gifsicle()
  ]))
  .pipe(gulp.dest( assetsRoot + assets.img ));
  done();
}


/* destroy
============================================================== */
export function alldelete(done) {
   return del([
    './source',
    './source/*',
    './public',
    './public/*',
    './build',
    './build/*',
  ], function(){
    consol.log('source/,public/,build/ ディレクトリを削除しました。');
  });

  done();
}

/* watch
============================================================== */
export default function watch() {
  gulp.watch( rootPaths.src + tools.ejs + '**/*.ejs', html );
  gulp.watch( rootPaths.src + tools.sass + '**/*.scss', css );
  gulp.watch( rootPaths.src + tools.js + '**/*.js', js );
  gulp.watch( rootPaths.src + tools.img + '**/*.{jpg,png,gif,svg}', img );
  gulp.watch( rootPaths.dst + '**/*.html', reload );
  gulp.watch( assetsRoot + assets.js + '**/*.js', reload );
  gulp.watch( assetsRoot + assets.img + '**/*.{jpg,png,gif,svg}', reload );
}

// export default gulp.series( build, sync, gulp.parallel(html, css, js, img), watch );

/* watch
============================================================== */
// TODO
// publicディレクトリをコピーしつつ、htmlをsjisに変換(変換するかどうかは判定有りにするかも)

// export function build(done) {
//   done();
// }

//Cmd+CでWatch終了
