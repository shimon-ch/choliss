/**
 * Gulp Task: setting
 * First task
 */

import path from 'path'
import minimist from 'minimist'
import Registry from 'undertaker-registry'
import fs from 'fs'
import fse from 'fs-extra'
import request from 'request'
import csv from 'csvtojson'
import config from '../config'

class Setting extends Registry {
  init(gulp) {

    /** ファイル存在確認チェック用 **/
    let isExist = ""

    function fileExistCheck(filePath) {
      try {
        fs.statSync(filePath)
        isExist = true
      } catch (err) {
        isExist = false
      }

      return isExist
    }

    const csvToJson = callback => {
      const dataLength = Object.keys(config.dataFile.dataname).length
      let count = 1

      for (const key in config.dataFile.dataname) {
        const URL = config.dataFile.dataname[key]
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
      }
    }

    const fileCopy = callback => {
      const args_setting = {
        string: 'env',
        default: {
          default: process.env.NODE_ENV || 'default/',
          hc: process.env.NODE_ENV || 'hondacars/',
        },
      }

      const argv = minimist(process.argv.slice(2), args_setting)

      console.log(argv)

      const toolsLength = Object.keys(config.tools).length - 1 //dataが不要なので−１
      let count = 1

      if (argv.default === true) {
        for (let tool in config.tools) {
          if (tool === 'data') continue

          fileExistCheck(path.join(config.dir.src, tool))
          if (!isExist) {
            fse.copy(
                path.join(config.dir.tmp, 'default', tool),
                path.join(config.dir.src, tool))
              .then(() => {
                console.log('template default ' + tool + ' をコピーしました')
                if (toolsLength === count) {
                  return callback()
                } else {
                  count++
                }
              })
          } else {
            console.log('すでにディレクトリがコピーされています')
            if (toolsLength === count) {
              return callback()
            } else {
              count++
            }
          }
        }
      } else if (argv.hc === true) {
        for (let tool in config.tools) {
          if (tool === 'data') continue

          fileExistCheck(path.join(config.dir.src, tool))
          if (!isExist) {
            fse.copy(
              path.join(config.dir.tmp, argv, tool),
              path.join(config.dir.src, tool))
              .then(() => {
                console.log('template hondacars' + tool + ' をコピーしました')
                if (toolsLength === count) {
                  return callback()
                } else {
                  count++
                }
              }
            )
          } else {
            console.log('すでにディレクトリがコピーされています')
            if (toolsLength === count) {
              return callback()
            } else {
              count++
            }
          }
        }
      } else {
        for (let tool in config.tools) {
          if (tool === 'data') continue

          fileExistCheck(path.join(config.dir.src, tool))
          if (!isExist) {
            fse.copy(
              path.join(config.dir.tmp, 'default', tool),
              path.join(config.dir.src, tool))
              .then(() => {
                console.log('template default ' + tool + ' をコピーしました')
                if (toolsLength === count) {
                  return callback()
                } else {
                  count++
                }
              }
            )
          } else {
            console.log('すでにディレクトリがコピーされています')
            if (toolsLength === count) {
              return callback()
            } else {
              count++
            }
          }
        }
      }
    }

    const fileSet = callback => {
      const sitemapDataFile = path.join(config.dataJson, 'sitemap.json')
      const sitemapData = JSON.parse(fse.readFileSync(sitemapDataFile, 'utf8'))
      const ejsData = fs.readFileSync(path.join(config.dir.tmp, 'template.ejs'), 'utf-8')
      const ejsScss = fs.readFileSync(path.join(config.dir.tmp, 'template.scss'), 'utf-8')

      for (const pages in sitemapData) {
        if ( sitemapData[pages].page === 'index' ){
          fileExistCheck(path.join(config.dir.src, config.tools.ejs, sitemapData[pages].page + '.ejs'))

          if (!isExist){
            fse.outputFileSync(
              path.join(config.dir.src, config.tools.ejs, sitemapData[pages].page + '.ejs'),
              ejsData
            )
          } else {
            console.log('すでにファイルが存在していました')
          }
        } else {
          fileExistCheck(path.join(config.dir.src, config.tools.ejs, sitemapData[pages].category, sitemapData[pages].page + '.ejs'))

          if (!isExist) {
            fse.outputFileSync(
              path.join(config.dir.src, config.tools.ejs, sitemapData[pages].category, sitemapData[pages].page + '.ejs'),
              ejsData
            )
          } else {
            console.log('すでにファイルが存在していました')
          }
        }

        fileExistCheck(path.join(config.dir.src, config.tools.sass, sitemapData[pages].page + '.scss'))
        if (!isExist) {
          fse.outputFileSync(
            path.join(config.dir.src, config.tools.sass, 'project', sitemapData[pages].page + '.scss'), ejsScss
          )
        } else {
          console.log('すでにファイルが存在していました')
        }
      }

      callback()
    }

    gulp.task('csvToJson', csvToJson)
    gulp.task('fileCopy', fileCopy)
    gulp.task('fileSet', fileSet)

    const fileCreate = callback => {
      gulp.series(
        `csvToJson`,
        `fileCopy`,
        'fileSet',
        'html',
        'css',
        'js',
        'imagemin'
      )()

      // TODO json整形タスクも追加する
      callback()
    }

    gulp.task('setting', fileCreate)
  }
}

export default new Setting()