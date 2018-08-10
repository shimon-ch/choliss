/**
 * Gulp Task:  Ejs
 *
 */

import Registry from 'undertaker-registry'
import path from 'path'
import prettify from 'gulp-jsbeautifier'
import plumber from 'gulp-plumber'
import notify from 'gulp-notify'
import newer from 'gulp-newer'
import ejs from 'gulp-ejs'
import frontMatter from 'gulp-front-matter'
import wrapper from 'layout-wrapper'
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
          .pipe(frontMatter())
          .pipe(wrapper({
            layout: '',
            data: '',
            engine: 'ejs'
          }))
          .pipe(ejs({}, {}, { ext: '.html' }))
          .pipe(prettify({
            html: {
              file_types: ['.html']
            }
          }))
          .pipe(gulp.dest(config.dir.dst))
      )
    })
  }
}

export default new Ejs()