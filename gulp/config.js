import path from 'path'

/* ========== Setting ========== */
const env = process.env.NODE_ENV || 'development'

// Project Directories information
const projectName = ''

const dir = {
  src: 'source/',
  dst: 'public/',
  tmp: 'template/'
}

dir.src = dir.src + projectName
dir.dst = dir.dst + projectName

/* ========== Path ========== */
// Task Setting
const tasks = {}

// Default Tools
const defaultTasks = {
  html: 'html',
  css: 'css',
  js: 'js',
  image: 'imagemin',
  reload: 'reload',
  stream: 'stream-reload'
}

// Default Tools
const tools = {
  ejs: 'ejs',
  sass: 'sass',
  js: 'js',
  img: 'img',
  data: 'data'
}

// 各種assetsのdist先
const assetsDir = path.join(dir.dst, 'assets')

// dist先のassetsをまとめる
const assets = {
  css: 'css',
  js: 'js',
  img: 'img'
}

// 使ってるdata各種をまとめる
const data = {
  csv: 'csv',
  json: 'json'
}

// dataのパスをまとめる
const dataCsv = path.join(dir.src, tools.data, data.csv)
const dataJson = path.join(dir.src, tools.data, data.json)

const dataFile = {
  dataname: {
    sitemap:
      'https://docs.google.com/spreadsheets/d/e/2PACX-1vSOmbyBeIRQ52JL9l0AN70RERLvL3Mnys1v08M_o-JWdR7sAYunDCeuAXBxzUIzcaUIqLmNT5RlyD5m/pub?gid=1826907314&single=true&output=csv',
    shopdate:
      'https://docs.google.com/spreadsheets/d/e/2PACX-1vSOmbyBeIRQ52JL9l0AN70RERLvL3Mnys1v08M_o-JWdR7sAYunDCeuAXBxzUIzcaUIqLmNT5RlyD5m/pub?gid=1970705233&single=true&output=csv',
  }
}

export default {
  isWatching: false,
  env,
  dir,
  tools,
  assetsDir,
  assets,
  data,
  dataCsv,
  dataJson,
  dataFile,
  tasks,
  defaultTasks
}