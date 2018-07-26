/**
 * Gulp Task: setting
 * First task
 */

import Registry from 'undertaker-registry'
import config from '../config'

class Minimist extends Registry {
  init(gulp) {
    gulp.task(
      'build',
      gulp.series(
        'clean',
        'copy',
        config.defaultTasks.font,
        config.defaultTasks.sprite,
        config.defaultTasks.image,
        'eslint',
        config.defaultTasks.js,
        config.defaultTasks.html,
        config.defaultTasks.css
      )
    )
  }
}



  const argv = minimist(process.argv.slice(2), args_setting);

  console.log(argv);

  if (argv.default === true) {
    for (let tool in tools) {
      if (tool === 'data') continue;
      fs.copySync(
        templatePath + 'default/' + tool + '/',
        rootPaths.src + tool + '/',
        () => {
          return console.log('template default ' + tool + ' をコピーしました');
        }
      );
    }
  } else {
    for (let tool in tools) {
      if (tool === 'data') continue;
      fs.copySync(
        templatePath + argv + '/*' + '/',
        rootPaths.src + tool + '/',
        () => {
          return console.log('template ' + argv + tool + ' をコピーしました');
        }
      );
    }
  }

  done();
};