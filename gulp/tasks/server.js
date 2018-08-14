/**
 * Gulp Task:  server
 *
 */

import Registry from 'undertaker-registry'
import browserSync from 'browser-sync';
import config from '../config'


class Server extends Registry {
  init(gulp) {
    export const sync = callback => {
      browserSync({
        server: {
          baseDir: dir.dst,
          index: 'index.html',
        },
      })

      callback()
    }

    export const reload = () => {
      browserSync.reload()
    }
  }
}

export default new Server()