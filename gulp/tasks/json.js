/**
 * Gulp Task:  Ejs
 *
 */

import Registry from 'undertaker-registry'
import path from 'path'
import newer from 'gulp-newer'
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
            file => `${path.join(config.dir.src, config.tools.ejs)}/_layout/${file.data.layout || '_default'}.ejs`
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