/**
 * Gulp Task: setting
 * First task
 */

import Registry from 'undertaker-registry'
import https from 'https';

import config from '../config'

class Setting extends Registry {

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
  }

export new Setting()