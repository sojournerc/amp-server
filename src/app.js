'use strict';

import koa from 'koa';
import Router from 'koa-router';
import logger from 'koa-logger';
import serve from 'koa-static';
import compress from 'koa-compress';
import hbs from 'koa-hbs';

import polyFill from 'babel-polyfill';

import home from './routes/home';

const router = Router();
const app = koa();
export default app;

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
router.get('/', home);

app.use(router.routes());

process.on('uncaughtException', function(err) {
  console.error('Caught exception: ' + err);
});

const port = 5000;
app.listen(port);
console.info('listening on port ' + port)
