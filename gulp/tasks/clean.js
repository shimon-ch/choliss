/**
 * Gulp Task:  Clean
 *
 */

import Registry from 'undertaker-registry'
import path from 'path'
import del from 'del'
import config from '../config'


class Clean extends Registry {
  init(gulp) {
    export const clean = callback => {
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

      callback()
    }
  }

export default new Clean()