//Express generator - 기본적인 구성을 제공하는 express 생성기

/*
  npm install express-generator -g
  express (만들고자하는 app 이름)
  npm install
  npm start    or    pm2 start ./bin/www  --watch
*/

/*
  bin/www : http 모듈을 통해 서버 관리, 포트 관리   ===>   pm2 start ./bin/www  --watch
  public : css, image, javascript 등 정적인 파일들을 담는 곳
  routes : 서버가 라우팅 할 url path에 대한 로직들을 저장해놓는 파일
  views : 서버가 렌더링하는 템플릿들을 저장해놓는 dir
  app.js : Middleware 정의, 서버 설정
*/

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
