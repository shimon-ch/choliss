/**
 * Gulp Task:  build
 *
 */

import Registry from 'undertaker-registry'
import path from 'path'
import config from '../config'

class Build extends Registry {
  init(gulp) {
    const build = () => {
      console.log('test')
    }
  }
}

export default new Build()