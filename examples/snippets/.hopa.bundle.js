'use strict';

var riew = require('riew');

/* eslint-disable no-unused-vars */
riew.register('config', {
  theme: 'dark'
});
var r = riew.riew(function (props) {
  console.log("Selected theme: ".concat(props.config.theme)); // Selected theme: dark
})["with"]('config');
r.mount();
