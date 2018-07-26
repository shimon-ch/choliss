import path from 'path';
import config from 'config';

/* ========== Setting ========== */
const env = process.env.NODE_ENV || 'development';

// Project Directories information
const dir = {
  src: 'source',
  dst: 'public',
  tmp: 'template',
};

/* ========== Path ========== */
// Task Setting
const tasks = {};

// Default Tools
const tools = {
  ejs: 'ejs',
  sass: 'sass',
  js: 'js',
  img: 'img',
  data: 'data',
};

// 各種assetsのdist先
const assetsDir = path.join(dir.src, 'assets');

// dist先のassetsをまとめる
const assets = {
  css: 'css',
  js: 'js',
  img: 'img',
};

// 使ってるdata各種をまとめる
const data = {
  csv: 'csv',
  json: 'json',
};

// dataのパスをまとめる
const dataCsv = path.join(dir.src, tools.data, data.csv);
const dataJson = path.join(dir.src, tools.data, data.json);

const dataFile = {
  dataname: {
    sitemap:
      'https://docs.google.com/spreadsheets/d/e/2PACX-1vSOmbyBeIRQ52JL9l0AN70RERLvL3Mnys1v08M_o-JWdR7sAYunDCeuAXBxzUIzcaUIqLmNT5RlyD5m/pub?gid=1826907314&single=true&output=csv',
    shopdate:
      'https://docs.google.com/spreadsheets/d/e/2PACX-1vSOmbyBeIRQ52JL9l0AN70RERLvL3Mnys1v08M_o-JWdR7sAYunDCeuAXBxzUIzcaUIqLmNT5RlyD5m/pub?gid=1970705233&single=true&output=csv',
  },
};