!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{("undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this).rine=e()}}(function(){return function i(o,a,f){function c(t,e){if(!a[t]){if(!o[t]){var n="function"==typeof require&&require;if(!e&&n)return n(t,!0);if(s)return s(t,!0);var r=new Error("Cannot find module '"+t+"'");throw r.code="MODULE_NOT_FOUND",r}var u=a[t]={exports:{}};o[t][0].call(u.exports,function(e){return c(o[t][1][e]||e)},u,u.exports,i,o,a,f)}return a[t].exports}for(var s="function"==typeof require&&require,e=0;e<f.length;e++)c(f[e]);return c}({1:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var u=0;function i(e,t,n){var r={__rine:"task",id:"@@t"+ ++u,active:!0,once:!(2<arguments.length&&void 0!==n)||n,type:e,callback:t,done:null,teardown:function(){this.active=!1},execute:function(e,t){this.active&&(t?this.callback(e,t):this.callback(e),this.once&&o.removeTasks([this]))}};return t||(r.done=new Promise(function(e){r.callback=e})),r}var o={tasks:[],addTask:function(e,t,n){var r=i(e,t,n);return this.tasks.push(r),r},removeTasks:function(e){var t=e.reduce(function(e,t){return e[t.id]=!0,e},{});this.tasks=this.tasks.filter(function(e){return!(e.id in t)||(e.teardown(),!1)})},put:function(t,n){this.tasks.forEach(function(e){e.type===t?e.execute(n):"*"===e.type&&e.execute(n,t)})},take:function(e,t){return this.addTask(e,t,!0)},takeEvery:function(e,t){return this.addTask(e,t,!1)},reset:function(){this.tasks=[]},isTask:function(e){return e&&"task"===e.__rine},putBulk:function(e){var t=this;e.forEach(function(e){return t.put(e)})}};n.default=o},{}],2:[function(r,e,u){(function(e){"use strict";Object.defineProperty(u,"__esModule",{value:!0});var f=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},c=function(e,t){if(Array.isArray(e))return e;if(Symbol.iterator in Object(e))return function(e,t){var n=[],r=!0,u=!1,i=void 0;try{for(var o,a=e[Symbol.iterator]();!(r=(o=a.next()).done)&&(n.push(o.value),!t||n.length!==t);r=!0);}catch(e){u=!0,i=e}finally{try{!r&&a.return&&a.return()}finally{if(u)throw i}}return n}(e,t);throw new TypeError("Invalid attempt to destructure non-iterable instance")};u.default=function(r,o){var a=2<arguments.length&&void 0!==arguments[2]?arguments[2]:function(e){return e};function e(e){var t=(0,s.useState)(function(r){return Object.keys(r).reduce(function(e,t){var n=r[t];return v(n)?e[t]=p(n):e[t]=n,e},{})}(o)),n=c(t,2),u=n[0],i=n[1];return(0,s.useEffect)(function(){var r=[];return Object.keys(o).forEach(function(t){var e=o[t];if(v(e)){var n=e;r.push(n.subscribe(function(){var e=p(n);(0,l.default)(u[t],e)||i(u=f({},u,function(e,t,n){t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n;return e}({},t,e)))}))}}),function(){r.forEach(function(e){return e()})}},[]),d.default.createElement(r,f({},a(u),e))}return e.displayName="Connected("+(0,t.getFuncName)(r)+")",e};var s="undefined"!=typeof window?window.React:void 0!==e?e.React:null,d=n(s),l=n(r("fast-deep-equal")),t=r("../utils");function n(e){return e&&e.__esModule?e:{default:e}}function v(e){return"state"===e.__rine}function p(e){return e.get()}}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"../utils":6,"fast-deep-equal":7}],3:[function(u,e,i){(function(e){"use strict";Object.defineProperty(i,"__esModule",{value:!0});var s=function(e,t){if(Array.isArray(e))return e;if(Symbol.iterator in Object(e))return function(e,t){var n=[],r=!0,u=!1,i=void 0;try{for(var o,a=e[Symbol.iterator]();!(r=(o=a.next()).done)&&(n.push(o.value),!t||n.length!==t);r=!0);}catch(e){u=!0,i=e}finally{try{!r&&a.return&&a.return()}finally{if(u)throw i}}return n}(e,t);throw new TypeError("Invalid attempt to destructure non-iterable instance")};i.createRoutineInstance=h,i.default=function(c,e){function t(e){var t=(0,d.useState)(null),n=s(t,2),r=n[0],u=n[1],i=(0,d.useState)(null),o=s(i,2),a=o[0],f=o[1];return(0,d.useEffect)(function(){a&&a.updated(e)},[e]),(0,d.useEffect)(function(){a&&a.rendered()},[r]),(0,d.useEffect)(function(){return f(a=h(c)),a.in(u,e),function(){v.default.put(b(a.id))}},[]),r}return t.displayName="Routine("+(0,p.getFuncName)(c)+")",t};var d="undefined"!=typeof window?window.React:void 0!==e?e.React:null,l=t(d),v=t(u("./System")),p=u("../utils"),y=u("./state");function t(e){return e&&e.__esModule?e:{default:e}}var n=0,r=function(){return"@@r"+ ++n},b=function(e){return e+"_unmounted"};function h(e){var t=r(),u=!1,i=void 0,o=void 0,a=function(){},f=[],c=[];function s(){return u}var n={__rine:"routine",id:t,name:(0,p.getFuncName)(e),in:function(t,n){u=!0,o=function(e){u&&t(l.default.createElement(i,e))};var r=e(function(e){return i="function"==typeof e?e:function(){return e},o(n),new Promise(function(e){a=function(){return e()}})},{isMounted:s});(0,p.isGenerator)(r)&&!function t(e){if(v.default.isTask(e.value)){var n=e.value;if(f.push(n),n.done)return void n.done.then(function(e){return t(r.next(e))})}else(0,y.isState)(e.value)&&c.push((0,y.teardownAction)(e.value.id));e.done||t(r.next(e.value))}(r.next())},updated:function(e){o(e)},rendered:function(){a()},out:function(){u=!1}};return v.default.addTask(b(t),function(){n.out(),v.default.removeTasks(f),v.default.putBulk(c)}),n}}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"../utils":6,"./System":1,"./state":4}],4:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.isState=n.teardownAction=void 0,n.default=function(e,n){var r=0,u=e,i=[],t=void 0,o={__rine:"state",__subscribers:function(){return i},id:f(),set:function(e){u=e,i.forEach(function(e){return(0,e.update)(u)})},get:function(){return u},subscribe:function(e){var t=++r;return i.push({id:t,update:e}),function(){i=i.filter(function(e){return e.id!==t})}},teardown:function(){i=[],u=void 0},put:function(e,t){n&&this.set(n(u,{type:e,payload:t}))}};n&&(t=a.default.takeEvery("*",function(e,t){return o.put(t,e)}));return a.default.addTask(c(o.id),function(){o.teardown(),t&&a.default.removeTasks([t])}),o};var r,u=e("./System"),a=(r=u)&&r.__esModule?r:{default:r};var i=0,f=function(){return"@@s"+ ++i},c=n.teardownAction=function(e){return e+"_teardown"};n.isState=function(e){return e&&"state"===e.__rine}},{"./System":1}],5:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.takeEvery=n.take=n.put=n.connect=n.state=n.routine=n.System=void 0;var r=e("./api/System");Object.defineProperty(n,"System",{enumerable:!0,get:function(){return f(r).default}});var u=e("./api/routine");Object.defineProperty(n,"routine",{enumerable:!0,get:function(){return f(u).default}});var i=e("./api/state");Object.defineProperty(n,"state",{enumerable:!0,get:function(){return f(i).default}});var o=e("./api/connect");Object.defineProperty(n,"connect",{enumerable:!0,get:function(){return f(o).default}});var a=f(r);function f(e){return e&&e.__esModule?e:{default:e}}n.put=a.default.put.bind(a.default),n.take=a.default.take.bind(a.default),n.takeEvery=a.default.takeEvery.bind(a.default)},{"./api/System":1,"./api/connect":2,"./api/routine":3,"./api/state":4}],6:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0});n.isGenerator=function(e){return e&&"function"==typeof e.next},n.isPromise=function(e){return e&&"function"==typeof e.then},n.getFuncName=function(e){if(e.name)return e.name;var t=/^function\s+([\w\$]+)\s*\(/.exec(e.toString());return t?t[1]:"unknown"}},{}],7:[function(e,t,n){"use strict";var v=Array.isArray,p=Object.keys,y=Object.prototype.hasOwnProperty;t.exports=function e(t,n){if(t===n)return!0;if(t&&n&&"object"==typeof t&&"object"==typeof n){var r,u,i,o=v(t),a=v(n);if(o&&a){if((u=t.length)!=n.length)return!1;for(r=u;0!=r--;)if(!e(t[r],n[r]))return!1;return!0}if(o!=a)return!1;var f=t instanceof Date,c=n instanceof Date;if(f!=c)return!1;if(f&&c)return t.getTime()==n.getTime();var s=t instanceof RegExp,d=n instanceof RegExp;if(s!=d)return!1;if(s&&d)return t.toString()==n.toString();var l=p(t);if((u=l.length)!==p(n).length)return!1;for(r=u;0!=r--;)if(!y.call(n,l[r]))return!1;for(r=u;0!=r--;)if(!e(t[i=l[r]],n[i]))return!1;return!0}return t!=t&&n!=n}},{}]},{},[5])(5)});