/**
 * Gulp Task:  Css
 *
 */

import Registry from 'undertaker-registry'
import path from 'path'
import plumber from 'gulp-plumber'
import notify from 'gulp-notify'
import newer from 'gulp-newer'
import autoprefixer from 'autoprefixer'
import sass from 'gulp-sass'
import sourcemaps from 'gulp-sourcemaps'
import postcss from 'gulp-postcss'
import postcssPresetEnv from 'postcss-preset-env'
import cssmqpacker from 'css-mqpacker'
import csso from 'gulp-csso'
import browserSync from 'browser-sync'

import config from '../config'

class Css extends Registry {
  init(gulp) {
    gulp.task('css', () => {
      const sassOptions = {
        outputStyle: 'expanded',
        sourceMap: true,
        sourceComments: false
      }

      const postcssOptions = [
        autoprefixer({ browsers: [
            'last 2 versions',
            'Android >= 6.0'
          ]}
        ),
        postcssPresetEnv(),
        cssmqpacker()
      ]

      return (
        gulp.src(path.join(config.dir.src, config.tools.sass, '/*.scss'))
          .pipe(newer(path.join(config.assetsDir, config.tools.sass)))
          .pipe(plumber({
            errorHandler: notify.onError('<%= error.message %>'),
          }))
          .pipe(sourcemaps.init())
          .pipe(sass(sassOptions))
          .pipe(gulp.dest(path.join(config.assetsDir, config.assets.css)))
          .pipe(postcss(postcssOptions))
          .pipe(csso())
          .pipe(sourcemaps.write('/maps/'))
          .pipe(gulp.dest(path.join(config.assetsDir, config.assets.css)))
      )
    })
  }
}

export default new Css()