import gulp from 'gulp'
import clean from './gulp/tasks/clean'
import setting from './gulp/tasks/setting'
import ejs from './gulp/tasks/ejs'
import css from './gulp/tasks/css'
import js from './gulp/tasks/js'
import img from './gulp/tasks/image'
import watch from './gulp/tasks/watch'
import build from './gulp/task/build'

gulp.registry(clean)
gulp.registry(ejs)
gulp.registry(css)
gulp.registry(js)
gulp.registry(imagemin)
gulp.registry(watch)
gulp.registry(build)