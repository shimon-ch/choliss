/* ==========================================
あとでconfigとしてまとめたいもの、CONFIGここから
============================================= */

/* ==========================================
ここまで
============================================= */

// BASE
//--------------------
import 'babel-polyfill';
import gulp from 'gulp';
import fs from 'fs-extra';
import path from 'path';

// UTILITY
//--------------------
import autoprefixer from 'autoprefixer';
import babel from 'gulp-babel';
import browserSync from 'browser-sync';
import cached from 'gulp-cached';
import prettify from 'gulp-jsbeautifier';
import changed from 'gulp-changed';
import cssmqpacker from 'css-mqpacker';
import csso from 'gulp-csso';
import postcss from 'gulp-postcss';
import postcssPresetEnv from 'postcss-preset-env';
import del from 'del';
import ejs from 'gulp-ejs';
import frontMatter from 'gulp-front-matter';
import https from 'https';
import minimist from 'minimist';
import progeny from 'gulp-progeny';
import csvtojson from 'gulp-csvtojson';
import notify from 'gulp-notify';
import plumber from 'gulp-plumber';
import convertEncoding from 'gulp-convert-encoding';
import sass from 'gulp-sass';
import sourcemaps from 'gulp-sourcemaps';
import request from 'request';
import webpack from 'webpack';
import webpackStream from 'webpack-stream';
import imagemin from 'gulp-imagemin';
import pngquant from 'imagemin-pngquant';
import mozjpeg from 'imagemin-mozjpeg';

// JS
// --------------------
// webpackでbandle
// webpackの設定ファイルの読み込み
import webpackConfig from './webpack.config';

const proxySite = '';

/* ---------------
  各種読み込み先のパス
  各種dist先のパス
--------------- */
const rootPaths = {
  src: 'source/',
  dst: 'public/',
};

// 使ってるtoolsをまとめる
const tools = {
  sass: 'sass/',
  js: 'js/',
  img: 'img/',
  ejs: 'ejs/',
  data: 'data/',
};

// 各種assetsのdist先
const assetsRoot = `${rootPaths.dst}assets/`;

// dist先のassetsをまとめる
const assets = {
  css: 'css/',
  js: 'js/',
  img: 'img/',
};

// 使ってるdata各種をまとめる
const data = {
  csv: 'csv/',
  json: 'json/',
};

// templateデータのパス
const templatePath = 'template/';

// dataのパスをまとめる
const dataCsv = tools.data + data.csv;
const dataJson = tools.data + data.json;

// sitemapCSVのURL
const dataFile = {
  dataname: {
    sitemap:
      'https://docs.google.com/spreadsheets/d/e/2PACX-1vSOmbyBeIRQ52JL9l0AN70RERLvL3Mnys1v08M_o-JWdR7sAYunDCeuAXBxzUIzcaUIqLmNT5RlyD5m/pub?gid=1826907314&single=true&output=csv',
    shopdate:
      'https://docs.google.com/spreadsheets/d/e/2PACX-1vSOmbyBeIRQ52JL9l0AN70RERLvL3Mnys1v08M_o-JWdR7sAYunDCeuAXBxzUIzcaUIqLmNT5RlyD5m/pub?gid=1970705233&single=true&output=csv',
  },
};

// csvをjsonファイルに変換
//--------------------
export const mkdirRoots = done => {
  for (const key in rootPaths) {
    fs.mkdir(rootPaths[key], err => {
      if (err) {
        console.log('errorです');
      }
    });
  }

  done();
};

export const mkdirTools = done => {
  for (const key in tools) {
    fs.mkdir(rootPaths.src + tools[key], err => {
      if (err) {
        console.log('errorです');
      }
    });
  }

  done();
};

export const mkdirData = done => {
  for (const key in data) {
    fs.mkdir(rootPaths.src + tools.data + data[key], err => {
      if (err) {
        console.log('errorです');
      }
    });
  }

  done();
};

export const csvCreate = done => {
  for (const key in dataFile.dataname) {
    const csvFilePath = `${rootPaths.src + dataCsv + key}.csv`;
    const URL = dataFile.dataname[key];

    https.get(URL, res => {
      let responseString = '';

      res.on('data', chunk => {
        responseString += chunk;
      });

      res.on('end', () => {
        fs.writeFile(csvFilePath, responseString, () => {
          return gulp
            .src(`${rootPaths.src + dataCsv}*.csv`)
            .pipe(csvtojson({ toArrayString: true }))
            .pipe(prettify())
            .pipe(gulp.dest(rootPaths.src + dataJson));
        });
      });
    });
  }

  done();
};

export const csvToJson = done => {
  setTimeout(
    () =>
      gulp
        .src(`${rootPaths.src + dataCsv}*.csv`)
        .pipe(csvtojson({ toArrayString: true }))
        .pipe(prettify())
        .pipe(gulp.dest(rootPaths.src + dataJson))
        .pipe(done()),
    5000
  );
};

export const fileCopy = done => {
  const args_setting = {
    string: 'env',
    default: {
      default: process.env.NODE_ENV || 'default/',
      hc: process.env.NODE_ENV || 'hc/',
    },
  };

  const argv = minimist(process.argv.slice(2), args_setting);

  console.log(argv);

  if (argv.default === true) {
    for (let tool in tools) {
      if (tool === 'data') continue;
      fs.copySync(
        templatePath + 'default/' + tool + '/',
        rootPaths.src + tool + '/',
        () => {
          return console.log('template default ' + tool + ' をコピーしました');
        }
      );
    }
  } else {
    for (let tool in tools) {
      if (tool === 'data') continue;
      fs.copySync(
        templatePath + argv + '/*' + '/',
        rootPaths.src + tool + '/',
        () => {
          return console.log('template ' + argv + tool + ' をコピーしました');
        }
      );
    }
  }

  done();
};

export const fileSet = done => {
  const sitemapDataPath = rootPaths.src + dataJson + 'sitemap.json';
  const sitemapData = JSON.parse(fs.readFileSync(sitemapDataPath, 'utf8'));

  for (const pages in sitemapData) {
    fs.outputFileSync(
      rootPaths.src + tools.ejs + sitemapData[pages].page + '.ejs',
      ''
    );
    fs.outputFileSync(
      rootPaths.src + tools.sass + sitemapData[pages].page + '.scss',
      ''
    );
  }

  done();
};

export const fileCreate = async () => {
  return gulp.series(
    mkdirRoots,
    mkdirTools,
    mkdirData,
    csvCreate,
    fileCopy,
    fileSet
  )();
};

// BROWSER-SYNC
//--------------------
export const sync = done => {
  browserSync({
    server: {
      baseDir: 'public/',
      index: 'index.html',
    },
  });

  done();
};

export const reload = () => {
  browserSync.reload();
};

// EJS
// --------------------
export const html = () => {

  return gulp
    .src(`${rootPaths.src + tools.ejs}**/*.ejs`)
    .pipe(cached('html'))
    .pipe(progeny())
    .pipe(
      plumber({
        errorHandler: notify.onError('<%= error.message %>'),
      })
    )
    .pipe(ejs({}, {}, { ext: '.html' }))
    .pipe(gulp.dest(rootPaths.dst));
};

// SASS
// --------------------
const sassOptions = {
  outputStyle: 'expanded',
  sourceMap: true,
  sourceComments: false,
};

export const css = () => {
  return gulp
    .src(`${rootPaths.src + tools.sass}**/*.scss`)
    .pipe(
      plumber({
        errorHandler: notify.onError('<%= error.message %>'),
      })
    )
    .pipe(cached('css'))
    .pipe(progeny())
    .pipe(sourcemaps.init())
    .pipe(sass(sassOptions))
    .pipe(gulp.dest(assetsRoot + assets.css))
    .pipe(postcss())
    .pipe(cssmqpacker())
    .pipe(csso())
    .pipe(sourcemaps.write('/maps/'))
    .pipe(gulp.dest(assetsRoot + assets.css))
    .pipe(browserSync.reload({ stream: true }));
}

// JS
// --------------------
export const js = () => {
  return webpackStream(webpackConfig, webpack)
    .pipe(cached('js'))
    .pipe(progeny())
    .pipe(gulp.dest(assetsRoot + assets.js));
}

// IMAGE-MIN
// --------------------
const imgType = {
  jpg: 'jpeg',
  gif: 'gif',
  svg: 'svg',
  png: 'png',
};

export const img = () => {
  return gulp
    .src(`${rootPaths.src + tools.img}/**/*.{jpg,png,gif,svg}`)
    .pipe(
      plumber({
        errorHandler: notify.onError('<%= error.message %>'),
      })
    )
    .pipe(changed(assetsRoot + assets.img))
    .pipe(
      imagemin([
        pngquant({
          quality: '65-80', // 画質
          speed: 1, // 最低のスピード
          floyd: 0, // ディザリングなし
        }),
        mozjpeg({
          quality: 85, // 画質
          progressive: true,
        }),
        imagemin.svgo(),
        imagemin.optipng(),
        imagemin.gifsicle(),
      ])
    )
    .pipe(gulp.dest(assetsRoot + assets.img));
}

/* destroy
============================================================== */
export const alldelete = () => {
  return del(
    [
      './source',
      './source/*',
      './public',
      './public/*',
      './build',
      './build/*',
    ],
    () => {
      console.log('source/,public/,build/ ディレクトリを削除しました。');
    }
  );
}

/* watch
============================================================== */
export const watch = () => {
  gulp.watch(`${rootPaths.src + tools.ejs}**/*.ejs`, html);
  gulp.watch(`${rootPaths.src + tools.sass}**/*.scss`, css);
  gulp.watch(`${rootPaths.src + tools.js}**/*.js`, js);
  gulp.watch(`${rootPaths.src + tools.img}**/*.{jpg,png,gif,svg}`, img);
  gulp.watch(`${rootPaths.dst}**/*.html`, reload);
  gulp.watch(`${assetsRoot + assets.js}**/*.js`, reload);
  gulp.watch(`${assetsRoot + assets.img}**/*.{jpg,png,gif,svg}`, reload);
}

export default gulp.series(sync, gulp.parallel(html, css, js, img), watch);

// TODO
// publicディレクトリをコピーしつつ、htmlをsjisに変換(変換するかどうかは判定有りにするかも)

// export function build(done) {
//   done();
// }

// Cmd+CでWatch終了
