/*
 * Copyright 2020 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

"use strict";

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const api = require('./routes/api');
const cors = require("cors");
const formidable = require('express-formidable');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

if (process.env.ASSET_COMPUTE_DEV_TOOL_ENV !== 'development') {
    const build = path.join(__dirname, 'client-build');
    console.log('static build path', build);
    app.use(express.static(build));
}
app.use(formidable());

app.use('/', function (req, res, next) {
    if ((process.env.ASSET_COMPUTE_DEV_TOOL_ENV !== 'development') && (req.headers.authorization !== app.settings.devToolToken)) {
        return res.status(401).send({
            message: 'Unauthorized'
        });
    }
    next();
});

app.use('/api', api);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) { // eslint-disable-line no-unused-vars
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.send('error');
});

module.exports = app;
