!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{("undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this).Riew=e()}}(function(){return function e(t,n,r){function u(i,a){if(!n[i]){if(!t[i]){var f="function"==typeof require&&require;if(!a&&f)return f(i,!0);if(o)return o(i,!0);var c=new Error("Cannot find module '"+i+"'");throw c.code="MODULE_NOT_FOUND",c}var s=n[i]={exports:{}};t[i][0].call(s.exports,function(e){return u(t[i][1][e]||e)},s,s.exports,e,t,n,r)}return n[i].exports}for(var o="function"==typeof require&&require,i=0;i<r.length;i++)u(r[i]);return u}({1:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.default=function(){var e=(0,o.default)();return e.setValue=function(t){return e.value=t},e.put=function(t,n){e.value=[t],n(!0)},e.take=function(t){t(e.value[0])},e};var r,u=e("./Interface"),o=(r=u)&&r.__esModule?r:{default:r}},{"./Interface":4}],2:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.default=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1,t=arguments.length>1&&void 0!==arguments[1]&&arguments[1],n=(0,o.default)();return n.setValue=function(e){return n.value=e},n.put=function(r,u){var o=!0;n.value.length<e?n.value.push(r):t?(n.value.shift(),n.value.push(r)):o=!1,n.takes.length>0&&n.takes.shift()(n.value.shift()),u(o)},n.take=function(e){0===n.value.length?n.takes.push(e):e(n.value.shift())},n};var r,u=e("./Interface"),o=(r=u)&&r.__esModule?r:{default:r}},{"./Interface":4}],3:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.default=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,t=(0,o.default)();return t.setValue=function(e){return t.value=e},t.put=function(n,r){0===t.takes.length?t.value.length<e?(t.value.push(n),r(!0)):t.puts.push(function(e){t.value.push(n),t.takes.length>0&&t.takes.shift()(t.value.shift()),r(e||!0)}):(t.value.push(n),t.takes.shift()(t.value.shift()),r(!0))},t.take=function(n){if(0===t.value.length)t.puts.length>0?(t.puts.shift()(),t.take(n)):t.takes.push(n);else{var r=t.value.shift();t.value.length<e&&t.puts.length>0&&t.puts.shift()(),n(r)}},t};var r,u=e("./Interface"),o=(r=u)&&r.__esModule?r:{default:r}},{"./Interface":4}],4:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.default=function(){return{value:[],puts:[],takes:[],isEmpty:function(){return 0===this.value.length},reset:function(){this.value=[],this.puts=[],this.takes=[]},setValue:function(e){this.value=e},getValue:function(){return this.value}}}},{}],5:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var r=i(e("./FixedBuffer")),u=i(e("./DroppingBuffer")),o=i(e("./DivorcedBuffer"));function i(e){return e&&e.__esModule?e:{default:e}}var a={fixed:r.default,dropping:u.default,sliding:function(e){return(0,u.default)(e,!0)},divorced:o.default};n.default=a},{"./DivorcedBuffer":1,"./DroppingBuffer":2,"./FixedBuffer":3}],6:[function(e,t,n){"use strict";var r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e};Object.defineProperty(n,"__esModule",{value:!0});var u=function(e,t){if(Array.isArray(e))return e;if(Symbol.iterator in Object(e))return function(e,t){var n=[],r=!0,u=!1,o=void 0;try{for(var i,a=e[Symbol.iterator]();!(r=(i=a.next()).done)&&(n.push(i.value),!t||n.length!==t);r=!0);}catch(e){u=!0,o=e}finally{try{!r&&a.return&&a.return()}finally{if(u)throw o}}return n}(e,t);throw new TypeError("Invalid attempt to destructure non-iterable instance")},o="function"==typeof Symbol&&"symbol"===r(Symbol.iterator)?function(e){return void 0===e?"undefined":r(e)}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":void 0===e?"undefined":r(e)};n.createChannel=function(){for(var e=f.OPEN,t=arguments.length,n=Array(t),r=0;r<t;r++)n[r]=arguments[r];var i=function(e){var t=void 0,n=void 0;2===e.length?(t=e[0],n=e[1]):1===e.length&&"string"==typeof e[0]?(t=e[0],n=l.default.fixed()):1===e.length&&"object"===o(e[0])?(t=(0,a.getId)("ch"),n=e[0]):(t=(0,a.getId)("ch"),n=l.default.fixed());return[t,n]}(n),s=u(i,2),d=s[0],v=s[1];if(c.CHANNELS.exists(d))return c.CHANNELS.get(d);var p=c.CHANNELS.set(d,{id:d,"@channel":!0,subscribers:[]});return p.isActive=function(){return p.state()===f.OPEN},p.buff=v,p.state=function(t){return void 0!==t&&(e=t),e},p.value=function(){return v.getValue()},p};var i,a=e("../utils"),f=e("./constants"),c=e("../index"),s=e("./buffer"),l=(i=s)&&i.__esModule?i:{default:i}},{"../index":16,"../utils":19,"./buffer":5,"./constants":7}],7:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0});n.OPEN=Symbol("OPEN"),n.CLOSED=Symbol("CLOSED"),n.ENDED=Symbol("ENDED"),n.PUT="PUT",n.TAKE="TAKE",n.NOOP="NOOP",n.SLEEP="SLEEP",n.STOP="STOP",n.SUB="SUB",n.CALL_ROUTINE="CALL_ROUTINE",n.FORK_ROUTINE="FORK_ROUTINE",n.CHANNELS={channels:{},getAll:function(){return this.channels},get:function(e){return this.channels[e]},set:function(e,t){return this.channels[e]=t,t},del:function(e){delete this.channels[e]},exists:function(e){return!!this.channels[e]},reset:function(){this.channels={}}}},{}],8:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.merge=function(){for(var e=(0,r.chan)(),t=arguments.length,n=Array(t),u=0;u<t;u++)n[u]=arguments[u];return n.forEach(function(t){!function n(){(0,r.stake)(t,function(t){t!==r.CLOSED&&t!==r.ENDED&&e.state()===r.OPEN&&(0,r.sput)(e,t,n)})}()}),e};var r=e("../../index")},{"../../index":16}],9:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.sub=s,n.unsub=l,n.subOnce=function(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:c;s(e,function n(u){l(e,n),(0,r.isChannel)(t)?(0,o.sput)(t,u):t(u)},n)},n.unsubAll=function(e){((0,r.isChannel)(e)?e:(0,r.chan)(e)).subscribers=[]},n.read=function(){return s.apply(void 0,arguments)};var r=e("../../index"),u=e("../constants"),o=e("../ops"),i=e("../../utils");function a(e){if(Array.isArray(e)){for(var t=0,n=Array(e.length);t<e.length;t++)n[t]=e[t];return n}return Array.from(e)}var f=Symbol("Nothing");var c={transform:function(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];return 1===t.length?t[0]:t},onError:null,initialCall:!0};function s(e,t,n){var s=(n=n||c).transform||c.transform,l=n.onError||c.onError,d="initialCall"in n?n.initialCall:c.initialCall;if(void 0===t)return{ch:e,op:u.SUB};e=function(e){return Array.isArray(e)||(e=[e]),e.map(function(e){return(0,r.isState)(e)&&(e=e.READ),(0,r.isChannel)(e)?e:(0,r.chan)(e)})}(e),t=function(e){if("function"==typeof e)return e;if((0,r.isChannel)(e))return e.__subFunc||(e.__subFunc=function(t){return(0,o.sput)(e,t)});if("string"==typeof e)return(0,r.chan)(e,r.buffer.divorced()).__subFunc=function(t){return(0,o.sput)(e,t)};throw new Error("'sub' accepts string, channel or a function as a second argument. "+e+" given.")}(t);var v=e.map(function(){return f}),p=!1;return e.forEach(function(e,n){var u=function(e){var u=arguments.length>1&&void 0!==arguments[1]?arguments[1]:function(){};if(v[n]=e,p||1===v.length||!v.includes(f)){p=!0;try{(0,i.isGeneratorFunction)(s)?(0,r.go)(s,function(e){t(e),u()},e):(t(s.apply(void 0,a(v))),u())}catch(e){if(null===l)throw e;l(e)}}};e.subscribers.find(function(e){return e.to===t})||e.subscribers.push({to:t,notify:u});var o=e.value();d&&o.length>0&&u(o[0])}),t}function l(e,t){var n=(0,r.isChannel)(e)?e:(0,r.chan)(e);(0,r.isChannel)(t)&&(t=t.__subFunc),n.subscribers=n.subscribers.filter(function(e){return e.to!==t})}},{"../../index":16,"../../utils":19,"../constants":7,"../ops":13}],10:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.createState=function(){var e=arguments.length<=0?void 0:arguments[0],t=(0,u.getId)("state"),n=[],o=[],i=arguments.length>0;function a(e){return function(t){if(null===e)throw t;e(t)}}function f(t,n){var o=t.ch,i=t.selector,f=t.onError;try{if((0,u.isGeneratorFunction)(i))return void(0,r.go)(i,function(e){return(0,r.sput)(o,e)},e);(0,r.sput)(o,i(n))}catch(e){a(f)(e)}}var c={id:t,"@state":!0,READ:t+"_read",WRITE:t+"_write",select:function(t){var u=arguments.length>1&&void 0!==arguments[1]?arguments[1]:function(e){return e},o=arguments.length>2&&void 0!==arguments[2]?arguments[2]:null,a=(0,r.isChannel)(t)?t:(0,r.chan)(t,r.buffer.divorced());a["@statereadchannel"]=!0;var c={ch:a,selector:u,onError:o};return n.push(c),i&&f(c,e),this},mutate:function(t){var i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:function(e,t){return t},c=arguments.length>2&&void 0!==arguments[2]?arguments[2]:null,s=(0,r.isChannel)(t)?t:(0,r.chan)(t,r.buffer.divorced());s["@statewritechannel"]=!0;var l={ch:s};return o.push(l),(0,r.sub)(s,function(t){e=t,n.forEach(function(t){return f(t,e)})},{transform:regeneratorRuntime.mark(function t(n){return regeneratorRuntime.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:if(t.prev=0,!(0,u.isGeneratorFunction)(i)){t.next=5;break}return t.next=4,(0,r.call)(i,e,n);case 4:return t.abrupt("return",t.sent);case 5:return t.abrupt("return",i(e,n));case 8:t.prev=8,t.t0=t.catch(0),a(c)(t.t0);case 11:case"end":return t.stop()}},t,this,[[0,8]])}),onError:a(c),initialCall:!0}),this},destroy:function(){return n.forEach(function(e){var t=e.ch;return(0,r.sclose)(t)}),o.forEach(function(e){var t=e.ch;return(0,r.sclose)(t)}),e=void 0,r.grid.remove(c),this},get:function(){return e},set:function(t){return e=t,n.forEach(function(t){f(t,e)}),t}};return c.select(c.READ),c.mutate(c.WRITE),c},n.isState=function(e){return e&&!0===e["@state"]},n.isStateReadChannel=function(e){return e&&!0===e["@statereadchannel"]},n.isStateWriteChannel=function(e){return e&&!0===e["@statewritechannel"]};var r=e("../../index"),u=e("../../utils")},{"../../index":16,"../../utils":19}],11:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.timeout=function(e){var t=(0,r.chan)();return setTimeout(function(){return(0,r.close)(t)},e),t};var r=e("../../index")},{"../../index":16}],12:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var r=e("./buffer");Object.defineProperty(n,"buffer",{enumerable:!0,get:function(){return(e=r,e&&e.__esModule?e:{default:e}).default;var e}});var u=e("./channel");Object.keys(u).forEach(function(e){"default"!==e&&"__esModule"!==e&&Object.defineProperty(n,e,{enumerable:!0,get:function(){return u[e]}})});var o=e("./ops");Object.keys(o).forEach(function(e){"default"!==e&&"__esModule"!==e&&Object.defineProperty(n,e,{enumerable:!0,get:function(){return o[e]}})});var i=e("./ext/merge");Object.keys(i).forEach(function(e){"default"!==e&&"__esModule"!==e&&Object.defineProperty(n,e,{enumerable:!0,get:function(){return i[e]}})});var a=e("./ext/timeout");Object.keys(a).forEach(function(e){"default"!==e&&"__esModule"!==e&&Object.defineProperty(n,e,{enumerable:!0,get:function(){return a[e]}})});var f=e("./ext/state");Object.keys(f).forEach(function(e){"default"!==e&&"__esModule"!==e&&Object.defineProperty(n,e,{enumerable:!0,get:function(){return f[e]}})});var c=e("./ext/pubsub");Object.keys(c).forEach(function(e){"default"!==e&&"__esModule"!==e&&Object.defineProperty(n,e,{enumerable:!0,get:function(){return c[e]}})});var s=e("./constants");Object.keys(s).forEach(function(e){"default"!==e&&"__esModule"!==e&&Object.defineProperty(n,e,{enumerable:!0,get:function(){return s[e]}})})},{"./buffer":5,"./channel":6,"./constants":7,"./ext/merge":8,"./ext/pubsub":9,"./ext/state":10,"./ext/timeout":11,"./ops":13}],13:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.isChannel=void 0,n.put=c,n.sput=function(e,t,n){return c(e,t,n||a)},n.take=s,n.stake=function(e,t){return s(e,t||a)},n.close=l,n.sclose=function(e){return l(e)},n.channelReset=d,n.schannelReset=function(e){d(e)},n.call=function(e){for(var t=arguments.length,n=Array(t>1?t-1:0),u=1;u<t;u++)n[u-1]=arguments[u];return{op:r.CALL_ROUTINE,routine:e,args:n}},n.fork=function(e){for(var t=arguments.length,n=Array(t>1?t-1:0),u=1;u<t;u++)n[u-1]=arguments[u];return{op:r.FORK_ROUTINE,routine:e,args:n}},n.go=p,n.sleep=function(e,t){if("function"!=typeof t)return{op:r.SLEEP,ms:e};setTimeout(t,e)},n.stop=function(){return{op:r.STOP}};var r=e("./constants"),u=e("../index"),o=e("../utils");function i(e){if(Array.isArray(e)){for(var t=0,n=Array(e.length);t<e.length;t++)n[t]=e[t];return n}return Array.from(e)}var a=function(){},f=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"READ";return v(e)?e:(0,u.isState)(e)?(0,u.chan)(e[t]):(0,u.chan)(e)};function c(e,t,n){var u,o,i,a,c=f(e,"WRITE");if("function"!=typeof n)return{ch:c,op:r.PUT,item:t};o=t,i=n,(a=(u=c).state())===r.CLOSED||a===r.ENDED?n(a):function(e,t,n){var r=e.subscribers.map(function(){return 1});if(0===r.length)return n();e.subscribers.forEach(function(e){return(0,e.notify)(t,function(){return r.shift(),0===r.length?n():null})})}(u,t,function(){return u.buff.put(o,i)})}function s(e,t){var n,o,i,a=f(e);if("function"!=typeof t)return{ch:a,op:r.TAKE};(0,u.isStateWriteChannel)(a)&&console.warn("You are about to `take` from a state WRITE channel. This type of channel is using `ever` buffer which means that will resolve its takes and puts immediately. You probably want to use `sub(<channel>)`."),o=t,(i=(n=a).state())===r.ENDED?o(r.ENDED):i===r.CLOSED&&n.buff.isEmpty()?(n.state(r.ENDED),o(r.ENDED)):n.buff.take(function(e){return o(e)})}function l(e){var t=f(e),n=t.buff.isEmpty()?r.ENDED:r.CLOSED;return t.state(n),t.buff.puts.forEach(function(e){return e(n)}),t.buff.takes.forEach(function(e){return e(n)}),u.grid.remove(t),t.subscribers=[],r.CHANNELS.del(t.id),{op:r.NOOP}}function d(e){var t=f(e);return t.state(r.OPEN),t.buff.reset(),{ch:t,op:r.NOOP}}var v=n.isChannel=function(e){return e&&!0===e["@channel"]};function p(e){for(var t=arguments.length,n=Array(t>2?t-2:0),a=2;a<t;a++)n[a-2]=arguments[a];var f=arguments.length>1&&void 0!==arguments[1]?arguments[1]:function(){},l="STOPPED",d="RUNNING",v={children:[],stop:function(){d=l,this.children.forEach(function(e){return e.stop()})},rerun:function(){y=e.apply(void 0,n),b()}},h=function(e){return v.children.push(e)},y=e.apply(void 0,n);function b(t){if(d!==l){var a=y.next(t);if(!0===a.done)return f&&f(a.value),void(a.value&&!0===a.value["@go"]&&(y=e.apply(void 0,n),b()));if((0,o.isPromise)(a.value))a.value.then(b).catch(function(e){return y.throw(e)});else switch(a.value.op){case r.PUT:c(a.value.ch,a.value.item,b);break;case r.TAKE:s(a.value.ch,b);break;case r.NOOP:b();break;case r.SLEEP:setTimeout(b,a.value.ms);break;case r.STOP:d=l;break;case r.SUB:(0,u.subOnce)(a.value.ch,b);break;case r.CALL_ROUTINE:h(p.apply(void 0,[a.value.routine,b].concat(i(a.value.args),n)));break;case r.FORK_ROUTINE:h(p.apply(void 0,[a.value.routine,function(){}].concat(n,i(a.value.args)))),b();break;default:throw new Error("Unrecognized operation "+a.value.op+" for a routine.")}}}return b(),v}p["@go"]=!0},{"../index":16,"../utils":19,"./constants":7}],14:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var r,u,o=(u=[],(r={}).add=function(e){if(!e||!e.id)throw new Error('Each node in the grid must be an object with "id" field. Instead "'+e+'" given.');u.push(e)},r.remove=function(e){var t=u.findIndex(function(t){return t.id===e.id});t>=0&&u.splice(t,1)},r.reset=function(){u=[]},r.nodes=function(){return u},r.getNodeById=function(e){return u.find(function(t){return t.id===e})},r);n.default=o},{}],15:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var r=a(e("./riew")),u=a(e("./react")),o=a(e("./grid")),i=e("./csp");function a(e){return e&&e.__esModule?e:{default:e}}var f,c,s=function(e){e.defineProduct("riew",function(e){for(var t=arguments.length,n=Array(t>1?t-1:0),u=1;u<t;u++)n[u-1]=arguments[u];var i=r.default.apply(void 0,[e].concat(n));return o.default.add(i),i}),e.defineProduct("reactRiew",function(e){for(var t=arguments.length,n=Array(t>1?t-1:0),r=1;r<t;r++)n[r-1]=arguments[r];return u.default.apply(void 0,[e].concat(n))}),e.defineProduct("channel",function(){var e=i.createChannel.apply(void 0,arguments);return o.default.add(e),e}),e.defineProduct("state",function(){var e=i.createState.apply(void 0,arguments);return o.default.add(e),e})},l=(c={},(f={}).defineProduct=function(e,t){if(c[e])throw new Error('A product with type "'+e+'" already exists.');c[e]=t},f.undefineProduct=function(e){if(!c[e])throw new Error('There is no product with type "'+e+'" to be removed.');delete c[e]},f.produce=function(e){for(var t,n=arguments.length,r=Array(n>1?n-1:0),u=1;u<n;u++)r[u-1]=arguments[u];if(!c[e])throw new Error('There is no product with type "'+e+'".');return(t=c)[e].apply(t,r)},f.reset=function(){c={},s(f)},f.debug=function(){return{productNames:Object.keys(c)}},f);s(l),n.default=l},{"./csp":12,"./grid":14,"./react":17,"./riew":18}],16:[function(e,t,n){"use strict";var r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e};Object.defineProperty(n,"__esModule",{value:!0}),n.grid=n.harvester=n.reset=n.register=n.use=n.state=n.chan=n.react=n.riew=void 0;var u="function"==typeof Symbol&&"symbol"===r(Symbol.iterator)?function(e){return void 0===e?"undefined":r(e)}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":void 0===e?"undefined":r(e)},o=e("./csp");Object.keys(o).forEach(function(e){"default"!==e&&"__esModule"!==e&&Object.defineProperty(n,e,{enumerable:!0,get:function(){return o[e]}})});var i=f(e("./harvester")),a=f(e("./grid"));function f(e){return e&&e.__esModule?e:{default:e}}n.riew=function(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];return i.default.produce.apply(i.default,["riew"].concat(t))},n.react={riew:function(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];return i.default.produce.apply(i.default,["reactRiew"].concat(t))}},n.chan=function(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];return i.default.produce.apply(i.default,["channel"].concat(t))},n.state=function(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];return i.default.produce.apply(i.default,["state"].concat(t))},n.use=function(e){for(var t=arguments.length,n=Array(t>1?t-1:0),r=1;r<t;r++)n[r-1]=arguments[r];return i.default.produce.apply(i.default,[e].concat(n))},n.register=function(e,t){return"object"!==(void 0===t?"undefined":u(t))&&"function"!=typeof t||(t.__registered=e),i.default.defineProduct(e,function(){return t}),t},n.reset=function(){return a.default.reset(),i.default.reset(),o.CHANNELS.reset()},n.harvester=i.default,n.grid=a.default},{"./csp":12,"./grid":14,"./harvester":15}],17:[function(e,t,n){(function(t){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var r=function(e,t){if(Array.isArray(e))return e;if(Symbol.iterator in Object(e))return function(e,t){var n=[],r=!0,u=!1,o=void 0;try{for(var i,a=e[Symbol.iterator]();!(r=(i=a.next()).done)&&(n.push(i.value),!t||n.length!==t);r=!0);}catch(e){u=!0,o=e}finally{try{!r&&a.return&&a.return()}finally{if(u)throw o}}return n}(e,t);throw new TypeError("Invalid attempt to destructure non-iterable instance")};n.default=function(e){for(var t=arguments.length,n=Array(t>1?t-1:0),u=1;u<t;u++)n[u-1]=arguments[u];return function t(){var u=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],s=function(t){var a=(0,o.useState)(null),s=r(a,2),l=s[0],d=s[1],v=(0,o.useState)(null),p=r(v,2),h=p[0],y=p[1],b=(0,o.useRef)(!0);return(0,o.useEffect)(function(){l&&l.update(t)},[t]),(0,o.useEffect)(function(){var e;(l=f.riew.apply(void 0,[function(e){b&&y(null===e?null:e)}].concat(n)),u&&u.length>0)&&(l=(e=l).with.apply(e,c(u)));return d(l),l.mount(t),b.current=!0,function(){b.current=!1,l.unmount()}},[]),null===h?null:i.default.createElement(e,h)};return s.displayName="Riew_"+(0,a.getFuncName)(e),s.with=function(){for(var e=arguments.length,n=Array(e),r=0;r<e;r++)n[r]=arguments[r];return t(n)},s}()};var u,o="undefined"!=typeof window?window.React:void 0!==t?t.React:null,i=(u=o)&&u.__esModule?u:{default:u},a=e("../utils"),f=e("../index");function c(e){if(Array.isArray(e)){for(var t=0,n=Array(e.length);t<e.length;t++)n[t]=e[t];return n}return Array.from(e)}}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"../index":16,"../utils":19}],18:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var r=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e};n.default=function e(t){for(var n=arguments.length,f=Array(n>1?n-1:0),c=1;c<n;c++)f[c-1]=arguments[c];var s=(0,o.getFuncName)(t);var l={id:(0,o.getId)(s),name:s};var d=a(t);var v=[];var p=[];var h=[];var y={};var b={};var g=function(){var e=u.state.apply(void 0,arguments);return v.push(e),e};var m=function(e,t){e in b||(b[e]=!0,(0,u.sub)(e,t))};var E=l.id+"_view";var _=l.id+"_props";var O=function(e){return Object.keys(e).reduce(function(t,n){return u.CHANNELS.exists(e[n])||(0,u.isChannel)(e[n])?(m(e[n],function(e){(0,u.sput)(E,i({},n,e))}),(0,u.stake)(e[n],function(e){return(0,u.sput)(E,i({},n,e))})):(0,u.isState)(e[n])?(m(e[n].READ,function(e){return(0,u.sput)(E,i({},n,e))}),(0,u.stake)(e[n].READ,function(e){return(0,u.sput)(E,i({},n,e))})):t[n]=e[n],t},{})};l.mount=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};(0,o.requireObject)(e),m(_,function(e){return(0,u.sput)(E,e)}),m(E,d.push),h=f.map(function(e){return(0,u.go)(e,function(e){"function"==typeof e&&p.push(e)},r({render:function(e){(0,o.requireObject)(e),(0,u.sput)(E,O(e))},state:g,props:_},y))}),(0,o.isObjectEmpty)(y)||(0,u.sput)(E,O(y)),(0,u.sput)(_,e)};l.unmount=function(){p.forEach(function(e){return e()}),p=[],v.forEach(function(e){return e.destroy()}),v=[],h.forEach(function(e){return e.stop()}),h=[],d.destroy(),(0,u.close)(_),(0,u.close)(E)};l.update=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};(0,o.requireObject)(e),(0,u.sput)(_,e)};l.with=function(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];return l.__setExternals(t),l};l.test=function(n){var r=e.apply(void 0,[t].concat(f));return r.__setExternals([n]),r};l.__setExternals=function(e){var t=e.reduce(function(e,t){return e=r({},e,"string"==typeof t?i({},t,(0,u.use)(t)):t)},{});y=r({},y,t)};return l};var u=e("./index"),o=e("./utils");function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var a=function(e){var t={},n=!1,r=!0;return{push:function(i){i!==u.chan.CLOSED&&i!==u.chan.ENDED&&(t=(0,o.accumulate)(t,i),n||(n=!0,Promise.resolve().then(function(){r&&e(t),n=!1})))},destroy:function(){r=!1}}}},{"./index":16,"./utils":19}],19:[function(e,t,n){"use strict";var r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e};Object.defineProperty(n,"__esModule",{value:!0});var u=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},o="function"==typeof Symbol&&"symbol"===r(Symbol.iterator)?function(e){return void 0===e?"undefined":r(e)}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":void 0===e?"undefined":r(e)};n.isObjectEmpty=function(e){for(var t in e)if(e.hasOwnProperty(t))return!1;return!0},n.requireObject=function(e){if(null==e||void 0!==e&&"object"!==(void 0===e?"undefined":o(e)))throw new Error('A key-value object expected. Instead "'+e+'" passed.')};n.getFuncName=function(e){if(e.name)return e.name;var t=/^function\s+([\w\$]+)\s*\(/.exec(e.toString());return t?t[1]:"unknown"};var i=0;n.getId=function(e){return e+"_"+ ++i};n.accumulate=function(e,t){return u({},e,t)},n.isPromise=function(e){return e&&"function"==typeof e.then},n.isObjectLiteral=function(e){return!!e&&e.constructor==={}.constructor};var a=n.isGenerator=function(e){return e&&"function"==typeof e.next&&"function"==typeof e.throw};n.isGeneratorFunction=function(e){var t=e.constructor;return!!t&&("GeneratorFunction"===t.name||"GeneratorFunction"===t.displayName||a(t.prototype))}},{}]},{},[16])(16)});