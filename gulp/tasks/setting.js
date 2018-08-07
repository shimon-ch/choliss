/**
 * Gulp Task: setting
 * First task
 */

import path from 'path'
import minimist from 'minimist'
import Registry from 'undertaker-registry'
import fs from 'fs-extra'
import https from 'https'
import csv from 'csvtojson'
import prettierPlugin from 'gulp-prettier-plugin'
import config from '../config'

class Setting extends Registry {
  init(gulp) {
    const mkdirRoots = callback => {
      for (const key in config.dir) {
        fs.mkdir(config.dir[key], err => {
          if (err) {
            console.log('errorです')
          }
        })
      }

      callback()
    }

    const mkdirTools = callback => {
      for (const key in config.tools) {
        fs.mkdir(path.join(config.dir.src, config.tools[key]), err => {
          if (err) {
            console.log('errorです')
          }
        })
      }

      callback()
    }

    const mkdirData = callback => {
      for (const key in config.data) {
        fs.mkdir(path.join(config.dir.src, config.tools.data, config.data[key]), err => {
          if (err) {
            console.log('errorです')
          }
        })
      }

      callback()
    }

    const csvToJson = callback => {
      const dataLength = Object.keys(config.dataFile.dataname).length
      let count = 1

      for (const key in config.dataFile.dataname) {
        const csvFilePath = path.join(config.dataCsv, key + '.csv')
        const URL = config.dataFile.dataname[key]

        csv({
          noheader: false
        })
        .fromFile(https.request(URL))
        .subscribe(() => {
          if (count === dataLength){
            console.log('処理が完了');
            console.log(count);
            return gulp.src(path.join(config.dir.src, config.dataJson, '*.json'))
            .pipe(prettierPlugin(undefined, { filter: true }))
            .pipe(gulp.dest(path.join(config.dir.src, config.dataJson)))
          } else {
            console.log('まだ処理が未完了');
            count++
            console.log(count);
          }
        })
        .on('done', (error) => {
          callback;
        })
      }
    }

    const fileCopy = callback => {
      const args_setting = {
        string: 'env',
        default: {
          default: process.env.NODE_ENV || 'default/',
          hc: process.env.NODE_ENV || 'hc/',
        },
      }

      const argv = minimist(process.argv.slice(2), args_setting);

      console.log(argv);

      if (argv.default === true) {
        for (let tool in config.tools) {
          if (tool === 'data') continue;
          fs.copySync(
            path.join(config.dir.tmp, 'default/', tool, '/'),
            path.join(config.dir.src, tool, '/'),
            () => {
              return console.log('template default ' + tool + ' をコピーしました')
            }
          )
        }
      } else {
        for (let tool in config.tools) {
          if (tool === 'data') continue;
          fs.copySync(
            path.join(config.dir.tmp, argv, tool, '/'),
            path.join(config.dir.src, tool, '/'),
            () => {
              return console.log('template ' + argv + tool + ' をコピーしました')
            }
          )
        }
      }

      callback()
    }

    const fileSet = callback => {
      const sitemapDataPath = path.join(config.dir.src, config.dataJson, 'sitemap.json')
      const sitemapData = JSON.parse(fs.readFileSync(sitemapDataPath, 'utf8'))
      console.log(sitemapDataPath);

      for (const pages in config.sitemapData) {
        fs.outputFileSync(
          path.join(config.dir.src, config.tools.ejs, config.sitemapData[pages].page, '.ejs'),
          ''
        );
        fs.outputFileSync(
          path.join(config.dir.src, config.tools.sass, config.sitemapData[pages].page, '.scss'),
          ''
        )
      }

      callback()
    }

    gulp.task('mkdirRoots', mkdirRoots)
    gulp.task('mkdirTools', mkdirTools)
    gulp.task('mkdirData', mkdirData)
    gulp.task('csvToJson', csvToJson)
    gulp.task('fileCopy', fileCopy)
    gulp.task('fileSet', fileSet)

    const fileCreate = () => {
      return gulp.series(
        `mkdirRoots`,
        `mkdirTools`,
        `mkdirData`,
        `csvToJson`,
        `fileCopy`,
        'fileSet'
      )()
    }

    gulp.task('setting', fileCreate)
  }
}

export default new Setting()