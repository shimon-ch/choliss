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
    gulp.task('reload', callback => {
      browserSync.reload()
      callback()
    })

    gulp.task('stream-reload', callback => {
      browserSync.reload({ stream: true })
      callback()
    })

    gulp.task('watch', () => {
      const BROWSER_SYNC_RELOAD_DELAY = 800
      let timer
      config.isWatching = true

      // BrowserSync
      browserSync.init({
        server: {
          baseDir: config.dir.dst,
        },
      })

      gulp.watch(path.join(config.dir.src, config.tools.ejs, '**/*.ejs'), gulp.series(config.defaultTasks.html, config.defaultTasks.reload))
      gulp.watch(path.join(config.dir.src, config.tools.sass, '**/*.scss'), gulp.series(config.defaultTasks.css, config.defaultTasks.stream))
      gulp.watch(path.join(config.dir.src, config.tools.js, '**/*.ts'), gulp.series(config.defaultTasks.js, config.defaultTasks.reload))
      gulp.watch(path.join(config.dir.src, config.tools.img, '**/*'), gulp.series(config.defaultTasks.image, config.defaultTasks.stream))
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