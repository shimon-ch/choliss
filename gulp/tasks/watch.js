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
    const watch = callback => {
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

      gulp.watch(path(rootPaths.src, tools.ejs, '**/*.ejs'), html)
      gulp.watch(path(rootPaths.src, tools.sass, '**/*.scss'), css)
      gulp.watch(path(rootPaths.src, tools.js, '**/*.js'), js)
      gulp.watch(path(rootPaths.src, tools.img, '**/*'), img)
      gulp.watch(
        'public/*'.replace(/\\/g, ' / '),
        {
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

      callback();
    }
  }
}

export default new Watch()

// TODO
// publicディレクトリをコピーしつつ、htmlをsjisに変換(変換するかどうかは判定有りにするかも)
// Cmd+CでWatch終了