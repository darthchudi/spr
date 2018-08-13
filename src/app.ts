import createError from 'http-errors';
import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import mongoose from "mongoose";
import path from 'path';
import dotenv from "dotenv";
import bodyparser from "body-parser";

import {resolveMongoDB} from "./helpers/config";

import api from './routes/api';

dotenv.config({path: path.join(__dirname, "../", ".env") });

//Start MongoDB
mongoose.connect(resolveMongoDB(process.env.NODE_ENV), {useNewUrlParser: true});
var db = mongoose.connection;
db.once('open', () => console.log("Mongoose connected! 🚀 🚀"));

//Start Express
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(bodyparser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', api);


// catch 404 and forward to error handler
app.use(function(_req: express.Request, _res: express.Response, next: express.NextFunction) {
  next(createError(404));
});

// error handler
app.use(function(err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) {
  console.log(err)

  res.status(err.status || 500).json({message: err});
});

export default app;
