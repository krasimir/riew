!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{("undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this).rine=e()}}(function(){return function i(u,f,c){function l(n,e){if(!f[n]){if(!u[n]){var t="function"==typeof require&&require;if(!e&&t)return t(n,!0);if(d)return d(n,!0);var r=new Error("Cannot find module '"+n+"'");throw r.code="MODULE_NOT_FOUND",r}var o=f[n]={exports:{}};u[n][0].call(o.exports,function(e){return l(u[n][1][e]||e)},o,o.exports,i,u,f,c)}return f[n].exports}for(var d="function"==typeof require&&require,e=0;e<c.length;e++)l(c[e]);return l}({1:[function(e,n,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var d=Object.assign||function(e){for(var n=1;n<arguments.length;n++){var t=arguments[n];for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r])}return e};t.default=function(t,e){var r=e.broadcast,o=!1,u=[],f=a();function i(o,n){var e=!(2<arguments.length&&void 0!==arguments[2])||arguments[2],i=[];u=u.filter(function(e){var n=e.type,t=e.done,r=e.once;return n!==o||(i.push(t),!r)}),i.forEach(function(e){return e(n)}),e&&r(o,n,f)}function c(n,e){if(!e)return new Promise(function(e){u.push({type:n,done:function(){o&&e.apply(void 0,arguments)},once:!0})});u.push({type:n,done:e,once:!0})}function l(e,n){u.push({type:e,done:n,once:!1})}return{id:f,in:function(n,e){return o=!0,t(d({},e,{render:function(e){o&&n(e)},take:c,takeEvery:l,put:i}))},out:function(){o=!1,u=[]},put:i,system:function(){return{mounted:o,pending:u}}}};var r=0,a=function(){return"r"+ ++r}},{}],2:[function(r,e,o){(function(e){"use strict";Object.defineProperty(o,"__esModule",{value:!0}),o.System=void 0;var u=function(e,n){if(Array.isArray(e))return e;if(Symbol.iterator in Object(e))return function(e,n){var t=[],r=!0,o=!1,i=void 0;try{for(var u,f=e[Symbol.iterator]();!(r=(u=f.next()).done)&&(t.push(u.value),!n||t.length!==n);r=!0);}catch(e){o=!0,i=e}finally{try{!r&&f.return&&f.return()}finally{if(o)throw i}}return t}(e,n);throw new TypeError("Invalid attempt to destructure non-iterable instance")};o.Rine=function(i){return function(t){var e=(0,f.useState)(null),n=u(e,2),r=n[0],o=n[1];return(0,f.useEffect)(function(){var e=(0,c.default)(i,{broadcast:function(){a.put.apply(a,arguments)}});a.addController(e);var n=e.in(o,t);return!n||d(n)||l(n)||o(n),function(){e.out(),a.removeController(e)}},[]),r}};var n,f="undefined"!=typeof window?window.React:void 0!==e?e.React:null,t=r("./RoutineController"),c=(n=t)&&n.__esModule?n:{default:n};var l=function(e){return e&&"function"==typeof e.next},d=function(e){return e&&"function"==typeof e.then},a=o.System={controllers:{},addController:function(e){this.controllers[e.id]=e},removeController:function(e){delete this.controllers[e.id]},put:function(n,t,r){var o=this;Object.keys(this.controllers).forEach(function(e){e!==r&&o.controllers[e].put(n,t,!1)})},debug:function(){var t=this,e=Object.keys(this.controllers).reduce(function(e,n){return e=e.concat(t.controllers[n].system().pending)},[]);return{controllers:this.controllers,pending:e}}}}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"./RoutineController":1}]},{},[2])(2)});