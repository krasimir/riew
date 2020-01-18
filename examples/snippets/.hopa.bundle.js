'use strict';

var riew = require('riew');

/* eslint-disable no-unused-vars */
var chA = riew.chan();
var chB = riew.chan();
riew.listen([chA, chB], function (v, idx) {
  console.log(v, idx);
}, {
  strategy: riew.ONE_OF
});
riew.sput(chA, 'foo');
riew.sput(chB, 'bar');
riew.sput(chA, 'moo');
