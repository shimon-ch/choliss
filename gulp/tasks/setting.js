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

    const csvToJson = callback => {
      const dataLength = Object.keys(config.dataFile.dataname).length
      let count = 1

      for (const key in config.dataFile.dataname) {
        const URL = config.dataFile.dataname[key]
        const csvFilePath = path.join(config.dataCsv, key + '.csv')
        const jsonFilePath = path.join(config.dataJson, key + '.json')

        csv()
        .fromStream(request.get(URL))
        .then((json) => {
          fse.outputJson(jsonFilePath, json)
        })
        .then(() => {
          if (dataLength === count) {
            return callback()
          } else {
            count++
          }
        })

        // https.get(URL, res => {
        //   let responseString = ''

        //   res.on('data', chunk => {
        //     responseString += chunk
        //   })

        //   res.on('end', () => {
        //     fse.outputFile(csvFilePath, responseString)
        //     .then(() => {
        //       csv()
        //         .fromFile(csvFilePath)
        //         .then((jsonObj) => {
        //           fse.outputJson(jsonFilePath, jsonObj)
        //         })
        //     })
        //     .then(() => {
        //       if (dataLength === count) {
        //         gulp.src(jsonFilePath)
        //           .pipe(prettierPlugin(undefined, { filter: true }))
        //           .pipe(gulp.dest(config.dataJson))
        //         return callback()
        //       } else {
        //         count++
        //       }
        //     })
        //   })
        // })
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

      const argv = minimist(process.argv.slice(2), args_setting)

      const toolsLength = Object.keys(config.tools).length - 1 //dataが不要なので−１
      let count = 1

      if (argv.default === true) {
        for (let tool in config.tools) {
          if (tool === 'data') continue

          fse.copy(
            path.join(config.dir.tmp, 'default', String(tool)),
            path.join(config.dir.src, String(tool)))
            .then(() => {
              console.log('template default ' + tool + ' をコピーしました')
              if (toolsLength === count) {
                return callback()
              } else {
                count++
              }
            }
          )
        }
      } else {
        for (let tool in config.tools) {
          if (tool === 'data') continue
          fse.copy(
            path.join(config.dir.tmp, argv, String(tool)),
            path.join(config.dir.src, String(tool)))
            .then(() => {
              console.log('template default ' + tool + ' をコピーしました')
              if (toolsLength === count) {
                return callback()
              } else {
                count++
              }
            }
          )
        }
      }
    }

    const fileSet = callback => {
      const sitemapDataFile = path.join(config.dataJson, 'sitemap.json')
      const sitemapData = JSON.parse(fse.readFileSync(sitemapDataFile, 'utf8'))

      for (const pages in sitemapData) {
        fse.outputFileSync(
          path.join(config.dir.src, config.tools.ejs, sitemapData[pages].page + '.ejs'),
          ''
        )

        fse.outputFileSync(
          path.join(config.dir.src, config.tools.sass, sitemapData[pages].page + '.scss'),
          ''
        )
      }

      callback()
    }

    gulp.task('mkdirs', mkdirs)
    gulp.task('csvToJson', csvToJson)
    gulp.task('fileCopy', fileCopy)
    gulp.task('fileSet', fileSet)

    const fileCreate = callback => {
      gulp.series(
        `mkdirs`,
        `csvToJson`,
        `fileCopy`,
        'fileSet')()

      callback()
    }

    gulp.task('setting', fileCreate)
  }
}

export default new Setting()