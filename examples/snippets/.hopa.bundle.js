'use strict';

var riew = require('riew');

/* eslint-disable no-unused-vars */
var ch = riew.chan();
riew.listen(ch, function (value) {
  console.log("Value: ".concat(value));
});
riew.sput(ch, 'foo'); // Value: foo

riew.sput(ch, 'bar'); // Value: bar

riew.sput(ch, 'moo'); // Value: moo
