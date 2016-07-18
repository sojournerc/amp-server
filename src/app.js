'use strict';

import koa from 'koa';
import Router from 'koa-router';
import logger from 'koa-logger';
import serve from 'koa-static';
import compress from 'koa-compress';
import hbs from 'koa-hbs';
import koaBody from 'koa-body';

import fs from 'fs';

import polyFill from 'babel-polyfill';

const router = Router();
const app = koa();
export default app;

const examples = fs.readdirSync(`${__dirname}/views/examples`);

app.use(logger());

// templating
hbs.registerHelper('json', function(obj){
  var result = JSON.stringify(obj);
  return result;
});

hbs.registerHelper('if_eq', function(obj, value, block){
  if (obj === value) {
    return block(obj);
  }
});

app.use(hbs.middleware({
  extname:".hbs",
  defaultLayout: 'index',
  layoutsPath: `${__dirname}/views`,
  viewPath: `${__dirname}/views`
}));

// serve static assets
var cache_control = 600000; // 10min in millis
app.use(serve(__dirname + '/public', {
  maxage: cache_control
}));

// serve index
router.get('/', function*() {
  yield this.render('home', {
    page_path: `/`,
    examples: examples.map((ex) => {
      const slug = ex.replace(/\.hbs$/, '');
      return {
        label: slug.replace('-', ' ').toUpperCase(),
        slug
      }
    })
  });
});

router.get('/:example', function*() {
  yield this.render(`examples/${this.params.example}`, {
    show_back: true,
    page_path: `/${this.params.example}`
  });
});

router.post('/submit/test', koaBody({ multipart: true }), function*() {
  this.status = 201;
  this.body = this.request.body.fields;
});

app.use(router.routes());

process.on('uncaughtException', function(err) {
  console.error('Caught exception: ' + err);
});

const port = 5000;
app.listen(port);
console.info('listening on port ' + port)
