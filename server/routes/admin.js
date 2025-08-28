var express = require('express');
const dashboardController = require('../Controller/dashboardController');
const staffController = require('../Controller/staffController');
var Adminrouter = express.Router();

/* GET users listing. */
Adminrouter.post('/login',dashboardController.Adminlogin)
Adminrouter.post('/staffLogin',staffController.stafflogin)

module.exports = Adminrouter;
