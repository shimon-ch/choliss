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
import data from 'gulp-data'
import layout1 from 'layout1'
import config from '../config'

class Ejs extends Registry {
  init(gulp) {

    const ejsSetting = {
      ejs: {
        src: [
          path.join(config.dir.src, config.tools.ejs, '**/*.ejs'),
          path.join('!.', config.dir.src, config.tools.ejs, '**/_*.ejs'),
        ]
      }
    }

    gulp.task('html', () => {
      return (
        gulp.src(ejsSetting.ejs.src)
          .pipe(newer(path.join(config.dir.dst)))
          .pipe(plumber({
            errorHandler: notify.onError('<%= error.message %>'),
          }))
          .pipe(data(file => {
            return { 'filename': file.path }
          }))
          .pipe(frontMatter({
            property: 'data'
          }))
          .pipe(layout1.ejs(
            file => `${path.join(config.dir.src, config.tools.ejs)}/layout/${file.data.layout || '_default'}.ejs`
          ))
          .pipe(ejs({}, {}, { ext: '.html' }))
          .pipe(prettify({
            html: {
              file_types: ['.html'],
              indent_size: 2
            }
          }))
          .pipe(gulp.dest(config.dir.dst))
      )
    })
  }
}

export default new Ejs()