const createError = require('http-errors');
const express = require('express');
const logger = require('morgan');
const cors = require('cors');

const app = express();

let indexRouter = require('../app/routers/index');
let booksRouter = require('../app/routers/books');
let usersRouter = require('../app/routers/users');

app.use(cors());

app.use(logger('dev'));
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: false }));

app.use('/', indexRouter);
app.use('/api/books', booksRouter);
app.use('/api/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // render the error json
    // Don't leak internal error details for unexpected server errors.
    const status = err.status || (err.name === 'CastError' || err.name === 'ValidationError' ? 400 : 500);
    res.status(status);
    res.json(
        {
            success: false,
            message: status >= 500 ? 'Something went wrong on the server.' : err.message
        }
    );
});

module.exports = app;