/**
 * Gulp Task:  Js
 *
 */

import path from 'path'
import Registry from 'undertaker-registry'
import plumber from 'gulp-plumber'
import webpackStream from 'webpack-stream'
import prettierPlugin from 'gulp-prettier-plugin'

import config from '../config'

class Js extends Registry {
  init(gulp) {
    const js = () => {
      return gulp.src(path.join(rootPaths.src, tools.js, '**/*.js'))
        .pipe(
          plumber({
            errorHandler: notify.onError('<%= error.message %>'),
          })
        )
        .pipe(webpackStream())
        .pipe(prettierPlugin(undefined, { filter: true }))
        .pipe(gulp.dest(path.join(assetsRoot + assets.js)))
    }
  }
}

export default new Js()