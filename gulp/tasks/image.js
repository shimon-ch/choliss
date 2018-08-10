/**
 * Gulp Task:  Imagemin
 *
 */

import Registry from 'undertaker-registry'
import path from 'path'
import plumber from 'gulp-plumber'
import notify from 'gulp-notify'
import newer from 'gulp-newer'
import imagemin from 'gulp-imagemin'
import pngquant from 'imagemin-pngquant'
import mozjpeg from 'imagemin-mozjpeg'
import config from '../config'

class Imagemin extends Registry {
  init(gulp) {
    gulp.task('imagemin', () => {
      return (
        gulp.src(path.join(config.dir.src, config.tools.img, '**'))
          .pipe(newer(path.join(config.assetsDir, config.assets.img)))
          .pipe(
            plumber({
              errorHandler: notify.onError('<%= error.message %>'),
            })
          )
          .pipe(
            imagemin([
              pngquant({
                quality: '75-85', // 画質
                speed: 1, // 最低のスピード
                floyd: 0, // ディザリングなし
              }),
              mozjpeg({
                quality: 85, // 画質
                progressive: true,
              }),
              imagemin.svgo(),
              imagemin.optipng(),
              imagemin.gifsicle(),
            ])
          )
          .pipe(gulp.dest(path.join(config.assetsDir, config.assets.img)))
      )
    })
  }
}

export default new Imagemin()