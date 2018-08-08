/**
 * Gulp Task: setting
 * First task
 */

import path from 'path'
import minimist from 'minimist'
import Registry from 'undertaker-registry'
import fse from 'fs-extra'
import https from 'https'
import request from 'request'
import csv from 'csvtojson'
import prettierPlugin from 'gulp-prettier-plugin'
import config from '../config'

class Setting extends Registry {
  init(gulp) {
    const mkdirs = callback => {
      for (const key in config.dir) {
        fse.mkdirsSync(config.dir[key], err => {
          if (err) {
            console.log('errorです')
          }
        })
      }

      for (const key in config.tools) {
        fse.mkdirsSync(path.join(config.dir.src, config.tools[key]), err => {
          if (err) {
            console.log('errorです')
          }
        })
      }

      for (const key in config.data) {
        fse.mkdirsSync(path.join(config.dir.src, config.tools.data, config.data[key]), err => {
          if (err) {
            console.log('errorです')
          }
        })
      }

      callback()
    }

    const csvToJson = () => {
      const dataLength = Object.keys(config.dataFile.dataname).length
      let count = 1

      function jsonOutput() {
        if (dataLength === count){
          return gulp.src(path.join(config.dir.src, config.dataJson, '*.json'))
          .pipe(prettierPlugin(undefined, { filter: true }))
          .pipe(gulp.dest(path.join(config.dir.src, config.dataJson)))
        } else {
          ++count
        }
      }

      for (const key in config.dataFile.dataname) {
        const csvFilePath = config.dataFile.dataname[key]
        const jsonFilePath = path.join(config.dataJson, key + '.json')
        console.log(csv().fromFile(request.get(csvFilePath)))

        csv()
          .fromFile(request.get(csvFilePath))
          .subscribe((data) => {
            console.log(data)
            fse.outputFileSync(jsonFilePath, data)
          }).on('end', () =>{
            jsonOutput()
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
          fse.copySync(
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
          fse.copySync(
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
      const sitemapData = JSON.parse(fse.readFileSync(sitemapDataPath, 'utf8'))
      console.log(sitemapDataPath);

      for (const pages in config.sitemapData) {
        fse.outputFileSync(
          path.join(config.dir.src, config.tools.ejs, config.sitemapData[pages].page, '.ejs'),
          ''
        );
        fse.outputFileSync(
          path.join(config.dir.src, config.tools.sass, config.sitemapData[pages].page, '.scss'),
          ''
        )
      }

      callback()
    }

    gulp.task('mkdirs', mkdirs)
    gulp.task('csvToJson', csvToJson)
    gulp.task('fileCopy', fileCopy)
    gulp.task('fileSet', fileSet)

    const fileCreate = () => {
      return gulp.series(
        `mkdirs`,
        `csvToJson`,
        `fileCopy`,
        'fileSet'
      )()
    }

    gulp.task('setting', fileCreate)
  }
}

export default new Setting()