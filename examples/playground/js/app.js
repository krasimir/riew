/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "../../node_modules/object-assign/index.js":
/*!******************************************************************************!*\
  !*** /Users/krasimir/Work/Krasimir/riew/node_modules/object-assign/index.js ***!
  \******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/


/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};


/***/ }),

/***/ "../../node_modules/prop-types/checkPropTypes.js":
/*!************************************************************************************!*\
  !*** /Users/krasimir/Work/Krasimir/riew/node_modules/prop-types/checkPropTypes.js ***!
  \************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var printWarning = function() {};

if (true) {
  var ReactPropTypesSecret = __webpack_require__(/*! ./lib/ReactPropTypesSecret */ "../../node_modules/prop-types/lib/ReactPropTypesSecret.js");
  var loggedTypeFailures = {};
  var has = Function.call.bind(Object.prototype.hasOwnProperty);

  printWarning = function(text) {
    var message = 'Warning: ' + text;
    if (typeof console !== 'undefined') {
      console.error(message);
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch (x) {}
  };
}

/**
 * Assert that the values match with the type specs.
 * Error messages are memorized and will only be shown once.
 *
 * @param {object} typeSpecs Map of name to a ReactPropType
 * @param {object} values Runtime values that need to be type-checked
 * @param {string} location e.g. "prop", "context", "child context"
 * @param {string} componentName Name of the component for error messages.
 * @param {?Function} getStack Returns the component stack.
 * @private
 */
function checkPropTypes(typeSpecs, values, location, componentName, getStack) {
  if (true) {
    for (var typeSpecName in typeSpecs) {
      if (has(typeSpecs, typeSpecName)) {
        var error;
        // Prop type validation may throw. In case they do, we don't want to
        // fail the render phase where it didn't fail before. So we log it.
        // After these have been cleaned up, we'll let them throw.
        try {
          // This is intentionally an invariant that gets caught. It's the same
          // behavior as without this statement except with a better message.
          if (typeof typeSpecs[typeSpecName] !== 'function') {
            var err = Error(
              (componentName || 'React class') + ': ' + location + ' type `' + typeSpecName + '` is invalid; ' +
              'it must be a function, usually from the `prop-types` package, but received `' + typeof typeSpecs[typeSpecName] + '`.'
            );
            err.name = 'Invariant Violation';
            throw err;
          }
          error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret);
        } catch (ex) {
          error = ex;
        }
        if (error && !(error instanceof Error)) {
          printWarning(
            (componentName || 'React class') + ': type specification of ' +
            location + ' `' + typeSpecName + '` is invalid; the type checker ' +
            'function must return `null` or an `Error` but returned a ' + typeof error + '. ' +
            'You may have forgotten to pass an argument to the type checker ' +
            'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' +
            'shape all require an argument).'
          );
        }
        if (error instanceof Error && !(error.message in loggedTypeFailures)) {
          // Only monitor this failure once because there tends to be a lot of the
          // same error.
          loggedTypeFailures[error.message] = true;

          var stack = getStack ? getStack() : '';

          printWarning(
            'Failed ' + location + ' type: ' + error.message + (stack != null ? stack : '')
          );
        }
      }
    }
  }
}

/**
 * Resets warning cache when testing.
 *
 * @private
 */
checkPropTypes.resetWarningCache = function() {
  if (true) {
    loggedTypeFailures = {};
  }
}

module.exports = checkPropTypes;


/***/ }),

/***/ "../../node_modules/prop-types/lib/ReactPropTypesSecret.js":
/*!**********************************************************************************************!*\
  !*** /Users/krasimir/Work/Krasimir/riew/node_modules/prop-types/lib/ReactPropTypesSecret.js ***!
  \**********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

module.exports = ReactPropTypesSecret;


/***/ }),

/***/ "../../node_modules/react/cjs/react.development.js":
/*!**************************************************************************************!*\
  !*** /Users/krasimir/Work/Krasimir/riew/node_modules/react/cjs/react.development.js ***!
  \**************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/** @license React v16.9.0
 * react.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */





if (true) {
  (function() {
'use strict';

var _assign = __webpack_require__(/*! object-assign */ "../../node_modules/object-assign/index.js");
var checkPropTypes = __webpack_require__(/*! prop-types/checkPropTypes */ "../../node_modules/prop-types/checkPropTypes.js");

// TODO: this is special because it gets imported during build.

var ReactVersion = '16.9.0';

// The Symbol used to tag the ReactElement-like types. If there is no native Symbol
// nor polyfill, then a plain number is used for performance.
var hasSymbol = typeof Symbol === 'function' && Symbol.for;

var REACT_ELEMENT_TYPE = hasSymbol ? Symbol.for('react.element') : 0xeac7;
var REACT_PORTAL_TYPE = hasSymbol ? Symbol.for('react.portal') : 0xeaca;
var REACT_FRAGMENT_TYPE = hasSymbol ? Symbol.for('react.fragment') : 0xeacb;
var REACT_STRICT_MODE_TYPE = hasSymbol ? Symbol.for('react.strict_mode') : 0xeacc;
var REACT_PROFILER_TYPE = hasSymbol ? Symbol.for('react.profiler') : 0xead2;
var REACT_PROVIDER_TYPE = hasSymbol ? Symbol.for('react.provider') : 0xeacd;
var REACT_CONTEXT_TYPE = hasSymbol ? Symbol.for('react.context') : 0xeace;
// TODO: We don't use AsyncMode or ConcurrentMode anymore. They were temporary
// (unstable) APIs that have been removed. Can we remove the symbols?

var REACT_CONCURRENT_MODE_TYPE = hasSymbol ? Symbol.for('react.concurrent_mode') : 0xeacf;
var REACT_FORWARD_REF_TYPE = hasSymbol ? Symbol.for('react.forward_ref') : 0xead0;
var REACT_SUSPENSE_TYPE = hasSymbol ? Symbol.for('react.suspense') : 0xead1;
var REACT_SUSPENSE_LIST_TYPE = hasSymbol ? Symbol.for('react.suspense_list') : 0xead8;
var REACT_MEMO_TYPE = hasSymbol ? Symbol.for('react.memo') : 0xead3;
var REACT_LAZY_TYPE = hasSymbol ? Symbol.for('react.lazy') : 0xead4;
var REACT_FUNDAMENTAL_TYPE = hasSymbol ? Symbol.for('react.fundamental') : 0xead5;
var REACT_RESPONDER_TYPE = hasSymbol ? Symbol.for('react.responder') : 0xead6;

var MAYBE_ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
var FAUX_ITERATOR_SYMBOL = '@@iterator';

function getIteratorFn(maybeIterable) {
  if (maybeIterable === null || typeof maybeIterable !== 'object') {
    return null;
  }
  var maybeIterator = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL];
  if (typeof maybeIterator === 'function') {
    return maybeIterator;
  }
  return null;
}

// Do not require this module directly! Use normal `invariant` calls with
// template literal strings. The messages will be converted to ReactError during
// build, and in production they will be minified.

// Do not require this module directly! Use normal `invariant` calls with
// template literal strings. The messages will be converted to ReactError during
// build, and in production they will be minified.

function ReactError(error) {
  error.name = 'Invariant Violation';
  return error;
}

/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

/**
 * Forked from fbjs/warning:
 * https://github.com/facebook/fbjs/blob/e66ba20ad5be433eb54423f2b097d829324d9de6/packages/fbjs/src/__forks__/warning.js
 *
 * Only change is we use console.warn instead of console.error,
 * and do nothing when 'console' is not supported.
 * This really simplifies the code.
 * ---
 * Similar to invariant but only logs a warning if the condition is not met.
 * This can be used to log issues in development environments in critical
 * paths. Removing the logging code for production environments will keep the
 * same logic and follow the same code paths.
 */

var lowPriorityWarning = function () {};

{
  var printWarning = function (format) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    var argIndex = 0;
    var message = 'Warning: ' + format.replace(/%s/g, function () {
      return args[argIndex++];
    });
    if (typeof console !== 'undefined') {
      console.warn(message);
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch (x) {}
  };

  lowPriorityWarning = function (condition, format) {
    if (format === undefined) {
      throw new Error('`lowPriorityWarning(condition, format, ...args)` requires a warning ' + 'message argument');
    }
    if (!condition) {
      for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
        args[_key2 - 2] = arguments[_key2];
      }

      printWarning.apply(undefined, [format].concat(args));
    }
  };
}

var lowPriorityWarning$1 = lowPriorityWarning;

/**
 * Similar to invariant but only logs a warning if the condition is not met.
 * This can be used to log issues in development environments in critical
 * paths. Removing the logging code for production environments will keep the
 * same logic and follow the same code paths.
 */

var warningWithoutStack = function () {};

{
  warningWithoutStack = function (condition, format) {
    for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }

    if (format === undefined) {
      throw new Error('`warningWithoutStack(condition, format, ...args)` requires a warning ' + 'message argument');
    }
    if (args.length > 8) {
      // Check before the condition to catch violations early.
      throw new Error('warningWithoutStack() currently supports at most 8 arguments.');
    }
    if (condition) {
      return;
    }
    if (typeof console !== 'undefined') {
      var argsWithFormat = args.map(function (item) {
        return '' + item;
      });
      argsWithFormat.unshift('Warning: ' + format);

      // We intentionally don't use spread (or .apply) directly because it
      // breaks IE9: https://github.com/facebook/react/issues/13610
      Function.prototype.apply.call(console.error, console, argsWithFormat);
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      var argIndex = 0;
      var message = 'Warning: ' + format.replace(/%s/g, function () {
        return args[argIndex++];
      });
      throw new Error(message);
    } catch (x) {}
  };
}

var warningWithoutStack$1 = warningWithoutStack;

var didWarnStateUpdateForUnmountedComponent = {};

function warnNoop(publicInstance, callerName) {
  {
    var _constructor = publicInstance.constructor;
    var componentName = _constructor && (_constructor.displayName || _constructor.name) || 'ReactClass';
    var warningKey = componentName + '.' + callerName;
    if (didWarnStateUpdateForUnmountedComponent[warningKey]) {
      return;
    }
    warningWithoutStack$1(false, "Can't call %s on a component that is not yet mounted. " + 'This is a no-op, but it might indicate a bug in your application. ' + 'Instead, assign to `this.state` directly or define a `state = {};` ' + 'class property with the desired state in the %s component.', callerName, componentName);
    didWarnStateUpdateForUnmountedComponent[warningKey] = true;
  }
}

/**
 * This is the abstract API for an update queue.
 */
var ReactNoopUpdateQueue = {
  /**
   * Checks whether or not this composite component is mounted.
   * @param {ReactClass} publicInstance The instance we want to test.
   * @return {boolean} True if mounted, false otherwise.
   * @protected
   * @final
   */
  isMounted: function (publicInstance) {
    return false;
  },

  /**
   * Forces an update. This should only be invoked when it is known with
   * certainty that we are **not** in a DOM transaction.
   *
   * You may want to call this when you know that some deeper aspect of the
   * component's state has changed but `setState` was not called.
   *
   * This will not invoke `shouldComponentUpdate`, but it will invoke
   * `componentWillUpdate` and `componentDidUpdate`.
   *
   * @param {ReactClass} publicInstance The instance that should rerender.
   * @param {?function} callback Called after component is updated.
   * @param {?string} callerName name of the calling function in the public API.
   * @internal
   */
  enqueueForceUpdate: function (publicInstance, callback, callerName) {
    warnNoop(publicInstance, 'forceUpdate');
  },

  /**
   * Replaces all of the state. Always use this or `setState` to mutate state.
   * You should treat `this.state` as immutable.
   *
   * There is no guarantee that `this.state` will be immediately updated, so
   * accessing `this.state` after calling this method may return the old value.
   *
   * @param {ReactClass} publicInstance The instance that should rerender.
   * @param {object} completeState Next state.
   * @param {?function} callback Called after component is updated.
   * @param {?string} callerName name of the calling function in the public API.
   * @internal
   */
  enqueueReplaceState: function (publicInstance, completeState, callback, callerName) {
    warnNoop(publicInstance, 'replaceState');
  },

  /**
   * Sets a subset of the state. This only exists because _pendingState is
   * internal. This provides a merging strategy that is not available to deep
   * properties which is confusing. TODO: Expose pendingState or don't use it
   * during the merge.
   *
   * @param {ReactClass} publicInstance The instance that should rerender.
   * @param {object} partialState Next partial state to be merged with state.
   * @param {?function} callback Called after component is updated.
   * @param {?string} Name of the calling function in the public API.
   * @internal
   */
  enqueueSetState: function (publicInstance, partialState, callback, callerName) {
    warnNoop(publicInstance, 'setState');
  }
};

var emptyObject = {};
{
  Object.freeze(emptyObject);
}

/**
 * Base class helpers for the updating state of a component.
 */
function Component(props, context, updater) {
  this.props = props;
  this.context = context;
  // If a component has string refs, we will assign a different object later.
  this.refs = emptyObject;
  // We initialize the default updater but the real one gets injected by the
  // renderer.
  this.updater = updater || ReactNoopUpdateQueue;
}

Component.prototype.isReactComponent = {};

/**
 * Sets a subset of the state. Always use this to mutate
 * state. You should treat `this.state` as immutable.
 *
 * There is no guarantee that `this.state` will be immediately updated, so
 * accessing `this.state` after calling this method may return the old value.
 *
 * There is no guarantee that calls to `setState` will run synchronously,
 * as they may eventually be batched together.  You can provide an optional
 * callback that will be executed when the call to setState is actually
 * completed.
 *
 * When a function is provided to setState, it will be called at some point in
 * the future (not synchronously). It will be called with the up to date
 * component arguments (state, props, context). These values can be different
 * from this.* because your function may be called after receiveProps but before
 * shouldComponentUpdate, and this new state, props, and context will not yet be
 * assigned to this.
 *
 * @param {object|function} partialState Next partial state or function to
 *        produce next partial state to be merged with current state.
 * @param {?function} callback Called after state is updated.
 * @final
 * @protected
 */
Component.prototype.setState = function (partialState, callback) {
  (function () {
    if (!(typeof partialState === 'object' || typeof partialState === 'function' || partialState == null)) {
      {
        throw ReactError(Error('setState(...): takes an object of state variables to update or a function which returns an object of state variables.'));
      }
    }
  })();
  this.updater.enqueueSetState(this, partialState, callback, 'setState');
};

/**
 * Forces an update. This should only be invoked when it is known with
 * certainty that we are **not** in a DOM transaction.
 *
 * You may want to call this when you know that some deeper aspect of the
 * component's state has changed but `setState` was not called.
 *
 * This will not invoke `shouldComponentUpdate`, but it will invoke
 * `componentWillUpdate` and `componentDidUpdate`.
 *
 * @param {?function} callback Called after update is complete.
 * @final
 * @protected
 */
Component.prototype.forceUpdate = function (callback) {
  this.updater.enqueueForceUpdate(this, callback, 'forceUpdate');
};

/**
 * Deprecated APIs. These APIs used to exist on classic React classes but since
 * we would like to deprecate them, we're not going to move them over to this
 * modern base class. Instead, we define a getter that warns if it's accessed.
 */
{
  var deprecatedAPIs = {
    isMounted: ['isMounted', 'Instead, make sure to clean up subscriptions and pending requests in ' + 'componentWillUnmount to prevent memory leaks.'],
    replaceState: ['replaceState', 'Refactor your code to use setState instead (see ' + 'https://github.com/facebook/react/issues/3236).']
  };
  var defineDeprecationWarning = function (methodName, info) {
    Object.defineProperty(Component.prototype, methodName, {
      get: function () {
        lowPriorityWarning$1(false, '%s(...) is deprecated in plain JavaScript React classes. %s', info[0], info[1]);
        return undefined;
      }
    });
  };
  for (var fnName in deprecatedAPIs) {
    if (deprecatedAPIs.hasOwnProperty(fnName)) {
      defineDeprecationWarning(fnName, deprecatedAPIs[fnName]);
    }
  }
}

function ComponentDummy() {}
ComponentDummy.prototype = Component.prototype;

/**
 * Convenience component with default shallow equality check for sCU.
 */
function PureComponent(props, context, updater) {
  this.props = props;
  this.context = context;
  // If a component has string refs, we will assign a different object later.
  this.refs = emptyObject;
  this.updater = updater || ReactNoopUpdateQueue;
}

var pureComponentPrototype = PureComponent.prototype = new ComponentDummy();
pureComponentPrototype.constructor = PureComponent;
// Avoid an extra prototype jump for these methods.
_assign(pureComponentPrototype, Component.prototype);
pureComponentPrototype.isPureReactComponent = true;

// an immutable object with a single mutable value
function createRef() {
  var refObject = {
    current: null
  };
  {
    Object.seal(refObject);
  }
  return refObject;
}

/**
 * Keeps track of the current dispatcher.
 */
var ReactCurrentDispatcher = {
  /**
   * @internal
   * @type {ReactComponent}
   */
  current: null
};

/**
 * Keeps track of the current batch's configuration such as how long an update
 * should suspend for if it needs to.
 */
var ReactCurrentBatchConfig = {
  suspense: null
};

/**
 * Keeps track of the current owner.
 *
 * The current owner is the component who should own any components that are
 * currently being constructed.
 */
var ReactCurrentOwner = {
  /**
   * @internal
   * @type {ReactComponent}
   */
  current: null
};

var BEFORE_SLASH_RE = /^(.*)[\\\/]/;

var describeComponentFrame = function (name, source, ownerName) {
  var sourceInfo = '';
  if (source) {
    var path = source.fileName;
    var fileName = path.replace(BEFORE_SLASH_RE, '');
    {
      // In DEV, include code for a common special case:
      // prefer "folder/index.js" instead of just "index.js".
      if (/^index\./.test(fileName)) {
        var match = path.match(BEFORE_SLASH_RE);
        if (match) {
          var pathBeforeSlash = match[1];
          if (pathBeforeSlash) {
            var folderName = pathBeforeSlash.replace(BEFORE_SLASH_RE, '');
            fileName = folderName + '/' + fileName;
          }
        }
      }
    }
    sourceInfo = ' (at ' + fileName + ':' + source.lineNumber + ')';
  } else if (ownerName) {
    sourceInfo = ' (created by ' + ownerName + ')';
  }
  return '\n    in ' + (name || 'Unknown') + sourceInfo;
};

var Resolved = 1;


function refineResolvedLazyComponent(lazyComponent) {
  return lazyComponent._status === Resolved ? lazyComponent._result : null;
}

function getWrappedName(outerType, innerType, wrapperName) {
  var functionName = innerType.displayName || innerType.name || '';
  return outerType.displayName || (functionName !== '' ? wrapperName + '(' + functionName + ')' : wrapperName);
}

function getComponentName(type) {
  if (type == null) {
    // Host root, text node or just invalid type.
    return null;
  }
  {
    if (typeof type.tag === 'number') {
      warningWithoutStack$1(false, 'Received an unexpected object in getComponentName(). ' + 'This is likely a bug in React. Please file an issue.');
    }
  }
  if (typeof type === 'function') {
    return type.displayName || type.name || null;
  }
  if (typeof type === 'string') {
    return type;
  }
  switch (type) {
    case REACT_FRAGMENT_TYPE:
      return 'Fragment';
    case REACT_PORTAL_TYPE:
      return 'Portal';
    case REACT_PROFILER_TYPE:
      return 'Profiler';
    case REACT_STRICT_MODE_TYPE:
      return 'StrictMode';
    case REACT_SUSPENSE_TYPE:
      return 'Suspense';
    case REACT_SUSPENSE_LIST_TYPE:
      return 'SuspenseList';
  }
  if (typeof type === 'object') {
    switch (type.$$typeof) {
      case REACT_CONTEXT_TYPE:
        return 'Context.Consumer';
      case REACT_PROVIDER_TYPE:
        return 'Context.Provider';
      case REACT_FORWARD_REF_TYPE:
        return getWrappedName(type, type.render, 'ForwardRef');
      case REACT_MEMO_TYPE:
        return getComponentName(type.type);
      case REACT_LAZY_TYPE:
        {
          var thenable = type;
          var resolvedThenable = refineResolvedLazyComponent(thenable);
          if (resolvedThenable) {
            return getComponentName(resolvedThenable);
          }
          break;
        }
    }
  }
  return null;
}

var ReactDebugCurrentFrame = {};

var currentlyValidatingElement = null;

function setCurrentlyValidatingElement(element) {
  {
    currentlyValidatingElement = element;
  }
}

{
  // Stack implementation injected by the current renderer.
  ReactDebugCurrentFrame.getCurrentStack = null;

  ReactDebugCurrentFrame.getStackAddendum = function () {
    var stack = '';

    // Add an extra top frame while an element is being validated
    if (currentlyValidatingElement) {
      var name = getComponentName(currentlyValidatingElement.type);
      var owner = currentlyValidatingElement._owner;
      stack += describeComponentFrame(name, currentlyValidatingElement._source, owner && getComponentName(owner.type));
    }

    // Delegate to the injected renderer-specific implementation
    var impl = ReactDebugCurrentFrame.getCurrentStack;
    if (impl) {
      stack += impl() || '';
    }

    return stack;
  };
}

/**
 * Used by act() to track whether you're inside an act() scope.
 */

var IsSomeRendererActing = {
  current: false
};

var ReactSharedInternals = {
  ReactCurrentDispatcher: ReactCurrentDispatcher,
  ReactCurrentBatchConfig: ReactCurrentBatchConfig,
  ReactCurrentOwner: ReactCurrentOwner,
  IsSomeRendererActing: IsSomeRendererActing,
  // Used by renderers to avoid bundling object-assign twice in UMD bundles:
  assign: _assign
};

{
  _assign(ReactSharedInternals, {
    // These should not be included in production.
    ReactDebugCurrentFrame: ReactDebugCurrentFrame,
    // Shim for React DOM 16.0.0 which still destructured (but not used) this.
    // TODO: remove in React 17.0.
    ReactComponentTreeHook: {}
  });
}

/**
 * Similar to invariant but only logs a warning if the condition is not met.
 * This can be used to log issues in development environments in critical
 * paths. Removing the logging code for production environments will keep the
 * same logic and follow the same code paths.
 */

var warning = warningWithoutStack$1;

{
  warning = function (condition, format) {
    if (condition) {
      return;
    }
    var ReactDebugCurrentFrame = ReactSharedInternals.ReactDebugCurrentFrame;
    var stack = ReactDebugCurrentFrame.getStackAddendum();
    // eslint-disable-next-line react-internal/warning-and-invariant-args

    for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }

    warningWithoutStack$1.apply(undefined, [false, format + '%s'].concat(args, [stack]));
  };
}

var warning$1 = warning;

var hasOwnProperty = Object.prototype.hasOwnProperty;

var RESERVED_PROPS = {
  key: true,
  ref: true,
  __self: true,
  __source: true
};

var specialPropKeyWarningShown = void 0;
var specialPropRefWarningShown = void 0;

function hasValidRef(config) {
  {
    if (hasOwnProperty.call(config, 'ref')) {
      var getter = Object.getOwnPropertyDescriptor(config, 'ref').get;
      if (getter && getter.isReactWarning) {
        return false;
      }
    }
  }
  return config.ref !== undefined;
}

function hasValidKey(config) {
  {
    if (hasOwnProperty.call(config, 'key')) {
      var getter = Object.getOwnPropertyDescriptor(config, 'key').get;
      if (getter && getter.isReactWarning) {
        return false;
      }
    }
  }
  return config.key !== undefined;
}

function defineKeyPropWarningGetter(props, displayName) {
  var warnAboutAccessingKey = function () {
    if (!specialPropKeyWarningShown) {
      specialPropKeyWarningShown = true;
      warningWithoutStack$1(false, '%s: `key` is not a prop. Trying to access it will result ' + 'in `undefined` being returned. If you need to access the same ' + 'value within the child component, you should pass it as a different ' + 'prop. (https://fb.me/react-special-props)', displayName);
    }
  };
  warnAboutAccessingKey.isReactWarning = true;
  Object.defineProperty(props, 'key', {
    get: warnAboutAccessingKey,
    configurable: true
  });
}

function defineRefPropWarningGetter(props, displayName) {
  var warnAboutAccessingRef = function () {
    if (!specialPropRefWarningShown) {
      specialPropRefWarningShown = true;
      warningWithoutStack$1(false, '%s: `ref` is not a prop. Trying to access it will result ' + 'in `undefined` being returned. If you need to access the same ' + 'value within the child component, you should pass it as a different ' + 'prop. (https://fb.me/react-special-props)', displayName);
    }
  };
  warnAboutAccessingRef.isReactWarning = true;
  Object.defineProperty(props, 'ref', {
    get: warnAboutAccessingRef,
    configurable: true
  });
}

/**
 * Factory method to create a new React element. This no longer adheres to
 * the class pattern, so do not use new to call it. Also, no instanceof check
 * will work. Instead test $$typeof field against Symbol.for('react.element') to check
 * if something is a React Element.
 *
 * @param {*} type
 * @param {*} props
 * @param {*} key
 * @param {string|object} ref
 * @param {*} owner
 * @param {*} self A *temporary* helper to detect places where `this` is
 * different from the `owner` when React.createElement is called, so that we
 * can warn. We want to get rid of owner and replace string `ref`s with arrow
 * functions, and as long as `this` and owner are the same, there will be no
 * change in behavior.
 * @param {*} source An annotation object (added by a transpiler or otherwise)
 * indicating filename, line number, and/or other information.
 * @internal
 */
var ReactElement = function (type, key, ref, self, source, owner, props) {
  var element = {
    // This tag allows us to uniquely identify this as a React Element
    $$typeof: REACT_ELEMENT_TYPE,

    // Built-in properties that belong on the element
    type: type,
    key: key,
    ref: ref,
    props: props,

    // Record the component responsible for creating this element.
    _owner: owner
  };

  {
    // The validation flag is currently mutative. We put it on
    // an external backing store so that we can freeze the whole object.
    // This can be replaced with a WeakMap once they are implemented in
    // commonly used development environments.
    element._store = {};

    // To make comparing ReactElements easier for testing purposes, we make
    // the validation flag non-enumerable (where possible, which should
    // include every environment we run tests in), so the test framework
    // ignores it.
    Object.defineProperty(element._store, 'validated', {
      configurable: false,
      enumerable: false,
      writable: true,
      value: false
    });
    // self and source are DEV only properties.
    Object.defineProperty(element, '_self', {
      configurable: false,
      enumerable: false,
      writable: false,
      value: self
    });
    // Two elements created in two different places should be considered
    // equal for testing purposes and therefore we hide it from enumeration.
    Object.defineProperty(element, '_source', {
      configurable: false,
      enumerable: false,
      writable: false,
      value: source
    });
    if (Object.freeze) {
      Object.freeze(element.props);
      Object.freeze(element);
    }
  }

  return element;
};

/**
 * https://github.com/reactjs/rfcs/pull/107
 * @param {*} type
 * @param {object} props
 * @param {string} key
 */


/**
 * https://github.com/reactjs/rfcs/pull/107
 * @param {*} type
 * @param {object} props
 * @param {string} key
 */
function jsxDEV(type, config, maybeKey, source, self) {
  var propName = void 0;

  // Reserved names are extracted
  var props = {};

  var key = null;
  var ref = null;

  if (hasValidRef(config)) {
    ref = config.ref;
  }

  if (hasValidKey(config)) {
    key = '' + config.key;
  }

  // Remaining properties are added to a new props object
  for (propName in config) {
    if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
      props[propName] = config[propName];
    }
  }

  // intentionally not checking if key was set above
  // this key is higher priority as it's static
  if (maybeKey !== undefined) {
    key = '' + maybeKey;
  }

  // Resolve default props
  if (type && type.defaultProps) {
    var defaultProps = type.defaultProps;
    for (propName in defaultProps) {
      if (props[propName] === undefined) {
        props[propName] = defaultProps[propName];
      }
    }
  }

  if (key || ref) {
    var displayName = typeof type === 'function' ? type.displayName || type.name || 'Unknown' : type;
    if (key) {
      defineKeyPropWarningGetter(props, displayName);
    }
    if (ref) {
      defineRefPropWarningGetter(props, displayName);
    }
  }

  return ReactElement(type, key, ref, self, source, ReactCurrentOwner.current, props);
}

/**
 * Create and return a new ReactElement of the given type.
 * See https://reactjs.org/docs/react-api.html#createelement
 */
function createElement(type, config, children) {
  var propName = void 0;

  // Reserved names are extracted
  var props = {};

  var key = null;
  var ref = null;
  var self = null;
  var source = null;

  if (config != null) {
    if (hasValidRef(config)) {
      ref = config.ref;
    }
    if (hasValidKey(config)) {
      key = '' + config.key;
    }

    self = config.__self === undefined ? null : config.__self;
    source = config.__source === undefined ? null : config.__source;
    // Remaining properties are added to a new props object
    for (propName in config) {
      if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
        props[propName] = config[propName];
      }
    }
  }

  // Children can be more than one argument, and those are transferred onto
  // the newly allocated props object.
  var childrenLength = arguments.length - 2;
  if (childrenLength === 1) {
    props.children = children;
  } else if (childrenLength > 1) {
    var childArray = Array(childrenLength);
    for (var i = 0; i < childrenLength; i++) {
      childArray[i] = arguments[i + 2];
    }
    {
      if (Object.freeze) {
        Object.freeze(childArray);
      }
    }
    props.children = childArray;
  }

  // Resolve default props
  if (type && type.defaultProps) {
    var defaultProps = type.defaultProps;
    for (propName in defaultProps) {
      if (props[propName] === undefined) {
        props[propName] = defaultProps[propName];
      }
    }
  }
  {
    if (key || ref) {
      var displayName = typeof type === 'function' ? type.displayName || type.name || 'Unknown' : type;
      if (key) {
        defineKeyPropWarningGetter(props, displayName);
      }
      if (ref) {
        defineRefPropWarningGetter(props, displayName);
      }
    }
  }
  return ReactElement(type, key, ref, self, source, ReactCurrentOwner.current, props);
}

/**
 * Return a function that produces ReactElements of a given type.
 * See https://reactjs.org/docs/react-api.html#createfactory
 */


function cloneAndReplaceKey(oldElement, newKey) {
  var newElement = ReactElement(oldElement.type, newKey, oldElement.ref, oldElement._self, oldElement._source, oldElement._owner, oldElement.props);

  return newElement;
}

/**
 * Clone and return a new ReactElement using element as the starting point.
 * See https://reactjs.org/docs/react-api.html#cloneelement
 */
function cloneElement(element, config, children) {
  (function () {
    if (!!(element === null || element === undefined)) {
      {
        throw ReactError(Error('React.cloneElement(...): The argument must be a React element, but you passed ' + element + '.'));
      }
    }
  })();

  var propName = void 0;

  // Original props are copied
  var props = _assign({}, element.props);

  // Reserved names are extracted
  var key = element.key;
  var ref = element.ref;
  // Self is preserved since the owner is preserved.
  var self = element._self;
  // Source is preserved since cloneElement is unlikely to be targeted by a
  // transpiler, and the original source is probably a better indicator of the
  // true owner.
  var source = element._source;

  // Owner will be preserved, unless ref is overridden
  var owner = element._owner;

  if (config != null) {
    if (hasValidRef(config)) {
      // Silently steal the ref from the parent.
      ref = config.ref;
      owner = ReactCurrentOwner.current;
    }
    if (hasValidKey(config)) {
      key = '' + config.key;
    }

    // Remaining properties override existing props
    var defaultProps = void 0;
    if (element.type && element.type.defaultProps) {
      defaultProps = element.type.defaultProps;
    }
    for (propName in config) {
      if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
        if (config[propName] === undefined && defaultProps !== undefined) {
          // Resolve default props
          props[propName] = defaultProps[propName];
        } else {
          props[propName] = config[propName];
        }
      }
    }
  }

  // Children can be more than one argument, and those are transferred onto
  // the newly allocated props object.
  var childrenLength = arguments.length - 2;
  if (childrenLength === 1) {
    props.children = children;
  } else if (childrenLength > 1) {
    var childArray = Array(childrenLength);
    for (var i = 0; i < childrenLength; i++) {
      childArray[i] = arguments[i + 2];
    }
    props.children = childArray;
  }

  return ReactElement(element.type, key, ref, self, source, owner, props);
}

/**
 * Verifies the object is a ReactElement.
 * See https://reactjs.org/docs/react-api.html#isvalidelement
 * @param {?object} object
 * @return {boolean} True if `object` is a ReactElement.
 * @final
 */
function isValidElement(object) {
  return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
}

var SEPARATOR = '.';
var SUBSEPARATOR = ':';

/**
 * Escape and wrap key so it is safe to use as a reactid
 *
 * @param {string} key to be escaped.
 * @return {string} the escaped key.
 */
function escape(key) {
  var escapeRegex = /[=:]/g;
  var escaperLookup = {
    '=': '=0',
    ':': '=2'
  };
  var escapedString = ('' + key).replace(escapeRegex, function (match) {
    return escaperLookup[match];
  });

  return '$' + escapedString;
}

/**
 * TODO: Test that a single child and an array with one item have the same key
 * pattern.
 */

var didWarnAboutMaps = false;

var userProvidedKeyEscapeRegex = /\/+/g;
function escapeUserProvidedKey(text) {
  return ('' + text).replace(userProvidedKeyEscapeRegex, '$&/');
}

var POOL_SIZE = 10;
var traverseContextPool = [];
function getPooledTraverseContext(mapResult, keyPrefix, mapFunction, mapContext) {
  if (traverseContextPool.length) {
    var traverseContext = traverseContextPool.pop();
    traverseContext.result = mapResult;
    traverseContext.keyPrefix = keyPrefix;
    traverseContext.func = mapFunction;
    traverseContext.context = mapContext;
    traverseContext.count = 0;
    return traverseContext;
  } else {
    return {
      result: mapResult,
      keyPrefix: keyPrefix,
      func: mapFunction,
      context: mapContext,
      count: 0
    };
  }
}

function releaseTraverseContext(traverseContext) {
  traverseContext.result = null;
  traverseContext.keyPrefix = null;
  traverseContext.func = null;
  traverseContext.context = null;
  traverseContext.count = 0;
  if (traverseContextPool.length < POOL_SIZE) {
    traverseContextPool.push(traverseContext);
  }
}

/**
 * @param {?*} children Children tree container.
 * @param {!string} nameSoFar Name of the key path so far.
 * @param {!function} callback Callback to invoke with each child found.
 * @param {?*} traverseContext Used to pass information throughout the traversal
 * process.
 * @return {!number} The number of children in this subtree.
 */
function traverseAllChildrenImpl(children, nameSoFar, callback, traverseContext) {
  var type = typeof children;

  if (type === 'undefined' || type === 'boolean') {
    // All of the above are perceived as null.
    children = null;
  }

  var invokeCallback = false;

  if (children === null) {
    invokeCallback = true;
  } else {
    switch (type) {
      case 'string':
      case 'number':
        invokeCallback = true;
        break;
      case 'object':
        switch (children.$$typeof) {
          case REACT_ELEMENT_TYPE:
          case REACT_PORTAL_TYPE:
            invokeCallback = true;
        }
    }
  }

  if (invokeCallback) {
    callback(traverseContext, children,
    // If it's the only child, treat the name as if it was wrapped in an array
    // so that it's consistent if the number of children grows.
    nameSoFar === '' ? SEPARATOR + getComponentKey(children, 0) : nameSoFar);
    return 1;
  }

  var child = void 0;
  var nextName = void 0;
  var subtreeCount = 0; // Count of children found in the current subtree.
  var nextNamePrefix = nameSoFar === '' ? SEPARATOR : nameSoFar + SUBSEPARATOR;

  if (Array.isArray(children)) {
    for (var i = 0; i < children.length; i++) {
      child = children[i];
      nextName = nextNamePrefix + getComponentKey(child, i);
      subtreeCount += traverseAllChildrenImpl(child, nextName, callback, traverseContext);
    }
  } else {
    var iteratorFn = getIteratorFn(children);
    if (typeof iteratorFn === 'function') {
      {
        // Warn about using Maps as children
        if (iteratorFn === children.entries) {
          !didWarnAboutMaps ? warning$1(false, 'Using Maps as children is unsupported and will likely yield ' + 'unexpected results. Convert it to a sequence/iterable of keyed ' + 'ReactElements instead.') : void 0;
          didWarnAboutMaps = true;
        }
      }

      var iterator = iteratorFn.call(children);
      var step = void 0;
      var ii = 0;
      while (!(step = iterator.next()).done) {
        child = step.value;
        nextName = nextNamePrefix + getComponentKey(child, ii++);
        subtreeCount += traverseAllChildrenImpl(child, nextName, callback, traverseContext);
      }
    } else if (type === 'object') {
      var addendum = '';
      {
        addendum = ' If you meant to render a collection of children, use an array ' + 'instead.' + ReactDebugCurrentFrame.getStackAddendum();
      }
      var childrenString = '' + children;
      (function () {
        {
          {
            throw ReactError(Error('Objects are not valid as a React child (found: ' + (childrenString === '[object Object]' ? 'object with keys {' + Object.keys(children).join(', ') + '}' : childrenString) + ').' + addendum));
          }
        }
      })();
    }
  }

  return subtreeCount;
}

/**
 * Traverses children that are typically specified as `props.children`, but
 * might also be specified through attributes:
 *
 * - `traverseAllChildren(this.props.children, ...)`
 * - `traverseAllChildren(this.props.leftPanelChildren, ...)`
 *
 * The `traverseContext` is an optional argument that is passed through the
 * entire traversal. It can be used to store accumulations or anything else that
 * the callback might find relevant.
 *
 * @param {?*} children Children tree object.
 * @param {!function} callback To invoke upon traversing each child.
 * @param {?*} traverseContext Context for traversal.
 * @return {!number} The number of children in this subtree.
 */
function traverseAllChildren(children, callback, traverseContext) {
  if (children == null) {
    return 0;
  }

  return traverseAllChildrenImpl(children, '', callback, traverseContext);
}

/**
 * Generate a key string that identifies a component within a set.
 *
 * @param {*} component A component that could contain a manual key.
 * @param {number} index Index that is used if a manual key is not provided.
 * @return {string}
 */
function getComponentKey(component, index) {
  // Do some typechecking here since we call this blindly. We want to ensure
  // that we don't block potential future ES APIs.
  if (typeof component === 'object' && component !== null && component.key != null) {
    // Explicit key
    return escape(component.key);
  }
  // Implicit key determined by the index in the set
  return index.toString(36);
}

function forEachSingleChild(bookKeeping, child, name) {
  var func = bookKeeping.func,
      context = bookKeeping.context;

  func.call(context, child, bookKeeping.count++);
}

/**
 * Iterates through children that are typically specified as `props.children`.
 *
 * See https://reactjs.org/docs/react-api.html#reactchildrenforeach
 *
 * The provided forEachFunc(child, index) will be called for each
 * leaf child.
 *
 * @param {?*} children Children tree container.
 * @param {function(*, int)} forEachFunc
 * @param {*} forEachContext Context for forEachContext.
 */
function forEachChildren(children, forEachFunc, forEachContext) {
  if (children == null) {
    return children;
  }
  var traverseContext = getPooledTraverseContext(null, null, forEachFunc, forEachContext);
  traverseAllChildren(children, forEachSingleChild, traverseContext);
  releaseTraverseContext(traverseContext);
}

function mapSingleChildIntoContext(bookKeeping, child, childKey) {
  var result = bookKeeping.result,
      keyPrefix = bookKeeping.keyPrefix,
      func = bookKeeping.func,
      context = bookKeeping.context;


  var mappedChild = func.call(context, child, bookKeeping.count++);
  if (Array.isArray(mappedChild)) {
    mapIntoWithKeyPrefixInternal(mappedChild, result, childKey, function (c) {
      return c;
    });
  } else if (mappedChild != null) {
    if (isValidElement(mappedChild)) {
      mappedChild = cloneAndReplaceKey(mappedChild,
      // Keep both the (mapped) and old keys if they differ, just as
      // traverseAllChildren used to do for objects as children
      keyPrefix + (mappedChild.key && (!child || child.key !== mappedChild.key) ? escapeUserProvidedKey(mappedChild.key) + '/' : '') + childKey);
    }
    result.push(mappedChild);
  }
}

function mapIntoWithKeyPrefixInternal(children, array, prefix, func, context) {
  var escapedPrefix = '';
  if (prefix != null) {
    escapedPrefix = escapeUserProvidedKey(prefix) + '/';
  }
  var traverseContext = getPooledTraverseContext(array, escapedPrefix, func, context);
  traverseAllChildren(children, mapSingleChildIntoContext, traverseContext);
  releaseTraverseContext(traverseContext);
}

/**
 * Maps children that are typically specified as `props.children`.
 *
 * See https://reactjs.org/docs/react-api.html#reactchildrenmap
 *
 * The provided mapFunction(child, key, index) will be called for each
 * leaf child.
 *
 * @param {?*} children Children tree container.
 * @param {function(*, int)} func The map function.
 * @param {*} context Context for mapFunction.
 * @return {object} Object containing the ordered map of results.
 */
function mapChildren(children, func, context) {
  if (children == null) {
    return children;
  }
  var result = [];
  mapIntoWithKeyPrefixInternal(children, result, null, func, context);
  return result;
}

/**
 * Count the number of children that are typically specified as
 * `props.children`.
 *
 * See https://reactjs.org/docs/react-api.html#reactchildrencount
 *
 * @param {?*} children Children tree container.
 * @return {number} The number of children.
 */
function countChildren(children) {
  return traverseAllChildren(children, function () {
    return null;
  }, null);
}

/**
 * Flatten a children object (typically specified as `props.children`) and
 * return an array with appropriately re-keyed children.
 *
 * See https://reactjs.org/docs/react-api.html#reactchildrentoarray
 */
function toArray(children) {
  var result = [];
  mapIntoWithKeyPrefixInternal(children, result, null, function (child) {
    return child;
  });
  return result;
}

/**
 * Returns the first child in a collection of children and verifies that there
 * is only one child in the collection.
 *
 * See https://reactjs.org/docs/react-api.html#reactchildrenonly
 *
 * The current implementation of this function assumes that a single child gets
 * passed without a wrapper, but the purpose of this helper function is to
 * abstract away the particular structure of children.
 *
 * @param {?object} children Child collection structure.
 * @return {ReactElement} The first and only `ReactElement` contained in the
 * structure.
 */
function onlyChild(children) {
  (function () {
    if (!isValidElement(children)) {
      {
        throw ReactError(Error('React.Children.only expected to receive a single React element child.'));
      }
    }
  })();
  return children;
}

function createContext(defaultValue, calculateChangedBits) {
  if (calculateChangedBits === undefined) {
    calculateChangedBits = null;
  } else {
    {
      !(calculateChangedBits === null || typeof calculateChangedBits === 'function') ? warningWithoutStack$1(false, 'createContext: Expected the optional second argument to be a ' + 'function. Instead received: %s', calculateChangedBits) : void 0;
    }
  }

  var context = {
    $$typeof: REACT_CONTEXT_TYPE,
    _calculateChangedBits: calculateChangedBits,
    // As a workaround to support multiple concurrent renderers, we categorize
    // some renderers as primary and others as secondary. We only expect
    // there to be two concurrent renderers at most: React Native (primary) and
    // Fabric (secondary); React DOM (primary) and React ART (secondary).
    // Secondary renderers store their context values on separate fields.
    _currentValue: defaultValue,
    _currentValue2: defaultValue,
    // Used to track how many concurrent renderers this context currently
    // supports within in a single renderer. Such as parallel server rendering.
    _threadCount: 0,
    // These are circular
    Provider: null,
    Consumer: null
  };

  context.Provider = {
    $$typeof: REACT_PROVIDER_TYPE,
    _context: context
  };

  var hasWarnedAboutUsingNestedContextConsumers = false;
  var hasWarnedAboutUsingConsumerProvider = false;

  {
    // A separate object, but proxies back to the original context object for
    // backwards compatibility. It has a different $$typeof, so we can properly
    // warn for the incorrect usage of Context as a Consumer.
    var Consumer = {
      $$typeof: REACT_CONTEXT_TYPE,
      _context: context,
      _calculateChangedBits: context._calculateChangedBits
    };
    // $FlowFixMe: Flow complains about not setting a value, which is intentional here
    Object.defineProperties(Consumer, {
      Provider: {
        get: function () {
          if (!hasWarnedAboutUsingConsumerProvider) {
            hasWarnedAboutUsingConsumerProvider = true;
            warning$1(false, 'Rendering <Context.Consumer.Provider> is not supported and will be removed in ' + 'a future major release. Did you mean to render <Context.Provider> instead?');
          }
          return context.Provider;
        },
        set: function (_Provider) {
          context.Provider = _Provider;
        }
      },
      _currentValue: {
        get: function () {
          return context._currentValue;
        },
        set: function (_currentValue) {
          context._currentValue = _currentValue;
        }
      },
      _currentValue2: {
        get: function () {
          return context._currentValue2;
        },
        set: function (_currentValue2) {
          context._currentValue2 = _currentValue2;
        }
      },
      _threadCount: {
        get: function () {
          return context._threadCount;
        },
        set: function (_threadCount) {
          context._threadCount = _threadCount;
        }
      },
      Consumer: {
        get: function () {
          if (!hasWarnedAboutUsingNestedContextConsumers) {
            hasWarnedAboutUsingNestedContextConsumers = true;
            warning$1(false, 'Rendering <Context.Consumer.Consumer> is not supported and will be removed in ' + 'a future major release. Did you mean to render <Context.Consumer> instead?');
          }
          return context.Consumer;
        }
      }
    });
    // $FlowFixMe: Flow complains about missing properties because it doesn't understand defineProperty
    context.Consumer = Consumer;
  }

  {
    context._currentRenderer = null;
    context._currentRenderer2 = null;
  }

  return context;
}

function lazy(ctor) {
  var lazyType = {
    $$typeof: REACT_LAZY_TYPE,
    _ctor: ctor,
    // React uses these fields to store the result.
    _status: -1,
    _result: null
  };

  {
    // In production, this would just set it on the object.
    var defaultProps = void 0;
    var propTypes = void 0;
    Object.defineProperties(lazyType, {
      defaultProps: {
        configurable: true,
        get: function () {
          return defaultProps;
        },
        set: function (newDefaultProps) {
          warning$1(false, 'React.lazy(...): It is not supported to assign `defaultProps` to ' + 'a lazy component import. Either specify them where the component ' + 'is defined, or create a wrapping component around it.');
          defaultProps = newDefaultProps;
          // Match production behavior more closely:
          Object.defineProperty(lazyType, 'defaultProps', {
            enumerable: true
          });
        }
      },
      propTypes: {
        configurable: true,
        get: function () {
          return propTypes;
        },
        set: function (newPropTypes) {
          warning$1(false, 'React.lazy(...): It is not supported to assign `propTypes` to ' + 'a lazy component import. Either specify them where the component ' + 'is defined, or create a wrapping component around it.');
          propTypes = newPropTypes;
          // Match production behavior more closely:
          Object.defineProperty(lazyType, 'propTypes', {
            enumerable: true
          });
        }
      }
    });
  }

  return lazyType;
}

function forwardRef(render) {
  {
    if (render != null && render.$$typeof === REACT_MEMO_TYPE) {
      warningWithoutStack$1(false, 'forwardRef requires a render function but received a `memo` ' + 'component. Instead of forwardRef(memo(...)), use ' + 'memo(forwardRef(...)).');
    } else if (typeof render !== 'function') {
      warningWithoutStack$1(false, 'forwardRef requires a render function but was given %s.', render === null ? 'null' : typeof render);
    } else {
      !(
      // Do not warn for 0 arguments because it could be due to usage of the 'arguments' object
      render.length === 0 || render.length === 2) ? warningWithoutStack$1(false, 'forwardRef render functions accept exactly two parameters: props and ref. %s', render.length === 1 ? 'Did you forget to use the ref parameter?' : 'Any additional parameter will be undefined.') : void 0;
    }

    if (render != null) {
      !(render.defaultProps == null && render.propTypes == null) ? warningWithoutStack$1(false, 'forwardRef render functions do not support propTypes or defaultProps. ' + 'Did you accidentally pass a React component?') : void 0;
    }
  }

  return {
    $$typeof: REACT_FORWARD_REF_TYPE,
    render: render
  };
}

function isValidElementType(type) {
  return typeof type === 'string' || typeof type === 'function' ||
  // Note: its typeof might be other than 'symbol' or 'number' if it's a polyfill.
  type === REACT_FRAGMENT_TYPE || type === REACT_CONCURRENT_MODE_TYPE || type === REACT_PROFILER_TYPE || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || typeof type === 'object' && type !== null && (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || type.$$typeof === REACT_FUNDAMENTAL_TYPE || type.$$typeof === REACT_RESPONDER_TYPE);
}

function memo(type, compare) {
  {
    if (!isValidElementType(type)) {
      warningWithoutStack$1(false, 'memo: The first argument must be a component. Instead ' + 'received: %s', type === null ? 'null' : typeof type);
    }
  }
  return {
    $$typeof: REACT_MEMO_TYPE,
    type: type,
    compare: compare === undefined ? null : compare
  };
}

function resolveDispatcher() {
  var dispatcher = ReactCurrentDispatcher.current;
  (function () {
    if (!(dispatcher !== null)) {
      {
        throw ReactError(Error('Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:\n1. You might have mismatching versions of React and the renderer (such as React DOM)\n2. You might be breaking the Rules of Hooks\n3. You might have more than one copy of React in the same app\nSee https://fb.me/react-invalid-hook-call for tips about how to debug and fix this problem.'));
      }
    }
  })();
  return dispatcher;
}

function useContext(Context, unstable_observedBits) {
  var dispatcher = resolveDispatcher();
  {
    !(unstable_observedBits === undefined) ? warning$1(false, 'useContext() second argument is reserved for future ' + 'use in React. Passing it is not supported. ' + 'You passed: %s.%s', unstable_observedBits, typeof unstable_observedBits === 'number' && Array.isArray(arguments[2]) ? '\n\nDid you call array.map(useContext)? ' + 'Calling Hooks inside a loop is not supported. ' + 'Learn more at https://fb.me/rules-of-hooks' : '') : void 0;

    // TODO: add a more generic warning for invalid values.
    if (Context._context !== undefined) {
      var realContext = Context._context;
      // Don't deduplicate because this legitimately causes bugs
      // and nobody should be using this in existing code.
      if (realContext.Consumer === Context) {
        warning$1(false, 'Calling useContext(Context.Consumer) is not supported, may cause bugs, and will be ' + 'removed in a future major release. Did you mean to call useContext(Context) instead?');
      } else if (realContext.Provider === Context) {
        warning$1(false, 'Calling useContext(Context.Provider) is not supported. ' + 'Did you mean to call useContext(Context) instead?');
      }
    }
  }
  return dispatcher.useContext(Context, unstable_observedBits);
}

function useState(initialState) {
  var dispatcher = resolveDispatcher();
  return dispatcher.useState(initialState);
}

function useReducer(reducer, initialArg, init) {
  var dispatcher = resolveDispatcher();
  return dispatcher.useReducer(reducer, initialArg, init);
}

function useRef(initialValue) {
  var dispatcher = resolveDispatcher();
  return dispatcher.useRef(initialValue);
}

function useEffect(create, inputs) {
  var dispatcher = resolveDispatcher();
  return dispatcher.useEffect(create, inputs);
}

function useLayoutEffect(create, inputs) {
  var dispatcher = resolveDispatcher();
  return dispatcher.useLayoutEffect(create, inputs);
}

function useCallback(callback, inputs) {
  var dispatcher = resolveDispatcher();
  return dispatcher.useCallback(callback, inputs);
}

function useMemo(create, inputs) {
  var dispatcher = resolveDispatcher();
  return dispatcher.useMemo(create, inputs);
}

function useImperativeHandle(ref, create, inputs) {
  var dispatcher = resolveDispatcher();
  return dispatcher.useImperativeHandle(ref, create, inputs);
}

function useDebugValue(value, formatterFn) {
  {
    var dispatcher = resolveDispatcher();
    return dispatcher.useDebugValue(value, formatterFn);
  }
}

var emptyObject$1 = {};

function useResponder(responder, listenerProps) {
  var dispatcher = resolveDispatcher();
  {
    if (responder == null || responder.$$typeof !== REACT_RESPONDER_TYPE) {
      warning$1(false, 'useResponder: invalid first argument. Expected an event responder, but instead got %s', responder);
      return;
    }
  }
  return dispatcher.useResponder(responder, listenerProps || emptyObject$1);
}

// Within the scope of the callback, mark all updates as being allowed to suspend.
function withSuspenseConfig(scope, config) {
  var previousConfig = ReactCurrentBatchConfig.suspense;
  ReactCurrentBatchConfig.suspense = config === undefined ? null : config;
  try {
    scope();
  } finally {
    ReactCurrentBatchConfig.suspense = previousConfig;
  }
}

/**
 * ReactElementValidator provides a wrapper around a element factory
 * which validates the props passed to the element. This is intended to be
 * used only in DEV and could be replaced by a static type checker for languages
 * that support it.
 */

var propTypesMisspellWarningShown = void 0;

{
  propTypesMisspellWarningShown = false;
}

function getDeclarationErrorAddendum() {
  if (ReactCurrentOwner.current) {
    var name = getComponentName(ReactCurrentOwner.current.type);
    if (name) {
      return '\n\nCheck the render method of `' + name + '`.';
    }
  }
  return '';
}

function getSourceInfoErrorAddendum(source) {
  if (source !== undefined) {
    var fileName = source.fileName.replace(/^.*[\\\/]/, '');
    var lineNumber = source.lineNumber;
    return '\n\nCheck your code at ' + fileName + ':' + lineNumber + '.';
  }
  return '';
}

function getSourceInfoErrorAddendumForProps(elementProps) {
  if (elementProps !== null && elementProps !== undefined) {
    return getSourceInfoErrorAddendum(elementProps.__source);
  }
  return '';
}

/**
 * Warn if there's no key explicitly set on dynamic arrays of children or
 * object keys are not valid. This allows us to keep track of children between
 * updates.
 */
var ownerHasKeyUseWarning = {};

function getCurrentComponentErrorInfo(parentType) {
  var info = getDeclarationErrorAddendum();

  if (!info) {
    var parentName = typeof parentType === 'string' ? parentType : parentType.displayName || parentType.name;
    if (parentName) {
      info = '\n\nCheck the top-level render call using <' + parentName + '>.';
    }
  }
  return info;
}

/**
 * Warn if the element doesn't have an explicit key assigned to it.
 * This element is in an array. The array could grow and shrink or be
 * reordered. All children that haven't already been validated are required to
 * have a "key" property assigned to it. Error statuses are cached so a warning
 * will only be shown once.
 *
 * @internal
 * @param {ReactElement} element Element that requires a key.
 * @param {*} parentType element's parent's type.
 */
function validateExplicitKey(element, parentType) {
  if (!element._store || element._store.validated || element.key != null) {
    return;
  }
  element._store.validated = true;

  var currentComponentErrorInfo = getCurrentComponentErrorInfo(parentType);
  if (ownerHasKeyUseWarning[currentComponentErrorInfo]) {
    return;
  }
  ownerHasKeyUseWarning[currentComponentErrorInfo] = true;

  // Usually the current owner is the offender, but if it accepts children as a
  // property, it may be the creator of the child that's responsible for
  // assigning it a key.
  var childOwner = '';
  if (element && element._owner && element._owner !== ReactCurrentOwner.current) {
    // Give the component that originally created this child.
    childOwner = ' It was passed a child from ' + getComponentName(element._owner.type) + '.';
  }

  setCurrentlyValidatingElement(element);
  {
    warning$1(false, 'Each child in a list should have a unique "key" prop.' + '%s%s See https://fb.me/react-warning-keys for more information.', currentComponentErrorInfo, childOwner);
  }
  setCurrentlyValidatingElement(null);
}

/**
 * Ensure that every element either is passed in a static location, in an
 * array with an explicit keys property defined, or in an object literal
 * with valid key property.
 *
 * @internal
 * @param {ReactNode} node Statically passed child of any type.
 * @param {*} parentType node's parent's type.
 */
function validateChildKeys(node, parentType) {
  if (typeof node !== 'object') {
    return;
  }
  if (Array.isArray(node)) {
    for (var i = 0; i < node.length; i++) {
      var child = node[i];
      if (isValidElement(child)) {
        validateExplicitKey(child, parentType);
      }
    }
  } else if (isValidElement(node)) {
    // This element was passed in a valid location.
    if (node._store) {
      node._store.validated = true;
    }
  } else if (node) {
    var iteratorFn = getIteratorFn(node);
    if (typeof iteratorFn === 'function') {
      // Entry iterators used to provide implicit keys,
      // but now we print a separate warning for them later.
      if (iteratorFn !== node.entries) {
        var iterator = iteratorFn.call(node);
        var step = void 0;
        while (!(step = iterator.next()).done) {
          if (isValidElement(step.value)) {
            validateExplicitKey(step.value, parentType);
          }
        }
      }
    }
  }
}

/**
 * Given an element, validate that its props follow the propTypes definition,
 * provided by the type.
 *
 * @param {ReactElement} element
 */
function validatePropTypes(element) {
  var type = element.type;
  if (type === null || type === undefined || typeof type === 'string') {
    return;
  }
  var name = getComponentName(type);
  var propTypes = void 0;
  if (typeof type === 'function') {
    propTypes = type.propTypes;
  } else if (typeof type === 'object' && (type.$$typeof === REACT_FORWARD_REF_TYPE ||
  // Note: Memo only checks outer props here.
  // Inner props are checked in the reconciler.
  type.$$typeof === REACT_MEMO_TYPE)) {
    propTypes = type.propTypes;
  } else {
    return;
  }
  if (propTypes) {
    setCurrentlyValidatingElement(element);
    checkPropTypes(propTypes, element.props, 'prop', name, ReactDebugCurrentFrame.getStackAddendum);
    setCurrentlyValidatingElement(null);
  } else if (type.PropTypes !== undefined && !propTypesMisspellWarningShown) {
    propTypesMisspellWarningShown = true;
    warningWithoutStack$1(false, 'Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?', name || 'Unknown');
  }
  if (typeof type.getDefaultProps === 'function') {
    !type.getDefaultProps.isReactClassApproved ? warningWithoutStack$1(false, 'getDefaultProps is only used on classic React.createClass ' + 'definitions. Use a static property named `defaultProps` instead.') : void 0;
  }
}

/**
 * Given a fragment, validate that it can only be provided with fragment props
 * @param {ReactElement} fragment
 */
function validateFragmentProps(fragment) {
  setCurrentlyValidatingElement(fragment);

  var keys = Object.keys(fragment.props);
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (key !== 'children' && key !== 'key') {
      warning$1(false, 'Invalid prop `%s` supplied to `React.Fragment`. ' + 'React.Fragment can only have `key` and `children` props.', key);
      break;
    }
  }

  if (fragment.ref !== null) {
    warning$1(false, 'Invalid attribute `ref` supplied to `React.Fragment`.');
  }

  setCurrentlyValidatingElement(null);
}

function jsxWithValidation(type, props, key, isStaticChildren, source, self) {
  var validType = isValidElementType(type);

  // We warn in this case but don't throw. We expect the element creation to
  // succeed and there will likely be errors in render.
  if (!validType) {
    var info = '';
    if (type === undefined || typeof type === 'object' && type !== null && Object.keys(type).length === 0) {
      info += ' You likely forgot to export your component from the file ' + "it's defined in, or you might have mixed up default and named imports.";
    }

    var sourceInfo = getSourceInfoErrorAddendum(source);
    if (sourceInfo) {
      info += sourceInfo;
    } else {
      info += getDeclarationErrorAddendum();
    }

    var typeString = void 0;
    if (type === null) {
      typeString = 'null';
    } else if (Array.isArray(type)) {
      typeString = 'array';
    } else if (type !== undefined && type.$$typeof === REACT_ELEMENT_TYPE) {
      typeString = '<' + (getComponentName(type.type) || 'Unknown') + ' />';
      info = ' Did you accidentally export a JSX literal instead of a component?';
    } else {
      typeString = typeof type;
    }

    warning$1(false, 'React.jsx: type is invalid -- expected a string (for ' + 'built-in components) or a class/function (for composite ' + 'components) but got: %s.%s', typeString, info);
  }

  var element = jsxDEV(type, props, key, source, self);

  // The result can be nullish if a mock or a custom function is used.
  // TODO: Drop this when these are no longer allowed as the type argument.
  if (element == null) {
    return element;
  }

  // Skip key warning if the type isn't valid since our key validation logic
  // doesn't expect a non-string/function type and can throw confusing errors.
  // We don't want exception behavior to differ between dev and prod.
  // (Rendering will throw with a helpful message and as soon as the type is
  // fixed, the key warnings will appear.)
  if (validType) {
    var children = props.children;
    if (children !== undefined) {
      if (isStaticChildren) {
        for (var i = 0; i < children.length; i++) {
          validateChildKeys(children[i], type);
        }
      } else {
        validateChildKeys(children, type);
      }
    }
  }

  if (props.key !== undefined) {
    warning$1(false, 'React.jsx: Spreading a key to JSX is a deprecated pattern. ' + 'Explicitly pass a key after spreading props in your JSX call. ' + 'E.g. <ComponentName {...props} key={key} />');
  }

  if (type === REACT_FRAGMENT_TYPE) {
    validateFragmentProps(element);
  } else {
    validatePropTypes(element);
  }

  return element;
}

// These two functions exist to still get child warnings in dev
// even with the prod transform. This means that jsxDEV is purely
// opt-in behavior for better messages but that we won't stop
// giving you warnings if you use production apis.
function jsxWithValidationStatic(type, props, key) {
  return jsxWithValidation(type, props, key, true);
}

function jsxWithValidationDynamic(type, props, key) {
  return jsxWithValidation(type, props, key, false);
}

function createElementWithValidation(type, props, children) {
  var validType = isValidElementType(type);

  // We warn in this case but don't throw. We expect the element creation to
  // succeed and there will likely be errors in render.
  if (!validType) {
    var info = '';
    if (type === undefined || typeof type === 'object' && type !== null && Object.keys(type).length === 0) {
      info += ' You likely forgot to export your component from the file ' + "it's defined in, or you might have mixed up default and named imports.";
    }

    var sourceInfo = getSourceInfoErrorAddendumForProps(props);
    if (sourceInfo) {
      info += sourceInfo;
    } else {
      info += getDeclarationErrorAddendum();
    }

    var typeString = void 0;
    if (type === null) {
      typeString = 'null';
    } else if (Array.isArray(type)) {
      typeString = 'array';
    } else if (type !== undefined && type.$$typeof === REACT_ELEMENT_TYPE) {
      typeString = '<' + (getComponentName(type.type) || 'Unknown') + ' />';
      info = ' Did you accidentally export a JSX literal instead of a component?';
    } else {
      typeString = typeof type;
    }

    warning$1(false, 'React.createElement: type is invalid -- expected a string (for ' + 'built-in components) or a class/function (for composite ' + 'components) but got: %s.%s', typeString, info);
  }

  var element = createElement.apply(this, arguments);

  // The result can be nullish if a mock or a custom function is used.
  // TODO: Drop this when these are no longer allowed as the type argument.
  if (element == null) {
    return element;
  }

  // Skip key warning if the type isn't valid since our key validation logic
  // doesn't expect a non-string/function type and can throw confusing errors.
  // We don't want exception behavior to differ between dev and prod.
  // (Rendering will throw with a helpful message and as soon as the type is
  // fixed, the key warnings will appear.)
  if (validType) {
    for (var i = 2; i < arguments.length; i++) {
      validateChildKeys(arguments[i], type);
    }
  }

  if (type === REACT_FRAGMENT_TYPE) {
    validateFragmentProps(element);
  } else {
    validatePropTypes(element);
  }

  return element;
}

function createFactoryWithValidation(type) {
  var validatedFactory = createElementWithValidation.bind(null, type);
  validatedFactory.type = type;
  // Legacy hook: remove it
  {
    Object.defineProperty(validatedFactory, 'type', {
      enumerable: false,
      get: function () {
        lowPriorityWarning$1(false, 'Factory.type is deprecated. Access the class directly ' + 'before passing it to createFactory.');
        Object.defineProperty(this, 'type', {
          value: type
        });
        return type;
      }
    });
  }

  return validatedFactory;
}

function cloneElementWithValidation(element, props, children) {
  var newElement = cloneElement.apply(this, arguments);
  for (var i = 2; i < arguments.length; i++) {
    validateChildKeys(arguments[i], newElement.type);
  }
  validatePropTypes(newElement);
  return newElement;
}

var hasBadMapPolyfill = void 0;

{
  hasBadMapPolyfill = false;
  try {
    var frozenObject = Object.freeze({});
    var testMap = new Map([[frozenObject, null]]);
    var testSet = new Set([frozenObject]);
    // This is necessary for Rollup to not consider these unused.
    // https://github.com/rollup/rollup/issues/1771
    // TODO: we can remove these if Rollup fixes the bug.
    testMap.set(0, 0);
    testSet.add(0);
  } catch (e) {
    // TODO: Consider warning about bad polyfills
    hasBadMapPolyfill = true;
  }
}

function createFundamentalComponent(impl) {
  // We use responder as a Map key later on. When we have a bad
  // polyfill, then we can't use it as a key as the polyfill tries
  // to add a property to the object.
  if ( true && !hasBadMapPolyfill) {
    Object.freeze(impl);
  }
  var fundamantalComponent = {
    $$typeof: REACT_FUNDAMENTAL_TYPE,
    impl: impl
  };
  {
    Object.freeze(fundamantalComponent);
  }
  return fundamantalComponent;
}

function createEventResponder(displayName, responderConfig) {
  var getInitialState = responderConfig.getInitialState,
      onEvent = responderConfig.onEvent,
      onMount = responderConfig.onMount,
      onUnmount = responderConfig.onUnmount,
      onOwnershipChange = responderConfig.onOwnershipChange,
      onRootEvent = responderConfig.onRootEvent,
      rootEventTypes = responderConfig.rootEventTypes,
      targetEventTypes = responderConfig.targetEventTypes;

  var eventResponder = {
    $$typeof: REACT_RESPONDER_TYPE,
    displayName: displayName,
    getInitialState: getInitialState || null,
    onEvent: onEvent || null,
    onMount: onMount || null,
    onOwnershipChange: onOwnershipChange || null,
    onRootEvent: onRootEvent || null,
    onUnmount: onUnmount || null,
    rootEventTypes: rootEventTypes || null,
    targetEventTypes: targetEventTypes || null
  };
  // We use responder as a Map key later on. When we have a bad
  // polyfill, then we can't use it as a key as the polyfill tries
  // to add a property to the object.
  if ( true && !hasBadMapPolyfill) {
    Object.freeze(eventResponder);
  }
  return eventResponder;
}

// Helps identify side effects in begin-phase lifecycle hooks and setState reducers:


// In some cases, StrictMode should also double-render lifecycles.
// This can be confusing for tests though,
// And it can be bad for performance in production.
// This feature flag can be used to control the behavior:


// To preserve the "Pause on caught exceptions" behavior of the debugger, we
// replay the begin phase of a failed component inside invokeGuardedCallback.


// Warn about deprecated, async-unsafe lifecycles; relates to RFC #6:


// Gather advanced timing metrics for Profiler subtrees.


// Trace which interactions trigger each commit.


// Only used in www builds.
 // TODO: true? Here it might just be false.

// Only used in www builds.


// Only used in www builds.


// Disable javascript: URL strings in href for XSS protection.


// React Fire: prevent the value and checked attributes from syncing
// with their related DOM properties


// These APIs will no longer be "unstable" in the upcoming 16.7 release,
// Control this behavior with a flag to support 16.6 minor releases in the meanwhile.




// See https://github.com/react-native-community/discussions-and-proposals/issues/72 for more information
// This is a flag so we can fix warnings in RN core before turning it on


// Experimental React Flare event system and event components support.
var enableFlareAPI = false;

// Experimental Host Component support.
var enableFundamentalAPI = false;

// New API for JSX transforms to target - https://github.com/reactjs/rfcs/pull/107
var enableJSXTransformAPI = false;

// We will enforce mocking scheduler with scheduler/unstable_mock at some point. (v17?)
// Till then, we warn about the missing mock, but still fallback to a sync mode compatible version

// Temporary flag to revert the fix in #15650


// For tests, we flush suspense fallbacks in an act scope;
// *except* in some of our own tests, where we test incremental loading states.


// Changes priority of some events like mousemove to user-blocking priority,
// but without making them discrete. The flag exists in case it causes
// starvation problems.


// Add a callback property to suspense to notify which promises are currently
// in the update queue. This allows reporting and tracing of what is causing
// the user to see a loading state.


// Part of the simplification of React.createElement so we can eventually move
// from React.createElement to React.jsx
// https://github.com/reactjs/rfcs/blob/createlement-rfc/text/0000-create-element-changes.md

var React = {
  Children: {
    map: mapChildren,
    forEach: forEachChildren,
    count: countChildren,
    toArray: toArray,
    only: onlyChild
  },

  createRef: createRef,
  Component: Component,
  PureComponent: PureComponent,

  createContext: createContext,
  forwardRef: forwardRef,
  lazy: lazy,
  memo: memo,

  useCallback: useCallback,
  useContext: useContext,
  useEffect: useEffect,
  useImperativeHandle: useImperativeHandle,
  useDebugValue: useDebugValue,
  useLayoutEffect: useLayoutEffect,
  useMemo: useMemo,
  useReducer: useReducer,
  useRef: useRef,
  useState: useState,

  Fragment: REACT_FRAGMENT_TYPE,
  Profiler: REACT_PROFILER_TYPE,
  StrictMode: REACT_STRICT_MODE_TYPE,
  Suspense: REACT_SUSPENSE_TYPE,
  unstable_SuspenseList: REACT_SUSPENSE_LIST_TYPE,

  createElement: createElementWithValidation,
  cloneElement: cloneElementWithValidation,
  createFactory: createFactoryWithValidation,
  isValidElement: isValidElement,

  version: ReactVersion,

  unstable_withSuspenseConfig: withSuspenseConfig,

  __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: ReactSharedInternals
};

if (enableFlareAPI) {
  React.unstable_useResponder = useResponder;
  React.unstable_createResponder = createEventResponder;
}

if (enableFundamentalAPI) {
  React.unstable_createFundamental = createFundamentalComponent;
}

// Note: some APIs are added with feature flags.
// Make sure that stable builds for open source
// don't modify the React object to avoid deopts.
// Also let's not expose their names in stable builds.

if (enableJSXTransformAPI) {
  {
    React.jsxDEV = jsxWithValidation;
    React.jsx = jsxWithValidationDynamic;
    React.jsxs = jsxWithValidationStatic;
  }
}



var React$2 = Object.freeze({
	default: React
});

var React$3 = ( React$2 && React ) || React$2;

// TODO: decide on the top-level export form.
// This is hacky but makes it work with both Rollup and Jest.
var react = React$3.default || React$3;

module.exports = react;
  })();
}


/***/ }),

/***/ "../../node_modules/react/index.js":
/*!**********************************************************************!*\
  !*** /Users/krasimir/Work/Krasimir/riew/node_modules/react/index.js ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


if (false) {} else {
  module.exports = __webpack_require__(/*! ./cjs/react.development.js */ "../../node_modules/react/cjs/react.development.js");
}


/***/ }),

/***/ "../../src/csp/buf.js":
/*!*********************************************************!*\
  !*** /Users/krasimir/Work/Krasimir/riew/src/csp/buf.js ***!
  \*********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "../../src/csp/utils.js");
/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../index */ "../../src/index.js");
/* eslint-disable no-param-reassign */


const DEFAULT_OPTIONS = {
  dropping: false,
  sliding: false
};

const NOOP = (v, cb) => cb(v);

function CSPBuffer(size = 0, {
  dropping,
  sliding
} = DEFAULT_OPTIONS) {
  const api = {
    value: [],
    puts: [],
    takes: [],
    hooks: {
      beforePut: NOOP,
      afterPut: NOOP,
      beforeTake: NOOP,
      afterTake: NOOP
    },
    parent: null,
    dropping,
    sliding
  };

  api.beforePut = hook => api.hooks.beforePut = hook;

  api.afterPut = hook => api.hooks.afterPut = hook;

  api.beforeTake = hook => api.hooks.beforeTake = hook;

  api.afterTake = hook => api.hooks.afterTake = hook;

  api.isEmpty = () => api.value.length === 0;

  api.reset = () => {
    api.value = [];
    api.puts = [];
    api.takes = [];
    api.hooks = {
      beforePut: NOOP,
      afterPut: NOOP,
      beforeTake: NOOP,
      afterTake: NOOP
    };
  };

  api.setValue = v => {
    api.value = v;
  };

  api.getValue = () => api.value;

  api.decomposeTakers = () => api.takes.reduce((res, takeObj) => {
    res[takeObj.options.read ? 'readers' : 'takers'].push(takeObj);
    return res;
  }, {
    readers: [],
    takers: []
  });

  api.consumeTake = (takeObj, value) => {
    if (!takeObj.options.listen) {
      const idx = api.takes.findIndex(t => t === takeObj);
      if (idx >= 0) api.takes.splice(idx, 1);
    }

    takeObj.callback(value);
  };

  api.deleteTaker = cb => {
    const idx = api.takes.findIndex(({
      callback
    }) => callback === cb);

    if (idx >= 0) {
      api.takes.splice(idx, 1);
    }
  };

  api.deleteListeners = () => {
    api.takes = api.takes.filter(({
      options
    }) => !options.listen);
  };

  api.setValue = v => api.value = v;

  const put = (item, callback) => {
    const {
      readers,
      takers
    } = api.decomposeTakers(); // console.log(
    //   `put=${item}`,
    //   `readers=${readers.length}`,
    //   `takers=${takers.length}`,
    //   `value=${api.value.length} size=${size}`
    // );
    // resolving readers

    readers.forEach(reader => api.consumeTake(reader, item)); // resolving takers

    if (takers.length > 0) {
      api.consumeTake(takers[0], item);
      callback(true);
    } else {
      if (api.value.length < size) {
        api.value.push(item);
        callback(true);
        return;
      }

      if (dropping) {
        callback(false);
        return;
      }

      if (sliding) {
        api.value.shift();
        api.value.push(item);
        callback(true);
        return;
      }

      api.puts.push({
        callback: v => {
          api.value.push(item);
          callback(v || true);
        },
        item
      });
    }
  };

  const take = (callback, options) => {
    // console.log('take', `puts=${api.puts.length}`, `value=${api.value.length}`);
    const subscribe = () => {
      api.takes.push({
        callback,
        options
      });
      return () => api.deleteTaker(callback);
    };

    options = Object(_utils__WEBPACK_IMPORTED_MODULE_0__["normalizeOptions"])(options);

    if (options.listen) {
      options.read = true;

      if (options.initialCall) {
        callback(api.value[0]);
      }

      return subscribe();
    }

    if (options.read) {
      callback(api.value[0]);
      return;
    }

    if (api.value.length === 0) {
      if (api.puts.length > 0) {
        api.puts.shift().callback();
        callback(api.value.shift());
      } else {
        return subscribe();
      }
    } else {
      const v = api.value.shift();
      callback(v);

      if (api.value.length < size && api.puts.length > 0) {
        api.puts.shift().callback();
      }
    }

    return () => {};
  };

  api.put = (item, callback) => {
    _index__WEBPACK_IMPORTED_MODULE_1__["logger"].log(api.parent, 'CHANNEL_PUT_INITIATED', item);
    api.hooks.beforePut(item, beforePutItem => {
      put(beforePutItem, putOpRes => api.hooks.afterPut(putOpRes, afterPutItem => {
        _index__WEBPACK_IMPORTED_MODULE_1__["logger"].log(api.parent, 'CHANNEL_PUT_RESOLVED', afterPutItem);
        callback(afterPutItem);
      }));
    });
  };

  api.take = (callback, options) => {
    let unsubscribe = () => {};

    _index__WEBPACK_IMPORTED_MODULE_1__["logger"].log(api.parent, 'CHANNEL_TAKE_INITIATED');
    api.hooks.beforeTake(undefined, () => unsubscribe = take(takeOpRes => api.hooks.afterTake(takeOpRes, afterTakeItem => {
      _index__WEBPACK_IMPORTED_MODULE_1__["logger"].log(api.parent, 'CHANNEL_TAKE_RESOLVED', afterTakeItem);
      callback(afterTakeItem);
    }), options));
    return () => unsubscribe();
  };

  return api;
}

const buffer = {
  fixed: (size = 0) => CSPBuffer(size, {
    dropping: false,
    sliding: false
  }),
  dropping: (size = 1) => {
    if (size < 1) {
      throw new Error('The dropping buffer should have at least size of one.');
    }

    return CSPBuffer(size, {
      dropping: true,
      sliding: false
    });
  },
  sliding: (size = 1) => {
    if (size < 1) {
      throw new Error('The sliding buffer should have at least size of one.');
    }

    return CSPBuffer(size, {
      dropping: false,
      sliding: true
    });
  }
};
/* harmony default export */ __webpack_exports__["default"] = (buffer);

/***/ }),

/***/ "../../src/csp/channel.js":
/*!*************************************************************!*\
  !*** /Users/krasimir/Work/Krasimir/riew/src/csp/channel.js ***!
  \*************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return chan; });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils */ "../../src/utils.js");
/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../index */ "../../src/index.js");
/* harmony import */ var _buf__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./buf */ "../../src/csp/buf.js");



function chan(id, buff, parent = null) {
  let state = _index__WEBPACK_IMPORTED_MODULE_1__["OPEN"];
  id = id ? Object(_utils__WEBPACK_IMPORTED_MODULE_0__["getId"])(id) : Object(_utils__WEBPACK_IMPORTED_MODULE_0__["getId"])('ch');
  buff = buff || _buf__WEBPACK_IMPORTED_MODULE_2__["default"].fixed();

  if (_index__WEBPACK_IMPORTED_MODULE_1__["CHANNELS"].exists(id)) {
    throw new Error(`Channel with id "${id}" already exists.`);
  }

  const channel = function (str, name) {
    if (str.length > 1) {
      Object(_utils__WEBPACK_IMPORTED_MODULE_0__["setProp"])(channel, 'name', str[0] + name + str[1]);
    } else {
      Object(_utils__WEBPACK_IMPORTED_MODULE_0__["setProp"])(channel, 'name', str[0]);
    }

    _index__WEBPACK_IMPORTED_MODULE_1__["logger"].setWhoName(channel.id, channel.name);
    return channel;
  };

  channel.id = id;
  channel['@channel'] = true;
  channel.parent = parent;
  const api = _index__WEBPACK_IMPORTED_MODULE_1__["CHANNELS"].set(id, channel);
  buff.parent = api;

  api.isActive = () => api.state() === _index__WEBPACK_IMPORTED_MODULE_1__["OPEN"];

  api.buff = buff;

  api.state = s => {
    if (typeof s !== 'undefined') state = s;
    return state;
  };

  api.value = () => buff.getValue();

  api.beforePut = buff.beforePut;
  api.afterPut = buff.afterPut;
  api.beforeTake = buff.beforeTake;
  api.afterTake = buff.afterTake;

  api.exportAs = key => Object(_index__WEBPACK_IMPORTED_MODULE_1__["register"])(key, api);

  _index__WEBPACK_IMPORTED_MODULE_1__["grid"].add(api);
  _index__WEBPACK_IMPORTED_MODULE_1__["logger"].log(api, 'CHANNEL_CREATED', api.value());
  return api;
}

/***/ }),

/***/ "../../src/csp/ops.js":
/*!*********************************************************!*\
  !*** /Users/krasimir/Work/Krasimir/riew/src/csp/ops.js ***!
  \*********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../index */ "../../src/index.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils */ "../../src/utils.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils */ "../../src/csp/utils.js");
/* eslint-disable no-use-before-define, no-param-reassign */




const noop = () => {};

const ops = {}; // **************************************************** put

ops.sput = function sput(channels, item = null, callback = noop) {
  channels = Object(_utils__WEBPACK_IMPORTED_MODULE_2__["normalizeChannels"])(channels);
  const result = channels.map(() => _index__WEBPACK_IMPORTED_MODULE_0__["NOTHING"]);

  const setResult = (idx, value) => {
    result[idx] = value;

    if (!result.includes(_index__WEBPACK_IMPORTED_MODULE_0__["NOTHING"])) {
      callback(result.length === 1 ? result[0] : result);
    }
  };

  channels.forEach((channel, idx) => {
    const chState = channel.state();

    if (chState !== _index__WEBPACK_IMPORTED_MODULE_0__["OPEN"]) {
      setResult(idx, chState);
    } else {
      channel.buff.put(item, putResult => setResult(idx, putResult));
    }
  });
};

ops.put = function put(channels, item) {
  return {
    channels,
    op: _index__WEBPACK_IMPORTED_MODULE_0__["PUT"],
    item
  };
}; // **************************************************** take


ops.stake = function stake(channels, callback, options) {
  channels = Object(_utils__WEBPACK_IMPORTED_MODULE_2__["normalizeChannels"])(channels);
  options = Object(_utils__WEBPACK_IMPORTED_MODULE_2__["normalizeOptions"])(options);
  callback = Object(_utils__WEBPACK_IMPORTED_MODULE_2__["normalizeTo"])(callback);
  let unsubscribers;

  if (options.strategy === _index__WEBPACK_IMPORTED_MODULE_0__["ALL_REQUIRED"]) {
    const result = channels.map(() => _index__WEBPACK_IMPORTED_MODULE_0__["NOTHING"]);

    const setResult = (idx, value) => {
      result[idx] = value;

      if (!result.includes(_index__WEBPACK_IMPORTED_MODULE_0__["NOTHING"])) {
        callback(result.length === 1 ? result[0] : [...result]);
      }
    };

    unsubscribers = channels.map((channel, idx) => {
      const chState = channel.state();

      if (chState === _index__WEBPACK_IMPORTED_MODULE_0__["ENDED"]) {
        setResult(idx, chState);
      } else if (chState === _index__WEBPACK_IMPORTED_MODULE_0__["CLOSED"] && channel.buff.isEmpty()) {
        channel.state(_index__WEBPACK_IMPORTED_MODULE_0__["ENDED"]);
        setResult(idx, _index__WEBPACK_IMPORTED_MODULE_0__["ENDED"]);
      } else {
        return channel.buff.take(takeResult => setResult(idx, takeResult), options);
      }
    });
  } else if (options.strategy === _index__WEBPACK_IMPORTED_MODULE_0__["ONE_OF"]) {
    const done = (...takeResult) => {
      // This function is here to clean up the unresolved buffer readers.
      // In the ONE_OF strategy there are pending readers that should be
      // killed since one of the others in the list is called. And this
      // should happen only if we are not listening.
      if (!options.listen) {
        unsubscribers.filter(f => f).forEach(f => f());
      }

      callback(...takeResult);
    };

    unsubscribers = channels.map((channel, idx) => {
      const chState = channel.state();

      if (chState === _index__WEBPACK_IMPORTED_MODULE_0__["ENDED"]) {
        done(chState, idx);
      } else if (chState === _index__WEBPACK_IMPORTED_MODULE_0__["CLOSED"] && channel.buff.isEmpty()) {
        channel.state(_index__WEBPACK_IMPORTED_MODULE_0__["ENDED"]);
        done(_index__WEBPACK_IMPORTED_MODULE_0__["ENDED"], idx);
      } else {
        return channel.buff.take(takeResult => done(takeResult, idx), options);
      }
    });
  } else {
    throw new Error(`Unrecognized strategy "${options.strategy}"`);
  }

  return function unsubscribe() {
    unsubscribers.filter(f => f).forEach(f => f());
  };
};

ops.take = function take(channels, options) {
  return {
    channels,
    op: _index__WEBPACK_IMPORTED_MODULE_0__["TAKE"],
    options
  };
}; // **************************************************** read


ops.read = function read(channels, options) {
  return {
    channels,
    op: _index__WEBPACK_IMPORTED_MODULE_0__["READ"],
    options: { ...options,
      read: true
    }
  };
};

ops.sread = function sread(channels, to, options) {
  return ops.stake(channels, to, { ...options,
    read: true
  });
};

ops.unsubAll = function unsubAll(channel) {
  channel.buff.deleteListeners();
}; // **************************************************** listen


ops.listen = function listen(channels, to, options) {
  return ops.stake(channels, to, { ...options,
    listen: true
  });
}; // **************************************************** close, reset, call, fork, merge, timeout, isChannel


ops.close = function close(channels) {
  channels = Object(_utils__WEBPACK_IMPORTED_MODULE_2__["normalizeChannels"])(channels);
  channels.forEach(ch => {
    const newState = ch.buff.isEmpty() ? _index__WEBPACK_IMPORTED_MODULE_0__["ENDED"] : _index__WEBPACK_IMPORTED_MODULE_0__["CLOSED"];
    ch.state(newState);
    ch.buff.puts.forEach(p => p.callback(newState));
    ch.buff.deleteListeners();
    ch.buff.takes.forEach(t => t.callback(newState));
    _index__WEBPACK_IMPORTED_MODULE_0__["grid"].remove(ch);
    _index__WEBPACK_IMPORTED_MODULE_0__["CHANNELS"].del(ch.id);
    _index__WEBPACK_IMPORTED_MODULE_0__["logger"].log(ch, 'CHANNEL_CLOSED');
  });
  return {
    op: _index__WEBPACK_IMPORTED_MODULE_0__["NOOP"]
  };
};

ops.sclose = function sclose(id) {
  return ops.close(id);
};

ops.channelReset = function channelReset(channels) {
  channels = Object(_utils__WEBPACK_IMPORTED_MODULE_2__["normalizeChannels"])(channels);
  channels.forEach(ch => {
    ch.state(_index__WEBPACK_IMPORTED_MODULE_0__["OPEN"]);
    ch.buff.reset();
    _index__WEBPACK_IMPORTED_MODULE_0__["logger"].log(ch, 'CHANNEL_RESET');
  });
  return {
    op: _index__WEBPACK_IMPORTED_MODULE_0__["NOOP"]
  };
};

ops.schannelReset = function schannelReset(id) {
  ops.channelReset(id);
};

ops.call = function call(routine, ...args) {
  return {
    op: _index__WEBPACK_IMPORTED_MODULE_0__["CALL_ROUTINE"],
    routine,
    args
  };
};

ops.fork = function fork(routine, ...args) {
  return {
    op: _index__WEBPACK_IMPORTED_MODULE_0__["FORK_ROUTINE"],
    routine,
    args
  };
};

ops.merge = function merge(...channels) {
  const newCh = Object(_index__WEBPACK_IMPORTED_MODULE_0__["chan"])();
  channels.forEach(ch => {
    (function taker() {
      ops.stake(ch, v => {
        if (v !== _index__WEBPACK_IMPORTED_MODULE_0__["CLOSED"] && v !== _index__WEBPACK_IMPORTED_MODULE_0__["ENDED"] && newCh.state() === _index__WEBPACK_IMPORTED_MODULE_0__["OPEN"]) {
          ops.sput(newCh, v, taker);
        }
      });
    })();
  });
  return newCh;
};

ops.timeout = function timeout(interval) {
  const ch = Object(_index__WEBPACK_IMPORTED_MODULE_0__["chan"])();
  setTimeout(() => ops.close(ch), interval);
  return ch;
};

ops.isChannel = ch => ch && ch['@channel'] === true;

ops.isRiew = r => r && r['@riew'] === true;

ops.isState = s => s && s['@state'] === true;

ops.isRoutine = r => r && r['@routine'] === true;

ops.verifyChannel = function verifyChannel(ch, throwError = true) {
  if (ops.isChannel(ch)) return ch;

  if (throwError) {
    throw new Error(`${ch}${typeof ch !== 'undefined' ? ` (${typeof ch})` : ''} is not a channel.${typeof ch === 'string' ? ` Did you forget to define it?\nExample: chan("${ch}")` : ''}`);
  }

  return null;
}; // **************************************************** go/routine


ops.go = function go(func, done = () => {}, args = [], parent = null) {
  const RUNNING = 'RUNNING';
  const STOPPED = 'STOPPED';
  let state = RUNNING;
  const name = Object(_utils__WEBPACK_IMPORTED_MODULE_1__["getFuncName"])(func);
  const api = {
    id: Object(_utils__WEBPACK_IMPORTED_MODULE_1__["getId"])(`routine_${name}`),
    '@routine': true,
    parent,
    name,
    children: [],

    stop() {
      state = STOPPED;
      this.children.forEach(r => r.stop());
      _index__WEBPACK_IMPORTED_MODULE_0__["grid"].remove(api);
      _index__WEBPACK_IMPORTED_MODULE_0__["logger"].log(api, 'ROUTINE_STOPPED');
    },

    rerun() {
      gen = func(...args);
      next();
      _index__WEBPACK_IMPORTED_MODULE_0__["logger"].log(this, 'ROUTINE_RERUN');
    }

  };

  const addSubRoutine = r => api.children.push(r);

  _index__WEBPACK_IMPORTED_MODULE_0__["logger"].log(api, 'ROUTINE_STARTED');
  let gen = func(...args);

  function processGeneratorStep(i) {
    switch (i.value.op) {
      case _index__WEBPACK_IMPORTED_MODULE_0__["PUT"]:
        ops.sput(i.value.channels, i.value.item, next);
        break;

      case _index__WEBPACK_IMPORTED_MODULE_0__["TAKE"]:
        ops.stake(i.value.channels, (...nextArgs) => {
          next(nextArgs.length === 1 ? nextArgs[0] : nextArgs);
        }, i.value.options);
        break;

      case _index__WEBPACK_IMPORTED_MODULE_0__["NOOP"]:
        next();
        break;

      case _index__WEBPACK_IMPORTED_MODULE_0__["SLEEP"]:
        setTimeout(next, i.value.ms);
        break;

      case _index__WEBPACK_IMPORTED_MODULE_0__["STOP"]:
        api.stop();
        break;

      case _index__WEBPACK_IMPORTED_MODULE_0__["READ"]:
        ops.sread(i.value.channels, next, i.value.options);
        break;

      case _index__WEBPACK_IMPORTED_MODULE_0__["CALL_ROUTINE"]:
        addSubRoutine(ops.go(i.value.routine, next, i.value.args, api.id));
        break;

      case _index__WEBPACK_IMPORTED_MODULE_0__["FORK_ROUTINE"]:
        addSubRoutine(ops.go(i.value.routine, () => {}, i.value.args, api.id));
        next();
        break;

      default:
        throw new Error(`Unrecognized operation ${i.value.op} for a routine.`);
    }
  }

  function next(value) {
    if (state === STOPPED) return;
    const step = gen.next(value);

    if (step.done === true) {
      if (done) done(step.value);

      if (step.value && step.value['@go'] === true) {
        api.rerun();
      } else {
        _index__WEBPACK_IMPORTED_MODULE_0__["grid"].remove(api);
        _index__WEBPACK_IMPORTED_MODULE_0__["logger"].log(api, 'ROUTINE_END');
      }
    } else if (Object(_utils__WEBPACK_IMPORTED_MODULE_1__["isPromise"])(step.value)) {
      _index__WEBPACK_IMPORTED_MODULE_0__["logger"].log(api, 'ROUTINE_ASYNC_BEGIN');
      step.value.then((...asyncResult) => {
        _index__WEBPACK_IMPORTED_MODULE_0__["logger"].log(api, 'ROUTINE_ASYNC_END');
        next(...asyncResult);
      }).catch(err => {
        _index__WEBPACK_IMPORTED_MODULE_0__["logger"].log(api, 'ROUTINE_ASYNC_ERROR', err);
        processGeneratorStep(gen.throw(err));
      });
    } else {
      processGeneratorStep(step);
    }
  }

  _index__WEBPACK_IMPORTED_MODULE_0__["grid"].add(api);
  next();
  return api;
};

ops.go['@go'] = true;

ops.go.with = (...maps) => {
  const reducedMaps = maps.reduce((res, item) => {
    if (typeof item === 'string') {
      res = { ...res,
        [item]: Object(_index__WEBPACK_IMPORTED_MODULE_0__["use"])(item)
      };
    } else {
      res = { ...res,
        ...item
      };
    }

    return res;
  }, {});
  return (func, done = () => {}, ...args) => {
    args.push(reducedMaps);
    return ops.go(func, done, args);
  };
};

ops.sleep = function sleep(ms, callback) {
  if (typeof callback === 'function') {
    setTimeout(callback, ms);
  } else {
    return {
      op: _index__WEBPACK_IMPORTED_MODULE_0__["SLEEP"],
      ms
    };
  }
};

ops.stop = function stop() {
  return {
    op: _index__WEBPACK_IMPORTED_MODULE_0__["STOP"]
  };
};

/* harmony default export */ __webpack_exports__["default"] = (ops);

/***/ }),

/***/ "../../src/csp/state.js":
/*!***********************************************************!*\
  !*** /Users/krasimir/Work/Krasimir/riew/src/csp/state.js ***!
  \***********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return state; });
/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../index */ "../../src/index.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils */ "../../src/utils.js");



const DEFAULT_SELECTOR = v => v;

const DEFAULT_REDUCER = (_, v) => v;

const DEFAULT_ERROR = e => {
  throw e;
};

function state(initialValue, parent = null) {
  let value = initialValue;
  const id = Object(_utils__WEBPACK_IMPORTED_MODULE_1__["getId"])('state');
  const children = [];

  function syncChildren(initiator) {
    children.forEach(c => {
      if (c.id !== initiator.id) {
        Object(_index__WEBPACK_IMPORTED_MODULE_0__["sput"])(c, {
          value,
          syncing: true
        });
      }
    });
  }

  const api = function (str, name) {
    if (str.length > 1) {
      Object(_utils__WEBPACK_IMPORTED_MODULE_1__["setProp"])(api, 'name', str[0] + name + str[1]);
    } else {
      Object(_utils__WEBPACK_IMPORTED_MODULE_1__["setProp"])(api, 'name', str[0]);
    }

    _index__WEBPACK_IMPORTED_MODULE_0__["logger"].setWhoName(api.id, api.name);
    return api;
  };

  Object(_utils__WEBPACK_IMPORTED_MODULE_1__["setProp"])(api, 'name', 'state');
  api.id = id;
  api['@state'] = true;
  api.parent = parent;

  api.children = () => children;

  api.chan = (selector = DEFAULT_SELECTOR, reducer = DEFAULT_REDUCER, onError = DEFAULT_ERROR) => {
    const buff = _index__WEBPACK_IMPORTED_MODULE_0__["buffer"].sliding(1);
    buff.setValue([value]);
    const ch = Object(_index__WEBPACK_IMPORTED_MODULE_0__["chan"])('sliding', buff, id);
    ch.afterTake((item, cb) => {
      try {
        if (Object(_utils__WEBPACK_IMPORTED_MODULE_1__["isGeneratorFunction"])(selector)) {
          Object(_index__WEBPACK_IMPORTED_MODULE_0__["go"])(selector, routineRes => cb(routineRes), [item], id);
          return;
        }

        cb(selector(item));
      } catch (e) {
        onError(e);
      }
    });
    ch.beforePut((payload, cb) => {
      if (payload !== null && typeof payload === 'object' && 'syncing' in payload && payload.syncing) {
        cb(payload.value);
        return;
      }

      try {
        if (Object(_utils__WEBPACK_IMPORTED_MODULE_1__["isGeneratorFunction"])(reducer)) {
          Object(_index__WEBPACK_IMPORTED_MODULE_0__["go"])(reducer, genResult => {
            value = genResult;
            syncChildren(ch);
            cb(value);
            _index__WEBPACK_IMPORTED_MODULE_0__["logger"].log(api, 'STATE_VALUE_SET', value);
          }, [value, payload], id);
          return;
        }

        value = reducer(value, payload);
        syncChildren(ch);
        cb(value);
        _index__WEBPACK_IMPORTED_MODULE_0__["logger"].log(api, 'STATE_VALUE_SET', value);
      } catch (e) {
        onError(e);
      }
    });
    children.push(ch);
    return ch;
  };

  api.select = (selector, onError) => api.chan(selector, DEFAULT_REDUCER, onError);

  api.mutate = (reducer, onError) => api.chan(DEFAULT_SELECTOR, reducer, onError);

  api.destroy = () => {
    children.forEach(ch => Object(_index__WEBPACK_IMPORTED_MODULE_0__["sclose"])(ch));
    value = undefined;
    _index__WEBPACK_IMPORTED_MODULE_0__["grid"].remove(api);
    _index__WEBPACK_IMPORTED_MODULE_0__["logger"].log(api, 'STATE_DESTROYED');
    return this;
  };

  api.get = () => value;

  api.set = newValue => {
    value = newValue;
    syncChildren({});
    _index__WEBPACK_IMPORTED_MODULE_0__["logger"].log(api, 'STATE_VALUE_SET', newValue);
    return newValue;
  };

  _index__WEBPACK_IMPORTED_MODULE_0__["logger"].log(api, 'STATE_CREATED', value);
  api.DEFAULT = api.chan()`default`;
  _index__WEBPACK_IMPORTED_MODULE_0__["grid"].add(api);
  return api;
}

/***/ }),

/***/ "../../src/csp/utils.js":
/*!***********************************************************!*\
  !*** /Users/krasimir/Work/Krasimir/riew/src/csp/utils.js ***!
  \***********************************************************/
/*! exports provided: normalizeChannels, normalizeTo, normalizeOptions */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "normalizeChannels", function() { return normalizeChannels; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "normalizeTo", function() { return normalizeTo; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "normalizeOptions", function() { return normalizeOptions; });
/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../index */ "../../src/index.js");
/* eslint-disable no-param-reassign, no-multi-assign */

function normalizeChannels(channels) {
  if (!Array.isArray(channels)) channels = [channels];
  return channels.map(ch => {
    if (Object(_index__WEBPACK_IMPORTED_MODULE_0__["isState"])(ch)) return ch.DEFAULT;
    return Object(_index__WEBPACK_IMPORTED_MODULE_0__["verifyChannel"])(ch);
  });
}
const DEFAULT_OPTIONS = {
  onError: null,
  initialCall: false
};
function normalizeTo(to) {
  if (Object(_index__WEBPACK_IMPORTED_MODULE_0__["isChannel"])(to)) {
    return v => Object(_index__WEBPACK_IMPORTED_MODULE_0__["sput"])(to, v);
  }

  if (typeof to === 'function') {
    return to;
  }

  throw new Error(`${to}${typeof to !== 'undefined' ? ` (${typeof to})` : ''} is not a channel.${typeof ch === 'string' ? ` Did you forget to define it?\nExample: chan("${to}")` : ''}`);
}
function normalizeOptions(options) {
  options = options || DEFAULT_OPTIONS;
  const onError = options.onError || DEFAULT_OPTIONS.onError;
  const strategy = options.strategy || _index__WEBPACK_IMPORTED_MODULE_0__["ALL_REQUIRED"];
  const listen = 'listen' in options ? options.listen : false;
  const read = 'read' in options ? options.read : false;
  const initialCall = 'initialCall' in options ? options.initialCall : DEFAULT_OPTIONS.initialCall;
  return {
    onError,
    strategy,
    initialCall,
    listen,
    read,
    userTakeCallback: options.userTakeCallback
  };
}

/***/ }),

/***/ "../../src/grid.js":
/*!******************************************************!*\
  !*** /Users/krasimir/Work/Krasimir/riew/src/grid.js ***!
  \******************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Grid; });
function Grid() {
  const gridAPI = {};
  let nodes = [];

  gridAPI.add = product => {
    if (!product || !product.id) {
      throw new Error(`Each node in the grid must be an object with "id" field. Instead "${product}" given.`);
    }

    nodes.push(product);
  };

  gridAPI.remove = product => {
    const idx = nodes.findIndex(({
      id
    }) => id === product.id);

    if (idx >= 0) {
      // splice because of https://krasimirtsonev.com/blog/article/foreach-or-not-to-foreach
      nodes.splice(idx, 1);
    }
  };

  gridAPI.reset = () => {
    nodes = [];
  };

  gridAPI.nodes = () => nodes;

  gridAPI.getNodeById = nodeId => nodes.find(({
    id
  }) => id === nodeId);

  return gridAPI;
}

/***/ }),

/***/ "../../src/index.js":
/*!*******************************************************!*\
  !*** /Users/krasimir/Work/Krasimir/riew/src/index.js ***!
  \*******************************************************/
/*! exports provided: OPEN, CLOSED, ENDED, PUT, TAKE, NOOP, SLEEP, STOP, READ, CALL_ROUTINE, FORK_ROUTINE, NOTHING, ALL_REQUIRED, ONE_OF, CHANNELS, buffer, chan, fixed, sliding, dropping, state, react, use, register, logger, grid, reset, registry, sput, put, stake, take, read, sread, listen, unsubAll, close, sclose, channelReset, schannelReset, call, fork, merge, timeout, verifyChannel, isChannel, getChannel, isRiew, isState, isRoutine, go, sleep, stop, inspector, riew, namedRiew */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "OPEN", function() { return OPEN; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CLOSED", function() { return CLOSED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ENDED", function() { return ENDED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PUT", function() { return PUT; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TAKE", function() { return TAKE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NOOP", function() { return NOOP; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SLEEP", function() { return SLEEP; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "STOP", function() { return STOP; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "READ", function() { return READ; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CALL_ROUTINE", function() { return CALL_ROUTINE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FORK_ROUTINE", function() { return FORK_ROUTINE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NOTHING", function() { return NOTHING; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ALL_REQUIRED", function() { return ALL_REQUIRED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ONE_OF", function() { return ONE_OF; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CHANNELS", function() { return CHANNELS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "buffer", function() { return buffer; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "chan", function() { return chan; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fixed", function() { return fixed; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "sliding", function() { return sliding; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "dropping", function() { return dropping; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "state", function() { return state; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "react", function() { return react; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "use", function() { return use; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "register", function() { return register; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "logger", function() { return logger; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "grid", function() { return grid; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "reset", function() { return reset; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "registry", function() { return registry; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "sput", function() { return sput; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "put", function() { return put; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "stake", function() { return stake; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "take", function() { return take; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "read", function() { return read; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "sread", function() { return sread; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "listen", function() { return listen; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "unsubAll", function() { return unsubAll; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "close", function() { return close; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "sclose", function() { return sclose; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "channelReset", function() { return channelReset; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "schannelReset", function() { return schannelReset; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "call", function() { return call; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fork", function() { return fork; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "merge", function() { return merge; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "timeout", function() { return timeout; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "verifyChannel", function() { return verifyChannel; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isChannel", function() { return isChannel; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getChannel", function() { return getChannel; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isRiew", function() { return isRiew; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isState", function() { return isState; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isRoutine", function() { return isRoutine; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "go", function() { return go; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "sleep", function() { return sleep; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "stop", function() { return stop; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "inspector", function() { return inspector; });
/* harmony import */ var _registry__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./registry */ "../../src/registry.js");
/* harmony import */ var _grid__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./grid */ "../../src/grid.js");
/* harmony import */ var _logger__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./logger */ "../../src/logger.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils */ "../../src/utils.js");
/* harmony import */ var _react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./react */ "../../src/react/index.js");
/* harmony import */ var _csp_buf__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./csp/buf */ "../../src/csp/buf.js");
/* harmony import */ var _csp_channel__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./csp/channel */ "../../src/csp/channel.js");
/* harmony import */ var _csp_ops__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./csp/ops */ "../../src/csp/ops.js");
/* harmony import */ var _csp_state__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./csp/state */ "../../src/csp/state.js");
/* harmony import */ var _inspector__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./inspector */ "../../src/inspector.js");
/* harmony import */ var _riew__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./riew */ "../../src/riew.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "riew", function() { return _riew__WEBPACK_IMPORTED_MODULE_10__["riew"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "namedRiew", function() { return _riew__WEBPACK_IMPORTED_MODULE_10__["namedRiew"]; });











const OPEN = Symbol('OPEN');
const CLOSED = Symbol('CLOSED');
const ENDED = Symbol('ENDED');
const PUT = 'PUT';
const TAKE = 'TAKE';
const NOOP = 'NOOP';
const SLEEP = 'SLEEP';
const STOP = 'STOP';
const READ = 'READ';
const CALL_ROUTINE = 'CALL_ROUTINE';
const FORK_ROUTINE = 'FORK_ROUTINE';
const NOTHING = Symbol('NOTHING');
const ALL_REQUIRED = Symbol('ALL_REQUIRED');
const ONE_OF = Symbol('ONE_OF');
const CHANNELS = {
  channels: {},

  getAll() {
    return this.channels;
  },

  get(id) {
    return this.channels[id];
  },

  set(id, ch) {
    this.channels[id] = ch;
    return ch;
  },

  del(id) {
    delete this.channels[id];
  },

  exists(id) {
    return !!this.channels[id];
  },

  reset() {
    this.channels = {};
  }

};
const buffer = _csp_buf__WEBPACK_IMPORTED_MODULE_5__["default"];
const chan = _csp_channel__WEBPACK_IMPORTED_MODULE_6__["default"];
const fixed = (size = 0, id = null, parent = null) => chan(id || 'fixed', buffer.fixed(size), parent);
const sliding = (size = 1, id = null, parent = null) => chan(id || 'sliding', buffer.sliding(size), parent);
const dropping = (size = 1, id = null, parent = null) => chan(id || 'dropping', buffer.dropping(size), parent);
const state = _csp_state__WEBPACK_IMPORTED_MODULE_8__["default"];

const react = {
  riew: (...args) => Object(_react__WEBPACK_IMPORTED_MODULE_4__["default"])(...args)
};
const use = (name, ...args) => _registry__WEBPACK_IMPORTED_MODULE_0__["default"].produce(name, ...args);
const register = (name, whatever) => {
  _registry__WEBPACK_IMPORTED_MODULE_0__["default"].defineProduct(name, () => whatever);
  return whatever;
};
const logger = new _logger__WEBPACK_IMPORTED_MODULE_2__["default"]();
const grid = new _grid__WEBPACK_IMPORTED_MODULE_1__["default"]();
const reset = () => (Object(_utils__WEBPACK_IMPORTED_MODULE_3__["resetIds"])(), grid.reset(), _registry__WEBPACK_IMPORTED_MODULE_0__["default"].reset(), CHANNELS.reset(), logger.reset());
const registry = _registry__WEBPACK_IMPORTED_MODULE_0__["default"];
const sput = _csp_ops__WEBPACK_IMPORTED_MODULE_7__["default"].sput;
const put = _csp_ops__WEBPACK_IMPORTED_MODULE_7__["default"].put;
const stake = _csp_ops__WEBPACK_IMPORTED_MODULE_7__["default"].stake;
const take = _csp_ops__WEBPACK_IMPORTED_MODULE_7__["default"].take;
const read = _csp_ops__WEBPACK_IMPORTED_MODULE_7__["default"].read;
const sread = _csp_ops__WEBPACK_IMPORTED_MODULE_7__["default"].sread;
const listen = _csp_ops__WEBPACK_IMPORTED_MODULE_7__["default"].listen;
const unsubAll = _csp_ops__WEBPACK_IMPORTED_MODULE_7__["default"].unsubAll;
const close = _csp_ops__WEBPACK_IMPORTED_MODULE_7__["default"].close;
const sclose = _csp_ops__WEBPACK_IMPORTED_MODULE_7__["default"].sclose;
const channelReset = _csp_ops__WEBPACK_IMPORTED_MODULE_7__["default"].channelReset;
const schannelReset = _csp_ops__WEBPACK_IMPORTED_MODULE_7__["default"].schannelReset;
const call = _csp_ops__WEBPACK_IMPORTED_MODULE_7__["default"].call;
const fork = _csp_ops__WEBPACK_IMPORTED_MODULE_7__["default"].fork;
const merge = _csp_ops__WEBPACK_IMPORTED_MODULE_7__["default"].merge;
const timeout = _csp_ops__WEBPACK_IMPORTED_MODULE_7__["default"].timeout;
const verifyChannel = _csp_ops__WEBPACK_IMPORTED_MODULE_7__["default"].verifyChannel;
const isChannel = _csp_ops__WEBPACK_IMPORTED_MODULE_7__["default"].isChannel;
const getChannel = _csp_ops__WEBPACK_IMPORTED_MODULE_7__["default"].getChannel;
const isRiew = _csp_ops__WEBPACK_IMPORTED_MODULE_7__["default"].isRiew;
const isState = _csp_ops__WEBPACK_IMPORTED_MODULE_7__["default"].isState;
const isRoutine = _csp_ops__WEBPACK_IMPORTED_MODULE_7__["default"].isRoutine;
const go = _csp_ops__WEBPACK_IMPORTED_MODULE_7__["default"].go;
const sleep = _csp_ops__WEBPACK_IMPORTED_MODULE_7__["default"].sleep;
const stop = _csp_ops__WEBPACK_IMPORTED_MODULE_7__["default"].stop;
const inspector = Object(_inspector__WEBPACK_IMPORTED_MODULE_9__["default"])(logger);

/***/ }),

/***/ "../../src/inspector.js":
/*!***********************************************************!*\
  !*** /Users/krasimir/Work/Krasimir/riew/src/inspector.js ***!
  \***********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return inspector; });
/* eslint-disable no-restricted-globals */
const isDefined = what => typeof what !== 'undefined';

function getOrigin() {
  if (isDefined(location) && isDefined(location.protocol) && isDefined(location.host)) {
    return `${location.protocol}//${location.host}`;
  }

  return 'unknown';
}

function inspector(logger) {
  return (callback = () => {}, logSnapshotsToConsole = false) => {
    logger.enable();
    logger.on(snapshot => {
      if (typeof window !== 'undefined') {
        if (logSnapshotsToConsole) {
          console.log('Riew:inspector', snapshot);
        }

        callback(snapshot);
        window.postMessage({
          type: 'RIEW_SNAPSHOT',
          source: 'riew',
          origin: getOrigin(),
          snapshot,
          time: new Date().getTime()
        }, '*');
      }
    });
  };
}

/***/ }),

/***/ "../../src/logger.js":
/*!********************************************************!*\
  !*** /Users/krasimir/Work/Krasimir/riew/src/logger.js ***!
  \********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Logger; });
/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index */ "../../src/index.js");
/* harmony import */ var _sanitize__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./sanitize */ "../../src/sanitize/index.js");
/* eslint-disable no-use-before-define */


const RIEW = 'RIEW';
const STATE = 'STATE';
const CHANNEL = 'CHANNEL';
const ROUTINE = 'ROUTINE';

function normalizeRiew(r) {
  return {
    id: r.id,
    name: r.name,
    type: RIEW,
    viewData: Object(_sanitize__WEBPACK_IMPORTED_MODULE_1__["default"])(r.renderer.data()),
    children: r.children.map(child => {
      if (Object(_index__WEBPACK_IMPORTED_MODULE_0__["isState"])(child)) {
        return normalizeState(child);
      }

      if (Object(_index__WEBPACK_IMPORTED_MODULE_0__["isChannel"])(child)) {
        return normalizeChannel(child);
      }

      if (Object(_index__WEBPACK_IMPORTED_MODULE_0__["isRoutine"])(child)) {
        return normalizeRoutine(child);
      }

      console.warn('Riew logger: unrecognized riew child', child);
    })
  };
}

function normalizeState(s) {
  return {
    id: s.id,
    name: s.name,
    parent: s.parent,
    type: STATE,
    value: Object(_sanitize__WEBPACK_IMPORTED_MODULE_1__["default"])(s.get()),
    children: s.children().map(child => {
      if (Object(_index__WEBPACK_IMPORTED_MODULE_0__["isChannel"])(child)) {
        return normalizeChannel(child);
      }

      console.warn('Riew logger: unrecognized state child', child);
    })
  };
}

function normalizeChannel(c) {
  const o = {
    id: c.id,
    name: c.name,
    parent: c.parent,
    type: CHANNEL,
    value: Object(_sanitize__WEBPACK_IMPORTED_MODULE_1__["default"])(c.value()),
    puts: c.buff.puts.map(({
      item
    }) => ({
      item
    })),
    takes: c.buff.takes.map(({
      options
    }) => ({
      read: options.read,
      listen: options.listen
    }))
  };
  return o;
}

function normalizeRoutine(r) {
  return {
    id: r.id,
    type: ROUTINE,
    name: r.name,
    parent: r.parent
  };
}

function Logger() {
  const api = {};
  let frames = [];
  let data = [];
  let inProgress = false;
  let enabled = false;
  const listeners = [];

  api.on = listener => listeners.push(listener);

  api.log = (who, what, meta) => {
    if (!enabled) return null;

    if (Object(_index__WEBPACK_IMPORTED_MODULE_0__["isRiew"])(who)) {
      who = normalizeRiew(who);
    } else if (Object(_index__WEBPACK_IMPORTED_MODULE_0__["isState"])(who)) {
      who = normalizeState(who);
    } else if (Object(_index__WEBPACK_IMPORTED_MODULE_0__["isChannel"])(who)) {
      who = normalizeChannel(who);
    } else if (Object(_index__WEBPACK_IMPORTED_MODULE_0__["isRoutine"])(who)) {
      who = normalizeRoutine(who);
    } else {
      console.warn('Riew logger: unrecognized who', who, what);
    }

    data.push({
      who,
      what,
      meta: Object(_sanitize__WEBPACK_IMPORTED_MODULE_1__["default"])(meta)
    });

    if (!inProgress) {
      inProgress = true;
      Promise.resolve().then(() => {
        const s = api.frame(data);
        inProgress = false;
        data = [];
        listeners.forEach(l => l(s));
      });
    }
  };

  api.frame = actions => {
    if (!enabled) return null;
    const frame = Object(_sanitize__WEBPACK_IMPORTED_MODULE_1__["default"])(actions);
    frames.push(frame);
    return frame;
  };

  api.now = () => frames.length > 0 ? frames[frames.length - 1] : null;

  api.frames = () => frames;

  api.reset = () => {
    frames = [];
    enabled = false;
  };

  api.enable = () => {
    enabled = true;
  };

  api.disable = () => {
    enabled = false;
  };

  api.setWhoName = (id, name) => {
    data.forEach(action => {
      if (action.who.id === id) {
        action.who.name = name;
      }
    });
    frames.forEach(frame => {
      frame.forEach(action => {
        if (action.who.id === id) {
          action.who.name = name;
        }
      });
    });
  };

  return api;
}

/***/ }),

/***/ "../../src/react/index.js":
/*!*************************************************************!*\
  !*** /Users/krasimir/Work/Krasimir/riew/src/react/index.js ***!
  \*************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return riew; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "../../node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils */ "../../src/utils.js");
/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../index */ "../../src/index.js");
/* eslint-disable */



function riew(View, ...routines) {
  const name = Object(_utils__WEBPACK_IMPORTED_MODULE_1__["getFuncName"])(View);

  const createBridge = function (externals = []) {
    const comp = function (outerProps) {
      let [instance, setInstance] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])(null);
      const [content, setContent] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])(null);
      const mounted = Object(react__WEBPACK_IMPORTED_MODULE_0__["useRef"])(true); // updating props

      Object(react__WEBPACK_IMPORTED_MODULE_0__["useEffect"])(() => {
        if (instance) {
          instance.update(outerProps);
        }
      }, [outerProps]); // mounting

      Object(react__WEBPACK_IMPORTED_MODULE_0__["useEffect"])(() => {
        instance = Object(_index__WEBPACK_IMPORTED_MODULE_2__["namedRiew"])(name, props => {
          if (!mounted) return;

          if (props === null) {
            setContent(null);
          } else {
            setContent(props);
          }
        }, ...routines);

        if (externals && externals.length > 0) {
          instance = instance.with(...externals);
        }

        instance.name = name;
        setInstance(instance);
        instance.mount(outerProps);
        mounted.current = true;
        return function () {
          mounted.current = false;
          instance.unmount();
        };
      }, []);
      return content === null ? null : react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(View, content);
    };

    comp.displayName = `Riew_${name}`;

    comp.with = (...maps) => createBridge(maps);

    return comp;
  };

  return createBridge();
}

/***/ }),

/***/ "../../src/registry.js":
/*!**********************************************************!*\
  !*** /Users/krasimir/Work/Krasimir/riew/src/registry.js ***!
  \**********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* eslint-disable no-use-before-define */
function Registry() {
  const api = {};
  let products = {};

  api.defineProduct = (type, func) => {
    if (products[type]) {
      throw new Error(`A resource with type "${type}" already exists.`);
    }

    products[type] = func;
  };

  api.undefineProduct = type => {
    if (!products[type]) {
      throw new Error(`There is no resource with type "${type}" to be removed.`);
    }

    delete products[type];
  };

  api.produce = (type, ...args) => {
    if (!products[type]) {
      throw new Error(`There is no resource with type "${type}".`);
    }

    return products[type](...args);
  };

  api.reset = () => {
    products = {};
  };

  api.debug = () => ({
    productNames: Object.keys(products)
  });

  return api;
}

const r = Registry();
/* harmony default export */ __webpack_exports__["default"] = (r);

/***/ }),

/***/ "../../src/riew.js":
/*!******************************************************!*\
  !*** /Users/krasimir/Work/Krasimir/riew/src/riew.js ***!
  \******************************************************/
/*! exports provided: riew, namedRiew */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "riew", function() { return riew; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "namedRiew", function() { return namedRiew; });
/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index */ "../../src/index.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils */ "../../src/utils.js");
/* eslint-disable no-param-reassign, no-use-before-define */



const Renderer = function (pushDataToView) {
  let data = {};
  let inProgress = false;
  let active = true;
  return {
    push(newData) {
      if (newData === _index__WEBPACK_IMPORTED_MODULE_0__["CLOSED"] || newData === _index__WEBPACK_IMPORTED_MODULE_0__["ENDED"]) {
        return;
      }

      data = Object(_utils__WEBPACK_IMPORTED_MODULE_1__["accumulate"])(data, newData);

      if (!inProgress) {
        inProgress = true;
        Promise.resolve().then(() => {
          if (active) {
            pushDataToView(data);
          }

          inProgress = false;
        });
      }
    },

    destroy() {
      active = false;
    },

    data() {
      return data;
    }

  };
};

function riew(viewFunc, ...routines) {
  const name = Object(_utils__WEBPACK_IMPORTED_MODULE_1__["getFuncName"])(viewFunc);
  return namedRiew(name, viewFunc, ...routines);
}
function namedRiew(name, viewFunc, ...routines) {
  const renderer = Renderer(value => {
    viewFunc(value);
    _index__WEBPACK_IMPORTED_MODULE_0__["logger"].log(api, 'RIEW_RENDERED', value);
  });
  const id = Object(_utils__WEBPACK_IMPORTED_MODULE_1__["getId"])(`${name}_riew`);
  const api = {
    id,
    name,
    '@riew': true,
    children: [],
    renderer
  };
  let cleanups = [];
  let externals = {};
  let subscriptions = {};

  const addChild = function (o) {
    api.children.push(o);
    return o;
  };

  const state = initialValue => addChild(Object(_index__WEBPACK_IMPORTED_MODULE_0__["state"])(initialValue, id));

  const sliding = n => addChild(Object(_index__WEBPACK_IMPORTED_MODULE_0__["sliding"])(n, `sliding_${name}`, id));

  const fixed = n => addChild(Object(_index__WEBPACK_IMPORTED_MODULE_0__["fixed"])(n, `fixed_${name}`, id));

  const dropping = n => addChild(Object(_index__WEBPACK_IMPORTED_MODULE_0__["dropping"])(n, `dropping_${name}`, id));

  const subscribe = function (to, func) {
    if (!(to.id in subscriptions)) {
      subscriptions[to.id] = Object(_index__WEBPACK_IMPORTED_MODULE_0__["listen"])(to, func, {
        initialCall: true
      });
    }
  };

  const VIEW_CHANNEL = sliding(1)`view`;
  const PROPS_CHANNEL = sliding(1)`props`;

  const normalizeRenderData = value => Object.keys(value).reduce((obj, key) => {
    const ch = Object(_index__WEBPACK_IMPORTED_MODULE_0__["verifyChannel"])(value[key], false);

    if (ch !== null) {
      subscribe(ch, v => Object(_index__WEBPACK_IMPORTED_MODULE_0__["sput"])(VIEW_CHANNEL, {
        [key]: v
      }));
    } else if (Object(_index__WEBPACK_IMPORTED_MODULE_0__["isState"])(value[key])) {
      subscribe(value[key].DEFAULT, v => Object(_index__WEBPACK_IMPORTED_MODULE_0__["sput"])(VIEW_CHANNEL, {
        [key]: v
      }));
    } else {
      obj[key] = value[key];
    }

    return obj;
  }, {});

  api.mount = function (props = {}) {
    Object(_utils__WEBPACK_IMPORTED_MODULE_1__["requireObject"])(props);
    Object(_index__WEBPACK_IMPORTED_MODULE_0__["sput"])(PROPS_CHANNEL, props);
    subscribe(PROPS_CHANNEL, newProps => {
      Object(_index__WEBPACK_IMPORTED_MODULE_0__["sput"])(VIEW_CHANNEL, newProps);
    });
    subscribe(VIEW_CHANNEL, renderer.push);
    api.children = api.children.concat(routines.map(r => Object(_index__WEBPACK_IMPORTED_MODULE_0__["go"])(r, result => {
      if (typeof result === 'function') {
        cleanups.push(result);
      }
    }, [{
      render: value => {
        Object(_utils__WEBPACK_IMPORTED_MODULE_1__["requireObject"])(value);
        Object(_index__WEBPACK_IMPORTED_MODULE_0__["sput"])(VIEW_CHANNEL, normalizeRenderData(value));
      },
      state,
      fixed,
      sliding,
      dropping,
      props: PROPS_CHANNEL,
      ...externals
    }], id)));

    if (!Object(_utils__WEBPACK_IMPORTED_MODULE_1__["isObjectEmpty"])(externals)) {
      Object(_index__WEBPACK_IMPORTED_MODULE_0__["sput"])(VIEW_CHANNEL, normalizeRenderData(externals));
    }

    _index__WEBPACK_IMPORTED_MODULE_0__["logger"].log(api, 'RIEW_MOUNTED', props);
  };

  api.unmount = function () {
    cleanups.forEach(c => c());
    cleanups = [];
    Object.keys(subscriptions).forEach(subId => {
      subscriptions[subId]();
    });
    subscriptions = {};
    api.children.forEach(c => {
      if (Object(_index__WEBPACK_IMPORTED_MODULE_0__["isState"])(c)) {
        c.destroy();
      } else if (Object(_index__WEBPACK_IMPORTED_MODULE_0__["isRoutine"])(c)) {
        c.stop();
      } else if (Object(_index__WEBPACK_IMPORTED_MODULE_0__["isChannel"])(c)) {
        Object(_index__WEBPACK_IMPORTED_MODULE_0__["close"])(c);
      }
    });
    api.children = [];
    renderer.destroy();
    _index__WEBPACK_IMPORTED_MODULE_0__["grid"].remove(api);
    _index__WEBPACK_IMPORTED_MODULE_0__["logger"].log(api, 'RIEW_UNMOUNTED');
  };

  api.update = function (props = {}) {
    Object(_utils__WEBPACK_IMPORTED_MODULE_1__["requireObject"])(props);
    Object(_index__WEBPACK_IMPORTED_MODULE_0__["sput"])(PROPS_CHANNEL, props);
    _index__WEBPACK_IMPORTED_MODULE_0__["logger"].log(api, 'RIEW_UPDATED', props);
  };

  api.with = (...maps) => {
    api.__setExternals(maps);

    return api;
  };

  api.test = map => {
    const newInstance = riew(viewFunc, ...routines);

    newInstance.__setExternals([map]);

    return newInstance;
  };

  api.__setExternals = maps => {
    const reducedMaps = maps.reduce((res, item) => {
      if (typeof item === 'string') {
        res = { ...res,
          [item]: Object(_index__WEBPACK_IMPORTED_MODULE_0__["use"])(item)
        };
      } else {
        res = { ...res,
          ...item
        };
      }

      return res;
    }, {});
    externals = { ...externals,
      ...reducedMaps
    };
  };

  _index__WEBPACK_IMPORTED_MODULE_0__["grid"].add(api);
  _index__WEBPACK_IMPORTED_MODULE_0__["logger"].log(api, 'RIEW_CREATED');
  return api;
}

/***/ }),

/***/ "../../src/sanitize/index.js":
/*!****************************************************************!*\
  !*** /Users/krasimir/Work/Krasimir/riew/src/sanitize/index.js ***!
  \****************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return sanitize; });
/* harmony import */ var _vendors_CircularJSON__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./vendors/CircularJSON */ "../../src/sanitize/vendors/CircularJSON.js");
/* harmony import */ var _vendors_SerializeError__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./vendors/SerializeError */ "../../src/sanitize/vendors/SerializeError.js");
/* harmony import */ var _vendors_SerializeError__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_vendors_SerializeError__WEBPACK_IMPORTED_MODULE_1__);


function sanitize(something, showErrorInConsole = false) {
  let result;

  try {
    result = JSON.parse(_vendors_CircularJSON__WEBPACK_IMPORTED_MODULE_0__["default"].stringify(something, function (key, value) {
      if (typeof value === 'function') {
        return value.name === '' ? '<anonymous>' : `function ${value.name}()`;
      }

      if (value instanceof Error) {
        return _vendors_SerializeError__WEBPACK_IMPORTED_MODULE_1___default()(value);
      }

      return value;
    }, undefined, true));
  } catch (error) {
    if (showErrorInConsole) {
      console.log(error);
    }

    result = null;
  }

  return result;
}

/***/ }),

/***/ "../../src/sanitize/vendors/CircularJSON.js":
/*!*******************************************************************************!*\
  !*** /Users/krasimir/Work/Krasimir/riew/src/sanitize/vendors/CircularJSON.js ***!
  \*******************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* eslint-disable */

/*!
Copyright (C) 2013-2017 by Andrea Giammarchi - @WebReflection

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/
var // should be a not so common char
// possibly one JSON does not encode
// possibly one encodeURIComponent does not encode
// right now this char is '~' but this might change in the future
specialChar = '~',
    safeSpecialChar = '\\x' + ('0' + specialChar.charCodeAt(0).toString(16)).slice(-2),
    escapedSafeSpecialChar = '\\' + safeSpecialChar,
    specialCharRG = new RegExp(safeSpecialChar, 'g'),
    safeSpecialCharRG = new RegExp(escapedSafeSpecialChar, 'g'),
    safeStartWithSpecialCharRG = new RegExp('(?:^|([^\\\\]))' + escapedSafeSpecialChar),
    indexOf = [].indexOf || function (v) {
  for (var i = this.length; i-- && this[i] !== v;);

  return i;
},
    $String = String // there's no way to drop warnings in JSHint
// about new String ... well, I need that here!
// faked, and happy linter!
;

function generateReplacer(value, replacer, resolve) {
  var inspect = !!replacer,
      path = [],
      all = [value],
      seen = [value],
      mapp = [resolve ? specialChar : '<circular>'],
      last = value,
      lvl = 1,
      i,
      fn;

  if (inspect) {
    fn = typeof replacer === 'object' ? function (key, value) {
      return key !== '' && replacer.indexOf(key) < 0 ? void 0 : value;
    } : replacer;
  }

  return function (key, value) {
    // the replacer has rights to decide
    // if a new object should be returned
    // or if there's some key to drop
    // let's call it here rather than "too late"
    if (inspect) value = fn.call(this, key, value); // did you know ? Safari passes keys as integers for arrays
    // which means if (key) when key === 0 won't pass the check

    if (key !== '') {
      if (last !== this) {
        i = lvl - indexOf.call(all, this) - 1;
        lvl -= i;
        all.splice(lvl, all.length);
        path.splice(lvl - 1, path.length);
        last = this;
      } // console.log(lvl, key, path);


      if (typeof value === 'object' && value) {
        // if object isn't referring to parent object, add to the
        // object path stack. Otherwise it is already there.
        if (indexOf.call(all, value) < 0) {
          all.push(last = value);
        }

        lvl = all.length;
        i = indexOf.call(seen, value);

        if (i < 0) {
          i = seen.push(value) - 1;

          if (resolve) {
            // key cannot contain specialChar but could be not a string
            path.push(('' + key).replace(specialCharRG, safeSpecialChar));
            mapp[i] = specialChar + path.join(specialChar);
          } else {
            mapp[i] = mapp[0];
          }
        } else {
          value = mapp[i];
        }
      } else {
        if (typeof value === 'string' && resolve) {
          // ensure no special char involved on deserialization
          // in this case only first char is important
          // no need to replace all value (better performance)
          value = value.replace(safeSpecialChar, escapedSafeSpecialChar).replace(specialChar, safeSpecialChar);
        }
      }
    }

    return value;
  };
}

function retrieveFromPath(current, keys) {
  for (var i = 0, length = keys.length; i < length; current = current[// keys should be normalized back here
  keys[i++].replace(safeSpecialCharRG, specialChar)]);

  return current;
}

function generateReviver(reviver) {
  return function (key, value) {
    var isString = typeof value === 'string';

    if (isString && value.charAt(0) === specialChar) {
      return new $String(value.slice(1));
    }

    if (key === '') value = regenerate(value, value, {}); // again, only one needed, do not use the RegExp for this replacement
    // only keys need the RegExp

    if (isString) value = value.replace(safeStartWithSpecialCharRG, '$1' + specialChar).replace(escapedSafeSpecialChar, safeSpecialChar);
    return reviver ? reviver.call(this, key, value) : value;
  };
}

function regenerateArray(root, current, retrieve) {
  for (var i = 0, length = current.length; i < length; i++) {
    current[i] = regenerate(root, current[i], retrieve);
  }

  return current;
}

function regenerateObject(root, current, retrieve) {
  for (var key in current) {
    if (current.hasOwnProperty(key)) {
      current[key] = regenerate(root, current[key], retrieve);
    }
  }

  return current;
}

function regenerate(root, current, retrieve) {
  return current instanceof Array ? // fast Array reconstruction
  regenerateArray(root, current, retrieve) : current instanceof $String ? // root is an empty string
  current.length ? retrieve.hasOwnProperty(current) ? retrieve[current] : retrieve[current] = retrieveFromPath(root, current.split(specialChar)) : root : current instanceof Object ? // dedicated Object parser
  regenerateObject(root, current, retrieve) : // value as it is
  current;
}

function stringifyRecursion(value, replacer, space, doNotResolve) {
  return JSON.stringify(value, generateReplacer(value, replacer, !doNotResolve), space);
}

function parseRecursion(text, reviver) {
  return JSON.parse(text, generateReviver(reviver));
}

/* harmony default export */ __webpack_exports__["default"] = ({
  stringify: stringifyRecursion,
  parse: parseRecursion
});

/***/ }),

/***/ "../../src/sanitize/vendors/SerializeError.js":
/*!*********************************************************************************!*\
  !*** /Users/krasimir/Work/Krasimir/riew/src/sanitize/vendors/SerializeError.js ***!
  \*********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* eslint-disable */
// Credits: https://github.com/sindresorhus/serialize-error


module.exports = value => {
  if (typeof value === 'object') {
    return destroyCircular(value, []);
  } // People sometimes throw things besides Error objects, so…


  if (typeof value === 'function') {
    // JSON.stringify discards functions. We do too, unless a function is thrown directly.
    return `[Function: ${value.name || 'anonymous'}]`;
  }

  return value;
}; // https://www.npmjs.com/package/destroy-circular


function destroyCircular(from, seen) {
  const to = Array.isArray(from) ? [] : {};
  seen.push(from);

  for (const key of Object.keys(from)) {
    const value = from[key];

    if (typeof value === 'function') {
      continue;
    }

    if (!value || typeof value !== 'object') {
      to[key] = value;
      continue;
    }

    if (seen.indexOf(from[key]) === -1) {
      to[key] = destroyCircular(from[key], seen.slice(0));
      continue;
    }

    to[key] = '[Circular]';
  }

  if (typeof from.name === 'string') {
    to.name = from.name;
  }

  if (typeof from.message === 'string') {
    to.message = from.message;
  }

  if (typeof from.stack === 'string') {
    to.stack = from.stack;
  }

  return to;
}

/***/ }),

/***/ "../../src/utils.js":
/*!*******************************************************!*\
  !*** /Users/krasimir/Work/Krasimir/riew/src/utils.js ***!
  \*******************************************************/
/*! exports provided: getFuncName, getId, isObjectEmpty, requireObject, accumulate, isPromise, isObjectLiteral, isGenerator, isGeneratorFunction, resetIds, setProp */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getFuncName", function() { return getFuncName; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getId", function() { return getId; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isObjectEmpty", function() { return isObjectEmpty; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "requireObject", function() { return requireObject; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "accumulate", function() { return accumulate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isPromise", function() { return isPromise; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isObjectLiteral", function() { return isObjectLiteral; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isGenerator", function() { return isGenerator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isGeneratorFunction", function() { return isGeneratorFunction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "resetIds", function() { return resetIds; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setProp", function() { return setProp; });
const getFuncName = func => {
  if (func.name) return func.name;
  const result = /^function\s+([\w\$]+)\s*\(/.exec(func.toString());
  return result ? result[1] : 'unknown';
};
let ids = 0;
const getId = prefix => `${prefix}_${++ids}`;
function isObjectEmpty(obj) {
  for (const prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      return false;
    }
  }

  return true;
}
function requireObject(obj) {
  if (typeof obj === 'undefined' || obj === null || typeof obj !== 'undefined' && typeof obj !== 'object') {
    throw new Error(`A key-value object expected. Instead "${obj}" passed.`);
  }
}
const accumulate = (current, newData) => ({ ...current,
  ...newData
});
const isPromise = obj => obj && typeof obj.then === 'function';
const isObjectLiteral = obj => obj ? obj.constructor === {}.constructor : false;
const isGenerator = obj => obj && typeof obj.next === 'function' && typeof obj.throw === 'function';
const isGeneratorFunction = fn => {
  const {
    constructor
  } = fn;
  if (!constructor) return false;

  if (constructor.name === 'GeneratorFunction' || constructor.displayName === 'GeneratorFunction') {
    return true;
  }

  return isGenerator(constructor.prototype);
};
function resetIds() {
  ids = 0;
}
function setProp(who, propName, value) {
  Object.defineProperty(who, propName, {
    writable: true,
    value
  });
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/taggedTemplateLiteral.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/taggedTemplateLiteral.js ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _taggedTemplateLiteral(strings, raw) {
  if (!raw) {
    raw = strings.slice(0);
  }

  return Object.freeze(Object.defineProperties(strings, {
    raw: {
      value: Object.freeze(raw)
    }
  }));
}

module.exports = _taggedTemplateLiteral;

/***/ }),

/***/ "./node_modules/regenerator-runtime/runtime.js":
/*!*****************************************************!*\
  !*** ./node_modules/regenerator-runtime/runtime.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return Promise.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
   true ? module.exports : undefined
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  Function("r", "regeneratorRuntime = r")(runtime);
}


/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_helpers_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/taggedTemplateLiteral */ "./node_modules/@babel/runtime/helpers/taggedTemplateLiteral.js");
/* harmony import */ var _babel_runtime_helpers_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _src__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../src */ "../../src/index.js");


function _templateObject() {
  var data = _babel_runtime_helpers_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_0___default()(["toLowerCase"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

/* eslint-disable no-unused-vars */

Object(_src__WEBPACK_IMPORTED_MODULE_1__["inspector"])(function () {}, true);
var s = Object(_src__WEBPACK_IMPORTED_MODULE_1__["state"])('foo');
var toLowerCase = s.select(function (v) {
  return v.toLowerCase();
})(_templateObject());
Object(_src__WEBPACK_IMPORTED_MODULE_1__["listen"])(toLowerCase, function (v) {
  return console.log(v);
});
Object(_src__WEBPACK_IMPORTED_MODULE_1__["sput"])(s, 'BAR'); // const update = s.mutate((current, payload) => current + payload);

/***/ }),

/***/ 0:
/*!********************************************************!*\
  !*** multi regenerator-runtime/runtime ./src/index.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! regenerator-runtime/runtime */"./node_modules/regenerator-runtime/runtime.js");
module.exports = __webpack_require__(/*! ./src/index.js */"./src/index.js");


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy9Vc2Vycy9rcmFzaW1pci9Xb3JrL0tyYXNpbWlyL3JpZXcvbm9kZV9tb2R1bGVzL29iamVjdC1hc3NpZ24vaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy9Vc2Vycy9rcmFzaW1pci9Xb3JrL0tyYXNpbWlyL3JpZXcvbm9kZV9tb2R1bGVzL3Byb3AtdHlwZXMvY2hlY2tQcm9wVHlwZXMuanMiLCJ3ZWJwYWNrOi8vLy9Vc2Vycy9rcmFzaW1pci9Xb3JrL0tyYXNpbWlyL3JpZXcvbm9kZV9tb2R1bGVzL3Byb3AtdHlwZXMvbGliL1JlYWN0UHJvcFR5cGVzU2VjcmV0LmpzIiwid2VicGFjazovLy8vVXNlcnMva3Jhc2ltaXIvV29yay9LcmFzaW1pci9yaWV3L25vZGVfbW9kdWxlcy9yZWFjdC9janMvcmVhY3QuZGV2ZWxvcG1lbnQuanMiLCJ3ZWJwYWNrOi8vLy9Vc2Vycy9rcmFzaW1pci9Xb3JrL0tyYXNpbWlyL3JpZXcvbm9kZV9tb2R1bGVzL3JlYWN0L2luZGV4LmpzIiwid2VicGFjazovLy8vVXNlcnMva3Jhc2ltaXIvV29yay9LcmFzaW1pci9yaWV3L3NyYy9jc3AvYnVmLmpzIiwid2VicGFjazovLy8vVXNlcnMva3Jhc2ltaXIvV29yay9LcmFzaW1pci9yaWV3L3NyYy9jc3AvY2hhbm5lbC5qcyIsIndlYnBhY2s6Ly8vL1VzZXJzL2tyYXNpbWlyL1dvcmsvS3Jhc2ltaXIvcmlldy9zcmMvY3NwL29wcy5qcyIsIndlYnBhY2s6Ly8vL1VzZXJzL2tyYXNpbWlyL1dvcmsvS3Jhc2ltaXIvcmlldy9zcmMvY3NwL3N0YXRlLmpzIiwid2VicGFjazovLy8vVXNlcnMva3Jhc2ltaXIvV29yay9LcmFzaW1pci9yaWV3L3NyYy9jc3AvdXRpbHMuanMiLCJ3ZWJwYWNrOi8vLy9Vc2Vycy9rcmFzaW1pci9Xb3JrL0tyYXNpbWlyL3JpZXcvc3JjL2dyaWQuanMiLCJ3ZWJwYWNrOi8vLy9Vc2Vycy9rcmFzaW1pci9Xb3JrL0tyYXNpbWlyL3JpZXcvc3JjL2luZGV4LmpzIiwid2VicGFjazovLy8vVXNlcnMva3Jhc2ltaXIvV29yay9LcmFzaW1pci9yaWV3L3NyYy9pbnNwZWN0b3IuanMiLCJ3ZWJwYWNrOi8vLy9Vc2Vycy9rcmFzaW1pci9Xb3JrL0tyYXNpbWlyL3JpZXcvc3JjL2xvZ2dlci5qcyIsIndlYnBhY2s6Ly8vL1VzZXJzL2tyYXNpbWlyL1dvcmsvS3Jhc2ltaXIvcmlldy9zcmMvcmVhY3QvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy9Vc2Vycy9rcmFzaW1pci9Xb3JrL0tyYXNpbWlyL3JpZXcvc3JjL3JlZ2lzdHJ5LmpzIiwid2VicGFjazovLy8vVXNlcnMva3Jhc2ltaXIvV29yay9LcmFzaW1pci9yaWV3L3NyYy9yaWV3LmpzIiwid2VicGFjazovLy8vVXNlcnMva3Jhc2ltaXIvV29yay9LcmFzaW1pci9yaWV3L3NyYy9zYW5pdGl6ZS9pbmRleC5qcyIsIndlYnBhY2s6Ly8vL1VzZXJzL2tyYXNpbWlyL1dvcmsvS3Jhc2ltaXIvcmlldy9zcmMvc2FuaXRpemUvdmVuZG9ycy9DaXJjdWxhckpTT04uanMiLCJ3ZWJwYWNrOi8vLy9Vc2Vycy9rcmFzaW1pci9Xb3JrL0tyYXNpbWlyL3JpZXcvc3JjL3Nhbml0aXplL3ZlbmRvcnMvU2VyaWFsaXplRXJyb3IuanMiLCJ3ZWJwYWNrOi8vLy9Vc2Vycy9rcmFzaW1pci9Xb3JrL0tyYXNpbWlyL3JpZXcvc3JjL3V0aWxzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL3RhZ2dlZFRlbXBsYXRlTGl0ZXJhbC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcmVnZW5lcmF0b3ItcnVudGltZS9ydW50aW1lLmpzIiwid2VicGFjazovLy8uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJERUZBVUxUX09QVElPTlMiLCJkcm9wcGluZyIsInNsaWRpbmciLCJOT09QIiwidiIsImNiIiwiQ1NQQnVmZmVyIiwic2l6ZSIsImFwaSIsInZhbHVlIiwicHV0cyIsInRha2VzIiwiaG9va3MiLCJiZWZvcmVQdXQiLCJhZnRlclB1dCIsImJlZm9yZVRha2UiLCJhZnRlclRha2UiLCJwYXJlbnQiLCJob29rIiwiaXNFbXB0eSIsImxlbmd0aCIsInJlc2V0Iiwic2V0VmFsdWUiLCJnZXRWYWx1ZSIsImRlY29tcG9zZVRha2VycyIsInJlZHVjZSIsInJlcyIsInRha2VPYmoiLCJvcHRpb25zIiwicmVhZCIsInB1c2giLCJyZWFkZXJzIiwidGFrZXJzIiwiY29uc3VtZVRha2UiLCJsaXN0ZW4iLCJpZHgiLCJmaW5kSW5kZXgiLCJ0Iiwic3BsaWNlIiwiY2FsbGJhY2siLCJkZWxldGVUYWtlciIsImRlbGV0ZUxpc3RlbmVycyIsImZpbHRlciIsInB1dCIsIml0ZW0iLCJmb3JFYWNoIiwicmVhZGVyIiwic2hpZnQiLCJ0YWtlIiwic3Vic2NyaWJlIiwibm9ybWFsaXplT3B0aW9ucyIsImluaXRpYWxDYWxsIiwibG9nZ2VyIiwibG9nIiwiYmVmb3JlUHV0SXRlbSIsInB1dE9wUmVzIiwiYWZ0ZXJQdXRJdGVtIiwidW5zdWJzY3JpYmUiLCJ1bmRlZmluZWQiLCJ0YWtlT3BSZXMiLCJhZnRlclRha2VJdGVtIiwiYnVmZmVyIiwiZml4ZWQiLCJFcnJvciIsImNoYW4iLCJpZCIsImJ1ZmYiLCJzdGF0ZSIsIk9QRU4iLCJnZXRJZCIsIkNIQU5ORUxTIiwiZXhpc3RzIiwiY2hhbm5lbCIsInN0ciIsIm5hbWUiLCJzZXRQcm9wIiwic2V0V2hvTmFtZSIsInNldCIsImlzQWN0aXZlIiwicyIsImV4cG9ydEFzIiwia2V5IiwicmVnaXN0ZXIiLCJncmlkIiwiYWRkIiwibm9vcCIsIm9wcyIsInNwdXQiLCJjaGFubmVscyIsIm5vcm1hbGl6ZUNoYW5uZWxzIiwicmVzdWx0IiwibWFwIiwiTk9USElORyIsInNldFJlc3VsdCIsImluY2x1ZGVzIiwiY2hTdGF0ZSIsInB1dFJlc3VsdCIsIm9wIiwiUFVUIiwic3Rha2UiLCJub3JtYWxpemVUbyIsInVuc3Vic2NyaWJlcnMiLCJzdHJhdGVneSIsIkFMTF9SRVFVSVJFRCIsIkVOREVEIiwiQ0xPU0VEIiwidGFrZVJlc3VsdCIsIk9ORV9PRiIsImRvbmUiLCJmIiwiVEFLRSIsIlJFQUQiLCJzcmVhZCIsInRvIiwidW5zdWJBbGwiLCJjbG9zZSIsImNoIiwibmV3U3RhdGUiLCJwIiwicmVtb3ZlIiwiZGVsIiwic2Nsb3NlIiwiY2hhbm5lbFJlc2V0Iiwic2NoYW5uZWxSZXNldCIsImNhbGwiLCJyb3V0aW5lIiwiYXJncyIsIkNBTExfUk9VVElORSIsImZvcmsiLCJGT1JLX1JPVVRJTkUiLCJtZXJnZSIsIm5ld0NoIiwidGFrZXIiLCJ0aW1lb3V0IiwiaW50ZXJ2YWwiLCJzZXRUaW1lb3V0IiwiaXNDaGFubmVsIiwiaXNSaWV3IiwiciIsImlzU3RhdGUiLCJpc1JvdXRpbmUiLCJ2ZXJpZnlDaGFubmVsIiwidGhyb3dFcnJvciIsImdvIiwiZnVuYyIsIlJVTk5JTkciLCJTVE9QUEVEIiwiZ2V0RnVuY05hbWUiLCJjaGlsZHJlbiIsInN0b3AiLCJyZXJ1biIsImdlbiIsIm5leHQiLCJhZGRTdWJSb3V0aW5lIiwicHJvY2Vzc0dlbmVyYXRvclN0ZXAiLCJpIiwibmV4dEFyZ3MiLCJTTEVFUCIsIm1zIiwiU1RPUCIsInN0ZXAiLCJpc1Byb21pc2UiLCJ0aGVuIiwiYXN5bmNSZXN1bHQiLCJjYXRjaCIsImVyciIsInRocm93Iiwid2l0aCIsIm1hcHMiLCJyZWR1Y2VkTWFwcyIsInVzZSIsInNsZWVwIiwiREVGQVVMVF9TRUxFQ1RPUiIsIkRFRkFVTFRfUkVEVUNFUiIsIl8iLCJERUZBVUxUX0VSUk9SIiwiZSIsImluaXRpYWxWYWx1ZSIsInN5bmNDaGlsZHJlbiIsImluaXRpYXRvciIsImMiLCJzeW5jaW5nIiwic2VsZWN0b3IiLCJyZWR1Y2VyIiwib25FcnJvciIsImlzR2VuZXJhdG9yRnVuY3Rpb24iLCJyb3V0aW5lUmVzIiwicGF5bG9hZCIsImdlblJlc3VsdCIsInNlbGVjdCIsIm11dGF0ZSIsImRlc3Ryb3kiLCJnZXQiLCJuZXdWYWx1ZSIsIkRFRkFVTFQiLCJBcnJheSIsImlzQXJyYXkiLCJ1c2VyVGFrZUNhbGxiYWNrIiwiR3JpZCIsImdyaWRBUEkiLCJub2RlcyIsInByb2R1Y3QiLCJnZXROb2RlQnlJZCIsIm5vZGVJZCIsImZpbmQiLCJTeW1ib2wiLCJnZXRBbGwiLCJiIiwicmVhY3QiLCJyaWV3IiwicmVhY3RSaWV3IiwiUiIsInByb2R1Y2UiLCJ3aGF0ZXZlciIsImRlZmluZVByb2R1Y3QiLCJMb2dnZXIiLCJyZXNldElkcyIsInJlZ2lzdHJ5IiwiZ2V0Q2hhbm5lbCIsImluc3BlY3RvciIsImluc3AiLCJpc0RlZmluZWQiLCJ3aGF0IiwiZ2V0T3JpZ2luIiwibG9jYXRpb24iLCJwcm90b2NvbCIsImhvc3QiLCJsb2dTbmFwc2hvdHNUb0NvbnNvbGUiLCJlbmFibGUiLCJvbiIsInNuYXBzaG90Iiwid2luZG93IiwiY29uc29sZSIsInBvc3RNZXNzYWdlIiwidHlwZSIsInNvdXJjZSIsIm9yaWdpbiIsInRpbWUiLCJEYXRlIiwiZ2V0VGltZSIsIlJJRVciLCJTVEFURSIsIkNIQU5ORUwiLCJST1VUSU5FIiwibm9ybWFsaXplUmlldyIsInZpZXdEYXRhIiwic2FuaXRpemUiLCJyZW5kZXJlciIsImRhdGEiLCJjaGlsZCIsIm5vcm1hbGl6ZVN0YXRlIiwibm9ybWFsaXplQ2hhbm5lbCIsIm5vcm1hbGl6ZVJvdXRpbmUiLCJ3YXJuIiwibyIsImZyYW1lcyIsImluUHJvZ3Jlc3MiLCJlbmFibGVkIiwibGlzdGVuZXJzIiwibGlzdGVuZXIiLCJ3aG8iLCJtZXRhIiwiUHJvbWlzZSIsInJlc29sdmUiLCJmcmFtZSIsImwiLCJhY3Rpb25zIiwibm93IiwiZGlzYWJsZSIsImFjdGlvbiIsIlZpZXciLCJyb3V0aW5lcyIsImNyZWF0ZUJyaWRnZSIsImV4dGVybmFscyIsImNvbXAiLCJvdXRlclByb3BzIiwiaW5zdGFuY2UiLCJzZXRJbnN0YW5jZSIsInVzZVN0YXRlIiwiY29udGVudCIsInNldENvbnRlbnQiLCJtb3VudGVkIiwidXNlUmVmIiwidXNlRWZmZWN0IiwidXBkYXRlIiwibmFtZWRSaWV3IiwicHJvcHMiLCJtb3VudCIsImN1cnJlbnQiLCJ1bm1vdW50IiwiUmVhY3QiLCJjcmVhdGVFbGVtZW50IiwiZGlzcGxheU5hbWUiLCJSZWdpc3RyeSIsInByb2R1Y3RzIiwidW5kZWZpbmVQcm9kdWN0IiwiZGVidWciLCJwcm9kdWN0TmFtZXMiLCJPYmplY3QiLCJrZXlzIiwiUmVuZGVyZXIiLCJwdXNoRGF0YVRvVmlldyIsImFjdGl2ZSIsIm5ld0RhdGEiLCJhY2N1bXVsYXRlIiwidmlld0Z1bmMiLCJjbGVhbnVwcyIsInN1YnNjcmlwdGlvbnMiLCJhZGRDaGlsZCIsIlN0YXRlIiwibiIsIlNsaWRpbmciLCJGaXhlZCIsIkRyb3BwaW5nIiwiVklFV19DSEFOTkVMIiwiUFJPUFNfQ0hBTk5FTCIsIm5vcm1hbGl6ZVJlbmRlckRhdGEiLCJvYmoiLCJyZXF1aXJlT2JqZWN0IiwibmV3UHJvcHMiLCJjb25jYXQiLCJyZW5kZXIiLCJpc09iamVjdEVtcHR5Iiwic3ViSWQiLCJfX3NldEV4dGVybmFscyIsInRlc3QiLCJuZXdJbnN0YW5jZSIsInNvbWV0aGluZyIsInNob3dFcnJvckluQ29uc29sZSIsIkpTT04iLCJwYXJzZSIsIkNpcmN1bGFySlNPTiIsInN0cmluZ2lmeSIsIlNlcmlhbGl6ZUVycm9yIiwiZXJyb3IiLCJzcGVjaWFsQ2hhciIsInNhZmVTcGVjaWFsQ2hhciIsImNoYXJDb2RlQXQiLCJ0b1N0cmluZyIsInNsaWNlIiwiZXNjYXBlZFNhZmVTcGVjaWFsQ2hhciIsInNwZWNpYWxDaGFyUkciLCJSZWdFeHAiLCJzYWZlU3BlY2lhbENoYXJSRyIsInNhZmVTdGFydFdpdGhTcGVjaWFsQ2hhclJHIiwiaW5kZXhPZiIsIiRTdHJpbmciLCJTdHJpbmciLCJnZW5lcmF0ZVJlcGxhY2VyIiwicmVwbGFjZXIiLCJpbnNwZWN0IiwicGF0aCIsImFsbCIsInNlZW4iLCJtYXBwIiwibGFzdCIsImx2bCIsImZuIiwicmVwbGFjZSIsImpvaW4iLCJyZXRyaWV2ZUZyb21QYXRoIiwiZ2VuZXJhdGVSZXZpdmVyIiwicmV2aXZlciIsImlzU3RyaW5nIiwiY2hhckF0IiwicmVnZW5lcmF0ZSIsInJlZ2VuZXJhdGVBcnJheSIsInJvb3QiLCJyZXRyaWV2ZSIsInJlZ2VuZXJhdGVPYmplY3QiLCJoYXNPd25Qcm9wZXJ0eSIsInNwbGl0Iiwic3RyaW5naWZ5UmVjdXJzaW9uIiwic3BhY2UiLCJkb05vdFJlc29sdmUiLCJwYXJzZVJlY3Vyc2lvbiIsInRleHQiLCJtb2R1bGUiLCJleHBvcnRzIiwiZGVzdHJveUNpcmN1bGFyIiwiZnJvbSIsIm1lc3NhZ2UiLCJzdGFjayIsImV4ZWMiLCJpZHMiLCJwcmVmaXgiLCJwcm9wIiwiaXNPYmplY3RMaXRlcmFsIiwiY29uc3RydWN0b3IiLCJpc0dlbmVyYXRvciIsInByb3RvdHlwZSIsInByb3BOYW1lIiwiZGVmaW5lUHJvcGVydHkiLCJ3cml0YWJsZSIsInRvTG93ZXJDYXNlIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxrREFBMEMsZ0NBQWdDO0FBQzFFO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZ0VBQXdELGtCQUFrQjtBQUMxRTtBQUNBLHlEQUFpRCxjQUFjO0FBQy9EOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpREFBeUMsaUNBQWlDO0FBQzFFLHdIQUFnSCxtQkFBbUIsRUFBRTtBQUNySTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOzs7QUFHQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDbEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSxnQ0FBZ0M7QUFDaEM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGlCQUFpQixRQUFRO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSCxrQ0FBa0M7QUFDbEM7QUFDQTtBQUNBOztBQUVBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGdCQUFnQixzQkFBc0I7QUFDdEM7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esa0JBQWtCLG9CQUFvQjtBQUN0QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7OztBQ3pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRWE7O0FBRWI7O0FBRUEsSUFBSSxJQUFxQztBQUN6Qyw2QkFBNkIsbUJBQU8sQ0FBQyw2RkFBNEI7QUFDakU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxPQUFPO0FBQ2xCLFdBQVcsT0FBTztBQUNsQixXQUFXLE9BQU87QUFDbEIsV0FBVyxPQUFPO0FBQ2xCLFdBQVcsVUFBVTtBQUNyQjtBQUNBO0FBQ0E7QUFDQSxNQUFNLElBQXFDO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0R0FBNEc7QUFDNUc7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyREFBMkQ7QUFDM0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNLElBQXFDO0FBQzNDO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7OztBQ3JHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRWE7O0FBRWI7O0FBRUE7Ozs7Ozs7Ozs7Ozs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVhOzs7O0FBSWIsSUFBSSxJQUFxQztBQUN6QztBQUNBOztBQUVBLGNBQWMsbUJBQU8sQ0FBQyxnRUFBZTtBQUNyQyxxQkFBcUIsbUJBQU8sQ0FBQyxrRkFBMkI7O0FBRXhEOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLHNGQUFzRixhQUFhO0FBQ25HO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRGQUE0RixlQUFlO0FBQzNHO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxzRkFBc0YsYUFBYTtBQUNuRztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscU9BQXFPO0FBQ3JPO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLFdBQVc7QUFDeEIsY0FBYyxRQUFRO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxXQUFXO0FBQ3hCLGFBQWEsVUFBVTtBQUN2QixhQUFhLFFBQVE7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxXQUFXO0FBQ3hCLGFBQWEsT0FBTztBQUNwQixhQUFhLFVBQVU7QUFDdkIsYUFBYSxRQUFRO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLFdBQVc7QUFDeEIsYUFBYSxPQUFPO0FBQ3BCLGFBQWEsVUFBVTtBQUN2QixhQUFhLFFBQVE7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsZ0JBQWdCO0FBQzNCO0FBQ0EsV0FBVyxVQUFVO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFVBQVU7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7O0FBR0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLHNGQUFzRixhQUFhO0FBQ25HO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxFQUFFO0FBQ2IsV0FBVyxFQUFFO0FBQ2IsV0FBVyxFQUFFO0FBQ2IsV0FBVyxjQUFjO0FBQ3pCLFdBQVcsRUFBRTtBQUNiLFdBQVcsRUFBRTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxFQUFFO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxXQUFXLEVBQUU7QUFDYixXQUFXLE9BQU87QUFDbEIsV0FBVyxPQUFPO0FBQ2xCOzs7QUFHQTtBQUNBO0FBQ0EsV0FBVyxFQUFFO0FBQ2IsV0FBVyxPQUFPO0FBQ2xCLFdBQVcsT0FBTztBQUNsQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0EsbUJBQW1CLG9CQUFvQjtBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDs7QUFFQTtBQUNBLHdCQUF3Qjs7QUFFeEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBLG1CQUFtQixvQkFBb0I7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFFBQVE7QUFDbkIsWUFBWSxRQUFR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OztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CLFlBQVksYUFBYTtBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCO0FBQzFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztB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Q3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTSxLQUFJO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTSxLQUFJO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7OztBQUdBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOzs7QUFHQSxrREFBa0Q7OztBQUdsRDs7O0FBR0E7OztBQUdBO0FBQ0E7O0FBRUE7OztBQUdBOzs7QUFHQTs7O0FBR0E7QUFDQTs7O0FBR0E7QUFDQTs7Ozs7QUFLQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOzs7QUFHQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQUlBO0FBQ0E7QUFDQSxDQUFDOztBQUVEOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEdBQUc7QUFDSDs7Ozs7Ozs7Ozs7OztBQzFyRWE7O0FBRWIsSUFBSSxLQUFxQyxFQUFFLEVBRTFDO0FBQ0QsbUJBQW1CLG1CQUFPLENBQUMscUZBQTRCO0FBQ3ZEOzs7Ozs7Ozs7Ozs7O0FDTkE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBRUEsTUFBTUEsZUFBZSxHQUFHO0FBQUVDLFVBQVEsRUFBRSxLQUFaO0FBQW1CQyxTQUFPLEVBQUU7QUFBNUIsQ0FBeEI7O0FBQ0EsTUFBTUMsSUFBSSxHQUFHLENBQUNDLENBQUQsRUFBSUMsRUFBSixLQUFXQSxFQUFFLENBQUNELENBQUQsQ0FBMUI7O0FBRUEsU0FBU0UsU0FBVCxDQUFtQkMsSUFBSSxHQUFHLENBQTFCLEVBQTZCO0FBQUVOLFVBQUY7QUFBWUM7QUFBWixJQUF3QkYsZUFBckQsRUFBc0U7QUFDcEUsUUFBTVEsR0FBRyxHQUFHO0FBQ1ZDLFNBQUssRUFBRSxFQURHO0FBRVZDLFFBQUksRUFBRSxFQUZJO0FBR1ZDLFNBQUssRUFBRSxFQUhHO0FBSVZDLFNBQUssRUFBRTtBQUNMQyxlQUFTLEVBQUVWLElBRE47QUFFTFcsY0FBUSxFQUFFWCxJQUZMO0FBR0xZLGdCQUFVLEVBQUVaLElBSFA7QUFJTGEsZUFBUyxFQUFFYjtBQUpOLEtBSkc7QUFVVmMsVUFBTSxFQUFFLElBVkU7QUFXVmhCLFlBWFU7QUFZVkM7QUFaVSxHQUFaOztBQWVBTSxLQUFHLENBQUNLLFNBQUosR0FBZ0JLLElBQUksSUFBS1YsR0FBRyxDQUFDSSxLQUFKLENBQVVDLFNBQVYsR0FBc0JLLElBQS9DOztBQUNBVixLQUFHLENBQUNNLFFBQUosR0FBZUksSUFBSSxJQUFLVixHQUFHLENBQUNJLEtBQUosQ0FBVUUsUUFBVixHQUFxQkksSUFBN0M7O0FBQ0FWLEtBQUcsQ0FBQ08sVUFBSixHQUFpQkcsSUFBSSxJQUFLVixHQUFHLENBQUNJLEtBQUosQ0FBVUcsVUFBVixHQUF1QkcsSUFBakQ7O0FBQ0FWLEtBQUcsQ0FBQ1EsU0FBSixHQUFnQkUsSUFBSSxJQUFLVixHQUFHLENBQUNJLEtBQUosQ0FBVUksU0FBVixHQUFzQkUsSUFBL0M7O0FBQ0FWLEtBQUcsQ0FBQ1csT0FBSixHQUFjLE1BQU1YLEdBQUcsQ0FBQ0MsS0FBSixDQUFVVyxNQUFWLEtBQXFCLENBQXpDOztBQUNBWixLQUFHLENBQUNhLEtBQUosR0FBWSxNQUFNO0FBQ2hCYixPQUFHLENBQUNDLEtBQUosR0FBWSxFQUFaO0FBQ0FELE9BQUcsQ0FBQ0UsSUFBSixHQUFXLEVBQVg7QUFDQUYsT0FBRyxDQUFDRyxLQUFKLEdBQVksRUFBWjtBQUNBSCxPQUFHLENBQUNJLEtBQUosR0FBWTtBQUNWQyxlQUFTLEVBQUVWLElBREQ7QUFFVlcsY0FBUSxFQUFFWCxJQUZBO0FBR1ZZLGdCQUFVLEVBQUVaLElBSEY7QUFJVmEsZUFBUyxFQUFFYjtBQUpELEtBQVo7QUFNRCxHQVZEOztBQVdBSyxLQUFHLENBQUNjLFFBQUosR0FBZWxCLENBQUMsSUFBSTtBQUNsQkksT0FBRyxDQUFDQyxLQUFKLEdBQVlMLENBQVo7QUFDRCxHQUZEOztBQUdBSSxLQUFHLENBQUNlLFFBQUosR0FBZSxNQUFNZixHQUFHLENBQUNDLEtBQXpCOztBQUNBRCxLQUFHLENBQUNnQixlQUFKLEdBQXNCLE1BQ3BCaEIsR0FBRyxDQUFDRyxLQUFKLENBQVVjLE1BQVYsQ0FDRSxDQUFDQyxHQUFELEVBQU1DLE9BQU4sS0FBa0I7QUFDaEJELE9BQUcsQ0FBQ0MsT0FBTyxDQUFDQyxPQUFSLENBQWdCQyxJQUFoQixHQUF1QixTQUF2QixHQUFtQyxRQUFwQyxDQUFILENBQWlEQyxJQUFqRCxDQUFzREgsT0FBdEQ7QUFDQSxXQUFPRCxHQUFQO0FBQ0QsR0FKSCxFQUtFO0FBQ0VLLFdBQU8sRUFBRSxFQURYO0FBRUVDLFVBQU0sRUFBRTtBQUZWLEdBTEYsQ0FERjs7QUFXQXhCLEtBQUcsQ0FBQ3lCLFdBQUosR0FBa0IsQ0FBQ04sT0FBRCxFQUFVbEIsS0FBVixLQUFvQjtBQUNwQyxRQUFJLENBQUNrQixPQUFPLENBQUNDLE9BQVIsQ0FBZ0JNLE1BQXJCLEVBQTZCO0FBQzNCLFlBQU1DLEdBQUcsR0FBRzNCLEdBQUcsQ0FBQ0csS0FBSixDQUFVeUIsU0FBVixDQUFvQkMsQ0FBQyxJQUFJQSxDQUFDLEtBQUtWLE9BQS9CLENBQVo7QUFDQSxVQUFJUSxHQUFHLElBQUksQ0FBWCxFQUFjM0IsR0FBRyxDQUFDRyxLQUFKLENBQVUyQixNQUFWLENBQWlCSCxHQUFqQixFQUFzQixDQUF0QjtBQUNmOztBQUNEUixXQUFPLENBQUNZLFFBQVIsQ0FBaUI5QixLQUFqQjtBQUNELEdBTkQ7O0FBT0FELEtBQUcsQ0FBQ2dDLFdBQUosR0FBa0JuQyxFQUFFLElBQUk7QUFDdEIsVUFBTThCLEdBQUcsR0FBRzNCLEdBQUcsQ0FBQ0csS0FBSixDQUFVeUIsU0FBVixDQUFvQixDQUFDO0FBQUVHO0FBQUYsS0FBRCxLQUFrQkEsUUFBUSxLQUFLbEMsRUFBbkQsQ0FBWjs7QUFDQSxRQUFJOEIsR0FBRyxJQUFJLENBQVgsRUFBYztBQUNaM0IsU0FBRyxDQUFDRyxLQUFKLENBQVUyQixNQUFWLENBQWlCSCxHQUFqQixFQUFzQixDQUF0QjtBQUNEO0FBQ0YsR0FMRDs7QUFNQTNCLEtBQUcsQ0FBQ2lDLGVBQUosR0FBc0IsTUFBTTtBQUMxQmpDLE9BQUcsQ0FBQ0csS0FBSixHQUFZSCxHQUFHLENBQUNHLEtBQUosQ0FBVStCLE1BQVYsQ0FBaUIsQ0FBQztBQUFFZDtBQUFGLEtBQUQsS0FBaUIsQ0FBQ0EsT0FBTyxDQUFDTSxNQUEzQyxDQUFaO0FBQ0QsR0FGRDs7QUFJQTFCLEtBQUcsQ0FBQ2MsUUFBSixHQUFlbEIsQ0FBQyxJQUFLSSxHQUFHLENBQUNDLEtBQUosR0FBWUwsQ0FBakM7O0FBRUEsUUFBTXVDLEdBQUcsR0FBRyxDQUFDQyxJQUFELEVBQU9MLFFBQVAsS0FBb0I7QUFDOUIsVUFBTTtBQUFFUixhQUFGO0FBQVdDO0FBQVgsUUFBc0J4QixHQUFHLENBQUNnQixlQUFKLEVBQTVCLENBRDhCLENBRTlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBOztBQUNBTyxXQUFPLENBQUNjLE9BQVIsQ0FBZ0JDLE1BQU0sSUFBSXRDLEdBQUcsQ0FBQ3lCLFdBQUosQ0FBZ0JhLE1BQWhCLEVBQXdCRixJQUF4QixDQUExQixFQVY4QixDQVk5Qjs7QUFDQSxRQUFJWixNQUFNLENBQUNaLE1BQVAsR0FBZ0IsQ0FBcEIsRUFBdUI7QUFDckJaLFNBQUcsQ0FBQ3lCLFdBQUosQ0FBZ0JELE1BQU0sQ0FBQyxDQUFELENBQXRCLEVBQTJCWSxJQUEzQjtBQUNBTCxjQUFRLENBQUMsSUFBRCxDQUFSO0FBQ0QsS0FIRCxNQUdPO0FBQ0wsVUFBSS9CLEdBQUcsQ0FBQ0MsS0FBSixDQUFVVyxNQUFWLEdBQW1CYixJQUF2QixFQUE2QjtBQUMzQkMsV0FBRyxDQUFDQyxLQUFKLENBQVVxQixJQUFWLENBQWVjLElBQWY7QUFDQUwsZ0JBQVEsQ0FBQyxJQUFELENBQVI7QUFDQTtBQUNEOztBQUNELFVBQUl0QyxRQUFKLEVBQWM7QUFDWnNDLGdCQUFRLENBQUMsS0FBRCxDQUFSO0FBQ0E7QUFDRDs7QUFDRCxVQUFJckMsT0FBSixFQUFhO0FBQ1hNLFdBQUcsQ0FBQ0MsS0FBSixDQUFVc0MsS0FBVjtBQUNBdkMsV0FBRyxDQUFDQyxLQUFKLENBQVVxQixJQUFWLENBQWVjLElBQWY7QUFDQUwsZ0JBQVEsQ0FBQyxJQUFELENBQVI7QUFDQTtBQUNEOztBQUNEL0IsU0FBRyxDQUFDRSxJQUFKLENBQVNvQixJQUFULENBQWM7QUFDWlMsZ0JBQVEsRUFBRW5DLENBQUMsSUFBSTtBQUNiSSxhQUFHLENBQUNDLEtBQUosQ0FBVXFCLElBQVYsQ0FBZWMsSUFBZjtBQUNBTCxrQkFBUSxDQUFDbkMsQ0FBQyxJQUFJLElBQU4sQ0FBUjtBQUNELFNBSlc7QUFLWndDO0FBTFksT0FBZDtBQU9EO0FBQ0YsR0F4Q0Q7O0FBMENBLFFBQU1JLElBQUksR0FBRyxDQUFDVCxRQUFELEVBQVdYLE9BQVgsS0FBdUI7QUFDbEM7QUFDQSxVQUFNcUIsU0FBUyxHQUFHLE1BQU07QUFDdEJ6QyxTQUFHLENBQUNHLEtBQUosQ0FBVW1CLElBQVYsQ0FBZTtBQUFFUyxnQkFBRjtBQUFZWDtBQUFaLE9BQWY7QUFDQSxhQUFPLE1BQU1wQixHQUFHLENBQUNnQyxXQUFKLENBQWdCRCxRQUFoQixDQUFiO0FBQ0QsS0FIRDs7QUFJQVgsV0FBTyxHQUFHc0IsK0RBQWdCLENBQUN0QixPQUFELENBQTFCOztBQUNBLFFBQUlBLE9BQU8sQ0FBQ00sTUFBWixFQUFvQjtBQUNsQk4sYUFBTyxDQUFDQyxJQUFSLEdBQWUsSUFBZjs7QUFDQSxVQUFJRCxPQUFPLENBQUN1QixXQUFaLEVBQXlCO0FBQ3ZCWixnQkFBUSxDQUFDL0IsR0FBRyxDQUFDQyxLQUFKLENBQVUsQ0FBVixDQUFELENBQVI7QUFDRDs7QUFDRCxhQUFPd0MsU0FBUyxFQUFoQjtBQUNEOztBQUNELFFBQUlyQixPQUFPLENBQUNDLElBQVosRUFBa0I7QUFDaEJVLGNBQVEsQ0FBQy9CLEdBQUcsQ0FBQ0MsS0FBSixDQUFVLENBQVYsQ0FBRCxDQUFSO0FBQ0E7QUFDRDs7QUFDRCxRQUFJRCxHQUFHLENBQUNDLEtBQUosQ0FBVVcsTUFBVixLQUFxQixDQUF6QixFQUE0QjtBQUMxQixVQUFJWixHQUFHLENBQUNFLElBQUosQ0FBU1UsTUFBVCxHQUFrQixDQUF0QixFQUF5QjtBQUN2QlosV0FBRyxDQUFDRSxJQUFKLENBQVNxQyxLQUFULEdBQWlCUixRQUFqQjtBQUNBQSxnQkFBUSxDQUFDL0IsR0FBRyxDQUFDQyxLQUFKLENBQVVzQyxLQUFWLEVBQUQsQ0FBUjtBQUNELE9BSEQsTUFHTztBQUNMLGVBQU9FLFNBQVMsRUFBaEI7QUFDRDtBQUNGLEtBUEQsTUFPTztBQUNMLFlBQU03QyxDQUFDLEdBQUdJLEdBQUcsQ0FBQ0MsS0FBSixDQUFVc0MsS0FBVixFQUFWO0FBQ0FSLGNBQVEsQ0FBQ25DLENBQUQsQ0FBUjs7QUFDQSxVQUFJSSxHQUFHLENBQUNDLEtBQUosQ0FBVVcsTUFBVixHQUFtQmIsSUFBbkIsSUFBMkJDLEdBQUcsQ0FBQ0UsSUFBSixDQUFTVSxNQUFULEdBQWtCLENBQWpELEVBQW9EO0FBQ2xEWixXQUFHLENBQUNFLElBQUosQ0FBU3FDLEtBQVQsR0FBaUJSLFFBQWpCO0FBQ0Q7QUFDRjs7QUFDRCxXQUFPLE1BQU0sQ0FBRSxDQUFmO0FBQ0QsR0FqQ0Q7O0FBbUNBL0IsS0FBRyxDQUFDbUMsR0FBSixHQUFVLENBQUNDLElBQUQsRUFBT0wsUUFBUCxLQUFvQjtBQUM1QmEsaURBQU0sQ0FBQ0MsR0FBUCxDQUFXN0MsR0FBRyxDQUFDUyxNQUFmLEVBQXVCLHVCQUF2QixFQUFnRDJCLElBQWhEO0FBQ0FwQyxPQUFHLENBQUNJLEtBQUosQ0FBVUMsU0FBVixDQUFvQitCLElBQXBCLEVBQTBCVSxhQUFhLElBQUk7QUFDekNYLFNBQUcsQ0FBQ1csYUFBRCxFQUFnQkMsUUFBUSxJQUN6Qi9DLEdBQUcsQ0FBQ0ksS0FBSixDQUFVRSxRQUFWLENBQW1CeUMsUUFBbkIsRUFBNkJDLFlBQVksSUFBSTtBQUMzQ0oscURBQU0sQ0FBQ0MsR0FBUCxDQUFXN0MsR0FBRyxDQUFDUyxNQUFmLEVBQXVCLHNCQUF2QixFQUErQ3VDLFlBQS9DO0FBQ0FqQixnQkFBUSxDQUFDaUIsWUFBRCxDQUFSO0FBQ0QsT0FIRCxDQURDLENBQUg7QUFNRCxLQVBEO0FBUUQsR0FWRDs7QUFXQWhELEtBQUcsQ0FBQ3dDLElBQUosR0FBVyxDQUFDVCxRQUFELEVBQVdYLE9BQVgsS0FBdUI7QUFDaEMsUUFBSTZCLFdBQVcsR0FBRyxNQUFNLENBQUUsQ0FBMUI7O0FBQ0FMLGlEQUFNLENBQUNDLEdBQVAsQ0FBVzdDLEdBQUcsQ0FBQ1MsTUFBZixFQUF1Qix3QkFBdkI7QUFDQVQsT0FBRyxDQUFDSSxLQUFKLENBQVVHLFVBQVYsQ0FDRTJDLFNBREYsRUFFRSxNQUNHRCxXQUFXLEdBQUdULElBQUksQ0FDakJXLFNBQVMsSUFDUG5ELEdBQUcsQ0FBQ0ksS0FBSixDQUFVSSxTQUFWLENBQW9CMkMsU0FBcEIsRUFBK0JDLGFBQWEsSUFBSTtBQUM5Q1IsbURBQU0sQ0FBQ0MsR0FBUCxDQUFXN0MsR0FBRyxDQUFDUyxNQUFmLEVBQXVCLHVCQUF2QixFQUFnRDJDLGFBQWhEO0FBQ0FyQixjQUFRLENBQUNxQixhQUFELENBQVI7QUFDRCxLQUhELENBRmUsRUFNakJoQyxPQU5pQixDQUh2QjtBQVlBLFdBQU8sTUFBTTZCLFdBQVcsRUFBeEI7QUFDRCxHQWhCRDs7QUFrQkEsU0FBT2pELEdBQVA7QUFDRDs7QUFFRCxNQUFNcUQsTUFBTSxHQUFHO0FBQ2JDLE9BQUssRUFBRSxDQUFDdkQsSUFBSSxHQUFHLENBQVIsS0FBY0QsU0FBUyxDQUFDQyxJQUFELEVBQU87QUFBRU4sWUFBUSxFQUFFLEtBQVo7QUFBbUJDLFdBQU8sRUFBRTtBQUE1QixHQUFQLENBRGpCO0FBRWJELFVBQVEsRUFBRSxDQUFDTSxJQUFJLEdBQUcsQ0FBUixLQUFjO0FBQ3RCLFFBQUlBLElBQUksR0FBRyxDQUFYLEVBQWM7QUFDWixZQUFNLElBQUl3RCxLQUFKLENBQVUsdURBQVYsQ0FBTjtBQUNEOztBQUNELFdBQU96RCxTQUFTLENBQUNDLElBQUQsRUFBTztBQUFFTixjQUFRLEVBQUUsSUFBWjtBQUFrQkMsYUFBTyxFQUFFO0FBQTNCLEtBQVAsQ0FBaEI7QUFDRCxHQVBZO0FBUWJBLFNBQU8sRUFBRSxDQUFDSyxJQUFJLEdBQUcsQ0FBUixLQUFjO0FBQ3JCLFFBQUlBLElBQUksR0FBRyxDQUFYLEVBQWM7QUFDWixZQUFNLElBQUl3RCxLQUFKLENBQVUsc0RBQVYsQ0FBTjtBQUNEOztBQUNELFdBQU96RCxTQUFTLENBQUNDLElBQUQsRUFBTztBQUFFTixjQUFRLEVBQUUsS0FBWjtBQUFtQkMsYUFBTyxFQUFFO0FBQTVCLEtBQVAsQ0FBaEI7QUFDRDtBQWJZLENBQWY7QUFnQmUyRCxxRUFBZixFOzs7Ozs7Ozs7Ozs7QUN0TUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUVlLFNBQVNHLElBQVQsQ0FBY0MsRUFBZCxFQUFrQkMsSUFBbEIsRUFBd0JqRCxNQUFNLEdBQUcsSUFBakMsRUFBdUM7QUFDcEQsTUFBSWtELEtBQUssR0FBR0MsMkNBQVo7QUFFQUgsSUFBRSxHQUFHQSxFQUFFLEdBQUdJLG9EQUFLLENBQUNKLEVBQUQsQ0FBUixHQUFlSSxvREFBSyxDQUFDLElBQUQsQ0FBM0I7QUFDQUgsTUFBSSxHQUFHQSxJQUFJLElBQUlMLDRDQUFNLENBQUNDLEtBQVAsRUFBZjs7QUFFQSxNQUFJUSwrQ0FBUSxDQUFDQyxNQUFULENBQWdCTixFQUFoQixDQUFKLEVBQXlCO0FBQ3ZCLFVBQU0sSUFBSUYsS0FBSixDQUFXLG9CQUFtQkUsRUFBRyxtQkFBakMsQ0FBTjtBQUNEOztBQUVELFFBQU1PLE9BQU8sR0FBRyxVQUFTQyxHQUFULEVBQWNDLElBQWQsRUFBb0I7QUFDbEMsUUFBSUQsR0FBRyxDQUFDckQsTUFBSixHQUFhLENBQWpCLEVBQW9CO0FBQ2xCdUQsNERBQU8sQ0FBQ0gsT0FBRCxFQUFVLE1BQVYsRUFBa0JDLEdBQUcsQ0FBQyxDQUFELENBQUgsR0FBU0MsSUFBVCxHQUFnQkQsR0FBRyxDQUFDLENBQUQsQ0FBckMsQ0FBUDtBQUNELEtBRkQsTUFFTztBQUNMRSw0REFBTyxDQUFDSCxPQUFELEVBQVUsTUFBVixFQUFrQkMsR0FBRyxDQUFDLENBQUQsQ0FBckIsQ0FBUDtBQUNEOztBQUNEckIsaURBQU0sQ0FBQ3dCLFVBQVAsQ0FBa0JKLE9BQU8sQ0FBQ1AsRUFBMUIsRUFBOEJPLE9BQU8sQ0FBQ0UsSUFBdEM7QUFDQSxXQUFPRixPQUFQO0FBQ0QsR0FSRDs7QUFTQUEsU0FBTyxDQUFDUCxFQUFSLEdBQWFBLEVBQWI7QUFDQU8sU0FBTyxDQUFDLFVBQUQsQ0FBUCxHQUFzQixJQUF0QjtBQUNBQSxTQUFPLENBQUN2RCxNQUFSLEdBQWlCQSxNQUFqQjtBQUNBLFFBQU1ULEdBQUcsR0FBRzhELCtDQUFRLENBQUNPLEdBQVQsQ0FBYVosRUFBYixFQUFpQk8sT0FBakIsQ0FBWjtBQUVBTixNQUFJLENBQUNqRCxNQUFMLEdBQWNULEdBQWQ7O0FBRUFBLEtBQUcsQ0FBQ3NFLFFBQUosR0FBZSxNQUFNdEUsR0FBRyxDQUFDMkQsS0FBSixPQUFnQkMsMkNBQXJDOztBQUNBNUQsS0FBRyxDQUFDMEQsSUFBSixHQUFXQSxJQUFYOztBQUNBMUQsS0FBRyxDQUFDMkQsS0FBSixHQUFZWSxDQUFDLElBQUk7QUFDZixRQUFJLE9BQU9BLENBQVAsS0FBYSxXQUFqQixFQUE4QlosS0FBSyxHQUFHWSxDQUFSO0FBQzlCLFdBQU9aLEtBQVA7QUFDRCxHQUhEOztBQUlBM0QsS0FBRyxDQUFDQyxLQUFKLEdBQVksTUFBTXlELElBQUksQ0FBQzNDLFFBQUwsRUFBbEI7O0FBQ0FmLEtBQUcsQ0FBQ0ssU0FBSixHQUFnQnFELElBQUksQ0FBQ3JELFNBQXJCO0FBQ0FMLEtBQUcsQ0FBQ00sUUFBSixHQUFlb0QsSUFBSSxDQUFDcEQsUUFBcEI7QUFDQU4sS0FBRyxDQUFDTyxVQUFKLEdBQWlCbUQsSUFBSSxDQUFDbkQsVUFBdEI7QUFDQVAsS0FBRyxDQUFDUSxTQUFKLEdBQWdCa0QsSUFBSSxDQUFDbEQsU0FBckI7O0FBQ0FSLEtBQUcsQ0FBQ3dFLFFBQUosR0FBZUMsR0FBRyxJQUFJQyx1REFBUSxDQUFDRCxHQUFELEVBQU16RSxHQUFOLENBQTlCOztBQUNBMkUsNkNBQUksQ0FBQ0MsR0FBTCxDQUFTNUUsR0FBVDtBQUNBNEMsK0NBQU0sQ0FBQ0MsR0FBUCxDQUFXN0MsR0FBWCxFQUFnQixpQkFBaEIsRUFBbUNBLEdBQUcsQ0FBQ0MsS0FBSixFQUFuQztBQUVBLFNBQU9ELEdBQVA7QUFDRCxDOzs7Ozs7Ozs7Ozs7QUM5Q0Q7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBcUJBO0FBQ0E7O0FBRUEsTUFBTTZFLElBQUksR0FBRyxNQUFNLENBQUUsQ0FBckI7O0FBQ0EsTUFBTUMsR0FBRyxHQUFHLEVBQVosQyxDQUVBOztBQUVBQSxHQUFHLENBQUNDLElBQUosR0FBVyxTQUFTQSxJQUFULENBQWNDLFFBQWQsRUFBd0I1QyxJQUFJLEdBQUcsSUFBL0IsRUFBcUNMLFFBQVEsR0FBRzhDLElBQWhELEVBQXNEO0FBQy9ERyxVQUFRLEdBQUdDLGdFQUFpQixDQUFDRCxRQUFELENBQTVCO0FBQ0EsUUFBTUUsTUFBTSxHQUFHRixRQUFRLENBQUNHLEdBQVQsQ0FBYSxNQUFNQyw4Q0FBbkIsQ0FBZjs7QUFDQSxRQUFNQyxTQUFTLEdBQUcsQ0FBQzFELEdBQUQsRUFBTTFCLEtBQU4sS0FBZ0I7QUFDaENpRixVQUFNLENBQUN2RCxHQUFELENBQU4sR0FBYzFCLEtBQWQ7O0FBQ0EsUUFBSSxDQUFDaUYsTUFBTSxDQUFDSSxRQUFQLENBQWdCRiw4Q0FBaEIsQ0FBTCxFQUErQjtBQUM3QnJELGNBQVEsQ0FBQ21ELE1BQU0sQ0FBQ3RFLE1BQVAsS0FBa0IsQ0FBbEIsR0FBc0JzRSxNQUFNLENBQUMsQ0FBRCxDQUE1QixHQUFrQ0EsTUFBbkMsQ0FBUjtBQUNEO0FBQ0YsR0FMRDs7QUFNQUYsVUFBUSxDQUFDM0MsT0FBVCxDQUFpQixDQUFDMkIsT0FBRCxFQUFVckMsR0FBVixLQUFrQjtBQUNqQyxVQUFNNEQsT0FBTyxHQUFHdkIsT0FBTyxDQUFDTCxLQUFSLEVBQWhCOztBQUNBLFFBQUk0QixPQUFPLEtBQUszQiwyQ0FBaEIsRUFBc0I7QUFDcEJ5QixlQUFTLENBQUMxRCxHQUFELEVBQU00RCxPQUFOLENBQVQ7QUFDRCxLQUZELE1BRU87QUFDTHZCLGFBQU8sQ0FBQ04sSUFBUixDQUFhdkIsR0FBYixDQUFpQkMsSUFBakIsRUFBdUJvRCxTQUFTLElBQUlILFNBQVMsQ0FBQzFELEdBQUQsRUFBTTZELFNBQU4sQ0FBN0M7QUFDRDtBQUNGLEdBUEQ7QUFRRCxDQWpCRDs7QUFrQkFWLEdBQUcsQ0FBQzNDLEdBQUosR0FBVSxTQUFTQSxHQUFULENBQWE2QyxRQUFiLEVBQXVCNUMsSUFBdkIsRUFBNkI7QUFDckMsU0FBTztBQUFFNEMsWUFBRjtBQUFZUyxNQUFFLEVBQUVDLDBDQUFoQjtBQUFxQnREO0FBQXJCLEdBQVA7QUFDRCxDQUZELEMsQ0FJQTs7O0FBRUEwQyxHQUFHLENBQUNhLEtBQUosR0FBWSxTQUFTQSxLQUFULENBQWVYLFFBQWYsRUFBeUJqRCxRQUF6QixFQUFtQ1gsT0FBbkMsRUFBNEM7QUFDdEQ0RCxVQUFRLEdBQUdDLGdFQUFpQixDQUFDRCxRQUFELENBQTVCO0FBQ0E1RCxTQUFPLEdBQUdzQiwrREFBZ0IsQ0FBQ3RCLE9BQUQsQ0FBMUI7QUFDQVcsVUFBUSxHQUFHNkQsMERBQVcsQ0FBQzdELFFBQUQsQ0FBdEI7QUFDQSxNQUFJOEQsYUFBSjs7QUFDQSxNQUFJekUsT0FBTyxDQUFDMEUsUUFBUixLQUFxQkMsbURBQXpCLEVBQXVDO0FBQ3JDLFVBQU1iLE1BQU0sR0FBR0YsUUFBUSxDQUFDRyxHQUFULENBQWEsTUFBTUMsOENBQW5CLENBQWY7O0FBQ0EsVUFBTUMsU0FBUyxHQUFHLENBQUMxRCxHQUFELEVBQU0xQixLQUFOLEtBQWdCO0FBQ2hDaUYsWUFBTSxDQUFDdkQsR0FBRCxDQUFOLEdBQWMxQixLQUFkOztBQUNBLFVBQUksQ0FBQ2lGLE1BQU0sQ0FBQ0ksUUFBUCxDQUFnQkYsOENBQWhCLENBQUwsRUFBK0I7QUFDN0JyRCxnQkFBUSxDQUFDbUQsTUFBTSxDQUFDdEUsTUFBUCxLQUFrQixDQUFsQixHQUFzQnNFLE1BQU0sQ0FBQyxDQUFELENBQTVCLEdBQWtDLENBQUMsR0FBR0EsTUFBSixDQUFuQyxDQUFSO0FBQ0Q7QUFDRixLQUxEOztBQU1BVyxpQkFBYSxHQUFHYixRQUFRLENBQUNHLEdBQVQsQ0FBYSxDQUFDbkIsT0FBRCxFQUFVckMsR0FBVixLQUFrQjtBQUM3QyxZQUFNNEQsT0FBTyxHQUFHdkIsT0FBTyxDQUFDTCxLQUFSLEVBQWhCOztBQUNBLFVBQUk0QixPQUFPLEtBQUtTLDRDQUFoQixFQUF1QjtBQUNyQlgsaUJBQVMsQ0FBQzFELEdBQUQsRUFBTTRELE9BQU4sQ0FBVDtBQUNELE9BRkQsTUFFTyxJQUFJQSxPQUFPLEtBQUtVLDZDQUFaLElBQXNCakMsT0FBTyxDQUFDTixJQUFSLENBQWEvQyxPQUFiLEVBQTFCLEVBQWtEO0FBQ3ZEcUQsZUFBTyxDQUFDTCxLQUFSLENBQWNxQyw0Q0FBZDtBQUNBWCxpQkFBUyxDQUFDMUQsR0FBRCxFQUFNcUUsNENBQU4sQ0FBVDtBQUNELE9BSE0sTUFHQTtBQUNMLGVBQU9oQyxPQUFPLENBQUNOLElBQVIsQ0FBYWxCLElBQWIsQ0FDTDBELFVBQVUsSUFBSWIsU0FBUyxDQUFDMUQsR0FBRCxFQUFNdUUsVUFBTixDQURsQixFQUVMOUUsT0FGSyxDQUFQO0FBSUQ7QUFDRixLQWJlLENBQWhCO0FBY0QsR0F0QkQsTUFzQk8sSUFBSUEsT0FBTyxDQUFDMEUsUUFBUixLQUFxQkssNkNBQXpCLEVBQWlDO0FBQ3RDLFVBQU1DLElBQUksR0FBRyxDQUFDLEdBQUdGLFVBQUosS0FBbUI7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFJLENBQUM5RSxPQUFPLENBQUNNLE1BQWIsRUFBcUI7QUFDbkJtRSxxQkFBYSxDQUFDM0QsTUFBZCxDQUFxQm1FLENBQUMsSUFBSUEsQ0FBMUIsRUFBNkJoRSxPQUE3QixDQUFxQ2dFLENBQUMsSUFBSUEsQ0FBQyxFQUEzQztBQUNEOztBQUNEdEUsY0FBUSxDQUFDLEdBQUdtRSxVQUFKLENBQVI7QUFDRCxLQVREOztBQVVBTCxpQkFBYSxHQUFHYixRQUFRLENBQUNHLEdBQVQsQ0FBYSxDQUFDbkIsT0FBRCxFQUFVckMsR0FBVixLQUFrQjtBQUM3QyxZQUFNNEQsT0FBTyxHQUFHdkIsT0FBTyxDQUFDTCxLQUFSLEVBQWhCOztBQUNBLFVBQUk0QixPQUFPLEtBQUtTLDRDQUFoQixFQUF1QjtBQUNyQkksWUFBSSxDQUFDYixPQUFELEVBQVU1RCxHQUFWLENBQUo7QUFDRCxPQUZELE1BRU8sSUFBSTRELE9BQU8sS0FBS1UsNkNBQVosSUFBc0JqQyxPQUFPLENBQUNOLElBQVIsQ0FBYS9DLE9BQWIsRUFBMUIsRUFBa0Q7QUFDdkRxRCxlQUFPLENBQUNMLEtBQVIsQ0FBY3FDLDRDQUFkO0FBQ0FJLFlBQUksQ0FBQ0osNENBQUQsRUFBUXJFLEdBQVIsQ0FBSjtBQUNELE9BSE0sTUFHQTtBQUNMLGVBQU9xQyxPQUFPLENBQUNOLElBQVIsQ0FBYWxCLElBQWIsQ0FBa0IwRCxVQUFVLElBQUlFLElBQUksQ0FBQ0YsVUFBRCxFQUFhdkUsR0FBYixDQUFwQyxFQUF1RFAsT0FBdkQsQ0FBUDtBQUNEO0FBQ0YsS0FWZSxDQUFoQjtBQVdELEdBdEJNLE1Bc0JBO0FBQ0wsVUFBTSxJQUFJbUMsS0FBSixDQUFXLDBCQUF5Qm5DLE9BQU8sQ0FBQzBFLFFBQVMsR0FBckQsQ0FBTjtBQUNEOztBQUNELFNBQU8sU0FBUzdDLFdBQVQsR0FBdUI7QUFDNUI0QyxpQkFBYSxDQUFDM0QsTUFBZCxDQUFxQm1FLENBQUMsSUFBSUEsQ0FBMUIsRUFBNkJoRSxPQUE3QixDQUFxQ2dFLENBQUMsSUFBSUEsQ0FBQyxFQUEzQztBQUNELEdBRkQ7QUFHRCxDQXZERDs7QUF3REF2QixHQUFHLENBQUN0QyxJQUFKLEdBQVcsU0FBU0EsSUFBVCxDQUFjd0MsUUFBZCxFQUF3QjVELE9BQXhCLEVBQWlDO0FBQzFDLFNBQU87QUFBRTRELFlBQUY7QUFBWVMsTUFBRSxFQUFFYSwyQ0FBaEI7QUFBc0JsRjtBQUF0QixHQUFQO0FBQ0QsQ0FGRCxDLENBSUE7OztBQUVBMEQsR0FBRyxDQUFDekQsSUFBSixHQUFXLFNBQVNBLElBQVQsQ0FBYzJELFFBQWQsRUFBd0I1RCxPQUF4QixFQUFpQztBQUMxQyxTQUFPO0FBQUU0RCxZQUFGO0FBQVlTLE1BQUUsRUFBRWMsMkNBQWhCO0FBQXNCbkYsV0FBTyxFQUFFLEVBQUUsR0FBR0EsT0FBTDtBQUFjQyxVQUFJLEVBQUU7QUFBcEI7QUFBL0IsR0FBUDtBQUNELENBRkQ7O0FBR0F5RCxHQUFHLENBQUMwQixLQUFKLEdBQVksU0FBU0EsS0FBVCxDQUFleEIsUUFBZixFQUF5QnlCLEVBQXpCLEVBQTZCckYsT0FBN0IsRUFBc0M7QUFDaEQsU0FBTzBELEdBQUcsQ0FBQ2EsS0FBSixDQUFVWCxRQUFWLEVBQW9CeUIsRUFBcEIsRUFBd0IsRUFBRSxHQUFHckYsT0FBTDtBQUFjQyxRQUFJLEVBQUU7QUFBcEIsR0FBeEIsQ0FBUDtBQUNELENBRkQ7O0FBR0F5RCxHQUFHLENBQUM0QixRQUFKLEdBQWUsU0FBU0EsUUFBVCxDQUFrQjFDLE9BQWxCLEVBQTJCO0FBQ3hDQSxTQUFPLENBQUNOLElBQVIsQ0FBYXpCLGVBQWI7QUFDRCxDQUZELEMsQ0FJQTs7O0FBRUE2QyxHQUFHLENBQUNwRCxNQUFKLEdBQWEsU0FBU0EsTUFBVCxDQUFnQnNELFFBQWhCLEVBQTBCeUIsRUFBMUIsRUFBOEJyRixPQUE5QixFQUF1QztBQUNsRCxTQUFPMEQsR0FBRyxDQUFDYSxLQUFKLENBQVVYLFFBQVYsRUFBb0J5QixFQUFwQixFQUF3QixFQUFFLEdBQUdyRixPQUFMO0FBQWNNLFVBQU0sRUFBRTtBQUF0QixHQUF4QixDQUFQO0FBQ0QsQ0FGRCxDLENBSUE7OztBQUVBb0QsR0FBRyxDQUFDNkIsS0FBSixHQUFZLFNBQVNBLEtBQVQsQ0FBZTNCLFFBQWYsRUFBeUI7QUFDbkNBLFVBQVEsR0FBR0MsZ0VBQWlCLENBQUNELFFBQUQsQ0FBNUI7QUFDQUEsVUFBUSxDQUFDM0MsT0FBVCxDQUFpQnVFLEVBQUUsSUFBSTtBQUNyQixVQUFNQyxRQUFRLEdBQUdELEVBQUUsQ0FBQ2xELElBQUgsQ0FBUS9DLE9BQVIsS0FBb0JxRiw0Q0FBcEIsR0FBNEJDLDZDQUE3QztBQUNBVyxNQUFFLENBQUNqRCxLQUFILENBQVNrRCxRQUFUO0FBQ0FELE1BQUUsQ0FBQ2xELElBQUgsQ0FBUXhELElBQVIsQ0FBYW1DLE9BQWIsQ0FBcUJ5RSxDQUFDLElBQUlBLENBQUMsQ0FBQy9FLFFBQUYsQ0FBVzhFLFFBQVgsQ0FBMUI7QUFDQUQsTUFBRSxDQUFDbEQsSUFBSCxDQUFRekIsZUFBUjtBQUNBMkUsTUFBRSxDQUFDbEQsSUFBSCxDQUFRdkQsS0FBUixDQUFja0MsT0FBZCxDQUFzQlIsQ0FBQyxJQUFJQSxDQUFDLENBQUNFLFFBQUYsQ0FBVzhFLFFBQVgsQ0FBM0I7QUFDQWxDLCtDQUFJLENBQUNvQyxNQUFMLENBQVlILEVBQVo7QUFDQTlDLG1EQUFRLENBQUNrRCxHQUFULENBQWFKLEVBQUUsQ0FBQ25ELEVBQWhCO0FBQ0FiLGlEQUFNLENBQUNDLEdBQVAsQ0FBVytELEVBQVgsRUFBZSxnQkFBZjtBQUNELEdBVEQ7QUFVQSxTQUFPO0FBQUVuQixNQUFFLEVBQUU5RiwyQ0FBSUE7QUFBVixHQUFQO0FBQ0QsQ0FiRDs7QUFjQW1GLEdBQUcsQ0FBQ21DLE1BQUosR0FBYSxTQUFTQSxNQUFULENBQWdCeEQsRUFBaEIsRUFBb0I7QUFDL0IsU0FBT3FCLEdBQUcsQ0FBQzZCLEtBQUosQ0FBVWxELEVBQVYsQ0FBUDtBQUNELENBRkQ7O0FBR0FxQixHQUFHLENBQUNvQyxZQUFKLEdBQW1CLFNBQVNBLFlBQVQsQ0FBc0JsQyxRQUF0QixFQUFnQztBQUNqREEsVUFBUSxHQUFHQyxnRUFBaUIsQ0FBQ0QsUUFBRCxDQUE1QjtBQUNBQSxVQUFRLENBQUMzQyxPQUFULENBQWlCdUUsRUFBRSxJQUFJO0FBQ3JCQSxNQUFFLENBQUNqRCxLQUFILENBQVNDLDJDQUFUO0FBQ0FnRCxNQUFFLENBQUNsRCxJQUFILENBQVE3QyxLQUFSO0FBQ0ErQixpREFBTSxDQUFDQyxHQUFQLENBQVcrRCxFQUFYLEVBQWUsZUFBZjtBQUNELEdBSkQ7QUFLQSxTQUFPO0FBQUVuQixNQUFFLEVBQUU5RiwyQ0FBSUE7QUFBVixHQUFQO0FBQ0QsQ0FSRDs7QUFTQW1GLEdBQUcsQ0FBQ3FDLGFBQUosR0FBb0IsU0FBU0EsYUFBVCxDQUF1QjFELEVBQXZCLEVBQTJCO0FBQzdDcUIsS0FBRyxDQUFDb0MsWUFBSixDQUFpQnpELEVBQWpCO0FBQ0QsQ0FGRDs7QUFHQXFCLEdBQUcsQ0FBQ3NDLElBQUosR0FBVyxTQUFTQSxJQUFULENBQWNDLE9BQWQsRUFBdUIsR0FBR0MsSUFBMUIsRUFBZ0M7QUFDekMsU0FBTztBQUFFN0IsTUFBRSxFQUFFOEIsbURBQU47QUFBb0JGLFdBQXBCO0FBQTZCQztBQUE3QixHQUFQO0FBQ0QsQ0FGRDs7QUFHQXhDLEdBQUcsQ0FBQzBDLElBQUosR0FBVyxTQUFTQSxJQUFULENBQWNILE9BQWQsRUFBdUIsR0FBR0MsSUFBMUIsRUFBZ0M7QUFDekMsU0FBTztBQUFFN0IsTUFBRSxFQUFFZ0MsbURBQU47QUFBb0JKLFdBQXBCO0FBQTZCQztBQUE3QixHQUFQO0FBQ0QsQ0FGRDs7QUFHQXhDLEdBQUcsQ0FBQzRDLEtBQUosR0FBWSxTQUFTQSxLQUFULENBQWUsR0FBRzFDLFFBQWxCLEVBQTRCO0FBQ3RDLFFBQU0yQyxLQUFLLEdBQUduRSxtREFBSSxFQUFsQjtBQUVBd0IsVUFBUSxDQUFDM0MsT0FBVCxDQUFpQnVFLEVBQUUsSUFBSTtBQUNyQixLQUFDLFNBQVNnQixLQUFULEdBQWlCO0FBQ2hCOUMsU0FBRyxDQUFDYSxLQUFKLENBQVVpQixFQUFWLEVBQWNoSCxDQUFDLElBQUk7QUFDakIsWUFBSUEsQ0FBQyxLQUFLcUcsNkNBQU4sSUFBZ0JyRyxDQUFDLEtBQUtvRyw0Q0FBdEIsSUFBK0IyQixLQUFLLENBQUNoRSxLQUFOLE9BQWtCQywyQ0FBckQsRUFBMkQ7QUFDekRrQixhQUFHLENBQUNDLElBQUosQ0FBUzRDLEtBQVQsRUFBZ0IvSCxDQUFoQixFQUFtQmdJLEtBQW5CO0FBQ0Q7QUFDRixPQUpEO0FBS0QsS0FORDtBQU9ELEdBUkQ7QUFTQSxTQUFPRCxLQUFQO0FBQ0QsQ0FiRDs7QUFjQTdDLEdBQUcsQ0FBQytDLE9BQUosR0FBYyxTQUFTQSxPQUFULENBQWlCQyxRQUFqQixFQUEyQjtBQUN2QyxRQUFNbEIsRUFBRSxHQUFHcEQsbURBQUksRUFBZjtBQUNBdUUsWUFBVSxDQUFDLE1BQU1qRCxHQUFHLENBQUM2QixLQUFKLENBQVVDLEVBQVYsQ0FBUCxFQUFzQmtCLFFBQXRCLENBQVY7QUFDQSxTQUFPbEIsRUFBUDtBQUNELENBSkQ7O0FBS0E5QixHQUFHLENBQUNrRCxTQUFKLEdBQWdCcEIsRUFBRSxJQUFJQSxFQUFFLElBQUlBLEVBQUUsQ0FBQyxVQUFELENBQUYsS0FBbUIsSUFBL0M7O0FBQ0E5QixHQUFHLENBQUNtRCxNQUFKLEdBQWFDLENBQUMsSUFBSUEsQ0FBQyxJQUFJQSxDQUFDLENBQUMsT0FBRCxDQUFELEtBQWUsSUFBdEM7O0FBQ0FwRCxHQUFHLENBQUNxRCxPQUFKLEdBQWM1RCxDQUFDLElBQUlBLENBQUMsSUFBSUEsQ0FBQyxDQUFDLFFBQUQsQ0FBRCxLQUFnQixJQUF4Qzs7QUFDQU8sR0FBRyxDQUFDc0QsU0FBSixHQUFnQkYsQ0FBQyxJQUFJQSxDQUFDLElBQUlBLENBQUMsQ0FBQyxVQUFELENBQUQsS0FBa0IsSUFBNUM7O0FBQ0FwRCxHQUFHLENBQUN1RCxhQUFKLEdBQW9CLFNBQVNBLGFBQVQsQ0FBdUJ6QixFQUF2QixFQUEyQjBCLFVBQVUsR0FBRyxJQUF4QyxFQUE4QztBQUNoRSxNQUFJeEQsR0FBRyxDQUFDa0QsU0FBSixDQUFjcEIsRUFBZCxDQUFKLEVBQXVCLE9BQU9BLEVBQVA7O0FBQ3ZCLE1BQUkwQixVQUFKLEVBQWdCO0FBQ2QsVUFBTSxJQUFJL0UsS0FBSixDQUNILEdBQUVxRCxFQUFHLEdBQ0osT0FBT0EsRUFBUCxLQUFjLFdBQWQsR0FBNkIsS0FBSSxPQUFPQSxFQUFHLEdBQTNDLEdBQWdELEVBQ2pELHFCQUNDLE9BQU9BLEVBQVAsS0FBYyxRQUFkLEdBQ0ssaURBQWdEQSxFQUFHLElBRHhELEdBRUksRUFDTCxFQVBHLENBQU47QUFTRDs7QUFDRCxTQUFPLElBQVA7QUFDRCxDQWRELEMsQ0FnQkE7OztBQUVBOUIsR0FBRyxDQUFDeUQsRUFBSixHQUFTLFNBQVNBLEVBQVQsQ0FBWUMsSUFBWixFQUFrQnBDLElBQUksR0FBRyxNQUFNLENBQUUsQ0FBakMsRUFBbUNrQixJQUFJLEdBQUcsRUFBMUMsRUFBOEM3RyxNQUFNLEdBQUcsSUFBdkQsRUFBNkQ7QUFDcEUsUUFBTWdJLE9BQU8sR0FBRyxTQUFoQjtBQUNBLFFBQU1DLE9BQU8sR0FBRyxTQUFoQjtBQUNBLE1BQUkvRSxLQUFLLEdBQUc4RSxPQUFaO0FBQ0EsUUFBTXZFLElBQUksR0FBR3lFLDBEQUFXLENBQUNILElBQUQsQ0FBeEI7QUFFQSxRQUFNeEksR0FBRyxHQUFHO0FBQ1Z5RCxNQUFFLEVBQUVJLG9EQUFLLENBQUUsV0FBVUssSUFBSyxFQUFqQixDQURDO0FBRVYsZ0JBQVksSUFGRjtBQUdWekQsVUFIVTtBQUlWeUQsUUFKVTtBQUtWMEUsWUFBUSxFQUFFLEVBTEE7O0FBTVZDLFFBQUksR0FBRztBQUNMbEYsV0FBSyxHQUFHK0UsT0FBUjtBQUNBLFdBQUtFLFFBQUwsQ0FBY3ZHLE9BQWQsQ0FBc0I2RixDQUFDLElBQUlBLENBQUMsQ0FBQ1csSUFBRixFQUEzQjtBQUNBbEUsaURBQUksQ0FBQ29DLE1BQUwsQ0FBWS9HLEdBQVo7QUFDQTRDLG1EQUFNLENBQUNDLEdBQVAsQ0FBVzdDLEdBQVgsRUFBZ0IsaUJBQWhCO0FBQ0QsS0FYUzs7QUFZVjhJLFNBQUssR0FBRztBQUNOQyxTQUFHLEdBQUdQLElBQUksQ0FBQyxHQUFHbEIsSUFBSixDQUFWO0FBQ0EwQixVQUFJO0FBQ0pwRyxtREFBTSxDQUFDQyxHQUFQLENBQVcsSUFBWCxFQUFpQixlQUFqQjtBQUNEOztBQWhCUyxHQUFaOztBQWtCQSxRQUFNb0csYUFBYSxHQUFHZixDQUFDLElBQUlsSSxHQUFHLENBQUM0SSxRQUFKLENBQWF0SCxJQUFiLENBQWtCNEcsQ0FBbEIsQ0FBM0I7O0FBRUF0RiwrQ0FBTSxDQUFDQyxHQUFQLENBQVc3QyxHQUFYLEVBQWdCLGlCQUFoQjtBQUNBLE1BQUkrSSxHQUFHLEdBQUdQLElBQUksQ0FBQyxHQUFHbEIsSUFBSixDQUFkOztBQUVBLFdBQVM0QixvQkFBVCxDQUE4QkMsQ0FBOUIsRUFBaUM7QUFDL0IsWUFBUUEsQ0FBQyxDQUFDbEosS0FBRixDQUFRd0YsRUFBaEI7QUFDRSxXQUFLQywwQ0FBTDtBQUNFWixXQUFHLENBQUNDLElBQUosQ0FBU29FLENBQUMsQ0FBQ2xKLEtBQUYsQ0FBUStFLFFBQWpCLEVBQTJCbUUsQ0FBQyxDQUFDbEosS0FBRixDQUFRbUMsSUFBbkMsRUFBeUM0RyxJQUF6QztBQUNBOztBQUNGLFdBQUsxQywyQ0FBTDtBQUNFeEIsV0FBRyxDQUFDYSxLQUFKLENBQ0V3RCxDQUFDLENBQUNsSixLQUFGLENBQVErRSxRQURWLEVBRUUsQ0FBQyxHQUFHb0UsUUFBSixLQUFpQjtBQUNmSixjQUFJLENBQUNJLFFBQVEsQ0FBQ3hJLE1BQVQsS0FBb0IsQ0FBcEIsR0FBd0J3SSxRQUFRLENBQUMsQ0FBRCxDQUFoQyxHQUFzQ0EsUUFBdkMsQ0FBSjtBQUNELFNBSkgsRUFLRUQsQ0FBQyxDQUFDbEosS0FBRixDQUFRbUIsT0FMVjtBQU9BOztBQUNGLFdBQUt6QiwyQ0FBTDtBQUNFcUosWUFBSTtBQUNKOztBQUNGLFdBQUtLLDRDQUFMO0FBQ0V0QixrQkFBVSxDQUFDaUIsSUFBRCxFQUFPRyxDQUFDLENBQUNsSixLQUFGLENBQVFxSixFQUFmLENBQVY7QUFDQTs7QUFDRixXQUFLQywyQ0FBTDtBQUNFdkosV0FBRyxDQUFDNkksSUFBSjtBQUNBOztBQUNGLFdBQUt0QywyQ0FBTDtBQUNFekIsV0FBRyxDQUFDMEIsS0FBSixDQUFVMkMsQ0FBQyxDQUFDbEosS0FBRixDQUFRK0UsUUFBbEIsRUFBNEJnRSxJQUE1QixFQUFrQ0csQ0FBQyxDQUFDbEosS0FBRixDQUFRbUIsT0FBMUM7QUFDQTs7QUFDRixXQUFLbUcsbURBQUw7QUFDRTBCLHFCQUFhLENBQUNuRSxHQUFHLENBQUN5RCxFQUFKLENBQU9ZLENBQUMsQ0FBQ2xKLEtBQUYsQ0FBUW9ILE9BQWYsRUFBd0IyQixJQUF4QixFQUE4QkcsQ0FBQyxDQUFDbEosS0FBRixDQUFRcUgsSUFBdEMsRUFBNEN0SCxHQUFHLENBQUN5RCxFQUFoRCxDQUFELENBQWI7QUFDQTs7QUFDRixXQUFLZ0UsbURBQUw7QUFDRXdCLHFCQUFhLENBQUNuRSxHQUFHLENBQUN5RCxFQUFKLENBQU9ZLENBQUMsQ0FBQ2xKLEtBQUYsQ0FBUW9ILE9BQWYsRUFBd0IsTUFBTSxDQUFFLENBQWhDLEVBQWtDOEIsQ0FBQyxDQUFDbEosS0FBRixDQUFRcUgsSUFBMUMsRUFBZ0R0SCxHQUFHLENBQUN5RCxFQUFwRCxDQUFELENBQWI7QUFDQXVGLFlBQUk7QUFDSjs7QUFDRjtBQUNFLGNBQU0sSUFBSXpGLEtBQUosQ0FBVywwQkFBeUI0RixDQUFDLENBQUNsSixLQUFGLENBQVF3RixFQUFHLGlCQUEvQyxDQUFOO0FBakNKO0FBbUNEOztBQUVELFdBQVN1RCxJQUFULENBQWMvSSxLQUFkLEVBQXFCO0FBQ25CLFFBQUkwRCxLQUFLLEtBQUsrRSxPQUFkLEVBQXVCO0FBQ3ZCLFVBQU1jLElBQUksR0FBR1QsR0FBRyxDQUFDQyxJQUFKLENBQVMvSSxLQUFULENBQWI7O0FBQ0EsUUFBSXVKLElBQUksQ0FBQ3BELElBQUwsS0FBYyxJQUFsQixFQUF3QjtBQUN0QixVQUFJQSxJQUFKLEVBQVVBLElBQUksQ0FBQ29ELElBQUksQ0FBQ3ZKLEtBQU4sQ0FBSjs7QUFDVixVQUFJdUosSUFBSSxDQUFDdkosS0FBTCxJQUFjdUosSUFBSSxDQUFDdkosS0FBTCxDQUFXLEtBQVgsTUFBc0IsSUFBeEMsRUFBOEM7QUFDNUNELFdBQUcsQ0FBQzhJLEtBQUo7QUFDRCxPQUZELE1BRU87QUFDTG5FLG1EQUFJLENBQUNvQyxNQUFMLENBQVkvRyxHQUFaO0FBQ0E0QyxxREFBTSxDQUFDQyxHQUFQLENBQVc3QyxHQUFYLEVBQWdCLGFBQWhCO0FBQ0Q7QUFDRixLQVJELE1BUU8sSUFBSXlKLHdEQUFTLENBQUNELElBQUksQ0FBQ3ZKLEtBQU4sQ0FBYixFQUEyQjtBQUNoQzJDLG1EQUFNLENBQUNDLEdBQVAsQ0FBVzdDLEdBQVgsRUFBZ0IscUJBQWhCO0FBQ0F3SixVQUFJLENBQUN2SixLQUFMLENBQ0d5SixJQURILENBQ1EsQ0FBQyxHQUFHQyxXQUFKLEtBQW9CO0FBQ3hCL0cscURBQU0sQ0FBQ0MsR0FBUCxDQUFXN0MsR0FBWCxFQUFnQixtQkFBaEI7QUFDQWdKLFlBQUksQ0FBQyxHQUFHVyxXQUFKLENBQUo7QUFDRCxPQUpILEVBS0dDLEtBTEgsQ0FLU0MsR0FBRyxJQUFJO0FBQ1pqSCxxREFBTSxDQUFDQyxHQUFQLENBQVc3QyxHQUFYLEVBQWdCLHFCQUFoQixFQUF1QzZKLEdBQXZDO0FBQ0FYLDRCQUFvQixDQUFDSCxHQUFHLENBQUNlLEtBQUosQ0FBVUQsR0FBVixDQUFELENBQXBCO0FBQ0QsT0FSSDtBQVNELEtBWE0sTUFXQTtBQUNMWCwwQkFBb0IsQ0FBQ00sSUFBRCxDQUFwQjtBQUNEO0FBQ0Y7O0FBRUQ3RSw2Q0FBSSxDQUFDQyxHQUFMLENBQVM1RSxHQUFUO0FBQ0FnSixNQUFJO0FBRUosU0FBT2hKLEdBQVA7QUFDRCxDQWxHRDs7QUFtR0E4RSxHQUFHLENBQUN5RCxFQUFKLENBQU8sS0FBUCxJQUFnQixJQUFoQjs7QUFDQXpELEdBQUcsQ0FBQ3lELEVBQUosQ0FBT3dCLElBQVAsR0FBYyxDQUFDLEdBQUdDLElBQUosS0FBYTtBQUN6QixRQUFNQyxXQUFXLEdBQUdELElBQUksQ0FBQy9JLE1BQUwsQ0FBWSxDQUFDQyxHQUFELEVBQU1rQixJQUFOLEtBQWU7QUFDN0MsUUFBSSxPQUFPQSxJQUFQLEtBQWdCLFFBQXBCLEVBQThCO0FBQzVCbEIsU0FBRyxHQUFHLEVBQUUsR0FBR0EsR0FBTDtBQUFVLFNBQUNrQixJQUFELEdBQVE4SCxrREFBRyxDQUFDOUgsSUFBRDtBQUFyQixPQUFOO0FBQ0QsS0FGRCxNQUVPO0FBQ0xsQixTQUFHLEdBQUcsRUFBRSxHQUFHQSxHQUFMO0FBQVUsV0FBR2tCO0FBQWIsT0FBTjtBQUNEOztBQUNELFdBQU9sQixHQUFQO0FBQ0QsR0FQbUIsRUFPakIsRUFQaUIsQ0FBcEI7QUFRQSxTQUFPLENBQUNzSCxJQUFELEVBQU9wQyxJQUFJLEdBQUcsTUFBTSxDQUFFLENBQXRCLEVBQXdCLEdBQUdrQixJQUEzQixLQUFvQztBQUN6Q0EsUUFBSSxDQUFDaEcsSUFBTCxDQUFVMkksV0FBVjtBQUNBLFdBQU9uRixHQUFHLENBQUN5RCxFQUFKLENBQU9DLElBQVAsRUFBYXBDLElBQWIsRUFBbUJrQixJQUFuQixDQUFQO0FBQ0QsR0FIRDtBQUlELENBYkQ7O0FBZUF4QyxHQUFHLENBQUNxRixLQUFKLEdBQVksU0FBU0EsS0FBVCxDQUFlYixFQUFmLEVBQW1CdkgsUUFBbkIsRUFBNkI7QUFDdkMsTUFBSSxPQUFPQSxRQUFQLEtBQW9CLFVBQXhCLEVBQW9DO0FBQ2xDZ0csY0FBVSxDQUFDaEcsUUFBRCxFQUFXdUgsRUFBWCxDQUFWO0FBQ0QsR0FGRCxNQUVPO0FBQ0wsV0FBTztBQUFFN0QsUUFBRSxFQUFFNEQsNENBQU47QUFBYUM7QUFBYixLQUFQO0FBQ0Q7QUFDRixDQU5EOztBQVFBeEUsR0FBRyxDQUFDK0QsSUFBSixHQUFXLFNBQVNBLElBQVQsR0FBZ0I7QUFDekIsU0FBTztBQUFFcEQsTUFBRSxFQUFFOEQsMkNBQUlBO0FBQVYsR0FBUDtBQUNELENBRkQ7O0FBSWV6RSxrRUFBZixFOzs7Ozs7Ozs7Ozs7QUNqVkE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBOztBQUVBLE1BQU1zRixnQkFBZ0IsR0FBR3hLLENBQUMsSUFBSUEsQ0FBOUI7O0FBQ0EsTUFBTXlLLGVBQWUsR0FBRyxDQUFDQyxDQUFELEVBQUkxSyxDQUFKLEtBQVVBLENBQWxDOztBQUNBLE1BQU0ySyxhQUFhLEdBQUdDLENBQUMsSUFBSTtBQUN6QixRQUFNQSxDQUFOO0FBQ0QsQ0FGRDs7QUFJZSxTQUFTN0csS0FBVCxDQUFlOEcsWUFBZixFQUE2QmhLLE1BQU0sR0FBRyxJQUF0QyxFQUE0QztBQUN6RCxNQUFJUixLQUFLLEdBQUd3SyxZQUFaO0FBQ0EsUUFBTWhILEVBQUUsR0FBR0ksb0RBQUssQ0FBQyxPQUFELENBQWhCO0FBQ0EsUUFBTStFLFFBQVEsR0FBRyxFQUFqQjs7QUFFQSxXQUFTOEIsWUFBVCxDQUFzQkMsU0FBdEIsRUFBaUM7QUFDL0IvQixZQUFRLENBQUN2RyxPQUFULENBQWlCdUksQ0FBQyxJQUFJO0FBQ3BCLFVBQUlBLENBQUMsQ0FBQ25ILEVBQUYsS0FBU2tILFNBQVMsQ0FBQ2xILEVBQXZCLEVBQTJCO0FBQ3pCc0IsMkRBQUksQ0FBQzZGLENBQUQsRUFBSTtBQUFFM0ssZUFBRjtBQUFTNEssaUJBQU8sRUFBRTtBQUFsQixTQUFKLENBQUo7QUFDRDtBQUNGLEtBSkQ7QUFLRDs7QUFFRCxRQUFNN0ssR0FBRyxHQUFHLFVBQVNpRSxHQUFULEVBQWNDLElBQWQsRUFBb0I7QUFDOUIsUUFBSUQsR0FBRyxDQUFDckQsTUFBSixHQUFhLENBQWpCLEVBQW9CO0FBQ2xCdUQsNERBQU8sQ0FBQ25FLEdBQUQsRUFBTSxNQUFOLEVBQWNpRSxHQUFHLENBQUMsQ0FBRCxDQUFILEdBQVNDLElBQVQsR0FBZ0JELEdBQUcsQ0FBQyxDQUFELENBQWpDLENBQVA7QUFDRCxLQUZELE1BRU87QUFDTEUsNERBQU8sQ0FBQ25FLEdBQUQsRUFBTSxNQUFOLEVBQWNpRSxHQUFHLENBQUMsQ0FBRCxDQUFqQixDQUFQO0FBQ0Q7O0FBQ0RyQixpREFBTSxDQUFDd0IsVUFBUCxDQUFrQnBFLEdBQUcsQ0FBQ3lELEVBQXRCLEVBQTBCekQsR0FBRyxDQUFDa0UsSUFBOUI7QUFDQSxXQUFPbEUsR0FBUDtBQUNELEdBUkQ7O0FBVUFtRSx3REFBTyxDQUFDbkUsR0FBRCxFQUFNLE1BQU4sRUFBYyxPQUFkLENBQVA7QUFFQUEsS0FBRyxDQUFDeUQsRUFBSixHQUFTQSxFQUFUO0FBQ0F6RCxLQUFHLENBQUMsUUFBRCxDQUFILEdBQWdCLElBQWhCO0FBQ0FBLEtBQUcsQ0FBQ1MsTUFBSixHQUFhQSxNQUFiOztBQUNBVCxLQUFHLENBQUM0SSxRQUFKLEdBQWUsTUFBTUEsUUFBckI7O0FBQ0E1SSxLQUFHLENBQUN3RCxJQUFKLEdBQVcsQ0FDVHNILFFBQVEsR0FBR1YsZ0JBREYsRUFFVFcsT0FBTyxHQUFHVixlQUZELEVBR1RXLE9BQU8sR0FBR1QsYUFIRCxLQUlOO0FBQ0gsVUFBTTdHLElBQUksR0FBR0wsNkNBQU0sQ0FBQzNELE9BQVAsQ0FBZSxDQUFmLENBQWI7QUFDQWdFLFFBQUksQ0FBQzVDLFFBQUwsQ0FBYyxDQUFDYixLQUFELENBQWQ7QUFDQSxVQUFNMkcsRUFBRSxHQUFHcEQsbURBQUksQ0FBQyxTQUFELEVBQVlFLElBQVosRUFBa0JELEVBQWxCLENBQWY7QUFDQW1ELE1BQUUsQ0FBQ3BHLFNBQUgsQ0FBYSxDQUFDNEIsSUFBRCxFQUFPdkMsRUFBUCxLQUFjO0FBQ3pCLFVBQUk7QUFDRixZQUFJb0wsa0VBQW1CLENBQUNILFFBQUQsQ0FBdkIsRUFBbUM7QUFDakN2QywyREFBRSxDQUFDdUMsUUFBRCxFQUFXSSxVQUFVLElBQUlyTCxFQUFFLENBQUNxTCxVQUFELENBQTNCLEVBQXlDLENBQUM5SSxJQUFELENBQXpDLEVBQWlEcUIsRUFBakQsQ0FBRjtBQUNBO0FBQ0Q7O0FBQ0Q1RCxVQUFFLENBQUNpTCxRQUFRLENBQUMxSSxJQUFELENBQVQsQ0FBRjtBQUNELE9BTkQsQ0FNRSxPQUFPb0ksQ0FBUCxFQUFVO0FBQ1ZRLGVBQU8sQ0FBQ1IsQ0FBRCxDQUFQO0FBQ0Q7QUFDRixLQVZEO0FBV0E1RCxNQUFFLENBQUN2RyxTQUFILENBQWEsQ0FBQzhLLE9BQUQsRUFBVXRMLEVBQVYsS0FBaUI7QUFDNUIsVUFDRXNMLE9BQU8sS0FBSyxJQUFaLElBQ0EsT0FBT0EsT0FBUCxLQUFtQixRQURuQixJQUVBLGFBQWFBLE9BRmIsSUFHQUEsT0FBTyxDQUFDTixPQUpWLEVBS0U7QUFDQWhMLFVBQUUsQ0FBQ3NMLE9BQU8sQ0FBQ2xMLEtBQVQsQ0FBRjtBQUNBO0FBQ0Q7O0FBQ0QsVUFBSTtBQUNGLFlBQUlnTCxrRUFBbUIsQ0FBQ0YsT0FBRCxDQUF2QixFQUFrQztBQUNoQ3hDLDJEQUFFLENBQ0F3QyxPQURBLEVBRUFLLFNBQVMsSUFBSTtBQUNYbkwsaUJBQUssR0FBR21MLFNBQVI7QUFDQVYsd0JBQVksQ0FBQzlELEVBQUQsQ0FBWjtBQUNBL0csY0FBRSxDQUFDSSxLQUFELENBQUY7QUFDQTJDLHlEQUFNLENBQUNDLEdBQVAsQ0FBVzdDLEdBQVgsRUFBZ0IsaUJBQWhCLEVBQW1DQyxLQUFuQztBQUNELFdBUEQsRUFRQSxDQUFDQSxLQUFELEVBQVFrTCxPQUFSLENBUkEsRUFTQTFILEVBVEEsQ0FBRjtBQVdBO0FBQ0Q7O0FBQ0R4RCxhQUFLLEdBQUc4SyxPQUFPLENBQUM5SyxLQUFELEVBQVFrTCxPQUFSLENBQWY7QUFDQVQsb0JBQVksQ0FBQzlELEVBQUQsQ0FBWjtBQUNBL0csVUFBRSxDQUFDSSxLQUFELENBQUY7QUFDQTJDLHFEQUFNLENBQUNDLEdBQVAsQ0FBVzdDLEdBQVgsRUFBZ0IsaUJBQWhCLEVBQW1DQyxLQUFuQztBQUNELE9BbkJELENBbUJFLE9BQU91SyxDQUFQLEVBQVU7QUFDVlEsZUFBTyxDQUFDUixDQUFELENBQVA7QUFDRDtBQUNGLEtBaENEO0FBaUNBNUIsWUFBUSxDQUFDdEgsSUFBVCxDQUFjc0YsRUFBZDtBQUNBLFdBQU9BLEVBQVA7QUFDRCxHQXRERDs7QUF1REE1RyxLQUFHLENBQUNxTCxNQUFKLEdBQWEsQ0FBQ1AsUUFBRCxFQUFXRSxPQUFYLEtBQ1hoTCxHQUFHLENBQUN3RCxJQUFKLENBQVNzSCxRQUFULEVBQW1CVCxlQUFuQixFQUFvQ1csT0FBcEMsQ0FERjs7QUFFQWhMLEtBQUcsQ0FBQ3NMLE1BQUosR0FBYSxDQUFDUCxPQUFELEVBQVVDLE9BQVYsS0FDWGhMLEdBQUcsQ0FBQ3dELElBQUosQ0FBUzRHLGdCQUFULEVBQTJCVyxPQUEzQixFQUFvQ0MsT0FBcEMsQ0FERjs7QUFFQWhMLEtBQUcsQ0FBQ3VMLE9BQUosR0FBYyxNQUFNO0FBQ2xCM0MsWUFBUSxDQUFDdkcsT0FBVCxDQUFpQnVFLEVBQUUsSUFBSUsscURBQU0sQ0FBQ0wsRUFBRCxDQUE3QjtBQUNBM0csU0FBSyxHQUFHaUQsU0FBUjtBQUNBeUIsK0NBQUksQ0FBQ29DLE1BQUwsQ0FBWS9HLEdBQVo7QUFDQTRDLGlEQUFNLENBQUNDLEdBQVAsQ0FBVzdDLEdBQVgsRUFBZ0IsaUJBQWhCO0FBQ0EsV0FBTyxJQUFQO0FBQ0QsR0FORDs7QUFPQUEsS0FBRyxDQUFDd0wsR0FBSixHQUFVLE1BQU12TCxLQUFoQjs7QUFDQUQsS0FBRyxDQUFDcUUsR0FBSixHQUFVb0gsUUFBUSxJQUFJO0FBQ3BCeEwsU0FBSyxHQUFHd0wsUUFBUjtBQUNBZixnQkFBWSxDQUFDLEVBQUQsQ0FBWjtBQUNBOUgsaURBQU0sQ0FBQ0MsR0FBUCxDQUFXN0MsR0FBWCxFQUFnQixpQkFBaEIsRUFBbUN5TCxRQUFuQztBQUNBLFdBQU9BLFFBQVA7QUFDRCxHQUxEOztBQU9BN0ksK0NBQU0sQ0FBQ0MsR0FBUCxDQUFXN0MsR0FBWCxFQUFnQixlQUFoQixFQUFpQ0MsS0FBakM7QUFFQUQsS0FBRyxDQUFDMEwsT0FBSixHQUFjMUwsR0FBRyxDQUFDd0QsSUFBSixFQUFXLFNBQXpCO0FBRUFtQiw2Q0FBSSxDQUFDQyxHQUFMLENBQVM1RSxHQUFUO0FBRUEsU0FBT0EsR0FBUDtBQUNELEM7Ozs7Ozs7Ozs7OztBQ3ZIRDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQVFPLFNBQVNpRixpQkFBVCxDQUEyQkQsUUFBM0IsRUFBcUM7QUFDMUMsTUFBSSxDQUFDMkcsS0FBSyxDQUFDQyxPQUFOLENBQWM1RyxRQUFkLENBQUwsRUFBOEJBLFFBQVEsR0FBRyxDQUFDQSxRQUFELENBQVg7QUFDOUIsU0FBT0EsUUFBUSxDQUFDRyxHQUFULENBQWF5QixFQUFFLElBQUk7QUFDeEIsUUFBSXVCLHNEQUFPLENBQUN2QixFQUFELENBQVgsRUFBaUIsT0FBT0EsRUFBRSxDQUFDOEUsT0FBVjtBQUNqQixXQUFPckQsNERBQWEsQ0FBQ3pCLEVBQUQsQ0FBcEI7QUFDRCxHQUhNLENBQVA7QUFJRDtBQUVELE1BQU1wSCxlQUFlLEdBQUc7QUFDdEJ3TCxTQUFPLEVBQUUsSUFEYTtBQUV0QnJJLGFBQVcsRUFBRTtBQUZTLENBQXhCO0FBS08sU0FBU2lELFdBQVQsQ0FBcUJhLEVBQXJCLEVBQXlCO0FBQzlCLE1BQUl1Qix3REFBUyxDQUFDdkIsRUFBRCxDQUFiLEVBQW1CO0FBQ2pCLFdBQU83RyxDQUFDLElBQUltRixtREFBSSxDQUFDMEIsRUFBRCxFQUFLN0csQ0FBTCxDQUFoQjtBQUNEOztBQUNELE1BQUksT0FBTzZHLEVBQVAsS0FBYyxVQUFsQixFQUE4QjtBQUM1QixXQUFPQSxFQUFQO0FBQ0Q7O0FBQ0QsUUFBTSxJQUFJbEQsS0FBSixDQUNILEdBQUVrRCxFQUFHLEdBQ0osT0FBT0EsRUFBUCxLQUFjLFdBQWQsR0FBNkIsS0FBSSxPQUFPQSxFQUFHLEdBQTNDLEdBQWdELEVBQ2pELHFCQUNDLE9BQU9HLEVBQVAsS0FBYyxRQUFkLEdBQ0ssaURBQWdESCxFQUFHLElBRHhELEdBRUksRUFDTCxFQVBHLENBQU47QUFTRDtBQUNNLFNBQVMvRCxnQkFBVCxDQUEwQnRCLE9BQTFCLEVBQW1DO0FBQ3hDQSxTQUFPLEdBQUdBLE9BQU8sSUFBSTVCLGVBQXJCO0FBQ0EsUUFBTXdMLE9BQU8sR0FBRzVKLE9BQU8sQ0FBQzRKLE9BQVIsSUFBbUJ4TCxlQUFlLENBQUN3TCxPQUFuRDtBQUNBLFFBQU1sRixRQUFRLEdBQUcxRSxPQUFPLENBQUMwRSxRQUFSLElBQW9CQyxtREFBckM7QUFDQSxRQUFNckUsTUFBTSxHQUFHLFlBQVlOLE9BQVosR0FBc0JBLE9BQU8sQ0FBQ00sTUFBOUIsR0FBdUMsS0FBdEQ7QUFDQSxRQUFNTCxJQUFJLEdBQUcsVUFBVUQsT0FBVixHQUFvQkEsT0FBTyxDQUFDQyxJQUE1QixHQUFtQyxLQUFoRDtBQUNBLFFBQU1zQixXQUFXLEdBQ2YsaUJBQWlCdkIsT0FBakIsR0FDSUEsT0FBTyxDQUFDdUIsV0FEWixHQUVJbkQsZUFBZSxDQUFDbUQsV0FIdEI7QUFLQSxTQUFPO0FBQ0xxSSxXQURLO0FBRUxsRixZQUZLO0FBR0xuRCxlQUhLO0FBSUxqQixVQUpLO0FBS0xMLFFBTEs7QUFNTHdLLG9CQUFnQixFQUFFekssT0FBTyxDQUFDeUs7QUFOckIsR0FBUDtBQVFELEM7Ozs7Ozs7Ozs7OztBQzFERDtBQUFBO0FBQWUsU0FBU0MsSUFBVCxHQUFnQjtBQUM3QixRQUFNQyxPQUFPLEdBQUcsRUFBaEI7QUFDQSxNQUFJQyxLQUFLLEdBQUcsRUFBWjs7QUFFQUQsU0FBTyxDQUFDbkgsR0FBUixHQUFjcUgsT0FBTyxJQUFJO0FBQ3ZCLFFBQUksQ0FBQ0EsT0FBRCxJQUFZLENBQUNBLE9BQU8sQ0FBQ3hJLEVBQXpCLEVBQTZCO0FBQzNCLFlBQU0sSUFBSUYsS0FBSixDQUNILHFFQUFvRTBJLE9BQVEsVUFEekUsQ0FBTjtBQUdEOztBQUNERCxTQUFLLENBQUMxSyxJQUFOLENBQVcySyxPQUFYO0FBQ0QsR0FQRDs7QUFRQUYsU0FBTyxDQUFDaEYsTUFBUixHQUFpQmtGLE9BQU8sSUFBSTtBQUMxQixVQUFNdEssR0FBRyxHQUFHcUssS0FBSyxDQUFDcEssU0FBTixDQUFnQixDQUFDO0FBQUU2QjtBQUFGLEtBQUQsS0FBWUEsRUFBRSxLQUFLd0ksT0FBTyxDQUFDeEksRUFBM0MsQ0FBWjs7QUFFQSxRQUFJOUIsR0FBRyxJQUFJLENBQVgsRUFBYztBQUNaO0FBQ0FxSyxXQUFLLENBQUNsSyxNQUFOLENBQWFILEdBQWIsRUFBa0IsQ0FBbEI7QUFDRDtBQUNGLEdBUEQ7O0FBUUFvSyxTQUFPLENBQUNsTCxLQUFSLEdBQWdCLE1BQU07QUFDcEJtTCxTQUFLLEdBQUcsRUFBUjtBQUNELEdBRkQ7O0FBR0FELFNBQU8sQ0FBQ0MsS0FBUixHQUFnQixNQUFNQSxLQUF0Qjs7QUFDQUQsU0FBTyxDQUFDRyxXQUFSLEdBQXNCQyxNQUFNLElBQUlILEtBQUssQ0FBQ0ksSUFBTixDQUFXLENBQUM7QUFBRTNJO0FBQUYsR0FBRCxLQUFZQSxFQUFFLEtBQUswSSxNQUE5QixDQUFoQzs7QUFFQSxTQUFPSixPQUFQO0FBQ0QsQzs7Ozs7Ozs7Ozs7O0FDM0JEO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFTyxNQUFNbkksSUFBSSxHQUFHeUksTUFBTSxDQUFDLE1BQUQsQ0FBbkI7QUFDQSxNQUFNcEcsTUFBTSxHQUFHb0csTUFBTSxDQUFDLFFBQUQsQ0FBckI7QUFDQSxNQUFNckcsS0FBSyxHQUFHcUcsTUFBTSxDQUFDLE9BQUQsQ0FBcEI7QUFDQSxNQUFNM0csR0FBRyxHQUFHLEtBQVo7QUFDQSxNQUFNWSxJQUFJLEdBQUcsTUFBYjtBQUNBLE1BQU0zRyxJQUFJLEdBQUcsTUFBYjtBQUNBLE1BQU0wSixLQUFLLEdBQUcsT0FBZDtBQUNBLE1BQU1FLElBQUksR0FBRyxNQUFiO0FBQ0EsTUFBTWhELElBQUksR0FBRyxNQUFiO0FBQ0EsTUFBTWdCLFlBQVksR0FBRyxjQUFyQjtBQUNBLE1BQU1FLFlBQVksR0FBRyxjQUFyQjtBQUNBLE1BQU1yQyxPQUFPLEdBQUdpSCxNQUFNLENBQUMsU0FBRCxDQUF0QjtBQUNBLE1BQU10RyxZQUFZLEdBQUdzRyxNQUFNLENBQUMsY0FBRCxDQUEzQjtBQUNBLE1BQU1sRyxNQUFNLEdBQUdrRyxNQUFNLENBQUMsUUFBRCxDQUFyQjtBQUVBLE1BQU12SSxRQUFRLEdBQUc7QUFDdEJrQixVQUFRLEVBQUUsRUFEWTs7QUFFdEJzSCxRQUFNLEdBQUc7QUFDUCxXQUFPLEtBQUt0SCxRQUFaO0FBQ0QsR0FKcUI7O0FBS3RCd0csS0FBRyxDQUFDL0gsRUFBRCxFQUFLO0FBQ04sV0FBTyxLQUFLdUIsUUFBTCxDQUFjdkIsRUFBZCxDQUFQO0FBQ0QsR0FQcUI7O0FBUXRCWSxLQUFHLENBQUNaLEVBQUQsRUFBS21ELEVBQUwsRUFBUztBQUNWLFNBQUs1QixRQUFMLENBQWN2QixFQUFkLElBQW9CbUQsRUFBcEI7QUFDQSxXQUFPQSxFQUFQO0FBQ0QsR0FYcUI7O0FBWXRCSSxLQUFHLENBQUN2RCxFQUFELEVBQUs7QUFDTixXQUFPLEtBQUt1QixRQUFMLENBQWN2QixFQUFkLENBQVA7QUFDRCxHQWRxQjs7QUFldEJNLFFBQU0sQ0FBQ04sRUFBRCxFQUFLO0FBQ1QsV0FBTyxDQUFDLENBQUMsS0FBS3VCLFFBQUwsQ0FBY3ZCLEVBQWQsQ0FBVDtBQUNELEdBakJxQjs7QUFrQnRCNUMsT0FBSyxHQUFHO0FBQ04sU0FBS21FLFFBQUwsR0FBZ0IsRUFBaEI7QUFDRDs7QUFwQnFCLENBQWpCO0FBdUJBLE1BQU0zQixNQUFNLEdBQUdrSixnREFBZjtBQUNBLE1BQU0vSSxJQUFJLEdBQUdvSCxvREFBYjtBQUNBLE1BQU10SCxLQUFLLEdBQUcsQ0FBQ3ZELElBQUksR0FBRyxDQUFSLEVBQVcwRCxFQUFFLEdBQUcsSUFBaEIsRUFBc0JoRCxNQUFNLEdBQUcsSUFBL0IsS0FDbkIrQyxJQUFJLENBQUNDLEVBQUUsSUFBSSxPQUFQLEVBQWdCSixNQUFNLENBQUNDLEtBQVAsQ0FBYXZELElBQWIsQ0FBaEIsRUFBb0NVLE1BQXBDLENBREM7QUFFQSxNQUFNZixPQUFPLEdBQUcsQ0FBQ0ssSUFBSSxHQUFHLENBQVIsRUFBVzBELEVBQUUsR0FBRyxJQUFoQixFQUFzQmhELE1BQU0sR0FBRyxJQUEvQixLQUNyQitDLElBQUksQ0FBQ0MsRUFBRSxJQUFJLFNBQVAsRUFBa0JKLE1BQU0sQ0FBQzNELE9BQVAsQ0FBZUssSUFBZixDQUFsQixFQUF3Q1UsTUFBeEMsQ0FEQztBQUVBLE1BQU1oQixRQUFRLEdBQUcsQ0FBQ00sSUFBSSxHQUFHLENBQVIsRUFBVzBELEVBQUUsR0FBRyxJQUFoQixFQUFzQmhELE1BQU0sR0FBRyxJQUEvQixLQUN0QitDLElBQUksQ0FBQ0MsRUFBRSxJQUFJLFVBQVAsRUFBbUJKLE1BQU0sQ0FBQzVELFFBQVAsQ0FBZ0JNLElBQWhCLENBQW5CLEVBQTBDVSxNQUExQyxDQURDO0FBRUEsTUFBTWtELEtBQUssR0FBR1ksa0RBQWQ7QUFFUDtBQUVPLE1BQU1pSSxLQUFLLEdBQUc7QUFDbkJDLE1BQUksRUFBRSxDQUFDLEdBQUduRixJQUFKLEtBQWFvRixzREFBUyxDQUFDLEdBQUdwRixJQUFKO0FBRFQsQ0FBZDtBQUdBLE1BQU00QyxHQUFHLEdBQUcsQ0FBQ2hHLElBQUQsRUFBTyxHQUFHb0QsSUFBVixLQUFtQnFGLGlEQUFDLENBQUNDLE9BQUYsQ0FBVTFJLElBQVYsRUFBZ0IsR0FBR29ELElBQW5CLENBQS9CO0FBQ0EsTUFBTTVDLFFBQVEsR0FBRyxDQUFDUixJQUFELEVBQU8ySSxRQUFQLEtBQW9CO0FBQzFDRixtREFBQyxDQUFDRyxhQUFGLENBQWdCNUksSUFBaEIsRUFBc0IsTUFBTTJJLFFBQTVCO0FBQ0EsU0FBT0EsUUFBUDtBQUNELENBSE07QUFJQSxNQUFNakssTUFBTSxHQUFHLElBQUltSywrQ0FBSixFQUFmO0FBQ0EsTUFBTXBJLElBQUksR0FBRyxJQUFJbUgsNkNBQUosRUFBYjtBQUNBLE1BQU1qTCxLQUFLLEdBQUcsT0FDbkJtTSx1REFBUSxJQUFJckksSUFBSSxDQUFDOUQsS0FBTCxFQUFKLEVBQWtCOEwsaURBQUMsQ0FBQzlMLEtBQUYsRUFBbEIsRUFBNkJpRCxRQUFRLENBQUNqRCxLQUFULEVBQTdCLEVBQStDK0IsTUFBTSxDQUFDL0IsS0FBUCxFQURwQyxDQUFkO0FBR0EsTUFBTW9NLFFBQVEsR0FBR04saURBQWpCO0FBQ0EsTUFBTTVILElBQUksR0FBR0QsZ0RBQUcsQ0FBQ0MsSUFBakI7QUFDQSxNQUFNNUMsR0FBRyxHQUFHMkMsZ0RBQUcsQ0FBQzNDLEdBQWhCO0FBQ0EsTUFBTXdELEtBQUssR0FBR2IsZ0RBQUcsQ0FBQ2EsS0FBbEI7QUFDQSxNQUFNbkQsSUFBSSxHQUFHc0MsZ0RBQUcsQ0FBQ3RDLElBQWpCO0FBQ0EsTUFBTW5CLElBQUksR0FBR3lELGdEQUFHLENBQUN6RCxJQUFqQjtBQUNBLE1BQU1tRixLQUFLLEdBQUcxQixnREFBRyxDQUFDMEIsS0FBbEI7QUFDQSxNQUFNOUUsTUFBTSxHQUFHb0QsZ0RBQUcsQ0FBQ3BELE1BQW5CO0FBQ0EsTUFBTWdGLFFBQVEsR0FBRzVCLGdEQUFHLENBQUM0QixRQUFyQjtBQUNBLE1BQU1DLEtBQUssR0FBRzdCLGdEQUFHLENBQUM2QixLQUFsQjtBQUNBLE1BQU1NLE1BQU0sR0FBR25DLGdEQUFHLENBQUNtQyxNQUFuQjtBQUNBLE1BQU1DLFlBQVksR0FBR3BDLGdEQUFHLENBQUNvQyxZQUF6QjtBQUNBLE1BQU1DLGFBQWEsR0FBR3JDLGdEQUFHLENBQUNxQyxhQUExQjtBQUNBLE1BQU1DLElBQUksR0FBR3RDLGdEQUFHLENBQUNzQyxJQUFqQjtBQUNBLE1BQU1JLElBQUksR0FBRzFDLGdEQUFHLENBQUMwQyxJQUFqQjtBQUNBLE1BQU1FLEtBQUssR0FBRzVDLGdEQUFHLENBQUM0QyxLQUFsQjtBQUNBLE1BQU1HLE9BQU8sR0FBRy9DLGdEQUFHLENBQUMrQyxPQUFwQjtBQUNBLE1BQU1RLGFBQWEsR0FBR3ZELGdEQUFHLENBQUN1RCxhQUExQjtBQUNBLE1BQU1MLFNBQVMsR0FBR2xELGdEQUFHLENBQUNrRCxTQUF0QjtBQUNBLE1BQU1rRixVQUFVLEdBQUdwSSxnREFBRyxDQUFDb0ksVUFBdkI7QUFDQSxNQUFNakYsTUFBTSxHQUFHbkQsZ0RBQUcsQ0FBQ21ELE1BQW5CO0FBQ0EsTUFBTUUsT0FBTyxHQUFHckQsZ0RBQUcsQ0FBQ3FELE9BQXBCO0FBQ0EsTUFBTUMsU0FBUyxHQUFHdEQsZ0RBQUcsQ0FBQ3NELFNBQXRCO0FBQ0EsTUFBTUcsRUFBRSxHQUFHekQsZ0RBQUcsQ0FBQ3lELEVBQWY7QUFDQSxNQUFNNEIsS0FBSyxHQUFHckYsZ0RBQUcsQ0FBQ3FGLEtBQWxCO0FBQ0EsTUFBTXRCLElBQUksR0FBRy9ELGdEQUFHLENBQUMrRCxJQUFqQjtBQUNBLE1BQU1zRSxTQUFTLEdBQUdDLDBEQUFJLENBQUN4SyxNQUFELENBQXRCLEM7Ozs7Ozs7Ozs7OztBQ3BHUDtBQUFBO0FBQUE7QUFDQSxNQUFNeUssU0FBUyxHQUFHQyxJQUFJLElBQUksT0FBT0EsSUFBUCxLQUFnQixXQUExQzs7QUFDQSxTQUFTQyxTQUFULEdBQXFCO0FBQ25CLE1BQ0VGLFNBQVMsQ0FBQ0csUUFBRCxDQUFULElBQ0FILFNBQVMsQ0FBQ0csUUFBUSxDQUFDQyxRQUFWLENBRFQsSUFFQUosU0FBUyxDQUFDRyxRQUFRLENBQUNFLElBQVYsQ0FIWCxFQUlFO0FBQ0EsV0FBUSxHQUFFRixRQUFRLENBQUNDLFFBQVMsS0FBSUQsUUFBUSxDQUFDRSxJQUFLLEVBQTlDO0FBQ0Q7O0FBQ0QsU0FBTyxTQUFQO0FBQ0Q7O0FBRWMsU0FBU1AsU0FBVCxDQUFtQnZLLE1BQW5CLEVBQTJCO0FBQ3hDLFNBQU8sQ0FBQ2IsUUFBUSxHQUFHLE1BQU0sQ0FBRSxDQUFwQixFQUFzQjRMLHFCQUFxQixHQUFHLEtBQTlDLEtBQXdEO0FBQzdEL0ssVUFBTSxDQUFDZ0wsTUFBUDtBQUNBaEwsVUFBTSxDQUFDaUwsRUFBUCxDQUFVQyxRQUFRLElBQUk7QUFDcEIsVUFBSSxPQUFPQyxNQUFQLEtBQWtCLFdBQXRCLEVBQW1DO0FBQ2pDLFlBQUlKLHFCQUFKLEVBQTJCO0FBQ3pCSyxpQkFBTyxDQUFDbkwsR0FBUixDQUFZLGdCQUFaLEVBQThCaUwsUUFBOUI7QUFDRDs7QUFDRC9MLGdCQUFRLENBQUMrTCxRQUFELENBQVI7QUFDQUMsY0FBTSxDQUFDRSxXQUFQLENBQ0U7QUFDRUMsY0FBSSxFQUFFLGVBRFI7QUFFRUMsZ0JBQU0sRUFBRSxNQUZWO0FBR0VDLGdCQUFNLEVBQUViLFNBQVMsRUFIbkI7QUFJRU8sa0JBSkY7QUFLRU8sY0FBSSxFQUFFLElBQUlDLElBQUosR0FBV0MsT0FBWDtBQUxSLFNBREYsRUFRRSxHQVJGO0FBVUQ7QUFDRixLQWpCRDtBQWtCRCxHQXBCRDtBQXFCRCxDOzs7Ozs7Ozs7Ozs7QUNuQ0Q7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFFQSxNQUFNQyxJQUFJLEdBQUcsTUFBYjtBQUNBLE1BQU1DLEtBQUssR0FBRyxPQUFkO0FBQ0EsTUFBTUMsT0FBTyxHQUFHLFNBQWhCO0FBQ0EsTUFBTUMsT0FBTyxHQUFHLFNBQWhCOztBQUVBLFNBQVNDLGFBQVQsQ0FBdUIxRyxDQUF2QixFQUEwQjtBQUN4QixTQUFPO0FBQ0x6RSxNQUFFLEVBQUV5RSxDQUFDLENBQUN6RSxFQUREO0FBRUxTLFFBQUksRUFBRWdFLENBQUMsQ0FBQ2hFLElBRkg7QUFHTGdLLFFBQUksRUFBRU0sSUFIRDtBQUlMSyxZQUFRLEVBQUVDLHlEQUFRLENBQUM1RyxDQUFDLENBQUM2RyxRQUFGLENBQVdDLElBQVgsRUFBRCxDQUpiO0FBS0xwRyxZQUFRLEVBQUVWLENBQUMsQ0FBQ1UsUUFBRixDQUFXekQsR0FBWCxDQUFlOEosS0FBSyxJQUFJO0FBQ2hDLFVBQUk5RyxzREFBTyxDQUFDOEcsS0FBRCxDQUFYLEVBQW9CO0FBQ2xCLGVBQU9DLGNBQWMsQ0FBQ0QsS0FBRCxDQUFyQjtBQUNEOztBQUNELFVBQUlqSCx3REFBUyxDQUFDaUgsS0FBRCxDQUFiLEVBQXNCO0FBQ3BCLGVBQU9FLGdCQUFnQixDQUFDRixLQUFELENBQXZCO0FBQ0Q7O0FBQ0QsVUFBSTdHLHdEQUFTLENBQUM2RyxLQUFELENBQWIsRUFBc0I7QUFDcEIsZUFBT0csZ0JBQWdCLENBQUNILEtBQUQsQ0FBdkI7QUFDRDs7QUFDRGpCLGFBQU8sQ0FBQ3FCLElBQVIsQ0FBYSxzQ0FBYixFQUFxREosS0FBckQ7QUFDRCxLQVhTO0FBTEwsR0FBUDtBQWtCRDs7QUFDRCxTQUFTQyxjQUFULENBQXdCM0ssQ0FBeEIsRUFBMkI7QUFDekIsU0FBTztBQUNMZCxNQUFFLEVBQUVjLENBQUMsQ0FBQ2QsRUFERDtBQUVMUyxRQUFJLEVBQUVLLENBQUMsQ0FBQ0wsSUFGSDtBQUdMekQsVUFBTSxFQUFFOEQsQ0FBQyxDQUFDOUQsTUFITDtBQUlMeU4sUUFBSSxFQUFFTyxLQUpEO0FBS0x4TyxTQUFLLEVBQUU2Tyx5REFBUSxDQUFDdkssQ0FBQyxDQUFDaUgsR0FBRixFQUFELENBTFY7QUFNTDVDLFlBQVEsRUFBRXJFLENBQUMsQ0FBQ3FFLFFBQUYsR0FBYXpELEdBQWIsQ0FBaUI4SixLQUFLLElBQUk7QUFDbEMsVUFBSWpILHdEQUFTLENBQUNpSCxLQUFELENBQWIsRUFBc0I7QUFDcEIsZUFBT0UsZ0JBQWdCLENBQUNGLEtBQUQsQ0FBdkI7QUFDRDs7QUFDRGpCLGFBQU8sQ0FBQ3FCLElBQVIsQ0FBYSx1Q0FBYixFQUFzREosS0FBdEQ7QUFDRCxLQUxTO0FBTkwsR0FBUDtBQWFEOztBQUNELFNBQVNFLGdCQUFULENBQTBCdkUsQ0FBMUIsRUFBNkI7QUFDM0IsUUFBTTBFLENBQUMsR0FBRztBQUNSN0wsTUFBRSxFQUFFbUgsQ0FBQyxDQUFDbkgsRUFERTtBQUVSUyxRQUFJLEVBQUUwRyxDQUFDLENBQUMxRyxJQUZBO0FBR1J6RCxVQUFNLEVBQUVtSyxDQUFDLENBQUNuSyxNQUhGO0FBSVJ5TixRQUFJLEVBQUVRLE9BSkU7QUFLUnpPLFNBQUssRUFBRTZPLHlEQUFRLENBQUNsRSxDQUFDLENBQUMzSyxLQUFGLEVBQUQsQ0FMUDtBQU1SQyxRQUFJLEVBQUUwSyxDQUFDLENBQUNsSCxJQUFGLENBQU94RCxJQUFQLENBQVlpRixHQUFaLENBQWdCLENBQUM7QUFBRS9DO0FBQUYsS0FBRCxNQUFlO0FBQUVBO0FBQUYsS0FBZixDQUFoQixDQU5FO0FBT1JqQyxTQUFLLEVBQUV5SyxDQUFDLENBQUNsSCxJQUFGLENBQU92RCxLQUFQLENBQWFnRixHQUFiLENBQWlCLENBQUM7QUFBRS9EO0FBQUYsS0FBRCxNQUFrQjtBQUN4Q0MsVUFBSSxFQUFFRCxPQUFPLENBQUNDLElBRDBCO0FBRXhDSyxZQUFNLEVBQUVOLE9BQU8sQ0FBQ007QUFGd0IsS0FBbEIsQ0FBakI7QUFQQyxHQUFWO0FBWUEsU0FBTzROLENBQVA7QUFDRDs7QUFDRCxTQUFTRixnQkFBVCxDQUEwQmxILENBQTFCLEVBQTZCO0FBQzNCLFNBQU87QUFDTHpFLE1BQUUsRUFBRXlFLENBQUMsQ0FBQ3pFLEVBREQ7QUFFTHlLLFFBQUksRUFBRVMsT0FGRDtBQUdMekssUUFBSSxFQUFFZ0UsQ0FBQyxDQUFDaEUsSUFISDtBQUlMekQsVUFBTSxFQUFFeUgsQ0FBQyxDQUFDekg7QUFKTCxHQUFQO0FBTUQ7O0FBRWMsU0FBU3NNLE1BQVQsR0FBa0I7QUFDL0IsUUFBTS9NLEdBQUcsR0FBRyxFQUFaO0FBQ0EsTUFBSXVQLE1BQU0sR0FBRyxFQUFiO0FBQ0EsTUFBSVAsSUFBSSxHQUFHLEVBQVg7QUFDQSxNQUFJUSxVQUFVLEdBQUcsS0FBakI7QUFDQSxNQUFJQyxPQUFPLEdBQUcsS0FBZDtBQUNBLFFBQU1DLFNBQVMsR0FBRyxFQUFsQjs7QUFFQTFQLEtBQUcsQ0FBQzZOLEVBQUosR0FBUzhCLFFBQVEsSUFBSUQsU0FBUyxDQUFDcE8sSUFBVixDQUFlcU8sUUFBZixDQUFyQjs7QUFDQTNQLEtBQUcsQ0FBQzZDLEdBQUosR0FBVSxDQUFDK00sR0FBRCxFQUFNdEMsSUFBTixFQUFZdUMsSUFBWixLQUFxQjtBQUM3QixRQUFJLENBQUNKLE9BQUwsRUFBYyxPQUFPLElBQVA7O0FBQ2QsUUFBSXhILHFEQUFNLENBQUMySCxHQUFELENBQVYsRUFBaUI7QUFDZkEsU0FBRyxHQUFHaEIsYUFBYSxDQUFDZ0IsR0FBRCxDQUFuQjtBQUNELEtBRkQsTUFFTyxJQUFJekgsc0RBQU8sQ0FBQ3lILEdBQUQsQ0FBWCxFQUFrQjtBQUN2QkEsU0FBRyxHQUFHVixjQUFjLENBQUNVLEdBQUQsQ0FBcEI7QUFDRCxLQUZNLE1BRUEsSUFBSTVILHdEQUFTLENBQUM0SCxHQUFELENBQWIsRUFBb0I7QUFDekJBLFNBQUcsR0FBR1QsZ0JBQWdCLENBQUNTLEdBQUQsQ0FBdEI7QUFDRCxLQUZNLE1BRUEsSUFBSXhILHdEQUFTLENBQUN3SCxHQUFELENBQWIsRUFBb0I7QUFDekJBLFNBQUcsR0FBR1IsZ0JBQWdCLENBQUNRLEdBQUQsQ0FBdEI7QUFDRCxLQUZNLE1BRUE7QUFDTDVCLGFBQU8sQ0FBQ3FCLElBQVIsQ0FBYSwrQkFBYixFQUE4Q08sR0FBOUMsRUFBbUR0QyxJQUFuRDtBQUNEOztBQUNEMEIsUUFBSSxDQUFDMU4sSUFBTCxDQUFVO0FBQ1JzTyxTQURRO0FBRVJ0QyxVQUZRO0FBR1J1QyxVQUFJLEVBQUVmLHlEQUFRLENBQUNlLElBQUQ7QUFITixLQUFWOztBQUtBLFFBQUksQ0FBQ0wsVUFBTCxFQUFpQjtBQUNmQSxnQkFBVSxHQUFHLElBQWI7QUFDQU0sYUFBTyxDQUFDQyxPQUFSLEdBQWtCckcsSUFBbEIsQ0FBdUIsTUFBTTtBQUMzQixjQUFNbkYsQ0FBQyxHQUFHdkUsR0FBRyxDQUFDZ1EsS0FBSixDQUFVaEIsSUFBVixDQUFWO0FBQ0FRLGtCQUFVLEdBQUcsS0FBYjtBQUNBUixZQUFJLEdBQUcsRUFBUDtBQUNBVSxpQkFBUyxDQUFDck4sT0FBVixDQUFrQjROLENBQUMsSUFBSUEsQ0FBQyxDQUFDMUwsQ0FBRCxDQUF4QjtBQUNELE9BTEQ7QUFNRDtBQUNGLEdBM0JEOztBQTRCQXZFLEtBQUcsQ0FBQ2dRLEtBQUosR0FBWUUsT0FBTyxJQUFJO0FBQ3JCLFFBQUksQ0FBQ1QsT0FBTCxFQUFjLE9BQU8sSUFBUDtBQUNkLFVBQU1PLEtBQUssR0FBR2xCLHlEQUFRLENBQUNvQixPQUFELENBQXRCO0FBQ0FYLFVBQU0sQ0FBQ2pPLElBQVAsQ0FBWTBPLEtBQVo7QUFDQSxXQUFPQSxLQUFQO0FBQ0QsR0FMRDs7QUFNQWhRLEtBQUcsQ0FBQ21RLEdBQUosR0FBVSxNQUFPWixNQUFNLENBQUMzTyxNQUFQLEdBQWdCLENBQWhCLEdBQW9CMk8sTUFBTSxDQUFDQSxNQUFNLENBQUMzTyxNQUFQLEdBQWdCLENBQWpCLENBQTFCLEdBQWdELElBQWpFOztBQUNBWixLQUFHLENBQUN1UCxNQUFKLEdBQWEsTUFBTUEsTUFBbkI7O0FBQ0F2UCxLQUFHLENBQUNhLEtBQUosR0FBWSxNQUFNO0FBQ2hCME8sVUFBTSxHQUFHLEVBQVQ7QUFDQUUsV0FBTyxHQUFHLEtBQVY7QUFDRCxHQUhEOztBQUlBelAsS0FBRyxDQUFDNE4sTUFBSixHQUFhLE1BQU07QUFDakI2QixXQUFPLEdBQUcsSUFBVjtBQUNELEdBRkQ7O0FBR0F6UCxLQUFHLENBQUNvUSxPQUFKLEdBQWMsTUFBTTtBQUNsQlgsV0FBTyxHQUFHLEtBQVY7QUFDRCxHQUZEOztBQUdBelAsS0FBRyxDQUFDb0UsVUFBSixHQUFpQixDQUFDWCxFQUFELEVBQUtTLElBQUwsS0FBYztBQUM3QjhLLFFBQUksQ0FBQzNNLE9BQUwsQ0FBYWdPLE1BQU0sSUFBSTtBQUNyQixVQUFJQSxNQUFNLENBQUNULEdBQVAsQ0FBV25NLEVBQVgsS0FBa0JBLEVBQXRCLEVBQTBCO0FBQ3hCNE0sY0FBTSxDQUFDVCxHQUFQLENBQVcxTCxJQUFYLEdBQWtCQSxJQUFsQjtBQUNEO0FBQ0YsS0FKRDtBQUtBcUwsVUFBTSxDQUFDbE4sT0FBUCxDQUFlMk4sS0FBSyxJQUFJO0FBQ3RCQSxXQUFLLENBQUMzTixPQUFOLENBQWNnTyxNQUFNLElBQUk7QUFDdEIsWUFBSUEsTUFBTSxDQUFDVCxHQUFQLENBQVduTSxFQUFYLEtBQWtCQSxFQUF0QixFQUEwQjtBQUN4QjRNLGdCQUFNLENBQUNULEdBQVAsQ0FBVzFMLElBQVgsR0FBa0JBLElBQWxCO0FBQ0Q7QUFDRixPQUpEO0FBS0QsS0FORDtBQU9ELEdBYkQ7O0FBZUEsU0FBT2xFLEdBQVA7QUFDRCxDOzs7Ozs7Ozs7Ozs7QUMzSUQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFFZSxTQUFTeU0sSUFBVCxDQUFjNkQsSUFBZCxFQUFvQixHQUFHQyxRQUF2QixFQUFpQztBQUM5QyxRQUFNck0sSUFBSSxHQUFHeUUsMERBQVcsQ0FBQzJILElBQUQsQ0FBeEI7O0FBQ0EsUUFBTUUsWUFBWSxHQUFHLFVBQVNDLFNBQVMsR0FBRyxFQUFyQixFQUF5QjtBQUM1QyxVQUFNQyxJQUFJLEdBQUcsVUFBU0MsVUFBVCxFQUFxQjtBQUNoQyxVQUFJLENBQUNDLFFBQUQsRUFBV0MsV0FBWCxJQUEwQkMsc0RBQVEsQ0FBQyxJQUFELENBQXRDO0FBQ0EsWUFBTSxDQUFDQyxPQUFELEVBQVVDLFVBQVYsSUFBd0JGLHNEQUFRLENBQUMsSUFBRCxDQUF0QztBQUNBLFlBQU1HLE9BQU8sR0FBR0Msb0RBQU0sQ0FBQyxJQUFELENBQXRCLENBSGdDLENBS2hDOztBQUNBQyw2REFBUyxDQUFDLE1BQU07QUFDZCxZQUFJUCxRQUFKLEVBQWM7QUFDWkEsa0JBQVEsQ0FBQ1EsTUFBVCxDQUFnQlQsVUFBaEI7QUFDRDtBQUNGLE9BSlEsRUFJTixDQUFDQSxVQUFELENBSk0sQ0FBVCxDQU5nQyxDQVloQzs7QUFDQVEsNkRBQVMsQ0FBQyxNQUFNO0FBQ2RQLGdCQUFRLEdBQUdTLHdEQUFTLENBQUNuTixJQUFELEVBQU9vTixLQUFLLElBQUk7QUFDbEMsY0FBSSxDQUFDTCxPQUFMLEVBQWM7O0FBQ2QsY0FBSUssS0FBSyxLQUFLLElBQWQsRUFBb0I7QUFDbEJOLHNCQUFVLENBQUMsSUFBRCxDQUFWO0FBQ0QsV0FGRCxNQUVPO0FBQ0xBLHNCQUFVLENBQUNNLEtBQUQsQ0FBVjtBQUNEO0FBQ0YsU0FQbUIsRUFPakIsR0FBR2YsUUFQYyxDQUFwQjs7QUFTQSxZQUFJRSxTQUFTLElBQUlBLFNBQVMsQ0FBQzdQLE1BQVYsR0FBbUIsQ0FBcEMsRUFBdUM7QUFDckNnUSxrQkFBUSxHQUFHQSxRQUFRLENBQUM3RyxJQUFULENBQWMsR0FBRzBHLFNBQWpCLENBQVg7QUFDRDs7QUFDREcsZ0JBQVEsQ0FBQzFNLElBQVQsR0FBZ0JBLElBQWhCO0FBRUEyTSxtQkFBVyxDQUFDRCxRQUFELENBQVg7QUFDQUEsZ0JBQVEsQ0FBQ1csS0FBVCxDQUFlWixVQUFmO0FBQ0FNLGVBQU8sQ0FBQ08sT0FBUixHQUFrQixJQUFsQjtBQUVBLGVBQU8sWUFBVztBQUNoQlAsaUJBQU8sQ0FBQ08sT0FBUixHQUFrQixLQUFsQjtBQUNBWixrQkFBUSxDQUFDYSxPQUFUO0FBQ0QsU0FIRDtBQUlELE9BdkJRLEVBdUJOLEVBdkJNLENBQVQ7QUF5QkEsYUFBT1YsT0FBTyxLQUFLLElBQVosR0FBbUIsSUFBbkIsR0FBMEJXLDRDQUFLLENBQUNDLGFBQU4sQ0FBb0JyQixJQUFwQixFQUEwQlMsT0FBMUIsQ0FBakM7QUFDRCxLQXZDRDs7QUF5Q0FMLFFBQUksQ0FBQ2tCLFdBQUwsR0FBb0IsUUFBTzFOLElBQUssRUFBaEM7O0FBQ0F3TSxRQUFJLENBQUMzRyxJQUFMLEdBQVksQ0FBQyxHQUFHQyxJQUFKLEtBQWF3RyxZQUFZLENBQUN4RyxJQUFELENBQXJDOztBQUVBLFdBQU8wRyxJQUFQO0FBQ0QsR0E5Q0Q7O0FBZ0RBLFNBQU9GLFlBQVksRUFBbkI7QUFDRCxDOzs7Ozs7Ozs7Ozs7QUN4REQ7QUFBQTtBQUNBLFNBQVNxQixRQUFULEdBQW9CO0FBQ2xCLFFBQU03UixHQUFHLEdBQUcsRUFBWjtBQUNBLE1BQUk4UixRQUFRLEdBQUcsRUFBZjs7QUFFQTlSLEtBQUcsQ0FBQzhNLGFBQUosR0FBb0IsQ0FBQ29CLElBQUQsRUFBTzFGLElBQVAsS0FBZ0I7QUFDbEMsUUFBSXNKLFFBQVEsQ0FBQzVELElBQUQsQ0FBWixFQUFvQjtBQUNsQixZQUFNLElBQUkzSyxLQUFKLENBQVcseUJBQXdCMkssSUFBSyxtQkFBeEMsQ0FBTjtBQUNEOztBQUNENEQsWUFBUSxDQUFDNUQsSUFBRCxDQUFSLEdBQWlCMUYsSUFBakI7QUFDRCxHQUxEOztBQU1BeEksS0FBRyxDQUFDK1IsZUFBSixHQUFzQjdELElBQUksSUFBSTtBQUM1QixRQUFJLENBQUM0RCxRQUFRLENBQUM1RCxJQUFELENBQWIsRUFBcUI7QUFDbkIsWUFBTSxJQUFJM0ssS0FBSixDQUNILG1DQUFrQzJLLElBQUssa0JBRHBDLENBQU47QUFHRDs7QUFDRCxXQUFPNEQsUUFBUSxDQUFDNUQsSUFBRCxDQUFmO0FBQ0QsR0FQRDs7QUFRQWxPLEtBQUcsQ0FBQzRNLE9BQUosR0FBYyxDQUFDc0IsSUFBRCxFQUFPLEdBQUc1RyxJQUFWLEtBQW1CO0FBQy9CLFFBQUksQ0FBQ3dLLFFBQVEsQ0FBQzVELElBQUQsQ0FBYixFQUFxQjtBQUNuQixZQUFNLElBQUkzSyxLQUFKLENBQVcsbUNBQWtDMkssSUFBSyxJQUFsRCxDQUFOO0FBQ0Q7O0FBQ0QsV0FBTzRELFFBQVEsQ0FBQzVELElBQUQsQ0FBUixDQUFlLEdBQUc1RyxJQUFsQixDQUFQO0FBQ0QsR0FMRDs7QUFNQXRILEtBQUcsQ0FBQ2EsS0FBSixHQUFZLE1BQU07QUFDaEJpUixZQUFRLEdBQUcsRUFBWDtBQUNELEdBRkQ7O0FBR0E5UixLQUFHLENBQUNnUyxLQUFKLEdBQVksT0FBTztBQUNqQkMsZ0JBQVksRUFBRUMsTUFBTSxDQUFDQyxJQUFQLENBQVlMLFFBQVo7QUFERyxHQUFQLENBQVo7O0FBSUEsU0FBTzlSLEdBQVA7QUFDRDs7QUFFRCxNQUFNa0ksQ0FBQyxHQUFHMkosUUFBUSxFQUFsQjtBQUVlM0osZ0VBQWYsRTs7Ozs7Ozs7Ozs7O0FDckNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUVBO0FBbUJBOztBQVFBLE1BQU1rSyxRQUFRLEdBQUcsVUFBU0MsY0FBVCxFQUF5QjtBQUN4QyxNQUFJckQsSUFBSSxHQUFHLEVBQVg7QUFDQSxNQUFJUSxVQUFVLEdBQUcsS0FBakI7QUFDQSxNQUFJOEMsTUFBTSxHQUFHLElBQWI7QUFFQSxTQUFPO0FBQ0xoUixRQUFJLENBQUNpUixPQUFELEVBQVU7QUFDWixVQUFJQSxPQUFPLEtBQUt0TSw2Q0FBWixJQUFzQnNNLE9BQU8sS0FBS3ZNLDRDQUF0QyxFQUE2QztBQUMzQztBQUNEOztBQUNEZ0osVUFBSSxHQUFHd0QseURBQVUsQ0FBQ3hELElBQUQsRUFBT3VELE9BQVAsQ0FBakI7O0FBQ0EsVUFBSSxDQUFDL0MsVUFBTCxFQUFpQjtBQUNmQSxrQkFBVSxHQUFHLElBQWI7QUFDQU0sZUFBTyxDQUFDQyxPQUFSLEdBQWtCckcsSUFBbEIsQ0FBdUIsTUFBTTtBQUMzQixjQUFJNEksTUFBSixFQUFZO0FBQ1ZELDBCQUFjLENBQUNyRCxJQUFELENBQWQ7QUFDRDs7QUFDRFEsb0JBQVUsR0FBRyxLQUFiO0FBQ0QsU0FMRDtBQU1EO0FBQ0YsS0FmSTs7QUFnQkxqRSxXQUFPLEdBQUc7QUFDUitHLFlBQU0sR0FBRyxLQUFUO0FBQ0QsS0FsQkk7O0FBbUJMdEQsUUFBSSxHQUFHO0FBQ0wsYUFBT0EsSUFBUDtBQUNEOztBQXJCSSxHQUFQO0FBdUJELENBNUJEOztBQTZCTyxTQUFTdkMsSUFBVCxDQUFjZ0csUUFBZCxFQUF3QixHQUFHbEMsUUFBM0IsRUFBcUM7QUFDMUMsUUFBTXJNLElBQUksR0FBR3lFLDBEQUFXLENBQUM4SixRQUFELENBQXhCO0FBQ0EsU0FBT3BCLFNBQVMsQ0FBQ25OLElBQUQsRUFBT3VPLFFBQVAsRUFBaUIsR0FBR2xDLFFBQXBCLENBQWhCO0FBQ0Q7QUFFTSxTQUFTYyxTQUFULENBQW1Cbk4sSUFBbkIsRUFBeUJ1TyxRQUF6QixFQUFtQyxHQUFHbEMsUUFBdEMsRUFBZ0Q7QUFDckQsUUFBTXhCLFFBQVEsR0FBR3FELFFBQVEsQ0FBQ25TLEtBQUssSUFBSTtBQUNqQ3dTLFlBQVEsQ0FBQ3hTLEtBQUQsQ0FBUjtBQUNBMkMsaURBQU0sQ0FBQ0MsR0FBUCxDQUFXN0MsR0FBWCxFQUFnQixlQUFoQixFQUFpQ0MsS0FBakM7QUFDRCxHQUh3QixDQUF6QjtBQUlBLFFBQU13RCxFQUFFLEdBQUdJLG9EQUFLLENBQUUsR0FBRUssSUFBSyxPQUFULENBQWhCO0FBQ0EsUUFBTWxFLEdBQUcsR0FBRztBQUNWeUQsTUFEVTtBQUVWUyxRQUZVO0FBR1YsYUFBUyxJQUhDO0FBSVYwRSxZQUFRLEVBQUUsRUFKQTtBQUtWbUc7QUFMVSxHQUFaO0FBT0EsTUFBSTJELFFBQVEsR0FBRyxFQUFmO0FBQ0EsTUFBSWpDLFNBQVMsR0FBRyxFQUFoQjtBQUNBLE1BQUlrQyxhQUFhLEdBQUcsRUFBcEI7O0FBQ0EsUUFBTUMsUUFBUSxHQUFHLFVBQVN0RCxDQUFULEVBQVk7QUFDM0J0UCxPQUFHLENBQUM0SSxRQUFKLENBQWF0SCxJQUFiLENBQWtCZ08sQ0FBbEI7QUFDQSxXQUFPQSxDQUFQO0FBQ0QsR0FIRDs7QUFJQSxRQUFNM0wsS0FBSyxHQUFHOEcsWUFBWSxJQUFJbUksUUFBUSxDQUFDQyxvREFBSyxDQUFDcEksWUFBRCxFQUFlaEgsRUFBZixDQUFOLENBQXRDOztBQUNBLFFBQU0vRCxPQUFPLEdBQUdvVCxDQUFDLElBQUlGLFFBQVEsQ0FBQ0csc0RBQU8sQ0FBQ0QsQ0FBRCxFQUFLLFdBQVU1TyxJQUFLLEVBQXBCLEVBQXVCVCxFQUF2QixDQUFSLENBQTdCOztBQUNBLFFBQU1ILEtBQUssR0FBR3dQLENBQUMsSUFBSUYsUUFBUSxDQUFDSSxvREFBSyxDQUFDRixDQUFELEVBQUssU0FBUTVPLElBQUssRUFBbEIsRUFBcUJULEVBQXJCLENBQU4sQ0FBM0I7O0FBQ0EsUUFBTWhFLFFBQVEsR0FBR3FULENBQUMsSUFBSUYsUUFBUSxDQUFDSyx1REFBUSxDQUFDSCxDQUFELEVBQUssWUFBVzVPLElBQUssRUFBckIsRUFBd0JULEVBQXhCLENBQVQsQ0FBOUI7O0FBQ0EsUUFBTWhCLFNBQVMsR0FBRyxVQUFTZ0UsRUFBVCxFQUFhK0IsSUFBYixFQUFtQjtBQUNuQyxRQUFJLEVBQUUvQixFQUFFLENBQUNoRCxFQUFILElBQVNrUCxhQUFYLENBQUosRUFBK0I7QUFDN0JBLG1CQUFhLENBQUNsTSxFQUFFLENBQUNoRCxFQUFKLENBQWIsR0FBdUIvQixxREFBTSxDQUFDK0UsRUFBRCxFQUFLK0IsSUFBTCxFQUFXO0FBQUU3RixtQkFBVyxFQUFFO0FBQWYsT0FBWCxDQUE3QjtBQUNEO0FBQ0YsR0FKRDs7QUFLQSxRQUFNdVEsWUFBWSxHQUFHeFQsT0FBTyxDQUFDLENBQUQsQ0FBSSxNQUFoQztBQUNBLFFBQU15VCxhQUFhLEdBQUd6VCxPQUFPLENBQUMsQ0FBRCxDQUFJLE9BQWpDOztBQUVBLFFBQU0wVCxtQkFBbUIsR0FBR25ULEtBQUssSUFDL0JpUyxNQUFNLENBQUNDLElBQVAsQ0FBWWxTLEtBQVosRUFBbUJnQixNQUFuQixDQUEwQixDQUFDb1MsR0FBRCxFQUFNNU8sR0FBTixLQUFjO0FBQ3RDLFVBQU1tQyxFQUFFLEdBQUd5Qiw0REFBYSxDQUFDcEksS0FBSyxDQUFDd0UsR0FBRCxDQUFOLEVBQWEsS0FBYixDQUF4Qjs7QUFDQSxRQUFJbUMsRUFBRSxLQUFLLElBQVgsRUFBaUI7QUFDZm5FLGVBQVMsQ0FBQ21FLEVBQUQsRUFBS2hILENBQUMsSUFBSW1GLG1EQUFJLENBQUNtTyxZQUFELEVBQWU7QUFBRSxTQUFDek8sR0FBRCxHQUFPN0U7QUFBVCxPQUFmLENBQWQsQ0FBVDtBQUNELEtBRkQsTUFFTyxJQUFJdUksc0RBQU8sQ0FBQ2xJLEtBQUssQ0FBQ3dFLEdBQUQsQ0FBTixDQUFYLEVBQXlCO0FBQzlCaEMsZUFBUyxDQUFDeEMsS0FBSyxDQUFDd0UsR0FBRCxDQUFMLENBQVdpSCxPQUFaLEVBQXFCOUwsQ0FBQyxJQUFJbUYsbURBQUksQ0FBQ21PLFlBQUQsRUFBZTtBQUFFLFNBQUN6TyxHQUFELEdBQU83RTtBQUFULE9BQWYsQ0FBOUIsQ0FBVDtBQUNELEtBRk0sTUFFQTtBQUNMeVQsU0FBRyxDQUFDNU8sR0FBRCxDQUFILEdBQVd4RSxLQUFLLENBQUN3RSxHQUFELENBQWhCO0FBQ0Q7O0FBQ0QsV0FBTzRPLEdBQVA7QUFDRCxHQVZELEVBVUcsRUFWSCxDQURGOztBQWFBclQsS0FBRyxDQUFDdVIsS0FBSixHQUFZLFVBQVNELEtBQUssR0FBRyxFQUFqQixFQUFxQjtBQUMvQmdDLGdFQUFhLENBQUNoQyxLQUFELENBQWI7QUFDQXZNLHVEQUFJLENBQUNvTyxhQUFELEVBQWdCN0IsS0FBaEIsQ0FBSjtBQUNBN08sYUFBUyxDQUFDMFEsYUFBRCxFQUFnQkksUUFBUSxJQUFJO0FBQ25DeE8seURBQUksQ0FBQ21PLFlBQUQsRUFBZUssUUFBZixDQUFKO0FBQ0QsS0FGUSxDQUFUO0FBR0E5USxhQUFTLENBQUN5USxZQUFELEVBQWVuRSxRQUFRLENBQUN6TixJQUF4QixDQUFUO0FBQ0F0QixPQUFHLENBQUM0SSxRQUFKLEdBQWU1SSxHQUFHLENBQUM0SSxRQUFKLENBQWE0SyxNQUFiLENBQ2JqRCxRQUFRLENBQUNwTCxHQUFULENBQWErQyxDQUFDLElBQ1pLLGlEQUFFLENBQ0FMLENBREEsRUFFQWhELE1BQU0sSUFBSTtBQUNSLFVBQUksT0FBT0EsTUFBUCxLQUFrQixVQUF0QixFQUFrQztBQUNoQ3dOLGdCQUFRLENBQUNwUixJQUFULENBQWM0RCxNQUFkO0FBQ0Q7QUFDRixLQU5ELEVBT0EsQ0FDRTtBQUNFdU8sWUFBTSxFQUFFeFQsS0FBSyxJQUFJO0FBQ2ZxVCxvRUFBYSxDQUFDclQsS0FBRCxDQUFiO0FBQ0E4RSwyREFBSSxDQUFDbU8sWUFBRCxFQUFlRSxtQkFBbUIsQ0FBQ25ULEtBQUQsQ0FBbEMsQ0FBSjtBQUNELE9BSkg7QUFLRTBELFdBTEY7QUFNRUwsV0FORjtBQU9FNUQsYUFQRjtBQVFFRCxjQVJGO0FBU0U2UixXQUFLLEVBQUU2QixhQVRUO0FBVUUsU0FBRzFDO0FBVkwsS0FERixDQVBBLEVBcUJBaE4sRUFyQkEsQ0FESixDQURhLENBQWY7O0FBMkJBLFFBQUksQ0FBQ2lRLDREQUFhLENBQUNqRCxTQUFELENBQWxCLEVBQStCO0FBQzdCMUwseURBQUksQ0FBQ21PLFlBQUQsRUFBZUUsbUJBQW1CLENBQUMzQyxTQUFELENBQWxDLENBQUo7QUFDRDs7QUFDRDdOLGlEQUFNLENBQUNDLEdBQVAsQ0FBVzdDLEdBQVgsRUFBZ0IsY0FBaEIsRUFBZ0NzUixLQUFoQztBQUNELEdBdENEOztBQXdDQXRSLEtBQUcsQ0FBQ3lSLE9BQUosR0FBYyxZQUFXO0FBQ3ZCaUIsWUFBUSxDQUFDclEsT0FBVCxDQUFpQnVJLENBQUMsSUFBSUEsQ0FBQyxFQUF2QjtBQUNBOEgsWUFBUSxHQUFHLEVBQVg7QUFDQVIsVUFBTSxDQUFDQyxJQUFQLENBQVlRLGFBQVosRUFBMkJ0USxPQUEzQixDQUFtQ3NSLEtBQUssSUFBSTtBQUMxQ2hCLG1CQUFhLENBQUNnQixLQUFELENBQWI7QUFDRCxLQUZEO0FBR0FoQixpQkFBYSxHQUFHLEVBQWhCO0FBQ0EzUyxPQUFHLENBQUM0SSxRQUFKLENBQWF2RyxPQUFiLENBQXFCdUksQ0FBQyxJQUFJO0FBQ3hCLFVBQUl6QyxzREFBTyxDQUFDeUMsQ0FBRCxDQUFYLEVBQWdCO0FBQ2RBLFNBQUMsQ0FBQ1csT0FBRjtBQUNELE9BRkQsTUFFTyxJQUFJbkQsd0RBQVMsQ0FBQ3dDLENBQUQsQ0FBYixFQUFrQjtBQUN2QkEsU0FBQyxDQUFDL0IsSUFBRjtBQUNELE9BRk0sTUFFQSxJQUFJYix3REFBUyxDQUFDNEMsQ0FBRCxDQUFiLEVBQWtCO0FBQ3ZCakUsNERBQUssQ0FBQ2lFLENBQUQsQ0FBTDtBQUNEO0FBQ0YsS0FSRDtBQVNBNUssT0FBRyxDQUFDNEksUUFBSixHQUFlLEVBQWY7QUFDQW1HLFlBQVEsQ0FBQ3hELE9BQVQ7QUFDQTVHLCtDQUFJLENBQUNvQyxNQUFMLENBQVkvRyxHQUFaO0FBQ0E0QyxpREFBTSxDQUFDQyxHQUFQLENBQVc3QyxHQUFYLEVBQWdCLGdCQUFoQjtBQUNELEdBcEJEOztBQXNCQUEsS0FBRyxDQUFDb1IsTUFBSixHQUFhLFVBQVNFLEtBQUssR0FBRyxFQUFqQixFQUFxQjtBQUNoQ2dDLGdFQUFhLENBQUNoQyxLQUFELENBQWI7QUFDQXZNLHVEQUFJLENBQUNvTyxhQUFELEVBQWdCN0IsS0FBaEIsQ0FBSjtBQUNBMU8saURBQU0sQ0FBQ0MsR0FBUCxDQUFXN0MsR0FBWCxFQUFnQixjQUFoQixFQUFnQ3NSLEtBQWhDO0FBQ0QsR0FKRDs7QUFNQXRSLEtBQUcsQ0FBQytKLElBQUosR0FBVyxDQUFDLEdBQUdDLElBQUosS0FBYTtBQUN0QmhLLE9BQUcsQ0FBQzRULGNBQUosQ0FBbUI1SixJQUFuQjs7QUFDQSxXQUFPaEssR0FBUDtBQUNELEdBSEQ7O0FBS0FBLEtBQUcsQ0FBQzZULElBQUosR0FBVzFPLEdBQUcsSUFBSTtBQUNoQixVQUFNMk8sV0FBVyxHQUFHckgsSUFBSSxDQUFDZ0csUUFBRCxFQUFXLEdBQUdsQyxRQUFkLENBQXhCOztBQUVBdUQsZUFBVyxDQUFDRixjQUFaLENBQTJCLENBQUN6TyxHQUFELENBQTNCOztBQUNBLFdBQU8yTyxXQUFQO0FBQ0QsR0FMRDs7QUFPQTlULEtBQUcsQ0FBQzRULGNBQUosR0FBcUI1SixJQUFJLElBQUk7QUFDM0IsVUFBTUMsV0FBVyxHQUFHRCxJQUFJLENBQUMvSSxNQUFMLENBQVksQ0FBQ0MsR0FBRCxFQUFNa0IsSUFBTixLQUFlO0FBQzdDLFVBQUksT0FBT0EsSUFBUCxLQUFnQixRQUFwQixFQUE4QjtBQUM1QmxCLFdBQUcsR0FBRyxFQUFFLEdBQUdBLEdBQUw7QUFBVSxXQUFDa0IsSUFBRCxHQUFROEgsa0RBQUcsQ0FBQzlILElBQUQ7QUFBckIsU0FBTjtBQUNELE9BRkQsTUFFTztBQUNMbEIsV0FBRyxHQUFHLEVBQUUsR0FBR0EsR0FBTDtBQUFVLGFBQUdrQjtBQUFiLFNBQU47QUFDRDs7QUFDRCxhQUFPbEIsR0FBUDtBQUNELEtBUG1CLEVBT2pCLEVBUGlCLENBQXBCO0FBUUF1UCxhQUFTLEdBQUcsRUFBRSxHQUFHQSxTQUFMO0FBQWdCLFNBQUd4RztBQUFuQixLQUFaO0FBQ0QsR0FWRDs7QUFZQXRGLDZDQUFJLENBQUNDLEdBQUwsQ0FBUzVFLEdBQVQ7QUFDQTRDLCtDQUFNLENBQUNDLEdBQVAsQ0FBVzdDLEdBQVgsRUFBZ0IsY0FBaEI7QUFFQSxTQUFPQSxHQUFQO0FBQ0QsQzs7Ozs7Ozs7Ozs7O0FDNU1EO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBRWUsU0FBUzhPLFFBQVQsQ0FBa0JpRixTQUFsQixFQUE2QkMsa0JBQWtCLEdBQUcsS0FBbEQsRUFBeUQ7QUFDdEUsTUFBSTlPLE1BQUo7O0FBRUEsTUFBSTtBQUNGQSxVQUFNLEdBQUcrTyxJQUFJLENBQUNDLEtBQUwsQ0FDUEMsNkRBQVksQ0FBQ0MsU0FBYixDQUNFTCxTQURGLEVBRUUsVUFBU3RQLEdBQVQsRUFBY3hFLEtBQWQsRUFBcUI7QUFDbkIsVUFBSSxPQUFPQSxLQUFQLEtBQWlCLFVBQXJCLEVBQWlDO0FBQy9CLGVBQU9BLEtBQUssQ0FBQ2lFLElBQU4sS0FBZSxFQUFmLEdBQ0gsYUFERyxHQUVGLFlBQVdqRSxLQUFLLENBQUNpRSxJQUFLLElBRjNCO0FBR0Q7O0FBQ0QsVUFBSWpFLEtBQUssWUFBWXNELEtBQXJCLEVBQTRCO0FBQzFCLGVBQU84USw4REFBYyxDQUFDcFUsS0FBRCxDQUFyQjtBQUNEOztBQUNELGFBQU9BLEtBQVA7QUFDRCxLQVpILEVBYUVpRCxTQWJGLEVBY0UsSUFkRixDQURPLENBQVQ7QUFrQkQsR0FuQkQsQ0FtQkUsT0FBT29SLEtBQVAsRUFBYztBQUNkLFFBQUlOLGtCQUFKLEVBQXdCO0FBQ3RCaEcsYUFBTyxDQUFDbkwsR0FBUixDQUFZeVIsS0FBWjtBQUNEOztBQUNEcFAsVUFBTSxHQUFHLElBQVQ7QUFDRDs7QUFDRCxTQUFPQSxNQUFQO0FBQ0QsQzs7Ozs7Ozs7Ozs7O0FDaENEO0FBQUE7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFzQkEsSUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBcVAsV0FBVyxHQUFHLEdBTGQ7QUFBQSxJQU1BQyxlQUFlLEdBQUcsUUFBUSxDQUN4QixNQUFNRCxXQUFXLENBQUNFLFVBQVosQ0FBdUIsQ0FBdkIsRUFBMEJDLFFBQTFCLENBQW1DLEVBQW5DLENBRGtCLEVBRXhCQyxLQUZ3QixDQUVsQixDQUFDLENBRmlCLENBTjFCO0FBQUEsSUFTQUMsc0JBQXNCLEdBQUcsT0FBT0osZUFUaEM7QUFBQSxJQVVBSyxhQUFhLEdBQUcsSUFBSUMsTUFBSixDQUFXTixlQUFYLEVBQTRCLEdBQTVCLENBVmhCO0FBQUEsSUFXQU8saUJBQWlCLEdBQUcsSUFBSUQsTUFBSixDQUFXRixzQkFBWCxFQUFtQyxHQUFuQyxDQVhwQjtBQUFBLElBYUFJLDBCQUEwQixHQUFHLElBQUlGLE1BQUosQ0FBVyxvQkFBb0JGLHNCQUEvQixDQWI3QjtBQUFBLElBZUFLLE9BQU8sR0FBRyxHQUFHQSxPQUFILElBQWMsVUFBU3JWLENBQVQsRUFBVztBQUNqQyxPQUFJLElBQUl1SixDQUFDLEdBQUMsS0FBS3ZJLE1BQWYsRUFBc0J1SSxDQUFDLE1BQUksS0FBS0EsQ0FBTCxNQUFVdkosQ0FBckMsRUFBd0M7O0FBQ3hDLFNBQU91SixDQUFQO0FBQ0QsQ0FsQkQ7QUFBQSxJQW1CQStMLE9BQU8sR0FBR0MsTUFuQlYsQ0FtQmtCO0FBQ0E7QUFDQTtBQXJCbEI7O0FBd0JBLFNBQVNDLGdCQUFULENBQTBCblYsS0FBMUIsRUFBaUNvVixRQUFqQyxFQUEyQ3RGLE9BQTNDLEVBQW9EO0FBQ3BELE1BQ0V1RixPQUFPLEdBQUcsQ0FBQyxDQUFDRCxRQURkO0FBQUEsTUFFRUUsSUFBSSxHQUFHLEVBRlQ7QUFBQSxNQUdFQyxHQUFHLEdBQUksQ0FBQ3ZWLEtBQUQsQ0FIVDtBQUFBLE1BSUV3VixJQUFJLEdBQUcsQ0FBQ3hWLEtBQUQsQ0FKVDtBQUFBLE1BS0V5VixJQUFJLEdBQUcsQ0FBQzNGLE9BQU8sR0FBR3dFLFdBQUgsR0FBaUIsWUFBekIsQ0FMVDtBQUFBLE1BTUVvQixJQUFJLEdBQUcxVixLQU5UO0FBQUEsTUFPRTJWLEdBQUcsR0FBSSxDQVBUO0FBQUEsTUFRRXpNLENBUkY7QUFBQSxNQVFLME0sRUFSTDs7QUFVQSxNQUFJUCxPQUFKLEVBQWE7QUFDWE8sTUFBRSxHQUFHLE9BQU9SLFFBQVAsS0FBb0IsUUFBcEIsR0FDSCxVQUFVNVEsR0FBVixFQUFleEUsS0FBZixFQUFzQjtBQUNwQixhQUFPd0UsR0FBRyxLQUFLLEVBQVIsSUFBYzRRLFFBQVEsQ0FBQ0osT0FBVCxDQUFpQnhRLEdBQWpCLElBQXdCLENBQXRDLEdBQTBDLEtBQUssQ0FBL0MsR0FBbUR4RSxLQUExRDtBQUNELEtBSEUsR0FJSG9WLFFBSkY7QUFLRDs7QUFDRCxTQUFPLFVBQVM1USxHQUFULEVBQWN4RSxLQUFkLEVBQXFCO0FBQzFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBSXFWLE9BQUosRUFBYXJWLEtBQUssR0FBRzRWLEVBQUUsQ0FBQ3pPLElBQUgsQ0FBUSxJQUFSLEVBQWMzQyxHQUFkLEVBQW1CeEUsS0FBbkIsQ0FBUixDQUxhLENBTzFCO0FBQ0E7O0FBQ0EsUUFBSXdFLEdBQUcsS0FBSyxFQUFaLEVBQWdCO0FBQ2QsVUFBSWtSLElBQUksS0FBSyxJQUFiLEVBQW1CO0FBQ2pCeE0sU0FBQyxHQUFHeU0sR0FBRyxHQUFHWCxPQUFPLENBQUM3TixJQUFSLENBQWFvTyxHQUFiLEVBQWtCLElBQWxCLENBQU4sR0FBZ0MsQ0FBcEM7QUFDQUksV0FBRyxJQUFJek0sQ0FBUDtBQUNBcU0sV0FBRyxDQUFDMVQsTUFBSixDQUFXOFQsR0FBWCxFQUFnQkosR0FBRyxDQUFDNVUsTUFBcEI7QUFDQTJVLFlBQUksQ0FBQ3pULE1BQUwsQ0FBWThULEdBQUcsR0FBRyxDQUFsQixFQUFxQkwsSUFBSSxDQUFDM1UsTUFBMUI7QUFDQStVLFlBQUksR0FBRyxJQUFQO0FBQ0QsT0FQYSxDQVFkOzs7QUFDQSxVQUFJLE9BQU8xVixLQUFQLEtBQWlCLFFBQWpCLElBQTZCQSxLQUFqQyxFQUF3QztBQUN4QztBQUNFO0FBQ0EsWUFBSWdWLE9BQU8sQ0FBQzdOLElBQVIsQ0FBYW9PLEdBQWIsRUFBa0J2VixLQUFsQixJQUEyQixDQUEvQixFQUFrQztBQUNoQ3VWLGFBQUcsQ0FBQ2xVLElBQUosQ0FBU3FVLElBQUksR0FBRzFWLEtBQWhCO0FBQ0Q7O0FBQ0QyVixXQUFHLEdBQUdKLEdBQUcsQ0FBQzVVLE1BQVY7QUFDQXVJLFNBQUMsR0FBRzhMLE9BQU8sQ0FBQzdOLElBQVIsQ0FBYXFPLElBQWIsRUFBbUJ4VixLQUFuQixDQUFKOztBQUNBLFlBQUlrSixDQUFDLEdBQUcsQ0FBUixFQUFXO0FBQ1RBLFdBQUMsR0FBR3NNLElBQUksQ0FBQ25VLElBQUwsQ0FBVXJCLEtBQVYsSUFBbUIsQ0FBdkI7O0FBQ0EsY0FBSThQLE9BQUosRUFBYTtBQUNYO0FBQ0F3RixnQkFBSSxDQUFDalUsSUFBTCxDQUFVLENBQUMsS0FBS21ELEdBQU4sRUFBV3FSLE9BQVgsQ0FBbUJqQixhQUFuQixFQUFrQ0wsZUFBbEMsQ0FBVjtBQUNBa0IsZ0JBQUksQ0FBQ3ZNLENBQUQsQ0FBSixHQUFVb0wsV0FBVyxHQUFHZ0IsSUFBSSxDQUFDUSxJQUFMLENBQVV4QixXQUFWLENBQXhCO0FBQ0QsV0FKRCxNQUlPO0FBQ0xtQixnQkFBSSxDQUFDdk0sQ0FBRCxDQUFKLEdBQVV1TSxJQUFJLENBQUMsQ0FBRCxDQUFkO0FBQ0Q7QUFDRixTQVRELE1BU087QUFDTHpWLGVBQUssR0FBR3lWLElBQUksQ0FBQ3ZNLENBQUQsQ0FBWjtBQUNEO0FBQ0YsT0FwQkQsTUFvQk87QUFDTCxZQUFJLE9BQU9sSixLQUFQLEtBQWlCLFFBQWpCLElBQTZCOFAsT0FBakMsRUFBMEM7QUFDeEM7QUFDQTtBQUNBO0FBQ0E5UCxlQUFLLEdBQUdBLEtBQUssQ0FBRTZWLE9BQVAsQ0FBZXRCLGVBQWYsRUFBZ0NJLHNCQUFoQyxFQUNPa0IsT0FEUCxDQUNldkIsV0FEZixFQUM0QkMsZUFENUIsQ0FBUjtBQUVEO0FBQ0Y7QUFDRjs7QUFDRCxXQUFPdlUsS0FBUDtBQUNELEdBakREO0FBa0RDOztBQUVELFNBQVMrVixnQkFBVCxDQUEwQnhFLE9BQTFCLEVBQW1DVyxJQUFuQyxFQUF5QztBQUN6QyxPQUFJLElBQUloSixDQUFDLEdBQUcsQ0FBUixFQUFXdkksTUFBTSxHQUFHdVIsSUFBSSxDQUFDdlIsTUFBN0IsRUFBcUN1SSxDQUFDLEdBQUd2SSxNQUF6QyxFQUFpRDRRLE9BQU8sR0FBR0EsT0FBTyxDQUNoRTtBQUNBVyxNQUFJLENBQUNoSixDQUFDLEVBQUYsQ0FBSixDQUFVMk0sT0FBVixDQUFrQmYsaUJBQWxCLEVBQXFDUixXQUFyQyxDQUZnRSxDQUFsRSxDQUdFOztBQUNGLFNBQU8vQyxPQUFQO0FBQ0M7O0FBRUQsU0FBU3lFLGVBQVQsQ0FBeUJDLE9BQXpCLEVBQWtDO0FBQ2xDLFNBQU8sVUFBU3pSLEdBQVQsRUFBY3hFLEtBQWQsRUFBcUI7QUFDMUIsUUFBSWtXLFFBQVEsR0FBRyxPQUFPbFcsS0FBUCxLQUFpQixRQUFoQzs7QUFDQSxRQUFJa1csUUFBUSxJQUFJbFcsS0FBSyxDQUFDbVcsTUFBTixDQUFhLENBQWIsTUFBb0I3QixXQUFwQyxFQUFpRDtBQUMvQyxhQUFPLElBQUlXLE9BQUosQ0FBWWpWLEtBQUssQ0FBQzBVLEtBQU4sQ0FBWSxDQUFaLENBQVosQ0FBUDtBQUNEOztBQUNELFFBQUlsUSxHQUFHLEtBQUssRUFBWixFQUFnQnhFLEtBQUssR0FBR29XLFVBQVUsQ0FBQ3BXLEtBQUQsRUFBUUEsS0FBUixFQUFlLEVBQWYsQ0FBbEIsQ0FMVSxDQU0xQjtBQUNBOztBQUNBLFFBQUlrVyxRQUFKLEVBQWNsVyxLQUFLLEdBQUdBLEtBQUssQ0FBRTZWLE9BQVAsQ0FBZWQsMEJBQWYsRUFBMkMsT0FBT1QsV0FBbEQsRUFDT3VCLE9BRFAsQ0FDZWxCLHNCQURmLEVBQ3VDSixlQUR2QyxDQUFSO0FBRWQsV0FBTzBCLE9BQU8sR0FBR0EsT0FBTyxDQUFDOU8sSUFBUixDQUFhLElBQWIsRUFBbUIzQyxHQUFuQixFQUF3QnhFLEtBQXhCLENBQUgsR0FBb0NBLEtBQWxEO0FBQ0QsR0FYRDtBQVlDOztBQUVELFNBQVNxVyxlQUFULENBQXlCQyxJQUF6QixFQUErQi9FLE9BQS9CLEVBQXdDZ0YsUUFBeEMsRUFBa0Q7QUFDbEQsT0FBSyxJQUFJck4sQ0FBQyxHQUFHLENBQVIsRUFBV3ZJLE1BQU0sR0FBRzRRLE9BQU8sQ0FBQzVRLE1BQWpDLEVBQXlDdUksQ0FBQyxHQUFHdkksTUFBN0MsRUFBcUR1SSxDQUFDLEVBQXRELEVBQTBEO0FBQ3hEcUksV0FBTyxDQUFDckksQ0FBRCxDQUFQLEdBQWFrTixVQUFVLENBQUNFLElBQUQsRUFBTy9FLE9BQU8sQ0FBQ3JJLENBQUQsQ0FBZCxFQUFtQnFOLFFBQW5CLENBQXZCO0FBQ0Q7O0FBQ0QsU0FBT2hGLE9BQVA7QUFDQzs7QUFFRCxTQUFTaUYsZ0JBQVQsQ0FBMEJGLElBQTFCLEVBQWdDL0UsT0FBaEMsRUFBeUNnRixRQUF6QyxFQUFtRDtBQUNuRCxPQUFLLElBQUkvUixHQUFULElBQWdCK00sT0FBaEIsRUFBeUI7QUFDdkIsUUFBSUEsT0FBTyxDQUFDa0YsY0FBUixDQUF1QmpTLEdBQXZCLENBQUosRUFBaUM7QUFDL0IrTSxhQUFPLENBQUMvTSxHQUFELENBQVAsR0FBZTRSLFVBQVUsQ0FBQ0UsSUFBRCxFQUFPL0UsT0FBTyxDQUFDL00sR0FBRCxDQUFkLEVBQXFCK1IsUUFBckIsQ0FBekI7QUFDRDtBQUNGOztBQUNELFNBQU9oRixPQUFQO0FBQ0M7O0FBRUQsU0FBUzZFLFVBQVQsQ0FBb0JFLElBQXBCLEVBQTBCL0UsT0FBMUIsRUFBbUNnRixRQUFuQyxFQUE2QztBQUM3QyxTQUFPaEYsT0FBTyxZQUFZN0YsS0FBbkIsR0FDTDtBQUNBMkssaUJBQWUsQ0FBQ0MsSUFBRCxFQUFPL0UsT0FBUCxFQUFnQmdGLFFBQWhCLENBRlYsR0FJSGhGLE9BQU8sWUFBWTBELE9BQW5CLEdBRUk7QUFDQTFELFNBQU8sQ0FBQzVRLE1BQVIsR0FFSTRWLFFBQVEsQ0FBQ0UsY0FBVCxDQUF3QmxGLE9BQXhCLElBQ0VnRixRQUFRLENBQUNoRixPQUFELENBRFYsR0FFRWdGLFFBQVEsQ0FBQ2hGLE9BQUQsQ0FBUixHQUFvQndFLGdCQUFnQixDQUNsQ08sSUFEa0MsRUFDNUIvRSxPQUFPLENBQUNtRixLQUFSLENBQWNwQyxXQUFkLENBRDRCLENBSjFDLEdBUUVnQyxJQVhOLEdBY0kvRSxPQUFPLFlBQVlVLE1BQW5CLEdBQ0U7QUFDQXVFLGtCQUFnQixDQUFDRixJQUFELEVBQU8vRSxPQUFQLEVBQWdCZ0YsUUFBaEIsQ0FGbEIsR0FHRTtBQUNBaEYsU0F0QlY7QUEwQkM7O0FBRUQsU0FBU29GLGtCQUFULENBQTRCM1csS0FBNUIsRUFBbUNvVixRQUFuQyxFQUE2Q3dCLEtBQTdDLEVBQW9EQyxZQUFwRCxFQUFrRTtBQUNsRSxTQUFPN0MsSUFBSSxDQUFDRyxTQUFMLENBQWVuVSxLQUFmLEVBQXNCbVYsZ0JBQWdCLENBQUNuVixLQUFELEVBQVFvVixRQUFSLEVBQWtCLENBQUN5QixZQUFuQixDQUF0QyxFQUF3RUQsS0FBeEUsQ0FBUDtBQUNDOztBQUVELFNBQVNFLGNBQVQsQ0FBd0JDLElBQXhCLEVBQThCZCxPQUE5QixFQUF1QztBQUN2QyxTQUFPakMsSUFBSSxDQUFDQyxLQUFMLENBQVc4QyxJQUFYLEVBQWlCZixlQUFlLENBQUNDLE9BQUQsQ0FBaEMsQ0FBUDtBQUNDOztBQUVjO0FBQ2I5QixXQUFTLEVBQUV3QyxrQkFERTtBQUViMUMsT0FBSyxFQUFFNkM7QUFGTSxDQUFmLEU7Ozs7Ozs7Ozs7OztBQ2pNQTtBQUNBO0FBRWE7O0FBRWJFLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQmpYLEtBQUssSUFBSTtBQUN6QixNQUFJLE9BQU9BLEtBQVAsS0FBaUIsUUFBckIsRUFBK0I7QUFDOUIsV0FBT2tYLGVBQWUsQ0FBQ2xYLEtBQUQsRUFBUSxFQUFSLENBQXRCO0FBQ0EsR0FId0IsQ0FLekI7OztBQUVBLE1BQUksT0FBT0EsS0FBUCxLQUFpQixVQUFyQixFQUFpQztBQUNoQztBQUNBLFdBQVEsY0FBY0EsS0FBSyxDQUFDaUUsSUFBTixJQUFjLFdBQWEsR0FBakQ7QUFDQTs7QUFFRCxTQUFPakUsS0FBUDtBQUNBLENBYkQsQyxDQWVBOzs7QUFDQSxTQUFTa1gsZUFBVCxDQUF5QkMsSUFBekIsRUFBK0IzQixJQUEvQixFQUFxQztBQUNwQyxRQUFNaFAsRUFBRSxHQUFHa0YsS0FBSyxDQUFDQyxPQUFOLENBQWN3TCxJQUFkLElBQXNCLEVBQXRCLEdBQTJCLEVBQXRDO0FBRUEzQixNQUFJLENBQUNuVSxJQUFMLENBQVU4VixJQUFWOztBQUVBLE9BQUssTUFBTTNTLEdBQVgsSUFBa0J5TixNQUFNLENBQUNDLElBQVAsQ0FBWWlGLElBQVosQ0FBbEIsRUFBcUM7QUFDcEMsVUFBTW5YLEtBQUssR0FBR21YLElBQUksQ0FBQzNTLEdBQUQsQ0FBbEI7O0FBRUEsUUFBSSxPQUFPeEUsS0FBUCxLQUFpQixVQUFyQixFQUFpQztBQUNoQztBQUNBOztBQUVELFFBQUksQ0FBQ0EsS0FBRCxJQUFVLE9BQU9BLEtBQVAsS0FBaUIsUUFBL0IsRUFBeUM7QUFDeEN3RyxRQUFFLENBQUNoQyxHQUFELENBQUYsR0FBVXhFLEtBQVY7QUFDQTtBQUNBOztBQUVELFFBQUl3VixJQUFJLENBQUNSLE9BQUwsQ0FBYW1DLElBQUksQ0FBQzNTLEdBQUQsQ0FBakIsTUFBNEIsQ0FBQyxDQUFqQyxFQUFvQztBQUNuQ2dDLFFBQUUsQ0FBQ2hDLEdBQUQsQ0FBRixHQUFVMFMsZUFBZSxDQUFDQyxJQUFJLENBQUMzUyxHQUFELENBQUwsRUFBWWdSLElBQUksQ0FBQ2QsS0FBTCxDQUFXLENBQVgsQ0FBWixDQUF6QjtBQUNBO0FBQ0E7O0FBRURsTyxNQUFFLENBQUNoQyxHQUFELENBQUYsR0FBVSxZQUFWO0FBQ0E7O0FBRUQsTUFBSSxPQUFPMlMsSUFBSSxDQUFDbFQsSUFBWixLQUFxQixRQUF6QixFQUFtQztBQUNsQ3VDLE1BQUUsQ0FBQ3ZDLElBQUgsR0FBVWtULElBQUksQ0FBQ2xULElBQWY7QUFDQTs7QUFFRCxNQUFJLE9BQU9rVCxJQUFJLENBQUNDLE9BQVosS0FBd0IsUUFBNUIsRUFBc0M7QUFDckM1USxNQUFFLENBQUM0USxPQUFILEdBQWFELElBQUksQ0FBQ0MsT0FBbEI7QUFDQTs7QUFFRCxNQUFJLE9BQU9ELElBQUksQ0FBQ0UsS0FBWixLQUFzQixRQUExQixFQUFvQztBQUNuQzdRLE1BQUUsQ0FBQzZRLEtBQUgsR0FBV0YsSUFBSSxDQUFDRSxLQUFoQjtBQUNBOztBQUVELFNBQU83USxFQUFQO0FBQ0EsQzs7Ozs7Ozs7Ozs7O0FDM0REO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFPLE1BQU1rQyxXQUFXLEdBQUdILElBQUksSUFBSTtBQUNqQyxNQUFJQSxJQUFJLENBQUN0RSxJQUFULEVBQWUsT0FBT3NFLElBQUksQ0FBQ3RFLElBQVo7QUFDZixRQUFNZ0IsTUFBTSxHQUFHLDZCQUE2QnFTLElBQTdCLENBQWtDL08sSUFBSSxDQUFDa00sUUFBTCxFQUFsQyxDQUFmO0FBRUEsU0FBT3hQLE1BQU0sR0FBR0EsTUFBTSxDQUFDLENBQUQsQ0FBVCxHQUFlLFNBQTVCO0FBQ0QsQ0FMTTtBQU9QLElBQUlzUyxHQUFHLEdBQUcsQ0FBVjtBQUVPLE1BQU0zVCxLQUFLLEdBQUc0VCxNQUFNLElBQUssR0FBRUEsTUFBTyxJQUFHLEVBQUVELEdBQUksRUFBM0M7QUFFQSxTQUFTOUQsYUFBVCxDQUF1QkwsR0FBdkIsRUFBNEI7QUFDakMsT0FBSyxNQUFNcUUsSUFBWCxJQUFtQnJFLEdBQW5CLEVBQXdCO0FBQ3RCLFFBQUlBLEdBQUcsQ0FBQ3FELGNBQUosQ0FBbUJnQixJQUFuQixDQUFKLEVBQThCO0FBQzVCLGFBQU8sS0FBUDtBQUNEO0FBQ0Y7O0FBQ0QsU0FBTyxJQUFQO0FBQ0Q7QUFDTSxTQUFTcEUsYUFBVCxDQUF1QkQsR0FBdkIsRUFBNEI7QUFDakMsTUFDRSxPQUFPQSxHQUFQLEtBQWUsV0FBZixJQUNBQSxHQUFHLEtBQUssSUFEUixJQUVDLE9BQU9BLEdBQVAsS0FBZSxXQUFmLElBQThCLE9BQU9BLEdBQVAsS0FBZSxRQUhoRCxFQUlFO0FBQ0EsVUFBTSxJQUFJOVAsS0FBSixDQUFXLHlDQUF3QzhQLEdBQUksV0FBdkQsQ0FBTjtBQUNEO0FBQ0Y7QUFDTSxNQUFNYixVQUFVLEdBQUcsQ0FBQ2hCLE9BQUQsRUFBVWUsT0FBVixNQUF1QixFQUFFLEdBQUdmLE9BQUw7QUFBYyxLQUFHZTtBQUFqQixDQUF2QixDQUFuQjtBQUNBLE1BQU05SSxTQUFTLEdBQUc0SixHQUFHLElBQUlBLEdBQUcsSUFBSSxPQUFPQSxHQUFHLENBQUMzSixJQUFYLEtBQW9CLFVBQXBEO0FBQ0EsTUFBTWlPLGVBQWUsR0FBR3RFLEdBQUcsSUFDaENBLEdBQUcsR0FBR0EsR0FBRyxDQUFDdUUsV0FBSixLQUFvQixHQUFHQSxXQUExQixHQUF3QyxLQUR0QztBQUVBLE1BQU1DLFdBQVcsR0FBR3hFLEdBQUcsSUFDNUJBLEdBQUcsSUFBSSxPQUFPQSxHQUFHLENBQUNySyxJQUFYLEtBQW9CLFVBQTNCLElBQXlDLE9BQU9xSyxHQUFHLENBQUN2SixLQUFYLEtBQXFCLFVBRHpEO0FBRUEsTUFBTW1CLG1CQUFtQixHQUFHNEssRUFBRSxJQUFJO0FBQ3ZDLFFBQU07QUFBRStCO0FBQUYsTUFBa0IvQixFQUF4QjtBQUNBLE1BQUksQ0FBQytCLFdBQUwsRUFBa0IsT0FBTyxLQUFQOztBQUNsQixNQUNFQSxXQUFXLENBQUMxVCxJQUFaLEtBQXFCLG1CQUFyQixJQUNBMFQsV0FBVyxDQUFDaEcsV0FBWixLQUE0QixtQkFGOUIsRUFHRTtBQUNBLFdBQU8sSUFBUDtBQUNEOztBQUNELFNBQU9pRyxXQUFXLENBQUNELFdBQVcsQ0FBQ0UsU0FBYixDQUFsQjtBQUNELENBVk07QUFXQSxTQUFTOUssUUFBVCxHQUFvQjtBQUN6QndLLEtBQUcsR0FBRyxDQUFOO0FBQ0Q7QUFDTSxTQUFTclQsT0FBVCxDQUFpQnlMLEdBQWpCLEVBQXNCbUksUUFBdEIsRUFBZ0M5WCxLQUFoQyxFQUF1QztBQUM1Q2lTLFFBQU0sQ0FBQzhGLGNBQVAsQ0FBc0JwSSxHQUF0QixFQUEyQm1JLFFBQTNCLEVBQXFDO0FBQ25DRSxZQUFRLEVBQUUsSUFEeUI7QUFFbkNoWTtBQUZtQyxHQUFyQztBQUlELEM7Ozs7Ozs7Ozs7O0FDckREO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBLHdDOzs7Ozs7Ozs7OztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxnQkFBZ0I7QUFDaEI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZCxLQUFLO0FBQ0wsY0FBYztBQUNkO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseURBQXlEO0FBQ3pEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBLFdBQVc7QUFDWDs7QUFFQTtBQUNBO0FBQ0Esd0NBQXdDLFdBQVc7QUFDbkQ7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDJCQUEyQjtBQUMzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBLFNBQVM7QUFDVDtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0Esb0NBQW9DLGNBQWM7QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsaUNBQWlDLGtCQUFrQjtBQUNuRDtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsaUJBQWlCOztBQUVqQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsaUJBQWlCO0FBQ3pDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7O0FBRUE7QUFDQSxZQUFZO0FBQ1o7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSw4Q0FBOEMsUUFBUTtBQUN0RDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7O0FBRUEsV0FBVztBQUNYO0FBQ0E7QUFDQTs7QUFFQSxXQUFXO0FBQ1g7QUFDQTtBQUNBOztBQUVBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQSw4Q0FBOEMsUUFBUTtBQUN0RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBOztBQUVBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBLDhDQUE4QyxRQUFRO0FBQ3REO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBLDhDQUE4QyxRQUFRO0FBQ3REO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRSxLQUEwQixvQkFBb0IsU0FBRTtBQUNsRDs7QUFFQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDcnRCQTtBQUNBO0FBY0FrTixzREFBUyxDQUFDLFlBQU0sQ0FBRSxDQUFULEVBQVcsSUFBWCxDQUFUO0FBRUEsSUFBTTVJLENBQUMsR0FBR1osa0RBQUssQ0FBQyxLQUFELENBQWY7QUFDQSxJQUFNdVUsV0FBVyxHQUFHM1QsQ0FBQyxDQUFDOEcsTUFBRixDQUFTLFVBQUF6TCxDQUFDO0FBQUEsU0FBSUEsQ0FBQyxDQUFDc1ksV0FBRixFQUFKO0FBQUEsQ0FBVixDQUFILG1CQUFqQjtBQUVBeFcsbURBQU0sQ0FBQ3dXLFdBQUQsRUFBYyxVQUFBdFksQ0FBQztBQUFBLFNBQUlvTyxPQUFPLENBQUNuTCxHQUFSLENBQVlqRCxDQUFaLENBQUo7QUFBQSxDQUFmLENBQU47QUFDQW1GLGlEQUFJLENBQUNSLENBQUQsRUFBSSxLQUFKLENBQUosQyxDQUVBLG9FIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiL1wiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMCk7XG4iLCIvKlxub2JqZWN0LWFzc2lnblxuKGMpIFNpbmRyZSBTb3JodXNcbkBsaWNlbnNlIE1JVFxuKi9cblxuJ3VzZSBzdHJpY3QnO1xuLyogZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLXZhcnMgKi9cbnZhciBnZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzO1xudmFyIGhhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbnZhciBwcm9wSXNFbnVtZXJhYmxlID0gT2JqZWN0LnByb3RvdHlwZS5wcm9wZXJ0eUlzRW51bWVyYWJsZTtcblxuZnVuY3Rpb24gdG9PYmplY3QodmFsKSB7XG5cdGlmICh2YWwgPT09IG51bGwgfHwgdmFsID09PSB1bmRlZmluZWQpIHtcblx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdPYmplY3QuYXNzaWduIGNhbm5vdCBiZSBjYWxsZWQgd2l0aCBudWxsIG9yIHVuZGVmaW5lZCcpO1xuXHR9XG5cblx0cmV0dXJuIE9iamVjdCh2YWwpO1xufVxuXG5mdW5jdGlvbiBzaG91bGRVc2VOYXRpdmUoKSB7XG5cdHRyeSB7XG5cdFx0aWYgKCFPYmplY3QuYXNzaWduKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gRGV0ZWN0IGJ1Z2d5IHByb3BlcnR5IGVudW1lcmF0aW9uIG9yZGVyIGluIG9sZGVyIFY4IHZlcnNpb25zLlxuXG5cdFx0Ly8gaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9NDExOFxuXHRcdHZhciB0ZXN0MSA9IG5ldyBTdHJpbmcoJ2FiYycpOyAgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1uZXctd3JhcHBlcnNcblx0XHR0ZXN0MVs1XSA9ICdkZSc7XG5cdFx0aWYgKE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHRlc3QxKVswXSA9PT0gJzUnKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9MzA1NlxuXHRcdHZhciB0ZXN0MiA9IHt9O1xuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgMTA7IGkrKykge1xuXHRcdFx0dGVzdDJbJ18nICsgU3RyaW5nLmZyb21DaGFyQ29kZShpKV0gPSBpO1xuXHRcdH1cblx0XHR2YXIgb3JkZXIyID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGVzdDIpLm1hcChmdW5jdGlvbiAobikge1xuXHRcdFx0cmV0dXJuIHRlc3QyW25dO1xuXHRcdH0pO1xuXHRcdGlmIChvcmRlcjIuam9pbignJykgIT09ICcwMTIzNDU2Nzg5Jykge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTMwNTZcblx0XHR2YXIgdGVzdDMgPSB7fTtcblx0XHQnYWJjZGVmZ2hpamtsbW5vcHFyc3QnLnNwbGl0KCcnKS5mb3JFYWNoKGZ1bmN0aW9uIChsZXR0ZXIpIHtcblx0XHRcdHRlc3QzW2xldHRlcl0gPSBsZXR0ZXI7XG5cdFx0fSk7XG5cdFx0aWYgKE9iamVjdC5rZXlzKE9iamVjdC5hc3NpZ24oe30sIHRlc3QzKSkuam9pbignJykgIT09XG5cdFx0XHRcdCdhYmNkZWZnaGlqa2xtbm9wcXJzdCcpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdHJ1ZTtcblx0fSBjYXRjaCAoZXJyKSB7XG5cdFx0Ly8gV2UgZG9uJ3QgZXhwZWN0IGFueSBvZiB0aGUgYWJvdmUgdG8gdGhyb3csIGJ1dCBiZXR0ZXIgdG8gYmUgc2FmZS5cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzaG91bGRVc2VOYXRpdmUoKSA/IE9iamVjdC5hc3NpZ24gOiBmdW5jdGlvbiAodGFyZ2V0LCBzb3VyY2UpIHtcblx0dmFyIGZyb207XG5cdHZhciB0byA9IHRvT2JqZWN0KHRhcmdldCk7XG5cdHZhciBzeW1ib2xzO1xuXG5cdGZvciAodmFyIHMgPSAxOyBzIDwgYXJndW1lbnRzLmxlbmd0aDsgcysrKSB7XG5cdFx0ZnJvbSA9IE9iamVjdChhcmd1bWVudHNbc10pO1xuXG5cdFx0Zm9yICh2YXIga2V5IGluIGZyb20pIHtcblx0XHRcdGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKGZyb20sIGtleSkpIHtcblx0XHRcdFx0dG9ba2V5XSA9IGZyb21ba2V5XTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAoZ2V0T3duUHJvcGVydHlTeW1ib2xzKSB7XG5cdFx0XHRzeW1ib2xzID0gZ2V0T3duUHJvcGVydHlTeW1ib2xzKGZyb20pO1xuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBzeW1ib2xzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdGlmIChwcm9wSXNFbnVtZXJhYmxlLmNhbGwoZnJvbSwgc3ltYm9sc1tpXSkpIHtcblx0XHRcdFx0XHR0b1tzeW1ib2xzW2ldXSA9IGZyb21bc3ltYm9sc1tpXV07XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gdG87XG59O1xuIiwiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTMtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBwcmludFdhcm5pbmcgPSBmdW5jdGlvbigpIHt9O1xuXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICB2YXIgUmVhY3RQcm9wVHlwZXNTZWNyZXQgPSByZXF1aXJlKCcuL2xpYi9SZWFjdFByb3BUeXBlc1NlY3JldCcpO1xuICB2YXIgbG9nZ2VkVHlwZUZhaWx1cmVzID0ge307XG4gIHZhciBoYXMgPSBGdW5jdGlvbi5jYWxsLmJpbmQoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eSk7XG5cbiAgcHJpbnRXYXJuaW5nID0gZnVuY3Rpb24odGV4dCkge1xuICAgIHZhciBtZXNzYWdlID0gJ1dhcm5pbmc6ICcgKyB0ZXh0O1xuICAgIGlmICh0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IobWVzc2FnZSk7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAvLyAtLS0gV2VsY29tZSB0byBkZWJ1Z2dpbmcgUmVhY3QgLS0tXG4gICAgICAvLyBUaGlzIGVycm9yIHdhcyB0aHJvd24gYXMgYSBjb252ZW5pZW5jZSBzbyB0aGF0IHlvdSBjYW4gdXNlIHRoaXMgc3RhY2tcbiAgICAgIC8vIHRvIGZpbmQgdGhlIGNhbGxzaXRlIHRoYXQgY2F1c2VkIHRoaXMgd2FybmluZyB0byBmaXJlLlxuICAgICAgdGhyb3cgbmV3IEVycm9yKG1lc3NhZ2UpO1xuICAgIH0gY2F0Y2ggKHgpIHt9XG4gIH07XG59XG5cbi8qKlxuICogQXNzZXJ0IHRoYXQgdGhlIHZhbHVlcyBtYXRjaCB3aXRoIHRoZSB0eXBlIHNwZWNzLlxuICogRXJyb3IgbWVzc2FnZXMgYXJlIG1lbW9yaXplZCBhbmQgd2lsbCBvbmx5IGJlIHNob3duIG9uY2UuXG4gKlxuICogQHBhcmFtIHtvYmplY3R9IHR5cGVTcGVjcyBNYXAgb2YgbmFtZSB0byBhIFJlYWN0UHJvcFR5cGVcbiAqIEBwYXJhbSB7b2JqZWN0fSB2YWx1ZXMgUnVudGltZSB2YWx1ZXMgdGhhdCBuZWVkIHRvIGJlIHR5cGUtY2hlY2tlZFxuICogQHBhcmFtIHtzdHJpbmd9IGxvY2F0aW9uIGUuZy4gXCJwcm9wXCIsIFwiY29udGV4dFwiLCBcImNoaWxkIGNvbnRleHRcIlxuICogQHBhcmFtIHtzdHJpbmd9IGNvbXBvbmVudE5hbWUgTmFtZSBvZiB0aGUgY29tcG9uZW50IGZvciBlcnJvciBtZXNzYWdlcy5cbiAqIEBwYXJhbSB7P0Z1bmN0aW9ufSBnZXRTdGFjayBSZXR1cm5zIHRoZSBjb21wb25lbnQgc3RhY2suXG4gKiBAcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBjaGVja1Byb3BUeXBlcyh0eXBlU3BlY3MsIHZhbHVlcywgbG9jYXRpb24sIGNvbXBvbmVudE5hbWUsIGdldFN0YWNrKSB7XG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgZm9yICh2YXIgdHlwZVNwZWNOYW1lIGluIHR5cGVTcGVjcykge1xuICAgICAgaWYgKGhhcyh0eXBlU3BlY3MsIHR5cGVTcGVjTmFtZSkpIHtcbiAgICAgICAgdmFyIGVycm9yO1xuICAgICAgICAvLyBQcm9wIHR5cGUgdmFsaWRhdGlvbiBtYXkgdGhyb3cuIEluIGNhc2UgdGhleSBkbywgd2UgZG9uJ3Qgd2FudCB0b1xuICAgICAgICAvLyBmYWlsIHRoZSByZW5kZXIgcGhhc2Ugd2hlcmUgaXQgZGlkbid0IGZhaWwgYmVmb3JlLiBTbyB3ZSBsb2cgaXQuXG4gICAgICAgIC8vIEFmdGVyIHRoZXNlIGhhdmUgYmVlbiBjbGVhbmVkIHVwLCB3ZSdsbCBsZXQgdGhlbSB0aHJvdy5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAvLyBUaGlzIGlzIGludGVudGlvbmFsbHkgYW4gaW52YXJpYW50IHRoYXQgZ2V0cyBjYXVnaHQuIEl0J3MgdGhlIHNhbWVcbiAgICAgICAgICAvLyBiZWhhdmlvciBhcyB3aXRob3V0IHRoaXMgc3RhdGVtZW50IGV4Y2VwdCB3aXRoIGEgYmV0dGVyIG1lc3NhZ2UuXG4gICAgICAgICAgaWYgKHR5cGVvZiB0eXBlU3BlY3NbdHlwZVNwZWNOYW1lXSAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgdmFyIGVyciA9IEVycm9yKFxuICAgICAgICAgICAgICAoY29tcG9uZW50TmFtZSB8fCAnUmVhY3QgY2xhc3MnKSArICc6ICcgKyBsb2NhdGlvbiArICcgdHlwZSBgJyArIHR5cGVTcGVjTmFtZSArICdgIGlzIGludmFsaWQ7ICcgK1xuICAgICAgICAgICAgICAnaXQgbXVzdCBiZSBhIGZ1bmN0aW9uLCB1c3VhbGx5IGZyb20gdGhlIGBwcm9wLXR5cGVzYCBwYWNrYWdlLCBidXQgcmVjZWl2ZWQgYCcgKyB0eXBlb2YgdHlwZVNwZWNzW3R5cGVTcGVjTmFtZV0gKyAnYC4nXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgZXJyLm5hbWUgPSAnSW52YXJpYW50IFZpb2xhdGlvbic7XG4gICAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgICAgfVxuICAgICAgICAgIGVycm9yID0gdHlwZVNwZWNzW3R5cGVTcGVjTmFtZV0odmFsdWVzLCB0eXBlU3BlY05hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBudWxsLCBSZWFjdFByb3BUeXBlc1NlY3JldCk7XG4gICAgICAgIH0gY2F0Y2ggKGV4KSB7XG4gICAgICAgICAgZXJyb3IgPSBleDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZXJyb3IgJiYgIShlcnJvciBpbnN0YW5jZW9mIEVycm9yKSkge1xuICAgICAgICAgIHByaW50V2FybmluZyhcbiAgICAgICAgICAgIChjb21wb25lbnROYW1lIHx8ICdSZWFjdCBjbGFzcycpICsgJzogdHlwZSBzcGVjaWZpY2F0aW9uIG9mICcgK1xuICAgICAgICAgICAgbG9jYXRpb24gKyAnIGAnICsgdHlwZVNwZWNOYW1lICsgJ2AgaXMgaW52YWxpZDsgdGhlIHR5cGUgY2hlY2tlciAnICtcbiAgICAgICAgICAgICdmdW5jdGlvbiBtdXN0IHJldHVybiBgbnVsbGAgb3IgYW4gYEVycm9yYCBidXQgcmV0dXJuZWQgYSAnICsgdHlwZW9mIGVycm9yICsgJy4gJyArXG4gICAgICAgICAgICAnWW91IG1heSBoYXZlIGZvcmdvdHRlbiB0byBwYXNzIGFuIGFyZ3VtZW50IHRvIHRoZSB0eXBlIGNoZWNrZXIgJyArXG4gICAgICAgICAgICAnY3JlYXRvciAoYXJyYXlPZiwgaW5zdGFuY2VPZiwgb2JqZWN0T2YsIG9uZU9mLCBvbmVPZlR5cGUsIGFuZCAnICtcbiAgICAgICAgICAgICdzaGFwZSBhbGwgcmVxdWlyZSBhbiBhcmd1bWVudCkuJ1xuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGVycm9yIGluc3RhbmNlb2YgRXJyb3IgJiYgIShlcnJvci5tZXNzYWdlIGluIGxvZ2dlZFR5cGVGYWlsdXJlcykpIHtcbiAgICAgICAgICAvLyBPbmx5IG1vbml0b3IgdGhpcyBmYWlsdXJlIG9uY2UgYmVjYXVzZSB0aGVyZSB0ZW5kcyB0byBiZSBhIGxvdCBvZiB0aGVcbiAgICAgICAgICAvLyBzYW1lIGVycm9yLlxuICAgICAgICAgIGxvZ2dlZFR5cGVGYWlsdXJlc1tlcnJvci5tZXNzYWdlXSA9IHRydWU7XG5cbiAgICAgICAgICB2YXIgc3RhY2sgPSBnZXRTdGFjayA/IGdldFN0YWNrKCkgOiAnJztcblxuICAgICAgICAgIHByaW50V2FybmluZyhcbiAgICAgICAgICAgICdGYWlsZWQgJyArIGxvY2F0aW9uICsgJyB0eXBlOiAnICsgZXJyb3IubWVzc2FnZSArIChzdGFjayAhPSBudWxsID8gc3RhY2sgOiAnJylcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogUmVzZXRzIHdhcm5pbmcgY2FjaGUgd2hlbiB0ZXN0aW5nLlxuICpcbiAqIEBwcml2YXRlXG4gKi9cbmNoZWNrUHJvcFR5cGVzLnJlc2V0V2FybmluZ0NhY2hlID0gZnVuY3Rpb24oKSB7XG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgbG9nZ2VkVHlwZUZhaWx1cmVzID0ge307XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjaGVja1Byb3BUeXBlcztcbiIsIi8qKlxuICogQ29weXJpZ2h0IChjKSAyMDEzLXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgUmVhY3RQcm9wVHlwZXNTZWNyZXQgPSAnU0VDUkVUX0RPX05PVF9QQVNTX1RISVNfT1JfWU9VX1dJTExfQkVfRklSRUQnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJlYWN0UHJvcFR5cGVzU2VjcmV0O1xuIiwiLyoqIEBsaWNlbnNlIFJlYWN0IHYxNi45LjBcbiAqIHJlYWN0LmRldmVsb3BtZW50LmpzXG4gKlxuICogQ29weXJpZ2h0IChjKSBGYWNlYm9vaywgSW5jLiBhbmQgaXRzIGFmZmlsaWF0ZXMuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG5cblxuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIikge1xuICAoZnVuY3Rpb24oKSB7XG4ndXNlIHN0cmljdCc7XG5cbnZhciBfYXNzaWduID0gcmVxdWlyZSgnb2JqZWN0LWFzc2lnbicpO1xudmFyIGNoZWNrUHJvcFR5cGVzID0gcmVxdWlyZSgncHJvcC10eXBlcy9jaGVja1Byb3BUeXBlcycpO1xuXG4vLyBUT0RPOiB0aGlzIGlzIHNwZWNpYWwgYmVjYXVzZSBpdCBnZXRzIGltcG9ydGVkIGR1cmluZyBidWlsZC5cblxudmFyIFJlYWN0VmVyc2lvbiA9ICcxNi45LjAnO1xuXG4vLyBUaGUgU3ltYm9sIHVzZWQgdG8gdGFnIHRoZSBSZWFjdEVsZW1lbnQtbGlrZSB0eXBlcy4gSWYgdGhlcmUgaXMgbm8gbmF0aXZlIFN5bWJvbFxuLy8gbm9yIHBvbHlmaWxsLCB0aGVuIGEgcGxhaW4gbnVtYmVyIGlzIHVzZWQgZm9yIHBlcmZvcm1hbmNlLlxudmFyIGhhc1N5bWJvbCA9IHR5cGVvZiBTeW1ib2wgPT09ICdmdW5jdGlvbicgJiYgU3ltYm9sLmZvcjtcblxudmFyIFJFQUNUX0VMRU1FTlRfVFlQRSA9IGhhc1N5bWJvbCA/IFN5bWJvbC5mb3IoJ3JlYWN0LmVsZW1lbnQnKSA6IDB4ZWFjNztcbnZhciBSRUFDVF9QT1JUQUxfVFlQRSA9IGhhc1N5bWJvbCA/IFN5bWJvbC5mb3IoJ3JlYWN0LnBvcnRhbCcpIDogMHhlYWNhO1xudmFyIFJFQUNUX0ZSQUdNRU5UX1RZUEUgPSBoYXNTeW1ib2wgPyBTeW1ib2wuZm9yKCdyZWFjdC5mcmFnbWVudCcpIDogMHhlYWNiO1xudmFyIFJFQUNUX1NUUklDVF9NT0RFX1RZUEUgPSBoYXNTeW1ib2wgPyBTeW1ib2wuZm9yKCdyZWFjdC5zdHJpY3RfbW9kZScpIDogMHhlYWNjO1xudmFyIFJFQUNUX1BST0ZJTEVSX1RZUEUgPSBoYXNTeW1ib2wgPyBTeW1ib2wuZm9yKCdyZWFjdC5wcm9maWxlcicpIDogMHhlYWQyO1xudmFyIFJFQUNUX1BST1ZJREVSX1RZUEUgPSBoYXNTeW1ib2wgPyBTeW1ib2wuZm9yKCdyZWFjdC5wcm92aWRlcicpIDogMHhlYWNkO1xudmFyIFJFQUNUX0NPTlRFWFRfVFlQRSA9IGhhc1N5bWJvbCA/IFN5bWJvbC5mb3IoJ3JlYWN0LmNvbnRleHQnKSA6IDB4ZWFjZTtcbi8vIFRPRE86IFdlIGRvbid0IHVzZSBBc3luY01vZGUgb3IgQ29uY3VycmVudE1vZGUgYW55bW9yZS4gVGhleSB3ZXJlIHRlbXBvcmFyeVxuLy8gKHVuc3RhYmxlKSBBUElzIHRoYXQgaGF2ZSBiZWVuIHJlbW92ZWQuIENhbiB3ZSByZW1vdmUgdGhlIHN5bWJvbHM/XG5cbnZhciBSRUFDVF9DT05DVVJSRU5UX01PREVfVFlQRSA9IGhhc1N5bWJvbCA/IFN5bWJvbC5mb3IoJ3JlYWN0LmNvbmN1cnJlbnRfbW9kZScpIDogMHhlYWNmO1xudmFyIFJFQUNUX0ZPUldBUkRfUkVGX1RZUEUgPSBoYXNTeW1ib2wgPyBTeW1ib2wuZm9yKCdyZWFjdC5mb3J3YXJkX3JlZicpIDogMHhlYWQwO1xudmFyIFJFQUNUX1NVU1BFTlNFX1RZUEUgPSBoYXNTeW1ib2wgPyBTeW1ib2wuZm9yKCdyZWFjdC5zdXNwZW5zZScpIDogMHhlYWQxO1xudmFyIFJFQUNUX1NVU1BFTlNFX0xJU1RfVFlQRSA9IGhhc1N5bWJvbCA/IFN5bWJvbC5mb3IoJ3JlYWN0LnN1c3BlbnNlX2xpc3QnKSA6IDB4ZWFkODtcbnZhciBSRUFDVF9NRU1PX1RZUEUgPSBoYXNTeW1ib2wgPyBTeW1ib2wuZm9yKCdyZWFjdC5tZW1vJykgOiAweGVhZDM7XG52YXIgUkVBQ1RfTEFaWV9UWVBFID0gaGFzU3ltYm9sID8gU3ltYm9sLmZvcigncmVhY3QubGF6eScpIDogMHhlYWQ0O1xudmFyIFJFQUNUX0ZVTkRBTUVOVEFMX1RZUEUgPSBoYXNTeW1ib2wgPyBTeW1ib2wuZm9yKCdyZWFjdC5mdW5kYW1lbnRhbCcpIDogMHhlYWQ1O1xudmFyIFJFQUNUX1JFU1BPTkRFUl9UWVBFID0gaGFzU3ltYm9sID8gU3ltYm9sLmZvcigncmVhY3QucmVzcG9uZGVyJykgOiAweGVhZDY7XG5cbnZhciBNQVlCRV9JVEVSQVRPUl9TWU1CT0wgPSB0eXBlb2YgU3ltYm9sID09PSAnZnVuY3Rpb24nICYmIFN5bWJvbC5pdGVyYXRvcjtcbnZhciBGQVVYX0lURVJBVE9SX1NZTUJPTCA9ICdAQGl0ZXJhdG9yJztcblxuZnVuY3Rpb24gZ2V0SXRlcmF0b3JGbihtYXliZUl0ZXJhYmxlKSB7XG4gIGlmIChtYXliZUl0ZXJhYmxlID09PSBudWxsIHx8IHR5cGVvZiBtYXliZUl0ZXJhYmxlICE9PSAnb2JqZWN0Jykge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIHZhciBtYXliZUl0ZXJhdG9yID0gTUFZQkVfSVRFUkFUT1JfU1lNQk9MICYmIG1heWJlSXRlcmFibGVbTUFZQkVfSVRFUkFUT1JfU1lNQk9MXSB8fCBtYXliZUl0ZXJhYmxlW0ZBVVhfSVRFUkFUT1JfU1lNQk9MXTtcbiAgaWYgKHR5cGVvZiBtYXliZUl0ZXJhdG9yID09PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuIG1heWJlSXRlcmF0b3I7XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59XG5cbi8vIERvIG5vdCByZXF1aXJlIHRoaXMgbW9kdWxlIGRpcmVjdGx5ISBVc2Ugbm9ybWFsIGBpbnZhcmlhbnRgIGNhbGxzIHdpdGhcbi8vIHRlbXBsYXRlIGxpdGVyYWwgc3RyaW5ncy4gVGhlIG1lc3NhZ2VzIHdpbGwgYmUgY29udmVydGVkIHRvIFJlYWN0RXJyb3IgZHVyaW5nXG4vLyBidWlsZCwgYW5kIGluIHByb2R1Y3Rpb24gdGhleSB3aWxsIGJlIG1pbmlmaWVkLlxuXG4vLyBEbyBub3QgcmVxdWlyZSB0aGlzIG1vZHVsZSBkaXJlY3RseSEgVXNlIG5vcm1hbCBgaW52YXJpYW50YCBjYWxscyB3aXRoXG4vLyB0ZW1wbGF0ZSBsaXRlcmFsIHN0cmluZ3MuIFRoZSBtZXNzYWdlcyB3aWxsIGJlIGNvbnZlcnRlZCB0byBSZWFjdEVycm9yIGR1cmluZ1xuLy8gYnVpbGQsIGFuZCBpbiBwcm9kdWN0aW9uIHRoZXkgd2lsbCBiZSBtaW5pZmllZC5cblxuZnVuY3Rpb24gUmVhY3RFcnJvcihlcnJvcikge1xuICBlcnJvci5uYW1lID0gJ0ludmFyaWFudCBWaW9sYXRpb24nO1xuICByZXR1cm4gZXJyb3I7XG59XG5cbi8qKlxuICogVXNlIGludmFyaWFudCgpIHRvIGFzc2VydCBzdGF0ZSB3aGljaCB5b3VyIHByb2dyYW0gYXNzdW1lcyB0byBiZSB0cnVlLlxuICpcbiAqIFByb3ZpZGUgc3ByaW50Zi1zdHlsZSBmb3JtYXQgKG9ubHkgJXMgaXMgc3VwcG9ydGVkKSBhbmQgYXJndW1lbnRzXG4gKiB0byBwcm92aWRlIGluZm9ybWF0aW9uIGFib3V0IHdoYXQgYnJva2UgYW5kIHdoYXQgeW91IHdlcmVcbiAqIGV4cGVjdGluZy5cbiAqXG4gKiBUaGUgaW52YXJpYW50IG1lc3NhZ2Ugd2lsbCBiZSBzdHJpcHBlZCBpbiBwcm9kdWN0aW9uLCBidXQgdGhlIGludmFyaWFudFxuICogd2lsbCByZW1haW4gdG8gZW5zdXJlIGxvZ2ljIGRvZXMgbm90IGRpZmZlciBpbiBwcm9kdWN0aW9uLlxuICovXG5cbi8qKlxuICogRm9ya2VkIGZyb20gZmJqcy93YXJuaW5nOlxuICogaHR0cHM6Ly9naXRodWIuY29tL2ZhY2Vib29rL2ZianMvYmxvYi9lNjZiYTIwYWQ1YmU0MzNlYjU0NDIzZjJiMDk3ZDgyOTMyNGQ5ZGU2L3BhY2thZ2VzL2ZianMvc3JjL19fZm9ya3NfXy93YXJuaW5nLmpzXG4gKlxuICogT25seSBjaGFuZ2UgaXMgd2UgdXNlIGNvbnNvbGUud2FybiBpbnN0ZWFkIG9mIGNvbnNvbGUuZXJyb3IsXG4gKiBhbmQgZG8gbm90aGluZyB3aGVuICdjb25zb2xlJyBpcyBub3Qgc3VwcG9ydGVkLlxuICogVGhpcyByZWFsbHkgc2ltcGxpZmllcyB0aGUgY29kZS5cbiAqIC0tLVxuICogU2ltaWxhciB0byBpbnZhcmlhbnQgYnV0IG9ubHkgbG9ncyBhIHdhcm5pbmcgaWYgdGhlIGNvbmRpdGlvbiBpcyBub3QgbWV0LlxuICogVGhpcyBjYW4gYmUgdXNlZCB0byBsb2cgaXNzdWVzIGluIGRldmVsb3BtZW50IGVudmlyb25tZW50cyBpbiBjcml0aWNhbFxuICogcGF0aHMuIFJlbW92aW5nIHRoZSBsb2dnaW5nIGNvZGUgZm9yIHByb2R1Y3Rpb24gZW52aXJvbm1lbnRzIHdpbGwga2VlcCB0aGVcbiAqIHNhbWUgbG9naWMgYW5kIGZvbGxvdyB0aGUgc2FtZSBjb2RlIHBhdGhzLlxuICovXG5cbnZhciBsb3dQcmlvcml0eVdhcm5pbmcgPSBmdW5jdGlvbiAoKSB7fTtcblxue1xuICB2YXIgcHJpbnRXYXJuaW5nID0gZnVuY3Rpb24gKGZvcm1hdCkge1xuICAgIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbiA+IDEgPyBfbGVuIC0gMSA6IDApLCBfa2V5ID0gMTsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuICAgICAgYXJnc1tfa2V5IC0gMV0gPSBhcmd1bWVudHNbX2tleV07XG4gICAgfVxuXG4gICAgdmFyIGFyZ0luZGV4ID0gMDtcbiAgICB2YXIgbWVzc2FnZSA9ICdXYXJuaW5nOiAnICsgZm9ybWF0LnJlcGxhY2UoLyVzL2csIGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBhcmdzW2FyZ0luZGV4KytdO1xuICAgIH0pO1xuICAgIGlmICh0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIGNvbnNvbGUud2FybihtZXNzYWdlKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgIC8vIC0tLSBXZWxjb21lIHRvIGRlYnVnZ2luZyBSZWFjdCAtLS1cbiAgICAgIC8vIFRoaXMgZXJyb3Igd2FzIHRocm93biBhcyBhIGNvbnZlbmllbmNlIHNvIHRoYXQgeW91IGNhbiB1c2UgdGhpcyBzdGFja1xuICAgICAgLy8gdG8gZmluZCB0aGUgY2FsbHNpdGUgdGhhdCBjYXVzZWQgdGhpcyB3YXJuaW5nIHRvIGZpcmUuXG4gICAgICB0aHJvdyBuZXcgRXJyb3IobWVzc2FnZSk7XG4gICAgfSBjYXRjaCAoeCkge31cbiAgfTtcblxuICBsb3dQcmlvcml0eVdhcm5pbmcgPSBmdW5jdGlvbiAoY29uZGl0aW9uLCBmb3JtYXQpIHtcbiAgICBpZiAoZm9ybWF0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignYGxvd1ByaW9yaXR5V2FybmluZyhjb25kaXRpb24sIGZvcm1hdCwgLi4uYXJncylgIHJlcXVpcmVzIGEgd2FybmluZyAnICsgJ21lc3NhZ2UgYXJndW1lbnQnKTtcbiAgICB9XG4gICAgaWYgKCFjb25kaXRpb24pIHtcbiAgICAgIGZvciAodmFyIF9sZW4yID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IEFycmF5KF9sZW4yID4gMiA/IF9sZW4yIC0gMiA6IDApLCBfa2V5MiA9IDI7IF9rZXkyIDwgX2xlbjI7IF9rZXkyKyspIHtcbiAgICAgICAgYXJnc1tfa2V5MiAtIDJdID0gYXJndW1lbnRzW19rZXkyXTtcbiAgICAgIH1cblxuICAgICAgcHJpbnRXYXJuaW5nLmFwcGx5KHVuZGVmaW5lZCwgW2Zvcm1hdF0uY29uY2F0KGFyZ3MpKTtcbiAgICB9XG4gIH07XG59XG5cbnZhciBsb3dQcmlvcml0eVdhcm5pbmckMSA9IGxvd1ByaW9yaXR5V2FybmluZztcblxuLyoqXG4gKiBTaW1pbGFyIHRvIGludmFyaWFudCBidXQgb25seSBsb2dzIGEgd2FybmluZyBpZiB0aGUgY29uZGl0aW9uIGlzIG5vdCBtZXQuXG4gKiBUaGlzIGNhbiBiZSB1c2VkIHRvIGxvZyBpc3N1ZXMgaW4gZGV2ZWxvcG1lbnQgZW52aXJvbm1lbnRzIGluIGNyaXRpY2FsXG4gKiBwYXRocy4gUmVtb3ZpbmcgdGhlIGxvZ2dpbmcgY29kZSBmb3IgcHJvZHVjdGlvbiBlbnZpcm9ubWVudHMgd2lsbCBrZWVwIHRoZVxuICogc2FtZSBsb2dpYyBhbmQgZm9sbG93IHRoZSBzYW1lIGNvZGUgcGF0aHMuXG4gKi9cblxudmFyIHdhcm5pbmdXaXRob3V0U3RhY2sgPSBmdW5jdGlvbiAoKSB7fTtcblxue1xuICB3YXJuaW5nV2l0aG91dFN0YWNrID0gZnVuY3Rpb24gKGNvbmRpdGlvbiwgZm9ybWF0KSB7XG4gICAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuID4gMiA/IF9sZW4gLSAyIDogMCksIF9rZXkgPSAyOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgICBhcmdzW19rZXkgLSAyXSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgICB9XG5cbiAgICBpZiAoZm9ybWF0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignYHdhcm5pbmdXaXRob3V0U3RhY2soY29uZGl0aW9uLCBmb3JtYXQsIC4uLmFyZ3MpYCByZXF1aXJlcyBhIHdhcm5pbmcgJyArICdtZXNzYWdlIGFyZ3VtZW50Jyk7XG4gICAgfVxuICAgIGlmIChhcmdzLmxlbmd0aCA+IDgpIHtcbiAgICAgIC8vIENoZWNrIGJlZm9yZSB0aGUgY29uZGl0aW9uIHRvIGNhdGNoIHZpb2xhdGlvbnMgZWFybHkuXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ3dhcm5pbmdXaXRob3V0U3RhY2soKSBjdXJyZW50bHkgc3VwcG9ydHMgYXQgbW9zdCA4IGFyZ3VtZW50cy4nKTtcbiAgICB9XG4gICAgaWYgKGNvbmRpdGlvbikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIGNvbnNvbGUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICB2YXIgYXJnc1dpdGhGb3JtYXQgPSBhcmdzLm1hcChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICByZXR1cm4gJycgKyBpdGVtO1xuICAgICAgfSk7XG4gICAgICBhcmdzV2l0aEZvcm1hdC51bnNoaWZ0KCdXYXJuaW5nOiAnICsgZm9ybWF0KTtcblxuICAgICAgLy8gV2UgaW50ZW50aW9uYWxseSBkb24ndCB1c2Ugc3ByZWFkIChvciAuYXBwbHkpIGRpcmVjdGx5IGJlY2F1c2UgaXRcbiAgICAgIC8vIGJyZWFrcyBJRTk6IGh0dHBzOi8vZ2l0aHViLmNvbS9mYWNlYm9vay9yZWFjdC9pc3N1ZXMvMTM2MTBcbiAgICAgIEZ1bmN0aW9uLnByb3RvdHlwZS5hcHBseS5jYWxsKGNvbnNvbGUuZXJyb3IsIGNvbnNvbGUsIGFyZ3NXaXRoRm9ybWF0KTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgIC8vIC0tLSBXZWxjb21lIHRvIGRlYnVnZ2luZyBSZWFjdCAtLS1cbiAgICAgIC8vIFRoaXMgZXJyb3Igd2FzIHRocm93biBhcyBhIGNvbnZlbmllbmNlIHNvIHRoYXQgeW91IGNhbiB1c2UgdGhpcyBzdGFja1xuICAgICAgLy8gdG8gZmluZCB0aGUgY2FsbHNpdGUgdGhhdCBjYXVzZWQgdGhpcyB3YXJuaW5nIHRvIGZpcmUuXG4gICAgICB2YXIgYXJnSW5kZXggPSAwO1xuICAgICAgdmFyIG1lc3NhZ2UgPSAnV2FybmluZzogJyArIGZvcm1hdC5yZXBsYWNlKC8lcy9nLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBhcmdzW2FyZ0luZGV4KytdO1xuICAgICAgfSk7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IobWVzc2FnZSk7XG4gICAgfSBjYXRjaCAoeCkge31cbiAgfTtcbn1cblxudmFyIHdhcm5pbmdXaXRob3V0U3RhY2skMSA9IHdhcm5pbmdXaXRob3V0U3RhY2s7XG5cbnZhciBkaWRXYXJuU3RhdGVVcGRhdGVGb3JVbm1vdW50ZWRDb21wb25lbnQgPSB7fTtcblxuZnVuY3Rpb24gd2Fybk5vb3AocHVibGljSW5zdGFuY2UsIGNhbGxlck5hbWUpIHtcbiAge1xuICAgIHZhciBfY29uc3RydWN0b3IgPSBwdWJsaWNJbnN0YW5jZS5jb25zdHJ1Y3RvcjtcbiAgICB2YXIgY29tcG9uZW50TmFtZSA9IF9jb25zdHJ1Y3RvciAmJiAoX2NvbnN0cnVjdG9yLmRpc3BsYXlOYW1lIHx8IF9jb25zdHJ1Y3Rvci5uYW1lKSB8fCAnUmVhY3RDbGFzcyc7XG4gICAgdmFyIHdhcm5pbmdLZXkgPSBjb21wb25lbnROYW1lICsgJy4nICsgY2FsbGVyTmFtZTtcbiAgICBpZiAoZGlkV2FyblN0YXRlVXBkYXRlRm9yVW5tb3VudGVkQ29tcG9uZW50W3dhcm5pbmdLZXldKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHdhcm5pbmdXaXRob3V0U3RhY2skMShmYWxzZSwgXCJDYW4ndCBjYWxsICVzIG9uIGEgY29tcG9uZW50IHRoYXQgaXMgbm90IHlldCBtb3VudGVkLiBcIiArICdUaGlzIGlzIGEgbm8tb3AsIGJ1dCBpdCBtaWdodCBpbmRpY2F0ZSBhIGJ1ZyBpbiB5b3VyIGFwcGxpY2F0aW9uLiAnICsgJ0luc3RlYWQsIGFzc2lnbiB0byBgdGhpcy5zdGF0ZWAgZGlyZWN0bHkgb3IgZGVmaW5lIGEgYHN0YXRlID0ge307YCAnICsgJ2NsYXNzIHByb3BlcnR5IHdpdGggdGhlIGRlc2lyZWQgc3RhdGUgaW4gdGhlICVzIGNvbXBvbmVudC4nLCBjYWxsZXJOYW1lLCBjb21wb25lbnROYW1lKTtcbiAgICBkaWRXYXJuU3RhdGVVcGRhdGVGb3JVbm1vdW50ZWRDb21wb25lbnRbd2FybmluZ0tleV0gPSB0cnVlO1xuICB9XG59XG5cbi8qKlxuICogVGhpcyBpcyB0aGUgYWJzdHJhY3QgQVBJIGZvciBhbiB1cGRhdGUgcXVldWUuXG4gKi9cbnZhciBSZWFjdE5vb3BVcGRhdGVRdWV1ZSA9IHtcbiAgLyoqXG4gICAqIENoZWNrcyB3aGV0aGVyIG9yIG5vdCB0aGlzIGNvbXBvc2l0ZSBjb21wb25lbnQgaXMgbW91bnRlZC5cbiAgICogQHBhcmFtIHtSZWFjdENsYXNzfSBwdWJsaWNJbnN0YW5jZSBUaGUgaW5zdGFuY2Ugd2Ugd2FudCB0byB0ZXN0LlxuICAgKiBAcmV0dXJuIHtib29sZWFufSBUcnVlIGlmIG1vdW50ZWQsIGZhbHNlIG90aGVyd2lzZS5cbiAgICogQHByb3RlY3RlZFxuICAgKiBAZmluYWxcbiAgICovXG4gIGlzTW91bnRlZDogZnVuY3Rpb24gKHB1YmxpY0luc3RhbmNlKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9LFxuXG4gIC8qKlxuICAgKiBGb3JjZXMgYW4gdXBkYXRlLiBUaGlzIHNob3VsZCBvbmx5IGJlIGludm9rZWQgd2hlbiBpdCBpcyBrbm93biB3aXRoXG4gICAqIGNlcnRhaW50eSB0aGF0IHdlIGFyZSAqKm5vdCoqIGluIGEgRE9NIHRyYW5zYWN0aW9uLlxuICAgKlxuICAgKiBZb3UgbWF5IHdhbnQgdG8gY2FsbCB0aGlzIHdoZW4geW91IGtub3cgdGhhdCBzb21lIGRlZXBlciBhc3BlY3Qgb2YgdGhlXG4gICAqIGNvbXBvbmVudCdzIHN0YXRlIGhhcyBjaGFuZ2VkIGJ1dCBgc2V0U3RhdGVgIHdhcyBub3QgY2FsbGVkLlxuICAgKlxuICAgKiBUaGlzIHdpbGwgbm90IGludm9rZSBgc2hvdWxkQ29tcG9uZW50VXBkYXRlYCwgYnV0IGl0IHdpbGwgaW52b2tlXG4gICAqIGBjb21wb25lbnRXaWxsVXBkYXRlYCBhbmQgYGNvbXBvbmVudERpZFVwZGF0ZWAuXG4gICAqXG4gICAqIEBwYXJhbSB7UmVhY3RDbGFzc30gcHVibGljSW5zdGFuY2UgVGhlIGluc3RhbmNlIHRoYXQgc2hvdWxkIHJlcmVuZGVyLlxuICAgKiBAcGFyYW0gez9mdW5jdGlvbn0gY2FsbGJhY2sgQ2FsbGVkIGFmdGVyIGNvbXBvbmVudCBpcyB1cGRhdGVkLlxuICAgKiBAcGFyYW0gez9zdHJpbmd9IGNhbGxlck5hbWUgbmFtZSBvZiB0aGUgY2FsbGluZyBmdW5jdGlvbiBpbiB0aGUgcHVibGljIEFQSS5cbiAgICogQGludGVybmFsXG4gICAqL1xuICBlbnF1ZXVlRm9yY2VVcGRhdGU6IGZ1bmN0aW9uIChwdWJsaWNJbnN0YW5jZSwgY2FsbGJhY2ssIGNhbGxlck5hbWUpIHtcbiAgICB3YXJuTm9vcChwdWJsaWNJbnN0YW5jZSwgJ2ZvcmNlVXBkYXRlJyk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFJlcGxhY2VzIGFsbCBvZiB0aGUgc3RhdGUuIEFsd2F5cyB1c2UgdGhpcyBvciBgc2V0U3RhdGVgIHRvIG11dGF0ZSBzdGF0ZS5cbiAgICogWW91IHNob3VsZCB0cmVhdCBgdGhpcy5zdGF0ZWAgYXMgaW1tdXRhYmxlLlxuICAgKlxuICAgKiBUaGVyZSBpcyBubyBndWFyYW50ZWUgdGhhdCBgdGhpcy5zdGF0ZWAgd2lsbCBiZSBpbW1lZGlhdGVseSB1cGRhdGVkLCBzb1xuICAgKiBhY2Nlc3NpbmcgYHRoaXMuc3RhdGVgIGFmdGVyIGNhbGxpbmcgdGhpcyBtZXRob2QgbWF5IHJldHVybiB0aGUgb2xkIHZhbHVlLlxuICAgKlxuICAgKiBAcGFyYW0ge1JlYWN0Q2xhc3N9IHB1YmxpY0luc3RhbmNlIFRoZSBpbnN0YW5jZSB0aGF0IHNob3VsZCByZXJlbmRlci5cbiAgICogQHBhcmFtIHtvYmplY3R9IGNvbXBsZXRlU3RhdGUgTmV4dCBzdGF0ZS5cbiAgICogQHBhcmFtIHs/ZnVuY3Rpb259IGNhbGxiYWNrIENhbGxlZCBhZnRlciBjb21wb25lbnQgaXMgdXBkYXRlZC5cbiAgICogQHBhcmFtIHs/c3RyaW5nfSBjYWxsZXJOYW1lIG5hbWUgb2YgdGhlIGNhbGxpbmcgZnVuY3Rpb24gaW4gdGhlIHB1YmxpYyBBUEkuXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgZW5xdWV1ZVJlcGxhY2VTdGF0ZTogZnVuY3Rpb24gKHB1YmxpY0luc3RhbmNlLCBjb21wbGV0ZVN0YXRlLCBjYWxsYmFjaywgY2FsbGVyTmFtZSkge1xuICAgIHdhcm5Ob29wKHB1YmxpY0luc3RhbmNlLCAncmVwbGFjZVN0YXRlJyk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFNldHMgYSBzdWJzZXQgb2YgdGhlIHN0YXRlLiBUaGlzIG9ubHkgZXhpc3RzIGJlY2F1c2UgX3BlbmRpbmdTdGF0ZSBpc1xuICAgKiBpbnRlcm5hbC4gVGhpcyBwcm92aWRlcyBhIG1lcmdpbmcgc3RyYXRlZ3kgdGhhdCBpcyBub3QgYXZhaWxhYmxlIHRvIGRlZXBcbiAgICogcHJvcGVydGllcyB3aGljaCBpcyBjb25mdXNpbmcuIFRPRE86IEV4cG9zZSBwZW5kaW5nU3RhdGUgb3IgZG9uJ3QgdXNlIGl0XG4gICAqIGR1cmluZyB0aGUgbWVyZ2UuXG4gICAqXG4gICAqIEBwYXJhbSB7UmVhY3RDbGFzc30gcHVibGljSW5zdGFuY2UgVGhlIGluc3RhbmNlIHRoYXQgc2hvdWxkIHJlcmVuZGVyLlxuICAgKiBAcGFyYW0ge29iamVjdH0gcGFydGlhbFN0YXRlIE5leHQgcGFydGlhbCBzdGF0ZSB0byBiZSBtZXJnZWQgd2l0aCBzdGF0ZS5cbiAgICogQHBhcmFtIHs/ZnVuY3Rpb259IGNhbGxiYWNrIENhbGxlZCBhZnRlciBjb21wb25lbnQgaXMgdXBkYXRlZC5cbiAgICogQHBhcmFtIHs/c3RyaW5nfSBOYW1lIG9mIHRoZSBjYWxsaW5nIGZ1bmN0aW9uIGluIHRoZSBwdWJsaWMgQVBJLlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIGVucXVldWVTZXRTdGF0ZTogZnVuY3Rpb24gKHB1YmxpY0luc3RhbmNlLCBwYXJ0aWFsU3RhdGUsIGNhbGxiYWNrLCBjYWxsZXJOYW1lKSB7XG4gICAgd2Fybk5vb3AocHVibGljSW5zdGFuY2UsICdzZXRTdGF0ZScpO1xuICB9XG59O1xuXG52YXIgZW1wdHlPYmplY3QgPSB7fTtcbntcbiAgT2JqZWN0LmZyZWV6ZShlbXB0eU9iamVjdCk7XG59XG5cbi8qKlxuICogQmFzZSBjbGFzcyBoZWxwZXJzIGZvciB0aGUgdXBkYXRpbmcgc3RhdGUgb2YgYSBjb21wb25lbnQuXG4gKi9cbmZ1bmN0aW9uIENvbXBvbmVudChwcm9wcywgY29udGV4dCwgdXBkYXRlcikge1xuICB0aGlzLnByb3BzID0gcHJvcHM7XG4gIHRoaXMuY29udGV4dCA9IGNvbnRleHQ7XG4gIC8vIElmIGEgY29tcG9uZW50IGhhcyBzdHJpbmcgcmVmcywgd2Ugd2lsbCBhc3NpZ24gYSBkaWZmZXJlbnQgb2JqZWN0IGxhdGVyLlxuICB0aGlzLnJlZnMgPSBlbXB0eU9iamVjdDtcbiAgLy8gV2UgaW5pdGlhbGl6ZSB0aGUgZGVmYXVsdCB1cGRhdGVyIGJ1dCB0aGUgcmVhbCBvbmUgZ2V0cyBpbmplY3RlZCBieSB0aGVcbiAgLy8gcmVuZGVyZXIuXG4gIHRoaXMudXBkYXRlciA9IHVwZGF0ZXIgfHwgUmVhY3ROb29wVXBkYXRlUXVldWU7XG59XG5cbkNvbXBvbmVudC5wcm90b3R5cGUuaXNSZWFjdENvbXBvbmVudCA9IHt9O1xuXG4vKipcbiAqIFNldHMgYSBzdWJzZXQgb2YgdGhlIHN0YXRlLiBBbHdheXMgdXNlIHRoaXMgdG8gbXV0YXRlXG4gKiBzdGF0ZS4gWW91IHNob3VsZCB0cmVhdCBgdGhpcy5zdGF0ZWAgYXMgaW1tdXRhYmxlLlxuICpcbiAqIFRoZXJlIGlzIG5vIGd1YXJhbnRlZSB0aGF0IGB0aGlzLnN0YXRlYCB3aWxsIGJlIGltbWVkaWF0ZWx5IHVwZGF0ZWQsIHNvXG4gKiBhY2Nlc3NpbmcgYHRoaXMuc3RhdGVgIGFmdGVyIGNhbGxpbmcgdGhpcyBtZXRob2QgbWF5IHJldHVybiB0aGUgb2xkIHZhbHVlLlxuICpcbiAqIFRoZXJlIGlzIG5vIGd1YXJhbnRlZSB0aGF0IGNhbGxzIHRvIGBzZXRTdGF0ZWAgd2lsbCBydW4gc3luY2hyb25vdXNseSxcbiAqIGFzIHRoZXkgbWF5IGV2ZW50dWFsbHkgYmUgYmF0Y2hlZCB0b2dldGhlci4gIFlvdSBjYW4gcHJvdmlkZSBhbiBvcHRpb25hbFxuICogY2FsbGJhY2sgdGhhdCB3aWxsIGJlIGV4ZWN1dGVkIHdoZW4gdGhlIGNhbGwgdG8gc2V0U3RhdGUgaXMgYWN0dWFsbHlcbiAqIGNvbXBsZXRlZC5cbiAqXG4gKiBXaGVuIGEgZnVuY3Rpb24gaXMgcHJvdmlkZWQgdG8gc2V0U3RhdGUsIGl0IHdpbGwgYmUgY2FsbGVkIGF0IHNvbWUgcG9pbnQgaW5cbiAqIHRoZSBmdXR1cmUgKG5vdCBzeW5jaHJvbm91c2x5KS4gSXQgd2lsbCBiZSBjYWxsZWQgd2l0aCB0aGUgdXAgdG8gZGF0ZVxuICogY29tcG9uZW50IGFyZ3VtZW50cyAoc3RhdGUsIHByb3BzLCBjb250ZXh0KS4gVGhlc2UgdmFsdWVzIGNhbiBiZSBkaWZmZXJlbnRcbiAqIGZyb20gdGhpcy4qIGJlY2F1c2UgeW91ciBmdW5jdGlvbiBtYXkgYmUgY2FsbGVkIGFmdGVyIHJlY2VpdmVQcm9wcyBidXQgYmVmb3JlXG4gKiBzaG91bGRDb21wb25lbnRVcGRhdGUsIGFuZCB0aGlzIG5ldyBzdGF0ZSwgcHJvcHMsIGFuZCBjb250ZXh0IHdpbGwgbm90IHlldCBiZVxuICogYXNzaWduZWQgdG8gdGhpcy5cbiAqXG4gKiBAcGFyYW0ge29iamVjdHxmdW5jdGlvbn0gcGFydGlhbFN0YXRlIE5leHQgcGFydGlhbCBzdGF0ZSBvciBmdW5jdGlvbiB0b1xuICogICAgICAgIHByb2R1Y2UgbmV4dCBwYXJ0aWFsIHN0YXRlIHRvIGJlIG1lcmdlZCB3aXRoIGN1cnJlbnQgc3RhdGUuXG4gKiBAcGFyYW0gez9mdW5jdGlvbn0gY2FsbGJhY2sgQ2FsbGVkIGFmdGVyIHN0YXRlIGlzIHVwZGF0ZWQuXG4gKiBAZmluYWxcbiAqIEBwcm90ZWN0ZWRcbiAqL1xuQ29tcG9uZW50LnByb3RvdHlwZS5zZXRTdGF0ZSA9IGZ1bmN0aW9uIChwYXJ0aWFsU3RhdGUsIGNhbGxiYWNrKSB7XG4gIChmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCEodHlwZW9mIHBhcnRpYWxTdGF0ZSA9PT0gJ29iamVjdCcgfHwgdHlwZW9mIHBhcnRpYWxTdGF0ZSA9PT0gJ2Z1bmN0aW9uJyB8fCBwYXJ0aWFsU3RhdGUgPT0gbnVsbCkpIHtcbiAgICAgIHtcbiAgICAgICAgdGhyb3cgUmVhY3RFcnJvcihFcnJvcignc2V0U3RhdGUoLi4uKTogdGFrZXMgYW4gb2JqZWN0IG9mIHN0YXRlIHZhcmlhYmxlcyB0byB1cGRhdGUgb3IgYSBmdW5jdGlvbiB3aGljaCByZXR1cm5zIGFuIG9iamVjdCBvZiBzdGF0ZSB2YXJpYWJsZXMuJykpO1xuICAgICAgfVxuICAgIH1cbiAgfSkoKTtcbiAgdGhpcy51cGRhdGVyLmVucXVldWVTZXRTdGF0ZSh0aGlzLCBwYXJ0aWFsU3RhdGUsIGNhbGxiYWNrLCAnc2V0U3RhdGUnKTtcbn07XG5cbi8qKlxuICogRm9yY2VzIGFuIHVwZGF0ZS4gVGhpcyBzaG91bGQgb25seSBiZSBpbnZva2VkIHdoZW4gaXQgaXMga25vd24gd2l0aFxuICogY2VydGFpbnR5IHRoYXQgd2UgYXJlICoqbm90KiogaW4gYSBET00gdHJhbnNhY3Rpb24uXG4gKlxuICogWW91IG1heSB3YW50IHRvIGNhbGwgdGhpcyB3aGVuIHlvdSBrbm93IHRoYXQgc29tZSBkZWVwZXIgYXNwZWN0IG9mIHRoZVxuICogY29tcG9uZW50J3Mgc3RhdGUgaGFzIGNoYW5nZWQgYnV0IGBzZXRTdGF0ZWAgd2FzIG5vdCBjYWxsZWQuXG4gKlxuICogVGhpcyB3aWxsIG5vdCBpbnZva2UgYHNob3VsZENvbXBvbmVudFVwZGF0ZWAsIGJ1dCBpdCB3aWxsIGludm9rZVxuICogYGNvbXBvbmVudFdpbGxVcGRhdGVgIGFuZCBgY29tcG9uZW50RGlkVXBkYXRlYC5cbiAqXG4gKiBAcGFyYW0gez9mdW5jdGlvbn0gY2FsbGJhY2sgQ2FsbGVkIGFmdGVyIHVwZGF0ZSBpcyBjb21wbGV0ZS5cbiAqIEBmaW5hbFxuICogQHByb3RlY3RlZFxuICovXG5Db21wb25lbnQucHJvdG90eXBlLmZvcmNlVXBkYXRlID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gIHRoaXMudXBkYXRlci5lbnF1ZXVlRm9yY2VVcGRhdGUodGhpcywgY2FsbGJhY2ssICdmb3JjZVVwZGF0ZScpO1xufTtcblxuLyoqXG4gKiBEZXByZWNhdGVkIEFQSXMuIFRoZXNlIEFQSXMgdXNlZCB0byBleGlzdCBvbiBjbGFzc2ljIFJlYWN0IGNsYXNzZXMgYnV0IHNpbmNlXG4gKiB3ZSB3b3VsZCBsaWtlIHRvIGRlcHJlY2F0ZSB0aGVtLCB3ZSdyZSBub3QgZ29pbmcgdG8gbW92ZSB0aGVtIG92ZXIgdG8gdGhpc1xuICogbW9kZXJuIGJhc2UgY2xhc3MuIEluc3RlYWQsIHdlIGRlZmluZSBhIGdldHRlciB0aGF0IHdhcm5zIGlmIGl0J3MgYWNjZXNzZWQuXG4gKi9cbntcbiAgdmFyIGRlcHJlY2F0ZWRBUElzID0ge1xuICAgIGlzTW91bnRlZDogWydpc01vdW50ZWQnLCAnSW5zdGVhZCwgbWFrZSBzdXJlIHRvIGNsZWFuIHVwIHN1YnNjcmlwdGlvbnMgYW5kIHBlbmRpbmcgcmVxdWVzdHMgaW4gJyArICdjb21wb25lbnRXaWxsVW5tb3VudCB0byBwcmV2ZW50IG1lbW9yeSBsZWFrcy4nXSxcbiAgICByZXBsYWNlU3RhdGU6IFsncmVwbGFjZVN0YXRlJywgJ1JlZmFjdG9yIHlvdXIgY29kZSB0byB1c2Ugc2V0U3RhdGUgaW5zdGVhZCAoc2VlICcgKyAnaHR0cHM6Ly9naXRodWIuY29tL2ZhY2Vib29rL3JlYWN0L2lzc3Vlcy8zMjM2KS4nXVxuICB9O1xuICB2YXIgZGVmaW5lRGVwcmVjYXRpb25XYXJuaW5nID0gZnVuY3Rpb24gKG1ldGhvZE5hbWUsIGluZm8pIHtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoQ29tcG9uZW50LnByb3RvdHlwZSwgbWV0aG9kTmFtZSwge1xuICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGxvd1ByaW9yaXR5V2FybmluZyQxKGZhbHNlLCAnJXMoLi4uKSBpcyBkZXByZWNhdGVkIGluIHBsYWluIEphdmFTY3JpcHQgUmVhY3QgY2xhc3Nlcy4gJXMnLCBpbmZvWzBdLCBpbmZvWzFdKTtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcbiAgZm9yICh2YXIgZm5OYW1lIGluIGRlcHJlY2F0ZWRBUElzKSB7XG4gICAgaWYgKGRlcHJlY2F0ZWRBUElzLmhhc093blByb3BlcnR5KGZuTmFtZSkpIHtcbiAgICAgIGRlZmluZURlcHJlY2F0aW9uV2FybmluZyhmbk5hbWUsIGRlcHJlY2F0ZWRBUElzW2ZuTmFtZV0pO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBDb21wb25lbnREdW1teSgpIHt9XG5Db21wb25lbnREdW1teS5wcm90b3R5cGUgPSBDb21wb25lbnQucHJvdG90eXBlO1xuXG4vKipcbiAqIENvbnZlbmllbmNlIGNvbXBvbmVudCB3aXRoIGRlZmF1bHQgc2hhbGxvdyBlcXVhbGl0eSBjaGVjayBmb3Igc0NVLlxuICovXG5mdW5jdGlvbiBQdXJlQ29tcG9uZW50KHByb3BzLCBjb250ZXh0LCB1cGRhdGVyKSB7XG4gIHRoaXMucHJvcHMgPSBwcm9wcztcbiAgdGhpcy5jb250ZXh0ID0gY29udGV4dDtcbiAgLy8gSWYgYSBjb21wb25lbnQgaGFzIHN0cmluZyByZWZzLCB3ZSB3aWxsIGFzc2lnbiBhIGRpZmZlcmVudCBvYmplY3QgbGF0ZXIuXG4gIHRoaXMucmVmcyA9IGVtcHR5T2JqZWN0O1xuICB0aGlzLnVwZGF0ZXIgPSB1cGRhdGVyIHx8IFJlYWN0Tm9vcFVwZGF0ZVF1ZXVlO1xufVxuXG52YXIgcHVyZUNvbXBvbmVudFByb3RvdHlwZSA9IFB1cmVDb21wb25lbnQucHJvdG90eXBlID0gbmV3IENvbXBvbmVudER1bW15KCk7XG5wdXJlQ29tcG9uZW50UHJvdG90eXBlLmNvbnN0cnVjdG9yID0gUHVyZUNvbXBvbmVudDtcbi8vIEF2b2lkIGFuIGV4dHJhIHByb3RvdHlwZSBqdW1wIGZvciB0aGVzZSBtZXRob2RzLlxuX2Fzc2lnbihwdXJlQ29tcG9uZW50UHJvdG90eXBlLCBDb21wb25lbnQucHJvdG90eXBlKTtcbnB1cmVDb21wb25lbnRQcm90b3R5cGUuaXNQdXJlUmVhY3RDb21wb25lbnQgPSB0cnVlO1xuXG4vLyBhbiBpbW11dGFibGUgb2JqZWN0IHdpdGggYSBzaW5nbGUgbXV0YWJsZSB2YWx1ZVxuZnVuY3Rpb24gY3JlYXRlUmVmKCkge1xuICB2YXIgcmVmT2JqZWN0ID0ge1xuICAgIGN1cnJlbnQ6IG51bGxcbiAgfTtcbiAge1xuICAgIE9iamVjdC5zZWFsKHJlZk9iamVjdCk7XG4gIH1cbiAgcmV0dXJuIHJlZk9iamVjdDtcbn1cblxuLyoqXG4gKiBLZWVwcyB0cmFjayBvZiB0aGUgY3VycmVudCBkaXNwYXRjaGVyLlxuICovXG52YXIgUmVhY3RDdXJyZW50RGlzcGF0Y2hlciA9IHtcbiAgLyoqXG4gICAqIEBpbnRlcm5hbFxuICAgKiBAdHlwZSB7UmVhY3RDb21wb25lbnR9XG4gICAqL1xuICBjdXJyZW50OiBudWxsXG59O1xuXG4vKipcbiAqIEtlZXBzIHRyYWNrIG9mIHRoZSBjdXJyZW50IGJhdGNoJ3MgY29uZmlndXJhdGlvbiBzdWNoIGFzIGhvdyBsb25nIGFuIHVwZGF0ZVxuICogc2hvdWxkIHN1c3BlbmQgZm9yIGlmIGl0IG5lZWRzIHRvLlxuICovXG52YXIgUmVhY3RDdXJyZW50QmF0Y2hDb25maWcgPSB7XG4gIHN1c3BlbnNlOiBudWxsXG59O1xuXG4vKipcbiAqIEtlZXBzIHRyYWNrIG9mIHRoZSBjdXJyZW50IG93bmVyLlxuICpcbiAqIFRoZSBjdXJyZW50IG93bmVyIGlzIHRoZSBjb21wb25lbnQgd2hvIHNob3VsZCBvd24gYW55IGNvbXBvbmVudHMgdGhhdCBhcmVcbiAqIGN1cnJlbnRseSBiZWluZyBjb25zdHJ1Y3RlZC5cbiAqL1xudmFyIFJlYWN0Q3VycmVudE93bmVyID0ge1xuICAvKipcbiAgICogQGludGVybmFsXG4gICAqIEB0eXBlIHtSZWFjdENvbXBvbmVudH1cbiAgICovXG4gIGN1cnJlbnQ6IG51bGxcbn07XG5cbnZhciBCRUZPUkVfU0xBU0hfUkUgPSAvXiguKilbXFxcXFxcL10vO1xuXG52YXIgZGVzY3JpYmVDb21wb25lbnRGcmFtZSA9IGZ1bmN0aW9uIChuYW1lLCBzb3VyY2UsIG93bmVyTmFtZSkge1xuICB2YXIgc291cmNlSW5mbyA9ICcnO1xuICBpZiAoc291cmNlKSB7XG4gICAgdmFyIHBhdGggPSBzb3VyY2UuZmlsZU5hbWU7XG4gICAgdmFyIGZpbGVOYW1lID0gcGF0aC5yZXBsYWNlKEJFRk9SRV9TTEFTSF9SRSwgJycpO1xuICAgIHtcbiAgICAgIC8vIEluIERFViwgaW5jbHVkZSBjb2RlIGZvciBhIGNvbW1vbiBzcGVjaWFsIGNhc2U6XG4gICAgICAvLyBwcmVmZXIgXCJmb2xkZXIvaW5kZXguanNcIiBpbnN0ZWFkIG9mIGp1c3QgXCJpbmRleC5qc1wiLlxuICAgICAgaWYgKC9eaW5kZXhcXC4vLnRlc3QoZmlsZU5hbWUpKSB7XG4gICAgICAgIHZhciBtYXRjaCA9IHBhdGgubWF0Y2goQkVGT1JFX1NMQVNIX1JFKTtcbiAgICAgICAgaWYgKG1hdGNoKSB7XG4gICAgICAgICAgdmFyIHBhdGhCZWZvcmVTbGFzaCA9IG1hdGNoWzFdO1xuICAgICAgICAgIGlmIChwYXRoQmVmb3JlU2xhc2gpIHtcbiAgICAgICAgICAgIHZhciBmb2xkZXJOYW1lID0gcGF0aEJlZm9yZVNsYXNoLnJlcGxhY2UoQkVGT1JFX1NMQVNIX1JFLCAnJyk7XG4gICAgICAgICAgICBmaWxlTmFtZSA9IGZvbGRlck5hbWUgKyAnLycgKyBmaWxlTmFtZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgc291cmNlSW5mbyA9ICcgKGF0ICcgKyBmaWxlTmFtZSArICc6JyArIHNvdXJjZS5saW5lTnVtYmVyICsgJyknO1xuICB9IGVsc2UgaWYgKG93bmVyTmFtZSkge1xuICAgIHNvdXJjZUluZm8gPSAnIChjcmVhdGVkIGJ5ICcgKyBvd25lck5hbWUgKyAnKSc7XG4gIH1cbiAgcmV0dXJuICdcXG4gICAgaW4gJyArIChuYW1lIHx8ICdVbmtub3duJykgKyBzb3VyY2VJbmZvO1xufTtcblxudmFyIFJlc29sdmVkID0gMTtcblxuXG5mdW5jdGlvbiByZWZpbmVSZXNvbHZlZExhenlDb21wb25lbnQobGF6eUNvbXBvbmVudCkge1xuICByZXR1cm4gbGF6eUNvbXBvbmVudC5fc3RhdHVzID09PSBSZXNvbHZlZCA/IGxhenlDb21wb25lbnQuX3Jlc3VsdCA6IG51bGw7XG59XG5cbmZ1bmN0aW9uIGdldFdyYXBwZWROYW1lKG91dGVyVHlwZSwgaW5uZXJUeXBlLCB3cmFwcGVyTmFtZSkge1xuICB2YXIgZnVuY3Rpb25OYW1lID0gaW5uZXJUeXBlLmRpc3BsYXlOYW1lIHx8IGlubmVyVHlwZS5uYW1lIHx8ICcnO1xuICByZXR1cm4gb3V0ZXJUeXBlLmRpc3BsYXlOYW1lIHx8IChmdW5jdGlvbk5hbWUgIT09ICcnID8gd3JhcHBlck5hbWUgKyAnKCcgKyBmdW5jdGlvbk5hbWUgKyAnKScgOiB3cmFwcGVyTmFtZSk7XG59XG5cbmZ1bmN0aW9uIGdldENvbXBvbmVudE5hbWUodHlwZSkge1xuICBpZiAodHlwZSA9PSBudWxsKSB7XG4gICAgLy8gSG9zdCByb290LCB0ZXh0IG5vZGUgb3IganVzdCBpbnZhbGlkIHR5cGUuXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAge1xuICAgIGlmICh0eXBlb2YgdHlwZS50YWcgPT09ICdudW1iZXInKSB7XG4gICAgICB3YXJuaW5nV2l0aG91dFN0YWNrJDEoZmFsc2UsICdSZWNlaXZlZCBhbiB1bmV4cGVjdGVkIG9iamVjdCBpbiBnZXRDb21wb25lbnROYW1lKCkuICcgKyAnVGhpcyBpcyBsaWtlbHkgYSBidWcgaW4gUmVhY3QuIFBsZWFzZSBmaWxlIGFuIGlzc3VlLicpO1xuICAgIH1cbiAgfVxuICBpZiAodHlwZW9mIHR5cGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gdHlwZS5kaXNwbGF5TmFtZSB8fCB0eXBlLm5hbWUgfHwgbnVsbDtcbiAgfVxuICBpZiAodHlwZW9mIHR5cGUgPT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIHR5cGU7XG4gIH1cbiAgc3dpdGNoICh0eXBlKSB7XG4gICAgY2FzZSBSRUFDVF9GUkFHTUVOVF9UWVBFOlxuICAgICAgcmV0dXJuICdGcmFnbWVudCc7XG4gICAgY2FzZSBSRUFDVF9QT1JUQUxfVFlQRTpcbiAgICAgIHJldHVybiAnUG9ydGFsJztcbiAgICBjYXNlIFJFQUNUX1BST0ZJTEVSX1RZUEU6XG4gICAgICByZXR1cm4gJ1Byb2ZpbGVyJztcbiAgICBjYXNlIFJFQUNUX1NUUklDVF9NT0RFX1RZUEU6XG4gICAgICByZXR1cm4gJ1N0cmljdE1vZGUnO1xuICAgIGNhc2UgUkVBQ1RfU1VTUEVOU0VfVFlQRTpcbiAgICAgIHJldHVybiAnU3VzcGVuc2UnO1xuICAgIGNhc2UgUkVBQ1RfU1VTUEVOU0VfTElTVF9UWVBFOlxuICAgICAgcmV0dXJuICdTdXNwZW5zZUxpc3QnO1xuICB9XG4gIGlmICh0eXBlb2YgdHlwZSA9PT0gJ29iamVjdCcpIHtcbiAgICBzd2l0Y2ggKHR5cGUuJCR0eXBlb2YpIHtcbiAgICAgIGNhc2UgUkVBQ1RfQ09OVEVYVF9UWVBFOlxuICAgICAgICByZXR1cm4gJ0NvbnRleHQuQ29uc3VtZXInO1xuICAgICAgY2FzZSBSRUFDVF9QUk9WSURFUl9UWVBFOlxuICAgICAgICByZXR1cm4gJ0NvbnRleHQuUHJvdmlkZXInO1xuICAgICAgY2FzZSBSRUFDVF9GT1JXQVJEX1JFRl9UWVBFOlxuICAgICAgICByZXR1cm4gZ2V0V3JhcHBlZE5hbWUodHlwZSwgdHlwZS5yZW5kZXIsICdGb3J3YXJkUmVmJyk7XG4gICAgICBjYXNlIFJFQUNUX01FTU9fVFlQRTpcbiAgICAgICAgcmV0dXJuIGdldENvbXBvbmVudE5hbWUodHlwZS50eXBlKTtcbiAgICAgIGNhc2UgUkVBQ1RfTEFaWV9UWVBFOlxuICAgICAgICB7XG4gICAgICAgICAgdmFyIHRoZW5hYmxlID0gdHlwZTtcbiAgICAgICAgICB2YXIgcmVzb2x2ZWRUaGVuYWJsZSA9IHJlZmluZVJlc29sdmVkTGF6eUNvbXBvbmVudCh0aGVuYWJsZSk7XG4gICAgICAgICAgaWYgKHJlc29sdmVkVGhlbmFibGUpIHtcbiAgICAgICAgICAgIHJldHVybiBnZXRDb21wb25lbnROYW1lKHJlc29sdmVkVGhlbmFibGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gbnVsbDtcbn1cblxudmFyIFJlYWN0RGVidWdDdXJyZW50RnJhbWUgPSB7fTtcblxudmFyIGN1cnJlbnRseVZhbGlkYXRpbmdFbGVtZW50ID0gbnVsbDtcblxuZnVuY3Rpb24gc2V0Q3VycmVudGx5VmFsaWRhdGluZ0VsZW1lbnQoZWxlbWVudCkge1xuICB7XG4gICAgY3VycmVudGx5VmFsaWRhdGluZ0VsZW1lbnQgPSBlbGVtZW50O1xuICB9XG59XG5cbntcbiAgLy8gU3RhY2sgaW1wbGVtZW50YXRpb24gaW5qZWN0ZWQgYnkgdGhlIGN1cnJlbnQgcmVuZGVyZXIuXG4gIFJlYWN0RGVidWdDdXJyZW50RnJhbWUuZ2V0Q3VycmVudFN0YWNrID0gbnVsbDtcblxuICBSZWFjdERlYnVnQ3VycmVudEZyYW1lLmdldFN0YWNrQWRkZW5kdW0gPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHN0YWNrID0gJyc7XG5cbiAgICAvLyBBZGQgYW4gZXh0cmEgdG9wIGZyYW1lIHdoaWxlIGFuIGVsZW1lbnQgaXMgYmVpbmcgdmFsaWRhdGVkXG4gICAgaWYgKGN1cnJlbnRseVZhbGlkYXRpbmdFbGVtZW50KSB7XG4gICAgICB2YXIgbmFtZSA9IGdldENvbXBvbmVudE5hbWUoY3VycmVudGx5VmFsaWRhdGluZ0VsZW1lbnQudHlwZSk7XG4gICAgICB2YXIgb3duZXIgPSBjdXJyZW50bHlWYWxpZGF0aW5nRWxlbWVudC5fb3duZXI7XG4gICAgICBzdGFjayArPSBkZXNjcmliZUNvbXBvbmVudEZyYW1lKG5hbWUsIGN1cnJlbnRseVZhbGlkYXRpbmdFbGVtZW50Ll9zb3VyY2UsIG93bmVyICYmIGdldENvbXBvbmVudE5hbWUob3duZXIudHlwZSkpO1xuICAgIH1cblxuICAgIC8vIERlbGVnYXRlIHRvIHRoZSBpbmplY3RlZCByZW5kZXJlci1zcGVjaWZpYyBpbXBsZW1lbnRhdGlvblxuICAgIHZhciBpbXBsID0gUmVhY3REZWJ1Z0N1cnJlbnRGcmFtZS5nZXRDdXJyZW50U3RhY2s7XG4gICAgaWYgKGltcGwpIHtcbiAgICAgIHN0YWNrICs9IGltcGwoKSB8fCAnJztcbiAgICB9XG5cbiAgICByZXR1cm4gc3RhY2s7XG4gIH07XG59XG5cbi8qKlxuICogVXNlZCBieSBhY3QoKSB0byB0cmFjayB3aGV0aGVyIHlvdSdyZSBpbnNpZGUgYW4gYWN0KCkgc2NvcGUuXG4gKi9cblxudmFyIElzU29tZVJlbmRlcmVyQWN0aW5nID0ge1xuICBjdXJyZW50OiBmYWxzZVxufTtcblxudmFyIFJlYWN0U2hhcmVkSW50ZXJuYWxzID0ge1xuICBSZWFjdEN1cnJlbnREaXNwYXRjaGVyOiBSZWFjdEN1cnJlbnREaXNwYXRjaGVyLFxuICBSZWFjdEN1cnJlbnRCYXRjaENvbmZpZzogUmVhY3RDdXJyZW50QmF0Y2hDb25maWcsXG4gIFJlYWN0Q3VycmVudE93bmVyOiBSZWFjdEN1cnJlbnRPd25lcixcbiAgSXNTb21lUmVuZGVyZXJBY3Rpbmc6IElzU29tZVJlbmRlcmVyQWN0aW5nLFxuICAvLyBVc2VkIGJ5IHJlbmRlcmVycyB0byBhdm9pZCBidW5kbGluZyBvYmplY3QtYXNzaWduIHR3aWNlIGluIFVNRCBidW5kbGVzOlxuICBhc3NpZ246IF9hc3NpZ25cbn07XG5cbntcbiAgX2Fzc2lnbihSZWFjdFNoYXJlZEludGVybmFscywge1xuICAgIC8vIFRoZXNlIHNob3VsZCBub3QgYmUgaW5jbHVkZWQgaW4gcHJvZHVjdGlvbi5cbiAgICBSZWFjdERlYnVnQ3VycmVudEZyYW1lOiBSZWFjdERlYnVnQ3VycmVudEZyYW1lLFxuICAgIC8vIFNoaW0gZm9yIFJlYWN0IERPTSAxNi4wLjAgd2hpY2ggc3RpbGwgZGVzdHJ1Y3R1cmVkIChidXQgbm90IHVzZWQpIHRoaXMuXG4gICAgLy8gVE9ETzogcmVtb3ZlIGluIFJlYWN0IDE3LjAuXG4gICAgUmVhY3RDb21wb25lbnRUcmVlSG9vazoge31cbiAgfSk7XG59XG5cbi8qKlxuICogU2ltaWxhciB0byBpbnZhcmlhbnQgYnV0IG9ubHkgbG9ncyBhIHdhcm5pbmcgaWYgdGhlIGNvbmRpdGlvbiBpcyBub3QgbWV0LlxuICogVGhpcyBjYW4gYmUgdXNlZCB0byBsb2cgaXNzdWVzIGluIGRldmVsb3BtZW50IGVudmlyb25tZW50cyBpbiBjcml0aWNhbFxuICogcGF0aHMuIFJlbW92aW5nIHRoZSBsb2dnaW5nIGNvZGUgZm9yIHByb2R1Y3Rpb24gZW52aXJvbm1lbnRzIHdpbGwga2VlcCB0aGVcbiAqIHNhbWUgbG9naWMgYW5kIGZvbGxvdyB0aGUgc2FtZSBjb2RlIHBhdGhzLlxuICovXG5cbnZhciB3YXJuaW5nID0gd2FybmluZ1dpdGhvdXRTdGFjayQxO1xuXG57XG4gIHdhcm5pbmcgPSBmdW5jdGlvbiAoY29uZGl0aW9uLCBmb3JtYXQpIHtcbiAgICBpZiAoY29uZGl0aW9uKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciBSZWFjdERlYnVnQ3VycmVudEZyYW1lID0gUmVhY3RTaGFyZWRJbnRlcm5hbHMuUmVhY3REZWJ1Z0N1cnJlbnRGcmFtZTtcbiAgICB2YXIgc3RhY2sgPSBSZWFjdERlYnVnQ3VycmVudEZyYW1lLmdldFN0YWNrQWRkZW5kdW0oKTtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcmVhY3QtaW50ZXJuYWwvd2FybmluZy1hbmQtaW52YXJpYW50LWFyZ3NcblxuICAgIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbiA+IDIgPyBfbGVuIC0gMiA6IDApLCBfa2V5ID0gMjsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuICAgICAgYXJnc1tfa2V5IC0gMl0gPSBhcmd1bWVudHNbX2tleV07XG4gICAgfVxuXG4gICAgd2FybmluZ1dpdGhvdXRTdGFjayQxLmFwcGx5KHVuZGVmaW5lZCwgW2ZhbHNlLCBmb3JtYXQgKyAnJXMnXS5jb25jYXQoYXJncywgW3N0YWNrXSkpO1xuICB9O1xufVxuXG52YXIgd2FybmluZyQxID0gd2FybmluZztcblxudmFyIGhhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcblxudmFyIFJFU0VSVkVEX1BST1BTID0ge1xuICBrZXk6IHRydWUsXG4gIHJlZjogdHJ1ZSxcbiAgX19zZWxmOiB0cnVlLFxuICBfX3NvdXJjZTogdHJ1ZVxufTtcblxudmFyIHNwZWNpYWxQcm9wS2V5V2FybmluZ1Nob3duID0gdm9pZCAwO1xudmFyIHNwZWNpYWxQcm9wUmVmV2FybmluZ1Nob3duID0gdm9pZCAwO1xuXG5mdW5jdGlvbiBoYXNWYWxpZFJlZihjb25maWcpIHtcbiAge1xuICAgIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKGNvbmZpZywgJ3JlZicpKSB7XG4gICAgICB2YXIgZ2V0dGVyID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihjb25maWcsICdyZWYnKS5nZXQ7XG4gICAgICBpZiAoZ2V0dGVyICYmIGdldHRlci5pc1JlYWN0V2FybmluZykge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBjb25maWcucmVmICE9PSB1bmRlZmluZWQ7XG59XG5cbmZ1bmN0aW9uIGhhc1ZhbGlkS2V5KGNvbmZpZykge1xuICB7XG4gICAgaWYgKGhhc093blByb3BlcnR5LmNhbGwoY29uZmlnLCAna2V5JykpIHtcbiAgICAgIHZhciBnZXR0ZXIgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGNvbmZpZywgJ2tleScpLmdldDtcbiAgICAgIGlmIChnZXR0ZXIgJiYgZ2V0dGVyLmlzUmVhY3RXYXJuaW5nKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIGNvbmZpZy5rZXkgIT09IHVuZGVmaW5lZDtcbn1cblxuZnVuY3Rpb24gZGVmaW5lS2V5UHJvcFdhcm5pbmdHZXR0ZXIocHJvcHMsIGRpc3BsYXlOYW1lKSB7XG4gIHZhciB3YXJuQWJvdXRBY2Nlc3NpbmdLZXkgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCFzcGVjaWFsUHJvcEtleVdhcm5pbmdTaG93bikge1xuICAgICAgc3BlY2lhbFByb3BLZXlXYXJuaW5nU2hvd24gPSB0cnVlO1xuICAgICAgd2FybmluZ1dpdGhvdXRTdGFjayQxKGZhbHNlLCAnJXM6IGBrZXlgIGlzIG5vdCBhIHByb3AuIFRyeWluZyB0byBhY2Nlc3MgaXQgd2lsbCByZXN1bHQgJyArICdpbiBgdW5kZWZpbmVkYCBiZWluZyByZXR1cm5lZC4gSWYgeW91IG5lZWQgdG8gYWNjZXNzIHRoZSBzYW1lICcgKyAndmFsdWUgd2l0aGluIHRoZSBjaGlsZCBjb21wb25lbnQsIHlvdSBzaG91bGQgcGFzcyBpdCBhcyBhIGRpZmZlcmVudCAnICsgJ3Byb3AuIChodHRwczovL2ZiLm1lL3JlYWN0LXNwZWNpYWwtcHJvcHMpJywgZGlzcGxheU5hbWUpO1xuICAgIH1cbiAgfTtcbiAgd2FybkFib3V0QWNjZXNzaW5nS2V5LmlzUmVhY3RXYXJuaW5nID0gdHJ1ZTtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHByb3BzLCAna2V5Jywge1xuICAgIGdldDogd2FybkFib3V0QWNjZXNzaW5nS2V5LFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICB9KTtcbn1cblxuZnVuY3Rpb24gZGVmaW5lUmVmUHJvcFdhcm5pbmdHZXR0ZXIocHJvcHMsIGRpc3BsYXlOYW1lKSB7XG4gIHZhciB3YXJuQWJvdXRBY2Nlc3NpbmdSZWYgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCFzcGVjaWFsUHJvcFJlZldhcm5pbmdTaG93bikge1xuICAgICAgc3BlY2lhbFByb3BSZWZXYXJuaW5nU2hvd24gPSB0cnVlO1xuICAgICAgd2FybmluZ1dpdGhvdXRTdGFjayQxKGZhbHNlLCAnJXM6IGByZWZgIGlzIG5vdCBhIHByb3AuIFRyeWluZyB0byBhY2Nlc3MgaXQgd2lsbCByZXN1bHQgJyArICdpbiBgdW5kZWZpbmVkYCBiZWluZyByZXR1cm5lZC4gSWYgeW91IG5lZWQgdG8gYWNjZXNzIHRoZSBzYW1lICcgKyAndmFsdWUgd2l0aGluIHRoZSBjaGlsZCBjb21wb25lbnQsIHlvdSBzaG91bGQgcGFzcyBpdCBhcyBhIGRpZmZlcmVudCAnICsgJ3Byb3AuIChodHRwczovL2ZiLm1lL3JlYWN0LXNwZWNpYWwtcHJvcHMpJywgZGlzcGxheU5hbWUpO1xuICAgIH1cbiAgfTtcbiAgd2FybkFib3V0QWNjZXNzaW5nUmVmLmlzUmVhY3RXYXJuaW5nID0gdHJ1ZTtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHByb3BzLCAncmVmJywge1xuICAgIGdldDogd2FybkFib3V0QWNjZXNzaW5nUmVmLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICB9KTtcbn1cblxuLyoqXG4gKiBGYWN0b3J5IG1ldGhvZCB0byBjcmVhdGUgYSBuZXcgUmVhY3QgZWxlbWVudC4gVGhpcyBubyBsb25nZXIgYWRoZXJlcyB0b1xuICogdGhlIGNsYXNzIHBhdHRlcm4sIHNvIGRvIG5vdCB1c2UgbmV3IHRvIGNhbGwgaXQuIEFsc28sIG5vIGluc3RhbmNlb2YgY2hlY2tcbiAqIHdpbGwgd29yay4gSW5zdGVhZCB0ZXN0ICQkdHlwZW9mIGZpZWxkIGFnYWluc3QgU3ltYm9sLmZvcigncmVhY3QuZWxlbWVudCcpIHRvIGNoZWNrXG4gKiBpZiBzb21ldGhpbmcgaXMgYSBSZWFjdCBFbGVtZW50LlxuICpcbiAqIEBwYXJhbSB7Kn0gdHlwZVxuICogQHBhcmFtIHsqfSBwcm9wc1xuICogQHBhcmFtIHsqfSBrZXlcbiAqIEBwYXJhbSB7c3RyaW5nfG9iamVjdH0gcmVmXG4gKiBAcGFyYW0geyp9IG93bmVyXG4gKiBAcGFyYW0geyp9IHNlbGYgQSAqdGVtcG9yYXJ5KiBoZWxwZXIgdG8gZGV0ZWN0IHBsYWNlcyB3aGVyZSBgdGhpc2AgaXNcbiAqIGRpZmZlcmVudCBmcm9tIHRoZSBgb3duZXJgIHdoZW4gUmVhY3QuY3JlYXRlRWxlbWVudCBpcyBjYWxsZWQsIHNvIHRoYXQgd2VcbiAqIGNhbiB3YXJuLiBXZSB3YW50IHRvIGdldCByaWQgb2Ygb3duZXIgYW5kIHJlcGxhY2Ugc3RyaW5nIGByZWZgcyB3aXRoIGFycm93XG4gKiBmdW5jdGlvbnMsIGFuZCBhcyBsb25nIGFzIGB0aGlzYCBhbmQgb3duZXIgYXJlIHRoZSBzYW1lLCB0aGVyZSB3aWxsIGJlIG5vXG4gKiBjaGFuZ2UgaW4gYmVoYXZpb3IuXG4gKiBAcGFyYW0geyp9IHNvdXJjZSBBbiBhbm5vdGF0aW9uIG9iamVjdCAoYWRkZWQgYnkgYSB0cmFuc3BpbGVyIG9yIG90aGVyd2lzZSlcbiAqIGluZGljYXRpbmcgZmlsZW5hbWUsIGxpbmUgbnVtYmVyLCBhbmQvb3Igb3RoZXIgaW5mb3JtYXRpb24uXG4gKiBAaW50ZXJuYWxcbiAqL1xudmFyIFJlYWN0RWxlbWVudCA9IGZ1bmN0aW9uICh0eXBlLCBrZXksIHJlZiwgc2VsZiwgc291cmNlLCBvd25lciwgcHJvcHMpIHtcbiAgdmFyIGVsZW1lbnQgPSB7XG4gICAgLy8gVGhpcyB0YWcgYWxsb3dzIHVzIHRvIHVuaXF1ZWx5IGlkZW50aWZ5IHRoaXMgYXMgYSBSZWFjdCBFbGVtZW50XG4gICAgJCR0eXBlb2Y6IFJFQUNUX0VMRU1FTlRfVFlQRSxcblxuICAgIC8vIEJ1aWx0LWluIHByb3BlcnRpZXMgdGhhdCBiZWxvbmcgb24gdGhlIGVsZW1lbnRcbiAgICB0eXBlOiB0eXBlLFxuICAgIGtleToga2V5LFxuICAgIHJlZjogcmVmLFxuICAgIHByb3BzOiBwcm9wcyxcblxuICAgIC8vIFJlY29yZCB0aGUgY29tcG9uZW50IHJlc3BvbnNpYmxlIGZvciBjcmVhdGluZyB0aGlzIGVsZW1lbnQuXG4gICAgX293bmVyOiBvd25lclxuICB9O1xuXG4gIHtcbiAgICAvLyBUaGUgdmFsaWRhdGlvbiBmbGFnIGlzIGN1cnJlbnRseSBtdXRhdGl2ZS4gV2UgcHV0IGl0IG9uXG4gICAgLy8gYW4gZXh0ZXJuYWwgYmFja2luZyBzdG9yZSBzbyB0aGF0IHdlIGNhbiBmcmVlemUgdGhlIHdob2xlIG9iamVjdC5cbiAgICAvLyBUaGlzIGNhbiBiZSByZXBsYWNlZCB3aXRoIGEgV2Vha01hcCBvbmNlIHRoZXkgYXJlIGltcGxlbWVudGVkIGluXG4gICAgLy8gY29tbW9ubHkgdXNlZCBkZXZlbG9wbWVudCBlbnZpcm9ubWVudHMuXG4gICAgZWxlbWVudC5fc3RvcmUgPSB7fTtcblxuICAgIC8vIFRvIG1ha2UgY29tcGFyaW5nIFJlYWN0RWxlbWVudHMgZWFzaWVyIGZvciB0ZXN0aW5nIHB1cnBvc2VzLCB3ZSBtYWtlXG4gICAgLy8gdGhlIHZhbGlkYXRpb24gZmxhZyBub24tZW51bWVyYWJsZSAod2hlcmUgcG9zc2libGUsIHdoaWNoIHNob3VsZFxuICAgIC8vIGluY2x1ZGUgZXZlcnkgZW52aXJvbm1lbnQgd2UgcnVuIHRlc3RzIGluKSwgc28gdGhlIHRlc3QgZnJhbWV3b3JrXG4gICAgLy8gaWdub3JlcyBpdC5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZWxlbWVudC5fc3RvcmUsICd2YWxpZGF0ZWQnLCB7XG4gICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgIHZhbHVlOiBmYWxzZVxuICAgIH0pO1xuICAgIC8vIHNlbGYgYW5kIHNvdXJjZSBhcmUgREVWIG9ubHkgcHJvcGVydGllcy5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZWxlbWVudCwgJ19zZWxmJywge1xuICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgd3JpdGFibGU6IGZhbHNlLFxuICAgICAgdmFsdWU6IHNlbGZcbiAgICB9KTtcbiAgICAvLyBUd28gZWxlbWVudHMgY3JlYXRlZCBpbiB0d28gZGlmZmVyZW50IHBsYWNlcyBzaG91bGQgYmUgY29uc2lkZXJlZFxuICAgIC8vIGVxdWFsIGZvciB0ZXN0aW5nIHB1cnBvc2VzIGFuZCB0aGVyZWZvcmUgd2UgaGlkZSBpdCBmcm9tIGVudW1lcmF0aW9uLlxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlbGVtZW50LCAnX3NvdXJjZScsIHtcbiAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgIHdyaXRhYmxlOiBmYWxzZSxcbiAgICAgIHZhbHVlOiBzb3VyY2VcbiAgICB9KTtcbiAgICBpZiAoT2JqZWN0LmZyZWV6ZSkge1xuICAgICAgT2JqZWN0LmZyZWV6ZShlbGVtZW50LnByb3BzKTtcbiAgICAgIE9iamVjdC5mcmVlemUoZWxlbWVudCk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGVsZW1lbnQ7XG59O1xuXG4vKipcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9yZWFjdGpzL3JmY3MvcHVsbC8xMDdcbiAqIEBwYXJhbSB7Kn0gdHlwZVxuICogQHBhcmFtIHtvYmplY3R9IHByb3BzXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5XG4gKi9cblxuXG4vKipcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9yZWFjdGpzL3JmY3MvcHVsbC8xMDdcbiAqIEBwYXJhbSB7Kn0gdHlwZVxuICogQHBhcmFtIHtvYmplY3R9IHByb3BzXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5XG4gKi9cbmZ1bmN0aW9uIGpzeERFVih0eXBlLCBjb25maWcsIG1heWJlS2V5LCBzb3VyY2UsIHNlbGYpIHtcbiAgdmFyIHByb3BOYW1lID0gdm9pZCAwO1xuXG4gIC8vIFJlc2VydmVkIG5hbWVzIGFyZSBleHRyYWN0ZWRcbiAgdmFyIHByb3BzID0ge307XG5cbiAgdmFyIGtleSA9IG51bGw7XG4gIHZhciByZWYgPSBudWxsO1xuXG4gIGlmIChoYXNWYWxpZFJlZihjb25maWcpKSB7XG4gICAgcmVmID0gY29uZmlnLnJlZjtcbiAgfVxuXG4gIGlmIChoYXNWYWxpZEtleShjb25maWcpKSB7XG4gICAga2V5ID0gJycgKyBjb25maWcua2V5O1xuICB9XG5cbiAgLy8gUmVtYWluaW5nIHByb3BlcnRpZXMgYXJlIGFkZGVkIHRvIGEgbmV3IHByb3BzIG9iamVjdFxuICBmb3IgKHByb3BOYW1lIGluIGNvbmZpZykge1xuICAgIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKGNvbmZpZywgcHJvcE5hbWUpICYmICFSRVNFUlZFRF9QUk9QUy5oYXNPd25Qcm9wZXJ0eShwcm9wTmFtZSkpIHtcbiAgICAgIHByb3BzW3Byb3BOYW1lXSA9IGNvbmZpZ1twcm9wTmFtZV07XG4gICAgfVxuICB9XG5cbiAgLy8gaW50ZW50aW9uYWxseSBub3QgY2hlY2tpbmcgaWYga2V5IHdhcyBzZXQgYWJvdmVcbiAgLy8gdGhpcyBrZXkgaXMgaGlnaGVyIHByaW9yaXR5IGFzIGl0J3Mgc3RhdGljXG4gIGlmIChtYXliZUtleSAhPT0gdW5kZWZpbmVkKSB7XG4gICAga2V5ID0gJycgKyBtYXliZUtleTtcbiAgfVxuXG4gIC8vIFJlc29sdmUgZGVmYXVsdCBwcm9wc1xuICBpZiAodHlwZSAmJiB0eXBlLmRlZmF1bHRQcm9wcykge1xuICAgIHZhciBkZWZhdWx0UHJvcHMgPSB0eXBlLmRlZmF1bHRQcm9wcztcbiAgICBmb3IgKHByb3BOYW1lIGluIGRlZmF1bHRQcm9wcykge1xuICAgICAgaWYgKHByb3BzW3Byb3BOYW1lXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHByb3BzW3Byb3BOYW1lXSA9IGRlZmF1bHRQcm9wc1twcm9wTmFtZV07XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaWYgKGtleSB8fCByZWYpIHtcbiAgICB2YXIgZGlzcGxheU5hbWUgPSB0eXBlb2YgdHlwZSA9PT0gJ2Z1bmN0aW9uJyA/IHR5cGUuZGlzcGxheU5hbWUgfHwgdHlwZS5uYW1lIHx8ICdVbmtub3duJyA6IHR5cGU7XG4gICAgaWYgKGtleSkge1xuICAgICAgZGVmaW5lS2V5UHJvcFdhcm5pbmdHZXR0ZXIocHJvcHMsIGRpc3BsYXlOYW1lKTtcbiAgICB9XG4gICAgaWYgKHJlZikge1xuICAgICAgZGVmaW5lUmVmUHJvcFdhcm5pbmdHZXR0ZXIocHJvcHMsIGRpc3BsYXlOYW1lKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gUmVhY3RFbGVtZW50KHR5cGUsIGtleSwgcmVmLCBzZWxmLCBzb3VyY2UsIFJlYWN0Q3VycmVudE93bmVyLmN1cnJlbnQsIHByb3BzKTtcbn1cblxuLyoqXG4gKiBDcmVhdGUgYW5kIHJldHVybiBhIG5ldyBSZWFjdEVsZW1lbnQgb2YgdGhlIGdpdmVuIHR5cGUuXG4gKiBTZWUgaHR0cHM6Ly9yZWFjdGpzLm9yZy9kb2NzL3JlYWN0LWFwaS5odG1sI2NyZWF0ZWVsZW1lbnRcbiAqL1xuZnVuY3Rpb24gY3JlYXRlRWxlbWVudCh0eXBlLCBjb25maWcsIGNoaWxkcmVuKSB7XG4gIHZhciBwcm9wTmFtZSA9IHZvaWQgMDtcblxuICAvLyBSZXNlcnZlZCBuYW1lcyBhcmUgZXh0cmFjdGVkXG4gIHZhciBwcm9wcyA9IHt9O1xuXG4gIHZhciBrZXkgPSBudWxsO1xuICB2YXIgcmVmID0gbnVsbDtcbiAgdmFyIHNlbGYgPSBudWxsO1xuICB2YXIgc291cmNlID0gbnVsbDtcblxuICBpZiAoY29uZmlnICE9IG51bGwpIHtcbiAgICBpZiAoaGFzVmFsaWRSZWYoY29uZmlnKSkge1xuICAgICAgcmVmID0gY29uZmlnLnJlZjtcbiAgICB9XG4gICAgaWYgKGhhc1ZhbGlkS2V5KGNvbmZpZykpIHtcbiAgICAgIGtleSA9ICcnICsgY29uZmlnLmtleTtcbiAgICB9XG5cbiAgICBzZWxmID0gY29uZmlnLl9fc2VsZiA9PT0gdW5kZWZpbmVkID8gbnVsbCA6IGNvbmZpZy5fX3NlbGY7XG4gICAgc291cmNlID0gY29uZmlnLl9fc291cmNlID09PSB1bmRlZmluZWQgPyBudWxsIDogY29uZmlnLl9fc291cmNlO1xuICAgIC8vIFJlbWFpbmluZyBwcm9wZXJ0aWVzIGFyZSBhZGRlZCB0byBhIG5ldyBwcm9wcyBvYmplY3RcbiAgICBmb3IgKHByb3BOYW1lIGluIGNvbmZpZykge1xuICAgICAgaWYgKGhhc093blByb3BlcnR5LmNhbGwoY29uZmlnLCBwcm9wTmFtZSkgJiYgIVJFU0VSVkVEX1BST1BTLmhhc093blByb3BlcnR5KHByb3BOYW1lKSkge1xuICAgICAgICBwcm9wc1twcm9wTmFtZV0gPSBjb25maWdbcHJvcE5hbWVdO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIENoaWxkcmVuIGNhbiBiZSBtb3JlIHRoYW4gb25lIGFyZ3VtZW50LCBhbmQgdGhvc2UgYXJlIHRyYW5zZmVycmVkIG9udG9cbiAgLy8gdGhlIG5ld2x5IGFsbG9jYXRlZCBwcm9wcyBvYmplY3QuXG4gIHZhciBjaGlsZHJlbkxlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGggLSAyO1xuICBpZiAoY2hpbGRyZW5MZW5ndGggPT09IDEpIHtcbiAgICBwcm9wcy5jaGlsZHJlbiA9IGNoaWxkcmVuO1xuICB9IGVsc2UgaWYgKGNoaWxkcmVuTGVuZ3RoID4gMSkge1xuICAgIHZhciBjaGlsZEFycmF5ID0gQXJyYXkoY2hpbGRyZW5MZW5ndGgpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW5MZW5ndGg7IGkrKykge1xuICAgICAgY2hpbGRBcnJheVtpXSA9IGFyZ3VtZW50c1tpICsgMl07XG4gICAgfVxuICAgIHtcbiAgICAgIGlmIChPYmplY3QuZnJlZXplKSB7XG4gICAgICAgIE9iamVjdC5mcmVlemUoY2hpbGRBcnJheSk7XG4gICAgICB9XG4gICAgfVxuICAgIHByb3BzLmNoaWxkcmVuID0gY2hpbGRBcnJheTtcbiAgfVxuXG4gIC8vIFJlc29sdmUgZGVmYXVsdCBwcm9wc1xuICBpZiAodHlwZSAmJiB0eXBlLmRlZmF1bHRQcm9wcykge1xuICAgIHZhciBkZWZhdWx0UHJvcHMgPSB0eXBlLmRlZmF1bHRQcm9wcztcbiAgICBmb3IgKHByb3BOYW1lIGluIGRlZmF1bHRQcm9wcykge1xuICAgICAgaWYgKHByb3BzW3Byb3BOYW1lXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHByb3BzW3Byb3BOYW1lXSA9IGRlZmF1bHRQcm9wc1twcm9wTmFtZV07XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHtcbiAgICBpZiAoa2V5IHx8IHJlZikge1xuICAgICAgdmFyIGRpc3BsYXlOYW1lID0gdHlwZW9mIHR5cGUgPT09ICdmdW5jdGlvbicgPyB0eXBlLmRpc3BsYXlOYW1lIHx8IHR5cGUubmFtZSB8fCAnVW5rbm93bicgOiB0eXBlO1xuICAgICAgaWYgKGtleSkge1xuICAgICAgICBkZWZpbmVLZXlQcm9wV2FybmluZ0dldHRlcihwcm9wcywgZGlzcGxheU5hbWUpO1xuICAgICAgfVxuICAgICAgaWYgKHJlZikge1xuICAgICAgICBkZWZpbmVSZWZQcm9wV2FybmluZ0dldHRlcihwcm9wcywgZGlzcGxheU5hbWUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gUmVhY3RFbGVtZW50KHR5cGUsIGtleSwgcmVmLCBzZWxmLCBzb3VyY2UsIFJlYWN0Q3VycmVudE93bmVyLmN1cnJlbnQsIHByb3BzKTtcbn1cblxuLyoqXG4gKiBSZXR1cm4gYSBmdW5jdGlvbiB0aGF0IHByb2R1Y2VzIFJlYWN0RWxlbWVudHMgb2YgYSBnaXZlbiB0eXBlLlxuICogU2VlIGh0dHBzOi8vcmVhY3Rqcy5vcmcvZG9jcy9yZWFjdC1hcGkuaHRtbCNjcmVhdGVmYWN0b3J5XG4gKi9cblxuXG5mdW5jdGlvbiBjbG9uZUFuZFJlcGxhY2VLZXkob2xkRWxlbWVudCwgbmV3S2V5KSB7XG4gIHZhciBuZXdFbGVtZW50ID0gUmVhY3RFbGVtZW50KG9sZEVsZW1lbnQudHlwZSwgbmV3S2V5LCBvbGRFbGVtZW50LnJlZiwgb2xkRWxlbWVudC5fc2VsZiwgb2xkRWxlbWVudC5fc291cmNlLCBvbGRFbGVtZW50Ll9vd25lciwgb2xkRWxlbWVudC5wcm9wcyk7XG5cbiAgcmV0dXJuIG5ld0VsZW1lbnQ7XG59XG5cbi8qKlxuICogQ2xvbmUgYW5kIHJldHVybiBhIG5ldyBSZWFjdEVsZW1lbnQgdXNpbmcgZWxlbWVudCBhcyB0aGUgc3RhcnRpbmcgcG9pbnQuXG4gKiBTZWUgaHR0cHM6Ly9yZWFjdGpzLm9yZy9kb2NzL3JlYWN0LWFwaS5odG1sI2Nsb25lZWxlbWVudFxuICovXG5mdW5jdGlvbiBjbG9uZUVsZW1lbnQoZWxlbWVudCwgY29uZmlnLCBjaGlsZHJlbikge1xuICAoZnVuY3Rpb24gKCkge1xuICAgIGlmICghIShlbGVtZW50ID09PSBudWxsIHx8IGVsZW1lbnQgPT09IHVuZGVmaW5lZCkpIHtcbiAgICAgIHtcbiAgICAgICAgdGhyb3cgUmVhY3RFcnJvcihFcnJvcignUmVhY3QuY2xvbmVFbGVtZW50KC4uLik6IFRoZSBhcmd1bWVudCBtdXN0IGJlIGEgUmVhY3QgZWxlbWVudCwgYnV0IHlvdSBwYXNzZWQgJyArIGVsZW1lbnQgKyAnLicpKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pKCk7XG5cbiAgdmFyIHByb3BOYW1lID0gdm9pZCAwO1xuXG4gIC8vIE9yaWdpbmFsIHByb3BzIGFyZSBjb3BpZWRcbiAgdmFyIHByb3BzID0gX2Fzc2lnbih7fSwgZWxlbWVudC5wcm9wcyk7XG5cbiAgLy8gUmVzZXJ2ZWQgbmFtZXMgYXJlIGV4dHJhY3RlZFxuICB2YXIga2V5ID0gZWxlbWVudC5rZXk7XG4gIHZhciByZWYgPSBlbGVtZW50LnJlZjtcbiAgLy8gU2VsZiBpcyBwcmVzZXJ2ZWQgc2luY2UgdGhlIG93bmVyIGlzIHByZXNlcnZlZC5cbiAgdmFyIHNlbGYgPSBlbGVtZW50Ll9zZWxmO1xuICAvLyBTb3VyY2UgaXMgcHJlc2VydmVkIHNpbmNlIGNsb25lRWxlbWVudCBpcyB1bmxpa2VseSB0byBiZSB0YXJnZXRlZCBieSBhXG4gIC8vIHRyYW5zcGlsZXIsIGFuZCB0aGUgb3JpZ2luYWwgc291cmNlIGlzIHByb2JhYmx5IGEgYmV0dGVyIGluZGljYXRvciBvZiB0aGVcbiAgLy8gdHJ1ZSBvd25lci5cbiAgdmFyIHNvdXJjZSA9IGVsZW1lbnQuX3NvdXJjZTtcblxuICAvLyBPd25lciB3aWxsIGJlIHByZXNlcnZlZCwgdW5sZXNzIHJlZiBpcyBvdmVycmlkZGVuXG4gIHZhciBvd25lciA9IGVsZW1lbnQuX293bmVyO1xuXG4gIGlmIChjb25maWcgIT0gbnVsbCkge1xuICAgIGlmIChoYXNWYWxpZFJlZihjb25maWcpKSB7XG4gICAgICAvLyBTaWxlbnRseSBzdGVhbCB0aGUgcmVmIGZyb20gdGhlIHBhcmVudC5cbiAgICAgIHJlZiA9IGNvbmZpZy5yZWY7XG4gICAgICBvd25lciA9IFJlYWN0Q3VycmVudE93bmVyLmN1cnJlbnQ7XG4gICAgfVxuICAgIGlmIChoYXNWYWxpZEtleShjb25maWcpKSB7XG4gICAgICBrZXkgPSAnJyArIGNvbmZpZy5rZXk7XG4gICAgfVxuXG4gICAgLy8gUmVtYWluaW5nIHByb3BlcnRpZXMgb3ZlcnJpZGUgZXhpc3RpbmcgcHJvcHNcbiAgICB2YXIgZGVmYXVsdFByb3BzID0gdm9pZCAwO1xuICAgIGlmIChlbGVtZW50LnR5cGUgJiYgZWxlbWVudC50eXBlLmRlZmF1bHRQcm9wcykge1xuICAgICAgZGVmYXVsdFByb3BzID0gZWxlbWVudC50eXBlLmRlZmF1bHRQcm9wcztcbiAgICB9XG4gICAgZm9yIChwcm9wTmFtZSBpbiBjb25maWcpIHtcbiAgICAgIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKGNvbmZpZywgcHJvcE5hbWUpICYmICFSRVNFUlZFRF9QUk9QUy5oYXNPd25Qcm9wZXJ0eShwcm9wTmFtZSkpIHtcbiAgICAgICAgaWYgKGNvbmZpZ1twcm9wTmFtZV0gPT09IHVuZGVmaW5lZCAmJiBkZWZhdWx0UHJvcHMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIC8vIFJlc29sdmUgZGVmYXVsdCBwcm9wc1xuICAgICAgICAgIHByb3BzW3Byb3BOYW1lXSA9IGRlZmF1bHRQcm9wc1twcm9wTmFtZV07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcHJvcHNbcHJvcE5hbWVdID0gY29uZmlnW3Byb3BOYW1lXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIENoaWxkcmVuIGNhbiBiZSBtb3JlIHRoYW4gb25lIGFyZ3VtZW50LCBhbmQgdGhvc2UgYXJlIHRyYW5zZmVycmVkIG9udG9cbiAgLy8gdGhlIG5ld2x5IGFsbG9jYXRlZCBwcm9wcyBvYmplY3QuXG4gIHZhciBjaGlsZHJlbkxlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGggLSAyO1xuICBpZiAoY2hpbGRyZW5MZW5ndGggPT09IDEpIHtcbiAgICBwcm9wcy5jaGlsZHJlbiA9IGNoaWxkcmVuO1xuICB9IGVsc2UgaWYgKGNoaWxkcmVuTGVuZ3RoID4gMSkge1xuICAgIHZhciBjaGlsZEFycmF5ID0gQXJyYXkoY2hpbGRyZW5MZW5ndGgpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW5MZW5ndGg7IGkrKykge1xuICAgICAgY2hpbGRBcnJheVtpXSA9IGFyZ3VtZW50c1tpICsgMl07XG4gICAgfVxuICAgIHByb3BzLmNoaWxkcmVuID0gY2hpbGRBcnJheTtcbiAgfVxuXG4gIHJldHVybiBSZWFjdEVsZW1lbnQoZWxlbWVudC50eXBlLCBrZXksIHJlZiwgc2VsZiwgc291cmNlLCBvd25lciwgcHJvcHMpO1xufVxuXG4vKipcbiAqIFZlcmlmaWVzIHRoZSBvYmplY3QgaXMgYSBSZWFjdEVsZW1lbnQuXG4gKiBTZWUgaHR0cHM6Ly9yZWFjdGpzLm9yZy9kb2NzL3JlYWN0LWFwaS5odG1sI2lzdmFsaWRlbGVtZW50XG4gKiBAcGFyYW0gez9vYmplY3R9IG9iamVjdFxuICogQHJldHVybiB7Ym9vbGVhbn0gVHJ1ZSBpZiBgb2JqZWN0YCBpcyBhIFJlYWN0RWxlbWVudC5cbiAqIEBmaW5hbFxuICovXG5mdW5jdGlvbiBpc1ZhbGlkRWxlbWVudChvYmplY3QpIHtcbiAgcmV0dXJuIHR5cGVvZiBvYmplY3QgPT09ICdvYmplY3QnICYmIG9iamVjdCAhPT0gbnVsbCAmJiBvYmplY3QuJCR0eXBlb2YgPT09IFJFQUNUX0VMRU1FTlRfVFlQRTtcbn1cblxudmFyIFNFUEFSQVRPUiA9ICcuJztcbnZhciBTVUJTRVBBUkFUT1IgPSAnOic7XG5cbi8qKlxuICogRXNjYXBlIGFuZCB3cmFwIGtleSBzbyBpdCBpcyBzYWZlIHRvIHVzZSBhcyBhIHJlYWN0aWRcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IHRvIGJlIGVzY2FwZWQuXG4gKiBAcmV0dXJuIHtzdHJpbmd9IHRoZSBlc2NhcGVkIGtleS5cbiAqL1xuZnVuY3Rpb24gZXNjYXBlKGtleSkge1xuICB2YXIgZXNjYXBlUmVnZXggPSAvWz06XS9nO1xuICB2YXIgZXNjYXBlckxvb2t1cCA9IHtcbiAgICAnPSc6ICc9MCcsXG4gICAgJzonOiAnPTInXG4gIH07XG4gIHZhciBlc2NhcGVkU3RyaW5nID0gKCcnICsga2V5KS5yZXBsYWNlKGVzY2FwZVJlZ2V4LCBmdW5jdGlvbiAobWF0Y2gpIHtcbiAgICByZXR1cm4gZXNjYXBlckxvb2t1cFttYXRjaF07XG4gIH0pO1xuXG4gIHJldHVybiAnJCcgKyBlc2NhcGVkU3RyaW5nO1xufVxuXG4vKipcbiAqIFRPRE86IFRlc3QgdGhhdCBhIHNpbmdsZSBjaGlsZCBhbmQgYW4gYXJyYXkgd2l0aCBvbmUgaXRlbSBoYXZlIHRoZSBzYW1lIGtleVxuICogcGF0dGVybi5cbiAqL1xuXG52YXIgZGlkV2FybkFib3V0TWFwcyA9IGZhbHNlO1xuXG52YXIgdXNlclByb3ZpZGVkS2V5RXNjYXBlUmVnZXggPSAvXFwvKy9nO1xuZnVuY3Rpb24gZXNjYXBlVXNlclByb3ZpZGVkS2V5KHRleHQpIHtcbiAgcmV0dXJuICgnJyArIHRleHQpLnJlcGxhY2UodXNlclByb3ZpZGVkS2V5RXNjYXBlUmVnZXgsICckJi8nKTtcbn1cblxudmFyIFBPT0xfU0laRSA9IDEwO1xudmFyIHRyYXZlcnNlQ29udGV4dFBvb2wgPSBbXTtcbmZ1bmN0aW9uIGdldFBvb2xlZFRyYXZlcnNlQ29udGV4dChtYXBSZXN1bHQsIGtleVByZWZpeCwgbWFwRnVuY3Rpb24sIG1hcENvbnRleHQpIHtcbiAgaWYgKHRyYXZlcnNlQ29udGV4dFBvb2wubGVuZ3RoKSB7XG4gICAgdmFyIHRyYXZlcnNlQ29udGV4dCA9IHRyYXZlcnNlQ29udGV4dFBvb2wucG9wKCk7XG4gICAgdHJhdmVyc2VDb250ZXh0LnJlc3VsdCA9IG1hcFJlc3VsdDtcbiAgICB0cmF2ZXJzZUNvbnRleHQua2V5UHJlZml4ID0ga2V5UHJlZml4O1xuICAgIHRyYXZlcnNlQ29udGV4dC5mdW5jID0gbWFwRnVuY3Rpb247XG4gICAgdHJhdmVyc2VDb250ZXh0LmNvbnRleHQgPSBtYXBDb250ZXh0O1xuICAgIHRyYXZlcnNlQ29udGV4dC5jb3VudCA9IDA7XG4gICAgcmV0dXJuIHRyYXZlcnNlQ29udGV4dDtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4ge1xuICAgICAgcmVzdWx0OiBtYXBSZXN1bHQsXG4gICAgICBrZXlQcmVmaXg6IGtleVByZWZpeCxcbiAgICAgIGZ1bmM6IG1hcEZ1bmN0aW9uLFxuICAgICAgY29udGV4dDogbWFwQ29udGV4dCxcbiAgICAgIGNvdW50OiAwXG4gICAgfTtcbiAgfVxufVxuXG5mdW5jdGlvbiByZWxlYXNlVHJhdmVyc2VDb250ZXh0KHRyYXZlcnNlQ29udGV4dCkge1xuICB0cmF2ZXJzZUNvbnRleHQucmVzdWx0ID0gbnVsbDtcbiAgdHJhdmVyc2VDb250ZXh0LmtleVByZWZpeCA9IG51bGw7XG4gIHRyYXZlcnNlQ29udGV4dC5mdW5jID0gbnVsbDtcbiAgdHJhdmVyc2VDb250ZXh0LmNvbnRleHQgPSBudWxsO1xuICB0cmF2ZXJzZUNvbnRleHQuY291bnQgPSAwO1xuICBpZiAodHJhdmVyc2VDb250ZXh0UG9vbC5sZW5ndGggPCBQT09MX1NJWkUpIHtcbiAgICB0cmF2ZXJzZUNvbnRleHRQb29sLnB1c2godHJhdmVyc2VDb250ZXh0KTtcbiAgfVxufVxuXG4vKipcbiAqIEBwYXJhbSB7Pyp9IGNoaWxkcmVuIENoaWxkcmVuIHRyZWUgY29udGFpbmVyLlxuICogQHBhcmFtIHshc3RyaW5nfSBuYW1lU29GYXIgTmFtZSBvZiB0aGUga2V5IHBhdGggc28gZmFyLlxuICogQHBhcmFtIHshZnVuY3Rpb259IGNhbGxiYWNrIENhbGxiYWNrIHRvIGludm9rZSB3aXRoIGVhY2ggY2hpbGQgZm91bmQuXG4gKiBAcGFyYW0gez8qfSB0cmF2ZXJzZUNvbnRleHQgVXNlZCB0byBwYXNzIGluZm9ybWF0aW9uIHRocm91Z2hvdXQgdGhlIHRyYXZlcnNhbFxuICogcHJvY2Vzcy5cbiAqIEByZXR1cm4geyFudW1iZXJ9IFRoZSBudW1iZXIgb2YgY2hpbGRyZW4gaW4gdGhpcyBzdWJ0cmVlLlxuICovXG5mdW5jdGlvbiB0cmF2ZXJzZUFsbENoaWxkcmVuSW1wbChjaGlsZHJlbiwgbmFtZVNvRmFyLCBjYWxsYmFjaywgdHJhdmVyc2VDb250ZXh0KSB7XG4gIHZhciB0eXBlID0gdHlwZW9mIGNoaWxkcmVuO1xuXG4gIGlmICh0eXBlID09PSAndW5kZWZpbmVkJyB8fCB0eXBlID09PSAnYm9vbGVhbicpIHtcbiAgICAvLyBBbGwgb2YgdGhlIGFib3ZlIGFyZSBwZXJjZWl2ZWQgYXMgbnVsbC5cbiAgICBjaGlsZHJlbiA9IG51bGw7XG4gIH1cblxuICB2YXIgaW52b2tlQ2FsbGJhY2sgPSBmYWxzZTtcblxuICBpZiAoY2hpbGRyZW4gPT09IG51bGwpIHtcbiAgICBpbnZva2VDYWxsYmFjayA9IHRydWU7XG4gIH0gZWxzZSB7XG4gICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICBjYXNlICdzdHJpbmcnOlxuICAgICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgICAgaW52b2tlQ2FsbGJhY2sgPSB0cnVlO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ29iamVjdCc6XG4gICAgICAgIHN3aXRjaCAoY2hpbGRyZW4uJCR0eXBlb2YpIHtcbiAgICAgICAgICBjYXNlIFJFQUNUX0VMRU1FTlRfVFlQRTpcbiAgICAgICAgICBjYXNlIFJFQUNUX1BPUlRBTF9UWVBFOlxuICAgICAgICAgICAgaW52b2tlQ2FsbGJhY2sgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuICB9XG5cbiAgaWYgKGludm9rZUNhbGxiYWNrKSB7XG4gICAgY2FsbGJhY2sodHJhdmVyc2VDb250ZXh0LCBjaGlsZHJlbixcbiAgICAvLyBJZiBpdCdzIHRoZSBvbmx5IGNoaWxkLCB0cmVhdCB0aGUgbmFtZSBhcyBpZiBpdCB3YXMgd3JhcHBlZCBpbiBhbiBhcnJheVxuICAgIC8vIHNvIHRoYXQgaXQncyBjb25zaXN0ZW50IGlmIHRoZSBudW1iZXIgb2YgY2hpbGRyZW4gZ3Jvd3MuXG4gICAgbmFtZVNvRmFyID09PSAnJyA/IFNFUEFSQVRPUiArIGdldENvbXBvbmVudEtleShjaGlsZHJlbiwgMCkgOiBuYW1lU29GYXIpO1xuICAgIHJldHVybiAxO1xuICB9XG5cbiAgdmFyIGNoaWxkID0gdm9pZCAwO1xuICB2YXIgbmV4dE5hbWUgPSB2b2lkIDA7XG4gIHZhciBzdWJ0cmVlQ291bnQgPSAwOyAvLyBDb3VudCBvZiBjaGlsZHJlbiBmb3VuZCBpbiB0aGUgY3VycmVudCBzdWJ0cmVlLlxuICB2YXIgbmV4dE5hbWVQcmVmaXggPSBuYW1lU29GYXIgPT09ICcnID8gU0VQQVJBVE9SIDogbmFtZVNvRmFyICsgU1VCU0VQQVJBVE9SO1xuXG4gIGlmIChBcnJheS5pc0FycmF5KGNoaWxkcmVuKSkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNoaWxkID0gY2hpbGRyZW5baV07XG4gICAgICBuZXh0TmFtZSA9IG5leHROYW1lUHJlZml4ICsgZ2V0Q29tcG9uZW50S2V5KGNoaWxkLCBpKTtcbiAgICAgIHN1YnRyZWVDb3VudCArPSB0cmF2ZXJzZUFsbENoaWxkcmVuSW1wbChjaGlsZCwgbmV4dE5hbWUsIGNhbGxiYWNrLCB0cmF2ZXJzZUNvbnRleHQpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB2YXIgaXRlcmF0b3JGbiA9IGdldEl0ZXJhdG9yRm4oY2hpbGRyZW4pO1xuICAgIGlmICh0eXBlb2YgaXRlcmF0b3JGbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAge1xuICAgICAgICAvLyBXYXJuIGFib3V0IHVzaW5nIE1hcHMgYXMgY2hpbGRyZW5cbiAgICAgICAgaWYgKGl0ZXJhdG9yRm4gPT09IGNoaWxkcmVuLmVudHJpZXMpIHtcbiAgICAgICAgICAhZGlkV2FybkFib3V0TWFwcyA/IHdhcm5pbmckMShmYWxzZSwgJ1VzaW5nIE1hcHMgYXMgY2hpbGRyZW4gaXMgdW5zdXBwb3J0ZWQgYW5kIHdpbGwgbGlrZWx5IHlpZWxkICcgKyAndW5leHBlY3RlZCByZXN1bHRzLiBDb252ZXJ0IGl0IHRvIGEgc2VxdWVuY2UvaXRlcmFibGUgb2Yga2V5ZWQgJyArICdSZWFjdEVsZW1lbnRzIGluc3RlYWQuJykgOiB2b2lkIDA7XG4gICAgICAgICAgZGlkV2FybkFib3V0TWFwcyA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdmFyIGl0ZXJhdG9yID0gaXRlcmF0b3JGbi5jYWxsKGNoaWxkcmVuKTtcbiAgICAgIHZhciBzdGVwID0gdm9pZCAwO1xuICAgICAgdmFyIGlpID0gMDtcbiAgICAgIHdoaWxlICghKHN0ZXAgPSBpdGVyYXRvci5uZXh0KCkpLmRvbmUpIHtcbiAgICAgICAgY2hpbGQgPSBzdGVwLnZhbHVlO1xuICAgICAgICBuZXh0TmFtZSA9IG5leHROYW1lUHJlZml4ICsgZ2V0Q29tcG9uZW50S2V5KGNoaWxkLCBpaSsrKTtcbiAgICAgICAgc3VidHJlZUNvdW50ICs9IHRyYXZlcnNlQWxsQ2hpbGRyZW5JbXBsKGNoaWxkLCBuZXh0TmFtZSwgY2FsbGJhY2ssIHRyYXZlcnNlQ29udGV4dCk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICh0eXBlID09PSAnb2JqZWN0Jykge1xuICAgICAgdmFyIGFkZGVuZHVtID0gJyc7XG4gICAgICB7XG4gICAgICAgIGFkZGVuZHVtID0gJyBJZiB5b3UgbWVhbnQgdG8gcmVuZGVyIGEgY29sbGVjdGlvbiBvZiBjaGlsZHJlbiwgdXNlIGFuIGFycmF5ICcgKyAnaW5zdGVhZC4nICsgUmVhY3REZWJ1Z0N1cnJlbnRGcmFtZS5nZXRTdGFja0FkZGVuZHVtKCk7XG4gICAgICB9XG4gICAgICB2YXIgY2hpbGRyZW5TdHJpbmcgPSAnJyArIGNoaWxkcmVuO1xuICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAge1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHRocm93IFJlYWN0RXJyb3IoRXJyb3IoJ09iamVjdHMgYXJlIG5vdCB2YWxpZCBhcyBhIFJlYWN0IGNoaWxkIChmb3VuZDogJyArIChjaGlsZHJlblN0cmluZyA9PT0gJ1tvYmplY3QgT2JqZWN0XScgPyAnb2JqZWN0IHdpdGgga2V5cyB7JyArIE9iamVjdC5rZXlzKGNoaWxkcmVuKS5qb2luKCcsICcpICsgJ30nIDogY2hpbGRyZW5TdHJpbmcpICsgJykuJyArIGFkZGVuZHVtKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KSgpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBzdWJ0cmVlQ291bnQ7XG59XG5cbi8qKlxuICogVHJhdmVyc2VzIGNoaWxkcmVuIHRoYXQgYXJlIHR5cGljYWxseSBzcGVjaWZpZWQgYXMgYHByb3BzLmNoaWxkcmVuYCwgYnV0XG4gKiBtaWdodCBhbHNvIGJlIHNwZWNpZmllZCB0aHJvdWdoIGF0dHJpYnV0ZXM6XG4gKlxuICogLSBgdHJhdmVyc2VBbGxDaGlsZHJlbih0aGlzLnByb3BzLmNoaWxkcmVuLCAuLi4pYFxuICogLSBgdHJhdmVyc2VBbGxDaGlsZHJlbih0aGlzLnByb3BzLmxlZnRQYW5lbENoaWxkcmVuLCAuLi4pYFxuICpcbiAqIFRoZSBgdHJhdmVyc2VDb250ZXh0YCBpcyBhbiBvcHRpb25hbCBhcmd1bWVudCB0aGF0IGlzIHBhc3NlZCB0aHJvdWdoIHRoZVxuICogZW50aXJlIHRyYXZlcnNhbC4gSXQgY2FuIGJlIHVzZWQgdG8gc3RvcmUgYWNjdW11bGF0aW9ucyBvciBhbnl0aGluZyBlbHNlIHRoYXRcbiAqIHRoZSBjYWxsYmFjayBtaWdodCBmaW5kIHJlbGV2YW50LlxuICpcbiAqIEBwYXJhbSB7Pyp9IGNoaWxkcmVuIENoaWxkcmVuIHRyZWUgb2JqZWN0LlxuICogQHBhcmFtIHshZnVuY3Rpb259IGNhbGxiYWNrIFRvIGludm9rZSB1cG9uIHRyYXZlcnNpbmcgZWFjaCBjaGlsZC5cbiAqIEBwYXJhbSB7Pyp9IHRyYXZlcnNlQ29udGV4dCBDb250ZXh0IGZvciB0cmF2ZXJzYWwuXG4gKiBAcmV0dXJuIHshbnVtYmVyfSBUaGUgbnVtYmVyIG9mIGNoaWxkcmVuIGluIHRoaXMgc3VidHJlZS5cbiAqL1xuZnVuY3Rpb24gdHJhdmVyc2VBbGxDaGlsZHJlbihjaGlsZHJlbiwgY2FsbGJhY2ssIHRyYXZlcnNlQ29udGV4dCkge1xuICBpZiAoY2hpbGRyZW4gPT0gbnVsbCkge1xuICAgIHJldHVybiAwO1xuICB9XG5cbiAgcmV0dXJuIHRyYXZlcnNlQWxsQ2hpbGRyZW5JbXBsKGNoaWxkcmVuLCAnJywgY2FsbGJhY2ssIHRyYXZlcnNlQ29udGV4dCk7XG59XG5cbi8qKlxuICogR2VuZXJhdGUgYSBrZXkgc3RyaW5nIHRoYXQgaWRlbnRpZmllcyBhIGNvbXBvbmVudCB3aXRoaW4gYSBzZXQuXG4gKlxuICogQHBhcmFtIHsqfSBjb21wb25lbnQgQSBjb21wb25lbnQgdGhhdCBjb3VsZCBjb250YWluIGEgbWFudWFsIGtleS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBpbmRleCBJbmRleCB0aGF0IGlzIHVzZWQgaWYgYSBtYW51YWwga2V5IGlzIG5vdCBwcm92aWRlZC5cbiAqIEByZXR1cm4ge3N0cmluZ31cbiAqL1xuZnVuY3Rpb24gZ2V0Q29tcG9uZW50S2V5KGNvbXBvbmVudCwgaW5kZXgpIHtcbiAgLy8gRG8gc29tZSB0eXBlY2hlY2tpbmcgaGVyZSBzaW5jZSB3ZSBjYWxsIHRoaXMgYmxpbmRseS4gV2Ugd2FudCB0byBlbnN1cmVcbiAgLy8gdGhhdCB3ZSBkb24ndCBibG9jayBwb3RlbnRpYWwgZnV0dXJlIEVTIEFQSXMuXG4gIGlmICh0eXBlb2YgY29tcG9uZW50ID09PSAnb2JqZWN0JyAmJiBjb21wb25lbnQgIT09IG51bGwgJiYgY29tcG9uZW50LmtleSAhPSBudWxsKSB7XG4gICAgLy8gRXhwbGljaXQga2V5XG4gICAgcmV0dXJuIGVzY2FwZShjb21wb25lbnQua2V5KTtcbiAgfVxuICAvLyBJbXBsaWNpdCBrZXkgZGV0ZXJtaW5lZCBieSB0aGUgaW5kZXggaW4gdGhlIHNldFxuICByZXR1cm4gaW5kZXgudG9TdHJpbmcoMzYpO1xufVxuXG5mdW5jdGlvbiBmb3JFYWNoU2luZ2xlQ2hpbGQoYm9va0tlZXBpbmcsIGNoaWxkLCBuYW1lKSB7XG4gIHZhciBmdW5jID0gYm9va0tlZXBpbmcuZnVuYyxcbiAgICAgIGNvbnRleHQgPSBib29rS2VlcGluZy5jb250ZXh0O1xuXG4gIGZ1bmMuY2FsbChjb250ZXh0LCBjaGlsZCwgYm9va0tlZXBpbmcuY291bnQrKyk7XG59XG5cbi8qKlxuICogSXRlcmF0ZXMgdGhyb3VnaCBjaGlsZHJlbiB0aGF0IGFyZSB0eXBpY2FsbHkgc3BlY2lmaWVkIGFzIGBwcm9wcy5jaGlsZHJlbmAuXG4gKlxuICogU2VlIGh0dHBzOi8vcmVhY3Rqcy5vcmcvZG9jcy9yZWFjdC1hcGkuaHRtbCNyZWFjdGNoaWxkcmVuZm9yZWFjaFxuICpcbiAqIFRoZSBwcm92aWRlZCBmb3JFYWNoRnVuYyhjaGlsZCwgaW5kZXgpIHdpbGwgYmUgY2FsbGVkIGZvciBlYWNoXG4gKiBsZWFmIGNoaWxkLlxuICpcbiAqIEBwYXJhbSB7Pyp9IGNoaWxkcmVuIENoaWxkcmVuIHRyZWUgY29udGFpbmVyLlxuICogQHBhcmFtIHtmdW5jdGlvbigqLCBpbnQpfSBmb3JFYWNoRnVuY1xuICogQHBhcmFtIHsqfSBmb3JFYWNoQ29udGV4dCBDb250ZXh0IGZvciBmb3JFYWNoQ29udGV4dC5cbiAqL1xuZnVuY3Rpb24gZm9yRWFjaENoaWxkcmVuKGNoaWxkcmVuLCBmb3JFYWNoRnVuYywgZm9yRWFjaENvbnRleHQpIHtcbiAgaWYgKGNoaWxkcmVuID09IG51bGwpIHtcbiAgICByZXR1cm4gY2hpbGRyZW47XG4gIH1cbiAgdmFyIHRyYXZlcnNlQ29udGV4dCA9IGdldFBvb2xlZFRyYXZlcnNlQ29udGV4dChudWxsLCBudWxsLCBmb3JFYWNoRnVuYywgZm9yRWFjaENvbnRleHQpO1xuICB0cmF2ZXJzZUFsbENoaWxkcmVuKGNoaWxkcmVuLCBmb3JFYWNoU2luZ2xlQ2hpbGQsIHRyYXZlcnNlQ29udGV4dCk7XG4gIHJlbGVhc2VUcmF2ZXJzZUNvbnRleHQodHJhdmVyc2VDb250ZXh0KTtcbn1cblxuZnVuY3Rpb24gbWFwU2luZ2xlQ2hpbGRJbnRvQ29udGV4dChib29rS2VlcGluZywgY2hpbGQsIGNoaWxkS2V5KSB7XG4gIHZhciByZXN1bHQgPSBib29rS2VlcGluZy5yZXN1bHQsXG4gICAgICBrZXlQcmVmaXggPSBib29rS2VlcGluZy5rZXlQcmVmaXgsXG4gICAgICBmdW5jID0gYm9va0tlZXBpbmcuZnVuYyxcbiAgICAgIGNvbnRleHQgPSBib29rS2VlcGluZy5jb250ZXh0O1xuXG5cbiAgdmFyIG1hcHBlZENoaWxkID0gZnVuYy5jYWxsKGNvbnRleHQsIGNoaWxkLCBib29rS2VlcGluZy5jb3VudCsrKTtcbiAgaWYgKEFycmF5LmlzQXJyYXkobWFwcGVkQ2hpbGQpKSB7XG4gICAgbWFwSW50b1dpdGhLZXlQcmVmaXhJbnRlcm5hbChtYXBwZWRDaGlsZCwgcmVzdWx0LCBjaGlsZEtleSwgZnVuY3Rpb24gKGMpIHtcbiAgICAgIHJldHVybiBjO1xuICAgIH0pO1xuICB9IGVsc2UgaWYgKG1hcHBlZENoaWxkICE9IG51bGwpIHtcbiAgICBpZiAoaXNWYWxpZEVsZW1lbnQobWFwcGVkQ2hpbGQpKSB7XG4gICAgICBtYXBwZWRDaGlsZCA9IGNsb25lQW5kUmVwbGFjZUtleShtYXBwZWRDaGlsZCxcbiAgICAgIC8vIEtlZXAgYm90aCB0aGUgKG1hcHBlZCkgYW5kIG9sZCBrZXlzIGlmIHRoZXkgZGlmZmVyLCBqdXN0IGFzXG4gICAgICAvLyB0cmF2ZXJzZUFsbENoaWxkcmVuIHVzZWQgdG8gZG8gZm9yIG9iamVjdHMgYXMgY2hpbGRyZW5cbiAgICAgIGtleVByZWZpeCArIChtYXBwZWRDaGlsZC5rZXkgJiYgKCFjaGlsZCB8fCBjaGlsZC5rZXkgIT09IG1hcHBlZENoaWxkLmtleSkgPyBlc2NhcGVVc2VyUHJvdmlkZWRLZXkobWFwcGVkQ2hpbGQua2V5KSArICcvJyA6ICcnKSArIGNoaWxkS2V5KTtcbiAgICB9XG4gICAgcmVzdWx0LnB1c2gobWFwcGVkQ2hpbGQpO1xuICB9XG59XG5cbmZ1bmN0aW9uIG1hcEludG9XaXRoS2V5UHJlZml4SW50ZXJuYWwoY2hpbGRyZW4sIGFycmF5LCBwcmVmaXgsIGZ1bmMsIGNvbnRleHQpIHtcbiAgdmFyIGVzY2FwZWRQcmVmaXggPSAnJztcbiAgaWYgKHByZWZpeCAhPSBudWxsKSB7XG4gICAgZXNjYXBlZFByZWZpeCA9IGVzY2FwZVVzZXJQcm92aWRlZEtleShwcmVmaXgpICsgJy8nO1xuICB9XG4gIHZhciB0cmF2ZXJzZUNvbnRleHQgPSBnZXRQb29sZWRUcmF2ZXJzZUNvbnRleHQoYXJyYXksIGVzY2FwZWRQcmVmaXgsIGZ1bmMsIGNvbnRleHQpO1xuICB0cmF2ZXJzZUFsbENoaWxkcmVuKGNoaWxkcmVuLCBtYXBTaW5nbGVDaGlsZEludG9Db250ZXh0LCB0cmF2ZXJzZUNvbnRleHQpO1xuICByZWxlYXNlVHJhdmVyc2VDb250ZXh0KHRyYXZlcnNlQ29udGV4dCk7XG59XG5cbi8qKlxuICogTWFwcyBjaGlsZHJlbiB0aGF0IGFyZSB0eXBpY2FsbHkgc3BlY2lmaWVkIGFzIGBwcm9wcy5jaGlsZHJlbmAuXG4gKlxuICogU2VlIGh0dHBzOi8vcmVhY3Rqcy5vcmcvZG9jcy9yZWFjdC1hcGkuaHRtbCNyZWFjdGNoaWxkcmVubWFwXG4gKlxuICogVGhlIHByb3ZpZGVkIG1hcEZ1bmN0aW9uKGNoaWxkLCBrZXksIGluZGV4KSB3aWxsIGJlIGNhbGxlZCBmb3IgZWFjaFxuICogbGVhZiBjaGlsZC5cbiAqXG4gKiBAcGFyYW0gez8qfSBjaGlsZHJlbiBDaGlsZHJlbiB0cmVlIGNvbnRhaW5lci5cbiAqIEBwYXJhbSB7ZnVuY3Rpb24oKiwgaW50KX0gZnVuYyBUaGUgbWFwIGZ1bmN0aW9uLlxuICogQHBhcmFtIHsqfSBjb250ZXh0IENvbnRleHQgZm9yIG1hcEZ1bmN0aW9uLlxuICogQHJldHVybiB7b2JqZWN0fSBPYmplY3QgY29udGFpbmluZyB0aGUgb3JkZXJlZCBtYXAgb2YgcmVzdWx0cy5cbiAqL1xuZnVuY3Rpb24gbWFwQ2hpbGRyZW4oY2hpbGRyZW4sIGZ1bmMsIGNvbnRleHQpIHtcbiAgaWYgKGNoaWxkcmVuID09IG51bGwpIHtcbiAgICByZXR1cm4gY2hpbGRyZW47XG4gIH1cbiAgdmFyIHJlc3VsdCA9IFtdO1xuICBtYXBJbnRvV2l0aEtleVByZWZpeEludGVybmFsKGNoaWxkcmVuLCByZXN1bHQsIG51bGwsIGZ1bmMsIGNvbnRleHQpO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIENvdW50IHRoZSBudW1iZXIgb2YgY2hpbGRyZW4gdGhhdCBhcmUgdHlwaWNhbGx5IHNwZWNpZmllZCBhc1xuICogYHByb3BzLmNoaWxkcmVuYC5cbiAqXG4gKiBTZWUgaHR0cHM6Ly9yZWFjdGpzLm9yZy9kb2NzL3JlYWN0LWFwaS5odG1sI3JlYWN0Y2hpbGRyZW5jb3VudFxuICpcbiAqIEBwYXJhbSB7Pyp9IGNoaWxkcmVuIENoaWxkcmVuIHRyZWUgY29udGFpbmVyLlxuICogQHJldHVybiB7bnVtYmVyfSBUaGUgbnVtYmVyIG9mIGNoaWxkcmVuLlxuICovXG5mdW5jdGlvbiBjb3VudENoaWxkcmVuKGNoaWxkcmVuKSB7XG4gIHJldHVybiB0cmF2ZXJzZUFsbENoaWxkcmVuKGNoaWxkcmVuLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH0sIG51bGwpO1xufVxuXG4vKipcbiAqIEZsYXR0ZW4gYSBjaGlsZHJlbiBvYmplY3QgKHR5cGljYWxseSBzcGVjaWZpZWQgYXMgYHByb3BzLmNoaWxkcmVuYCkgYW5kXG4gKiByZXR1cm4gYW4gYXJyYXkgd2l0aCBhcHByb3ByaWF0ZWx5IHJlLWtleWVkIGNoaWxkcmVuLlxuICpcbiAqIFNlZSBodHRwczovL3JlYWN0anMub3JnL2RvY3MvcmVhY3QtYXBpLmh0bWwjcmVhY3RjaGlsZHJlbnRvYXJyYXlcbiAqL1xuZnVuY3Rpb24gdG9BcnJheShjaGlsZHJlbikge1xuICB2YXIgcmVzdWx0ID0gW107XG4gIG1hcEludG9XaXRoS2V5UHJlZml4SW50ZXJuYWwoY2hpbGRyZW4sIHJlc3VsdCwgbnVsbCwgZnVuY3Rpb24gKGNoaWxkKSB7XG4gICAgcmV0dXJuIGNoaWxkO1xuICB9KTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBmaXJzdCBjaGlsZCBpbiBhIGNvbGxlY3Rpb24gb2YgY2hpbGRyZW4gYW5kIHZlcmlmaWVzIHRoYXQgdGhlcmVcbiAqIGlzIG9ubHkgb25lIGNoaWxkIGluIHRoZSBjb2xsZWN0aW9uLlxuICpcbiAqIFNlZSBodHRwczovL3JlYWN0anMub3JnL2RvY3MvcmVhY3QtYXBpLmh0bWwjcmVhY3RjaGlsZHJlbm9ubHlcbiAqXG4gKiBUaGUgY3VycmVudCBpbXBsZW1lbnRhdGlvbiBvZiB0aGlzIGZ1bmN0aW9uIGFzc3VtZXMgdGhhdCBhIHNpbmdsZSBjaGlsZCBnZXRzXG4gKiBwYXNzZWQgd2l0aG91dCBhIHdyYXBwZXIsIGJ1dCB0aGUgcHVycG9zZSBvZiB0aGlzIGhlbHBlciBmdW5jdGlvbiBpcyB0b1xuICogYWJzdHJhY3QgYXdheSB0aGUgcGFydGljdWxhciBzdHJ1Y3R1cmUgb2YgY2hpbGRyZW4uXG4gKlxuICogQHBhcmFtIHs/b2JqZWN0fSBjaGlsZHJlbiBDaGlsZCBjb2xsZWN0aW9uIHN0cnVjdHVyZS5cbiAqIEByZXR1cm4ge1JlYWN0RWxlbWVudH0gVGhlIGZpcnN0IGFuZCBvbmx5IGBSZWFjdEVsZW1lbnRgIGNvbnRhaW5lZCBpbiB0aGVcbiAqIHN0cnVjdHVyZS5cbiAqL1xuZnVuY3Rpb24gb25seUNoaWxkKGNoaWxkcmVuKSB7XG4gIChmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCFpc1ZhbGlkRWxlbWVudChjaGlsZHJlbikpIHtcbiAgICAgIHtcbiAgICAgICAgdGhyb3cgUmVhY3RFcnJvcihFcnJvcignUmVhY3QuQ2hpbGRyZW4ub25seSBleHBlY3RlZCB0byByZWNlaXZlIGEgc2luZ2xlIFJlYWN0IGVsZW1lbnQgY2hpbGQuJykpO1xuICAgICAgfVxuICAgIH1cbiAgfSkoKTtcbiAgcmV0dXJuIGNoaWxkcmVuO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVDb250ZXh0KGRlZmF1bHRWYWx1ZSwgY2FsY3VsYXRlQ2hhbmdlZEJpdHMpIHtcbiAgaWYgKGNhbGN1bGF0ZUNoYW5nZWRCaXRzID09PSB1bmRlZmluZWQpIHtcbiAgICBjYWxjdWxhdGVDaGFuZ2VkQml0cyA9IG51bGw7XG4gIH0gZWxzZSB7XG4gICAge1xuICAgICAgIShjYWxjdWxhdGVDaGFuZ2VkQml0cyA9PT0gbnVsbCB8fCB0eXBlb2YgY2FsY3VsYXRlQ2hhbmdlZEJpdHMgPT09ICdmdW5jdGlvbicpID8gd2FybmluZ1dpdGhvdXRTdGFjayQxKGZhbHNlLCAnY3JlYXRlQ29udGV4dDogRXhwZWN0ZWQgdGhlIG9wdGlvbmFsIHNlY29uZCBhcmd1bWVudCB0byBiZSBhICcgKyAnZnVuY3Rpb24uIEluc3RlYWQgcmVjZWl2ZWQ6ICVzJywgY2FsY3VsYXRlQ2hhbmdlZEJpdHMpIDogdm9pZCAwO1xuICAgIH1cbiAgfVxuXG4gIHZhciBjb250ZXh0ID0ge1xuICAgICQkdHlwZW9mOiBSRUFDVF9DT05URVhUX1RZUEUsXG4gICAgX2NhbGN1bGF0ZUNoYW5nZWRCaXRzOiBjYWxjdWxhdGVDaGFuZ2VkQml0cyxcbiAgICAvLyBBcyBhIHdvcmthcm91bmQgdG8gc3VwcG9ydCBtdWx0aXBsZSBjb25jdXJyZW50IHJlbmRlcmVycywgd2UgY2F0ZWdvcml6ZVxuICAgIC8vIHNvbWUgcmVuZGVyZXJzIGFzIHByaW1hcnkgYW5kIG90aGVycyBhcyBzZWNvbmRhcnkuIFdlIG9ubHkgZXhwZWN0XG4gICAgLy8gdGhlcmUgdG8gYmUgdHdvIGNvbmN1cnJlbnQgcmVuZGVyZXJzIGF0IG1vc3Q6IFJlYWN0IE5hdGl2ZSAocHJpbWFyeSkgYW5kXG4gICAgLy8gRmFicmljIChzZWNvbmRhcnkpOyBSZWFjdCBET00gKHByaW1hcnkpIGFuZCBSZWFjdCBBUlQgKHNlY29uZGFyeSkuXG4gICAgLy8gU2Vjb25kYXJ5IHJlbmRlcmVycyBzdG9yZSB0aGVpciBjb250ZXh0IHZhbHVlcyBvbiBzZXBhcmF0ZSBmaWVsZHMuXG4gICAgX2N1cnJlbnRWYWx1ZTogZGVmYXVsdFZhbHVlLFxuICAgIF9jdXJyZW50VmFsdWUyOiBkZWZhdWx0VmFsdWUsXG4gICAgLy8gVXNlZCB0byB0cmFjayBob3cgbWFueSBjb25jdXJyZW50IHJlbmRlcmVycyB0aGlzIGNvbnRleHQgY3VycmVudGx5XG4gICAgLy8gc3VwcG9ydHMgd2l0aGluIGluIGEgc2luZ2xlIHJlbmRlcmVyLiBTdWNoIGFzIHBhcmFsbGVsIHNlcnZlciByZW5kZXJpbmcuXG4gICAgX3RocmVhZENvdW50OiAwLFxuICAgIC8vIFRoZXNlIGFyZSBjaXJjdWxhclxuICAgIFByb3ZpZGVyOiBudWxsLFxuICAgIENvbnN1bWVyOiBudWxsXG4gIH07XG5cbiAgY29udGV4dC5Qcm92aWRlciA9IHtcbiAgICAkJHR5cGVvZjogUkVBQ1RfUFJPVklERVJfVFlQRSxcbiAgICBfY29udGV4dDogY29udGV4dFxuICB9O1xuXG4gIHZhciBoYXNXYXJuZWRBYm91dFVzaW5nTmVzdGVkQ29udGV4dENvbnN1bWVycyA9IGZhbHNlO1xuICB2YXIgaGFzV2FybmVkQWJvdXRVc2luZ0NvbnN1bWVyUHJvdmlkZXIgPSBmYWxzZTtcblxuICB7XG4gICAgLy8gQSBzZXBhcmF0ZSBvYmplY3QsIGJ1dCBwcm94aWVzIGJhY2sgdG8gdGhlIG9yaWdpbmFsIGNvbnRleHQgb2JqZWN0IGZvclxuICAgIC8vIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5LiBJdCBoYXMgYSBkaWZmZXJlbnQgJCR0eXBlb2YsIHNvIHdlIGNhbiBwcm9wZXJseVxuICAgIC8vIHdhcm4gZm9yIHRoZSBpbmNvcnJlY3QgdXNhZ2Ugb2YgQ29udGV4dCBhcyBhIENvbnN1bWVyLlxuICAgIHZhciBDb25zdW1lciA9IHtcbiAgICAgICQkdHlwZW9mOiBSRUFDVF9DT05URVhUX1RZUEUsXG4gICAgICBfY29udGV4dDogY29udGV4dCxcbiAgICAgIF9jYWxjdWxhdGVDaGFuZ2VkQml0czogY29udGV4dC5fY2FsY3VsYXRlQ2hhbmdlZEJpdHNcbiAgICB9O1xuICAgIC8vICRGbG93Rml4TWU6IEZsb3cgY29tcGxhaW5zIGFib3V0IG5vdCBzZXR0aW5nIGEgdmFsdWUsIHdoaWNoIGlzIGludGVudGlvbmFsIGhlcmVcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyhDb25zdW1lciwge1xuICAgICAgUHJvdmlkZXI6IHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgaWYgKCFoYXNXYXJuZWRBYm91dFVzaW5nQ29uc3VtZXJQcm92aWRlcikge1xuICAgICAgICAgICAgaGFzV2FybmVkQWJvdXRVc2luZ0NvbnN1bWVyUHJvdmlkZXIgPSB0cnVlO1xuICAgICAgICAgICAgd2FybmluZyQxKGZhbHNlLCAnUmVuZGVyaW5nIDxDb250ZXh0LkNvbnN1bWVyLlByb3ZpZGVyPiBpcyBub3Qgc3VwcG9ydGVkIGFuZCB3aWxsIGJlIHJlbW92ZWQgaW4gJyArICdhIGZ1dHVyZSBtYWpvciByZWxlYXNlLiBEaWQgeW91IG1lYW4gdG8gcmVuZGVyIDxDb250ZXh0LlByb3ZpZGVyPiBpbnN0ZWFkPycpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gY29udGV4dC5Qcm92aWRlcjtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAoX1Byb3ZpZGVyKSB7XG4gICAgICAgICAgY29udGV4dC5Qcm92aWRlciA9IF9Qcm92aWRlcjtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIF9jdXJyZW50VmFsdWU6IHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcmV0dXJuIGNvbnRleHQuX2N1cnJlbnRWYWx1ZTtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAoX2N1cnJlbnRWYWx1ZSkge1xuICAgICAgICAgIGNvbnRleHQuX2N1cnJlbnRWYWx1ZSA9IF9jdXJyZW50VmFsdWU7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBfY3VycmVudFZhbHVlMjoge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICByZXR1cm4gY29udGV4dC5fY3VycmVudFZhbHVlMjtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAoX2N1cnJlbnRWYWx1ZTIpIHtcbiAgICAgICAgICBjb250ZXh0Ll9jdXJyZW50VmFsdWUyID0gX2N1cnJlbnRWYWx1ZTI7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBfdGhyZWFkQ291bnQ6IHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcmV0dXJuIGNvbnRleHQuX3RocmVhZENvdW50O1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uIChfdGhyZWFkQ291bnQpIHtcbiAgICAgICAgICBjb250ZXh0Ll90aHJlYWRDb3VudCA9IF90aHJlYWRDb3VudDtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIENvbnN1bWVyOiB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGlmICghaGFzV2FybmVkQWJvdXRVc2luZ05lc3RlZENvbnRleHRDb25zdW1lcnMpIHtcbiAgICAgICAgICAgIGhhc1dhcm5lZEFib3V0VXNpbmdOZXN0ZWRDb250ZXh0Q29uc3VtZXJzID0gdHJ1ZTtcbiAgICAgICAgICAgIHdhcm5pbmckMShmYWxzZSwgJ1JlbmRlcmluZyA8Q29udGV4dC5Db25zdW1lci5Db25zdW1lcj4gaXMgbm90IHN1cHBvcnRlZCBhbmQgd2lsbCBiZSByZW1vdmVkIGluICcgKyAnYSBmdXR1cmUgbWFqb3IgcmVsZWFzZS4gRGlkIHlvdSBtZWFuIHRvIHJlbmRlciA8Q29udGV4dC5Db25zdW1lcj4gaW5zdGVhZD8nKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIGNvbnRleHQuQ29uc3VtZXI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgICAvLyAkRmxvd0ZpeE1lOiBGbG93IGNvbXBsYWlucyBhYm91dCBtaXNzaW5nIHByb3BlcnRpZXMgYmVjYXVzZSBpdCBkb2Vzbid0IHVuZGVyc3RhbmQgZGVmaW5lUHJvcGVydHlcbiAgICBjb250ZXh0LkNvbnN1bWVyID0gQ29uc3VtZXI7XG4gIH1cblxuICB7XG4gICAgY29udGV4dC5fY3VycmVudFJlbmRlcmVyID0gbnVsbDtcbiAgICBjb250ZXh0Ll9jdXJyZW50UmVuZGVyZXIyID0gbnVsbDtcbiAgfVxuXG4gIHJldHVybiBjb250ZXh0O1xufVxuXG5mdW5jdGlvbiBsYXp5KGN0b3IpIHtcbiAgdmFyIGxhenlUeXBlID0ge1xuICAgICQkdHlwZW9mOiBSRUFDVF9MQVpZX1RZUEUsXG4gICAgX2N0b3I6IGN0b3IsXG4gICAgLy8gUmVhY3QgdXNlcyB0aGVzZSBmaWVsZHMgdG8gc3RvcmUgdGhlIHJlc3VsdC5cbiAgICBfc3RhdHVzOiAtMSxcbiAgICBfcmVzdWx0OiBudWxsXG4gIH07XG5cbiAge1xuICAgIC8vIEluIHByb2R1Y3Rpb24sIHRoaXMgd291bGQganVzdCBzZXQgaXQgb24gdGhlIG9iamVjdC5cbiAgICB2YXIgZGVmYXVsdFByb3BzID0gdm9pZCAwO1xuICAgIHZhciBwcm9wVHlwZXMgPSB2b2lkIDA7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMobGF6eVR5cGUsIHtcbiAgICAgIGRlZmF1bHRQcm9wczoge1xuICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHJldHVybiBkZWZhdWx0UHJvcHM7XG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24gKG5ld0RlZmF1bHRQcm9wcykge1xuICAgICAgICAgIHdhcm5pbmckMShmYWxzZSwgJ1JlYWN0LmxhenkoLi4uKTogSXQgaXMgbm90IHN1cHBvcnRlZCB0byBhc3NpZ24gYGRlZmF1bHRQcm9wc2AgdG8gJyArICdhIGxhenkgY29tcG9uZW50IGltcG9ydC4gRWl0aGVyIHNwZWNpZnkgdGhlbSB3aGVyZSB0aGUgY29tcG9uZW50ICcgKyAnaXMgZGVmaW5lZCwgb3IgY3JlYXRlIGEgd3JhcHBpbmcgY29tcG9uZW50IGFyb3VuZCBpdC4nKTtcbiAgICAgICAgICBkZWZhdWx0UHJvcHMgPSBuZXdEZWZhdWx0UHJvcHM7XG4gICAgICAgICAgLy8gTWF0Y2ggcHJvZHVjdGlvbiBiZWhhdmlvciBtb3JlIGNsb3NlbHk6XG4gICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGxhenlUeXBlLCAnZGVmYXVsdFByb3BzJywge1xuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgcHJvcFR5cGVzOiB7XG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcmV0dXJuIHByb3BUeXBlcztcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAobmV3UHJvcFR5cGVzKSB7XG4gICAgICAgICAgd2FybmluZyQxKGZhbHNlLCAnUmVhY3QubGF6eSguLi4pOiBJdCBpcyBub3Qgc3VwcG9ydGVkIHRvIGFzc2lnbiBgcHJvcFR5cGVzYCB0byAnICsgJ2EgbGF6eSBjb21wb25lbnQgaW1wb3J0LiBFaXRoZXIgc3BlY2lmeSB0aGVtIHdoZXJlIHRoZSBjb21wb25lbnQgJyArICdpcyBkZWZpbmVkLCBvciBjcmVhdGUgYSB3cmFwcGluZyBjb21wb25lbnQgYXJvdW5kIGl0LicpO1xuICAgICAgICAgIHByb3BUeXBlcyA9IG5ld1Byb3BUeXBlcztcbiAgICAgICAgICAvLyBNYXRjaCBwcm9kdWN0aW9uIGJlaGF2aW9yIG1vcmUgY2xvc2VseTpcbiAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobGF6eVR5cGUsICdwcm9wVHlwZXMnLCB7XG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiBsYXp5VHlwZTtcbn1cblxuZnVuY3Rpb24gZm9yd2FyZFJlZihyZW5kZXIpIHtcbiAge1xuICAgIGlmIChyZW5kZXIgIT0gbnVsbCAmJiByZW5kZXIuJCR0eXBlb2YgPT09IFJFQUNUX01FTU9fVFlQRSkge1xuICAgICAgd2FybmluZ1dpdGhvdXRTdGFjayQxKGZhbHNlLCAnZm9yd2FyZFJlZiByZXF1aXJlcyBhIHJlbmRlciBmdW5jdGlvbiBidXQgcmVjZWl2ZWQgYSBgbWVtb2AgJyArICdjb21wb25lbnQuIEluc3RlYWQgb2YgZm9yd2FyZFJlZihtZW1vKC4uLikpLCB1c2UgJyArICdtZW1vKGZvcndhcmRSZWYoLi4uKSkuJyk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgcmVuZGVyICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICB3YXJuaW5nV2l0aG91dFN0YWNrJDEoZmFsc2UsICdmb3J3YXJkUmVmIHJlcXVpcmVzIGEgcmVuZGVyIGZ1bmN0aW9uIGJ1dCB3YXMgZ2l2ZW4gJXMuJywgcmVuZGVyID09PSBudWxsID8gJ251bGwnIDogdHlwZW9mIHJlbmRlcik7XG4gICAgfSBlbHNlIHtcbiAgICAgICEoXG4gICAgICAvLyBEbyBub3Qgd2FybiBmb3IgMCBhcmd1bWVudHMgYmVjYXVzZSBpdCBjb3VsZCBiZSBkdWUgdG8gdXNhZ2Ugb2YgdGhlICdhcmd1bWVudHMnIG9iamVjdFxuICAgICAgcmVuZGVyLmxlbmd0aCA9PT0gMCB8fCByZW5kZXIubGVuZ3RoID09PSAyKSA/IHdhcm5pbmdXaXRob3V0U3RhY2skMShmYWxzZSwgJ2ZvcndhcmRSZWYgcmVuZGVyIGZ1bmN0aW9ucyBhY2NlcHQgZXhhY3RseSB0d28gcGFyYW1ldGVyczogcHJvcHMgYW5kIHJlZi4gJXMnLCByZW5kZXIubGVuZ3RoID09PSAxID8gJ0RpZCB5b3UgZm9yZ2V0IHRvIHVzZSB0aGUgcmVmIHBhcmFtZXRlcj8nIDogJ0FueSBhZGRpdGlvbmFsIHBhcmFtZXRlciB3aWxsIGJlIHVuZGVmaW5lZC4nKSA6IHZvaWQgMDtcbiAgICB9XG5cbiAgICBpZiAocmVuZGVyICE9IG51bGwpIHtcbiAgICAgICEocmVuZGVyLmRlZmF1bHRQcm9wcyA9PSBudWxsICYmIHJlbmRlci5wcm9wVHlwZXMgPT0gbnVsbCkgPyB3YXJuaW5nV2l0aG91dFN0YWNrJDEoZmFsc2UsICdmb3J3YXJkUmVmIHJlbmRlciBmdW5jdGlvbnMgZG8gbm90IHN1cHBvcnQgcHJvcFR5cGVzIG9yIGRlZmF1bHRQcm9wcy4gJyArICdEaWQgeW91IGFjY2lkZW50YWxseSBwYXNzIGEgUmVhY3QgY29tcG9uZW50PycpIDogdm9pZCAwO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7XG4gICAgJCR0eXBlb2Y6IFJFQUNUX0ZPUldBUkRfUkVGX1RZUEUsXG4gICAgcmVuZGVyOiByZW5kZXJcbiAgfTtcbn1cblxuZnVuY3Rpb24gaXNWYWxpZEVsZW1lbnRUeXBlKHR5cGUpIHtcbiAgcmV0dXJuIHR5cGVvZiB0eXBlID09PSAnc3RyaW5nJyB8fCB0eXBlb2YgdHlwZSA9PT0gJ2Z1bmN0aW9uJyB8fFxuICAvLyBOb3RlOiBpdHMgdHlwZW9mIG1pZ2h0IGJlIG90aGVyIHRoYW4gJ3N5bWJvbCcgb3IgJ251bWJlcicgaWYgaXQncyBhIHBvbHlmaWxsLlxuICB0eXBlID09PSBSRUFDVF9GUkFHTUVOVF9UWVBFIHx8IHR5cGUgPT09IFJFQUNUX0NPTkNVUlJFTlRfTU9ERV9UWVBFIHx8IHR5cGUgPT09IFJFQUNUX1BST0ZJTEVSX1RZUEUgfHwgdHlwZSA9PT0gUkVBQ1RfU1RSSUNUX01PREVfVFlQRSB8fCB0eXBlID09PSBSRUFDVF9TVVNQRU5TRV9UWVBFIHx8IHR5cGUgPT09IFJFQUNUX1NVU1BFTlNFX0xJU1RfVFlQRSB8fCB0eXBlb2YgdHlwZSA9PT0gJ29iamVjdCcgJiYgdHlwZSAhPT0gbnVsbCAmJiAodHlwZS4kJHR5cGVvZiA9PT0gUkVBQ1RfTEFaWV9UWVBFIHx8IHR5cGUuJCR0eXBlb2YgPT09IFJFQUNUX01FTU9fVFlQRSB8fCB0eXBlLiQkdHlwZW9mID09PSBSRUFDVF9QUk9WSURFUl9UWVBFIHx8IHR5cGUuJCR0eXBlb2YgPT09IFJFQUNUX0NPTlRFWFRfVFlQRSB8fCB0eXBlLiQkdHlwZW9mID09PSBSRUFDVF9GT1JXQVJEX1JFRl9UWVBFIHx8IHR5cGUuJCR0eXBlb2YgPT09IFJFQUNUX0ZVTkRBTUVOVEFMX1RZUEUgfHwgdHlwZS4kJHR5cGVvZiA9PT0gUkVBQ1RfUkVTUE9OREVSX1RZUEUpO1xufVxuXG5mdW5jdGlvbiBtZW1vKHR5cGUsIGNvbXBhcmUpIHtcbiAge1xuICAgIGlmICghaXNWYWxpZEVsZW1lbnRUeXBlKHR5cGUpKSB7XG4gICAgICB3YXJuaW5nV2l0aG91dFN0YWNrJDEoZmFsc2UsICdtZW1vOiBUaGUgZmlyc3QgYXJndW1lbnQgbXVzdCBiZSBhIGNvbXBvbmVudC4gSW5zdGVhZCAnICsgJ3JlY2VpdmVkOiAlcycsIHR5cGUgPT09IG51bGwgPyAnbnVsbCcgOiB0eXBlb2YgdHlwZSk7XG4gICAgfVxuICB9XG4gIHJldHVybiB7XG4gICAgJCR0eXBlb2Y6IFJFQUNUX01FTU9fVFlQRSxcbiAgICB0eXBlOiB0eXBlLFxuICAgIGNvbXBhcmU6IGNvbXBhcmUgPT09IHVuZGVmaW5lZCA/IG51bGwgOiBjb21wYXJlXG4gIH07XG59XG5cbmZ1bmN0aW9uIHJlc29sdmVEaXNwYXRjaGVyKCkge1xuICB2YXIgZGlzcGF0Y2hlciA9IFJlYWN0Q3VycmVudERpc3BhdGNoZXIuY3VycmVudDtcbiAgKGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIShkaXNwYXRjaGVyICE9PSBudWxsKSkge1xuICAgICAge1xuICAgICAgICB0aHJvdyBSZWFjdEVycm9yKEVycm9yKCdJbnZhbGlkIGhvb2sgY2FsbC4gSG9va3MgY2FuIG9ubHkgYmUgY2FsbGVkIGluc2lkZSBvZiB0aGUgYm9keSBvZiBhIGZ1bmN0aW9uIGNvbXBvbmVudC4gVGhpcyBjb3VsZCBoYXBwZW4gZm9yIG9uZSBvZiB0aGUgZm9sbG93aW5nIHJlYXNvbnM6XFxuMS4gWW91IG1pZ2h0IGhhdmUgbWlzbWF0Y2hpbmcgdmVyc2lvbnMgb2YgUmVhY3QgYW5kIHRoZSByZW5kZXJlciAoc3VjaCBhcyBSZWFjdCBET00pXFxuMi4gWW91IG1pZ2h0IGJlIGJyZWFraW5nIHRoZSBSdWxlcyBvZiBIb29rc1xcbjMuIFlvdSBtaWdodCBoYXZlIG1vcmUgdGhhbiBvbmUgY29weSBvZiBSZWFjdCBpbiB0aGUgc2FtZSBhcHBcXG5TZWUgaHR0cHM6Ly9mYi5tZS9yZWFjdC1pbnZhbGlkLWhvb2stY2FsbCBmb3IgdGlwcyBhYm91dCBob3cgdG8gZGVidWcgYW5kIGZpeCB0aGlzIHByb2JsZW0uJykpO1xuICAgICAgfVxuICAgIH1cbiAgfSkoKTtcbiAgcmV0dXJuIGRpc3BhdGNoZXI7XG59XG5cbmZ1bmN0aW9uIHVzZUNvbnRleHQoQ29udGV4dCwgdW5zdGFibGVfb2JzZXJ2ZWRCaXRzKSB7XG4gIHZhciBkaXNwYXRjaGVyID0gcmVzb2x2ZURpc3BhdGNoZXIoKTtcbiAge1xuICAgICEodW5zdGFibGVfb2JzZXJ2ZWRCaXRzID09PSB1bmRlZmluZWQpID8gd2FybmluZyQxKGZhbHNlLCAndXNlQ29udGV4dCgpIHNlY29uZCBhcmd1bWVudCBpcyByZXNlcnZlZCBmb3IgZnV0dXJlICcgKyAndXNlIGluIFJlYWN0LiBQYXNzaW5nIGl0IGlzIG5vdCBzdXBwb3J0ZWQuICcgKyAnWW91IHBhc3NlZDogJXMuJXMnLCB1bnN0YWJsZV9vYnNlcnZlZEJpdHMsIHR5cGVvZiB1bnN0YWJsZV9vYnNlcnZlZEJpdHMgPT09ICdudW1iZXInICYmIEFycmF5LmlzQXJyYXkoYXJndW1lbnRzWzJdKSA/ICdcXG5cXG5EaWQgeW91IGNhbGwgYXJyYXkubWFwKHVzZUNvbnRleHQpPyAnICsgJ0NhbGxpbmcgSG9va3MgaW5zaWRlIGEgbG9vcCBpcyBub3Qgc3VwcG9ydGVkLiAnICsgJ0xlYXJuIG1vcmUgYXQgaHR0cHM6Ly9mYi5tZS9ydWxlcy1vZi1ob29rcycgOiAnJykgOiB2b2lkIDA7XG5cbiAgICAvLyBUT0RPOiBhZGQgYSBtb3JlIGdlbmVyaWMgd2FybmluZyBmb3IgaW52YWxpZCB2YWx1ZXMuXG4gICAgaWYgKENvbnRleHQuX2NvbnRleHQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdmFyIHJlYWxDb250ZXh0ID0gQ29udGV4dC5fY29udGV4dDtcbiAgICAgIC8vIERvbid0IGRlZHVwbGljYXRlIGJlY2F1c2UgdGhpcyBsZWdpdGltYXRlbHkgY2F1c2VzIGJ1Z3NcbiAgICAgIC8vIGFuZCBub2JvZHkgc2hvdWxkIGJlIHVzaW5nIHRoaXMgaW4gZXhpc3RpbmcgY29kZS5cbiAgICAgIGlmIChyZWFsQ29udGV4dC5Db25zdW1lciA9PT0gQ29udGV4dCkge1xuICAgICAgICB3YXJuaW5nJDEoZmFsc2UsICdDYWxsaW5nIHVzZUNvbnRleHQoQ29udGV4dC5Db25zdW1lcikgaXMgbm90IHN1cHBvcnRlZCwgbWF5IGNhdXNlIGJ1Z3MsIGFuZCB3aWxsIGJlICcgKyAncmVtb3ZlZCBpbiBhIGZ1dHVyZSBtYWpvciByZWxlYXNlLiBEaWQgeW91IG1lYW4gdG8gY2FsbCB1c2VDb250ZXh0KENvbnRleHQpIGluc3RlYWQ/Jyk7XG4gICAgICB9IGVsc2UgaWYgKHJlYWxDb250ZXh0LlByb3ZpZGVyID09PSBDb250ZXh0KSB7XG4gICAgICAgIHdhcm5pbmckMShmYWxzZSwgJ0NhbGxpbmcgdXNlQ29udGV4dChDb250ZXh0LlByb3ZpZGVyKSBpcyBub3Qgc3VwcG9ydGVkLiAnICsgJ0RpZCB5b3UgbWVhbiB0byBjYWxsIHVzZUNvbnRleHQoQ29udGV4dCkgaW5zdGVhZD8nKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIGRpc3BhdGNoZXIudXNlQ29udGV4dChDb250ZXh0LCB1bnN0YWJsZV9vYnNlcnZlZEJpdHMpO1xufVxuXG5mdW5jdGlvbiB1c2VTdGF0ZShpbml0aWFsU3RhdGUpIHtcbiAgdmFyIGRpc3BhdGNoZXIgPSByZXNvbHZlRGlzcGF0Y2hlcigpO1xuICByZXR1cm4gZGlzcGF0Y2hlci51c2VTdGF0ZShpbml0aWFsU3RhdGUpO1xufVxuXG5mdW5jdGlvbiB1c2VSZWR1Y2VyKHJlZHVjZXIsIGluaXRpYWxBcmcsIGluaXQpIHtcbiAgdmFyIGRpc3BhdGNoZXIgPSByZXNvbHZlRGlzcGF0Y2hlcigpO1xuICByZXR1cm4gZGlzcGF0Y2hlci51c2VSZWR1Y2VyKHJlZHVjZXIsIGluaXRpYWxBcmcsIGluaXQpO1xufVxuXG5mdW5jdGlvbiB1c2VSZWYoaW5pdGlhbFZhbHVlKSB7XG4gIHZhciBkaXNwYXRjaGVyID0gcmVzb2x2ZURpc3BhdGNoZXIoKTtcbiAgcmV0dXJuIGRpc3BhdGNoZXIudXNlUmVmKGluaXRpYWxWYWx1ZSk7XG59XG5cbmZ1bmN0aW9uIHVzZUVmZmVjdChjcmVhdGUsIGlucHV0cykge1xuICB2YXIgZGlzcGF0Y2hlciA9IHJlc29sdmVEaXNwYXRjaGVyKCk7XG4gIHJldHVybiBkaXNwYXRjaGVyLnVzZUVmZmVjdChjcmVhdGUsIGlucHV0cyk7XG59XG5cbmZ1bmN0aW9uIHVzZUxheW91dEVmZmVjdChjcmVhdGUsIGlucHV0cykge1xuICB2YXIgZGlzcGF0Y2hlciA9IHJlc29sdmVEaXNwYXRjaGVyKCk7XG4gIHJldHVybiBkaXNwYXRjaGVyLnVzZUxheW91dEVmZmVjdChjcmVhdGUsIGlucHV0cyk7XG59XG5cbmZ1bmN0aW9uIHVzZUNhbGxiYWNrKGNhbGxiYWNrLCBpbnB1dHMpIHtcbiAgdmFyIGRpc3BhdGNoZXIgPSByZXNvbHZlRGlzcGF0Y2hlcigpO1xuICByZXR1cm4gZGlzcGF0Y2hlci51c2VDYWxsYmFjayhjYWxsYmFjaywgaW5wdXRzKTtcbn1cblxuZnVuY3Rpb24gdXNlTWVtbyhjcmVhdGUsIGlucHV0cykge1xuICB2YXIgZGlzcGF0Y2hlciA9IHJlc29sdmVEaXNwYXRjaGVyKCk7XG4gIHJldHVybiBkaXNwYXRjaGVyLnVzZU1lbW8oY3JlYXRlLCBpbnB1dHMpO1xufVxuXG5mdW5jdGlvbiB1c2VJbXBlcmF0aXZlSGFuZGxlKHJlZiwgY3JlYXRlLCBpbnB1dHMpIHtcbiAgdmFyIGRpc3BhdGNoZXIgPSByZXNvbHZlRGlzcGF0Y2hlcigpO1xuICByZXR1cm4gZGlzcGF0Y2hlci51c2VJbXBlcmF0aXZlSGFuZGxlKHJlZiwgY3JlYXRlLCBpbnB1dHMpO1xufVxuXG5mdW5jdGlvbiB1c2VEZWJ1Z1ZhbHVlKHZhbHVlLCBmb3JtYXR0ZXJGbikge1xuICB7XG4gICAgdmFyIGRpc3BhdGNoZXIgPSByZXNvbHZlRGlzcGF0Y2hlcigpO1xuICAgIHJldHVybiBkaXNwYXRjaGVyLnVzZURlYnVnVmFsdWUodmFsdWUsIGZvcm1hdHRlckZuKTtcbiAgfVxufVxuXG52YXIgZW1wdHlPYmplY3QkMSA9IHt9O1xuXG5mdW5jdGlvbiB1c2VSZXNwb25kZXIocmVzcG9uZGVyLCBsaXN0ZW5lclByb3BzKSB7XG4gIHZhciBkaXNwYXRjaGVyID0gcmVzb2x2ZURpc3BhdGNoZXIoKTtcbiAge1xuICAgIGlmIChyZXNwb25kZXIgPT0gbnVsbCB8fCByZXNwb25kZXIuJCR0eXBlb2YgIT09IFJFQUNUX1JFU1BPTkRFUl9UWVBFKSB7XG4gICAgICB3YXJuaW5nJDEoZmFsc2UsICd1c2VSZXNwb25kZXI6IGludmFsaWQgZmlyc3QgYXJndW1lbnQuIEV4cGVjdGVkIGFuIGV2ZW50IHJlc3BvbmRlciwgYnV0IGluc3RlYWQgZ290ICVzJywgcmVzcG9uZGVyKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGRpc3BhdGNoZXIudXNlUmVzcG9uZGVyKHJlc3BvbmRlciwgbGlzdGVuZXJQcm9wcyB8fCBlbXB0eU9iamVjdCQxKTtcbn1cblxuLy8gV2l0aGluIHRoZSBzY29wZSBvZiB0aGUgY2FsbGJhY2ssIG1hcmsgYWxsIHVwZGF0ZXMgYXMgYmVpbmcgYWxsb3dlZCB0byBzdXNwZW5kLlxuZnVuY3Rpb24gd2l0aFN1c3BlbnNlQ29uZmlnKHNjb3BlLCBjb25maWcpIHtcbiAgdmFyIHByZXZpb3VzQ29uZmlnID0gUmVhY3RDdXJyZW50QmF0Y2hDb25maWcuc3VzcGVuc2U7XG4gIFJlYWN0Q3VycmVudEJhdGNoQ29uZmlnLnN1c3BlbnNlID0gY29uZmlnID09PSB1bmRlZmluZWQgPyBudWxsIDogY29uZmlnO1xuICB0cnkge1xuICAgIHNjb3BlKCk7XG4gIH0gZmluYWxseSB7XG4gICAgUmVhY3RDdXJyZW50QmF0Y2hDb25maWcuc3VzcGVuc2UgPSBwcmV2aW91c0NvbmZpZztcbiAgfVxufVxuXG4vKipcbiAqIFJlYWN0RWxlbWVudFZhbGlkYXRvciBwcm92aWRlcyBhIHdyYXBwZXIgYXJvdW5kIGEgZWxlbWVudCBmYWN0b3J5XG4gKiB3aGljaCB2YWxpZGF0ZXMgdGhlIHByb3BzIHBhc3NlZCB0byB0aGUgZWxlbWVudC4gVGhpcyBpcyBpbnRlbmRlZCB0byBiZVxuICogdXNlZCBvbmx5IGluIERFViBhbmQgY291bGQgYmUgcmVwbGFjZWQgYnkgYSBzdGF0aWMgdHlwZSBjaGVja2VyIGZvciBsYW5ndWFnZXNcbiAqIHRoYXQgc3VwcG9ydCBpdC5cbiAqL1xuXG52YXIgcHJvcFR5cGVzTWlzc3BlbGxXYXJuaW5nU2hvd24gPSB2b2lkIDA7XG5cbntcbiAgcHJvcFR5cGVzTWlzc3BlbGxXYXJuaW5nU2hvd24gPSBmYWxzZTtcbn1cblxuZnVuY3Rpb24gZ2V0RGVjbGFyYXRpb25FcnJvckFkZGVuZHVtKCkge1xuICBpZiAoUmVhY3RDdXJyZW50T3duZXIuY3VycmVudCkge1xuICAgIHZhciBuYW1lID0gZ2V0Q29tcG9uZW50TmFtZShSZWFjdEN1cnJlbnRPd25lci5jdXJyZW50LnR5cGUpO1xuICAgIGlmIChuYW1lKSB7XG4gICAgICByZXR1cm4gJ1xcblxcbkNoZWNrIHRoZSByZW5kZXIgbWV0aG9kIG9mIGAnICsgbmFtZSArICdgLic7XG4gICAgfVxuICB9XG4gIHJldHVybiAnJztcbn1cblxuZnVuY3Rpb24gZ2V0U291cmNlSW5mb0Vycm9yQWRkZW5kdW0oc291cmNlKSB7XG4gIGlmIChzb3VyY2UgIT09IHVuZGVmaW5lZCkge1xuICAgIHZhciBmaWxlTmFtZSA9IHNvdXJjZS5maWxlTmFtZS5yZXBsYWNlKC9eLipbXFxcXFxcL10vLCAnJyk7XG4gICAgdmFyIGxpbmVOdW1iZXIgPSBzb3VyY2UubGluZU51bWJlcjtcbiAgICByZXR1cm4gJ1xcblxcbkNoZWNrIHlvdXIgY29kZSBhdCAnICsgZmlsZU5hbWUgKyAnOicgKyBsaW5lTnVtYmVyICsgJy4nO1xuICB9XG4gIHJldHVybiAnJztcbn1cblxuZnVuY3Rpb24gZ2V0U291cmNlSW5mb0Vycm9yQWRkZW5kdW1Gb3JQcm9wcyhlbGVtZW50UHJvcHMpIHtcbiAgaWYgKGVsZW1lbnRQcm9wcyAhPT0gbnVsbCAmJiBlbGVtZW50UHJvcHMgIT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiBnZXRTb3VyY2VJbmZvRXJyb3JBZGRlbmR1bShlbGVtZW50UHJvcHMuX19zb3VyY2UpO1xuICB9XG4gIHJldHVybiAnJztcbn1cblxuLyoqXG4gKiBXYXJuIGlmIHRoZXJlJ3Mgbm8ga2V5IGV4cGxpY2l0bHkgc2V0IG9uIGR5bmFtaWMgYXJyYXlzIG9mIGNoaWxkcmVuIG9yXG4gKiBvYmplY3Qga2V5cyBhcmUgbm90IHZhbGlkLiBUaGlzIGFsbG93cyB1cyB0byBrZWVwIHRyYWNrIG9mIGNoaWxkcmVuIGJldHdlZW5cbiAqIHVwZGF0ZXMuXG4gKi9cbnZhciBvd25lckhhc0tleVVzZVdhcm5pbmcgPSB7fTtcblxuZnVuY3Rpb24gZ2V0Q3VycmVudENvbXBvbmVudEVycm9ySW5mbyhwYXJlbnRUeXBlKSB7XG4gIHZhciBpbmZvID0gZ2V0RGVjbGFyYXRpb25FcnJvckFkZGVuZHVtKCk7XG5cbiAgaWYgKCFpbmZvKSB7XG4gICAgdmFyIHBhcmVudE5hbWUgPSB0eXBlb2YgcGFyZW50VHlwZSA9PT0gJ3N0cmluZycgPyBwYXJlbnRUeXBlIDogcGFyZW50VHlwZS5kaXNwbGF5TmFtZSB8fCBwYXJlbnRUeXBlLm5hbWU7XG4gICAgaWYgKHBhcmVudE5hbWUpIHtcbiAgICAgIGluZm8gPSAnXFxuXFxuQ2hlY2sgdGhlIHRvcC1sZXZlbCByZW5kZXIgY2FsbCB1c2luZyA8JyArIHBhcmVudE5hbWUgKyAnPi4nO1xuICAgIH1cbiAgfVxuICByZXR1cm4gaW5mbztcbn1cblxuLyoqXG4gKiBXYXJuIGlmIHRoZSBlbGVtZW50IGRvZXNuJ3QgaGF2ZSBhbiBleHBsaWNpdCBrZXkgYXNzaWduZWQgdG8gaXQuXG4gKiBUaGlzIGVsZW1lbnQgaXMgaW4gYW4gYXJyYXkuIFRoZSBhcnJheSBjb3VsZCBncm93IGFuZCBzaHJpbmsgb3IgYmVcbiAqIHJlb3JkZXJlZC4gQWxsIGNoaWxkcmVuIHRoYXQgaGF2ZW4ndCBhbHJlYWR5IGJlZW4gdmFsaWRhdGVkIGFyZSByZXF1aXJlZCB0b1xuICogaGF2ZSBhIFwia2V5XCIgcHJvcGVydHkgYXNzaWduZWQgdG8gaXQuIEVycm9yIHN0YXR1c2VzIGFyZSBjYWNoZWQgc28gYSB3YXJuaW5nXG4gKiB3aWxsIG9ubHkgYmUgc2hvd24gb25jZS5cbiAqXG4gKiBAaW50ZXJuYWxcbiAqIEBwYXJhbSB7UmVhY3RFbGVtZW50fSBlbGVtZW50IEVsZW1lbnQgdGhhdCByZXF1aXJlcyBhIGtleS5cbiAqIEBwYXJhbSB7Kn0gcGFyZW50VHlwZSBlbGVtZW50J3MgcGFyZW50J3MgdHlwZS5cbiAqL1xuZnVuY3Rpb24gdmFsaWRhdGVFeHBsaWNpdEtleShlbGVtZW50LCBwYXJlbnRUeXBlKSB7XG4gIGlmICghZWxlbWVudC5fc3RvcmUgfHwgZWxlbWVudC5fc3RvcmUudmFsaWRhdGVkIHx8IGVsZW1lbnQua2V5ICE9IG51bGwpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgZWxlbWVudC5fc3RvcmUudmFsaWRhdGVkID0gdHJ1ZTtcblxuICB2YXIgY3VycmVudENvbXBvbmVudEVycm9ySW5mbyA9IGdldEN1cnJlbnRDb21wb25lbnRFcnJvckluZm8ocGFyZW50VHlwZSk7XG4gIGlmIChvd25lckhhc0tleVVzZVdhcm5pbmdbY3VycmVudENvbXBvbmVudEVycm9ySW5mb10pIHtcbiAgICByZXR1cm47XG4gIH1cbiAgb3duZXJIYXNLZXlVc2VXYXJuaW5nW2N1cnJlbnRDb21wb25lbnRFcnJvckluZm9dID0gdHJ1ZTtcblxuICAvLyBVc3VhbGx5IHRoZSBjdXJyZW50IG93bmVyIGlzIHRoZSBvZmZlbmRlciwgYnV0IGlmIGl0IGFjY2VwdHMgY2hpbGRyZW4gYXMgYVxuICAvLyBwcm9wZXJ0eSwgaXQgbWF5IGJlIHRoZSBjcmVhdG9yIG9mIHRoZSBjaGlsZCB0aGF0J3MgcmVzcG9uc2libGUgZm9yXG4gIC8vIGFzc2lnbmluZyBpdCBhIGtleS5cbiAgdmFyIGNoaWxkT3duZXIgPSAnJztcbiAgaWYgKGVsZW1lbnQgJiYgZWxlbWVudC5fb3duZXIgJiYgZWxlbWVudC5fb3duZXIgIT09IFJlYWN0Q3VycmVudE93bmVyLmN1cnJlbnQpIHtcbiAgICAvLyBHaXZlIHRoZSBjb21wb25lbnQgdGhhdCBvcmlnaW5hbGx5IGNyZWF0ZWQgdGhpcyBjaGlsZC5cbiAgICBjaGlsZE93bmVyID0gJyBJdCB3YXMgcGFzc2VkIGEgY2hpbGQgZnJvbSAnICsgZ2V0Q29tcG9uZW50TmFtZShlbGVtZW50Ll9vd25lci50eXBlKSArICcuJztcbiAgfVxuXG4gIHNldEN1cnJlbnRseVZhbGlkYXRpbmdFbGVtZW50KGVsZW1lbnQpO1xuICB7XG4gICAgd2FybmluZyQxKGZhbHNlLCAnRWFjaCBjaGlsZCBpbiBhIGxpc3Qgc2hvdWxkIGhhdmUgYSB1bmlxdWUgXCJrZXlcIiBwcm9wLicgKyAnJXMlcyBTZWUgaHR0cHM6Ly9mYi5tZS9yZWFjdC13YXJuaW5nLWtleXMgZm9yIG1vcmUgaW5mb3JtYXRpb24uJywgY3VycmVudENvbXBvbmVudEVycm9ySW5mbywgY2hpbGRPd25lcik7XG4gIH1cbiAgc2V0Q3VycmVudGx5VmFsaWRhdGluZ0VsZW1lbnQobnVsbCk7XG59XG5cbi8qKlxuICogRW5zdXJlIHRoYXQgZXZlcnkgZWxlbWVudCBlaXRoZXIgaXMgcGFzc2VkIGluIGEgc3RhdGljIGxvY2F0aW9uLCBpbiBhblxuICogYXJyYXkgd2l0aCBhbiBleHBsaWNpdCBrZXlzIHByb3BlcnR5IGRlZmluZWQsIG9yIGluIGFuIG9iamVjdCBsaXRlcmFsXG4gKiB3aXRoIHZhbGlkIGtleSBwcm9wZXJ0eS5cbiAqXG4gKiBAaW50ZXJuYWxcbiAqIEBwYXJhbSB7UmVhY3ROb2RlfSBub2RlIFN0YXRpY2FsbHkgcGFzc2VkIGNoaWxkIG9mIGFueSB0eXBlLlxuICogQHBhcmFtIHsqfSBwYXJlbnRUeXBlIG5vZGUncyBwYXJlbnQncyB0eXBlLlxuICovXG5mdW5jdGlvbiB2YWxpZGF0ZUNoaWxkS2V5cyhub2RlLCBwYXJlbnRUeXBlKSB7XG4gIGlmICh0eXBlb2Ygbm9kZSAhPT0gJ29iamVjdCcpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKEFycmF5LmlzQXJyYXkobm9kZSkpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGUubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBjaGlsZCA9IG5vZGVbaV07XG4gICAgICBpZiAoaXNWYWxpZEVsZW1lbnQoY2hpbGQpKSB7XG4gICAgICAgIHZhbGlkYXRlRXhwbGljaXRLZXkoY2hpbGQsIHBhcmVudFR5cGUpO1xuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIGlmIChpc1ZhbGlkRWxlbWVudChub2RlKSkge1xuICAgIC8vIFRoaXMgZWxlbWVudCB3YXMgcGFzc2VkIGluIGEgdmFsaWQgbG9jYXRpb24uXG4gICAgaWYgKG5vZGUuX3N0b3JlKSB7XG4gICAgICBub2RlLl9zdG9yZS52YWxpZGF0ZWQgPSB0cnVlO1xuICAgIH1cbiAgfSBlbHNlIGlmIChub2RlKSB7XG4gICAgdmFyIGl0ZXJhdG9yRm4gPSBnZXRJdGVyYXRvckZuKG5vZGUpO1xuICAgIGlmICh0eXBlb2YgaXRlcmF0b3JGbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgLy8gRW50cnkgaXRlcmF0b3JzIHVzZWQgdG8gcHJvdmlkZSBpbXBsaWNpdCBrZXlzLFxuICAgICAgLy8gYnV0IG5vdyB3ZSBwcmludCBhIHNlcGFyYXRlIHdhcm5pbmcgZm9yIHRoZW0gbGF0ZXIuXG4gICAgICBpZiAoaXRlcmF0b3JGbiAhPT0gbm9kZS5lbnRyaWVzKSB7XG4gICAgICAgIHZhciBpdGVyYXRvciA9IGl0ZXJhdG9yRm4uY2FsbChub2RlKTtcbiAgICAgICAgdmFyIHN0ZXAgPSB2b2lkIDA7XG4gICAgICAgIHdoaWxlICghKHN0ZXAgPSBpdGVyYXRvci5uZXh0KCkpLmRvbmUpIHtcbiAgICAgICAgICBpZiAoaXNWYWxpZEVsZW1lbnQoc3RlcC52YWx1ZSkpIHtcbiAgICAgICAgICAgIHZhbGlkYXRlRXhwbGljaXRLZXkoc3RlcC52YWx1ZSwgcGFyZW50VHlwZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogR2l2ZW4gYW4gZWxlbWVudCwgdmFsaWRhdGUgdGhhdCBpdHMgcHJvcHMgZm9sbG93IHRoZSBwcm9wVHlwZXMgZGVmaW5pdGlvbixcbiAqIHByb3ZpZGVkIGJ5IHRoZSB0eXBlLlxuICpcbiAqIEBwYXJhbSB7UmVhY3RFbGVtZW50fSBlbGVtZW50XG4gKi9cbmZ1bmN0aW9uIHZhbGlkYXRlUHJvcFR5cGVzKGVsZW1lbnQpIHtcbiAgdmFyIHR5cGUgPSBlbGVtZW50LnR5cGU7XG4gIGlmICh0eXBlID09PSBudWxsIHx8IHR5cGUgPT09IHVuZGVmaW5lZCB8fCB0eXBlb2YgdHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgdmFyIG5hbWUgPSBnZXRDb21wb25lbnROYW1lKHR5cGUpO1xuICB2YXIgcHJvcFR5cGVzID0gdm9pZCAwO1xuICBpZiAodHlwZW9mIHR5cGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICBwcm9wVHlwZXMgPSB0eXBlLnByb3BUeXBlcztcbiAgfSBlbHNlIGlmICh0eXBlb2YgdHlwZSA9PT0gJ29iamVjdCcgJiYgKHR5cGUuJCR0eXBlb2YgPT09IFJFQUNUX0ZPUldBUkRfUkVGX1RZUEUgfHxcbiAgLy8gTm90ZTogTWVtbyBvbmx5IGNoZWNrcyBvdXRlciBwcm9wcyBoZXJlLlxuICAvLyBJbm5lciBwcm9wcyBhcmUgY2hlY2tlZCBpbiB0aGUgcmVjb25jaWxlci5cbiAgdHlwZS4kJHR5cGVvZiA9PT0gUkVBQ1RfTUVNT19UWVBFKSkge1xuICAgIHByb3BUeXBlcyA9IHR5cGUucHJvcFR5cGVzO1xuICB9IGVsc2Uge1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAocHJvcFR5cGVzKSB7XG4gICAgc2V0Q3VycmVudGx5VmFsaWRhdGluZ0VsZW1lbnQoZWxlbWVudCk7XG4gICAgY2hlY2tQcm9wVHlwZXMocHJvcFR5cGVzLCBlbGVtZW50LnByb3BzLCAncHJvcCcsIG5hbWUsIFJlYWN0RGVidWdDdXJyZW50RnJhbWUuZ2V0U3RhY2tBZGRlbmR1bSk7XG4gICAgc2V0Q3VycmVudGx5VmFsaWRhdGluZ0VsZW1lbnQobnVsbCk7XG4gIH0gZWxzZSBpZiAodHlwZS5Qcm9wVHlwZXMgIT09IHVuZGVmaW5lZCAmJiAhcHJvcFR5cGVzTWlzc3BlbGxXYXJuaW5nU2hvd24pIHtcbiAgICBwcm9wVHlwZXNNaXNzcGVsbFdhcm5pbmdTaG93biA9IHRydWU7XG4gICAgd2FybmluZ1dpdGhvdXRTdGFjayQxKGZhbHNlLCAnQ29tcG9uZW50ICVzIGRlY2xhcmVkIGBQcm9wVHlwZXNgIGluc3RlYWQgb2YgYHByb3BUeXBlc2AuIERpZCB5b3UgbWlzc3BlbGwgdGhlIHByb3BlcnR5IGFzc2lnbm1lbnQ/JywgbmFtZSB8fCAnVW5rbm93bicpO1xuICB9XG4gIGlmICh0eXBlb2YgdHlwZS5nZXREZWZhdWx0UHJvcHMgPT09ICdmdW5jdGlvbicpIHtcbiAgICAhdHlwZS5nZXREZWZhdWx0UHJvcHMuaXNSZWFjdENsYXNzQXBwcm92ZWQgPyB3YXJuaW5nV2l0aG91dFN0YWNrJDEoZmFsc2UsICdnZXREZWZhdWx0UHJvcHMgaXMgb25seSB1c2VkIG9uIGNsYXNzaWMgUmVhY3QuY3JlYXRlQ2xhc3MgJyArICdkZWZpbml0aW9ucy4gVXNlIGEgc3RhdGljIHByb3BlcnR5IG5hbWVkIGBkZWZhdWx0UHJvcHNgIGluc3RlYWQuJykgOiB2b2lkIDA7XG4gIH1cbn1cblxuLyoqXG4gKiBHaXZlbiBhIGZyYWdtZW50LCB2YWxpZGF0ZSB0aGF0IGl0IGNhbiBvbmx5IGJlIHByb3ZpZGVkIHdpdGggZnJhZ21lbnQgcHJvcHNcbiAqIEBwYXJhbSB7UmVhY3RFbGVtZW50fSBmcmFnbWVudFxuICovXG5mdW5jdGlvbiB2YWxpZGF0ZUZyYWdtZW50UHJvcHMoZnJhZ21lbnQpIHtcbiAgc2V0Q3VycmVudGx5VmFsaWRhdGluZ0VsZW1lbnQoZnJhZ21lbnQpO1xuXG4gIHZhciBrZXlzID0gT2JqZWN0LmtleXMoZnJhZ21lbnQucHJvcHMpO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIga2V5ID0ga2V5c1tpXTtcbiAgICBpZiAoa2V5ICE9PSAnY2hpbGRyZW4nICYmIGtleSAhPT0gJ2tleScpIHtcbiAgICAgIHdhcm5pbmckMShmYWxzZSwgJ0ludmFsaWQgcHJvcCBgJXNgIHN1cHBsaWVkIHRvIGBSZWFjdC5GcmFnbWVudGAuICcgKyAnUmVhY3QuRnJhZ21lbnQgY2FuIG9ubHkgaGF2ZSBga2V5YCBhbmQgYGNoaWxkcmVuYCBwcm9wcy4nLCBrZXkpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgaWYgKGZyYWdtZW50LnJlZiAhPT0gbnVsbCkge1xuICAgIHdhcm5pbmckMShmYWxzZSwgJ0ludmFsaWQgYXR0cmlidXRlIGByZWZgIHN1cHBsaWVkIHRvIGBSZWFjdC5GcmFnbWVudGAuJyk7XG4gIH1cblxuICBzZXRDdXJyZW50bHlWYWxpZGF0aW5nRWxlbWVudChudWxsKTtcbn1cblxuZnVuY3Rpb24ganN4V2l0aFZhbGlkYXRpb24odHlwZSwgcHJvcHMsIGtleSwgaXNTdGF0aWNDaGlsZHJlbiwgc291cmNlLCBzZWxmKSB7XG4gIHZhciB2YWxpZFR5cGUgPSBpc1ZhbGlkRWxlbWVudFR5cGUodHlwZSk7XG5cbiAgLy8gV2Ugd2FybiBpbiB0aGlzIGNhc2UgYnV0IGRvbid0IHRocm93LiBXZSBleHBlY3QgdGhlIGVsZW1lbnQgY3JlYXRpb24gdG9cbiAgLy8gc3VjY2VlZCBhbmQgdGhlcmUgd2lsbCBsaWtlbHkgYmUgZXJyb3JzIGluIHJlbmRlci5cbiAgaWYgKCF2YWxpZFR5cGUpIHtcbiAgICB2YXIgaW5mbyA9ICcnO1xuICAgIGlmICh0eXBlID09PSB1bmRlZmluZWQgfHwgdHlwZW9mIHR5cGUgPT09ICdvYmplY3QnICYmIHR5cGUgIT09IG51bGwgJiYgT2JqZWN0LmtleXModHlwZSkubGVuZ3RoID09PSAwKSB7XG4gICAgICBpbmZvICs9ICcgWW91IGxpa2VseSBmb3Jnb3QgdG8gZXhwb3J0IHlvdXIgY29tcG9uZW50IGZyb20gdGhlIGZpbGUgJyArIFwiaXQncyBkZWZpbmVkIGluLCBvciB5b3UgbWlnaHQgaGF2ZSBtaXhlZCB1cCBkZWZhdWx0IGFuZCBuYW1lZCBpbXBvcnRzLlwiO1xuICAgIH1cblxuICAgIHZhciBzb3VyY2VJbmZvID0gZ2V0U291cmNlSW5mb0Vycm9yQWRkZW5kdW0oc291cmNlKTtcbiAgICBpZiAoc291cmNlSW5mbykge1xuICAgICAgaW5mbyArPSBzb3VyY2VJbmZvO1xuICAgIH0gZWxzZSB7XG4gICAgICBpbmZvICs9IGdldERlY2xhcmF0aW9uRXJyb3JBZGRlbmR1bSgpO1xuICAgIH1cblxuICAgIHZhciB0eXBlU3RyaW5nID0gdm9pZCAwO1xuICAgIGlmICh0eXBlID09PSBudWxsKSB7XG4gICAgICB0eXBlU3RyaW5nID0gJ251bGwnO1xuICAgIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheSh0eXBlKSkge1xuICAgICAgdHlwZVN0cmluZyA9ICdhcnJheSc7XG4gICAgfSBlbHNlIGlmICh0eXBlICE9PSB1bmRlZmluZWQgJiYgdHlwZS4kJHR5cGVvZiA9PT0gUkVBQ1RfRUxFTUVOVF9UWVBFKSB7XG4gICAgICB0eXBlU3RyaW5nID0gJzwnICsgKGdldENvbXBvbmVudE5hbWUodHlwZS50eXBlKSB8fCAnVW5rbm93bicpICsgJyAvPic7XG4gICAgICBpbmZvID0gJyBEaWQgeW91IGFjY2lkZW50YWxseSBleHBvcnQgYSBKU1ggbGl0ZXJhbCBpbnN0ZWFkIG9mIGEgY29tcG9uZW50Pyc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHR5cGVTdHJpbmcgPSB0eXBlb2YgdHlwZTtcbiAgICB9XG5cbiAgICB3YXJuaW5nJDEoZmFsc2UsICdSZWFjdC5qc3g6IHR5cGUgaXMgaW52YWxpZCAtLSBleHBlY3RlZCBhIHN0cmluZyAoZm9yICcgKyAnYnVpbHQtaW4gY29tcG9uZW50cykgb3IgYSBjbGFzcy9mdW5jdGlvbiAoZm9yIGNvbXBvc2l0ZSAnICsgJ2NvbXBvbmVudHMpIGJ1dCBnb3Q6ICVzLiVzJywgdHlwZVN0cmluZywgaW5mbyk7XG4gIH1cblxuICB2YXIgZWxlbWVudCA9IGpzeERFVih0eXBlLCBwcm9wcywga2V5LCBzb3VyY2UsIHNlbGYpO1xuXG4gIC8vIFRoZSByZXN1bHQgY2FuIGJlIG51bGxpc2ggaWYgYSBtb2NrIG9yIGEgY3VzdG9tIGZ1bmN0aW9uIGlzIHVzZWQuXG4gIC8vIFRPRE86IERyb3AgdGhpcyB3aGVuIHRoZXNlIGFyZSBubyBsb25nZXIgYWxsb3dlZCBhcyB0aGUgdHlwZSBhcmd1bWVudC5cbiAgaWYgKGVsZW1lbnQgPT0gbnVsbCkge1xuICAgIHJldHVybiBlbGVtZW50O1xuICB9XG5cbiAgLy8gU2tpcCBrZXkgd2FybmluZyBpZiB0aGUgdHlwZSBpc24ndCB2YWxpZCBzaW5jZSBvdXIga2V5IHZhbGlkYXRpb24gbG9naWNcbiAgLy8gZG9lc24ndCBleHBlY3QgYSBub24tc3RyaW5nL2Z1bmN0aW9uIHR5cGUgYW5kIGNhbiB0aHJvdyBjb25mdXNpbmcgZXJyb3JzLlxuICAvLyBXZSBkb24ndCB3YW50IGV4Y2VwdGlvbiBiZWhhdmlvciB0byBkaWZmZXIgYmV0d2VlbiBkZXYgYW5kIHByb2QuXG4gIC8vIChSZW5kZXJpbmcgd2lsbCB0aHJvdyB3aXRoIGEgaGVscGZ1bCBtZXNzYWdlIGFuZCBhcyBzb29uIGFzIHRoZSB0eXBlIGlzXG4gIC8vIGZpeGVkLCB0aGUga2V5IHdhcm5pbmdzIHdpbGwgYXBwZWFyLilcbiAgaWYgKHZhbGlkVHlwZSkge1xuICAgIHZhciBjaGlsZHJlbiA9IHByb3BzLmNoaWxkcmVuO1xuICAgIGlmIChjaGlsZHJlbiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBpZiAoaXNTdGF0aWNDaGlsZHJlbikge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgdmFsaWRhdGVDaGlsZEtleXMoY2hpbGRyZW5baV0sIHR5cGUpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YWxpZGF0ZUNoaWxkS2V5cyhjaGlsZHJlbiwgdHlwZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaWYgKHByb3BzLmtleSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgd2FybmluZyQxKGZhbHNlLCAnUmVhY3QuanN4OiBTcHJlYWRpbmcgYSBrZXkgdG8gSlNYIGlzIGEgZGVwcmVjYXRlZCBwYXR0ZXJuLiAnICsgJ0V4cGxpY2l0bHkgcGFzcyBhIGtleSBhZnRlciBzcHJlYWRpbmcgcHJvcHMgaW4geW91ciBKU1ggY2FsbC4gJyArICdFLmcuIDxDb21wb25lbnROYW1lIHsuLi5wcm9wc30ga2V5PXtrZXl9IC8+Jyk7XG4gIH1cblxuICBpZiAodHlwZSA9PT0gUkVBQ1RfRlJBR01FTlRfVFlQRSkge1xuICAgIHZhbGlkYXRlRnJhZ21lbnRQcm9wcyhlbGVtZW50KTtcbiAgfSBlbHNlIHtcbiAgICB2YWxpZGF0ZVByb3BUeXBlcyhlbGVtZW50KTtcbiAgfVxuXG4gIHJldHVybiBlbGVtZW50O1xufVxuXG4vLyBUaGVzZSB0d28gZnVuY3Rpb25zIGV4aXN0IHRvIHN0aWxsIGdldCBjaGlsZCB3YXJuaW5ncyBpbiBkZXZcbi8vIGV2ZW4gd2l0aCB0aGUgcHJvZCB0cmFuc2Zvcm0uIFRoaXMgbWVhbnMgdGhhdCBqc3hERVYgaXMgcHVyZWx5XG4vLyBvcHQtaW4gYmVoYXZpb3IgZm9yIGJldHRlciBtZXNzYWdlcyBidXQgdGhhdCB3ZSB3b24ndCBzdG9wXG4vLyBnaXZpbmcgeW91IHdhcm5pbmdzIGlmIHlvdSB1c2UgcHJvZHVjdGlvbiBhcGlzLlxuZnVuY3Rpb24ganN4V2l0aFZhbGlkYXRpb25TdGF0aWModHlwZSwgcHJvcHMsIGtleSkge1xuICByZXR1cm4ganN4V2l0aFZhbGlkYXRpb24odHlwZSwgcHJvcHMsIGtleSwgdHJ1ZSk7XG59XG5cbmZ1bmN0aW9uIGpzeFdpdGhWYWxpZGF0aW9uRHluYW1pYyh0eXBlLCBwcm9wcywga2V5KSB7XG4gIHJldHVybiBqc3hXaXRoVmFsaWRhdGlvbih0eXBlLCBwcm9wcywga2V5LCBmYWxzZSk7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUVsZW1lbnRXaXRoVmFsaWRhdGlvbih0eXBlLCBwcm9wcywgY2hpbGRyZW4pIHtcbiAgdmFyIHZhbGlkVHlwZSA9IGlzVmFsaWRFbGVtZW50VHlwZSh0eXBlKTtcblxuICAvLyBXZSB3YXJuIGluIHRoaXMgY2FzZSBidXQgZG9uJ3QgdGhyb3cuIFdlIGV4cGVjdCB0aGUgZWxlbWVudCBjcmVhdGlvbiB0b1xuICAvLyBzdWNjZWVkIGFuZCB0aGVyZSB3aWxsIGxpa2VseSBiZSBlcnJvcnMgaW4gcmVuZGVyLlxuICBpZiAoIXZhbGlkVHlwZSkge1xuICAgIHZhciBpbmZvID0gJyc7XG4gICAgaWYgKHR5cGUgPT09IHVuZGVmaW5lZCB8fCB0eXBlb2YgdHlwZSA9PT0gJ29iamVjdCcgJiYgdHlwZSAhPT0gbnVsbCAmJiBPYmplY3Qua2V5cyh0eXBlKS5sZW5ndGggPT09IDApIHtcbiAgICAgIGluZm8gKz0gJyBZb3UgbGlrZWx5IGZvcmdvdCB0byBleHBvcnQgeW91ciBjb21wb25lbnQgZnJvbSB0aGUgZmlsZSAnICsgXCJpdCdzIGRlZmluZWQgaW4sIG9yIHlvdSBtaWdodCBoYXZlIG1peGVkIHVwIGRlZmF1bHQgYW5kIG5hbWVkIGltcG9ydHMuXCI7XG4gICAgfVxuXG4gICAgdmFyIHNvdXJjZUluZm8gPSBnZXRTb3VyY2VJbmZvRXJyb3JBZGRlbmR1bUZvclByb3BzKHByb3BzKTtcbiAgICBpZiAoc291cmNlSW5mbykge1xuICAgICAgaW5mbyArPSBzb3VyY2VJbmZvO1xuICAgIH0gZWxzZSB7XG4gICAgICBpbmZvICs9IGdldERlY2xhcmF0aW9uRXJyb3JBZGRlbmR1bSgpO1xuICAgIH1cblxuICAgIHZhciB0eXBlU3RyaW5nID0gdm9pZCAwO1xuICAgIGlmICh0eXBlID09PSBudWxsKSB7XG4gICAgICB0eXBlU3RyaW5nID0gJ251bGwnO1xuICAgIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheSh0eXBlKSkge1xuICAgICAgdHlwZVN0cmluZyA9ICdhcnJheSc7XG4gICAgfSBlbHNlIGlmICh0eXBlICE9PSB1bmRlZmluZWQgJiYgdHlwZS4kJHR5cGVvZiA9PT0gUkVBQ1RfRUxFTUVOVF9UWVBFKSB7XG4gICAgICB0eXBlU3RyaW5nID0gJzwnICsgKGdldENvbXBvbmVudE5hbWUodHlwZS50eXBlKSB8fCAnVW5rbm93bicpICsgJyAvPic7XG4gICAgICBpbmZvID0gJyBEaWQgeW91IGFjY2lkZW50YWxseSBleHBvcnQgYSBKU1ggbGl0ZXJhbCBpbnN0ZWFkIG9mIGEgY29tcG9uZW50Pyc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHR5cGVTdHJpbmcgPSB0eXBlb2YgdHlwZTtcbiAgICB9XG5cbiAgICB3YXJuaW5nJDEoZmFsc2UsICdSZWFjdC5jcmVhdGVFbGVtZW50OiB0eXBlIGlzIGludmFsaWQgLS0gZXhwZWN0ZWQgYSBzdHJpbmcgKGZvciAnICsgJ2J1aWx0LWluIGNvbXBvbmVudHMpIG9yIGEgY2xhc3MvZnVuY3Rpb24gKGZvciBjb21wb3NpdGUgJyArICdjb21wb25lbnRzKSBidXQgZ290OiAlcy4lcycsIHR5cGVTdHJpbmcsIGluZm8pO1xuICB9XG5cbiAgdmFyIGVsZW1lbnQgPSBjcmVhdGVFbGVtZW50LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cbiAgLy8gVGhlIHJlc3VsdCBjYW4gYmUgbnVsbGlzaCBpZiBhIG1vY2sgb3IgYSBjdXN0b20gZnVuY3Rpb24gaXMgdXNlZC5cbiAgLy8gVE9ETzogRHJvcCB0aGlzIHdoZW4gdGhlc2UgYXJlIG5vIGxvbmdlciBhbGxvd2VkIGFzIHRoZSB0eXBlIGFyZ3VtZW50LlxuICBpZiAoZWxlbWVudCA9PSBudWxsKSB7XG4gICAgcmV0dXJuIGVsZW1lbnQ7XG4gIH1cblxuICAvLyBTa2lwIGtleSB3YXJuaW5nIGlmIHRoZSB0eXBlIGlzbid0IHZhbGlkIHNpbmNlIG91ciBrZXkgdmFsaWRhdGlvbiBsb2dpY1xuICAvLyBkb2Vzbid0IGV4cGVjdCBhIG5vbi1zdHJpbmcvZnVuY3Rpb24gdHlwZSBhbmQgY2FuIHRocm93IGNvbmZ1c2luZyBlcnJvcnMuXG4gIC8vIFdlIGRvbid0IHdhbnQgZXhjZXB0aW9uIGJlaGF2aW9yIHRvIGRpZmZlciBiZXR3ZWVuIGRldiBhbmQgcHJvZC5cbiAgLy8gKFJlbmRlcmluZyB3aWxsIHRocm93IHdpdGggYSBoZWxwZnVsIG1lc3NhZ2UgYW5kIGFzIHNvb24gYXMgdGhlIHR5cGUgaXNcbiAgLy8gZml4ZWQsIHRoZSBrZXkgd2FybmluZ3Mgd2lsbCBhcHBlYXIuKVxuICBpZiAodmFsaWRUeXBlKSB7XG4gICAgZm9yICh2YXIgaSA9IDI7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhbGlkYXRlQ2hpbGRLZXlzKGFyZ3VtZW50c1tpXSwgdHlwZSk7XG4gICAgfVxuICB9XG5cbiAgaWYgKHR5cGUgPT09IFJFQUNUX0ZSQUdNRU5UX1RZUEUpIHtcbiAgICB2YWxpZGF0ZUZyYWdtZW50UHJvcHMoZWxlbWVudCk7XG4gIH0gZWxzZSB7XG4gICAgdmFsaWRhdGVQcm9wVHlwZXMoZWxlbWVudCk7XG4gIH1cblxuICByZXR1cm4gZWxlbWVudDtcbn1cblxuZnVuY3Rpb24gY3JlYXRlRmFjdG9yeVdpdGhWYWxpZGF0aW9uKHR5cGUpIHtcbiAgdmFyIHZhbGlkYXRlZEZhY3RvcnkgPSBjcmVhdGVFbGVtZW50V2l0aFZhbGlkYXRpb24uYmluZChudWxsLCB0eXBlKTtcbiAgdmFsaWRhdGVkRmFjdG9yeS50eXBlID0gdHlwZTtcbiAgLy8gTGVnYWN5IGhvb2s6IHJlbW92ZSBpdFxuICB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHZhbGlkYXRlZEZhY3RvcnksICd0eXBlJywge1xuICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbG93UHJpb3JpdHlXYXJuaW5nJDEoZmFsc2UsICdGYWN0b3J5LnR5cGUgaXMgZGVwcmVjYXRlZC4gQWNjZXNzIHRoZSBjbGFzcyBkaXJlY3RseSAnICsgJ2JlZm9yZSBwYXNzaW5nIGl0IHRvIGNyZWF0ZUZhY3RvcnkuJyk7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAndHlwZScsIHtcbiAgICAgICAgICB2YWx1ZTogdHlwZVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHR5cGU7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4gdmFsaWRhdGVkRmFjdG9yeTtcbn1cblxuZnVuY3Rpb24gY2xvbmVFbGVtZW50V2l0aFZhbGlkYXRpb24oZWxlbWVudCwgcHJvcHMsIGNoaWxkcmVuKSB7XG4gIHZhciBuZXdFbGVtZW50ID0gY2xvbmVFbGVtZW50LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIGZvciAodmFyIGkgPSAyOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFsaWRhdGVDaGlsZEtleXMoYXJndW1lbnRzW2ldLCBuZXdFbGVtZW50LnR5cGUpO1xuICB9XG4gIHZhbGlkYXRlUHJvcFR5cGVzKG5ld0VsZW1lbnQpO1xuICByZXR1cm4gbmV3RWxlbWVudDtcbn1cblxudmFyIGhhc0JhZE1hcFBvbHlmaWxsID0gdm9pZCAwO1xuXG57XG4gIGhhc0JhZE1hcFBvbHlmaWxsID0gZmFsc2U7XG4gIHRyeSB7XG4gICAgdmFyIGZyb3plbk9iamVjdCA9IE9iamVjdC5mcmVlemUoe30pO1xuICAgIHZhciB0ZXN0TWFwID0gbmV3IE1hcChbW2Zyb3plbk9iamVjdCwgbnVsbF1dKTtcbiAgICB2YXIgdGVzdFNldCA9IG5ldyBTZXQoW2Zyb3plbk9iamVjdF0pO1xuICAgIC8vIFRoaXMgaXMgbmVjZXNzYXJ5IGZvciBSb2xsdXAgdG8gbm90IGNvbnNpZGVyIHRoZXNlIHVudXNlZC5cbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vcm9sbHVwL3JvbGx1cC9pc3N1ZXMvMTc3MVxuICAgIC8vIFRPRE86IHdlIGNhbiByZW1vdmUgdGhlc2UgaWYgUm9sbHVwIGZpeGVzIHRoZSBidWcuXG4gICAgdGVzdE1hcC5zZXQoMCwgMCk7XG4gICAgdGVzdFNldC5hZGQoMCk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICAvLyBUT0RPOiBDb25zaWRlciB3YXJuaW5nIGFib3V0IGJhZCBwb2x5ZmlsbHNcbiAgICBoYXNCYWRNYXBQb2x5ZmlsbCA9IHRydWU7XG4gIH1cbn1cblxuZnVuY3Rpb24gY3JlYXRlRnVuZGFtZW50YWxDb21wb25lbnQoaW1wbCkge1xuICAvLyBXZSB1c2UgcmVzcG9uZGVyIGFzIGEgTWFwIGtleSBsYXRlciBvbi4gV2hlbiB3ZSBoYXZlIGEgYmFkXG4gIC8vIHBvbHlmaWxsLCB0aGVuIHdlIGNhbid0IHVzZSBpdCBhcyBhIGtleSBhcyB0aGUgcG9seWZpbGwgdHJpZXNcbiAgLy8gdG8gYWRkIGEgcHJvcGVydHkgdG8gdGhlIG9iamVjdC5cbiAgaWYgKHRydWUgJiYgIWhhc0JhZE1hcFBvbHlmaWxsKSB7XG4gICAgT2JqZWN0LmZyZWV6ZShpbXBsKTtcbiAgfVxuICB2YXIgZnVuZGFtYW50YWxDb21wb25lbnQgPSB7XG4gICAgJCR0eXBlb2Y6IFJFQUNUX0ZVTkRBTUVOVEFMX1RZUEUsXG4gICAgaW1wbDogaW1wbFxuICB9O1xuICB7XG4gICAgT2JqZWN0LmZyZWV6ZShmdW5kYW1hbnRhbENvbXBvbmVudCk7XG4gIH1cbiAgcmV0dXJuIGZ1bmRhbWFudGFsQ29tcG9uZW50O1xufVxuXG5mdW5jdGlvbiBjcmVhdGVFdmVudFJlc3BvbmRlcihkaXNwbGF5TmFtZSwgcmVzcG9uZGVyQ29uZmlnKSB7XG4gIHZhciBnZXRJbml0aWFsU3RhdGUgPSByZXNwb25kZXJDb25maWcuZ2V0SW5pdGlhbFN0YXRlLFxuICAgICAgb25FdmVudCA9IHJlc3BvbmRlckNvbmZpZy5vbkV2ZW50LFxuICAgICAgb25Nb3VudCA9IHJlc3BvbmRlckNvbmZpZy5vbk1vdW50LFxuICAgICAgb25Vbm1vdW50ID0gcmVzcG9uZGVyQ29uZmlnLm9uVW5tb3VudCxcbiAgICAgIG9uT3duZXJzaGlwQ2hhbmdlID0gcmVzcG9uZGVyQ29uZmlnLm9uT3duZXJzaGlwQ2hhbmdlLFxuICAgICAgb25Sb290RXZlbnQgPSByZXNwb25kZXJDb25maWcub25Sb290RXZlbnQsXG4gICAgICByb290RXZlbnRUeXBlcyA9IHJlc3BvbmRlckNvbmZpZy5yb290RXZlbnRUeXBlcyxcbiAgICAgIHRhcmdldEV2ZW50VHlwZXMgPSByZXNwb25kZXJDb25maWcudGFyZ2V0RXZlbnRUeXBlcztcblxuICB2YXIgZXZlbnRSZXNwb25kZXIgPSB7XG4gICAgJCR0eXBlb2Y6IFJFQUNUX1JFU1BPTkRFUl9UWVBFLFxuICAgIGRpc3BsYXlOYW1lOiBkaXNwbGF5TmFtZSxcbiAgICBnZXRJbml0aWFsU3RhdGU6IGdldEluaXRpYWxTdGF0ZSB8fCBudWxsLFxuICAgIG9uRXZlbnQ6IG9uRXZlbnQgfHwgbnVsbCxcbiAgICBvbk1vdW50OiBvbk1vdW50IHx8IG51bGwsXG4gICAgb25Pd25lcnNoaXBDaGFuZ2U6IG9uT3duZXJzaGlwQ2hhbmdlIHx8IG51bGwsXG4gICAgb25Sb290RXZlbnQ6IG9uUm9vdEV2ZW50IHx8IG51bGwsXG4gICAgb25Vbm1vdW50OiBvblVubW91bnQgfHwgbnVsbCxcbiAgICByb290RXZlbnRUeXBlczogcm9vdEV2ZW50VHlwZXMgfHwgbnVsbCxcbiAgICB0YXJnZXRFdmVudFR5cGVzOiB0YXJnZXRFdmVudFR5cGVzIHx8IG51bGxcbiAgfTtcbiAgLy8gV2UgdXNlIHJlc3BvbmRlciBhcyBhIE1hcCBrZXkgbGF0ZXIgb24uIFdoZW4gd2UgaGF2ZSBhIGJhZFxuICAvLyBwb2x5ZmlsbCwgdGhlbiB3ZSBjYW4ndCB1c2UgaXQgYXMgYSBrZXkgYXMgdGhlIHBvbHlmaWxsIHRyaWVzXG4gIC8vIHRvIGFkZCBhIHByb3BlcnR5IHRvIHRoZSBvYmplY3QuXG4gIGlmICh0cnVlICYmICFoYXNCYWRNYXBQb2x5ZmlsbCkge1xuICAgIE9iamVjdC5mcmVlemUoZXZlbnRSZXNwb25kZXIpO1xuICB9XG4gIHJldHVybiBldmVudFJlc3BvbmRlcjtcbn1cblxuLy8gSGVscHMgaWRlbnRpZnkgc2lkZSBlZmZlY3RzIGluIGJlZ2luLXBoYXNlIGxpZmVjeWNsZSBob29rcyBhbmQgc2V0U3RhdGUgcmVkdWNlcnM6XG5cblxuLy8gSW4gc29tZSBjYXNlcywgU3RyaWN0TW9kZSBzaG91bGQgYWxzbyBkb3VibGUtcmVuZGVyIGxpZmVjeWNsZXMuXG4vLyBUaGlzIGNhbiBiZSBjb25mdXNpbmcgZm9yIHRlc3RzIHRob3VnaCxcbi8vIEFuZCBpdCBjYW4gYmUgYmFkIGZvciBwZXJmb3JtYW5jZSBpbiBwcm9kdWN0aW9uLlxuLy8gVGhpcyBmZWF0dXJlIGZsYWcgY2FuIGJlIHVzZWQgdG8gY29udHJvbCB0aGUgYmVoYXZpb3I6XG5cblxuLy8gVG8gcHJlc2VydmUgdGhlIFwiUGF1c2Ugb24gY2F1Z2h0IGV4Y2VwdGlvbnNcIiBiZWhhdmlvciBvZiB0aGUgZGVidWdnZXIsIHdlXG4vLyByZXBsYXkgdGhlIGJlZ2luIHBoYXNlIG9mIGEgZmFpbGVkIGNvbXBvbmVudCBpbnNpZGUgaW52b2tlR3VhcmRlZENhbGxiYWNrLlxuXG5cbi8vIFdhcm4gYWJvdXQgZGVwcmVjYXRlZCwgYXN5bmMtdW5zYWZlIGxpZmVjeWNsZXM7IHJlbGF0ZXMgdG8gUkZDICM2OlxuXG5cbi8vIEdhdGhlciBhZHZhbmNlZCB0aW1pbmcgbWV0cmljcyBmb3IgUHJvZmlsZXIgc3VidHJlZXMuXG5cblxuLy8gVHJhY2Ugd2hpY2ggaW50ZXJhY3Rpb25zIHRyaWdnZXIgZWFjaCBjb21taXQuXG5cblxuLy8gT25seSB1c2VkIGluIHd3dyBidWlsZHMuXG4gLy8gVE9ETzogdHJ1ZT8gSGVyZSBpdCBtaWdodCBqdXN0IGJlIGZhbHNlLlxuXG4vLyBPbmx5IHVzZWQgaW4gd3d3IGJ1aWxkcy5cblxuXG4vLyBPbmx5IHVzZWQgaW4gd3d3IGJ1aWxkcy5cblxuXG4vLyBEaXNhYmxlIGphdmFzY3JpcHQ6IFVSTCBzdHJpbmdzIGluIGhyZWYgZm9yIFhTUyBwcm90ZWN0aW9uLlxuXG5cbi8vIFJlYWN0IEZpcmU6IHByZXZlbnQgdGhlIHZhbHVlIGFuZCBjaGVja2VkIGF0dHJpYnV0ZXMgZnJvbSBzeW5jaW5nXG4vLyB3aXRoIHRoZWlyIHJlbGF0ZWQgRE9NIHByb3BlcnRpZXNcblxuXG4vLyBUaGVzZSBBUElzIHdpbGwgbm8gbG9uZ2VyIGJlIFwidW5zdGFibGVcIiBpbiB0aGUgdXBjb21pbmcgMTYuNyByZWxlYXNlLFxuLy8gQ29udHJvbCB0aGlzIGJlaGF2aW9yIHdpdGggYSBmbGFnIHRvIHN1cHBvcnQgMTYuNiBtaW5vciByZWxlYXNlcyBpbiB0aGUgbWVhbndoaWxlLlxuXG5cblxuXG4vLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL3JlYWN0LW5hdGl2ZS1jb21tdW5pdHkvZGlzY3Vzc2lvbnMtYW5kLXByb3Bvc2Fscy9pc3N1ZXMvNzIgZm9yIG1vcmUgaW5mb3JtYXRpb25cbi8vIFRoaXMgaXMgYSBmbGFnIHNvIHdlIGNhbiBmaXggd2FybmluZ3MgaW4gUk4gY29yZSBiZWZvcmUgdHVybmluZyBpdCBvblxuXG5cbi8vIEV4cGVyaW1lbnRhbCBSZWFjdCBGbGFyZSBldmVudCBzeXN0ZW0gYW5kIGV2ZW50IGNvbXBvbmVudHMgc3VwcG9ydC5cbnZhciBlbmFibGVGbGFyZUFQSSA9IGZhbHNlO1xuXG4vLyBFeHBlcmltZW50YWwgSG9zdCBDb21wb25lbnQgc3VwcG9ydC5cbnZhciBlbmFibGVGdW5kYW1lbnRhbEFQSSA9IGZhbHNlO1xuXG4vLyBOZXcgQVBJIGZvciBKU1ggdHJhbnNmb3JtcyB0byB0YXJnZXQgLSBodHRwczovL2dpdGh1Yi5jb20vcmVhY3Rqcy9yZmNzL3B1bGwvMTA3XG52YXIgZW5hYmxlSlNYVHJhbnNmb3JtQVBJID0gZmFsc2U7XG5cbi8vIFdlIHdpbGwgZW5mb3JjZSBtb2NraW5nIHNjaGVkdWxlciB3aXRoIHNjaGVkdWxlci91bnN0YWJsZV9tb2NrIGF0IHNvbWUgcG9pbnQuICh2MTc/KVxuLy8gVGlsbCB0aGVuLCB3ZSB3YXJuIGFib3V0IHRoZSBtaXNzaW5nIG1vY2ssIGJ1dCBzdGlsbCBmYWxsYmFjayB0byBhIHN5bmMgbW9kZSBjb21wYXRpYmxlIHZlcnNpb25cblxuLy8gVGVtcG9yYXJ5IGZsYWcgdG8gcmV2ZXJ0IHRoZSBmaXggaW4gIzE1NjUwXG5cblxuLy8gRm9yIHRlc3RzLCB3ZSBmbHVzaCBzdXNwZW5zZSBmYWxsYmFja3MgaW4gYW4gYWN0IHNjb3BlO1xuLy8gKmV4Y2VwdCogaW4gc29tZSBvZiBvdXIgb3duIHRlc3RzLCB3aGVyZSB3ZSB0ZXN0IGluY3JlbWVudGFsIGxvYWRpbmcgc3RhdGVzLlxuXG5cbi8vIENoYW5nZXMgcHJpb3JpdHkgb2Ygc29tZSBldmVudHMgbGlrZSBtb3VzZW1vdmUgdG8gdXNlci1ibG9ja2luZyBwcmlvcml0eSxcbi8vIGJ1dCB3aXRob3V0IG1ha2luZyB0aGVtIGRpc2NyZXRlLiBUaGUgZmxhZyBleGlzdHMgaW4gY2FzZSBpdCBjYXVzZXNcbi8vIHN0YXJ2YXRpb24gcHJvYmxlbXMuXG5cblxuLy8gQWRkIGEgY2FsbGJhY2sgcHJvcGVydHkgdG8gc3VzcGVuc2UgdG8gbm90aWZ5IHdoaWNoIHByb21pc2VzIGFyZSBjdXJyZW50bHlcbi8vIGluIHRoZSB1cGRhdGUgcXVldWUuIFRoaXMgYWxsb3dzIHJlcG9ydGluZyBhbmQgdHJhY2luZyBvZiB3aGF0IGlzIGNhdXNpbmdcbi8vIHRoZSB1c2VyIHRvIHNlZSBhIGxvYWRpbmcgc3RhdGUuXG5cblxuLy8gUGFydCBvZiB0aGUgc2ltcGxpZmljYXRpb24gb2YgUmVhY3QuY3JlYXRlRWxlbWVudCBzbyB3ZSBjYW4gZXZlbnR1YWxseSBtb3ZlXG4vLyBmcm9tIFJlYWN0LmNyZWF0ZUVsZW1lbnQgdG8gUmVhY3QuanN4XG4vLyBodHRwczovL2dpdGh1Yi5jb20vcmVhY3Rqcy9yZmNzL2Jsb2IvY3JlYXRlbGVtZW50LXJmYy90ZXh0LzAwMDAtY3JlYXRlLWVsZW1lbnQtY2hhbmdlcy5tZFxuXG52YXIgUmVhY3QgPSB7XG4gIENoaWxkcmVuOiB7XG4gICAgbWFwOiBtYXBDaGlsZHJlbixcbiAgICBmb3JFYWNoOiBmb3JFYWNoQ2hpbGRyZW4sXG4gICAgY291bnQ6IGNvdW50Q2hpbGRyZW4sXG4gICAgdG9BcnJheTogdG9BcnJheSxcbiAgICBvbmx5OiBvbmx5Q2hpbGRcbiAgfSxcblxuICBjcmVhdGVSZWY6IGNyZWF0ZVJlZixcbiAgQ29tcG9uZW50OiBDb21wb25lbnQsXG4gIFB1cmVDb21wb25lbnQ6IFB1cmVDb21wb25lbnQsXG5cbiAgY3JlYXRlQ29udGV4dDogY3JlYXRlQ29udGV4dCxcbiAgZm9yd2FyZFJlZjogZm9yd2FyZFJlZixcbiAgbGF6eTogbGF6eSxcbiAgbWVtbzogbWVtbyxcblxuICB1c2VDYWxsYmFjazogdXNlQ2FsbGJhY2ssXG4gIHVzZUNvbnRleHQ6IHVzZUNvbnRleHQsXG4gIHVzZUVmZmVjdDogdXNlRWZmZWN0LFxuICB1c2VJbXBlcmF0aXZlSGFuZGxlOiB1c2VJbXBlcmF0aXZlSGFuZGxlLFxuICB1c2VEZWJ1Z1ZhbHVlOiB1c2VEZWJ1Z1ZhbHVlLFxuICB1c2VMYXlvdXRFZmZlY3Q6IHVzZUxheW91dEVmZmVjdCxcbiAgdXNlTWVtbzogdXNlTWVtbyxcbiAgdXNlUmVkdWNlcjogdXNlUmVkdWNlcixcbiAgdXNlUmVmOiB1c2VSZWYsXG4gIHVzZVN0YXRlOiB1c2VTdGF0ZSxcblxuICBGcmFnbWVudDogUkVBQ1RfRlJBR01FTlRfVFlQRSxcbiAgUHJvZmlsZXI6IFJFQUNUX1BST0ZJTEVSX1RZUEUsXG4gIFN0cmljdE1vZGU6IFJFQUNUX1NUUklDVF9NT0RFX1RZUEUsXG4gIFN1c3BlbnNlOiBSRUFDVF9TVVNQRU5TRV9UWVBFLFxuICB1bnN0YWJsZV9TdXNwZW5zZUxpc3Q6IFJFQUNUX1NVU1BFTlNFX0xJU1RfVFlQRSxcblxuICBjcmVhdGVFbGVtZW50OiBjcmVhdGVFbGVtZW50V2l0aFZhbGlkYXRpb24sXG4gIGNsb25lRWxlbWVudDogY2xvbmVFbGVtZW50V2l0aFZhbGlkYXRpb24sXG4gIGNyZWF0ZUZhY3Rvcnk6IGNyZWF0ZUZhY3RvcnlXaXRoVmFsaWRhdGlvbixcbiAgaXNWYWxpZEVsZW1lbnQ6IGlzVmFsaWRFbGVtZW50LFxuXG4gIHZlcnNpb246IFJlYWN0VmVyc2lvbixcblxuICB1bnN0YWJsZV93aXRoU3VzcGVuc2VDb25maWc6IHdpdGhTdXNwZW5zZUNvbmZpZyxcblxuICBfX1NFQ1JFVF9JTlRFUk5BTFNfRE9fTk9UX1VTRV9PUl9ZT1VfV0lMTF9CRV9GSVJFRDogUmVhY3RTaGFyZWRJbnRlcm5hbHNcbn07XG5cbmlmIChlbmFibGVGbGFyZUFQSSkge1xuICBSZWFjdC51bnN0YWJsZV91c2VSZXNwb25kZXIgPSB1c2VSZXNwb25kZXI7XG4gIFJlYWN0LnVuc3RhYmxlX2NyZWF0ZVJlc3BvbmRlciA9IGNyZWF0ZUV2ZW50UmVzcG9uZGVyO1xufVxuXG5pZiAoZW5hYmxlRnVuZGFtZW50YWxBUEkpIHtcbiAgUmVhY3QudW5zdGFibGVfY3JlYXRlRnVuZGFtZW50YWwgPSBjcmVhdGVGdW5kYW1lbnRhbENvbXBvbmVudDtcbn1cblxuLy8gTm90ZTogc29tZSBBUElzIGFyZSBhZGRlZCB3aXRoIGZlYXR1cmUgZmxhZ3MuXG4vLyBNYWtlIHN1cmUgdGhhdCBzdGFibGUgYnVpbGRzIGZvciBvcGVuIHNvdXJjZVxuLy8gZG9uJ3QgbW9kaWZ5IHRoZSBSZWFjdCBvYmplY3QgdG8gYXZvaWQgZGVvcHRzLlxuLy8gQWxzbyBsZXQncyBub3QgZXhwb3NlIHRoZWlyIG5hbWVzIGluIHN0YWJsZSBidWlsZHMuXG5cbmlmIChlbmFibGVKU1hUcmFuc2Zvcm1BUEkpIHtcbiAge1xuICAgIFJlYWN0LmpzeERFViA9IGpzeFdpdGhWYWxpZGF0aW9uO1xuICAgIFJlYWN0LmpzeCA9IGpzeFdpdGhWYWxpZGF0aW9uRHluYW1pYztcbiAgICBSZWFjdC5qc3hzID0ganN4V2l0aFZhbGlkYXRpb25TdGF0aWM7XG4gIH1cbn1cblxuXG5cbnZhciBSZWFjdCQyID0gT2JqZWN0LmZyZWV6ZSh7XG5cdGRlZmF1bHQ6IFJlYWN0XG59KTtcblxudmFyIFJlYWN0JDMgPSAoIFJlYWN0JDIgJiYgUmVhY3QgKSB8fCBSZWFjdCQyO1xuXG4vLyBUT0RPOiBkZWNpZGUgb24gdGhlIHRvcC1sZXZlbCBleHBvcnQgZm9ybS5cbi8vIFRoaXMgaXMgaGFja3kgYnV0IG1ha2VzIGl0IHdvcmsgd2l0aCBib3RoIFJvbGx1cCBhbmQgSmVzdC5cbnZhciByZWFjdCA9IFJlYWN0JDMuZGVmYXVsdCB8fCBSZWFjdCQzO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlYWN0O1xuICB9KSgpO1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdwcm9kdWN0aW9uJykge1xuICBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vY2pzL3JlYWN0LnByb2R1Y3Rpb24ubWluLmpzJyk7XG59IGVsc2Uge1xuICBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vY2pzL3JlYWN0LmRldmVsb3BtZW50LmpzJyk7XG59XG4iLCIvKiBlc2xpbnQtZGlzYWJsZSBuby1wYXJhbS1yZWFzc2lnbiAqL1xuaW1wb3J0IHsgbm9ybWFsaXplT3B0aW9ucyB9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHsgbG9nZ2VyIH0gZnJvbSAnLi4vaW5kZXgnO1xuXG5jb25zdCBERUZBVUxUX09QVElPTlMgPSB7IGRyb3BwaW5nOiBmYWxzZSwgc2xpZGluZzogZmFsc2UgfTtcbmNvbnN0IE5PT1AgPSAodiwgY2IpID0+IGNiKHYpO1xuXG5mdW5jdGlvbiBDU1BCdWZmZXIoc2l6ZSA9IDAsIHsgZHJvcHBpbmcsIHNsaWRpbmcgfSA9IERFRkFVTFRfT1BUSU9OUykge1xuICBjb25zdCBhcGkgPSB7XG4gICAgdmFsdWU6IFtdLFxuICAgIHB1dHM6IFtdLFxuICAgIHRha2VzOiBbXSxcbiAgICBob29rczoge1xuICAgICAgYmVmb3JlUHV0OiBOT09QLFxuICAgICAgYWZ0ZXJQdXQ6IE5PT1AsXG4gICAgICBiZWZvcmVUYWtlOiBOT09QLFxuICAgICAgYWZ0ZXJUYWtlOiBOT09QLFxuICAgIH0sXG4gICAgcGFyZW50OiBudWxsLFxuICAgIGRyb3BwaW5nLFxuICAgIHNsaWRpbmcsXG4gIH07XG5cbiAgYXBpLmJlZm9yZVB1dCA9IGhvb2sgPT4gKGFwaS5ob29rcy5iZWZvcmVQdXQgPSBob29rKTtcbiAgYXBpLmFmdGVyUHV0ID0gaG9vayA9PiAoYXBpLmhvb2tzLmFmdGVyUHV0ID0gaG9vayk7XG4gIGFwaS5iZWZvcmVUYWtlID0gaG9vayA9PiAoYXBpLmhvb2tzLmJlZm9yZVRha2UgPSBob29rKTtcbiAgYXBpLmFmdGVyVGFrZSA9IGhvb2sgPT4gKGFwaS5ob29rcy5hZnRlclRha2UgPSBob29rKTtcbiAgYXBpLmlzRW1wdHkgPSAoKSA9PiBhcGkudmFsdWUubGVuZ3RoID09PSAwO1xuICBhcGkucmVzZXQgPSAoKSA9PiB7XG4gICAgYXBpLnZhbHVlID0gW107XG4gICAgYXBpLnB1dHMgPSBbXTtcbiAgICBhcGkudGFrZXMgPSBbXTtcbiAgICBhcGkuaG9va3MgPSB7XG4gICAgICBiZWZvcmVQdXQ6IE5PT1AsXG4gICAgICBhZnRlclB1dDogTk9PUCxcbiAgICAgIGJlZm9yZVRha2U6IE5PT1AsXG4gICAgICBhZnRlclRha2U6IE5PT1AsXG4gICAgfTtcbiAgfTtcbiAgYXBpLnNldFZhbHVlID0gdiA9PiB7XG4gICAgYXBpLnZhbHVlID0gdjtcbiAgfTtcbiAgYXBpLmdldFZhbHVlID0gKCkgPT4gYXBpLnZhbHVlO1xuICBhcGkuZGVjb21wb3NlVGFrZXJzID0gKCkgPT5cbiAgICBhcGkudGFrZXMucmVkdWNlKFxuICAgICAgKHJlcywgdGFrZU9iaikgPT4ge1xuICAgICAgICByZXNbdGFrZU9iai5vcHRpb25zLnJlYWQgPyAncmVhZGVycycgOiAndGFrZXJzJ10ucHVzaCh0YWtlT2JqKTtcbiAgICAgICAgcmV0dXJuIHJlcztcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHJlYWRlcnM6IFtdLFxuICAgICAgICB0YWtlcnM6IFtdLFxuICAgICAgfVxuICAgICk7XG4gIGFwaS5jb25zdW1lVGFrZSA9ICh0YWtlT2JqLCB2YWx1ZSkgPT4ge1xuICAgIGlmICghdGFrZU9iai5vcHRpb25zLmxpc3Rlbikge1xuICAgICAgY29uc3QgaWR4ID0gYXBpLnRha2VzLmZpbmRJbmRleCh0ID0+IHQgPT09IHRha2VPYmopO1xuICAgICAgaWYgKGlkeCA+PSAwKSBhcGkudGFrZXMuc3BsaWNlKGlkeCwgMSk7XG4gICAgfVxuICAgIHRha2VPYmouY2FsbGJhY2sodmFsdWUpO1xuICB9O1xuICBhcGkuZGVsZXRlVGFrZXIgPSBjYiA9PiB7XG4gICAgY29uc3QgaWR4ID0gYXBpLnRha2VzLmZpbmRJbmRleCgoeyBjYWxsYmFjayB9KSA9PiBjYWxsYmFjayA9PT0gY2IpO1xuICAgIGlmIChpZHggPj0gMCkge1xuICAgICAgYXBpLnRha2VzLnNwbGljZShpZHgsIDEpO1xuICAgIH1cbiAgfTtcbiAgYXBpLmRlbGV0ZUxpc3RlbmVycyA9ICgpID0+IHtcbiAgICBhcGkudGFrZXMgPSBhcGkudGFrZXMuZmlsdGVyKCh7IG9wdGlvbnMgfSkgPT4gIW9wdGlvbnMubGlzdGVuKTtcbiAgfTtcblxuICBhcGkuc2V0VmFsdWUgPSB2ID0+IChhcGkudmFsdWUgPSB2KTtcblxuICBjb25zdCBwdXQgPSAoaXRlbSwgY2FsbGJhY2spID0+IHtcbiAgICBjb25zdCB7IHJlYWRlcnMsIHRha2VycyB9ID0gYXBpLmRlY29tcG9zZVRha2VycygpO1xuICAgIC8vIGNvbnNvbGUubG9nKFxuICAgIC8vICAgYHB1dD0ke2l0ZW19YCxcbiAgICAvLyAgIGByZWFkZXJzPSR7cmVhZGVycy5sZW5ndGh9YCxcbiAgICAvLyAgIGB0YWtlcnM9JHt0YWtlcnMubGVuZ3RofWAsXG4gICAgLy8gICBgdmFsdWU9JHthcGkudmFsdWUubGVuZ3RofSBzaXplPSR7c2l6ZX1gXG4gICAgLy8gKTtcblxuICAgIC8vIHJlc29sdmluZyByZWFkZXJzXG4gICAgcmVhZGVycy5mb3JFYWNoKHJlYWRlciA9PiBhcGkuY29uc3VtZVRha2UocmVhZGVyLCBpdGVtKSk7XG5cbiAgICAvLyByZXNvbHZpbmcgdGFrZXJzXG4gICAgaWYgKHRha2Vycy5sZW5ndGggPiAwKSB7XG4gICAgICBhcGkuY29uc3VtZVRha2UodGFrZXJzWzBdLCBpdGVtKTtcbiAgICAgIGNhbGxiYWNrKHRydWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoYXBpLnZhbHVlLmxlbmd0aCA8IHNpemUpIHtcbiAgICAgICAgYXBpLnZhbHVlLnB1c2goaXRlbSk7XG4gICAgICAgIGNhbGxiYWNrKHRydWUpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoZHJvcHBpbmcpIHtcbiAgICAgICAgY2FsbGJhY2soZmFsc2UpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoc2xpZGluZykge1xuICAgICAgICBhcGkudmFsdWUuc2hpZnQoKTtcbiAgICAgICAgYXBpLnZhbHVlLnB1c2goaXRlbSk7XG4gICAgICAgIGNhbGxiYWNrKHRydWUpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBhcGkucHV0cy5wdXNoKHtcbiAgICAgICAgY2FsbGJhY2s6IHYgPT4ge1xuICAgICAgICAgIGFwaS52YWx1ZS5wdXNoKGl0ZW0pO1xuICAgICAgICAgIGNhbGxiYWNrKHYgfHwgdHJ1ZSk7XG4gICAgICAgIH0sXG4gICAgICAgIGl0ZW0sXG4gICAgICB9KTtcbiAgICB9XG4gIH07XG5cbiAgY29uc3QgdGFrZSA9IChjYWxsYmFjaywgb3B0aW9ucykgPT4ge1xuICAgIC8vIGNvbnNvbGUubG9nKCd0YWtlJywgYHB1dHM9JHthcGkucHV0cy5sZW5ndGh9YCwgYHZhbHVlPSR7YXBpLnZhbHVlLmxlbmd0aH1gKTtcbiAgICBjb25zdCBzdWJzY3JpYmUgPSAoKSA9PiB7XG4gICAgICBhcGkudGFrZXMucHVzaCh7IGNhbGxiYWNrLCBvcHRpb25zIH0pO1xuICAgICAgcmV0dXJuICgpID0+IGFwaS5kZWxldGVUYWtlcihjYWxsYmFjayk7XG4gICAgfTtcbiAgICBvcHRpb25zID0gbm9ybWFsaXplT3B0aW9ucyhvcHRpb25zKTtcbiAgICBpZiAob3B0aW9ucy5saXN0ZW4pIHtcbiAgICAgIG9wdGlvbnMucmVhZCA9IHRydWU7XG4gICAgICBpZiAob3B0aW9ucy5pbml0aWFsQ2FsbCkge1xuICAgICAgICBjYWxsYmFjayhhcGkudmFsdWVbMF0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHN1YnNjcmliZSgpO1xuICAgIH1cbiAgICBpZiAob3B0aW9ucy5yZWFkKSB7XG4gICAgICBjYWxsYmFjayhhcGkudmFsdWVbMF0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoYXBpLnZhbHVlLmxlbmd0aCA9PT0gMCkge1xuICAgICAgaWYgKGFwaS5wdXRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgYXBpLnB1dHMuc2hpZnQoKS5jYWxsYmFjaygpO1xuICAgICAgICBjYWxsYmFjayhhcGkudmFsdWUuc2hpZnQoKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gc3Vic2NyaWJlKCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHYgPSBhcGkudmFsdWUuc2hpZnQoKTtcbiAgICAgIGNhbGxiYWNrKHYpO1xuICAgICAgaWYgKGFwaS52YWx1ZS5sZW5ndGggPCBzaXplICYmIGFwaS5wdXRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgYXBpLnB1dHMuc2hpZnQoKS5jYWxsYmFjaygpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gKCkgPT4ge307XG4gIH07XG5cbiAgYXBpLnB1dCA9IChpdGVtLCBjYWxsYmFjaykgPT4ge1xuICAgIGxvZ2dlci5sb2coYXBpLnBhcmVudCwgJ0NIQU5ORUxfUFVUX0lOSVRJQVRFRCcsIGl0ZW0pO1xuICAgIGFwaS5ob29rcy5iZWZvcmVQdXQoaXRlbSwgYmVmb3JlUHV0SXRlbSA9PiB7XG4gICAgICBwdXQoYmVmb3JlUHV0SXRlbSwgcHV0T3BSZXMgPT5cbiAgICAgICAgYXBpLmhvb2tzLmFmdGVyUHV0KHB1dE9wUmVzLCBhZnRlclB1dEl0ZW0gPT4ge1xuICAgICAgICAgIGxvZ2dlci5sb2coYXBpLnBhcmVudCwgJ0NIQU5ORUxfUFVUX1JFU09MVkVEJywgYWZ0ZXJQdXRJdGVtKTtcbiAgICAgICAgICBjYWxsYmFjayhhZnRlclB1dEl0ZW0pO1xuICAgICAgICB9KVxuICAgICAgKTtcbiAgICB9KTtcbiAgfTtcbiAgYXBpLnRha2UgPSAoY2FsbGJhY2ssIG9wdGlvbnMpID0+IHtcbiAgICBsZXQgdW5zdWJzY3JpYmUgPSAoKSA9PiB7fTtcbiAgICBsb2dnZXIubG9nKGFwaS5wYXJlbnQsICdDSEFOTkVMX1RBS0VfSU5JVElBVEVEJyk7XG4gICAgYXBpLmhvb2tzLmJlZm9yZVRha2UoXG4gICAgICB1bmRlZmluZWQsXG4gICAgICAoKSA9PlxuICAgICAgICAodW5zdWJzY3JpYmUgPSB0YWtlKFxuICAgICAgICAgIHRha2VPcFJlcyA9PlxuICAgICAgICAgICAgYXBpLmhvb2tzLmFmdGVyVGFrZSh0YWtlT3BSZXMsIGFmdGVyVGFrZUl0ZW0gPT4ge1xuICAgICAgICAgICAgICBsb2dnZXIubG9nKGFwaS5wYXJlbnQsICdDSEFOTkVMX1RBS0VfUkVTT0xWRUQnLCBhZnRlclRha2VJdGVtKTtcbiAgICAgICAgICAgICAgY2FsbGJhY2soYWZ0ZXJUYWtlSXRlbSk7XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICBvcHRpb25zXG4gICAgICAgICkpXG4gICAgKTtcbiAgICByZXR1cm4gKCkgPT4gdW5zdWJzY3JpYmUoKTtcbiAgfTtcblxuICByZXR1cm4gYXBpO1xufVxuXG5jb25zdCBidWZmZXIgPSB7XG4gIGZpeGVkOiAoc2l6ZSA9IDApID0+IENTUEJ1ZmZlcihzaXplLCB7IGRyb3BwaW5nOiBmYWxzZSwgc2xpZGluZzogZmFsc2UgfSksXG4gIGRyb3BwaW5nOiAoc2l6ZSA9IDEpID0+IHtcbiAgICBpZiAoc2l6ZSA8IDEpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignVGhlIGRyb3BwaW5nIGJ1ZmZlciBzaG91bGQgaGF2ZSBhdCBsZWFzdCBzaXplIG9mIG9uZS4nKTtcbiAgICB9XG4gICAgcmV0dXJuIENTUEJ1ZmZlcihzaXplLCB7IGRyb3BwaW5nOiB0cnVlLCBzbGlkaW5nOiBmYWxzZSB9KTtcbiAgfSxcbiAgc2xpZGluZzogKHNpemUgPSAxKSA9PiB7XG4gICAgaWYgKHNpemUgPCAxKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBzbGlkaW5nIGJ1ZmZlciBzaG91bGQgaGF2ZSBhdCBsZWFzdCBzaXplIG9mIG9uZS4nKTtcbiAgICB9XG4gICAgcmV0dXJuIENTUEJ1ZmZlcihzaXplLCB7IGRyb3BwaW5nOiBmYWxzZSwgc2xpZGluZzogdHJ1ZSB9KTtcbiAgfSxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGJ1ZmZlcjtcbiIsImltcG9ydCB7IGdldElkLCBzZXRQcm9wIH0gZnJvbSAnLi4vdXRpbHMnO1xuaW1wb3J0IHsgQ0hBTk5FTFMsIGxvZ2dlciwgZ3JpZCwgT1BFTiwgcmVnaXN0ZXIgfSBmcm9tICcuLi9pbmRleCc7XG5pbXBvcnQgYnVmZmVyIGZyb20gJy4vYnVmJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY2hhbihpZCwgYnVmZiwgcGFyZW50ID0gbnVsbCkge1xuICBsZXQgc3RhdGUgPSBPUEVOO1xuXG4gIGlkID0gaWQgPyBnZXRJZChpZCkgOiBnZXRJZCgnY2gnKTtcbiAgYnVmZiA9IGJ1ZmYgfHwgYnVmZmVyLmZpeGVkKCk7XG5cbiAgaWYgKENIQU5ORUxTLmV4aXN0cyhpZCkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYENoYW5uZWwgd2l0aCBpZCBcIiR7aWR9XCIgYWxyZWFkeSBleGlzdHMuYCk7XG4gIH1cblxuICBjb25zdCBjaGFubmVsID0gZnVuY3Rpb24oc3RyLCBuYW1lKSB7XG4gICAgaWYgKHN0ci5sZW5ndGggPiAxKSB7XG4gICAgICBzZXRQcm9wKGNoYW5uZWwsICduYW1lJywgc3RyWzBdICsgbmFtZSArIHN0clsxXSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNldFByb3AoY2hhbm5lbCwgJ25hbWUnLCBzdHJbMF0pO1xuICAgIH1cbiAgICBsb2dnZXIuc2V0V2hvTmFtZShjaGFubmVsLmlkLCBjaGFubmVsLm5hbWUpO1xuICAgIHJldHVybiBjaGFubmVsO1xuICB9O1xuICBjaGFubmVsLmlkID0gaWQ7XG4gIGNoYW5uZWxbJ0BjaGFubmVsJ10gPSB0cnVlO1xuICBjaGFubmVsLnBhcmVudCA9IHBhcmVudDtcbiAgY29uc3QgYXBpID0gQ0hBTk5FTFMuc2V0KGlkLCBjaGFubmVsKTtcblxuICBidWZmLnBhcmVudCA9IGFwaTtcblxuICBhcGkuaXNBY3RpdmUgPSAoKSA9PiBhcGkuc3RhdGUoKSA9PT0gT1BFTjtcbiAgYXBpLmJ1ZmYgPSBidWZmO1xuICBhcGkuc3RhdGUgPSBzID0+IHtcbiAgICBpZiAodHlwZW9mIHMgIT09ICd1bmRlZmluZWQnKSBzdGF0ZSA9IHM7XG4gICAgcmV0dXJuIHN0YXRlO1xuICB9O1xuICBhcGkudmFsdWUgPSAoKSA9PiBidWZmLmdldFZhbHVlKCk7XG4gIGFwaS5iZWZvcmVQdXQgPSBidWZmLmJlZm9yZVB1dDtcbiAgYXBpLmFmdGVyUHV0ID0gYnVmZi5hZnRlclB1dDtcbiAgYXBpLmJlZm9yZVRha2UgPSBidWZmLmJlZm9yZVRha2U7XG4gIGFwaS5hZnRlclRha2UgPSBidWZmLmFmdGVyVGFrZTtcbiAgYXBpLmV4cG9ydEFzID0ga2V5ID0+IHJlZ2lzdGVyKGtleSwgYXBpKTtcbiAgZ3JpZC5hZGQoYXBpKTtcbiAgbG9nZ2VyLmxvZyhhcGksICdDSEFOTkVMX0NSRUFURUQnLCBhcGkudmFsdWUoKSk7XG5cbiAgcmV0dXJuIGFwaTtcbn1cbiIsIi8qIGVzbGludC1kaXNhYmxlIG5vLXVzZS1iZWZvcmUtZGVmaW5lLCBuby1wYXJhbS1yZWFzc2lnbiAqL1xuaW1wb3J0IHtcbiAgT1BFTixcbiAgQ0xPU0VELFxuICBFTkRFRCxcbiAgUFVULFxuICBUQUtFLFxuICBTTEVFUCxcbiAgTk9PUCxcbiAgQ0hBTk5FTFMsXG4gIFNUT1AsXG4gIFJFQUQsXG4gIENBTExfUk9VVElORSxcbiAgRk9SS19ST1VUSU5FLFxuICBOT1RISU5HLFxuICBPTkVfT0YsXG4gIEFMTF9SRVFVSVJFRCxcbiAgZ3JpZCxcbiAgY2hhbixcbiAgdXNlLFxuICBsb2dnZXIsXG59IGZyb20gJy4uL2luZGV4JztcbmltcG9ydCB7IGlzUHJvbWlzZSwgZ2V0SWQsIGdldEZ1bmNOYW1lIH0gZnJvbSAnLi4vdXRpbHMnO1xuaW1wb3J0IHsgbm9ybWFsaXplQ2hhbm5lbHMsIG5vcm1hbGl6ZU9wdGlvbnMsIG5vcm1hbGl6ZVRvIH0gZnJvbSAnLi91dGlscyc7XG5cbmNvbnN0IG5vb3AgPSAoKSA9PiB7fTtcbmNvbnN0IG9wcyA9IHt9O1xuXG4vLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqIHB1dFxuXG5vcHMuc3B1dCA9IGZ1bmN0aW9uIHNwdXQoY2hhbm5lbHMsIGl0ZW0gPSBudWxsLCBjYWxsYmFjayA9IG5vb3ApIHtcbiAgY2hhbm5lbHMgPSBub3JtYWxpemVDaGFubmVscyhjaGFubmVscyk7XG4gIGNvbnN0IHJlc3VsdCA9IGNoYW5uZWxzLm1hcCgoKSA9PiBOT1RISU5HKTtcbiAgY29uc3Qgc2V0UmVzdWx0ID0gKGlkeCwgdmFsdWUpID0+IHtcbiAgICByZXN1bHRbaWR4XSA9IHZhbHVlO1xuICAgIGlmICghcmVzdWx0LmluY2x1ZGVzKE5PVEhJTkcpKSB7XG4gICAgICBjYWxsYmFjayhyZXN1bHQubGVuZ3RoID09PSAxID8gcmVzdWx0WzBdIDogcmVzdWx0KTtcbiAgICB9XG4gIH07XG4gIGNoYW5uZWxzLmZvckVhY2goKGNoYW5uZWwsIGlkeCkgPT4ge1xuICAgIGNvbnN0IGNoU3RhdGUgPSBjaGFubmVsLnN0YXRlKCk7XG4gICAgaWYgKGNoU3RhdGUgIT09IE9QRU4pIHtcbiAgICAgIHNldFJlc3VsdChpZHgsIGNoU3RhdGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjaGFubmVsLmJ1ZmYucHV0KGl0ZW0sIHB1dFJlc3VsdCA9PiBzZXRSZXN1bHQoaWR4LCBwdXRSZXN1bHQpKTtcbiAgICB9XG4gIH0pO1xufTtcbm9wcy5wdXQgPSBmdW5jdGlvbiBwdXQoY2hhbm5lbHMsIGl0ZW0pIHtcbiAgcmV0dXJuIHsgY2hhbm5lbHMsIG9wOiBQVVQsIGl0ZW0gfTtcbn07XG5cbi8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogdGFrZVxuXG5vcHMuc3Rha2UgPSBmdW5jdGlvbiBzdGFrZShjaGFubmVscywgY2FsbGJhY2ssIG9wdGlvbnMpIHtcbiAgY2hhbm5lbHMgPSBub3JtYWxpemVDaGFubmVscyhjaGFubmVscyk7XG4gIG9wdGlvbnMgPSBub3JtYWxpemVPcHRpb25zKG9wdGlvbnMpO1xuICBjYWxsYmFjayA9IG5vcm1hbGl6ZVRvKGNhbGxiYWNrKTtcbiAgbGV0IHVuc3Vic2NyaWJlcnM7XG4gIGlmIChvcHRpb25zLnN0cmF0ZWd5ID09PSBBTExfUkVRVUlSRUQpIHtcbiAgICBjb25zdCByZXN1bHQgPSBjaGFubmVscy5tYXAoKCkgPT4gTk9USElORyk7XG4gICAgY29uc3Qgc2V0UmVzdWx0ID0gKGlkeCwgdmFsdWUpID0+IHtcbiAgICAgIHJlc3VsdFtpZHhdID0gdmFsdWU7XG4gICAgICBpZiAoIXJlc3VsdC5pbmNsdWRlcyhOT1RISU5HKSkge1xuICAgICAgICBjYWxsYmFjayhyZXN1bHQubGVuZ3RoID09PSAxID8gcmVzdWx0WzBdIDogWy4uLnJlc3VsdF0pO1xuICAgICAgfVxuICAgIH07XG4gICAgdW5zdWJzY3JpYmVycyA9IGNoYW5uZWxzLm1hcCgoY2hhbm5lbCwgaWR4KSA9PiB7XG4gICAgICBjb25zdCBjaFN0YXRlID0gY2hhbm5lbC5zdGF0ZSgpO1xuICAgICAgaWYgKGNoU3RhdGUgPT09IEVOREVEKSB7XG4gICAgICAgIHNldFJlc3VsdChpZHgsIGNoU3RhdGUpO1xuICAgICAgfSBlbHNlIGlmIChjaFN0YXRlID09PSBDTE9TRUQgJiYgY2hhbm5lbC5idWZmLmlzRW1wdHkoKSkge1xuICAgICAgICBjaGFubmVsLnN0YXRlKEVOREVEKTtcbiAgICAgICAgc2V0UmVzdWx0KGlkeCwgRU5ERUQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGNoYW5uZWwuYnVmZi50YWtlKFxuICAgICAgICAgIHRha2VSZXN1bHQgPT4gc2V0UmVzdWx0KGlkeCwgdGFrZVJlc3VsdCksXG4gICAgICAgICAgb3B0aW9uc1xuICAgICAgICApO1xuICAgICAgfVxuICAgIH0pO1xuICB9IGVsc2UgaWYgKG9wdGlvbnMuc3RyYXRlZ3kgPT09IE9ORV9PRikge1xuICAgIGNvbnN0IGRvbmUgPSAoLi4udGFrZVJlc3VsdCkgPT4ge1xuICAgICAgLy8gVGhpcyBmdW5jdGlvbiBpcyBoZXJlIHRvIGNsZWFuIHVwIHRoZSB1bnJlc29sdmVkIGJ1ZmZlciByZWFkZXJzLlxuICAgICAgLy8gSW4gdGhlIE9ORV9PRiBzdHJhdGVneSB0aGVyZSBhcmUgcGVuZGluZyByZWFkZXJzIHRoYXQgc2hvdWxkIGJlXG4gICAgICAvLyBraWxsZWQgc2luY2Ugb25lIG9mIHRoZSBvdGhlcnMgaW4gdGhlIGxpc3QgaXMgY2FsbGVkLiBBbmQgdGhpc1xuICAgICAgLy8gc2hvdWxkIGhhcHBlbiBvbmx5IGlmIHdlIGFyZSBub3QgbGlzdGVuaW5nLlxuICAgICAgaWYgKCFvcHRpb25zLmxpc3Rlbikge1xuICAgICAgICB1bnN1YnNjcmliZXJzLmZpbHRlcihmID0+IGYpLmZvckVhY2goZiA9PiBmKCkpO1xuICAgICAgfVxuICAgICAgY2FsbGJhY2soLi4udGFrZVJlc3VsdCk7XG4gICAgfTtcbiAgICB1bnN1YnNjcmliZXJzID0gY2hhbm5lbHMubWFwKChjaGFubmVsLCBpZHgpID0+IHtcbiAgICAgIGNvbnN0IGNoU3RhdGUgPSBjaGFubmVsLnN0YXRlKCk7XG4gICAgICBpZiAoY2hTdGF0ZSA9PT0gRU5ERUQpIHtcbiAgICAgICAgZG9uZShjaFN0YXRlLCBpZHgpO1xuICAgICAgfSBlbHNlIGlmIChjaFN0YXRlID09PSBDTE9TRUQgJiYgY2hhbm5lbC5idWZmLmlzRW1wdHkoKSkge1xuICAgICAgICBjaGFubmVsLnN0YXRlKEVOREVEKTtcbiAgICAgICAgZG9uZShFTkRFRCwgaWR4KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBjaGFubmVsLmJ1ZmYudGFrZSh0YWtlUmVzdWx0ID0+IGRvbmUodGFrZVJlc3VsdCwgaWR4KSwgb3B0aW9ucyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBVbnJlY29nbml6ZWQgc3RyYXRlZ3kgXCIke29wdGlvbnMuc3RyYXRlZ3l9XCJgKTtcbiAgfVxuICByZXR1cm4gZnVuY3Rpb24gdW5zdWJzY3JpYmUoKSB7XG4gICAgdW5zdWJzY3JpYmVycy5maWx0ZXIoZiA9PiBmKS5mb3JFYWNoKGYgPT4gZigpKTtcbiAgfTtcbn07XG5vcHMudGFrZSA9IGZ1bmN0aW9uIHRha2UoY2hhbm5lbHMsIG9wdGlvbnMpIHtcbiAgcmV0dXJuIHsgY2hhbm5lbHMsIG9wOiBUQUtFLCBvcHRpb25zIH07XG59O1xuXG4vLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqIHJlYWRcblxub3BzLnJlYWQgPSBmdW5jdGlvbiByZWFkKGNoYW5uZWxzLCBvcHRpb25zKSB7XG4gIHJldHVybiB7IGNoYW5uZWxzLCBvcDogUkVBRCwgb3B0aW9uczogeyAuLi5vcHRpb25zLCByZWFkOiB0cnVlIH0gfTtcbn07XG5vcHMuc3JlYWQgPSBmdW5jdGlvbiBzcmVhZChjaGFubmVscywgdG8sIG9wdGlvbnMpIHtcbiAgcmV0dXJuIG9wcy5zdGFrZShjaGFubmVscywgdG8sIHsgLi4ub3B0aW9ucywgcmVhZDogdHJ1ZSB9KTtcbn07XG5vcHMudW5zdWJBbGwgPSBmdW5jdGlvbiB1bnN1YkFsbChjaGFubmVsKSB7XG4gIGNoYW5uZWwuYnVmZi5kZWxldGVMaXN0ZW5lcnMoKTtcbn07XG5cbi8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogbGlzdGVuXG5cbm9wcy5saXN0ZW4gPSBmdW5jdGlvbiBsaXN0ZW4oY2hhbm5lbHMsIHRvLCBvcHRpb25zKSB7XG4gIHJldHVybiBvcHMuc3Rha2UoY2hhbm5lbHMsIHRvLCB7IC4uLm9wdGlvbnMsIGxpc3RlbjogdHJ1ZSB9KTtcbn07XG5cbi8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogY2xvc2UsIHJlc2V0LCBjYWxsLCBmb3JrLCBtZXJnZSwgdGltZW91dCwgaXNDaGFubmVsXG5cbm9wcy5jbG9zZSA9IGZ1bmN0aW9uIGNsb3NlKGNoYW5uZWxzKSB7XG4gIGNoYW5uZWxzID0gbm9ybWFsaXplQ2hhbm5lbHMoY2hhbm5lbHMpO1xuICBjaGFubmVscy5mb3JFYWNoKGNoID0+IHtcbiAgICBjb25zdCBuZXdTdGF0ZSA9IGNoLmJ1ZmYuaXNFbXB0eSgpID8gRU5ERUQgOiBDTE9TRUQ7XG4gICAgY2guc3RhdGUobmV3U3RhdGUpO1xuICAgIGNoLmJ1ZmYucHV0cy5mb3JFYWNoKHAgPT4gcC5jYWxsYmFjayhuZXdTdGF0ZSkpO1xuICAgIGNoLmJ1ZmYuZGVsZXRlTGlzdGVuZXJzKCk7XG4gICAgY2guYnVmZi50YWtlcy5mb3JFYWNoKHQgPT4gdC5jYWxsYmFjayhuZXdTdGF0ZSkpO1xuICAgIGdyaWQucmVtb3ZlKGNoKTtcbiAgICBDSEFOTkVMUy5kZWwoY2guaWQpO1xuICAgIGxvZ2dlci5sb2coY2gsICdDSEFOTkVMX0NMT1NFRCcpO1xuICB9KTtcbiAgcmV0dXJuIHsgb3A6IE5PT1AgfTtcbn07XG5vcHMuc2Nsb3NlID0gZnVuY3Rpb24gc2Nsb3NlKGlkKSB7XG4gIHJldHVybiBvcHMuY2xvc2UoaWQpO1xufTtcbm9wcy5jaGFubmVsUmVzZXQgPSBmdW5jdGlvbiBjaGFubmVsUmVzZXQoY2hhbm5lbHMpIHtcbiAgY2hhbm5lbHMgPSBub3JtYWxpemVDaGFubmVscyhjaGFubmVscyk7XG4gIGNoYW5uZWxzLmZvckVhY2goY2ggPT4ge1xuICAgIGNoLnN0YXRlKE9QRU4pO1xuICAgIGNoLmJ1ZmYucmVzZXQoKTtcbiAgICBsb2dnZXIubG9nKGNoLCAnQ0hBTk5FTF9SRVNFVCcpO1xuICB9KTtcbiAgcmV0dXJuIHsgb3A6IE5PT1AgfTtcbn07XG5vcHMuc2NoYW5uZWxSZXNldCA9IGZ1bmN0aW9uIHNjaGFubmVsUmVzZXQoaWQpIHtcbiAgb3BzLmNoYW5uZWxSZXNldChpZCk7XG59O1xub3BzLmNhbGwgPSBmdW5jdGlvbiBjYWxsKHJvdXRpbmUsIC4uLmFyZ3MpIHtcbiAgcmV0dXJuIHsgb3A6IENBTExfUk9VVElORSwgcm91dGluZSwgYXJncyB9O1xufTtcbm9wcy5mb3JrID0gZnVuY3Rpb24gZm9yayhyb3V0aW5lLCAuLi5hcmdzKSB7XG4gIHJldHVybiB7IG9wOiBGT1JLX1JPVVRJTkUsIHJvdXRpbmUsIGFyZ3MgfTtcbn07XG5vcHMubWVyZ2UgPSBmdW5jdGlvbiBtZXJnZSguLi5jaGFubmVscykge1xuICBjb25zdCBuZXdDaCA9IGNoYW4oKTtcblxuICBjaGFubmVscy5mb3JFYWNoKGNoID0+IHtcbiAgICAoZnVuY3Rpb24gdGFrZXIoKSB7XG4gICAgICBvcHMuc3Rha2UoY2gsIHYgPT4ge1xuICAgICAgICBpZiAodiAhPT0gQ0xPU0VEICYmIHYgIT09IEVOREVEICYmIG5ld0NoLnN0YXRlKCkgPT09IE9QRU4pIHtcbiAgICAgICAgICBvcHMuc3B1dChuZXdDaCwgdiwgdGFrZXIpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KSgpO1xuICB9KTtcbiAgcmV0dXJuIG5ld0NoO1xufTtcbm9wcy50aW1lb3V0ID0gZnVuY3Rpb24gdGltZW91dChpbnRlcnZhbCkge1xuICBjb25zdCBjaCA9IGNoYW4oKTtcbiAgc2V0VGltZW91dCgoKSA9PiBvcHMuY2xvc2UoY2gpLCBpbnRlcnZhbCk7XG4gIHJldHVybiBjaDtcbn07XG5vcHMuaXNDaGFubmVsID0gY2ggPT4gY2ggJiYgY2hbJ0BjaGFubmVsJ10gPT09IHRydWU7XG5vcHMuaXNSaWV3ID0gciA9PiByICYmIHJbJ0ByaWV3J10gPT09IHRydWU7XG5vcHMuaXNTdGF0ZSA9IHMgPT4gcyAmJiBzWydAc3RhdGUnXSA9PT0gdHJ1ZTtcbm9wcy5pc1JvdXRpbmUgPSByID0+IHIgJiYgclsnQHJvdXRpbmUnXSA9PT0gdHJ1ZTtcbm9wcy52ZXJpZnlDaGFubmVsID0gZnVuY3Rpb24gdmVyaWZ5Q2hhbm5lbChjaCwgdGhyb3dFcnJvciA9IHRydWUpIHtcbiAgaWYgKG9wcy5pc0NoYW5uZWwoY2gpKSByZXR1cm4gY2g7XG4gIGlmICh0aHJvd0Vycm9yKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgYCR7Y2h9JHtcbiAgICAgICAgdHlwZW9mIGNoICE9PSAndW5kZWZpbmVkJyA/IGAgKCR7dHlwZW9mIGNofSlgIDogJydcbiAgICAgIH0gaXMgbm90IGEgY2hhbm5lbC4ke1xuICAgICAgICB0eXBlb2YgY2ggPT09ICdzdHJpbmcnXG4gICAgICAgICAgPyBgIERpZCB5b3UgZm9yZ2V0IHRvIGRlZmluZSBpdD9cXG5FeGFtcGxlOiBjaGFuKFwiJHtjaH1cIilgXG4gICAgICAgICAgOiAnJ1xuICAgICAgfWBcbiAgICApO1xuICB9XG4gIHJldHVybiBudWxsO1xufTtcblxuLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiBnby9yb3V0aW5lXG5cbm9wcy5nbyA9IGZ1bmN0aW9uIGdvKGZ1bmMsIGRvbmUgPSAoKSA9PiB7fSwgYXJncyA9IFtdLCBwYXJlbnQgPSBudWxsKSB7XG4gIGNvbnN0IFJVTk5JTkcgPSAnUlVOTklORyc7XG4gIGNvbnN0IFNUT1BQRUQgPSAnU1RPUFBFRCc7XG4gIGxldCBzdGF0ZSA9IFJVTk5JTkc7XG4gIGNvbnN0IG5hbWUgPSBnZXRGdW5jTmFtZShmdW5jKTtcblxuICBjb25zdCBhcGkgPSB7XG4gICAgaWQ6IGdldElkKGByb3V0aW5lXyR7bmFtZX1gKSxcbiAgICAnQHJvdXRpbmUnOiB0cnVlLFxuICAgIHBhcmVudCxcbiAgICBuYW1lLFxuICAgIGNoaWxkcmVuOiBbXSxcbiAgICBzdG9wKCkge1xuICAgICAgc3RhdGUgPSBTVE9QUEVEO1xuICAgICAgdGhpcy5jaGlsZHJlbi5mb3JFYWNoKHIgPT4gci5zdG9wKCkpO1xuICAgICAgZ3JpZC5yZW1vdmUoYXBpKTtcbiAgICAgIGxvZ2dlci5sb2coYXBpLCAnUk9VVElORV9TVE9QUEVEJyk7XG4gICAgfSxcbiAgICByZXJ1bigpIHtcbiAgICAgIGdlbiA9IGZ1bmMoLi4uYXJncyk7XG4gICAgICBuZXh0KCk7XG4gICAgICBsb2dnZXIubG9nKHRoaXMsICdST1VUSU5FX1JFUlVOJyk7XG4gICAgfSxcbiAgfTtcbiAgY29uc3QgYWRkU3ViUm91dGluZSA9IHIgPT4gYXBpLmNoaWxkcmVuLnB1c2gocik7XG5cbiAgbG9nZ2VyLmxvZyhhcGksICdST1VUSU5FX1NUQVJURUQnKTtcbiAgbGV0IGdlbiA9IGZ1bmMoLi4uYXJncyk7XG5cbiAgZnVuY3Rpb24gcHJvY2Vzc0dlbmVyYXRvclN0ZXAoaSkge1xuICAgIHN3aXRjaCAoaS52YWx1ZS5vcCkge1xuICAgICAgY2FzZSBQVVQ6XG4gICAgICAgIG9wcy5zcHV0KGkudmFsdWUuY2hhbm5lbHMsIGkudmFsdWUuaXRlbSwgbmV4dCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBUQUtFOlxuICAgICAgICBvcHMuc3Rha2UoXG4gICAgICAgICAgaS52YWx1ZS5jaGFubmVscyxcbiAgICAgICAgICAoLi4ubmV4dEFyZ3MpID0+IHtcbiAgICAgICAgICAgIG5leHQobmV4dEFyZ3MubGVuZ3RoID09PSAxID8gbmV4dEFyZ3NbMF0gOiBuZXh0QXJncyk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBpLnZhbHVlLm9wdGlvbnNcbiAgICAgICAgKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIE5PT1A6XG4gICAgICAgIG5leHQoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFNMRUVQOlxuICAgICAgICBzZXRUaW1lb3V0KG5leHQsIGkudmFsdWUubXMpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgU1RPUDpcbiAgICAgICAgYXBpLnN0b3AoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFJFQUQ6XG4gICAgICAgIG9wcy5zcmVhZChpLnZhbHVlLmNoYW5uZWxzLCBuZXh0LCBpLnZhbHVlLm9wdGlvbnMpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgQ0FMTF9ST1VUSU5FOlxuICAgICAgICBhZGRTdWJSb3V0aW5lKG9wcy5nbyhpLnZhbHVlLnJvdXRpbmUsIG5leHQsIGkudmFsdWUuYXJncywgYXBpLmlkKSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBGT1JLX1JPVVRJTkU6XG4gICAgICAgIGFkZFN1YlJvdXRpbmUob3BzLmdvKGkudmFsdWUucm91dGluZSwgKCkgPT4ge30sIGkudmFsdWUuYXJncywgYXBpLmlkKSk7XG4gICAgICAgIG5leHQoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFVucmVjb2duaXplZCBvcGVyYXRpb24gJHtpLnZhbHVlLm9wfSBmb3IgYSByb3V0aW5lLmApO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIG5leHQodmFsdWUpIHtcbiAgICBpZiAoc3RhdGUgPT09IFNUT1BQRUQpIHJldHVybjtcbiAgICBjb25zdCBzdGVwID0gZ2VuLm5leHQodmFsdWUpO1xuICAgIGlmIChzdGVwLmRvbmUgPT09IHRydWUpIHtcbiAgICAgIGlmIChkb25lKSBkb25lKHN0ZXAudmFsdWUpO1xuICAgICAgaWYgKHN0ZXAudmFsdWUgJiYgc3RlcC52YWx1ZVsnQGdvJ10gPT09IHRydWUpIHtcbiAgICAgICAgYXBpLnJlcnVuKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBncmlkLnJlbW92ZShhcGkpO1xuICAgICAgICBsb2dnZXIubG9nKGFwaSwgJ1JPVVRJTkVfRU5EJyk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChpc1Byb21pc2Uoc3RlcC52YWx1ZSkpIHtcbiAgICAgIGxvZ2dlci5sb2coYXBpLCAnUk9VVElORV9BU1lOQ19CRUdJTicpO1xuICAgICAgc3RlcC52YWx1ZVxuICAgICAgICAudGhlbigoLi4uYXN5bmNSZXN1bHQpID0+IHtcbiAgICAgICAgICBsb2dnZXIubG9nKGFwaSwgJ1JPVVRJTkVfQVNZTkNfRU5EJyk7XG4gICAgICAgICAgbmV4dCguLi5hc3luY1Jlc3VsdCk7XG4gICAgICAgIH0pXG4gICAgICAgIC5jYXRjaChlcnIgPT4ge1xuICAgICAgICAgIGxvZ2dlci5sb2coYXBpLCAnUk9VVElORV9BU1lOQ19FUlJPUicsIGVycik7XG4gICAgICAgICAgcHJvY2Vzc0dlbmVyYXRvclN0ZXAoZ2VuLnRocm93KGVycikpO1xuICAgICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcHJvY2Vzc0dlbmVyYXRvclN0ZXAoc3RlcCk7XG4gICAgfVxuICB9XG5cbiAgZ3JpZC5hZGQoYXBpKTtcbiAgbmV4dCgpO1xuXG4gIHJldHVybiBhcGk7XG59O1xub3BzLmdvWydAZ28nXSA9IHRydWU7XG5vcHMuZ28ud2l0aCA9ICguLi5tYXBzKSA9PiB7XG4gIGNvbnN0IHJlZHVjZWRNYXBzID0gbWFwcy5yZWR1Y2UoKHJlcywgaXRlbSkgPT4ge1xuICAgIGlmICh0eXBlb2YgaXRlbSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHJlcyA9IHsgLi4ucmVzLCBbaXRlbV06IHVzZShpdGVtKSB9O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXMgPSB7IC4uLnJlcywgLi4uaXRlbSB9O1xuICAgIH1cbiAgICByZXR1cm4gcmVzO1xuICB9LCB7fSk7XG4gIHJldHVybiAoZnVuYywgZG9uZSA9ICgpID0+IHt9LCAuLi5hcmdzKSA9PiB7XG4gICAgYXJncy5wdXNoKHJlZHVjZWRNYXBzKTtcbiAgICByZXR1cm4gb3BzLmdvKGZ1bmMsIGRvbmUsIGFyZ3MpO1xuICB9O1xufTtcblxub3BzLnNsZWVwID0gZnVuY3Rpb24gc2xlZXAobXMsIGNhbGxiYWNrKSB7XG4gIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09ICdmdW5jdGlvbicpIHtcbiAgICBzZXRUaW1lb3V0KGNhbGxiYWNrLCBtcyk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHsgb3A6IFNMRUVQLCBtcyB9O1xuICB9XG59O1xuXG5vcHMuc3RvcCA9IGZ1bmN0aW9uIHN0b3AoKSB7XG4gIHJldHVybiB7IG9wOiBTVE9QIH07XG59O1xuXG5leHBvcnQgZGVmYXVsdCBvcHM7XG4iLCJpbXBvcnQgeyBnbywgc3B1dCwgc2Nsb3NlLCBncmlkLCBsb2dnZXIsIGNoYW4sIGJ1ZmZlciB9IGZyb20gJy4uL2luZGV4JztcbmltcG9ydCB7IGdldElkLCBpc0dlbmVyYXRvckZ1bmN0aW9uLCBzZXRQcm9wIH0gZnJvbSAnLi4vdXRpbHMnO1xuXG5jb25zdCBERUZBVUxUX1NFTEVDVE9SID0gdiA9PiB2O1xuY29uc3QgREVGQVVMVF9SRURVQ0VSID0gKF8sIHYpID0+IHY7XG5jb25zdCBERUZBVUxUX0VSUk9SID0gZSA9PiB7XG4gIHRocm93IGU7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBzdGF0ZShpbml0aWFsVmFsdWUsIHBhcmVudCA9IG51bGwpIHtcbiAgbGV0IHZhbHVlID0gaW5pdGlhbFZhbHVlO1xuICBjb25zdCBpZCA9IGdldElkKCdzdGF0ZScpO1xuICBjb25zdCBjaGlsZHJlbiA9IFtdO1xuXG4gIGZ1bmN0aW9uIHN5bmNDaGlsZHJlbihpbml0aWF0b3IpIHtcbiAgICBjaGlsZHJlbi5mb3JFYWNoKGMgPT4ge1xuICAgICAgaWYgKGMuaWQgIT09IGluaXRpYXRvci5pZCkge1xuICAgICAgICBzcHV0KGMsIHsgdmFsdWUsIHN5bmNpbmc6IHRydWUgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBjb25zdCBhcGkgPSBmdW5jdGlvbihzdHIsIG5hbWUpIHtcbiAgICBpZiAoc3RyLmxlbmd0aCA+IDEpIHtcbiAgICAgIHNldFByb3AoYXBpLCAnbmFtZScsIHN0clswXSArIG5hbWUgKyBzdHJbMV0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBzZXRQcm9wKGFwaSwgJ25hbWUnLCBzdHJbMF0pO1xuICAgIH1cbiAgICBsb2dnZXIuc2V0V2hvTmFtZShhcGkuaWQsIGFwaS5uYW1lKTtcbiAgICByZXR1cm4gYXBpO1xuICB9O1xuXG4gIHNldFByb3AoYXBpLCAnbmFtZScsICdzdGF0ZScpO1xuXG4gIGFwaS5pZCA9IGlkO1xuICBhcGlbJ0BzdGF0ZSddID0gdHJ1ZTtcbiAgYXBpLnBhcmVudCA9IHBhcmVudDtcbiAgYXBpLmNoaWxkcmVuID0gKCkgPT4gY2hpbGRyZW47XG4gIGFwaS5jaGFuID0gKFxuICAgIHNlbGVjdG9yID0gREVGQVVMVF9TRUxFQ1RPUixcbiAgICByZWR1Y2VyID0gREVGQVVMVF9SRURVQ0VSLFxuICAgIG9uRXJyb3IgPSBERUZBVUxUX0VSUk9SXG4gICkgPT4ge1xuICAgIGNvbnN0IGJ1ZmYgPSBidWZmZXIuc2xpZGluZygxKTtcbiAgICBidWZmLnNldFZhbHVlKFt2YWx1ZV0pO1xuICAgIGNvbnN0IGNoID0gY2hhbignc2xpZGluZycsIGJ1ZmYsIGlkKTtcbiAgICBjaC5hZnRlclRha2UoKGl0ZW0sIGNiKSA9PiB7XG4gICAgICB0cnkge1xuICAgICAgICBpZiAoaXNHZW5lcmF0b3JGdW5jdGlvbihzZWxlY3RvcikpIHtcbiAgICAgICAgICBnbyhzZWxlY3Rvciwgcm91dGluZVJlcyA9PiBjYihyb3V0aW5lUmVzKSwgW2l0ZW1dLCBpZCk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNiKHNlbGVjdG9yKGl0ZW0pKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgb25FcnJvcihlKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBjaC5iZWZvcmVQdXQoKHBheWxvYWQsIGNiKSA9PiB7XG4gICAgICBpZiAoXG4gICAgICAgIHBheWxvYWQgIT09IG51bGwgJiZcbiAgICAgICAgdHlwZW9mIHBheWxvYWQgPT09ICdvYmplY3QnICYmXG4gICAgICAgICdzeW5jaW5nJyBpbiBwYXlsb2FkICYmXG4gICAgICAgIHBheWxvYWQuc3luY2luZ1xuICAgICAgKSB7XG4gICAgICAgIGNiKHBheWxvYWQudmFsdWUpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB0cnkge1xuICAgICAgICBpZiAoaXNHZW5lcmF0b3JGdW5jdGlvbihyZWR1Y2VyKSkge1xuICAgICAgICAgIGdvKFxuICAgICAgICAgICAgcmVkdWNlcixcbiAgICAgICAgICAgIGdlblJlc3VsdCA9PiB7XG4gICAgICAgICAgICAgIHZhbHVlID0gZ2VuUmVzdWx0O1xuICAgICAgICAgICAgICBzeW5jQ2hpbGRyZW4oY2gpO1xuICAgICAgICAgICAgICBjYih2YWx1ZSk7XG4gICAgICAgICAgICAgIGxvZ2dlci5sb2coYXBpLCAnU1RBVEVfVkFMVUVfU0VUJywgdmFsdWUpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFt2YWx1ZSwgcGF5bG9hZF0sXG4gICAgICAgICAgICBpZFxuICAgICAgICAgICk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZhbHVlID0gcmVkdWNlcih2YWx1ZSwgcGF5bG9hZCk7XG4gICAgICAgIHN5bmNDaGlsZHJlbihjaCk7XG4gICAgICAgIGNiKHZhbHVlKTtcbiAgICAgICAgbG9nZ2VyLmxvZyhhcGksICdTVEFURV9WQUxVRV9TRVQnLCB2YWx1ZSk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIG9uRXJyb3IoZSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgY2hpbGRyZW4ucHVzaChjaCk7XG4gICAgcmV0dXJuIGNoO1xuICB9O1xuICBhcGkuc2VsZWN0ID0gKHNlbGVjdG9yLCBvbkVycm9yKSA9PlxuICAgIGFwaS5jaGFuKHNlbGVjdG9yLCBERUZBVUxUX1JFRFVDRVIsIG9uRXJyb3IpO1xuICBhcGkubXV0YXRlID0gKHJlZHVjZXIsIG9uRXJyb3IpID0+XG4gICAgYXBpLmNoYW4oREVGQVVMVF9TRUxFQ1RPUiwgcmVkdWNlciwgb25FcnJvcik7XG4gIGFwaS5kZXN0cm95ID0gKCkgPT4ge1xuICAgIGNoaWxkcmVuLmZvckVhY2goY2ggPT4gc2Nsb3NlKGNoKSk7XG4gICAgdmFsdWUgPSB1bmRlZmluZWQ7XG4gICAgZ3JpZC5yZW1vdmUoYXBpKTtcbiAgICBsb2dnZXIubG9nKGFwaSwgJ1NUQVRFX0RFU1RST1lFRCcpO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuICBhcGkuZ2V0ID0gKCkgPT4gdmFsdWU7XG4gIGFwaS5zZXQgPSBuZXdWYWx1ZSA9PiB7XG4gICAgdmFsdWUgPSBuZXdWYWx1ZTtcbiAgICBzeW5jQ2hpbGRyZW4oe30pO1xuICAgIGxvZ2dlci5sb2coYXBpLCAnU1RBVEVfVkFMVUVfU0VUJywgbmV3VmFsdWUpO1xuICAgIHJldHVybiBuZXdWYWx1ZTtcbiAgfTtcblxuICBsb2dnZXIubG9nKGFwaSwgJ1NUQVRFX0NSRUFURUQnLCB2YWx1ZSk7XG5cbiAgYXBpLkRFRkFVTFQgPSBhcGkuY2hhbigpYGRlZmF1bHRgO1xuXG4gIGdyaWQuYWRkKGFwaSk7XG5cbiAgcmV0dXJuIGFwaTtcbn1cbiIsIi8qIGVzbGludC1kaXNhYmxlIG5vLXBhcmFtLXJlYXNzaWduLCBuby1tdWx0aS1hc3NpZ24gKi9cbmltcG9ydCB7XG4gIEFMTF9SRVFVSVJFRCxcbiAgaXNDaGFubmVsLFxuICBpc1N0YXRlLFxuICBzcHV0LFxuICB2ZXJpZnlDaGFubmVsLFxufSBmcm9tICcuLi9pbmRleCc7XG5cbmV4cG9ydCBmdW5jdGlvbiBub3JtYWxpemVDaGFubmVscyhjaGFubmVscykge1xuICBpZiAoIUFycmF5LmlzQXJyYXkoY2hhbm5lbHMpKSBjaGFubmVscyA9IFtjaGFubmVsc107XG4gIHJldHVybiBjaGFubmVscy5tYXAoY2ggPT4ge1xuICAgIGlmIChpc1N0YXRlKGNoKSkgcmV0dXJuIGNoLkRFRkFVTFQ7XG4gICAgcmV0dXJuIHZlcmlmeUNoYW5uZWwoY2gpO1xuICB9KTtcbn1cblxuY29uc3QgREVGQVVMVF9PUFRJT05TID0ge1xuICBvbkVycm9yOiBudWxsLFxuICBpbml0aWFsQ2FsbDogZmFsc2UsXG59O1xuXG5leHBvcnQgZnVuY3Rpb24gbm9ybWFsaXplVG8odG8pIHtcbiAgaWYgKGlzQ2hhbm5lbCh0bykpIHtcbiAgICByZXR1cm4gdiA9PiBzcHV0KHRvLCB2KTtcbiAgfVxuICBpZiAodHlwZW9mIHRvID09PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuIHRvO1xuICB9XG4gIHRocm93IG5ldyBFcnJvcihcbiAgICBgJHt0b30ke1xuICAgICAgdHlwZW9mIHRvICE9PSAndW5kZWZpbmVkJyA/IGAgKCR7dHlwZW9mIHRvfSlgIDogJydcbiAgICB9IGlzIG5vdCBhIGNoYW5uZWwuJHtcbiAgICAgIHR5cGVvZiBjaCA9PT0gJ3N0cmluZydcbiAgICAgICAgPyBgIERpZCB5b3UgZm9yZ2V0IHRvIGRlZmluZSBpdD9cXG5FeGFtcGxlOiBjaGFuKFwiJHt0b31cIilgXG4gICAgICAgIDogJydcbiAgICB9YFxuICApO1xufVxuZXhwb3J0IGZ1bmN0aW9uIG5vcm1hbGl6ZU9wdGlvbnMob3B0aW9ucykge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCBERUZBVUxUX09QVElPTlM7XG4gIGNvbnN0IG9uRXJyb3IgPSBvcHRpb25zLm9uRXJyb3IgfHwgREVGQVVMVF9PUFRJT05TLm9uRXJyb3I7XG4gIGNvbnN0IHN0cmF0ZWd5ID0gb3B0aW9ucy5zdHJhdGVneSB8fCBBTExfUkVRVUlSRUQ7XG4gIGNvbnN0IGxpc3RlbiA9ICdsaXN0ZW4nIGluIG9wdGlvbnMgPyBvcHRpb25zLmxpc3RlbiA6IGZhbHNlO1xuICBjb25zdCByZWFkID0gJ3JlYWQnIGluIG9wdGlvbnMgPyBvcHRpb25zLnJlYWQgOiBmYWxzZTtcbiAgY29uc3QgaW5pdGlhbENhbGwgPVxuICAgICdpbml0aWFsQ2FsbCcgaW4gb3B0aW9uc1xuICAgICAgPyBvcHRpb25zLmluaXRpYWxDYWxsXG4gICAgICA6IERFRkFVTFRfT1BUSU9OUy5pbml0aWFsQ2FsbDtcblxuICByZXR1cm4ge1xuICAgIG9uRXJyb3IsXG4gICAgc3RyYXRlZ3ksXG4gICAgaW5pdGlhbENhbGwsXG4gICAgbGlzdGVuLFxuICAgIHJlYWQsXG4gICAgdXNlclRha2VDYWxsYmFjazogb3B0aW9ucy51c2VyVGFrZUNhbGxiYWNrLFxuICB9O1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gR3JpZCgpIHtcbiAgY29uc3QgZ3JpZEFQSSA9IHt9O1xuICBsZXQgbm9kZXMgPSBbXTtcblxuICBncmlkQVBJLmFkZCA9IHByb2R1Y3QgPT4ge1xuICAgIGlmICghcHJvZHVjdCB8fCAhcHJvZHVjdC5pZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICBgRWFjaCBub2RlIGluIHRoZSBncmlkIG11c3QgYmUgYW4gb2JqZWN0IHdpdGggXCJpZFwiIGZpZWxkLiBJbnN0ZWFkIFwiJHtwcm9kdWN0fVwiIGdpdmVuLmBcbiAgICAgICk7XG4gICAgfVxuICAgIG5vZGVzLnB1c2gocHJvZHVjdCk7XG4gIH07XG4gIGdyaWRBUEkucmVtb3ZlID0gcHJvZHVjdCA9PiB7XG4gICAgY29uc3QgaWR4ID0gbm9kZXMuZmluZEluZGV4KCh7IGlkIH0pID0+IGlkID09PSBwcm9kdWN0LmlkKTtcblxuICAgIGlmIChpZHggPj0gMCkge1xuICAgICAgLy8gc3BsaWNlIGJlY2F1c2Ugb2YgaHR0cHM6Ly9rcmFzaW1pcnRzb25ldi5jb20vYmxvZy9hcnRpY2xlL2ZvcmVhY2gtb3Itbm90LXRvLWZvcmVhY2hcbiAgICAgIG5vZGVzLnNwbGljZShpZHgsIDEpO1xuICAgIH1cbiAgfTtcbiAgZ3JpZEFQSS5yZXNldCA9ICgpID0+IHtcbiAgICBub2RlcyA9IFtdO1xuICB9O1xuICBncmlkQVBJLm5vZGVzID0gKCkgPT4gbm9kZXM7XG4gIGdyaWRBUEkuZ2V0Tm9kZUJ5SWQgPSBub2RlSWQgPT4gbm9kZXMuZmluZCgoeyBpZCB9KSA9PiBpZCA9PT0gbm9kZUlkKTtcblxuICByZXR1cm4gZ3JpZEFQSTtcbn1cbiIsImltcG9ydCBSIGZyb20gJy4vcmVnaXN0cnknO1xuaW1wb3J0IEdyaWQgZnJvbSAnLi9ncmlkJztcbmltcG9ydCBMb2dnZXIgZnJvbSAnLi9sb2dnZXInO1xuaW1wb3J0IHsgcmVzZXRJZHMgfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCByZWFjdFJpZXcgZnJvbSAnLi9yZWFjdCc7XG5pbXBvcnQgYiBmcm9tICcuL2NzcC9idWYnO1xuaW1wb3J0IGMgZnJvbSAnLi9jc3AvY2hhbm5lbCc7XG5pbXBvcnQgb3BzIGZyb20gJy4vY3NwL29wcyc7XG5pbXBvcnQgcyBmcm9tICcuL2NzcC9zdGF0ZSc7XG5pbXBvcnQgaW5zcCBmcm9tICcuL2luc3BlY3Rvcic7XG5cbmV4cG9ydCBjb25zdCBPUEVOID0gU3ltYm9sKCdPUEVOJyk7XG5leHBvcnQgY29uc3QgQ0xPU0VEID0gU3ltYm9sKCdDTE9TRUQnKTtcbmV4cG9ydCBjb25zdCBFTkRFRCA9IFN5bWJvbCgnRU5ERUQnKTtcbmV4cG9ydCBjb25zdCBQVVQgPSAnUFVUJztcbmV4cG9ydCBjb25zdCBUQUtFID0gJ1RBS0UnO1xuZXhwb3J0IGNvbnN0IE5PT1AgPSAnTk9PUCc7XG5leHBvcnQgY29uc3QgU0xFRVAgPSAnU0xFRVAnO1xuZXhwb3J0IGNvbnN0IFNUT1AgPSAnU1RPUCc7XG5leHBvcnQgY29uc3QgUkVBRCA9ICdSRUFEJztcbmV4cG9ydCBjb25zdCBDQUxMX1JPVVRJTkUgPSAnQ0FMTF9ST1VUSU5FJztcbmV4cG9ydCBjb25zdCBGT1JLX1JPVVRJTkUgPSAnRk9SS19ST1VUSU5FJztcbmV4cG9ydCBjb25zdCBOT1RISU5HID0gU3ltYm9sKCdOT1RISU5HJyk7XG5leHBvcnQgY29uc3QgQUxMX1JFUVVJUkVEID0gU3ltYm9sKCdBTExfUkVRVUlSRUQnKTtcbmV4cG9ydCBjb25zdCBPTkVfT0YgPSBTeW1ib2woJ09ORV9PRicpO1xuXG5leHBvcnQgY29uc3QgQ0hBTk5FTFMgPSB7XG4gIGNoYW5uZWxzOiB7fSxcbiAgZ2V0QWxsKCkge1xuICAgIHJldHVybiB0aGlzLmNoYW5uZWxzO1xuICB9LFxuICBnZXQoaWQpIHtcbiAgICByZXR1cm4gdGhpcy5jaGFubmVsc1tpZF07XG4gIH0sXG4gIHNldChpZCwgY2gpIHtcbiAgICB0aGlzLmNoYW5uZWxzW2lkXSA9IGNoO1xuICAgIHJldHVybiBjaDtcbiAgfSxcbiAgZGVsKGlkKSB7XG4gICAgZGVsZXRlIHRoaXMuY2hhbm5lbHNbaWRdO1xuICB9LFxuICBleGlzdHMoaWQpIHtcbiAgICByZXR1cm4gISF0aGlzLmNoYW5uZWxzW2lkXTtcbiAgfSxcbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5jaGFubmVscyA9IHt9O1xuICB9LFxufTtcblxuZXhwb3J0IGNvbnN0IGJ1ZmZlciA9IGI7XG5leHBvcnQgY29uc3QgY2hhbiA9IGM7XG5leHBvcnQgY29uc3QgZml4ZWQgPSAoc2l6ZSA9IDAsIGlkID0gbnVsbCwgcGFyZW50ID0gbnVsbCkgPT5cbiAgY2hhbihpZCB8fCAnZml4ZWQnLCBidWZmZXIuZml4ZWQoc2l6ZSksIHBhcmVudCk7XG5leHBvcnQgY29uc3Qgc2xpZGluZyA9IChzaXplID0gMSwgaWQgPSBudWxsLCBwYXJlbnQgPSBudWxsKSA9PlxuICBjaGFuKGlkIHx8ICdzbGlkaW5nJywgYnVmZmVyLnNsaWRpbmcoc2l6ZSksIHBhcmVudCk7XG5leHBvcnQgY29uc3QgZHJvcHBpbmcgPSAoc2l6ZSA9IDEsIGlkID0gbnVsbCwgcGFyZW50ID0gbnVsbCkgPT5cbiAgY2hhbihpZCB8fCAnZHJvcHBpbmcnLCBidWZmZXIuZHJvcHBpbmcoc2l6ZSksIHBhcmVudCk7XG5leHBvcnQgY29uc3Qgc3RhdGUgPSBzO1xuXG5leHBvcnQgKiBmcm9tICcuL3JpZXcnO1xuXG5leHBvcnQgY29uc3QgcmVhY3QgPSB7XG4gIHJpZXc6ICguLi5hcmdzKSA9PiByZWFjdFJpZXcoLi4uYXJncyksXG59O1xuZXhwb3J0IGNvbnN0IHVzZSA9IChuYW1lLCAuLi5hcmdzKSA9PiBSLnByb2R1Y2UobmFtZSwgLi4uYXJncyk7XG5leHBvcnQgY29uc3QgcmVnaXN0ZXIgPSAobmFtZSwgd2hhdGV2ZXIpID0+IHtcbiAgUi5kZWZpbmVQcm9kdWN0KG5hbWUsICgpID0+IHdoYXRldmVyKTtcbiAgcmV0dXJuIHdoYXRldmVyO1xufTtcbmV4cG9ydCBjb25zdCBsb2dnZXIgPSBuZXcgTG9nZ2VyKCk7XG5leHBvcnQgY29uc3QgZ3JpZCA9IG5ldyBHcmlkKCk7XG5leHBvcnQgY29uc3QgcmVzZXQgPSAoKSA9PiAoXG4gIHJlc2V0SWRzKCksIGdyaWQucmVzZXQoKSwgUi5yZXNldCgpLCBDSEFOTkVMUy5yZXNldCgpLCBsb2dnZXIucmVzZXQoKVxuKTtcbmV4cG9ydCBjb25zdCByZWdpc3RyeSA9IFI7XG5leHBvcnQgY29uc3Qgc3B1dCA9IG9wcy5zcHV0O1xuZXhwb3J0IGNvbnN0IHB1dCA9IG9wcy5wdXQ7XG5leHBvcnQgY29uc3Qgc3Rha2UgPSBvcHMuc3Rha2U7XG5leHBvcnQgY29uc3QgdGFrZSA9IG9wcy50YWtlO1xuZXhwb3J0IGNvbnN0IHJlYWQgPSBvcHMucmVhZDtcbmV4cG9ydCBjb25zdCBzcmVhZCA9IG9wcy5zcmVhZDtcbmV4cG9ydCBjb25zdCBsaXN0ZW4gPSBvcHMubGlzdGVuO1xuZXhwb3J0IGNvbnN0IHVuc3ViQWxsID0gb3BzLnVuc3ViQWxsO1xuZXhwb3J0IGNvbnN0IGNsb3NlID0gb3BzLmNsb3NlO1xuZXhwb3J0IGNvbnN0IHNjbG9zZSA9IG9wcy5zY2xvc2U7XG5leHBvcnQgY29uc3QgY2hhbm5lbFJlc2V0ID0gb3BzLmNoYW5uZWxSZXNldDtcbmV4cG9ydCBjb25zdCBzY2hhbm5lbFJlc2V0ID0gb3BzLnNjaGFubmVsUmVzZXQ7XG5leHBvcnQgY29uc3QgY2FsbCA9IG9wcy5jYWxsO1xuZXhwb3J0IGNvbnN0IGZvcmsgPSBvcHMuZm9yaztcbmV4cG9ydCBjb25zdCBtZXJnZSA9IG9wcy5tZXJnZTtcbmV4cG9ydCBjb25zdCB0aW1lb3V0ID0gb3BzLnRpbWVvdXQ7XG5leHBvcnQgY29uc3QgdmVyaWZ5Q2hhbm5lbCA9IG9wcy52ZXJpZnlDaGFubmVsO1xuZXhwb3J0IGNvbnN0IGlzQ2hhbm5lbCA9IG9wcy5pc0NoYW5uZWw7XG5leHBvcnQgY29uc3QgZ2V0Q2hhbm5lbCA9IG9wcy5nZXRDaGFubmVsO1xuZXhwb3J0IGNvbnN0IGlzUmlldyA9IG9wcy5pc1JpZXc7XG5leHBvcnQgY29uc3QgaXNTdGF0ZSA9IG9wcy5pc1N0YXRlO1xuZXhwb3J0IGNvbnN0IGlzUm91dGluZSA9IG9wcy5pc1JvdXRpbmU7XG5leHBvcnQgY29uc3QgZ28gPSBvcHMuZ287XG5leHBvcnQgY29uc3Qgc2xlZXAgPSBvcHMuc2xlZXA7XG5leHBvcnQgY29uc3Qgc3RvcCA9IG9wcy5zdG9wO1xuZXhwb3J0IGNvbnN0IGluc3BlY3RvciA9IGluc3AobG9nZ2VyKTtcbiIsIi8qIGVzbGludC1kaXNhYmxlIG5vLXJlc3RyaWN0ZWQtZ2xvYmFscyAqL1xuY29uc3QgaXNEZWZpbmVkID0gd2hhdCA9PiB0eXBlb2Ygd2hhdCAhPT0gJ3VuZGVmaW5lZCc7XG5mdW5jdGlvbiBnZXRPcmlnaW4oKSB7XG4gIGlmIChcbiAgICBpc0RlZmluZWQobG9jYXRpb24pICYmXG4gICAgaXNEZWZpbmVkKGxvY2F0aW9uLnByb3RvY29sKSAmJlxuICAgIGlzRGVmaW5lZChsb2NhdGlvbi5ob3N0KVxuICApIHtcbiAgICByZXR1cm4gYCR7bG9jYXRpb24ucHJvdG9jb2x9Ly8ke2xvY2F0aW9uLmhvc3R9YDtcbiAgfVxuICByZXR1cm4gJ3Vua25vd24nO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBpbnNwZWN0b3IobG9nZ2VyKSB7XG4gIHJldHVybiAoY2FsbGJhY2sgPSAoKSA9PiB7fSwgbG9nU25hcHNob3RzVG9Db25zb2xlID0gZmFsc2UpID0+IHtcbiAgICBsb2dnZXIuZW5hYmxlKCk7XG4gICAgbG9nZ2VyLm9uKHNuYXBzaG90ID0+IHtcbiAgICAgIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICBpZiAobG9nU25hcHNob3RzVG9Db25zb2xlKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ1JpZXc6aW5zcGVjdG9yJywgc25hcHNob3QpO1xuICAgICAgICB9XG4gICAgICAgIGNhbGxiYWNrKHNuYXBzaG90KTtcbiAgICAgICAgd2luZG93LnBvc3RNZXNzYWdlKFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHR5cGU6ICdSSUVXX1NOQVBTSE9UJyxcbiAgICAgICAgICAgIHNvdXJjZTogJ3JpZXcnLFxuICAgICAgICAgICAgb3JpZ2luOiBnZXRPcmlnaW4oKSxcbiAgICAgICAgICAgIHNuYXBzaG90LFxuICAgICAgICAgICAgdGltZTogbmV3IERhdGUoKS5nZXRUaW1lKCksXG4gICAgICAgICAgfSxcbiAgICAgICAgICAnKidcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcbn1cbiIsIi8qIGVzbGludC1kaXNhYmxlIG5vLXVzZS1iZWZvcmUtZGVmaW5lICovXG5pbXBvcnQgeyBpc0NoYW5uZWwsIGlzUmlldywgaXNTdGF0ZSwgaXNSb3V0aW5lIH0gZnJvbSAnLi9pbmRleCc7XG5pbXBvcnQgc2FuaXRpemUgZnJvbSAnLi9zYW5pdGl6ZSc7XG5cbmNvbnN0IFJJRVcgPSAnUklFVyc7XG5jb25zdCBTVEFURSA9ICdTVEFURSc7XG5jb25zdCBDSEFOTkVMID0gJ0NIQU5ORUwnO1xuY29uc3QgUk9VVElORSA9ICdST1VUSU5FJztcblxuZnVuY3Rpb24gbm9ybWFsaXplUmlldyhyKSB7XG4gIHJldHVybiB7XG4gICAgaWQ6IHIuaWQsXG4gICAgbmFtZTogci5uYW1lLFxuICAgIHR5cGU6IFJJRVcsXG4gICAgdmlld0RhdGE6IHNhbml0aXplKHIucmVuZGVyZXIuZGF0YSgpKSxcbiAgICBjaGlsZHJlbjogci5jaGlsZHJlbi5tYXAoY2hpbGQgPT4ge1xuICAgICAgaWYgKGlzU3RhdGUoY2hpbGQpKSB7XG4gICAgICAgIHJldHVybiBub3JtYWxpemVTdGF0ZShjaGlsZCk7XG4gICAgICB9XG4gICAgICBpZiAoaXNDaGFubmVsKGNoaWxkKSkge1xuICAgICAgICByZXR1cm4gbm9ybWFsaXplQ2hhbm5lbChjaGlsZCk7XG4gICAgICB9XG4gICAgICBpZiAoaXNSb3V0aW5lKGNoaWxkKSkge1xuICAgICAgICByZXR1cm4gbm9ybWFsaXplUm91dGluZShjaGlsZCk7XG4gICAgICB9XG4gICAgICBjb25zb2xlLndhcm4oJ1JpZXcgbG9nZ2VyOiB1bnJlY29nbml6ZWQgcmlldyBjaGlsZCcsIGNoaWxkKTtcbiAgICB9KSxcbiAgfTtcbn1cbmZ1bmN0aW9uIG5vcm1hbGl6ZVN0YXRlKHMpIHtcbiAgcmV0dXJuIHtcbiAgICBpZDogcy5pZCxcbiAgICBuYW1lOiBzLm5hbWUsXG4gICAgcGFyZW50OiBzLnBhcmVudCxcbiAgICB0eXBlOiBTVEFURSxcbiAgICB2YWx1ZTogc2FuaXRpemUocy5nZXQoKSksXG4gICAgY2hpbGRyZW46IHMuY2hpbGRyZW4oKS5tYXAoY2hpbGQgPT4ge1xuICAgICAgaWYgKGlzQ2hhbm5lbChjaGlsZCkpIHtcbiAgICAgICAgcmV0dXJuIG5vcm1hbGl6ZUNoYW5uZWwoY2hpbGQpO1xuICAgICAgfVxuICAgICAgY29uc29sZS53YXJuKCdSaWV3IGxvZ2dlcjogdW5yZWNvZ25pemVkIHN0YXRlIGNoaWxkJywgY2hpbGQpO1xuICAgIH0pLFxuICB9O1xufVxuZnVuY3Rpb24gbm9ybWFsaXplQ2hhbm5lbChjKSB7XG4gIGNvbnN0IG8gPSB7XG4gICAgaWQ6IGMuaWQsXG4gICAgbmFtZTogYy5uYW1lLFxuICAgIHBhcmVudDogYy5wYXJlbnQsXG4gICAgdHlwZTogQ0hBTk5FTCxcbiAgICB2YWx1ZTogc2FuaXRpemUoYy52YWx1ZSgpKSxcbiAgICBwdXRzOiBjLmJ1ZmYucHV0cy5tYXAoKHsgaXRlbSB9KSA9PiAoeyBpdGVtIH0pKSxcbiAgICB0YWtlczogYy5idWZmLnRha2VzLm1hcCgoeyBvcHRpb25zIH0pID0+ICh7XG4gICAgICByZWFkOiBvcHRpb25zLnJlYWQsXG4gICAgICBsaXN0ZW46IG9wdGlvbnMubGlzdGVuLFxuICAgIH0pKSxcbiAgfTtcbiAgcmV0dXJuIG87XG59XG5mdW5jdGlvbiBub3JtYWxpemVSb3V0aW5lKHIpIHtcbiAgcmV0dXJuIHtcbiAgICBpZDogci5pZCxcbiAgICB0eXBlOiBST1VUSU5FLFxuICAgIG5hbWU6IHIubmFtZSxcbiAgICBwYXJlbnQ6IHIucGFyZW50LFxuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBMb2dnZXIoKSB7XG4gIGNvbnN0IGFwaSA9IHt9O1xuICBsZXQgZnJhbWVzID0gW107XG4gIGxldCBkYXRhID0gW107XG4gIGxldCBpblByb2dyZXNzID0gZmFsc2U7XG4gIGxldCBlbmFibGVkID0gZmFsc2U7XG4gIGNvbnN0IGxpc3RlbmVycyA9IFtdO1xuXG4gIGFwaS5vbiA9IGxpc3RlbmVyID0+IGxpc3RlbmVycy5wdXNoKGxpc3RlbmVyKTtcbiAgYXBpLmxvZyA9ICh3aG8sIHdoYXQsIG1ldGEpID0+IHtcbiAgICBpZiAoIWVuYWJsZWQpIHJldHVybiBudWxsO1xuICAgIGlmIChpc1JpZXcod2hvKSkge1xuICAgICAgd2hvID0gbm9ybWFsaXplUmlldyh3aG8pO1xuICAgIH0gZWxzZSBpZiAoaXNTdGF0ZSh3aG8pKSB7XG4gICAgICB3aG8gPSBub3JtYWxpemVTdGF0ZSh3aG8pO1xuICAgIH0gZWxzZSBpZiAoaXNDaGFubmVsKHdobykpIHtcbiAgICAgIHdobyA9IG5vcm1hbGl6ZUNoYW5uZWwod2hvKTtcbiAgICB9IGVsc2UgaWYgKGlzUm91dGluZSh3aG8pKSB7XG4gICAgICB3aG8gPSBub3JtYWxpemVSb3V0aW5lKHdobyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUud2FybignUmlldyBsb2dnZXI6IHVucmVjb2duaXplZCB3aG8nLCB3aG8sIHdoYXQpO1xuICAgIH1cbiAgICBkYXRhLnB1c2goe1xuICAgICAgd2hvLFxuICAgICAgd2hhdCxcbiAgICAgIG1ldGE6IHNhbml0aXplKG1ldGEpLFxuICAgIH0pO1xuICAgIGlmICghaW5Qcm9ncmVzcykge1xuICAgICAgaW5Qcm9ncmVzcyA9IHRydWU7XG4gICAgICBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IHtcbiAgICAgICAgY29uc3QgcyA9IGFwaS5mcmFtZShkYXRhKTtcbiAgICAgICAgaW5Qcm9ncmVzcyA9IGZhbHNlO1xuICAgICAgICBkYXRhID0gW107XG4gICAgICAgIGxpc3RlbmVycy5mb3JFYWNoKGwgPT4gbChzKSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH07XG4gIGFwaS5mcmFtZSA9IGFjdGlvbnMgPT4ge1xuICAgIGlmICghZW5hYmxlZCkgcmV0dXJuIG51bGw7XG4gICAgY29uc3QgZnJhbWUgPSBzYW5pdGl6ZShhY3Rpb25zKTtcbiAgICBmcmFtZXMucHVzaChmcmFtZSk7XG4gICAgcmV0dXJuIGZyYW1lO1xuICB9O1xuICBhcGkubm93ID0gKCkgPT4gKGZyYW1lcy5sZW5ndGggPiAwID8gZnJhbWVzW2ZyYW1lcy5sZW5ndGggLSAxXSA6IG51bGwpO1xuICBhcGkuZnJhbWVzID0gKCkgPT4gZnJhbWVzO1xuICBhcGkucmVzZXQgPSAoKSA9PiB7XG4gICAgZnJhbWVzID0gW107XG4gICAgZW5hYmxlZCA9IGZhbHNlO1xuICB9O1xuICBhcGkuZW5hYmxlID0gKCkgPT4ge1xuICAgIGVuYWJsZWQgPSB0cnVlO1xuICB9O1xuICBhcGkuZGlzYWJsZSA9ICgpID0+IHtcbiAgICBlbmFibGVkID0gZmFsc2U7XG4gIH07XG4gIGFwaS5zZXRXaG9OYW1lID0gKGlkLCBuYW1lKSA9PiB7XG4gICAgZGF0YS5mb3JFYWNoKGFjdGlvbiA9PiB7XG4gICAgICBpZiAoYWN0aW9uLndoby5pZCA9PT0gaWQpIHtcbiAgICAgICAgYWN0aW9uLndoby5uYW1lID0gbmFtZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBmcmFtZXMuZm9yRWFjaChmcmFtZSA9PiB7XG4gICAgICBmcmFtZS5mb3JFYWNoKGFjdGlvbiA9PiB7XG4gICAgICAgIGlmIChhY3Rpb24ud2hvLmlkID09PSBpZCkge1xuICAgICAgICAgIGFjdGlvbi53aG8ubmFtZSA9IG5hbWU7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9O1xuXG4gIHJldHVybiBhcGk7XG59XG4iLCIvKiBlc2xpbnQtZGlzYWJsZSAqL1xuaW1wb3J0IFJlYWN0LCB7IHVzZVN0YXRlLCB1c2VFZmZlY3QsIHVzZVJlZiB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IGdldEZ1bmNOYW1lIH0gZnJvbSAnLi4vdXRpbHMnO1xuaW1wb3J0IHsgbmFtZWRSaWV3IH0gZnJvbSAnLi4vaW5kZXgnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiByaWV3KFZpZXcsIC4uLnJvdXRpbmVzKSB7XG4gIGNvbnN0IG5hbWUgPSBnZXRGdW5jTmFtZShWaWV3KTtcbiAgY29uc3QgY3JlYXRlQnJpZGdlID0gZnVuY3Rpb24oZXh0ZXJuYWxzID0gW10pIHtcbiAgICBjb25zdCBjb21wID0gZnVuY3Rpb24ob3V0ZXJQcm9wcykge1xuICAgICAgbGV0IFtpbnN0YW5jZSwgc2V0SW5zdGFuY2VdID0gdXNlU3RhdGUobnVsbCk7XG4gICAgICBjb25zdCBbY29udGVudCwgc2V0Q29udGVudF0gPSB1c2VTdGF0ZShudWxsKTtcbiAgICAgIGNvbnN0IG1vdW50ZWQgPSB1c2VSZWYodHJ1ZSk7XG5cbiAgICAgIC8vIHVwZGF0aW5nIHByb3BzXG4gICAgICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgICAgICBpZiAoaW5zdGFuY2UpIHtcbiAgICAgICAgICBpbnN0YW5jZS51cGRhdGUob3V0ZXJQcm9wcyk7XG4gICAgICAgIH1cbiAgICAgIH0sIFtvdXRlclByb3BzXSk7XG5cbiAgICAgIC8vIG1vdW50aW5nXG4gICAgICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgICAgICBpbnN0YW5jZSA9IG5hbWVkUmlldyhuYW1lLCBwcm9wcyA9PiB7XG4gICAgICAgICAgaWYgKCFtb3VudGVkKSByZXR1cm47XG4gICAgICAgICAgaWYgKHByb3BzID09PSBudWxsKSB7XG4gICAgICAgICAgICBzZXRDb250ZW50KG51bGwpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzZXRDb250ZW50KHByb3BzKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIC4uLnJvdXRpbmVzKTtcblxuICAgICAgICBpZiAoZXh0ZXJuYWxzICYmIGV4dGVybmFscy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgaW5zdGFuY2UgPSBpbnN0YW5jZS53aXRoKC4uLmV4dGVybmFscyk7XG4gICAgICAgIH1cbiAgICAgICAgaW5zdGFuY2UubmFtZSA9IG5hbWU7XG5cbiAgICAgICAgc2V0SW5zdGFuY2UoaW5zdGFuY2UpO1xuICAgICAgICBpbnN0YW5jZS5tb3VudChvdXRlclByb3BzKTtcbiAgICAgICAgbW91bnRlZC5jdXJyZW50ID0gdHJ1ZTtcblxuICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgbW91bnRlZC5jdXJyZW50ID0gZmFsc2U7XG4gICAgICAgICAgaW5zdGFuY2UudW5tb3VudCgpO1xuICAgICAgICB9O1xuICAgICAgfSwgW10pO1xuXG4gICAgICByZXR1cm4gY29udGVudCA9PT0gbnVsbCA/IG51bGwgOiBSZWFjdC5jcmVhdGVFbGVtZW50KFZpZXcsIGNvbnRlbnQpO1xuICAgIH07XG5cbiAgICBjb21wLmRpc3BsYXlOYW1lID0gYFJpZXdfJHtuYW1lfWA7XG4gICAgY29tcC53aXRoID0gKC4uLm1hcHMpID0+IGNyZWF0ZUJyaWRnZShtYXBzKTtcblxuICAgIHJldHVybiBjb21wO1xuICB9O1xuXG4gIHJldHVybiBjcmVhdGVCcmlkZ2UoKTtcbn1cbiIsIi8qIGVzbGludC1kaXNhYmxlIG5vLXVzZS1iZWZvcmUtZGVmaW5lICovXG5mdW5jdGlvbiBSZWdpc3RyeSgpIHtcbiAgY29uc3QgYXBpID0ge307XG4gIGxldCBwcm9kdWN0cyA9IHt9O1xuXG4gIGFwaS5kZWZpbmVQcm9kdWN0ID0gKHR5cGUsIGZ1bmMpID0+IHtcbiAgICBpZiAocHJvZHVjdHNbdHlwZV0pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgQSByZXNvdXJjZSB3aXRoIHR5cGUgXCIke3R5cGV9XCIgYWxyZWFkeSBleGlzdHMuYCk7XG4gICAgfVxuICAgIHByb2R1Y3RzW3R5cGVdID0gZnVuYztcbiAgfTtcbiAgYXBpLnVuZGVmaW5lUHJvZHVjdCA9IHR5cGUgPT4ge1xuICAgIGlmICghcHJvZHVjdHNbdHlwZV0pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgYFRoZXJlIGlzIG5vIHJlc291cmNlIHdpdGggdHlwZSBcIiR7dHlwZX1cIiB0byBiZSByZW1vdmVkLmBcbiAgICAgICk7XG4gICAgfVxuICAgIGRlbGV0ZSBwcm9kdWN0c1t0eXBlXTtcbiAgfTtcbiAgYXBpLnByb2R1Y2UgPSAodHlwZSwgLi4uYXJncykgPT4ge1xuICAgIGlmICghcHJvZHVjdHNbdHlwZV0pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgVGhlcmUgaXMgbm8gcmVzb3VyY2Ugd2l0aCB0eXBlIFwiJHt0eXBlfVwiLmApO1xuICAgIH1cbiAgICByZXR1cm4gcHJvZHVjdHNbdHlwZV0oLi4uYXJncyk7XG4gIH07XG4gIGFwaS5yZXNldCA9ICgpID0+IHtcbiAgICBwcm9kdWN0cyA9IHt9O1xuICB9O1xuICBhcGkuZGVidWcgPSAoKSA9PiAoe1xuICAgIHByb2R1Y3ROYW1lczogT2JqZWN0LmtleXMocHJvZHVjdHMpLFxuICB9KTtcblxuICByZXR1cm4gYXBpO1xufVxuXG5jb25zdCByID0gUmVnaXN0cnkoKTtcblxuZXhwb3J0IGRlZmF1bHQgcjtcbiIsIi8qIGVzbGludC1kaXNhYmxlIG5vLXBhcmFtLXJlYXNzaWduLCBuby11c2UtYmVmb3JlLWRlZmluZSAqL1xuXG5pbXBvcnQge1xuICB1c2UsXG4gIHN0YXRlIGFzIFN0YXRlLFxuICBpc1N0YXRlLFxuICBnbyxcbiAgbGlzdGVuLFxuICBjbG9zZSxcbiAgc3B1dCxcbiAgZ3JpZCxcbiAgbG9nZ2VyLFxuICBpc1JvdXRpbmUsXG4gIENMT1NFRCxcbiAgRU5ERUQsXG4gIHZlcmlmeUNoYW5uZWwsXG4gIHNsaWRpbmcgYXMgU2xpZGluZyxcbiAgZml4ZWQgYXMgRml4ZWQsXG4gIGRyb3BwaW5nIGFzIERyb3BwaW5nLFxuICBpc0NoYW5uZWwsXG59IGZyb20gJy4vaW5kZXgnO1xuaW1wb3J0IHtcbiAgaXNPYmplY3RFbXB0eSxcbiAgZ2V0RnVuY05hbWUsXG4gIGdldElkLFxuICByZXF1aXJlT2JqZWN0LFxuICBhY2N1bXVsYXRlLFxufSBmcm9tICcuL3V0aWxzJztcblxuY29uc3QgUmVuZGVyZXIgPSBmdW5jdGlvbihwdXNoRGF0YVRvVmlldykge1xuICBsZXQgZGF0YSA9IHt9O1xuICBsZXQgaW5Qcm9ncmVzcyA9IGZhbHNlO1xuICBsZXQgYWN0aXZlID0gdHJ1ZTtcblxuICByZXR1cm4ge1xuICAgIHB1c2gobmV3RGF0YSkge1xuICAgICAgaWYgKG5ld0RhdGEgPT09IENMT1NFRCB8fCBuZXdEYXRhID09PSBFTkRFRCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBkYXRhID0gYWNjdW11bGF0ZShkYXRhLCBuZXdEYXRhKTtcbiAgICAgIGlmICghaW5Qcm9ncmVzcykge1xuICAgICAgICBpblByb2dyZXNzID0gdHJ1ZTtcbiAgICAgICAgUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgaWYgKGFjdGl2ZSkge1xuICAgICAgICAgICAgcHVzaERhdGFUb1ZpZXcoZGF0YSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGluUHJvZ3Jlc3MgPSBmYWxzZTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSxcbiAgICBkZXN0cm95KCkge1xuICAgICAgYWN0aXZlID0gZmFsc2U7XG4gICAgfSxcbiAgICBkYXRhKCkge1xuICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfSxcbiAgfTtcbn07XG5leHBvcnQgZnVuY3Rpb24gcmlldyh2aWV3RnVuYywgLi4ucm91dGluZXMpIHtcbiAgY29uc3QgbmFtZSA9IGdldEZ1bmNOYW1lKHZpZXdGdW5jKTtcbiAgcmV0dXJuIG5hbWVkUmlldyhuYW1lLCB2aWV3RnVuYywgLi4ucm91dGluZXMpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbmFtZWRSaWV3KG5hbWUsIHZpZXdGdW5jLCAuLi5yb3V0aW5lcykge1xuICBjb25zdCByZW5kZXJlciA9IFJlbmRlcmVyKHZhbHVlID0+IHtcbiAgICB2aWV3RnVuYyh2YWx1ZSk7XG4gICAgbG9nZ2VyLmxvZyhhcGksICdSSUVXX1JFTkRFUkVEJywgdmFsdWUpO1xuICB9KTtcbiAgY29uc3QgaWQgPSBnZXRJZChgJHtuYW1lfV9yaWV3YCk7XG4gIGNvbnN0IGFwaSA9IHtcbiAgICBpZCxcbiAgICBuYW1lLFxuICAgICdAcmlldyc6IHRydWUsXG4gICAgY2hpbGRyZW46IFtdLFxuICAgIHJlbmRlcmVyLFxuICB9O1xuICBsZXQgY2xlYW51cHMgPSBbXTtcbiAgbGV0IGV4dGVybmFscyA9IHt9O1xuICBsZXQgc3Vic2NyaXB0aW9ucyA9IHt9O1xuICBjb25zdCBhZGRDaGlsZCA9IGZ1bmN0aW9uKG8pIHtcbiAgICBhcGkuY2hpbGRyZW4ucHVzaChvKTtcbiAgICByZXR1cm4gbztcbiAgfTtcbiAgY29uc3Qgc3RhdGUgPSBpbml0aWFsVmFsdWUgPT4gYWRkQ2hpbGQoU3RhdGUoaW5pdGlhbFZhbHVlLCBpZCkpO1xuICBjb25zdCBzbGlkaW5nID0gbiA9PiBhZGRDaGlsZChTbGlkaW5nKG4sIGBzbGlkaW5nXyR7bmFtZX1gLCBpZCkpO1xuICBjb25zdCBmaXhlZCA9IG4gPT4gYWRkQ2hpbGQoRml4ZWQobiwgYGZpeGVkXyR7bmFtZX1gLCBpZCkpO1xuICBjb25zdCBkcm9wcGluZyA9IG4gPT4gYWRkQ2hpbGQoRHJvcHBpbmcobiwgYGRyb3BwaW5nXyR7bmFtZX1gLCBpZCkpO1xuICBjb25zdCBzdWJzY3JpYmUgPSBmdW5jdGlvbih0bywgZnVuYykge1xuICAgIGlmICghKHRvLmlkIGluIHN1YnNjcmlwdGlvbnMpKSB7XG4gICAgICBzdWJzY3JpcHRpb25zW3RvLmlkXSA9IGxpc3Rlbih0bywgZnVuYywgeyBpbml0aWFsQ2FsbDogdHJ1ZSB9KTtcbiAgICB9XG4gIH07XG4gIGNvbnN0IFZJRVdfQ0hBTk5FTCA9IHNsaWRpbmcoMSlgdmlld2A7XG4gIGNvbnN0IFBST1BTX0NIQU5ORUwgPSBzbGlkaW5nKDEpYHByb3BzYDtcblxuICBjb25zdCBub3JtYWxpemVSZW5kZXJEYXRhID0gdmFsdWUgPT5cbiAgICBPYmplY3Qua2V5cyh2YWx1ZSkucmVkdWNlKChvYmosIGtleSkgPT4ge1xuICAgICAgY29uc3QgY2ggPSB2ZXJpZnlDaGFubmVsKHZhbHVlW2tleV0sIGZhbHNlKTtcbiAgICAgIGlmIChjaCAhPT0gbnVsbCkge1xuICAgICAgICBzdWJzY3JpYmUoY2gsIHYgPT4gc3B1dChWSUVXX0NIQU5ORUwsIHsgW2tleV06IHYgfSkpO1xuICAgICAgfSBlbHNlIGlmIChpc1N0YXRlKHZhbHVlW2tleV0pKSB7XG4gICAgICAgIHN1YnNjcmliZSh2YWx1ZVtrZXldLkRFRkFVTFQsIHYgPT4gc3B1dChWSUVXX0NIQU5ORUwsIHsgW2tleV06IHYgfSkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb2JqW2tleV0gPSB2YWx1ZVtrZXldO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG9iajtcbiAgICB9LCB7fSk7XG5cbiAgYXBpLm1vdW50ID0gZnVuY3Rpb24ocHJvcHMgPSB7fSkge1xuICAgIHJlcXVpcmVPYmplY3QocHJvcHMpO1xuICAgIHNwdXQoUFJPUFNfQ0hBTk5FTCwgcHJvcHMpO1xuICAgIHN1YnNjcmliZShQUk9QU19DSEFOTkVMLCBuZXdQcm9wcyA9PiB7XG4gICAgICBzcHV0KFZJRVdfQ0hBTk5FTCwgbmV3UHJvcHMpO1xuICAgIH0pO1xuICAgIHN1YnNjcmliZShWSUVXX0NIQU5ORUwsIHJlbmRlcmVyLnB1c2gpO1xuICAgIGFwaS5jaGlsZHJlbiA9IGFwaS5jaGlsZHJlbi5jb25jYXQoXG4gICAgICByb3V0aW5lcy5tYXAociA9PlxuICAgICAgICBnbyhcbiAgICAgICAgICByLFxuICAgICAgICAgIHJlc3VsdCA9PiB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHJlc3VsdCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICBjbGVhbnVwcy5wdXNoKHJlc3VsdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHJlbmRlcjogdmFsdWUgPT4ge1xuICAgICAgICAgICAgICAgIHJlcXVpcmVPYmplY3QodmFsdWUpO1xuICAgICAgICAgICAgICAgIHNwdXQoVklFV19DSEFOTkVMLCBub3JtYWxpemVSZW5kZXJEYXRhKHZhbHVlKSk7XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHN0YXRlLFxuICAgICAgICAgICAgICBmaXhlZCxcbiAgICAgICAgICAgICAgc2xpZGluZyxcbiAgICAgICAgICAgICAgZHJvcHBpbmcsXG4gICAgICAgICAgICAgIHByb3BzOiBQUk9QU19DSEFOTkVMLFxuICAgICAgICAgICAgICAuLi5leHRlcm5hbHMsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgICAgaWRcbiAgICAgICAgKVxuICAgICAgKVxuICAgICk7XG4gICAgaWYgKCFpc09iamVjdEVtcHR5KGV4dGVybmFscykpIHtcbiAgICAgIHNwdXQoVklFV19DSEFOTkVMLCBub3JtYWxpemVSZW5kZXJEYXRhKGV4dGVybmFscykpO1xuICAgIH1cbiAgICBsb2dnZXIubG9nKGFwaSwgJ1JJRVdfTU9VTlRFRCcsIHByb3BzKTtcbiAgfTtcblxuICBhcGkudW5tb3VudCA9IGZ1bmN0aW9uKCkge1xuICAgIGNsZWFudXBzLmZvckVhY2goYyA9PiBjKCkpO1xuICAgIGNsZWFudXBzID0gW107XG4gICAgT2JqZWN0LmtleXMoc3Vic2NyaXB0aW9ucykuZm9yRWFjaChzdWJJZCA9PiB7XG4gICAgICBzdWJzY3JpcHRpb25zW3N1YklkXSgpO1xuICAgIH0pO1xuICAgIHN1YnNjcmlwdGlvbnMgPSB7fTtcbiAgICBhcGkuY2hpbGRyZW4uZm9yRWFjaChjID0+IHtcbiAgICAgIGlmIChpc1N0YXRlKGMpKSB7XG4gICAgICAgIGMuZGVzdHJveSgpO1xuICAgICAgfSBlbHNlIGlmIChpc1JvdXRpbmUoYykpIHtcbiAgICAgICAgYy5zdG9wKCk7XG4gICAgICB9IGVsc2UgaWYgKGlzQ2hhbm5lbChjKSkge1xuICAgICAgICBjbG9zZShjKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBhcGkuY2hpbGRyZW4gPSBbXTtcbiAgICByZW5kZXJlci5kZXN0cm95KCk7XG4gICAgZ3JpZC5yZW1vdmUoYXBpKTtcbiAgICBsb2dnZXIubG9nKGFwaSwgJ1JJRVdfVU5NT1VOVEVEJyk7XG4gIH07XG5cbiAgYXBpLnVwZGF0ZSA9IGZ1bmN0aW9uKHByb3BzID0ge30pIHtcbiAgICByZXF1aXJlT2JqZWN0KHByb3BzKTtcbiAgICBzcHV0KFBST1BTX0NIQU5ORUwsIHByb3BzKTtcbiAgICBsb2dnZXIubG9nKGFwaSwgJ1JJRVdfVVBEQVRFRCcsIHByb3BzKTtcbiAgfTtcblxuICBhcGkud2l0aCA9ICguLi5tYXBzKSA9PiB7XG4gICAgYXBpLl9fc2V0RXh0ZXJuYWxzKG1hcHMpO1xuICAgIHJldHVybiBhcGk7XG4gIH07XG5cbiAgYXBpLnRlc3QgPSBtYXAgPT4ge1xuICAgIGNvbnN0IG5ld0luc3RhbmNlID0gcmlldyh2aWV3RnVuYywgLi4ucm91dGluZXMpO1xuXG4gICAgbmV3SW5zdGFuY2UuX19zZXRFeHRlcm5hbHMoW21hcF0pO1xuICAgIHJldHVybiBuZXdJbnN0YW5jZTtcbiAgfTtcblxuICBhcGkuX19zZXRFeHRlcm5hbHMgPSBtYXBzID0+IHtcbiAgICBjb25zdCByZWR1Y2VkTWFwcyA9IG1hcHMucmVkdWNlKChyZXMsIGl0ZW0pID0+IHtcbiAgICAgIGlmICh0eXBlb2YgaXRlbSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgcmVzID0geyAuLi5yZXMsIFtpdGVtXTogdXNlKGl0ZW0pIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXMgPSB7IC4uLnJlcywgLi4uaXRlbSB9O1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlcztcbiAgICB9LCB7fSk7XG4gICAgZXh0ZXJuYWxzID0geyAuLi5leHRlcm5hbHMsIC4uLnJlZHVjZWRNYXBzIH07XG4gIH07XG5cbiAgZ3JpZC5hZGQoYXBpKTtcbiAgbG9nZ2VyLmxvZyhhcGksICdSSUVXX0NSRUFURUQnKTtcblxuICByZXR1cm4gYXBpO1xufVxuIiwiaW1wb3J0IENpcmN1bGFySlNPTiBmcm9tICcuL3ZlbmRvcnMvQ2lyY3VsYXJKU09OJztcbmltcG9ydCBTZXJpYWxpemVFcnJvciBmcm9tICcuL3ZlbmRvcnMvU2VyaWFsaXplRXJyb3InO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBzYW5pdGl6ZShzb21ldGhpbmcsIHNob3dFcnJvckluQ29uc29sZSA9IGZhbHNlKSB7XG4gIGxldCByZXN1bHQ7XG5cbiAgdHJ5IHtcbiAgICByZXN1bHQgPSBKU09OLnBhcnNlKFxuICAgICAgQ2lyY3VsYXJKU09OLnN0cmluZ2lmeShcbiAgICAgICAgc29tZXRoaW5nLFxuICAgICAgICBmdW5jdGlvbihrZXksIHZhbHVlKSB7XG4gICAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgcmV0dXJuIHZhbHVlLm5hbWUgPT09ICcnXG4gICAgICAgICAgICAgID8gJzxhbm9ueW1vdXM+J1xuICAgICAgICAgICAgICA6IGBmdW5jdGlvbiAke3ZhbHVlLm5hbWV9KClgO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICAgICAgcmV0dXJuIFNlcmlhbGl6ZUVycm9yKHZhbHVlKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICB9LFxuICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgIHRydWVcbiAgICAgIClcbiAgICApO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGlmIChzaG93RXJyb3JJbkNvbnNvbGUpIHtcbiAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICB9XG4gICAgcmVzdWx0ID0gbnVsbDtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuIiwiLyogZXNsaW50LWRpc2FibGUgKi9cbi8qIVxuQ29weXJpZ2h0IChDKSAyMDEzLTIwMTcgYnkgQW5kcmVhIEdpYW1tYXJjaGkgLSBAV2ViUmVmbGVjdGlvblxuXG5QZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG5vZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG5pbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG50byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG5jb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbmZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG5cblRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG5hbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cblxuVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG5GSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbkFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbkxJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG5PVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG5USEUgU09GVFdBUkUuXG5cbiovXG52YXJcbi8vIHNob3VsZCBiZSBhIG5vdCBzbyBjb21tb24gY2hhclxuLy8gcG9zc2libHkgb25lIEpTT04gZG9lcyBub3QgZW5jb2RlXG4vLyBwb3NzaWJseSBvbmUgZW5jb2RlVVJJQ29tcG9uZW50IGRvZXMgbm90IGVuY29kZVxuLy8gcmlnaHQgbm93IHRoaXMgY2hhciBpcyAnficgYnV0IHRoaXMgbWlnaHQgY2hhbmdlIGluIHRoZSBmdXR1cmVcbnNwZWNpYWxDaGFyID0gJ34nLFxuc2FmZVNwZWNpYWxDaGFyID0gJ1xcXFx4JyArIChcbiAgJzAnICsgc3BlY2lhbENoYXIuY2hhckNvZGVBdCgwKS50b1N0cmluZygxNilcbikuc2xpY2UoLTIpLFxuZXNjYXBlZFNhZmVTcGVjaWFsQ2hhciA9ICdcXFxcJyArIHNhZmVTcGVjaWFsQ2hhcixcbnNwZWNpYWxDaGFyUkcgPSBuZXcgUmVnRXhwKHNhZmVTcGVjaWFsQ2hhciwgJ2cnKSxcbnNhZmVTcGVjaWFsQ2hhclJHID0gbmV3IFJlZ0V4cChlc2NhcGVkU2FmZVNwZWNpYWxDaGFyLCAnZycpLFxuXG5zYWZlU3RhcnRXaXRoU3BlY2lhbENoYXJSRyA9IG5ldyBSZWdFeHAoJyg/Ol58KFteXFxcXFxcXFxdKSknICsgZXNjYXBlZFNhZmVTcGVjaWFsQ2hhciksXG5cbmluZGV4T2YgPSBbXS5pbmRleE9mIHx8IGZ1bmN0aW9uKHYpe1xuICBmb3IodmFyIGk9dGhpcy5sZW5ndGg7aS0tJiZ0aGlzW2ldIT09djspO1xuICByZXR1cm4gaTtcbn0sXG4kU3RyaW5nID0gU3RyaW5nICAvLyB0aGVyZSdzIG5vIHdheSB0byBkcm9wIHdhcm5pbmdzIGluIEpTSGludFxuICAgICAgICAgICAgICAgICAgLy8gYWJvdXQgbmV3IFN0cmluZyAuLi4gd2VsbCwgSSBuZWVkIHRoYXQgaGVyZSFcbiAgICAgICAgICAgICAgICAgIC8vIGZha2VkLCBhbmQgaGFwcHkgbGludGVyIVxuO1xuXG5mdW5jdGlvbiBnZW5lcmF0ZVJlcGxhY2VyKHZhbHVlLCByZXBsYWNlciwgcmVzb2x2ZSkge1xudmFyXG4gIGluc3BlY3QgPSAhIXJlcGxhY2VyLFxuICBwYXRoID0gW10sXG4gIGFsbCAgPSBbdmFsdWVdLFxuICBzZWVuID0gW3ZhbHVlXSxcbiAgbWFwcCA9IFtyZXNvbHZlID8gc3BlY2lhbENoYXIgOiAnPGNpcmN1bGFyPiddLFxuICBsYXN0ID0gdmFsdWUsXG4gIGx2bCAgPSAxLFxuICBpLCBmblxuO1xuaWYgKGluc3BlY3QpIHtcbiAgZm4gPSB0eXBlb2YgcmVwbGFjZXIgPT09ICdvYmplY3QnID9cbiAgICBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICAgICAgcmV0dXJuIGtleSAhPT0gJycgJiYgcmVwbGFjZXIuaW5kZXhPZihrZXkpIDwgMCA/IHZvaWQgMCA6IHZhbHVlO1xuICAgIH0gOlxuICAgIHJlcGxhY2VyO1xufVxucmV0dXJuIGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcbiAgLy8gdGhlIHJlcGxhY2VyIGhhcyByaWdodHMgdG8gZGVjaWRlXG4gIC8vIGlmIGEgbmV3IG9iamVjdCBzaG91bGQgYmUgcmV0dXJuZWRcbiAgLy8gb3IgaWYgdGhlcmUncyBzb21lIGtleSB0byBkcm9wXG4gIC8vIGxldCdzIGNhbGwgaXQgaGVyZSByYXRoZXIgdGhhbiBcInRvbyBsYXRlXCJcbiAgaWYgKGluc3BlY3QpIHZhbHVlID0gZm4uY2FsbCh0aGlzLCBrZXksIHZhbHVlKTtcblxuICAvLyBkaWQgeW91IGtub3cgPyBTYWZhcmkgcGFzc2VzIGtleXMgYXMgaW50ZWdlcnMgZm9yIGFycmF5c1xuICAvLyB3aGljaCBtZWFucyBpZiAoa2V5KSB3aGVuIGtleSA9PT0gMCB3b24ndCBwYXNzIHRoZSBjaGVja1xuICBpZiAoa2V5ICE9PSAnJykge1xuICAgIGlmIChsYXN0ICE9PSB0aGlzKSB7XG4gICAgICBpID0gbHZsIC0gaW5kZXhPZi5jYWxsKGFsbCwgdGhpcykgLSAxO1xuICAgICAgbHZsIC09IGk7XG4gICAgICBhbGwuc3BsaWNlKGx2bCwgYWxsLmxlbmd0aCk7XG4gICAgICBwYXRoLnNwbGljZShsdmwgLSAxLCBwYXRoLmxlbmd0aCk7XG4gICAgICBsYXN0ID0gdGhpcztcbiAgICB9XG4gICAgLy8gY29uc29sZS5sb2cobHZsLCBrZXksIHBhdGgpO1xuICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlKSB7XG4gICAgLy8gaWYgb2JqZWN0IGlzbid0IHJlZmVycmluZyB0byBwYXJlbnQgb2JqZWN0LCBhZGQgdG8gdGhlXG4gICAgICAvLyBvYmplY3QgcGF0aCBzdGFjay4gT3RoZXJ3aXNlIGl0IGlzIGFscmVhZHkgdGhlcmUuXG4gICAgICBpZiAoaW5kZXhPZi5jYWxsKGFsbCwgdmFsdWUpIDwgMCkge1xuICAgICAgICBhbGwucHVzaChsYXN0ID0gdmFsdWUpO1xuICAgICAgfVxuICAgICAgbHZsID0gYWxsLmxlbmd0aDtcbiAgICAgIGkgPSBpbmRleE9mLmNhbGwoc2VlbiwgdmFsdWUpO1xuICAgICAgaWYgKGkgPCAwKSB7XG4gICAgICAgIGkgPSBzZWVuLnB1c2godmFsdWUpIC0gMTtcbiAgICAgICAgaWYgKHJlc29sdmUpIHtcbiAgICAgICAgICAvLyBrZXkgY2Fubm90IGNvbnRhaW4gc3BlY2lhbENoYXIgYnV0IGNvdWxkIGJlIG5vdCBhIHN0cmluZ1xuICAgICAgICAgIHBhdGgucHVzaCgoJycgKyBrZXkpLnJlcGxhY2Uoc3BlY2lhbENoYXJSRywgc2FmZVNwZWNpYWxDaGFyKSk7XG4gICAgICAgICAgbWFwcFtpXSA9IHNwZWNpYWxDaGFyICsgcGF0aC5qb2luKHNwZWNpYWxDaGFyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBtYXBwW2ldID0gbWFwcFswXTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFsdWUgPSBtYXBwW2ldO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyAmJiByZXNvbHZlKSB7XG4gICAgICAgIC8vIGVuc3VyZSBubyBzcGVjaWFsIGNoYXIgaW52b2x2ZWQgb24gZGVzZXJpYWxpemF0aW9uXG4gICAgICAgIC8vIGluIHRoaXMgY2FzZSBvbmx5IGZpcnN0IGNoYXIgaXMgaW1wb3J0YW50XG4gICAgICAgIC8vIG5vIG5lZWQgdG8gcmVwbGFjZSBhbGwgdmFsdWUgKGJldHRlciBwZXJmb3JtYW5jZSlcbiAgICAgICAgdmFsdWUgPSB2YWx1ZSAucmVwbGFjZShzYWZlU3BlY2lhbENoYXIsIGVzY2FwZWRTYWZlU3BlY2lhbENoYXIpXG4gICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2Uoc3BlY2lhbENoYXIsIHNhZmVTcGVjaWFsQ2hhcik7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiB2YWx1ZTtcbn07XG59XG5cbmZ1bmN0aW9uIHJldHJpZXZlRnJvbVBhdGgoY3VycmVudCwga2V5cykge1xuZm9yKHZhciBpID0gMCwgbGVuZ3RoID0ga2V5cy5sZW5ndGg7IGkgPCBsZW5ndGg7IGN1cnJlbnQgPSBjdXJyZW50W1xuICAvLyBrZXlzIHNob3VsZCBiZSBub3JtYWxpemVkIGJhY2sgaGVyZVxuICBrZXlzW2krK10ucmVwbGFjZShzYWZlU3BlY2lhbENoYXJSRywgc3BlY2lhbENoYXIpXG5dKTtcbnJldHVybiBjdXJyZW50O1xufVxuXG5mdW5jdGlvbiBnZW5lcmF0ZVJldml2ZXIocmV2aXZlcikge1xucmV0dXJuIGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcbiAgdmFyIGlzU3RyaW5nID0gdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJztcbiAgaWYgKGlzU3RyaW5nICYmIHZhbHVlLmNoYXJBdCgwKSA9PT0gc3BlY2lhbENoYXIpIHtcbiAgICByZXR1cm4gbmV3ICRTdHJpbmcodmFsdWUuc2xpY2UoMSkpO1xuICB9XG4gIGlmIChrZXkgPT09ICcnKSB2YWx1ZSA9IHJlZ2VuZXJhdGUodmFsdWUsIHZhbHVlLCB7fSk7XG4gIC8vIGFnYWluLCBvbmx5IG9uZSBuZWVkZWQsIGRvIG5vdCB1c2UgdGhlIFJlZ0V4cCBmb3IgdGhpcyByZXBsYWNlbWVudFxuICAvLyBvbmx5IGtleXMgbmVlZCB0aGUgUmVnRXhwXG4gIGlmIChpc1N0cmluZykgdmFsdWUgPSB2YWx1ZSAucmVwbGFjZShzYWZlU3RhcnRXaXRoU3BlY2lhbENoYXJSRywgJyQxJyArIHNwZWNpYWxDaGFyKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoZXNjYXBlZFNhZmVTcGVjaWFsQ2hhciwgc2FmZVNwZWNpYWxDaGFyKTtcbiAgcmV0dXJuIHJldml2ZXIgPyByZXZpdmVyLmNhbGwodGhpcywga2V5LCB2YWx1ZSkgOiB2YWx1ZTtcbn07XG59XG5cbmZ1bmN0aW9uIHJlZ2VuZXJhdGVBcnJheShyb290LCBjdXJyZW50LCByZXRyaWV2ZSkge1xuZm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IGN1cnJlbnQubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgY3VycmVudFtpXSA9IHJlZ2VuZXJhdGUocm9vdCwgY3VycmVudFtpXSwgcmV0cmlldmUpO1xufVxucmV0dXJuIGN1cnJlbnQ7XG59XG5cbmZ1bmN0aW9uIHJlZ2VuZXJhdGVPYmplY3Qocm9vdCwgY3VycmVudCwgcmV0cmlldmUpIHtcbmZvciAodmFyIGtleSBpbiBjdXJyZW50KSB7XG4gIGlmIChjdXJyZW50Lmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICBjdXJyZW50W2tleV0gPSByZWdlbmVyYXRlKHJvb3QsIGN1cnJlbnRba2V5XSwgcmV0cmlldmUpO1xuICB9XG59XG5yZXR1cm4gY3VycmVudDtcbn1cblxuZnVuY3Rpb24gcmVnZW5lcmF0ZShyb290LCBjdXJyZW50LCByZXRyaWV2ZSkge1xucmV0dXJuIGN1cnJlbnQgaW5zdGFuY2VvZiBBcnJheSA/XG4gIC8vIGZhc3QgQXJyYXkgcmVjb25zdHJ1Y3Rpb25cbiAgcmVnZW5lcmF0ZUFycmF5KHJvb3QsIGN1cnJlbnQsIHJldHJpZXZlKSA6XG4gIChcbiAgICBjdXJyZW50IGluc3RhbmNlb2YgJFN0cmluZyA/XG4gICAgICAoXG4gICAgICAgIC8vIHJvb3QgaXMgYW4gZW1wdHkgc3RyaW5nXG4gICAgICAgIGN1cnJlbnQubGVuZ3RoID9cbiAgICAgICAgICAoXG4gICAgICAgICAgICByZXRyaWV2ZS5oYXNPd25Qcm9wZXJ0eShjdXJyZW50KSA/XG4gICAgICAgICAgICAgIHJldHJpZXZlW2N1cnJlbnRdIDpcbiAgICAgICAgICAgICAgcmV0cmlldmVbY3VycmVudF0gPSByZXRyaWV2ZUZyb21QYXRoKFxuICAgICAgICAgICAgICAgIHJvb3QsIGN1cnJlbnQuc3BsaXQoc3BlY2lhbENoYXIpXG4gICAgICAgICAgICAgIClcbiAgICAgICAgICApIDpcbiAgICAgICAgICByb290XG4gICAgICApIDpcbiAgICAgIChcbiAgICAgICAgY3VycmVudCBpbnN0YW5jZW9mIE9iamVjdCA/XG4gICAgICAgICAgLy8gZGVkaWNhdGVkIE9iamVjdCBwYXJzZXJcbiAgICAgICAgICByZWdlbmVyYXRlT2JqZWN0KHJvb3QsIGN1cnJlbnQsIHJldHJpZXZlKSA6XG4gICAgICAgICAgLy8gdmFsdWUgYXMgaXQgaXNcbiAgICAgICAgICBjdXJyZW50XG4gICAgICApXG4gIClcbjtcbn1cblxuZnVuY3Rpb24gc3RyaW5naWZ5UmVjdXJzaW9uKHZhbHVlLCByZXBsYWNlciwgc3BhY2UsIGRvTm90UmVzb2x2ZSkge1xucmV0dXJuIEpTT04uc3RyaW5naWZ5KHZhbHVlLCBnZW5lcmF0ZVJlcGxhY2VyKHZhbHVlLCByZXBsYWNlciwgIWRvTm90UmVzb2x2ZSksIHNwYWNlKTtcbn1cblxuZnVuY3Rpb24gcGFyc2VSZWN1cnNpb24odGV4dCwgcmV2aXZlcikge1xucmV0dXJuIEpTT04ucGFyc2UodGV4dCwgZ2VuZXJhdGVSZXZpdmVyKHJldml2ZXIpKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQge1xuICBzdHJpbmdpZnk6IHN0cmluZ2lmeVJlY3Vyc2lvbixcbiAgcGFyc2U6IHBhcnNlUmVjdXJzaW9uXG59IiwiLyogZXNsaW50LWRpc2FibGUgKi9cbi8vIENyZWRpdHM6IGh0dHBzOi8vZ2l0aHViLmNvbS9zaW5kcmVzb3JodXMvc2VyaWFsaXplLWVycm9yXG5cbid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSB2YWx1ZSA9PiB7XG5cdGlmICh0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnKSB7XG5cdFx0cmV0dXJuIGRlc3Ryb3lDaXJjdWxhcih2YWx1ZSwgW10pO1xuXHR9XG5cblx0Ly8gUGVvcGxlIHNvbWV0aW1lcyB0aHJvdyB0aGluZ3MgYmVzaWRlcyBFcnJvciBvYmplY3RzLCBzb+KAplxuXG5cdGlmICh0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbicpIHtcblx0XHQvLyBKU09OLnN0cmluZ2lmeSBkaXNjYXJkcyBmdW5jdGlvbnMuIFdlIGRvIHRvbywgdW5sZXNzIGEgZnVuY3Rpb24gaXMgdGhyb3duIGRpcmVjdGx5LlxuXHRcdHJldHVybiBgW0Z1bmN0aW9uOiAkeyh2YWx1ZS5uYW1lIHx8ICdhbm9ueW1vdXMnKX1dYDtcblx0fVxuXG5cdHJldHVybiB2YWx1ZTtcbn07XG5cbi8vIGh0dHBzOi8vd3d3Lm5wbWpzLmNvbS9wYWNrYWdlL2Rlc3Ryb3ktY2lyY3VsYXJcbmZ1bmN0aW9uIGRlc3Ryb3lDaXJjdWxhcihmcm9tLCBzZWVuKSB7XG5cdGNvbnN0IHRvID0gQXJyYXkuaXNBcnJheShmcm9tKSA/IFtdIDoge307XG5cblx0c2Vlbi5wdXNoKGZyb20pO1xuXG5cdGZvciAoY29uc3Qga2V5IG9mIE9iamVjdC5rZXlzKGZyb20pKSB7XG5cdFx0Y29uc3QgdmFsdWUgPSBmcm9tW2tleV07XG5cblx0XHRpZiAodHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRjb250aW51ZTtcblx0XHR9XG5cblx0XHRpZiAoIXZhbHVlIHx8IHR5cGVvZiB2YWx1ZSAhPT0gJ29iamVjdCcpIHtcblx0XHRcdHRvW2tleV0gPSB2YWx1ZTtcblx0XHRcdGNvbnRpbnVlO1xuXHRcdH1cblxuXHRcdGlmIChzZWVuLmluZGV4T2YoZnJvbVtrZXldKSA9PT0gLTEpIHtcblx0XHRcdHRvW2tleV0gPSBkZXN0cm95Q2lyY3VsYXIoZnJvbVtrZXldLCBzZWVuLnNsaWNlKDApKTtcblx0XHRcdGNvbnRpbnVlO1xuXHRcdH1cblxuXHRcdHRvW2tleV0gPSAnW0NpcmN1bGFyXSc7XG5cdH1cblxuXHRpZiAodHlwZW9mIGZyb20ubmFtZSA9PT0gJ3N0cmluZycpIHtcblx0XHR0by5uYW1lID0gZnJvbS5uYW1lO1xuXHR9XG5cblx0aWYgKHR5cGVvZiBmcm9tLm1lc3NhZ2UgPT09ICdzdHJpbmcnKSB7XG5cdFx0dG8ubWVzc2FnZSA9IGZyb20ubWVzc2FnZTtcblx0fVxuXG5cdGlmICh0eXBlb2YgZnJvbS5zdGFjayA9PT0gJ3N0cmluZycpIHtcblx0XHR0by5zdGFjayA9IGZyb20uc3RhY2s7XG5cdH1cblxuXHRyZXR1cm4gdG87XG59IiwiZXhwb3J0IGNvbnN0IGdldEZ1bmNOYW1lID0gZnVuYyA9PiB7XG4gIGlmIChmdW5jLm5hbWUpIHJldHVybiBmdW5jLm5hbWU7XG4gIGNvbnN0IHJlc3VsdCA9IC9eZnVuY3Rpb25cXHMrKFtcXHdcXCRdKylcXHMqXFwoLy5leGVjKGZ1bmMudG9TdHJpbmcoKSk7XG5cbiAgcmV0dXJuIHJlc3VsdCA/IHJlc3VsdFsxXSA6ICd1bmtub3duJztcbn07XG5cbmxldCBpZHMgPSAwO1xuXG5leHBvcnQgY29uc3QgZ2V0SWQgPSBwcmVmaXggPT4gYCR7cHJlZml4fV8keysraWRzfWA7XG5cbmV4cG9ydCBmdW5jdGlvbiBpc09iamVjdEVtcHR5KG9iaikge1xuICBmb3IgKGNvbnN0IHByb3AgaW4gb2JqKSB7XG4gICAgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShwcm9wKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cbmV4cG9ydCBmdW5jdGlvbiByZXF1aXJlT2JqZWN0KG9iaikge1xuICBpZiAoXG4gICAgdHlwZW9mIG9iaiA9PT0gJ3VuZGVmaW5lZCcgfHxcbiAgICBvYmogPT09IG51bGwgfHxcbiAgICAodHlwZW9mIG9iaiAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIG9iaiAhPT0gJ29iamVjdCcpXG4gICkge1xuICAgIHRocm93IG5ldyBFcnJvcihgQSBrZXktdmFsdWUgb2JqZWN0IGV4cGVjdGVkLiBJbnN0ZWFkIFwiJHtvYmp9XCIgcGFzc2VkLmApO1xuICB9XG59XG5leHBvcnQgY29uc3QgYWNjdW11bGF0ZSA9IChjdXJyZW50LCBuZXdEYXRhKSA9PiAoeyAuLi5jdXJyZW50LCAuLi5uZXdEYXRhIH0pO1xuZXhwb3J0IGNvbnN0IGlzUHJvbWlzZSA9IG9iaiA9PiBvYmogJiYgdHlwZW9mIG9iai50aGVuID09PSAnZnVuY3Rpb24nO1xuZXhwb3J0IGNvbnN0IGlzT2JqZWN0TGl0ZXJhbCA9IG9iaiA9PlxuICBvYmogPyBvYmouY29uc3RydWN0b3IgPT09IHt9LmNvbnN0cnVjdG9yIDogZmFsc2U7XG5leHBvcnQgY29uc3QgaXNHZW5lcmF0b3IgPSBvYmogPT5cbiAgb2JqICYmIHR5cGVvZiBvYmoubmV4dCA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2Ygb2JqLnRocm93ID09PSAnZnVuY3Rpb24nO1xuZXhwb3J0IGNvbnN0IGlzR2VuZXJhdG9yRnVuY3Rpb24gPSBmbiA9PiB7XG4gIGNvbnN0IHsgY29uc3RydWN0b3IgfSA9IGZuO1xuICBpZiAoIWNvbnN0cnVjdG9yKSByZXR1cm4gZmFsc2U7XG4gIGlmIChcbiAgICBjb25zdHJ1Y3Rvci5uYW1lID09PSAnR2VuZXJhdG9yRnVuY3Rpb24nIHx8XG4gICAgY29uc3RydWN0b3IuZGlzcGxheU5hbWUgPT09ICdHZW5lcmF0b3JGdW5jdGlvbidcbiAgKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIGlzR2VuZXJhdG9yKGNvbnN0cnVjdG9yLnByb3RvdHlwZSk7XG59O1xuZXhwb3J0IGZ1bmN0aW9uIHJlc2V0SWRzKCkge1xuICBpZHMgPSAwO1xufVxuZXhwb3J0IGZ1bmN0aW9uIHNldFByb3Aod2hvLCBwcm9wTmFtZSwgdmFsdWUpIHtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHdobywgcHJvcE5hbWUsIHtcbiAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICB2YWx1ZSxcbiAgfSk7XG59XG4iLCJmdW5jdGlvbiBfdGFnZ2VkVGVtcGxhdGVMaXRlcmFsKHN0cmluZ3MsIHJhdykge1xuICBpZiAoIXJhdykge1xuICAgIHJhdyA9IHN0cmluZ3Muc2xpY2UoMCk7XG4gIH1cblxuICByZXR1cm4gT2JqZWN0LmZyZWV6ZShPYmplY3QuZGVmaW5lUHJvcGVydGllcyhzdHJpbmdzLCB7XG4gICAgcmF3OiB7XG4gICAgICB2YWx1ZTogT2JqZWN0LmZyZWV6ZShyYXcpXG4gICAgfVxuICB9KSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gX3RhZ2dlZFRlbXBsYXRlTGl0ZXJhbDsiLCIvKipcbiAqIENvcHlyaWdodCAoYykgMjAxNC1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbnZhciBydW50aW1lID0gKGZ1bmN0aW9uIChleHBvcnRzKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuXG4gIHZhciBPcCA9IE9iamVjdC5wcm90b3R5cGU7XG4gIHZhciBoYXNPd24gPSBPcC5oYXNPd25Qcm9wZXJ0eTtcbiAgdmFyIHVuZGVmaW5lZDsgLy8gTW9yZSBjb21wcmVzc2libGUgdGhhbiB2b2lkIDAuXG4gIHZhciAkU3ltYm9sID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiID8gU3ltYm9sIDoge307XG4gIHZhciBpdGVyYXRvclN5bWJvbCA9ICRTeW1ib2wuaXRlcmF0b3IgfHwgXCJAQGl0ZXJhdG9yXCI7XG4gIHZhciBhc3luY0l0ZXJhdG9yU3ltYm9sID0gJFN5bWJvbC5hc3luY0l0ZXJhdG9yIHx8IFwiQEBhc3luY0l0ZXJhdG9yXCI7XG4gIHZhciB0b1N0cmluZ1RhZ1N5bWJvbCA9ICRTeW1ib2wudG9TdHJpbmdUYWcgfHwgXCJAQHRvU3RyaW5nVGFnXCI7XG5cbiAgZnVuY3Rpb24gd3JhcChpbm5lckZuLCBvdXRlckZuLCBzZWxmLCB0cnlMb2NzTGlzdCkge1xuICAgIC8vIElmIG91dGVyRm4gcHJvdmlkZWQgYW5kIG91dGVyRm4ucHJvdG90eXBlIGlzIGEgR2VuZXJhdG9yLCB0aGVuIG91dGVyRm4ucHJvdG90eXBlIGluc3RhbmNlb2YgR2VuZXJhdG9yLlxuICAgIHZhciBwcm90b0dlbmVyYXRvciA9IG91dGVyRm4gJiYgb3V0ZXJGbi5wcm90b3R5cGUgaW5zdGFuY2VvZiBHZW5lcmF0b3IgPyBvdXRlckZuIDogR2VuZXJhdG9yO1xuICAgIHZhciBnZW5lcmF0b3IgPSBPYmplY3QuY3JlYXRlKHByb3RvR2VuZXJhdG9yLnByb3RvdHlwZSk7XG4gICAgdmFyIGNvbnRleHQgPSBuZXcgQ29udGV4dCh0cnlMb2NzTGlzdCB8fCBbXSk7XG5cbiAgICAvLyBUaGUgLl9pbnZva2UgbWV0aG9kIHVuaWZpZXMgdGhlIGltcGxlbWVudGF0aW9ucyBvZiB0aGUgLm5leHQsXG4gICAgLy8gLnRocm93LCBhbmQgLnJldHVybiBtZXRob2RzLlxuICAgIGdlbmVyYXRvci5faW52b2tlID0gbWFrZUludm9rZU1ldGhvZChpbm5lckZuLCBzZWxmLCBjb250ZXh0KTtcblxuICAgIHJldHVybiBnZW5lcmF0b3I7XG4gIH1cbiAgZXhwb3J0cy53cmFwID0gd3JhcDtcblxuICAvLyBUcnkvY2F0Y2ggaGVscGVyIHRvIG1pbmltaXplIGRlb3B0aW1pemF0aW9ucy4gUmV0dXJucyBhIGNvbXBsZXRpb25cbiAgLy8gcmVjb3JkIGxpa2UgY29udGV4dC50cnlFbnRyaWVzW2ldLmNvbXBsZXRpb24uIFRoaXMgaW50ZXJmYWNlIGNvdWxkXG4gIC8vIGhhdmUgYmVlbiAoYW5kIHdhcyBwcmV2aW91c2x5KSBkZXNpZ25lZCB0byB0YWtlIGEgY2xvc3VyZSB0byBiZVxuICAvLyBpbnZva2VkIHdpdGhvdXQgYXJndW1lbnRzLCBidXQgaW4gYWxsIHRoZSBjYXNlcyB3ZSBjYXJlIGFib3V0IHdlXG4gIC8vIGFscmVhZHkgaGF2ZSBhbiBleGlzdGluZyBtZXRob2Qgd2Ugd2FudCB0byBjYWxsLCBzbyB0aGVyZSdzIG5vIG5lZWRcbiAgLy8gdG8gY3JlYXRlIGEgbmV3IGZ1bmN0aW9uIG9iamVjdC4gV2UgY2FuIGV2ZW4gZ2V0IGF3YXkgd2l0aCBhc3N1bWluZ1xuICAvLyB0aGUgbWV0aG9kIHRha2VzIGV4YWN0bHkgb25lIGFyZ3VtZW50LCBzaW5jZSB0aGF0IGhhcHBlbnMgdG8gYmUgdHJ1ZVxuICAvLyBpbiBldmVyeSBjYXNlLCBzbyB3ZSBkb24ndCBoYXZlIHRvIHRvdWNoIHRoZSBhcmd1bWVudHMgb2JqZWN0LiBUaGVcbiAgLy8gb25seSBhZGRpdGlvbmFsIGFsbG9jYXRpb24gcmVxdWlyZWQgaXMgdGhlIGNvbXBsZXRpb24gcmVjb3JkLCB3aGljaFxuICAvLyBoYXMgYSBzdGFibGUgc2hhcGUgYW5kIHNvIGhvcGVmdWxseSBzaG91bGQgYmUgY2hlYXAgdG8gYWxsb2NhdGUuXG4gIGZ1bmN0aW9uIHRyeUNhdGNoKGZuLCBvYmosIGFyZykge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4geyB0eXBlOiBcIm5vcm1hbFwiLCBhcmc6IGZuLmNhbGwob2JqLCBhcmcpIH07XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICByZXR1cm4geyB0eXBlOiBcInRocm93XCIsIGFyZzogZXJyIH07XG4gICAgfVxuICB9XG5cbiAgdmFyIEdlblN0YXRlU3VzcGVuZGVkU3RhcnQgPSBcInN1c3BlbmRlZFN0YXJ0XCI7XG4gIHZhciBHZW5TdGF0ZVN1c3BlbmRlZFlpZWxkID0gXCJzdXNwZW5kZWRZaWVsZFwiO1xuICB2YXIgR2VuU3RhdGVFeGVjdXRpbmcgPSBcImV4ZWN1dGluZ1wiO1xuICB2YXIgR2VuU3RhdGVDb21wbGV0ZWQgPSBcImNvbXBsZXRlZFwiO1xuXG4gIC8vIFJldHVybmluZyB0aGlzIG9iamVjdCBmcm9tIHRoZSBpbm5lckZuIGhhcyB0aGUgc2FtZSBlZmZlY3QgYXNcbiAgLy8gYnJlYWtpbmcgb3V0IG9mIHRoZSBkaXNwYXRjaCBzd2l0Y2ggc3RhdGVtZW50LlxuICB2YXIgQ29udGludWVTZW50aW5lbCA9IHt9O1xuXG4gIC8vIER1bW15IGNvbnN0cnVjdG9yIGZ1bmN0aW9ucyB0aGF0IHdlIHVzZSBhcyB0aGUgLmNvbnN0cnVjdG9yIGFuZFxuICAvLyAuY29uc3RydWN0b3IucHJvdG90eXBlIHByb3BlcnRpZXMgZm9yIGZ1bmN0aW9ucyB0aGF0IHJldHVybiBHZW5lcmF0b3JcbiAgLy8gb2JqZWN0cy4gRm9yIGZ1bGwgc3BlYyBjb21wbGlhbmNlLCB5b3UgbWF5IHdpc2ggdG8gY29uZmlndXJlIHlvdXJcbiAgLy8gbWluaWZpZXIgbm90IHRvIG1hbmdsZSB0aGUgbmFtZXMgb2YgdGhlc2UgdHdvIGZ1bmN0aW9ucy5cbiAgZnVuY3Rpb24gR2VuZXJhdG9yKCkge31cbiAgZnVuY3Rpb24gR2VuZXJhdG9yRnVuY3Rpb24oKSB7fVxuICBmdW5jdGlvbiBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZSgpIHt9XG5cbiAgLy8gVGhpcyBpcyBhIHBvbHlmaWxsIGZvciAlSXRlcmF0b3JQcm90b3R5cGUlIGZvciBlbnZpcm9ubWVudHMgdGhhdFxuICAvLyBkb24ndCBuYXRpdmVseSBzdXBwb3J0IGl0LlxuICB2YXIgSXRlcmF0b3JQcm90b3R5cGUgPSB7fTtcbiAgSXRlcmF0b3JQcm90b3R5cGVbaXRlcmF0b3JTeW1ib2xdID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIHZhciBnZXRQcm90byA9IE9iamVjdC5nZXRQcm90b3R5cGVPZjtcbiAgdmFyIE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlID0gZ2V0UHJvdG8gJiYgZ2V0UHJvdG8oZ2V0UHJvdG8odmFsdWVzKFtdKSkpO1xuICBpZiAoTmF0aXZlSXRlcmF0b3JQcm90b3R5cGUgJiZcbiAgICAgIE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlICE9PSBPcCAmJlxuICAgICAgaGFzT3duLmNhbGwoTmF0aXZlSXRlcmF0b3JQcm90b3R5cGUsIGl0ZXJhdG9yU3ltYm9sKSkge1xuICAgIC8vIFRoaXMgZW52aXJvbm1lbnQgaGFzIGEgbmF0aXZlICVJdGVyYXRvclByb3RvdHlwZSU7IHVzZSBpdCBpbnN0ZWFkXG4gICAgLy8gb2YgdGhlIHBvbHlmaWxsLlxuICAgIEl0ZXJhdG9yUHJvdG90eXBlID0gTmF0aXZlSXRlcmF0b3JQcm90b3R5cGU7XG4gIH1cblxuICB2YXIgR3AgPSBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZS5wcm90b3R5cGUgPVxuICAgIEdlbmVyYXRvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEl0ZXJhdG9yUHJvdG90eXBlKTtcbiAgR2VuZXJhdG9yRnVuY3Rpb24ucHJvdG90eXBlID0gR3AuY29uc3RydWN0b3IgPSBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZTtcbiAgR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUuY29uc3RydWN0b3IgPSBHZW5lcmF0b3JGdW5jdGlvbjtcbiAgR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGVbdG9TdHJpbmdUYWdTeW1ib2xdID1cbiAgICBHZW5lcmF0b3JGdW5jdGlvbi5kaXNwbGF5TmFtZSA9IFwiR2VuZXJhdG9yRnVuY3Rpb25cIjtcblxuICAvLyBIZWxwZXIgZm9yIGRlZmluaW5nIHRoZSAubmV4dCwgLnRocm93LCBhbmQgLnJldHVybiBtZXRob2RzIG9mIHRoZVxuICAvLyBJdGVyYXRvciBpbnRlcmZhY2UgaW4gdGVybXMgb2YgYSBzaW5nbGUgLl9pbnZva2UgbWV0aG9kLlxuICBmdW5jdGlvbiBkZWZpbmVJdGVyYXRvck1ldGhvZHMocHJvdG90eXBlKSB7XG4gICAgW1wibmV4dFwiLCBcInRocm93XCIsIFwicmV0dXJuXCJdLmZvckVhY2goZnVuY3Rpb24obWV0aG9kKSB7XG4gICAgICBwcm90b3R5cGVbbWV0aG9kXSA9IGZ1bmN0aW9uKGFyZykge1xuICAgICAgICByZXR1cm4gdGhpcy5faW52b2tlKG1ldGhvZCwgYXJnKTtcbiAgICAgIH07XG4gICAgfSk7XG4gIH1cblxuICBleHBvcnRzLmlzR2VuZXJhdG9yRnVuY3Rpb24gPSBmdW5jdGlvbihnZW5GdW4pIHtcbiAgICB2YXIgY3RvciA9IHR5cGVvZiBnZW5GdW4gPT09IFwiZnVuY3Rpb25cIiAmJiBnZW5GdW4uY29uc3RydWN0b3I7XG4gICAgcmV0dXJuIGN0b3JcbiAgICAgID8gY3RvciA9PT0gR2VuZXJhdG9yRnVuY3Rpb24gfHxcbiAgICAgICAgLy8gRm9yIHRoZSBuYXRpdmUgR2VuZXJhdG9yRnVuY3Rpb24gY29uc3RydWN0b3IsIHRoZSBiZXN0IHdlIGNhblxuICAgICAgICAvLyBkbyBpcyB0byBjaGVjayBpdHMgLm5hbWUgcHJvcGVydHkuXG4gICAgICAgIChjdG9yLmRpc3BsYXlOYW1lIHx8IGN0b3IubmFtZSkgPT09IFwiR2VuZXJhdG9yRnVuY3Rpb25cIlxuICAgICAgOiBmYWxzZTtcbiAgfTtcblxuICBleHBvcnRzLm1hcmsgPSBmdW5jdGlvbihnZW5GdW4pIHtcbiAgICBpZiAoT2JqZWN0LnNldFByb3RvdHlwZU9mKSB7XG4gICAgICBPYmplY3Quc2V0UHJvdG90eXBlT2YoZ2VuRnVuLCBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGdlbkZ1bi5fX3Byb3RvX18gPSBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZTtcbiAgICAgIGlmICghKHRvU3RyaW5nVGFnU3ltYm9sIGluIGdlbkZ1bikpIHtcbiAgICAgICAgZ2VuRnVuW3RvU3RyaW5nVGFnU3ltYm9sXSA9IFwiR2VuZXJhdG9yRnVuY3Rpb25cIjtcbiAgICAgIH1cbiAgICB9XG4gICAgZ2VuRnVuLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoR3ApO1xuICAgIHJldHVybiBnZW5GdW47XG4gIH07XG5cbiAgLy8gV2l0aGluIHRoZSBib2R5IG9mIGFueSBhc3luYyBmdW5jdGlvbiwgYGF3YWl0IHhgIGlzIHRyYW5zZm9ybWVkIHRvXG4gIC8vIGB5aWVsZCByZWdlbmVyYXRvclJ1bnRpbWUuYXdyYXAoeClgLCBzbyB0aGF0IHRoZSBydW50aW1lIGNhbiB0ZXN0XG4gIC8vIGBoYXNPd24uY2FsbCh2YWx1ZSwgXCJfX2F3YWl0XCIpYCB0byBkZXRlcm1pbmUgaWYgdGhlIHlpZWxkZWQgdmFsdWUgaXNcbiAgLy8gbWVhbnQgdG8gYmUgYXdhaXRlZC5cbiAgZXhwb3J0cy5hd3JhcCA9IGZ1bmN0aW9uKGFyZykge1xuICAgIHJldHVybiB7IF9fYXdhaXQ6IGFyZyB9O1xuICB9O1xuXG4gIGZ1bmN0aW9uIEFzeW5jSXRlcmF0b3IoZ2VuZXJhdG9yKSB7XG4gICAgZnVuY3Rpb24gaW52b2tlKG1ldGhvZCwgYXJnLCByZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIHZhciByZWNvcmQgPSB0cnlDYXRjaChnZW5lcmF0b3JbbWV0aG9kXSwgZ2VuZXJhdG9yLCBhcmcpO1xuICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgcmVqZWN0KHJlY29yZC5hcmcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IHJlY29yZC5hcmc7XG4gICAgICAgIHZhciB2YWx1ZSA9IHJlc3VsdC52YWx1ZTtcbiAgICAgICAgaWYgKHZhbHVlICYmXG4gICAgICAgICAgICB0eXBlb2YgdmFsdWUgPT09IFwib2JqZWN0XCIgJiZcbiAgICAgICAgICAgIGhhc093bi5jYWxsKHZhbHVlLCBcIl9fYXdhaXRcIikpIHtcbiAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHZhbHVlLl9fYXdhaXQpLnRoZW4oZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIGludm9rZShcIm5leHRcIiwgdmFsdWUsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgICAgfSwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgICBpbnZva2UoXCJ0aHJvd1wiLCBlcnIsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHZhbHVlKS50aGVuKGZ1bmN0aW9uKHVud3JhcHBlZCkge1xuICAgICAgICAgIC8vIFdoZW4gYSB5aWVsZGVkIFByb21pc2UgaXMgcmVzb2x2ZWQsIGl0cyBmaW5hbCB2YWx1ZSBiZWNvbWVzXG4gICAgICAgICAgLy8gdGhlIC52YWx1ZSBvZiB0aGUgUHJvbWlzZTx7dmFsdWUsZG9uZX0+IHJlc3VsdCBmb3IgdGhlXG4gICAgICAgICAgLy8gY3VycmVudCBpdGVyYXRpb24uXG4gICAgICAgICAgcmVzdWx0LnZhbHVlID0gdW53cmFwcGVkO1xuICAgICAgICAgIHJlc29sdmUocmVzdWx0KTtcbiAgICAgICAgfSwgZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgICAvLyBJZiBhIHJlamVjdGVkIFByb21pc2Ugd2FzIHlpZWxkZWQsIHRocm93IHRoZSByZWplY3Rpb24gYmFja1xuICAgICAgICAgIC8vIGludG8gdGhlIGFzeW5jIGdlbmVyYXRvciBmdW5jdGlvbiBzbyBpdCBjYW4gYmUgaGFuZGxlZCB0aGVyZS5cbiAgICAgICAgICByZXR1cm4gaW52b2tlKFwidGhyb3dcIiwgZXJyb3IsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBwcmV2aW91c1Byb21pc2U7XG5cbiAgICBmdW5jdGlvbiBlbnF1ZXVlKG1ldGhvZCwgYXJnKSB7XG4gICAgICBmdW5jdGlvbiBjYWxsSW52b2tlV2l0aE1ldGhvZEFuZEFyZygpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgIGludm9rZShtZXRob2QsIGFyZywgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBwcmV2aW91c1Byb21pc2UgPVxuICAgICAgICAvLyBJZiBlbnF1ZXVlIGhhcyBiZWVuIGNhbGxlZCBiZWZvcmUsIHRoZW4gd2Ugd2FudCB0byB3YWl0IHVudGlsXG4gICAgICAgIC8vIGFsbCBwcmV2aW91cyBQcm9taXNlcyBoYXZlIGJlZW4gcmVzb2x2ZWQgYmVmb3JlIGNhbGxpbmcgaW52b2tlLFxuICAgICAgICAvLyBzbyB0aGF0IHJlc3VsdHMgYXJlIGFsd2F5cyBkZWxpdmVyZWQgaW4gdGhlIGNvcnJlY3Qgb3JkZXIuIElmXG4gICAgICAgIC8vIGVucXVldWUgaGFzIG5vdCBiZWVuIGNhbGxlZCBiZWZvcmUsIHRoZW4gaXQgaXMgaW1wb3J0YW50IHRvXG4gICAgICAgIC8vIGNhbGwgaW52b2tlIGltbWVkaWF0ZWx5LCB3aXRob3V0IHdhaXRpbmcgb24gYSBjYWxsYmFjayB0byBmaXJlLFxuICAgICAgICAvLyBzbyB0aGF0IHRoZSBhc3luYyBnZW5lcmF0b3IgZnVuY3Rpb24gaGFzIHRoZSBvcHBvcnR1bml0eSB0byBkb1xuICAgICAgICAvLyBhbnkgbmVjZXNzYXJ5IHNldHVwIGluIGEgcHJlZGljdGFibGUgd2F5LiBUaGlzIHByZWRpY3RhYmlsaXR5XG4gICAgICAgIC8vIGlzIHdoeSB0aGUgUHJvbWlzZSBjb25zdHJ1Y3RvciBzeW5jaHJvbm91c2x5IGludm9rZXMgaXRzXG4gICAgICAgIC8vIGV4ZWN1dG9yIGNhbGxiYWNrLCBhbmQgd2h5IGFzeW5jIGZ1bmN0aW9ucyBzeW5jaHJvbm91c2x5XG4gICAgICAgIC8vIGV4ZWN1dGUgY29kZSBiZWZvcmUgdGhlIGZpcnN0IGF3YWl0LiBTaW5jZSB3ZSBpbXBsZW1lbnQgc2ltcGxlXG4gICAgICAgIC8vIGFzeW5jIGZ1bmN0aW9ucyBpbiB0ZXJtcyBvZiBhc3luYyBnZW5lcmF0b3JzLCBpdCBpcyBlc3BlY2lhbGx5XG4gICAgICAgIC8vIGltcG9ydGFudCB0byBnZXQgdGhpcyByaWdodCwgZXZlbiB0aG91Z2ggaXQgcmVxdWlyZXMgY2FyZS5cbiAgICAgICAgcHJldmlvdXNQcm9taXNlID8gcHJldmlvdXNQcm9taXNlLnRoZW4oXG4gICAgICAgICAgY2FsbEludm9rZVdpdGhNZXRob2RBbmRBcmcsXG4gICAgICAgICAgLy8gQXZvaWQgcHJvcGFnYXRpbmcgZmFpbHVyZXMgdG8gUHJvbWlzZXMgcmV0dXJuZWQgYnkgbGF0ZXJcbiAgICAgICAgICAvLyBpbnZvY2F0aW9ucyBvZiB0aGUgaXRlcmF0b3IuXG4gICAgICAgICAgY2FsbEludm9rZVdpdGhNZXRob2RBbmRBcmdcbiAgICAgICAgKSA6IGNhbGxJbnZva2VXaXRoTWV0aG9kQW5kQXJnKCk7XG4gICAgfVxuXG4gICAgLy8gRGVmaW5lIHRoZSB1bmlmaWVkIGhlbHBlciBtZXRob2QgdGhhdCBpcyB1c2VkIHRvIGltcGxlbWVudCAubmV4dCxcbiAgICAvLyAudGhyb3csIGFuZCAucmV0dXJuIChzZWUgZGVmaW5lSXRlcmF0b3JNZXRob2RzKS5cbiAgICB0aGlzLl9pbnZva2UgPSBlbnF1ZXVlO1xuICB9XG5cbiAgZGVmaW5lSXRlcmF0b3JNZXRob2RzKEFzeW5jSXRlcmF0b3IucHJvdG90eXBlKTtcbiAgQXN5bmNJdGVyYXRvci5wcm90b3R5cGVbYXN5bmNJdGVyYXRvclN5bWJvbF0gPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG4gIGV4cG9ydHMuQXN5bmNJdGVyYXRvciA9IEFzeW5jSXRlcmF0b3I7XG5cbiAgLy8gTm90ZSB0aGF0IHNpbXBsZSBhc3luYyBmdW5jdGlvbnMgYXJlIGltcGxlbWVudGVkIG9uIHRvcCBvZlxuICAvLyBBc3luY0l0ZXJhdG9yIG9iamVjdHM7IHRoZXkganVzdCByZXR1cm4gYSBQcm9taXNlIGZvciB0aGUgdmFsdWUgb2ZcbiAgLy8gdGhlIGZpbmFsIHJlc3VsdCBwcm9kdWNlZCBieSB0aGUgaXRlcmF0b3IuXG4gIGV4cG9ydHMuYXN5bmMgPSBmdW5jdGlvbihpbm5lckZuLCBvdXRlckZuLCBzZWxmLCB0cnlMb2NzTGlzdCkge1xuICAgIHZhciBpdGVyID0gbmV3IEFzeW5jSXRlcmF0b3IoXG4gICAgICB3cmFwKGlubmVyRm4sIG91dGVyRm4sIHNlbGYsIHRyeUxvY3NMaXN0KVxuICAgICk7XG5cbiAgICByZXR1cm4gZXhwb3J0cy5pc0dlbmVyYXRvckZ1bmN0aW9uKG91dGVyRm4pXG4gICAgICA/IGl0ZXIgLy8gSWYgb3V0ZXJGbiBpcyBhIGdlbmVyYXRvciwgcmV0dXJuIHRoZSBmdWxsIGl0ZXJhdG9yLlxuICAgICAgOiBpdGVyLm5leHQoKS50aGVuKGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgICAgICAgIHJldHVybiByZXN1bHQuZG9uZSA/IHJlc3VsdC52YWx1ZSA6IGl0ZXIubmV4dCgpO1xuICAgICAgICB9KTtcbiAgfTtcblxuICBmdW5jdGlvbiBtYWtlSW52b2tlTWV0aG9kKGlubmVyRm4sIHNlbGYsIGNvbnRleHQpIHtcbiAgICB2YXIgc3RhdGUgPSBHZW5TdGF0ZVN1c3BlbmRlZFN0YXJ0O1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIGludm9rZShtZXRob2QsIGFyZykge1xuICAgICAgaWYgKHN0YXRlID09PSBHZW5TdGF0ZUV4ZWN1dGluZykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBydW5uaW5nXCIpO1xuICAgICAgfVxuXG4gICAgICBpZiAoc3RhdGUgPT09IEdlblN0YXRlQ29tcGxldGVkKSB7XG4gICAgICAgIGlmIChtZXRob2QgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgIHRocm93IGFyZztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEJlIGZvcmdpdmluZywgcGVyIDI1LjMuMy4zLjMgb2YgdGhlIHNwZWM6XG4gICAgICAgIC8vIGh0dHBzOi8vcGVvcGxlLm1vemlsbGEub3JnL35qb3JlbmRvcmZmL2VzNi1kcmFmdC5odG1sI3NlYy1nZW5lcmF0b3JyZXN1bWVcbiAgICAgICAgcmV0dXJuIGRvbmVSZXN1bHQoKTtcbiAgICAgIH1cblxuICAgICAgY29udGV4dC5tZXRob2QgPSBtZXRob2Q7XG4gICAgICBjb250ZXh0LmFyZyA9IGFyZztcblxuICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgdmFyIGRlbGVnYXRlID0gY29udGV4dC5kZWxlZ2F0ZTtcbiAgICAgICAgaWYgKGRlbGVnYXRlKSB7XG4gICAgICAgICAgdmFyIGRlbGVnYXRlUmVzdWx0ID0gbWF5YmVJbnZva2VEZWxlZ2F0ZShkZWxlZ2F0ZSwgY29udGV4dCk7XG4gICAgICAgICAgaWYgKGRlbGVnYXRlUmVzdWx0KSB7XG4gICAgICAgICAgICBpZiAoZGVsZWdhdGVSZXN1bHQgPT09IENvbnRpbnVlU2VudGluZWwpIGNvbnRpbnVlO1xuICAgICAgICAgICAgcmV0dXJuIGRlbGVnYXRlUmVzdWx0O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjb250ZXh0Lm1ldGhvZCA9PT0gXCJuZXh0XCIpIHtcbiAgICAgICAgICAvLyBTZXR0aW5nIGNvbnRleHQuX3NlbnQgZm9yIGxlZ2FjeSBzdXBwb3J0IG9mIEJhYmVsJ3NcbiAgICAgICAgICAvLyBmdW5jdGlvbi5zZW50IGltcGxlbWVudGF0aW9uLlxuICAgICAgICAgIGNvbnRleHQuc2VudCA9IGNvbnRleHQuX3NlbnQgPSBjb250ZXh0LmFyZztcblxuICAgICAgICB9IGVsc2UgaWYgKGNvbnRleHQubWV0aG9kID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICBpZiAoc3RhdGUgPT09IEdlblN0YXRlU3VzcGVuZGVkU3RhcnQpIHtcbiAgICAgICAgICAgIHN0YXRlID0gR2VuU3RhdGVDb21wbGV0ZWQ7XG4gICAgICAgICAgICB0aHJvdyBjb250ZXh0LmFyZztcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjb250ZXh0LmRpc3BhdGNoRXhjZXB0aW9uKGNvbnRleHQuYXJnKTtcblxuICAgICAgICB9IGVsc2UgaWYgKGNvbnRleHQubWV0aG9kID09PSBcInJldHVyblwiKSB7XG4gICAgICAgICAgY29udGV4dC5hYnJ1cHQoXCJyZXR1cm5cIiwgY29udGV4dC5hcmcpO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RhdGUgPSBHZW5TdGF0ZUV4ZWN1dGluZztcblxuICAgICAgICB2YXIgcmVjb3JkID0gdHJ5Q2F0Y2goaW5uZXJGbiwgc2VsZiwgY29udGV4dCk7XG4gICAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJub3JtYWxcIikge1xuICAgICAgICAgIC8vIElmIGFuIGV4Y2VwdGlvbiBpcyB0aHJvd24gZnJvbSBpbm5lckZuLCB3ZSBsZWF2ZSBzdGF0ZSA9PT1cbiAgICAgICAgICAvLyBHZW5TdGF0ZUV4ZWN1dGluZyBhbmQgbG9vcCBiYWNrIGZvciBhbm90aGVyIGludm9jYXRpb24uXG4gICAgICAgICAgc3RhdGUgPSBjb250ZXh0LmRvbmVcbiAgICAgICAgICAgID8gR2VuU3RhdGVDb21wbGV0ZWRcbiAgICAgICAgICAgIDogR2VuU3RhdGVTdXNwZW5kZWRZaWVsZDtcblxuICAgICAgICAgIGlmIChyZWNvcmQuYXJnID09PSBDb250aW51ZVNlbnRpbmVsKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdmFsdWU6IHJlY29yZC5hcmcsXG4gICAgICAgICAgICBkb25lOiBjb250ZXh0LmRvbmVcbiAgICAgICAgICB9O1xuXG4gICAgICAgIH0gZWxzZSBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgIHN0YXRlID0gR2VuU3RhdGVDb21wbGV0ZWQ7XG4gICAgICAgICAgLy8gRGlzcGF0Y2ggdGhlIGV4Y2VwdGlvbiBieSBsb29waW5nIGJhY2sgYXJvdW5kIHRvIHRoZVxuICAgICAgICAgIC8vIGNvbnRleHQuZGlzcGF0Y2hFeGNlcHRpb24oY29udGV4dC5hcmcpIGNhbGwgYWJvdmUuXG4gICAgICAgICAgY29udGV4dC5tZXRob2QgPSBcInRocm93XCI7XG4gICAgICAgICAgY29udGV4dC5hcmcgPSByZWNvcmQuYXJnO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIC8vIENhbGwgZGVsZWdhdGUuaXRlcmF0b3JbY29udGV4dC5tZXRob2RdKGNvbnRleHQuYXJnKSBhbmQgaGFuZGxlIHRoZVxuICAvLyByZXN1bHQsIGVpdGhlciBieSByZXR1cm5pbmcgYSB7IHZhbHVlLCBkb25lIH0gcmVzdWx0IGZyb20gdGhlXG4gIC8vIGRlbGVnYXRlIGl0ZXJhdG9yLCBvciBieSBtb2RpZnlpbmcgY29udGV4dC5tZXRob2QgYW5kIGNvbnRleHQuYXJnLFxuICAvLyBzZXR0aW5nIGNvbnRleHQuZGVsZWdhdGUgdG8gbnVsbCwgYW5kIHJldHVybmluZyB0aGUgQ29udGludWVTZW50aW5lbC5cbiAgZnVuY3Rpb24gbWF5YmVJbnZva2VEZWxlZ2F0ZShkZWxlZ2F0ZSwgY29udGV4dCkge1xuICAgIHZhciBtZXRob2QgPSBkZWxlZ2F0ZS5pdGVyYXRvcltjb250ZXh0Lm1ldGhvZF07XG4gICAgaWYgKG1ldGhvZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAvLyBBIC50aHJvdyBvciAucmV0dXJuIHdoZW4gdGhlIGRlbGVnYXRlIGl0ZXJhdG9yIGhhcyBubyAudGhyb3dcbiAgICAgIC8vIG1ldGhvZCBhbHdheXMgdGVybWluYXRlcyB0aGUgeWllbGQqIGxvb3AuXG4gICAgICBjb250ZXh0LmRlbGVnYXRlID0gbnVsbDtcblxuICAgICAgaWYgKGNvbnRleHQubWV0aG9kID09PSBcInRocm93XCIpIHtcbiAgICAgICAgLy8gTm90ZTogW1wicmV0dXJuXCJdIG11c3QgYmUgdXNlZCBmb3IgRVMzIHBhcnNpbmcgY29tcGF0aWJpbGl0eS5cbiAgICAgICAgaWYgKGRlbGVnYXRlLml0ZXJhdG9yW1wicmV0dXJuXCJdKSB7XG4gICAgICAgICAgLy8gSWYgdGhlIGRlbGVnYXRlIGl0ZXJhdG9yIGhhcyBhIHJldHVybiBtZXRob2QsIGdpdmUgaXQgYVxuICAgICAgICAgIC8vIGNoYW5jZSB0byBjbGVhbiB1cC5cbiAgICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwicmV0dXJuXCI7XG4gICAgICAgICAgY29udGV4dC5hcmcgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgbWF5YmVJbnZva2VEZWxlZ2F0ZShkZWxlZ2F0ZSwgY29udGV4dCk7XG5cbiAgICAgICAgICBpZiAoY29udGV4dC5tZXRob2QgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgICAgLy8gSWYgbWF5YmVJbnZva2VEZWxlZ2F0ZShjb250ZXh0KSBjaGFuZ2VkIGNvbnRleHQubWV0aG9kIGZyb21cbiAgICAgICAgICAgIC8vIFwicmV0dXJuXCIgdG8gXCJ0aHJvd1wiLCBsZXQgdGhhdCBvdmVycmlkZSB0aGUgVHlwZUVycm9yIGJlbG93LlxuICAgICAgICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29udGV4dC5tZXRob2QgPSBcInRocm93XCI7XG4gICAgICAgIGNvbnRleHQuYXJnID0gbmV3IFR5cGVFcnJvcihcbiAgICAgICAgICBcIlRoZSBpdGVyYXRvciBkb2VzIG5vdCBwcm92aWRlIGEgJ3Rocm93JyBtZXRob2RcIik7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgIH1cblxuICAgIHZhciByZWNvcmQgPSB0cnlDYXRjaChtZXRob2QsIGRlbGVnYXRlLml0ZXJhdG9yLCBjb250ZXh0LmFyZyk7XG5cbiAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgY29udGV4dC5tZXRob2QgPSBcInRocm93XCI7XG4gICAgICBjb250ZXh0LmFyZyA9IHJlY29yZC5hcmc7XG4gICAgICBjb250ZXh0LmRlbGVnYXRlID0gbnVsbDtcbiAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgIH1cblxuICAgIHZhciBpbmZvID0gcmVjb3JkLmFyZztcblxuICAgIGlmICghIGluZm8pIHtcbiAgICAgIGNvbnRleHQubWV0aG9kID0gXCJ0aHJvd1wiO1xuICAgICAgY29udGV4dC5hcmcgPSBuZXcgVHlwZUVycm9yKFwiaXRlcmF0b3IgcmVzdWx0IGlzIG5vdCBhbiBvYmplY3RcIik7XG4gICAgICBjb250ZXh0LmRlbGVnYXRlID0gbnVsbDtcbiAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgIH1cblxuICAgIGlmIChpbmZvLmRvbmUpIHtcbiAgICAgIC8vIEFzc2lnbiB0aGUgcmVzdWx0IG9mIHRoZSBmaW5pc2hlZCBkZWxlZ2F0ZSB0byB0aGUgdGVtcG9yYXJ5XG4gICAgICAvLyB2YXJpYWJsZSBzcGVjaWZpZWQgYnkgZGVsZWdhdGUucmVzdWx0TmFtZSAoc2VlIGRlbGVnYXRlWWllbGQpLlxuICAgICAgY29udGV4dFtkZWxlZ2F0ZS5yZXN1bHROYW1lXSA9IGluZm8udmFsdWU7XG5cbiAgICAgIC8vIFJlc3VtZSBleGVjdXRpb24gYXQgdGhlIGRlc2lyZWQgbG9jYXRpb24gKHNlZSBkZWxlZ2F0ZVlpZWxkKS5cbiAgICAgIGNvbnRleHQubmV4dCA9IGRlbGVnYXRlLm5leHRMb2M7XG5cbiAgICAgIC8vIElmIGNvbnRleHQubWV0aG9kIHdhcyBcInRocm93XCIgYnV0IHRoZSBkZWxlZ2F0ZSBoYW5kbGVkIHRoZVxuICAgICAgLy8gZXhjZXB0aW9uLCBsZXQgdGhlIG91dGVyIGdlbmVyYXRvciBwcm9jZWVkIG5vcm1hbGx5LiBJZlxuICAgICAgLy8gY29udGV4dC5tZXRob2Qgd2FzIFwibmV4dFwiLCBmb3JnZXQgY29udGV4dC5hcmcgc2luY2UgaXQgaGFzIGJlZW5cbiAgICAgIC8vIFwiY29uc3VtZWRcIiBieSB0aGUgZGVsZWdhdGUgaXRlcmF0b3IuIElmIGNvbnRleHQubWV0aG9kIHdhc1xuICAgICAgLy8gXCJyZXR1cm5cIiwgYWxsb3cgdGhlIG9yaWdpbmFsIC5yZXR1cm4gY2FsbCB0byBjb250aW51ZSBpbiB0aGVcbiAgICAgIC8vIG91dGVyIGdlbmVyYXRvci5cbiAgICAgIGlmIChjb250ZXh0Lm1ldGhvZCAhPT0gXCJyZXR1cm5cIikge1xuICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwibmV4dFwiO1xuICAgICAgICBjb250ZXh0LmFyZyA9IHVuZGVmaW5lZDtcbiAgICAgIH1cblxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBSZS15aWVsZCB0aGUgcmVzdWx0IHJldHVybmVkIGJ5IHRoZSBkZWxlZ2F0ZSBtZXRob2QuXG4gICAgICByZXR1cm4gaW5mbztcbiAgICB9XG5cbiAgICAvLyBUaGUgZGVsZWdhdGUgaXRlcmF0b3IgaXMgZmluaXNoZWQsIHNvIGZvcmdldCBpdCBhbmQgY29udGludWUgd2l0aFxuICAgIC8vIHRoZSBvdXRlciBnZW5lcmF0b3IuXG4gICAgY29udGV4dC5kZWxlZ2F0ZSA9IG51bGw7XG4gICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gIH1cblxuICAvLyBEZWZpbmUgR2VuZXJhdG9yLnByb3RvdHlwZS57bmV4dCx0aHJvdyxyZXR1cm59IGluIHRlcm1zIG9mIHRoZVxuICAvLyB1bmlmaWVkIC5faW52b2tlIGhlbHBlciBtZXRob2QuXG4gIGRlZmluZUl0ZXJhdG9yTWV0aG9kcyhHcCk7XG5cbiAgR3BbdG9TdHJpbmdUYWdTeW1ib2xdID0gXCJHZW5lcmF0b3JcIjtcblxuICAvLyBBIEdlbmVyYXRvciBzaG91bGQgYWx3YXlzIHJldHVybiBpdHNlbGYgYXMgdGhlIGl0ZXJhdG9yIG9iamVjdCB3aGVuIHRoZVxuICAvLyBAQGl0ZXJhdG9yIGZ1bmN0aW9uIGlzIGNhbGxlZCBvbiBpdC4gU29tZSBicm93c2VycycgaW1wbGVtZW50YXRpb25zIG9mIHRoZVxuICAvLyBpdGVyYXRvciBwcm90b3R5cGUgY2hhaW4gaW5jb3JyZWN0bHkgaW1wbGVtZW50IHRoaXMsIGNhdXNpbmcgdGhlIEdlbmVyYXRvclxuICAvLyBvYmplY3QgdG8gbm90IGJlIHJldHVybmVkIGZyb20gdGhpcyBjYWxsLiBUaGlzIGVuc3VyZXMgdGhhdCBkb2Vzbid0IGhhcHBlbi5cbiAgLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9mYWNlYm9vay9yZWdlbmVyYXRvci9pc3N1ZXMvMjc0IGZvciBtb3JlIGRldGFpbHMuXG4gIEdwW2l0ZXJhdG9yU3ltYm9sXSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIEdwLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIFwiW29iamVjdCBHZW5lcmF0b3JdXCI7XG4gIH07XG5cbiAgZnVuY3Rpb24gcHVzaFRyeUVudHJ5KGxvY3MpIHtcbiAgICB2YXIgZW50cnkgPSB7IHRyeUxvYzogbG9jc1swXSB9O1xuXG4gICAgaWYgKDEgaW4gbG9jcykge1xuICAgICAgZW50cnkuY2F0Y2hMb2MgPSBsb2NzWzFdO1xuICAgIH1cblxuICAgIGlmICgyIGluIGxvY3MpIHtcbiAgICAgIGVudHJ5LmZpbmFsbHlMb2MgPSBsb2NzWzJdO1xuICAgICAgZW50cnkuYWZ0ZXJMb2MgPSBsb2NzWzNdO1xuICAgIH1cblxuICAgIHRoaXMudHJ5RW50cmllcy5wdXNoKGVudHJ5KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlc2V0VHJ5RW50cnkoZW50cnkpIHtcbiAgICB2YXIgcmVjb3JkID0gZW50cnkuY29tcGxldGlvbiB8fCB7fTtcbiAgICByZWNvcmQudHlwZSA9IFwibm9ybWFsXCI7XG4gICAgZGVsZXRlIHJlY29yZC5hcmc7XG4gICAgZW50cnkuY29tcGxldGlvbiA9IHJlY29yZDtcbiAgfVxuXG4gIGZ1bmN0aW9uIENvbnRleHQodHJ5TG9jc0xpc3QpIHtcbiAgICAvLyBUaGUgcm9vdCBlbnRyeSBvYmplY3QgKGVmZmVjdGl2ZWx5IGEgdHJ5IHN0YXRlbWVudCB3aXRob3V0IGEgY2F0Y2hcbiAgICAvLyBvciBhIGZpbmFsbHkgYmxvY2spIGdpdmVzIHVzIGEgcGxhY2UgdG8gc3RvcmUgdmFsdWVzIHRocm93biBmcm9tXG4gICAgLy8gbG9jYXRpb25zIHdoZXJlIHRoZXJlIGlzIG5vIGVuY2xvc2luZyB0cnkgc3RhdGVtZW50LlxuICAgIHRoaXMudHJ5RW50cmllcyA9IFt7IHRyeUxvYzogXCJyb290XCIgfV07XG4gICAgdHJ5TG9jc0xpc3QuZm9yRWFjaChwdXNoVHJ5RW50cnksIHRoaXMpO1xuICAgIHRoaXMucmVzZXQodHJ1ZSk7XG4gIH1cblxuICBleHBvcnRzLmtleXMgPSBmdW5jdGlvbihvYmplY3QpIHtcbiAgICB2YXIga2V5cyA9IFtdO1xuICAgIGZvciAodmFyIGtleSBpbiBvYmplY3QpIHtcbiAgICAgIGtleXMucHVzaChrZXkpO1xuICAgIH1cbiAgICBrZXlzLnJldmVyc2UoKTtcblxuICAgIC8vIFJhdGhlciB0aGFuIHJldHVybmluZyBhbiBvYmplY3Qgd2l0aCBhIG5leHQgbWV0aG9kLCB3ZSBrZWVwXG4gICAgLy8gdGhpbmdzIHNpbXBsZSBhbmQgcmV0dXJuIHRoZSBuZXh0IGZ1bmN0aW9uIGl0c2VsZi5cbiAgICByZXR1cm4gZnVuY3Rpb24gbmV4dCgpIHtcbiAgICAgIHdoaWxlIChrZXlzLmxlbmd0aCkge1xuICAgICAgICB2YXIga2V5ID0ga2V5cy5wb3AoKTtcbiAgICAgICAgaWYgKGtleSBpbiBvYmplY3QpIHtcbiAgICAgICAgICBuZXh0LnZhbHVlID0ga2V5O1xuICAgICAgICAgIG5leHQuZG9uZSA9IGZhbHNlO1xuICAgICAgICAgIHJldHVybiBuZXh0O1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIFRvIGF2b2lkIGNyZWF0aW5nIGFuIGFkZGl0aW9uYWwgb2JqZWN0LCB3ZSBqdXN0IGhhbmcgdGhlIC52YWx1ZVxuICAgICAgLy8gYW5kIC5kb25lIHByb3BlcnRpZXMgb2ZmIHRoZSBuZXh0IGZ1bmN0aW9uIG9iamVjdCBpdHNlbGYuIFRoaXNcbiAgICAgIC8vIGFsc28gZW5zdXJlcyB0aGF0IHRoZSBtaW5pZmllciB3aWxsIG5vdCBhbm9ueW1pemUgdGhlIGZ1bmN0aW9uLlxuICAgICAgbmV4dC5kb25lID0gdHJ1ZTtcbiAgICAgIHJldHVybiBuZXh0O1xuICAgIH07XG4gIH07XG5cbiAgZnVuY3Rpb24gdmFsdWVzKGl0ZXJhYmxlKSB7XG4gICAgaWYgKGl0ZXJhYmxlKSB7XG4gICAgICB2YXIgaXRlcmF0b3JNZXRob2QgPSBpdGVyYWJsZVtpdGVyYXRvclN5bWJvbF07XG4gICAgICBpZiAoaXRlcmF0b3JNZXRob2QpIHtcbiAgICAgICAgcmV0dXJuIGl0ZXJhdG9yTWV0aG9kLmNhbGwoaXRlcmFibGUpO1xuICAgICAgfVxuXG4gICAgICBpZiAodHlwZW9mIGl0ZXJhYmxlLm5leHQgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICByZXR1cm4gaXRlcmFibGU7XG4gICAgICB9XG5cbiAgICAgIGlmICghaXNOYU4oaXRlcmFibGUubGVuZ3RoKSkge1xuICAgICAgICB2YXIgaSA9IC0xLCBuZXh0ID0gZnVuY3Rpb24gbmV4dCgpIHtcbiAgICAgICAgICB3aGlsZSAoKytpIDwgaXRlcmFibGUubGVuZ3RoKSB7XG4gICAgICAgICAgICBpZiAoaGFzT3duLmNhbGwoaXRlcmFibGUsIGkpKSB7XG4gICAgICAgICAgICAgIG5leHQudmFsdWUgPSBpdGVyYWJsZVtpXTtcbiAgICAgICAgICAgICAgbmV4dC5kb25lID0gZmFsc2U7XG4gICAgICAgICAgICAgIHJldHVybiBuZXh0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIG5leHQudmFsdWUgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgbmV4dC5kb25lID0gdHJ1ZTtcblxuICAgICAgICAgIHJldHVybiBuZXh0O1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBuZXh0Lm5leHQgPSBuZXh0O1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFJldHVybiBhbiBpdGVyYXRvciB3aXRoIG5vIHZhbHVlcy5cbiAgICByZXR1cm4geyBuZXh0OiBkb25lUmVzdWx0IH07XG4gIH1cbiAgZXhwb3J0cy52YWx1ZXMgPSB2YWx1ZXM7XG5cbiAgZnVuY3Rpb24gZG9uZVJlc3VsdCgpIHtcbiAgICByZXR1cm4geyB2YWx1ZTogdW5kZWZpbmVkLCBkb25lOiB0cnVlIH07XG4gIH1cblxuICBDb250ZXh0LnByb3RvdHlwZSA9IHtcbiAgICBjb25zdHJ1Y3RvcjogQ29udGV4dCxcblxuICAgIHJlc2V0OiBmdW5jdGlvbihza2lwVGVtcFJlc2V0KSB7XG4gICAgICB0aGlzLnByZXYgPSAwO1xuICAgICAgdGhpcy5uZXh0ID0gMDtcbiAgICAgIC8vIFJlc2V0dGluZyBjb250ZXh0Ll9zZW50IGZvciBsZWdhY3kgc3VwcG9ydCBvZiBCYWJlbCdzXG4gICAgICAvLyBmdW5jdGlvbi5zZW50IGltcGxlbWVudGF0aW9uLlxuICAgICAgdGhpcy5zZW50ID0gdGhpcy5fc2VudCA9IHVuZGVmaW5lZDtcbiAgICAgIHRoaXMuZG9uZSA9IGZhbHNlO1xuICAgICAgdGhpcy5kZWxlZ2F0ZSA9IG51bGw7XG5cbiAgICAgIHRoaXMubWV0aG9kID0gXCJuZXh0XCI7XG4gICAgICB0aGlzLmFyZyA9IHVuZGVmaW5lZDtcblxuICAgICAgdGhpcy50cnlFbnRyaWVzLmZvckVhY2gocmVzZXRUcnlFbnRyeSk7XG5cbiAgICAgIGlmICghc2tpcFRlbXBSZXNldCkge1xuICAgICAgICBmb3IgKHZhciBuYW1lIGluIHRoaXMpIHtcbiAgICAgICAgICAvLyBOb3Qgc3VyZSBhYm91dCB0aGUgb3B0aW1hbCBvcmRlciBvZiB0aGVzZSBjb25kaXRpb25zOlxuICAgICAgICAgIGlmIChuYW1lLmNoYXJBdCgwKSA9PT0gXCJ0XCIgJiZcbiAgICAgICAgICAgICAgaGFzT3duLmNhbGwodGhpcywgbmFtZSkgJiZcbiAgICAgICAgICAgICAgIWlzTmFOKCtuYW1lLnNsaWNlKDEpKSkge1xuICAgICAgICAgICAgdGhpc1tuYW1lXSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgc3RvcDogZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLmRvbmUgPSB0cnVlO1xuXG4gICAgICB2YXIgcm9vdEVudHJ5ID0gdGhpcy50cnlFbnRyaWVzWzBdO1xuICAgICAgdmFyIHJvb3RSZWNvcmQgPSByb290RW50cnkuY29tcGxldGlvbjtcbiAgICAgIGlmIChyb290UmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICB0aHJvdyByb290UmVjb3JkLmFyZztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMucnZhbDtcbiAgICB9LFxuXG4gICAgZGlzcGF0Y2hFeGNlcHRpb246IGZ1bmN0aW9uKGV4Y2VwdGlvbikge1xuICAgICAgaWYgKHRoaXMuZG9uZSkge1xuICAgICAgICB0aHJvdyBleGNlcHRpb247XG4gICAgICB9XG5cbiAgICAgIHZhciBjb250ZXh0ID0gdGhpcztcbiAgICAgIGZ1bmN0aW9uIGhhbmRsZShsb2MsIGNhdWdodCkge1xuICAgICAgICByZWNvcmQudHlwZSA9IFwidGhyb3dcIjtcbiAgICAgICAgcmVjb3JkLmFyZyA9IGV4Y2VwdGlvbjtcbiAgICAgICAgY29udGV4dC5uZXh0ID0gbG9jO1xuXG4gICAgICAgIGlmIChjYXVnaHQpIHtcbiAgICAgICAgICAvLyBJZiB0aGUgZGlzcGF0Y2hlZCBleGNlcHRpb24gd2FzIGNhdWdodCBieSBhIGNhdGNoIGJsb2NrLFxuICAgICAgICAgIC8vIHRoZW4gbGV0IHRoYXQgY2F0Y2ggYmxvY2sgaGFuZGxlIHRoZSBleGNlcHRpb24gbm9ybWFsbHkuXG4gICAgICAgICAgY29udGV4dC5tZXRob2QgPSBcIm5leHRcIjtcbiAgICAgICAgICBjb250ZXh0LmFyZyA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAhISBjYXVnaHQ7XG4gICAgICB9XG5cbiAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldO1xuICAgICAgICB2YXIgcmVjb3JkID0gZW50cnkuY29tcGxldGlvbjtcblxuICAgICAgICBpZiAoZW50cnkudHJ5TG9jID09PSBcInJvb3RcIikge1xuICAgICAgICAgIC8vIEV4Y2VwdGlvbiB0aHJvd24gb3V0c2lkZSBvZiBhbnkgdHJ5IGJsb2NrIHRoYXQgY291bGQgaGFuZGxlXG4gICAgICAgICAgLy8gaXQsIHNvIHNldCB0aGUgY29tcGxldGlvbiB2YWx1ZSBvZiB0aGUgZW50aXJlIGZ1bmN0aW9uIHRvXG4gICAgICAgICAgLy8gdGhyb3cgdGhlIGV4Y2VwdGlvbi5cbiAgICAgICAgICByZXR1cm4gaGFuZGxlKFwiZW5kXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGVudHJ5LnRyeUxvYyA8PSB0aGlzLnByZXYpIHtcbiAgICAgICAgICB2YXIgaGFzQ2F0Y2ggPSBoYXNPd24uY2FsbChlbnRyeSwgXCJjYXRjaExvY1wiKTtcbiAgICAgICAgICB2YXIgaGFzRmluYWxseSA9IGhhc093bi5jYWxsKGVudHJ5LCBcImZpbmFsbHlMb2NcIik7XG5cbiAgICAgICAgICBpZiAoaGFzQ2F0Y2ggJiYgaGFzRmluYWxseSkge1xuICAgICAgICAgICAgaWYgKHRoaXMucHJldiA8IGVudHJ5LmNhdGNoTG9jKSB7XG4gICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuY2F0Y2hMb2MsIHRydWUpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLnByZXYgPCBlbnRyeS5maW5hbGx5TG9jKSB7XG4gICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuZmluYWxseUxvYyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICB9IGVsc2UgaWYgKGhhc0NhdGNoKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wcmV2IDwgZW50cnkuY2F0Y2hMb2MpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZShlbnRyeS5jYXRjaExvYywgdHJ1ZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICB9IGVsc2UgaWYgKGhhc0ZpbmFsbHkpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnByZXYgPCBlbnRyeS5maW5hbGx5TG9jKSB7XG4gICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuZmluYWxseUxvYyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwidHJ5IHN0YXRlbWVudCB3aXRob3V0IGNhdGNoIG9yIGZpbmFsbHlcIik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIGFicnVwdDogZnVuY3Rpb24odHlwZSwgYXJnKSB7XG4gICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTtcbiAgICAgICAgaWYgKGVudHJ5LnRyeUxvYyA8PSB0aGlzLnByZXYgJiZcbiAgICAgICAgICAgIGhhc093bi5jYWxsKGVudHJ5LCBcImZpbmFsbHlMb2NcIikgJiZcbiAgICAgICAgICAgIHRoaXMucHJldiA8IGVudHJ5LmZpbmFsbHlMb2MpIHtcbiAgICAgICAgICB2YXIgZmluYWxseUVudHJ5ID0gZW50cnk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGZpbmFsbHlFbnRyeSAmJlxuICAgICAgICAgICh0eXBlID09PSBcImJyZWFrXCIgfHxcbiAgICAgICAgICAgdHlwZSA9PT0gXCJjb250aW51ZVwiKSAmJlxuICAgICAgICAgIGZpbmFsbHlFbnRyeS50cnlMb2MgPD0gYXJnICYmXG4gICAgICAgICAgYXJnIDw9IGZpbmFsbHlFbnRyeS5maW5hbGx5TG9jKSB7XG4gICAgICAgIC8vIElnbm9yZSB0aGUgZmluYWxseSBlbnRyeSBpZiBjb250cm9sIGlzIG5vdCBqdW1waW5nIHRvIGFcbiAgICAgICAgLy8gbG9jYXRpb24gb3V0c2lkZSB0aGUgdHJ5L2NhdGNoIGJsb2NrLlxuICAgICAgICBmaW5hbGx5RW50cnkgPSBudWxsO1xuICAgICAgfVxuXG4gICAgICB2YXIgcmVjb3JkID0gZmluYWxseUVudHJ5ID8gZmluYWxseUVudHJ5LmNvbXBsZXRpb24gOiB7fTtcbiAgICAgIHJlY29yZC50eXBlID0gdHlwZTtcbiAgICAgIHJlY29yZC5hcmcgPSBhcmc7XG5cbiAgICAgIGlmIChmaW5hbGx5RW50cnkpIHtcbiAgICAgICAgdGhpcy5tZXRob2QgPSBcIm5leHRcIjtcbiAgICAgICAgdGhpcy5uZXh0ID0gZmluYWxseUVudHJ5LmZpbmFsbHlMb2M7XG4gICAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5jb21wbGV0ZShyZWNvcmQpO1xuICAgIH0sXG5cbiAgICBjb21wbGV0ZTogZnVuY3Rpb24ocmVjb3JkLCBhZnRlckxvYykge1xuICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgdGhyb3cgcmVjb3JkLmFyZztcbiAgICAgIH1cblxuICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcImJyZWFrXCIgfHxcbiAgICAgICAgICByZWNvcmQudHlwZSA9PT0gXCJjb250aW51ZVwiKSB7XG4gICAgICAgIHRoaXMubmV4dCA9IHJlY29yZC5hcmc7XG4gICAgICB9IGVsc2UgaWYgKHJlY29yZC50eXBlID09PSBcInJldHVyblwiKSB7XG4gICAgICAgIHRoaXMucnZhbCA9IHRoaXMuYXJnID0gcmVjb3JkLmFyZztcbiAgICAgICAgdGhpcy5tZXRob2QgPSBcInJldHVyblwiO1xuICAgICAgICB0aGlzLm5leHQgPSBcImVuZFwiO1xuICAgICAgfSBlbHNlIGlmIChyZWNvcmQudHlwZSA9PT0gXCJub3JtYWxcIiAmJiBhZnRlckxvYykge1xuICAgICAgICB0aGlzLm5leHQgPSBhZnRlckxvYztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfSxcblxuICAgIGZpbmlzaDogZnVuY3Rpb24oZmluYWxseUxvYykge1xuICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHJ5RW50cmllcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICB2YXIgZW50cnkgPSB0aGlzLnRyeUVudHJpZXNbaV07XG4gICAgICAgIGlmIChlbnRyeS5maW5hbGx5TG9jID09PSBmaW5hbGx5TG9jKSB7XG4gICAgICAgICAgdGhpcy5jb21wbGV0ZShlbnRyeS5jb21wbGV0aW9uLCBlbnRyeS5hZnRlckxvYyk7XG4gICAgICAgICAgcmVzZXRUcnlFbnRyeShlbnRyeSk7XG4gICAgICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgXCJjYXRjaFwiOiBmdW5jdGlvbih0cnlMb2MpIHtcbiAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldO1xuICAgICAgICBpZiAoZW50cnkudHJ5TG9jID09PSB0cnlMb2MpIHtcbiAgICAgICAgICB2YXIgcmVjb3JkID0gZW50cnkuY29tcGxldGlvbjtcbiAgICAgICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgICAgdmFyIHRocm93biA9IHJlY29yZC5hcmc7XG4gICAgICAgICAgICByZXNldFRyeUVudHJ5KGVudHJ5KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHRocm93bjtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBUaGUgY29udGV4dC5jYXRjaCBtZXRob2QgbXVzdCBvbmx5IGJlIGNhbGxlZCB3aXRoIGEgbG9jYXRpb25cbiAgICAgIC8vIGFyZ3VtZW50IHRoYXQgY29ycmVzcG9uZHMgdG8gYSBrbm93biBjYXRjaCBibG9jay5cbiAgICAgIHRocm93IG5ldyBFcnJvcihcImlsbGVnYWwgY2F0Y2ggYXR0ZW1wdFwiKTtcbiAgICB9LFxuXG4gICAgZGVsZWdhdGVZaWVsZDogZnVuY3Rpb24oaXRlcmFibGUsIHJlc3VsdE5hbWUsIG5leHRMb2MpIHtcbiAgICAgIHRoaXMuZGVsZWdhdGUgPSB7XG4gICAgICAgIGl0ZXJhdG9yOiB2YWx1ZXMoaXRlcmFibGUpLFxuICAgICAgICByZXN1bHROYW1lOiByZXN1bHROYW1lLFxuICAgICAgICBuZXh0TG9jOiBuZXh0TG9jXG4gICAgICB9O1xuXG4gICAgICBpZiAodGhpcy5tZXRob2QgPT09IFwibmV4dFwiKSB7XG4gICAgICAgIC8vIERlbGliZXJhdGVseSBmb3JnZXQgdGhlIGxhc3Qgc2VudCB2YWx1ZSBzbyB0aGF0IHdlIGRvbid0XG4gICAgICAgIC8vIGFjY2lkZW50YWxseSBwYXNzIGl0IG9uIHRvIHRoZSBkZWxlZ2F0ZS5cbiAgICAgICAgdGhpcy5hcmcgPSB1bmRlZmluZWQ7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgIH1cbiAgfTtcblxuICAvLyBSZWdhcmRsZXNzIG9mIHdoZXRoZXIgdGhpcyBzY3JpcHQgaXMgZXhlY3V0aW5nIGFzIGEgQ29tbW9uSlMgbW9kdWxlXG4gIC8vIG9yIG5vdCwgcmV0dXJuIHRoZSBydW50aW1lIG9iamVjdCBzbyB0aGF0IHdlIGNhbiBkZWNsYXJlIHRoZSB2YXJpYWJsZVxuICAvLyByZWdlbmVyYXRvclJ1bnRpbWUgaW4gdGhlIG91dGVyIHNjb3BlLCB3aGljaCBhbGxvd3MgdGhpcyBtb2R1bGUgdG8gYmVcbiAgLy8gaW5qZWN0ZWQgZWFzaWx5IGJ5IGBiaW4vcmVnZW5lcmF0b3IgLS1pbmNsdWRlLXJ1bnRpbWUgc2NyaXB0LmpzYC5cbiAgcmV0dXJuIGV4cG9ydHM7XG5cbn0oXG4gIC8vIElmIHRoaXMgc2NyaXB0IGlzIGV4ZWN1dGluZyBhcyBhIENvbW1vbkpTIG1vZHVsZSwgdXNlIG1vZHVsZS5leHBvcnRzXG4gIC8vIGFzIHRoZSByZWdlbmVyYXRvclJ1bnRpbWUgbmFtZXNwYWNlLiBPdGhlcndpc2UgY3JlYXRlIGEgbmV3IGVtcHR5XG4gIC8vIG9iamVjdC4gRWl0aGVyIHdheSwgdGhlIHJlc3VsdGluZyBvYmplY3Qgd2lsbCBiZSB1c2VkIHRvIGluaXRpYWxpemVcbiAgLy8gdGhlIHJlZ2VuZXJhdG9yUnVudGltZSB2YXJpYWJsZSBhdCB0aGUgdG9wIG9mIHRoaXMgZmlsZS5cbiAgdHlwZW9mIG1vZHVsZSA9PT0gXCJvYmplY3RcIiA/IG1vZHVsZS5leHBvcnRzIDoge31cbikpO1xuXG50cnkge1xuICByZWdlbmVyYXRvclJ1bnRpbWUgPSBydW50aW1lO1xufSBjYXRjaCAoYWNjaWRlbnRhbFN0cmljdE1vZGUpIHtcbiAgLy8gVGhpcyBtb2R1bGUgc2hvdWxkIG5vdCBiZSBydW5uaW5nIGluIHN0cmljdCBtb2RlLCBzbyB0aGUgYWJvdmVcbiAgLy8gYXNzaWdubWVudCBzaG91bGQgYWx3YXlzIHdvcmsgdW5sZXNzIHNvbWV0aGluZyBpcyBtaXNjb25maWd1cmVkLiBKdXN0XG4gIC8vIGluIGNhc2UgcnVudGltZS5qcyBhY2NpZGVudGFsbHkgcnVucyBpbiBzdHJpY3QgbW9kZSwgd2UgY2FuIGVzY2FwZVxuICAvLyBzdHJpY3QgbW9kZSB1c2luZyBhIGdsb2JhbCBGdW5jdGlvbiBjYWxsLiBUaGlzIGNvdWxkIGNvbmNlaXZhYmx5IGZhaWxcbiAgLy8gaWYgYSBDb250ZW50IFNlY3VyaXR5IFBvbGljeSBmb3JiaWRzIHVzaW5nIEZ1bmN0aW9uLCBidXQgaW4gdGhhdCBjYXNlXG4gIC8vIHRoZSBwcm9wZXIgc29sdXRpb24gaXMgdG8gZml4IHRoZSBhY2NpZGVudGFsIHN0cmljdCBtb2RlIHByb2JsZW0uIElmXG4gIC8vIHlvdSd2ZSBtaXNjb25maWd1cmVkIHlvdXIgYnVuZGxlciB0byBmb3JjZSBzdHJpY3QgbW9kZSBhbmQgYXBwbGllZCBhXG4gIC8vIENTUCB0byBmb3JiaWQgRnVuY3Rpb24sIGFuZCB5b3UncmUgbm90IHdpbGxpbmcgdG8gZml4IGVpdGhlciBvZiB0aG9zZVxuICAvLyBwcm9ibGVtcywgcGxlYXNlIGRldGFpbCB5b3VyIHVuaXF1ZSBwcmVkaWNhbWVudCBpbiBhIEdpdEh1YiBpc3N1ZS5cbiAgRnVuY3Rpb24oXCJyXCIsIFwicmVnZW5lcmF0b3JSdW50aW1lID0gclwiKShydW50aW1lKTtcbn1cbiIsIi8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzICovXG5pbXBvcnQge1xuICBnbyxcbiAgZml4ZWQsXG4gIHNsZWVwLFxuICBwdXQsXG4gIHRha2UsXG4gIHNwdXQsXG4gIHNsaWRpbmcsXG4gIGluc3BlY3RvcixcbiAgc3Rha2UsXG4gIHN0YXRlLFxuICBsaXN0ZW4sXG59IGZyb20gJy4uLy4uLy4uL3NyYyc7XG5cbmluc3BlY3RvcigoKSA9PiB7fSwgdHJ1ZSk7XG5cbmNvbnN0IHMgPSBzdGF0ZSgnZm9vJyk7XG5jb25zdCB0b0xvd2VyQ2FzZSA9IHMuc2VsZWN0KHYgPT4gdi50b0xvd2VyQ2FzZSgpKWB0b0xvd2VyQ2FzZWA7XG5cbmxpc3Rlbih0b0xvd2VyQ2FzZSwgdiA9PiBjb25zb2xlLmxvZyh2KSk7XG5zcHV0KHMsICdCQVInKTtcblxuLy8gY29uc3QgdXBkYXRlID0gcy5tdXRhdGUoKGN1cnJlbnQsIHBheWxvYWQpID0+IGN1cnJlbnQgKyBwYXlsb2FkKTtcbiJdLCJzb3VyY2VSb290IjoiIn0=