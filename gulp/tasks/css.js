/**
 * Gulp Task:  Css
 *
 */

import Registry from 'undertaker-registry'
import path from 'path'
import autoprefixer from 'autoprefixer'
import sass from 'gulp-sass'
import sourcemaps from 'gulp-sourcemaps'
import postcss from 'gulp-postcss'
import postcssPresetEnv from 'postcss-preset-env'
import cssmqpacker from 'css-mqpacker'
import csso from 'gulp-csso'

import config from '../config'


class Css extends Registry {
  init(gulp) {
    const sassOptions = {
      outputStyle: 'expanded',
      sourceMap: true,
      sourceComments: false,
    }

    const postcssOptions = [
      autoprefixer({ browsers: ['last 2 versions', 'Android >= 6.0'] }),
      postcssPresetEnv(),
      cssmqpacker
    ]

    export const css = () => {
      return gulp.src(path.join(rootPaths.src, tools.sass, '**/*.sass'))
        .pipe(
          plumber({
            errorHandler: notify.onError('<%= error.message %>'),
          })
        )
        .pipe(sourcemaps.init())
        .pipe(sass(sassOptions))
        .pipe(gulp.dest(assetsRoot + assets.css))
        .pipe(postcss(postcssOptions)
        .pipe(cssmqpacker())
        .pipe(csso())
        .pipe(sourcemaps.write('/maps/'))
        .pipe(gulp.dest(assetsRoot + assets.css))
        .pipe(browserSync.reload({ stream: true }));
    }
  }

export default new Css()