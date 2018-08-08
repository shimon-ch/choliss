/**
 * Gulp Task:  Ejs
 *
 */

import Registry from 'undertaker-registry'
import path from 'path'
import plumber from 'gulp-plumber'
import notify from 'gulp-notify'
import newer from 'gulp-newer'
import ejs from 'gulp-ejs'
import frontMatter from 'gulp-front-matter'
import prettierPlugin from 'gulp-prettier-plugin'
import browserSync from 'browser-sync'

import config from '../config'

class Ejs extends Registry {
  init(gulp) {
    gulp.task('html', () => {
      return (
        gulp.src(path.join(config.dir.src, config.tools.ejs, '**/*.ejs'))
          .pipe(newer(path.join(config.dir.dst)))
          .pipe(plumber({
            errorHandler: notify.onError('<%= error.message %>'),
          }))
          .pipe(ejs({}, {}, { ext: '.html' }))
          .pipe(gulp.dest(config.dir.dst))
          .pipe(browserSync.reload())
      )
    })
  }
}

export default new Ejs()