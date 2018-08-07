/**
 * Gulp Task:  Ejs
 *
 */

import Registry from 'undertaker-registry'
import path from 'path'
import ejs from 'gulp-ejs'
import frontMatter from 'gulp-front-matter'
import prettierPlugin from 'gulp-prettier-plugin'
import newer from 'gulp-newer'

import config from '../config'


class Html extends Registry {
  init(gulp) {
    export const html = () => {
      return gulp.src(path.join(rootPaths.src, tools.ejs, '**/*.ejs'))
        .pipe(newer(path.join(rootPaths.src, tools.ejs, '**/*.ejs')))
        .pipe(
          plumber({
            errorHandler: notify.onError('<%= error.message %>'),
          })
        )
        .pipe(ejs({}, {}, { ext: '.html' }))
        .pipe(prettierPlugin(undefined, { filter: true }))
        .pipe(gulp.dest(rootPaths.dst));
    };
  }

export default new Html()