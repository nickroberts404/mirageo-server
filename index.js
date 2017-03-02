#!/usr/bin/env node

const express = require('express');
const bodyParser = require('body-parser');
const settings = require('./settings');
const router = require('./routes');
const morgan = require('morgan');
const cors = require('cors');

const app = express();
app.use(cors());
// Port that server will listen on
const port = process.env.PORT || settings.port || 3030;

// // Basic Middleware
app.use(express.static('public'));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Router
app.use(router);

// SPIN IT!!!
if(!module.parent) {
	app.listen(port, () => console.log('Now listening at http://localhost:'+port));
}