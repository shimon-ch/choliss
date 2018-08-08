/**
 * Gulp Task:  Js
 *
 */

import Registry from 'undertaker-registry'
import path from 'path'
import plumber from 'gulp-plumber'
import notify from 'gulp-notify'
import newer from 'gulp-newer'
import webpack from 'webpack'
import webpackStream from 'webpack-stream'
import prettierPlugin from 'gulp-prettier-plugin'
import browserSync from 'browser-sync'

import config from '../config'

class Js extends Registry {
  init(gulp) {
    gulp.task('js', () => {
      return (
        gulp.src(path.join(config.dir.src, config.tools.js, '**/*.js'))
          .pipe(newer(path.join(config.assetsDir, config.assets.js)))
          .pipe(plumber({
            errorHandler: notify.onError('<%= error.message %>'),
          }))
          .pipe(webpackStream(require('../../webpack.config.js')))
          .pipe(prettierPlugin(undefined, {
            filter: true
          }))
          .pipe(gulp.dest(path.join(config.assetsDir, config.assets.js)))
          .pipe(browserSync.reload())
      )
    })
  }
}

export default new Js()