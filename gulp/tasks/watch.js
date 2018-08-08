/**
 * Gulp Task:  Watch
 *
 */

import Registry from 'undertaker-registry'
import path from 'path'
import browserSync from 'browser-sync';

import config from '../config'

class Watch extends Registry {
  init(gulp) {
    gulp.task('watch', () => {
      const BROWSER_SYNC_RELOAD_DELAY = 800
      let timer
      config.isWatching = true

      // BrowserSync
      browserSync.init({
        ui: false,
        server: {
          baseDir: 'public/',
        },
      })

      gulp.watch(path.join(config.dir.src, config.tools.ejs, '**/*.ejs'), gulp.task(config.defaultTasks.html))
      gulp.watch(path.join(config.dir.src, config.tools.sass, '**/*.scss'), gulp.task(config.defaultTasks.css))
      gulp.watch(path.join(config.dir.src, config.tools.js, '**/*.js'), gulp.task(config.defaultTasks.js))
      gulp.watch(path.join(config.dir.src, config.tools.img, '**/*'), gulp.task(config.defaultTasks.image))
      gulp.watch(
        'public/*'.replace(/\\/g, ' / '), {
          verbose: true
        },
        file => {
          clearTimeout(timer)
          timer = setTimeout(() => {
              browserSync.reload(file.relative)
            },
            BROWSER_SYNC_RELOAD_DELAY)
        }
      )
    })
  }
}

export default new Watch()

// TODO
// publicディレクトリをコピーしつつ、htmlをsjisに変換(変換するかどうかは判定有りにするかも)
// Cmd+CでWatch終了