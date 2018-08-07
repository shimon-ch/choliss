/**
 * Gulp Task:  Imagemin
 *
 */

import path from 'path'
import Registry from 'undertaker-registry'
import imagemin from 'gulp-imagemin'
import pngquant from 'imagemin-pngquant'
import mozjpeg from 'imagemin-mozjpeg'

import config from '../config'

class Imagemin extends Registry {
  init(gulp) {
    const img = () => {
      return gulp.src(path.join(rootPaths.src, tools.img, '**/*'))
        .pipe(newer(path(assetsRoot, assets.img)))
        .pipe(
          plumber({
            errorHandler: notify.onError('<%= error.message %>'),
          })
        )
        .pipe(
          imagemin([
            pngquant({
              quality: '70-80', // 画質
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
        .pipe(gulp.dest(path(assetsRoot, assets.img)))
    }

    gulp.task('imagemin', img)
  }
}

export default new Imagemin()