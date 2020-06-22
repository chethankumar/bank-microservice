const webpack = require('webpack');
const middleware = require('webpack-dev-middleware');
const hotMiddleware = require('webpack-hot-middleware');
const express = require('express');
const path = require('path');

var passport = require('passport-mfp-token-validation').Passport;
var mfpStrategy = require('passport-mfp-token-validation').Strategy;

const app = express();
const webpackConfig = require('./webpack.config');
const compiler = webpack(webpackConfig);

if (webpackConfig.mode === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  const routes = require('./routes');
  app.use(routes());
} else {
  app.use(middleware(compiler));
  app.use(hotMiddleware(compiler));

  require('node-hot').configure({
    exclude: [/[\/\\]node_modules[\/\\]/]
  });

  app.use((req, res, next) => {
    require('./routes').handle(req, res, next);
  });
}

const mfpUrl =
  'https://mobilefoundation.mofoso-testing-c33bf0f22ab59313b3628c493e016b88-0000.us-south.containers.appdomain.cloud';

passport.use(
  new mfpStrategy({
    authServerUrl: `${mfpUrl}/mfp/api`,
    confClientID: 'external',
    confClientPass: 'external',
    analytics: {
      onpremise: {
        url: `${mfpUrl}/analytics-service/rest/v3`,
        username: 'admin',
        password: 'admin'
      }
    }
  })
);

app.use(passport.initialize());

app.all(
  '/*',
  passport.authenticate('mobilefirst-strategy', {
    session: false,
    scope: 'userlogin'
  }),
  function(req, res, next) {
    console.log('all request');
    res.header('Access-Control-Allow-Origin', '*');
    req.header('Access-Control-Allow-Origin', '*');
    next();
  }
);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
