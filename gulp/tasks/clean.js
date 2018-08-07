/**
 * Gulp Task:  Clean
 *
 */

import Registry from 'undertaker-registry'
import del from 'del'

import config from '../config'

class Clean extends Registry {
  init(gulp) {
    const clean = () => {
      return del(
        [
          './source',
          './source/*',
          './public',
          './public/*',
          './build',
          './build/*',
        ],
        () => {
          console.log('source/,public/,build/ ディレクトリを削除しました。');
        }
      )
    }

    gulp.task('clean', clean)
  }
}

export default new Clean()