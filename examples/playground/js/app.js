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

    _index__WEBPACK_IMPORTED_MODULE_1__["logger"].log(api.parent, options.listen ? 'CHANNEL_LISTEN' : 'CHANNEL_TAKE_INITIATED');
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
          __syncing: true
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
      if (payload !== null && typeof payload === 'object' && '__syncing' in payload && payload.__syncing) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy9Vc2Vycy9rcmFzaW1pci9Xb3JrL0tyYXNpbWlyL3JpZXcvbm9kZV9tb2R1bGVzL29iamVjdC1hc3NpZ24vaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy9Vc2Vycy9rcmFzaW1pci9Xb3JrL0tyYXNpbWlyL3JpZXcvbm9kZV9tb2R1bGVzL3Byb3AtdHlwZXMvY2hlY2tQcm9wVHlwZXMuanMiLCJ3ZWJwYWNrOi8vLy9Vc2Vycy9rcmFzaW1pci9Xb3JrL0tyYXNpbWlyL3JpZXcvbm9kZV9tb2R1bGVzL3Byb3AtdHlwZXMvbGliL1JlYWN0UHJvcFR5cGVzU2VjcmV0LmpzIiwid2VicGFjazovLy8vVXNlcnMva3Jhc2ltaXIvV29yay9LcmFzaW1pci9yaWV3L25vZGVfbW9kdWxlcy9yZWFjdC9janMvcmVhY3QuZGV2ZWxvcG1lbnQuanMiLCJ3ZWJwYWNrOi8vLy9Vc2Vycy9rcmFzaW1pci9Xb3JrL0tyYXNpbWlyL3JpZXcvbm9kZV9tb2R1bGVzL3JlYWN0L2luZGV4LmpzIiwid2VicGFjazovLy8vVXNlcnMva3Jhc2ltaXIvV29yay9LcmFzaW1pci9yaWV3L3NyYy9jc3AvYnVmLmpzIiwid2VicGFjazovLy8vVXNlcnMva3Jhc2ltaXIvV29yay9LcmFzaW1pci9yaWV3L3NyYy9jc3AvY2hhbm5lbC5qcyIsIndlYnBhY2s6Ly8vL1VzZXJzL2tyYXNpbWlyL1dvcmsvS3Jhc2ltaXIvcmlldy9zcmMvY3NwL29wcy5qcyIsIndlYnBhY2s6Ly8vL1VzZXJzL2tyYXNpbWlyL1dvcmsvS3Jhc2ltaXIvcmlldy9zcmMvY3NwL3N0YXRlLmpzIiwid2VicGFjazovLy8vVXNlcnMva3Jhc2ltaXIvV29yay9LcmFzaW1pci9yaWV3L3NyYy9jc3AvdXRpbHMuanMiLCJ3ZWJwYWNrOi8vLy9Vc2Vycy9rcmFzaW1pci9Xb3JrL0tyYXNpbWlyL3JpZXcvc3JjL2dyaWQuanMiLCJ3ZWJwYWNrOi8vLy9Vc2Vycy9rcmFzaW1pci9Xb3JrL0tyYXNpbWlyL3JpZXcvc3JjL2luZGV4LmpzIiwid2VicGFjazovLy8vVXNlcnMva3Jhc2ltaXIvV29yay9LcmFzaW1pci9yaWV3L3NyYy9pbnNwZWN0b3IuanMiLCJ3ZWJwYWNrOi8vLy9Vc2Vycy9rcmFzaW1pci9Xb3JrL0tyYXNpbWlyL3JpZXcvc3JjL2xvZ2dlci5qcyIsIndlYnBhY2s6Ly8vL1VzZXJzL2tyYXNpbWlyL1dvcmsvS3Jhc2ltaXIvcmlldy9zcmMvcmVhY3QvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy9Vc2Vycy9rcmFzaW1pci9Xb3JrL0tyYXNpbWlyL3JpZXcvc3JjL3JlZ2lzdHJ5LmpzIiwid2VicGFjazovLy8vVXNlcnMva3Jhc2ltaXIvV29yay9LcmFzaW1pci9yaWV3L3NyYy9yaWV3LmpzIiwid2VicGFjazovLy8vVXNlcnMva3Jhc2ltaXIvV29yay9LcmFzaW1pci9yaWV3L3NyYy9zYW5pdGl6ZS9pbmRleC5qcyIsIndlYnBhY2s6Ly8vL1VzZXJzL2tyYXNpbWlyL1dvcmsvS3Jhc2ltaXIvcmlldy9zcmMvc2FuaXRpemUvdmVuZG9ycy9DaXJjdWxhckpTT04uanMiLCJ3ZWJwYWNrOi8vLy9Vc2Vycy9rcmFzaW1pci9Xb3JrL0tyYXNpbWlyL3JpZXcvc3JjL3Nhbml0aXplL3ZlbmRvcnMvU2VyaWFsaXplRXJyb3IuanMiLCJ3ZWJwYWNrOi8vLy9Vc2Vycy9rcmFzaW1pci9Xb3JrL0tyYXNpbWlyL3JpZXcvc3JjL3V0aWxzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL3RhZ2dlZFRlbXBsYXRlTGl0ZXJhbC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcmVnZW5lcmF0b3ItcnVudGltZS9ydW50aW1lLmpzIiwid2VicGFjazovLy8uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJERUZBVUxUX09QVElPTlMiLCJkcm9wcGluZyIsInNsaWRpbmciLCJOT09QIiwidiIsImNiIiwiQ1NQQnVmZmVyIiwic2l6ZSIsImFwaSIsInZhbHVlIiwicHV0cyIsInRha2VzIiwiaG9va3MiLCJiZWZvcmVQdXQiLCJhZnRlclB1dCIsImJlZm9yZVRha2UiLCJhZnRlclRha2UiLCJwYXJlbnQiLCJob29rIiwiaXNFbXB0eSIsImxlbmd0aCIsInJlc2V0Iiwic2V0VmFsdWUiLCJnZXRWYWx1ZSIsImRlY29tcG9zZVRha2VycyIsInJlZHVjZSIsInJlcyIsInRha2VPYmoiLCJvcHRpb25zIiwicmVhZCIsInB1c2giLCJyZWFkZXJzIiwidGFrZXJzIiwiY29uc3VtZVRha2UiLCJsaXN0ZW4iLCJpZHgiLCJmaW5kSW5kZXgiLCJ0Iiwic3BsaWNlIiwiY2FsbGJhY2siLCJkZWxldGVUYWtlciIsImRlbGV0ZUxpc3RlbmVycyIsImZpbHRlciIsInB1dCIsIml0ZW0iLCJmb3JFYWNoIiwicmVhZGVyIiwic2hpZnQiLCJ0YWtlIiwic3Vic2NyaWJlIiwibm9ybWFsaXplT3B0aW9ucyIsImluaXRpYWxDYWxsIiwibG9nZ2VyIiwibG9nIiwiYmVmb3JlUHV0SXRlbSIsInB1dE9wUmVzIiwiYWZ0ZXJQdXRJdGVtIiwidW5zdWJzY3JpYmUiLCJ1bmRlZmluZWQiLCJ0YWtlT3BSZXMiLCJhZnRlclRha2VJdGVtIiwiYnVmZmVyIiwiZml4ZWQiLCJFcnJvciIsImNoYW4iLCJpZCIsImJ1ZmYiLCJzdGF0ZSIsIk9QRU4iLCJnZXRJZCIsIkNIQU5ORUxTIiwiZXhpc3RzIiwiY2hhbm5lbCIsInN0ciIsIm5hbWUiLCJzZXRQcm9wIiwic2V0V2hvTmFtZSIsInNldCIsImlzQWN0aXZlIiwicyIsImV4cG9ydEFzIiwia2V5IiwicmVnaXN0ZXIiLCJncmlkIiwiYWRkIiwibm9vcCIsIm9wcyIsInNwdXQiLCJjaGFubmVscyIsIm5vcm1hbGl6ZUNoYW5uZWxzIiwicmVzdWx0IiwibWFwIiwiTk9USElORyIsInNldFJlc3VsdCIsImluY2x1ZGVzIiwiY2hTdGF0ZSIsInB1dFJlc3VsdCIsIm9wIiwiUFVUIiwic3Rha2UiLCJub3JtYWxpemVUbyIsInVuc3Vic2NyaWJlcnMiLCJzdHJhdGVneSIsIkFMTF9SRVFVSVJFRCIsIkVOREVEIiwiQ0xPU0VEIiwidGFrZVJlc3VsdCIsIk9ORV9PRiIsImRvbmUiLCJmIiwiVEFLRSIsIlJFQUQiLCJzcmVhZCIsInRvIiwidW5zdWJBbGwiLCJjbG9zZSIsImNoIiwibmV3U3RhdGUiLCJwIiwicmVtb3ZlIiwiZGVsIiwic2Nsb3NlIiwiY2hhbm5lbFJlc2V0Iiwic2NoYW5uZWxSZXNldCIsImNhbGwiLCJyb3V0aW5lIiwiYXJncyIsIkNBTExfUk9VVElORSIsImZvcmsiLCJGT1JLX1JPVVRJTkUiLCJtZXJnZSIsIm5ld0NoIiwidGFrZXIiLCJ0aW1lb3V0IiwiaW50ZXJ2YWwiLCJzZXRUaW1lb3V0IiwiaXNDaGFubmVsIiwiaXNSaWV3IiwiciIsImlzU3RhdGUiLCJpc1JvdXRpbmUiLCJ2ZXJpZnlDaGFubmVsIiwidGhyb3dFcnJvciIsImdvIiwiZnVuYyIsIlJVTk5JTkciLCJTVE9QUEVEIiwiZ2V0RnVuY05hbWUiLCJjaGlsZHJlbiIsInN0b3AiLCJyZXJ1biIsImdlbiIsIm5leHQiLCJhZGRTdWJSb3V0aW5lIiwicHJvY2Vzc0dlbmVyYXRvclN0ZXAiLCJpIiwibmV4dEFyZ3MiLCJTTEVFUCIsIm1zIiwiU1RPUCIsInN0ZXAiLCJpc1Byb21pc2UiLCJ0aGVuIiwiYXN5bmNSZXN1bHQiLCJjYXRjaCIsImVyciIsInRocm93Iiwid2l0aCIsIm1hcHMiLCJyZWR1Y2VkTWFwcyIsInVzZSIsInNsZWVwIiwiREVGQVVMVF9TRUxFQ1RPUiIsIkRFRkFVTFRfUkVEVUNFUiIsIl8iLCJERUZBVUxUX0VSUk9SIiwiZSIsImluaXRpYWxWYWx1ZSIsInN5bmNDaGlsZHJlbiIsImluaXRpYXRvciIsImMiLCJfX3N5bmNpbmciLCJzZWxlY3RvciIsInJlZHVjZXIiLCJvbkVycm9yIiwiaXNHZW5lcmF0b3JGdW5jdGlvbiIsInJvdXRpbmVSZXMiLCJwYXlsb2FkIiwiZ2VuUmVzdWx0Iiwic2VsZWN0IiwibXV0YXRlIiwiZGVzdHJveSIsImdldCIsIm5ld1ZhbHVlIiwiREVGQVVMVCIsIkFycmF5IiwiaXNBcnJheSIsInVzZXJUYWtlQ2FsbGJhY2siLCJHcmlkIiwiZ3JpZEFQSSIsIm5vZGVzIiwicHJvZHVjdCIsImdldE5vZGVCeUlkIiwibm9kZUlkIiwiZmluZCIsIlN5bWJvbCIsImdldEFsbCIsImIiLCJyZWFjdCIsInJpZXciLCJyZWFjdFJpZXciLCJSIiwicHJvZHVjZSIsIndoYXRldmVyIiwiZGVmaW5lUHJvZHVjdCIsIkxvZ2dlciIsInJlc2V0SWRzIiwicmVnaXN0cnkiLCJnZXRDaGFubmVsIiwiaW5zcGVjdG9yIiwiaW5zcCIsImlzRGVmaW5lZCIsIndoYXQiLCJnZXRPcmlnaW4iLCJsb2NhdGlvbiIsInByb3RvY29sIiwiaG9zdCIsImxvZ1NuYXBzaG90c1RvQ29uc29sZSIsImVuYWJsZSIsIm9uIiwic25hcHNob3QiLCJ3aW5kb3ciLCJjb25zb2xlIiwicG9zdE1lc3NhZ2UiLCJ0eXBlIiwic291cmNlIiwib3JpZ2luIiwidGltZSIsIkRhdGUiLCJnZXRUaW1lIiwiUklFVyIsIlNUQVRFIiwiQ0hBTk5FTCIsIlJPVVRJTkUiLCJub3JtYWxpemVSaWV3Iiwidmlld0RhdGEiLCJzYW5pdGl6ZSIsInJlbmRlcmVyIiwiZGF0YSIsImNoaWxkIiwibm9ybWFsaXplU3RhdGUiLCJub3JtYWxpemVDaGFubmVsIiwibm9ybWFsaXplUm91dGluZSIsIndhcm4iLCJvIiwiZnJhbWVzIiwiaW5Qcm9ncmVzcyIsImVuYWJsZWQiLCJsaXN0ZW5lcnMiLCJsaXN0ZW5lciIsIndobyIsIm1ldGEiLCJQcm9taXNlIiwicmVzb2x2ZSIsImZyYW1lIiwibCIsImFjdGlvbnMiLCJub3ciLCJkaXNhYmxlIiwiYWN0aW9uIiwiVmlldyIsInJvdXRpbmVzIiwiY3JlYXRlQnJpZGdlIiwiZXh0ZXJuYWxzIiwiY29tcCIsIm91dGVyUHJvcHMiLCJpbnN0YW5jZSIsInNldEluc3RhbmNlIiwidXNlU3RhdGUiLCJjb250ZW50Iiwic2V0Q29udGVudCIsIm1vdW50ZWQiLCJ1c2VSZWYiLCJ1c2VFZmZlY3QiLCJ1cGRhdGUiLCJuYW1lZFJpZXciLCJwcm9wcyIsIm1vdW50IiwiY3VycmVudCIsInVubW91bnQiLCJSZWFjdCIsImNyZWF0ZUVsZW1lbnQiLCJkaXNwbGF5TmFtZSIsIlJlZ2lzdHJ5IiwicHJvZHVjdHMiLCJ1bmRlZmluZVByb2R1Y3QiLCJkZWJ1ZyIsInByb2R1Y3ROYW1lcyIsIk9iamVjdCIsImtleXMiLCJSZW5kZXJlciIsInB1c2hEYXRhVG9WaWV3IiwiYWN0aXZlIiwibmV3RGF0YSIsImFjY3VtdWxhdGUiLCJ2aWV3RnVuYyIsImNsZWFudXBzIiwic3Vic2NyaXB0aW9ucyIsImFkZENoaWxkIiwiU3RhdGUiLCJuIiwiU2xpZGluZyIsIkZpeGVkIiwiRHJvcHBpbmciLCJWSUVXX0NIQU5ORUwiLCJQUk9QU19DSEFOTkVMIiwibm9ybWFsaXplUmVuZGVyRGF0YSIsIm9iaiIsInJlcXVpcmVPYmplY3QiLCJuZXdQcm9wcyIsImNvbmNhdCIsInJlbmRlciIsImlzT2JqZWN0RW1wdHkiLCJzdWJJZCIsIl9fc2V0RXh0ZXJuYWxzIiwidGVzdCIsIm5ld0luc3RhbmNlIiwic29tZXRoaW5nIiwic2hvd0Vycm9ySW5Db25zb2xlIiwiSlNPTiIsInBhcnNlIiwiQ2lyY3VsYXJKU09OIiwic3RyaW5naWZ5IiwiU2VyaWFsaXplRXJyb3IiLCJlcnJvciIsInNwZWNpYWxDaGFyIiwic2FmZVNwZWNpYWxDaGFyIiwiY2hhckNvZGVBdCIsInRvU3RyaW5nIiwic2xpY2UiLCJlc2NhcGVkU2FmZVNwZWNpYWxDaGFyIiwic3BlY2lhbENoYXJSRyIsIlJlZ0V4cCIsInNhZmVTcGVjaWFsQ2hhclJHIiwic2FmZVN0YXJ0V2l0aFNwZWNpYWxDaGFyUkciLCJpbmRleE9mIiwiJFN0cmluZyIsIlN0cmluZyIsImdlbmVyYXRlUmVwbGFjZXIiLCJyZXBsYWNlciIsImluc3BlY3QiLCJwYXRoIiwiYWxsIiwic2VlbiIsIm1hcHAiLCJsYXN0IiwibHZsIiwiZm4iLCJyZXBsYWNlIiwiam9pbiIsInJldHJpZXZlRnJvbVBhdGgiLCJnZW5lcmF0ZVJldml2ZXIiLCJyZXZpdmVyIiwiaXNTdHJpbmciLCJjaGFyQXQiLCJyZWdlbmVyYXRlIiwicmVnZW5lcmF0ZUFycmF5Iiwicm9vdCIsInJldHJpZXZlIiwicmVnZW5lcmF0ZU9iamVjdCIsImhhc093blByb3BlcnR5Iiwic3BsaXQiLCJzdHJpbmdpZnlSZWN1cnNpb24iLCJzcGFjZSIsImRvTm90UmVzb2x2ZSIsInBhcnNlUmVjdXJzaW9uIiwidGV4dCIsIm1vZHVsZSIsImV4cG9ydHMiLCJkZXN0cm95Q2lyY3VsYXIiLCJmcm9tIiwibWVzc2FnZSIsInN0YWNrIiwiZXhlYyIsImlkcyIsInByZWZpeCIsInByb3AiLCJpc09iamVjdExpdGVyYWwiLCJjb25zdHJ1Y3RvciIsImlzR2VuZXJhdG9yIiwicHJvdG90eXBlIiwicHJvcE5hbWUiLCJkZWZpbmVQcm9wZXJ0eSIsIndyaXRhYmxlIiwidG9Mb3dlckNhc2UiXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGtEQUEwQyxnQ0FBZ0M7QUFDMUU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxnRUFBd0Qsa0JBQWtCO0FBQzFFO0FBQ0EseURBQWlELGNBQWM7QUFDL0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlEQUF5QyxpQ0FBaUM7QUFDMUUsd0hBQWdILG1CQUFtQixFQUFFO0FBQ3JJO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtB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QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxnQkFBZ0I7QUFDM0I7QUFDQSxXQUFXLFVBQVU7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsVUFBVTtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7QUFHQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsc0ZBQXNGLGFBQWE7QUFDbkc7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FB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Q0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFFBQVE7QUFDbkIsWUFBWSxhQUFhO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEI7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNLEtBQUk7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNLEtBQUk7QUFDVjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7OztBQUdBLGtEQUFrRDs7O0FBR2xEOzs7QUFHQTs7O0FBR0E7QUFDQTs7QUFFQTs7O0FBR0E7OztBQUdBOzs7QUFHQTtBQUNBOzs7QUFHQTtBQUNBOzs7OztBQUtBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7OztBQUdBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FBSUE7QUFDQTtBQUNBLENBQUM7O0FBRUQ7O0FBRUE7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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0EsV0FBVztBQUNYOztBQUVBO0FBQ0E7QUFDQSx3Q0FBd0MsV0FBVztBQUNuRDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsMkJBQTJCO0FBQzNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsU0FBUztBQUNUO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxvQ0FBb0MsY0FBYztBQUNsRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxpQ0FBaUMsa0JBQWtCO0FBQ25EO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxpQkFBaUI7O0FBRWpCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixpQkFBaUI7QUFDekM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxZQUFZO0FBQ1o7QUFDQTs7QUFFQTtBQUNBLFlBQVk7QUFDWjs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLDhDQUE4QyxRQUFRO0FBQ3REO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTs7QUFFQSxXQUFXO0FBQ1g7QUFDQTtBQUNBOztBQUVBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7O0FBRUEsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBLDhDQUE4QyxRQUFRO0FBQ3REO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7O0FBRUE7QUFDQSxLQUFLOztBQUVMO0FBQ0EsOENBQThDLFFBQVE7QUFDdEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0EsOENBQThDLFFBQVE7QUFDdEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFLEtBQTBCLG9CQUFvQixTQUFFO0FBQ2xEOztBQUVBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNydEJBO0FBQ0E7QUFjQWtOLHNEQUFTLENBQUMsWUFBTSxDQUFFLENBQVQsRUFBVyxJQUFYLENBQVQ7QUFFQSxJQUFNNUksQ0FBQyxHQUFHWixrREFBSyxDQUFDLEtBQUQsQ0FBZjtBQUNBLElBQU11VSxXQUFXLEdBQUczVCxDQUFDLENBQUM4RyxNQUFGLENBQVMsVUFBQXpMLENBQUM7QUFBQSxTQUFJQSxDQUFDLENBQUNzWSxXQUFGLEVBQUo7QUFBQSxDQUFWLENBQUgsbUJBQWpCO0FBRUF4VyxtREFBTSxDQUFDd1csV0FBRCxFQUFjLFVBQUF0WSxDQUFDO0FBQUEsU0FBSW9PLE9BQU8sQ0FBQ25MLEdBQVIsQ0FBWWpELENBQVosQ0FBSjtBQUFBLENBQWYsQ0FBTjtBQUNBbUYsaURBQUksQ0FBQ1IsQ0FBRCxFQUFJLEtBQUosQ0FBSixDLENBRUEsb0UiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCIvXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAwKTtcbiIsIi8qXG5vYmplY3QtYXNzaWduXG4oYykgU2luZHJlIFNvcmh1c1xuQGxpY2Vuc2UgTUlUXG4qL1xuXG4ndXNlIHN0cmljdCc7XG4vKiBlc2xpbnQtZGlzYWJsZSBuby11bnVzZWQtdmFycyAqL1xudmFyIGdldE93blByb3BlcnR5U3ltYm9scyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHM7XG52YXIgaGFzT3duUHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xudmFyIHByb3BJc0VudW1lcmFibGUgPSBPYmplY3QucHJvdG90eXBlLnByb3BlcnR5SXNFbnVtZXJhYmxlO1xuXG5mdW5jdGlvbiB0b09iamVjdCh2YWwpIHtcblx0aWYgKHZhbCA9PT0gbnVsbCB8fCB2YWwgPT09IHVuZGVmaW5lZCkge1xuXHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ09iamVjdC5hc3NpZ24gY2Fubm90IGJlIGNhbGxlZCB3aXRoIG51bGwgb3IgdW5kZWZpbmVkJyk7XG5cdH1cblxuXHRyZXR1cm4gT2JqZWN0KHZhbCk7XG59XG5cbmZ1bmN0aW9uIHNob3VsZFVzZU5hdGl2ZSgpIHtcblx0dHJ5IHtcblx0XHRpZiAoIU9iamVjdC5hc3NpZ24pIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBEZXRlY3QgYnVnZ3kgcHJvcGVydHkgZW51bWVyYXRpb24gb3JkZXIgaW4gb2xkZXIgVjggdmVyc2lvbnMuXG5cblx0XHQvLyBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvdjgvaXNzdWVzL2RldGFpbD9pZD00MTE4XG5cdFx0dmFyIHRlc3QxID0gbmV3IFN0cmluZygnYWJjJyk7ICAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLW5ldy13cmFwcGVyc1xuXHRcdHRlc3QxWzVdID0gJ2RlJztcblx0XHRpZiAoT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGVzdDEpWzBdID09PSAnNScpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvdjgvaXNzdWVzL2RldGFpbD9pZD0zMDU2XG5cdFx0dmFyIHRlc3QyID0ge307XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCAxMDsgaSsrKSB7XG5cdFx0XHR0ZXN0MlsnXycgKyBTdHJpbmcuZnJvbUNoYXJDb2RlKGkpXSA9IGk7XG5cdFx0fVxuXHRcdHZhciBvcmRlcjIgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0ZXN0MikubWFwKGZ1bmN0aW9uIChuKSB7XG5cdFx0XHRyZXR1cm4gdGVzdDJbbl07XG5cdFx0fSk7XG5cdFx0aWYgKG9yZGVyMi5qb2luKCcnKSAhPT0gJzAxMjM0NTY3ODknKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9MzA1NlxuXHRcdHZhciB0ZXN0MyA9IHt9O1xuXHRcdCdhYmNkZWZnaGlqa2xtbm9wcXJzdCcuc3BsaXQoJycpLmZvckVhY2goZnVuY3Rpb24gKGxldHRlcikge1xuXHRcdFx0dGVzdDNbbGV0dGVyXSA9IGxldHRlcjtcblx0XHR9KTtcblx0XHRpZiAoT2JqZWN0LmtleXMoT2JqZWN0LmFzc2lnbih7fSwgdGVzdDMpKS5qb2luKCcnKSAhPT1cblx0XHRcdFx0J2FiY2RlZmdoaWprbG1ub3BxcnN0Jykge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdHJldHVybiB0cnVlO1xuXHR9IGNhdGNoIChlcnIpIHtcblx0XHQvLyBXZSBkb24ndCBleHBlY3QgYW55IG9mIHRoZSBhYm92ZSB0byB0aHJvdywgYnV0IGJldHRlciB0byBiZSBzYWZlLlxuXHRcdHJldHVybiBmYWxzZTtcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHNob3VsZFVzZU5hdGl2ZSgpID8gT2JqZWN0LmFzc2lnbiA6IGZ1bmN0aW9uICh0YXJnZXQsIHNvdXJjZSkge1xuXHR2YXIgZnJvbTtcblx0dmFyIHRvID0gdG9PYmplY3QodGFyZ2V0KTtcblx0dmFyIHN5bWJvbHM7XG5cblx0Zm9yICh2YXIgcyA9IDE7IHMgPCBhcmd1bWVudHMubGVuZ3RoOyBzKyspIHtcblx0XHRmcm9tID0gT2JqZWN0KGFyZ3VtZW50c1tzXSk7XG5cblx0XHRmb3IgKHZhciBrZXkgaW4gZnJvbSkge1xuXHRcdFx0aWYgKGhhc093blByb3BlcnR5LmNhbGwoZnJvbSwga2V5KSkge1xuXHRcdFx0XHR0b1trZXldID0gZnJvbVtrZXldO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmIChnZXRPd25Qcm9wZXJ0eVN5bWJvbHMpIHtcblx0XHRcdHN5bWJvbHMgPSBnZXRPd25Qcm9wZXJ0eVN5bWJvbHMoZnJvbSk7XG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHN5bWJvbHMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0aWYgKHByb3BJc0VudW1lcmFibGUuY2FsbChmcm9tLCBzeW1ib2xzW2ldKSkge1xuXHRcdFx0XHRcdHRvW3N5bWJvbHNbaV1dID0gZnJvbVtzeW1ib2xzW2ldXTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdHJldHVybiB0bztcbn07XG4iLCIvKipcbiAqIENvcHlyaWdodCAoYykgMjAxMy1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIHByaW50V2FybmluZyA9IGZ1bmN0aW9uKCkge307XG5cbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gIHZhciBSZWFjdFByb3BUeXBlc1NlY3JldCA9IHJlcXVpcmUoJy4vbGliL1JlYWN0UHJvcFR5cGVzU2VjcmV0Jyk7XG4gIHZhciBsb2dnZWRUeXBlRmFpbHVyZXMgPSB7fTtcbiAgdmFyIGhhcyA9IEZ1bmN0aW9uLmNhbGwuYmluZChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5KTtcblxuICBwcmludFdhcm5pbmcgPSBmdW5jdGlvbih0ZXh0KSB7XG4gICAgdmFyIG1lc3NhZ2UgPSAnV2FybmluZzogJyArIHRleHQ7XG4gICAgaWYgKHR5cGVvZiBjb25zb2xlICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgY29uc29sZS5lcnJvcihtZXNzYWdlKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgIC8vIC0tLSBXZWxjb21lIHRvIGRlYnVnZ2luZyBSZWFjdCAtLS1cbiAgICAgIC8vIFRoaXMgZXJyb3Igd2FzIHRocm93biBhcyBhIGNvbnZlbmllbmNlIHNvIHRoYXQgeW91IGNhbiB1c2UgdGhpcyBzdGFja1xuICAgICAgLy8gdG8gZmluZCB0aGUgY2FsbHNpdGUgdGhhdCBjYXVzZWQgdGhpcyB3YXJuaW5nIHRvIGZpcmUuXG4gICAgICB0aHJvdyBuZXcgRXJyb3IobWVzc2FnZSk7XG4gICAgfSBjYXRjaCAoeCkge31cbiAgfTtcbn1cblxuLyoqXG4gKiBBc3NlcnQgdGhhdCB0aGUgdmFsdWVzIG1hdGNoIHdpdGggdGhlIHR5cGUgc3BlY3MuXG4gKiBFcnJvciBtZXNzYWdlcyBhcmUgbWVtb3JpemVkIGFuZCB3aWxsIG9ubHkgYmUgc2hvd24gb25jZS5cbiAqXG4gKiBAcGFyYW0ge29iamVjdH0gdHlwZVNwZWNzIE1hcCBvZiBuYW1lIHRvIGEgUmVhY3RQcm9wVHlwZVxuICogQHBhcmFtIHtvYmplY3R9IHZhbHVlcyBSdW50aW1lIHZhbHVlcyB0aGF0IG5lZWQgdG8gYmUgdHlwZS1jaGVja2VkXG4gKiBAcGFyYW0ge3N0cmluZ30gbG9jYXRpb24gZS5nLiBcInByb3BcIiwgXCJjb250ZXh0XCIsIFwiY2hpbGQgY29udGV4dFwiXG4gKiBAcGFyYW0ge3N0cmluZ30gY29tcG9uZW50TmFtZSBOYW1lIG9mIHRoZSBjb21wb25lbnQgZm9yIGVycm9yIG1lc3NhZ2VzLlxuICogQHBhcmFtIHs/RnVuY3Rpb259IGdldFN0YWNrIFJldHVybnMgdGhlIGNvbXBvbmVudCBzdGFjay5cbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIGNoZWNrUHJvcFR5cGVzKHR5cGVTcGVjcywgdmFsdWVzLCBsb2NhdGlvbiwgY29tcG9uZW50TmFtZSwgZ2V0U3RhY2spIHtcbiAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICBmb3IgKHZhciB0eXBlU3BlY05hbWUgaW4gdHlwZVNwZWNzKSB7XG4gICAgICBpZiAoaGFzKHR5cGVTcGVjcywgdHlwZVNwZWNOYW1lKSkge1xuICAgICAgICB2YXIgZXJyb3I7XG4gICAgICAgIC8vIFByb3AgdHlwZSB2YWxpZGF0aW9uIG1heSB0aHJvdy4gSW4gY2FzZSB0aGV5IGRvLCB3ZSBkb24ndCB3YW50IHRvXG4gICAgICAgIC8vIGZhaWwgdGhlIHJlbmRlciBwaGFzZSB3aGVyZSBpdCBkaWRuJ3QgZmFpbCBiZWZvcmUuIFNvIHdlIGxvZyBpdC5cbiAgICAgICAgLy8gQWZ0ZXIgdGhlc2UgaGF2ZSBiZWVuIGNsZWFuZWQgdXAsIHdlJ2xsIGxldCB0aGVtIHRocm93LlxuICAgICAgICB0cnkge1xuICAgICAgICAgIC8vIFRoaXMgaXMgaW50ZW50aW9uYWxseSBhbiBpbnZhcmlhbnQgdGhhdCBnZXRzIGNhdWdodC4gSXQncyB0aGUgc2FtZVxuICAgICAgICAgIC8vIGJlaGF2aW9yIGFzIHdpdGhvdXQgdGhpcyBzdGF0ZW1lbnQgZXhjZXB0IHdpdGggYSBiZXR0ZXIgbWVzc2FnZS5cbiAgICAgICAgICBpZiAodHlwZW9mIHR5cGVTcGVjc1t0eXBlU3BlY05hbWVdICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICB2YXIgZXJyID0gRXJyb3IoXG4gICAgICAgICAgICAgIChjb21wb25lbnROYW1lIHx8ICdSZWFjdCBjbGFzcycpICsgJzogJyArIGxvY2F0aW9uICsgJyB0eXBlIGAnICsgdHlwZVNwZWNOYW1lICsgJ2AgaXMgaW52YWxpZDsgJyArXG4gICAgICAgICAgICAgICdpdCBtdXN0IGJlIGEgZnVuY3Rpb24sIHVzdWFsbHkgZnJvbSB0aGUgYHByb3AtdHlwZXNgIHBhY2thZ2UsIGJ1dCByZWNlaXZlZCBgJyArIHR5cGVvZiB0eXBlU3BlY3NbdHlwZVNwZWNOYW1lXSArICdgLidcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBlcnIubmFtZSA9ICdJbnZhcmlhbnQgVmlvbGF0aW9uJztcbiAgICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgICB9XG4gICAgICAgICAgZXJyb3IgPSB0eXBlU3BlY3NbdHlwZVNwZWNOYW1lXSh2YWx1ZXMsIHR5cGVTcGVjTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIG51bGwsIFJlYWN0UHJvcFR5cGVzU2VjcmV0KTtcbiAgICAgICAgfSBjYXRjaCAoZXgpIHtcbiAgICAgICAgICBlcnJvciA9IGV4O1xuICAgICAgICB9XG4gICAgICAgIGlmIChlcnJvciAmJiAhKGVycm9yIGluc3RhbmNlb2YgRXJyb3IpKSB7XG4gICAgICAgICAgcHJpbnRXYXJuaW5nKFxuICAgICAgICAgICAgKGNvbXBvbmVudE5hbWUgfHwgJ1JlYWN0IGNsYXNzJykgKyAnOiB0eXBlIHNwZWNpZmljYXRpb24gb2YgJyArXG4gICAgICAgICAgICBsb2NhdGlvbiArICcgYCcgKyB0eXBlU3BlY05hbWUgKyAnYCBpcyBpbnZhbGlkOyB0aGUgdHlwZSBjaGVja2VyICcgK1xuICAgICAgICAgICAgJ2Z1bmN0aW9uIG11c3QgcmV0dXJuIGBudWxsYCBvciBhbiBgRXJyb3JgIGJ1dCByZXR1cm5lZCBhICcgKyB0eXBlb2YgZXJyb3IgKyAnLiAnICtcbiAgICAgICAgICAgICdZb3UgbWF5IGhhdmUgZm9yZ290dGVuIHRvIHBhc3MgYW4gYXJndW1lbnQgdG8gdGhlIHR5cGUgY2hlY2tlciAnICtcbiAgICAgICAgICAgICdjcmVhdG9yIChhcnJheU9mLCBpbnN0YW5jZU9mLCBvYmplY3RPZiwgb25lT2YsIG9uZU9mVHlwZSwgYW5kICcgK1xuICAgICAgICAgICAgJ3NoYXBlIGFsbCByZXF1aXJlIGFuIGFyZ3VtZW50KS4nXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZXJyb3IgaW5zdGFuY2VvZiBFcnJvciAmJiAhKGVycm9yLm1lc3NhZ2UgaW4gbG9nZ2VkVHlwZUZhaWx1cmVzKSkge1xuICAgICAgICAgIC8vIE9ubHkgbW9uaXRvciB0aGlzIGZhaWx1cmUgb25jZSBiZWNhdXNlIHRoZXJlIHRlbmRzIHRvIGJlIGEgbG90IG9mIHRoZVxuICAgICAgICAgIC8vIHNhbWUgZXJyb3IuXG4gICAgICAgICAgbG9nZ2VkVHlwZUZhaWx1cmVzW2Vycm9yLm1lc3NhZ2VdID0gdHJ1ZTtcblxuICAgICAgICAgIHZhciBzdGFjayA9IGdldFN0YWNrID8gZ2V0U3RhY2soKSA6ICcnO1xuXG4gICAgICAgICAgcHJpbnRXYXJuaW5nKFxuICAgICAgICAgICAgJ0ZhaWxlZCAnICsgbG9jYXRpb24gKyAnIHR5cGU6ICcgKyBlcnJvci5tZXNzYWdlICsgKHN0YWNrICE9IG51bGwgPyBzdGFjayA6ICcnKVxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBSZXNldHMgd2FybmluZyBjYWNoZSB3aGVuIHRlc3RpbmcuXG4gKlxuICogQHByaXZhdGVcbiAqL1xuY2hlY2tQcm9wVHlwZXMucmVzZXRXYXJuaW5nQ2FjaGUgPSBmdW5jdGlvbigpIHtcbiAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICBsb2dnZWRUeXBlRmFpbHVyZXMgPSB7fTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNoZWNrUHJvcFR5cGVzO1xuIiwiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTMtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBSZWFjdFByb3BUeXBlc1NlY3JldCA9ICdTRUNSRVRfRE9fTk9UX1BBU1NfVEhJU19PUl9ZT1VfV0lMTF9CRV9GSVJFRCc7XG5cbm1vZHVsZS5leHBvcnRzID0gUmVhY3RQcm9wVHlwZXNTZWNyZXQ7XG4iLCIvKiogQGxpY2Vuc2UgUmVhY3QgdjE2LjkuMFxuICogcmVhY3QuZGV2ZWxvcG1lbnQuanNcbiAqXG4gKiBDb3B5cmlnaHQgKGMpIEZhY2Vib29rLCBJbmMuIGFuZCBpdHMgYWZmaWxpYXRlcy5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cblxuXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSB7XG4gIChmdW5jdGlvbigpIHtcbid1c2Ugc3RyaWN0JztcblxudmFyIF9hc3NpZ24gPSByZXF1aXJlKCdvYmplY3QtYXNzaWduJyk7XG52YXIgY2hlY2tQcm9wVHlwZXMgPSByZXF1aXJlKCdwcm9wLXR5cGVzL2NoZWNrUHJvcFR5cGVzJyk7XG5cbi8vIFRPRE86IHRoaXMgaXMgc3BlY2lhbCBiZWNhdXNlIGl0IGdldHMgaW1wb3J0ZWQgZHVyaW5nIGJ1aWxkLlxuXG52YXIgUmVhY3RWZXJzaW9uID0gJzE2LjkuMCc7XG5cbi8vIFRoZSBTeW1ib2wgdXNlZCB0byB0YWcgdGhlIFJlYWN0RWxlbWVudC1saWtlIHR5cGVzLiBJZiB0aGVyZSBpcyBubyBuYXRpdmUgU3ltYm9sXG4vLyBub3IgcG9seWZpbGwsIHRoZW4gYSBwbGFpbiBudW1iZXIgaXMgdXNlZCBmb3IgcGVyZm9ybWFuY2UuXG52YXIgaGFzU3ltYm9sID0gdHlwZW9mIFN5bWJvbCA9PT0gJ2Z1bmN0aW9uJyAmJiBTeW1ib2wuZm9yO1xuXG52YXIgUkVBQ1RfRUxFTUVOVF9UWVBFID0gaGFzU3ltYm9sID8gU3ltYm9sLmZvcigncmVhY3QuZWxlbWVudCcpIDogMHhlYWM3O1xudmFyIFJFQUNUX1BPUlRBTF9UWVBFID0gaGFzU3ltYm9sID8gU3ltYm9sLmZvcigncmVhY3QucG9ydGFsJykgOiAweGVhY2E7XG52YXIgUkVBQ1RfRlJBR01FTlRfVFlQRSA9IGhhc1N5bWJvbCA/IFN5bWJvbC5mb3IoJ3JlYWN0LmZyYWdtZW50JykgOiAweGVhY2I7XG52YXIgUkVBQ1RfU1RSSUNUX01PREVfVFlQRSA9IGhhc1N5bWJvbCA/IFN5bWJvbC5mb3IoJ3JlYWN0LnN0cmljdF9tb2RlJykgOiAweGVhY2M7XG52YXIgUkVBQ1RfUFJPRklMRVJfVFlQRSA9IGhhc1N5bWJvbCA/IFN5bWJvbC5mb3IoJ3JlYWN0LnByb2ZpbGVyJykgOiAweGVhZDI7XG52YXIgUkVBQ1RfUFJPVklERVJfVFlQRSA9IGhhc1N5bWJvbCA/IFN5bWJvbC5mb3IoJ3JlYWN0LnByb3ZpZGVyJykgOiAweGVhY2Q7XG52YXIgUkVBQ1RfQ09OVEVYVF9UWVBFID0gaGFzU3ltYm9sID8gU3ltYm9sLmZvcigncmVhY3QuY29udGV4dCcpIDogMHhlYWNlO1xuLy8gVE9ETzogV2UgZG9uJ3QgdXNlIEFzeW5jTW9kZSBvciBDb25jdXJyZW50TW9kZSBhbnltb3JlLiBUaGV5IHdlcmUgdGVtcG9yYXJ5XG4vLyAodW5zdGFibGUpIEFQSXMgdGhhdCBoYXZlIGJlZW4gcmVtb3ZlZC4gQ2FuIHdlIHJlbW92ZSB0aGUgc3ltYm9scz9cblxudmFyIFJFQUNUX0NPTkNVUlJFTlRfTU9ERV9UWVBFID0gaGFzU3ltYm9sID8gU3ltYm9sLmZvcigncmVhY3QuY29uY3VycmVudF9tb2RlJykgOiAweGVhY2Y7XG52YXIgUkVBQ1RfRk9SV0FSRF9SRUZfVFlQRSA9IGhhc1N5bWJvbCA/IFN5bWJvbC5mb3IoJ3JlYWN0LmZvcndhcmRfcmVmJykgOiAweGVhZDA7XG52YXIgUkVBQ1RfU1VTUEVOU0VfVFlQRSA9IGhhc1N5bWJvbCA/IFN5bWJvbC5mb3IoJ3JlYWN0LnN1c3BlbnNlJykgOiAweGVhZDE7XG52YXIgUkVBQ1RfU1VTUEVOU0VfTElTVF9UWVBFID0gaGFzU3ltYm9sID8gU3ltYm9sLmZvcigncmVhY3Quc3VzcGVuc2VfbGlzdCcpIDogMHhlYWQ4O1xudmFyIFJFQUNUX01FTU9fVFlQRSA9IGhhc1N5bWJvbCA/IFN5bWJvbC5mb3IoJ3JlYWN0Lm1lbW8nKSA6IDB4ZWFkMztcbnZhciBSRUFDVF9MQVpZX1RZUEUgPSBoYXNTeW1ib2wgPyBTeW1ib2wuZm9yKCdyZWFjdC5sYXp5JykgOiAweGVhZDQ7XG52YXIgUkVBQ1RfRlVOREFNRU5UQUxfVFlQRSA9IGhhc1N5bWJvbCA/IFN5bWJvbC5mb3IoJ3JlYWN0LmZ1bmRhbWVudGFsJykgOiAweGVhZDU7XG52YXIgUkVBQ1RfUkVTUE9OREVSX1RZUEUgPSBoYXNTeW1ib2wgPyBTeW1ib2wuZm9yKCdyZWFjdC5yZXNwb25kZXInKSA6IDB4ZWFkNjtcblxudmFyIE1BWUJFX0lURVJBVE9SX1NZTUJPTCA9IHR5cGVvZiBTeW1ib2wgPT09ICdmdW5jdGlvbicgJiYgU3ltYm9sLml0ZXJhdG9yO1xudmFyIEZBVVhfSVRFUkFUT1JfU1lNQk9MID0gJ0BAaXRlcmF0b3InO1xuXG5mdW5jdGlvbiBnZXRJdGVyYXRvckZuKG1heWJlSXRlcmFibGUpIHtcbiAgaWYgKG1heWJlSXRlcmFibGUgPT09IG51bGwgfHwgdHlwZW9mIG1heWJlSXRlcmFibGUgIT09ICdvYmplY3QnKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgdmFyIG1heWJlSXRlcmF0b3IgPSBNQVlCRV9JVEVSQVRPUl9TWU1CT0wgJiYgbWF5YmVJdGVyYWJsZVtNQVlCRV9JVEVSQVRPUl9TWU1CT0xdIHx8IG1heWJlSXRlcmFibGVbRkFVWF9JVEVSQVRPUl9TWU1CT0xdO1xuICBpZiAodHlwZW9mIG1heWJlSXRlcmF0b3IgPT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gbWF5YmVJdGVyYXRvcjtcbiAgfVxuICByZXR1cm4gbnVsbDtcbn1cblxuLy8gRG8gbm90IHJlcXVpcmUgdGhpcyBtb2R1bGUgZGlyZWN0bHkhIFVzZSBub3JtYWwgYGludmFyaWFudGAgY2FsbHMgd2l0aFxuLy8gdGVtcGxhdGUgbGl0ZXJhbCBzdHJpbmdzLiBUaGUgbWVzc2FnZXMgd2lsbCBiZSBjb252ZXJ0ZWQgdG8gUmVhY3RFcnJvciBkdXJpbmdcbi8vIGJ1aWxkLCBhbmQgaW4gcHJvZHVjdGlvbiB0aGV5IHdpbGwgYmUgbWluaWZpZWQuXG5cbi8vIERvIG5vdCByZXF1aXJlIHRoaXMgbW9kdWxlIGRpcmVjdGx5ISBVc2Ugbm9ybWFsIGBpbnZhcmlhbnRgIGNhbGxzIHdpdGhcbi8vIHRlbXBsYXRlIGxpdGVyYWwgc3RyaW5ncy4gVGhlIG1lc3NhZ2VzIHdpbGwgYmUgY29udmVydGVkIHRvIFJlYWN0RXJyb3IgZHVyaW5nXG4vLyBidWlsZCwgYW5kIGluIHByb2R1Y3Rpb24gdGhleSB3aWxsIGJlIG1pbmlmaWVkLlxuXG5mdW5jdGlvbiBSZWFjdEVycm9yKGVycm9yKSB7XG4gIGVycm9yLm5hbWUgPSAnSW52YXJpYW50IFZpb2xhdGlvbic7XG4gIHJldHVybiBlcnJvcjtcbn1cblxuLyoqXG4gKiBVc2UgaW52YXJpYW50KCkgdG8gYXNzZXJ0IHN0YXRlIHdoaWNoIHlvdXIgcHJvZ3JhbSBhc3N1bWVzIHRvIGJlIHRydWUuXG4gKlxuICogUHJvdmlkZSBzcHJpbnRmLXN0eWxlIGZvcm1hdCAob25seSAlcyBpcyBzdXBwb3J0ZWQpIGFuZCBhcmd1bWVudHNcbiAqIHRvIHByb3ZpZGUgaW5mb3JtYXRpb24gYWJvdXQgd2hhdCBicm9rZSBhbmQgd2hhdCB5b3Ugd2VyZVxuICogZXhwZWN0aW5nLlxuICpcbiAqIFRoZSBpbnZhcmlhbnQgbWVzc2FnZSB3aWxsIGJlIHN0cmlwcGVkIGluIHByb2R1Y3Rpb24sIGJ1dCB0aGUgaW52YXJpYW50XG4gKiB3aWxsIHJlbWFpbiB0byBlbnN1cmUgbG9naWMgZG9lcyBub3QgZGlmZmVyIGluIHByb2R1Y3Rpb24uXG4gKi9cblxuLyoqXG4gKiBGb3JrZWQgZnJvbSBmYmpzL3dhcm5pbmc6XG4gKiBodHRwczovL2dpdGh1Yi5jb20vZmFjZWJvb2svZmJqcy9ibG9iL2U2NmJhMjBhZDViZTQzM2ViNTQ0MjNmMmIwOTdkODI5MzI0ZDlkZTYvcGFja2FnZXMvZmJqcy9zcmMvX19mb3Jrc19fL3dhcm5pbmcuanNcbiAqXG4gKiBPbmx5IGNoYW5nZSBpcyB3ZSB1c2UgY29uc29sZS53YXJuIGluc3RlYWQgb2YgY29uc29sZS5lcnJvcixcbiAqIGFuZCBkbyBub3RoaW5nIHdoZW4gJ2NvbnNvbGUnIGlzIG5vdCBzdXBwb3J0ZWQuXG4gKiBUaGlzIHJlYWxseSBzaW1wbGlmaWVzIHRoZSBjb2RlLlxuICogLS0tXG4gKiBTaW1pbGFyIHRvIGludmFyaWFudCBidXQgb25seSBsb2dzIGEgd2FybmluZyBpZiB0aGUgY29uZGl0aW9uIGlzIG5vdCBtZXQuXG4gKiBUaGlzIGNhbiBiZSB1c2VkIHRvIGxvZyBpc3N1ZXMgaW4gZGV2ZWxvcG1lbnQgZW52aXJvbm1lbnRzIGluIGNyaXRpY2FsXG4gKiBwYXRocy4gUmVtb3ZpbmcgdGhlIGxvZ2dpbmcgY29kZSBmb3IgcHJvZHVjdGlvbiBlbnZpcm9ubWVudHMgd2lsbCBrZWVwIHRoZVxuICogc2FtZSBsb2dpYyBhbmQgZm9sbG93IHRoZSBzYW1lIGNvZGUgcGF0aHMuXG4gKi9cblxudmFyIGxvd1ByaW9yaXR5V2FybmluZyA9IGZ1bmN0aW9uICgpIHt9O1xuXG57XG4gIHZhciBwcmludFdhcm5pbmcgPSBmdW5jdGlvbiAoZm9ybWF0KSB7XG4gICAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuID4gMSA/IF9sZW4gLSAxIDogMCksIF9rZXkgPSAxOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgICBhcmdzW19rZXkgLSAxXSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgICB9XG5cbiAgICB2YXIgYXJnSW5kZXggPSAwO1xuICAgIHZhciBtZXNzYWdlID0gJ1dhcm5pbmc6ICcgKyBmb3JtYXQucmVwbGFjZSgvJXMvZywgZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIGFyZ3NbYXJnSW5kZXgrK107XG4gICAgfSk7XG4gICAgaWYgKHR5cGVvZiBjb25zb2xlICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgY29uc29sZS53YXJuKG1lc3NhZ2UpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgLy8gLS0tIFdlbGNvbWUgdG8gZGVidWdnaW5nIFJlYWN0IC0tLVxuICAgICAgLy8gVGhpcyBlcnJvciB3YXMgdGhyb3duIGFzIGEgY29udmVuaWVuY2Ugc28gdGhhdCB5b3UgY2FuIHVzZSB0aGlzIHN0YWNrXG4gICAgICAvLyB0byBmaW5kIHRoZSBjYWxsc2l0ZSB0aGF0IGNhdXNlZCB0aGlzIHdhcm5pbmcgdG8gZmlyZS5cbiAgICAgIHRocm93IG5ldyBFcnJvcihtZXNzYWdlKTtcbiAgICB9IGNhdGNoICh4KSB7fVxuICB9O1xuXG4gIGxvd1ByaW9yaXR5V2FybmluZyA9IGZ1bmN0aW9uIChjb25kaXRpb24sIGZvcm1hdCkge1xuICAgIGlmIChmb3JtYXQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdgbG93UHJpb3JpdHlXYXJuaW5nKGNvbmRpdGlvbiwgZm9ybWF0LCAuLi5hcmdzKWAgcmVxdWlyZXMgYSB3YXJuaW5nICcgKyAnbWVzc2FnZSBhcmd1bWVudCcpO1xuICAgIH1cbiAgICBpZiAoIWNvbmRpdGlvbikge1xuICAgICAgZm9yICh2YXIgX2xlbjIgPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbjIgPiAyID8gX2xlbjIgLSAyIDogMCksIF9rZXkyID0gMjsgX2tleTIgPCBfbGVuMjsgX2tleTIrKykge1xuICAgICAgICBhcmdzW19rZXkyIC0gMl0gPSBhcmd1bWVudHNbX2tleTJdO1xuICAgICAgfVxuXG4gICAgICBwcmludFdhcm5pbmcuYXBwbHkodW5kZWZpbmVkLCBbZm9ybWF0XS5jb25jYXQoYXJncykpO1xuICAgIH1cbiAgfTtcbn1cblxudmFyIGxvd1ByaW9yaXR5V2FybmluZyQxID0gbG93UHJpb3JpdHlXYXJuaW5nO1xuXG4vKipcbiAqIFNpbWlsYXIgdG8gaW52YXJpYW50IGJ1dCBvbmx5IGxvZ3MgYSB3YXJuaW5nIGlmIHRoZSBjb25kaXRpb24gaXMgbm90IG1ldC5cbiAqIFRoaXMgY2FuIGJlIHVzZWQgdG8gbG9nIGlzc3VlcyBpbiBkZXZlbG9wbWVudCBlbnZpcm9ubWVudHMgaW4gY3JpdGljYWxcbiAqIHBhdGhzLiBSZW1vdmluZyB0aGUgbG9nZ2luZyBjb2RlIGZvciBwcm9kdWN0aW9uIGVudmlyb25tZW50cyB3aWxsIGtlZXAgdGhlXG4gKiBzYW1lIGxvZ2ljIGFuZCBmb2xsb3cgdGhlIHNhbWUgY29kZSBwYXRocy5cbiAqL1xuXG52YXIgd2FybmluZ1dpdGhvdXRTdGFjayA9IGZ1bmN0aW9uICgpIHt9O1xuXG57XG4gIHdhcm5pbmdXaXRob3V0U3RhY2sgPSBmdW5jdGlvbiAoY29uZGl0aW9uLCBmb3JtYXQpIHtcbiAgICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IEFycmF5KF9sZW4gPiAyID8gX2xlbiAtIDIgOiAwKSwgX2tleSA9IDI7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICAgIGFyZ3NbX2tleSAtIDJdID0gYXJndW1lbnRzW19rZXldO1xuICAgIH1cblxuICAgIGlmIChmb3JtYXQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdgd2FybmluZ1dpdGhvdXRTdGFjayhjb25kaXRpb24sIGZvcm1hdCwgLi4uYXJncylgIHJlcXVpcmVzIGEgd2FybmluZyAnICsgJ21lc3NhZ2UgYXJndW1lbnQnKTtcbiAgICB9XG4gICAgaWYgKGFyZ3MubGVuZ3RoID4gOCkge1xuICAgICAgLy8gQ2hlY2sgYmVmb3JlIHRoZSBjb25kaXRpb24gdG8gY2F0Y2ggdmlvbGF0aW9ucyBlYXJseS5cbiAgICAgIHRocm93IG5ldyBFcnJvcignd2FybmluZ1dpdGhvdXRTdGFjaygpIGN1cnJlbnRseSBzdXBwb3J0cyBhdCBtb3N0IDggYXJndW1lbnRzLicpO1xuICAgIH1cbiAgICBpZiAoY29uZGl0aW9uKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICh0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHZhciBhcmdzV2l0aEZvcm1hdCA9IGFyZ3MubWFwKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgIHJldHVybiAnJyArIGl0ZW07XG4gICAgICB9KTtcbiAgICAgIGFyZ3NXaXRoRm9ybWF0LnVuc2hpZnQoJ1dhcm5pbmc6ICcgKyBmb3JtYXQpO1xuXG4gICAgICAvLyBXZSBpbnRlbnRpb25hbGx5IGRvbid0IHVzZSBzcHJlYWQgKG9yIC5hcHBseSkgZGlyZWN0bHkgYmVjYXVzZSBpdFxuICAgICAgLy8gYnJlYWtzIElFOTogaHR0cHM6Ly9naXRodWIuY29tL2ZhY2Vib29rL3JlYWN0L2lzc3Vlcy8xMzYxMFxuICAgICAgRnVuY3Rpb24ucHJvdG90eXBlLmFwcGx5LmNhbGwoY29uc29sZS5lcnJvciwgY29uc29sZSwgYXJnc1dpdGhGb3JtYXQpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgLy8gLS0tIFdlbGNvbWUgdG8gZGVidWdnaW5nIFJlYWN0IC0tLVxuICAgICAgLy8gVGhpcyBlcnJvciB3YXMgdGhyb3duIGFzIGEgY29udmVuaWVuY2Ugc28gdGhhdCB5b3UgY2FuIHVzZSB0aGlzIHN0YWNrXG4gICAgICAvLyB0byBmaW5kIHRoZSBjYWxsc2l0ZSB0aGF0IGNhdXNlZCB0aGlzIHdhcm5pbmcgdG8gZmlyZS5cbiAgICAgIHZhciBhcmdJbmRleCA9IDA7XG4gICAgICB2YXIgbWVzc2FnZSA9ICdXYXJuaW5nOiAnICsgZm9ybWF0LnJlcGxhY2UoLyVzL2csIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGFyZ3NbYXJnSW5kZXgrK107XG4gICAgICB9KTtcbiAgICAgIHRocm93IG5ldyBFcnJvcihtZXNzYWdlKTtcbiAgICB9IGNhdGNoICh4KSB7fVxuICB9O1xufVxuXG52YXIgd2FybmluZ1dpdGhvdXRTdGFjayQxID0gd2FybmluZ1dpdGhvdXRTdGFjaztcblxudmFyIGRpZFdhcm5TdGF0ZVVwZGF0ZUZvclVubW91bnRlZENvbXBvbmVudCA9IHt9O1xuXG5mdW5jdGlvbiB3YXJuTm9vcChwdWJsaWNJbnN0YW5jZSwgY2FsbGVyTmFtZSkge1xuICB7XG4gICAgdmFyIF9jb25zdHJ1Y3RvciA9IHB1YmxpY0luc3RhbmNlLmNvbnN0cnVjdG9yO1xuICAgIHZhciBjb21wb25lbnROYW1lID0gX2NvbnN0cnVjdG9yICYmIChfY29uc3RydWN0b3IuZGlzcGxheU5hbWUgfHwgX2NvbnN0cnVjdG9yLm5hbWUpIHx8ICdSZWFjdENsYXNzJztcbiAgICB2YXIgd2FybmluZ0tleSA9IGNvbXBvbmVudE5hbWUgKyAnLicgKyBjYWxsZXJOYW1lO1xuICAgIGlmIChkaWRXYXJuU3RhdGVVcGRhdGVGb3JVbm1vdW50ZWRDb21wb25lbnRbd2FybmluZ0tleV0pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgd2FybmluZ1dpdGhvdXRTdGFjayQxKGZhbHNlLCBcIkNhbid0IGNhbGwgJXMgb24gYSBjb21wb25lbnQgdGhhdCBpcyBub3QgeWV0IG1vdW50ZWQuIFwiICsgJ1RoaXMgaXMgYSBuby1vcCwgYnV0IGl0IG1pZ2h0IGluZGljYXRlIGEgYnVnIGluIHlvdXIgYXBwbGljYXRpb24uICcgKyAnSW5zdGVhZCwgYXNzaWduIHRvIGB0aGlzLnN0YXRlYCBkaXJlY3RseSBvciBkZWZpbmUgYSBgc3RhdGUgPSB7fTtgICcgKyAnY2xhc3MgcHJvcGVydHkgd2l0aCB0aGUgZGVzaXJlZCBzdGF0ZSBpbiB0aGUgJXMgY29tcG9uZW50LicsIGNhbGxlck5hbWUsIGNvbXBvbmVudE5hbWUpO1xuICAgIGRpZFdhcm5TdGF0ZVVwZGF0ZUZvclVubW91bnRlZENvbXBvbmVudFt3YXJuaW5nS2V5XSA9IHRydWU7XG4gIH1cbn1cblxuLyoqXG4gKiBUaGlzIGlzIHRoZSBhYnN0cmFjdCBBUEkgZm9yIGFuIHVwZGF0ZSBxdWV1ZS5cbiAqL1xudmFyIFJlYWN0Tm9vcFVwZGF0ZVF1ZXVlID0ge1xuICAvKipcbiAgICogQ2hlY2tzIHdoZXRoZXIgb3Igbm90IHRoaXMgY29tcG9zaXRlIGNvbXBvbmVudCBpcyBtb3VudGVkLlxuICAgKiBAcGFyYW0ge1JlYWN0Q2xhc3N9IHB1YmxpY0luc3RhbmNlIFRoZSBpbnN0YW5jZSB3ZSB3YW50IHRvIHRlc3QuXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59IFRydWUgaWYgbW91bnRlZCwgZmFsc2Ugb3RoZXJ3aXNlLlxuICAgKiBAcHJvdGVjdGVkXG4gICAqIEBmaW5hbFxuICAgKi9cbiAgaXNNb3VudGVkOiBmdW5jdGlvbiAocHVibGljSW5zdGFuY2UpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEZvcmNlcyBhbiB1cGRhdGUuIFRoaXMgc2hvdWxkIG9ubHkgYmUgaW52b2tlZCB3aGVuIGl0IGlzIGtub3duIHdpdGhcbiAgICogY2VydGFpbnR5IHRoYXQgd2UgYXJlICoqbm90KiogaW4gYSBET00gdHJhbnNhY3Rpb24uXG4gICAqXG4gICAqIFlvdSBtYXkgd2FudCB0byBjYWxsIHRoaXMgd2hlbiB5b3Uga25vdyB0aGF0IHNvbWUgZGVlcGVyIGFzcGVjdCBvZiB0aGVcbiAgICogY29tcG9uZW50J3Mgc3RhdGUgaGFzIGNoYW5nZWQgYnV0IGBzZXRTdGF0ZWAgd2FzIG5vdCBjYWxsZWQuXG4gICAqXG4gICAqIFRoaXMgd2lsbCBub3QgaW52b2tlIGBzaG91bGRDb21wb25lbnRVcGRhdGVgLCBidXQgaXQgd2lsbCBpbnZva2VcbiAgICogYGNvbXBvbmVudFdpbGxVcGRhdGVgIGFuZCBgY29tcG9uZW50RGlkVXBkYXRlYC5cbiAgICpcbiAgICogQHBhcmFtIHtSZWFjdENsYXNzfSBwdWJsaWNJbnN0YW5jZSBUaGUgaW5zdGFuY2UgdGhhdCBzaG91bGQgcmVyZW5kZXIuXG4gICAqIEBwYXJhbSB7P2Z1bmN0aW9ufSBjYWxsYmFjayBDYWxsZWQgYWZ0ZXIgY29tcG9uZW50IGlzIHVwZGF0ZWQuXG4gICAqIEBwYXJhbSB7P3N0cmluZ30gY2FsbGVyTmFtZSBuYW1lIG9mIHRoZSBjYWxsaW5nIGZ1bmN0aW9uIGluIHRoZSBwdWJsaWMgQVBJLlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIGVucXVldWVGb3JjZVVwZGF0ZTogZnVuY3Rpb24gKHB1YmxpY0luc3RhbmNlLCBjYWxsYmFjaywgY2FsbGVyTmFtZSkge1xuICAgIHdhcm5Ob29wKHB1YmxpY0luc3RhbmNlLCAnZm9yY2VVcGRhdGUnKTtcbiAgfSxcblxuICAvKipcbiAgICogUmVwbGFjZXMgYWxsIG9mIHRoZSBzdGF0ZS4gQWx3YXlzIHVzZSB0aGlzIG9yIGBzZXRTdGF0ZWAgdG8gbXV0YXRlIHN0YXRlLlxuICAgKiBZb3Ugc2hvdWxkIHRyZWF0IGB0aGlzLnN0YXRlYCBhcyBpbW11dGFibGUuXG4gICAqXG4gICAqIFRoZXJlIGlzIG5vIGd1YXJhbnRlZSB0aGF0IGB0aGlzLnN0YXRlYCB3aWxsIGJlIGltbWVkaWF0ZWx5IHVwZGF0ZWQsIHNvXG4gICAqIGFjY2Vzc2luZyBgdGhpcy5zdGF0ZWAgYWZ0ZXIgY2FsbGluZyB0aGlzIG1ldGhvZCBtYXkgcmV0dXJuIHRoZSBvbGQgdmFsdWUuXG4gICAqXG4gICAqIEBwYXJhbSB7UmVhY3RDbGFzc30gcHVibGljSW5zdGFuY2UgVGhlIGluc3RhbmNlIHRoYXQgc2hvdWxkIHJlcmVuZGVyLlxuICAgKiBAcGFyYW0ge29iamVjdH0gY29tcGxldGVTdGF0ZSBOZXh0IHN0YXRlLlxuICAgKiBAcGFyYW0gez9mdW5jdGlvbn0gY2FsbGJhY2sgQ2FsbGVkIGFmdGVyIGNvbXBvbmVudCBpcyB1cGRhdGVkLlxuICAgKiBAcGFyYW0gez9zdHJpbmd9IGNhbGxlck5hbWUgbmFtZSBvZiB0aGUgY2FsbGluZyBmdW5jdGlvbiBpbiB0aGUgcHVibGljIEFQSS5cbiAgICogQGludGVybmFsXG4gICAqL1xuICBlbnF1ZXVlUmVwbGFjZVN0YXRlOiBmdW5jdGlvbiAocHVibGljSW5zdGFuY2UsIGNvbXBsZXRlU3RhdGUsIGNhbGxiYWNrLCBjYWxsZXJOYW1lKSB7XG4gICAgd2Fybk5vb3AocHVibGljSW5zdGFuY2UsICdyZXBsYWNlU3RhdGUnKTtcbiAgfSxcblxuICAvKipcbiAgICogU2V0cyBhIHN1YnNldCBvZiB0aGUgc3RhdGUuIFRoaXMgb25seSBleGlzdHMgYmVjYXVzZSBfcGVuZGluZ1N0YXRlIGlzXG4gICAqIGludGVybmFsLiBUaGlzIHByb3ZpZGVzIGEgbWVyZ2luZyBzdHJhdGVneSB0aGF0IGlzIG5vdCBhdmFpbGFibGUgdG8gZGVlcFxuICAgKiBwcm9wZXJ0aWVzIHdoaWNoIGlzIGNvbmZ1c2luZy4gVE9ETzogRXhwb3NlIHBlbmRpbmdTdGF0ZSBvciBkb24ndCB1c2UgaXRcbiAgICogZHVyaW5nIHRoZSBtZXJnZS5cbiAgICpcbiAgICogQHBhcmFtIHtSZWFjdENsYXNzfSBwdWJsaWNJbnN0YW5jZSBUaGUgaW5zdGFuY2UgdGhhdCBzaG91bGQgcmVyZW5kZXIuXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBwYXJ0aWFsU3RhdGUgTmV4dCBwYXJ0aWFsIHN0YXRlIHRvIGJlIG1lcmdlZCB3aXRoIHN0YXRlLlxuICAgKiBAcGFyYW0gez9mdW5jdGlvbn0gY2FsbGJhY2sgQ2FsbGVkIGFmdGVyIGNvbXBvbmVudCBpcyB1cGRhdGVkLlxuICAgKiBAcGFyYW0gez9zdHJpbmd9IE5hbWUgb2YgdGhlIGNhbGxpbmcgZnVuY3Rpb24gaW4gdGhlIHB1YmxpYyBBUEkuXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgZW5xdWV1ZVNldFN0YXRlOiBmdW5jdGlvbiAocHVibGljSW5zdGFuY2UsIHBhcnRpYWxTdGF0ZSwgY2FsbGJhY2ssIGNhbGxlck5hbWUpIHtcbiAgICB3YXJuTm9vcChwdWJsaWNJbnN0YW5jZSwgJ3NldFN0YXRlJyk7XG4gIH1cbn07XG5cbnZhciBlbXB0eU9iamVjdCA9IHt9O1xue1xuICBPYmplY3QuZnJlZXplKGVtcHR5T2JqZWN0KTtcbn1cblxuLyoqXG4gKiBCYXNlIGNsYXNzIGhlbHBlcnMgZm9yIHRoZSB1cGRhdGluZyBzdGF0ZSBvZiBhIGNvbXBvbmVudC5cbiAqL1xuZnVuY3Rpb24gQ29tcG9uZW50KHByb3BzLCBjb250ZXh0LCB1cGRhdGVyKSB7XG4gIHRoaXMucHJvcHMgPSBwcm9wcztcbiAgdGhpcy5jb250ZXh0ID0gY29udGV4dDtcbiAgLy8gSWYgYSBjb21wb25lbnQgaGFzIHN0cmluZyByZWZzLCB3ZSB3aWxsIGFzc2lnbiBhIGRpZmZlcmVudCBvYmplY3QgbGF0ZXIuXG4gIHRoaXMucmVmcyA9IGVtcHR5T2JqZWN0O1xuICAvLyBXZSBpbml0aWFsaXplIHRoZSBkZWZhdWx0IHVwZGF0ZXIgYnV0IHRoZSByZWFsIG9uZSBnZXRzIGluamVjdGVkIGJ5IHRoZVxuICAvLyByZW5kZXJlci5cbiAgdGhpcy51cGRhdGVyID0gdXBkYXRlciB8fCBSZWFjdE5vb3BVcGRhdGVRdWV1ZTtcbn1cblxuQ29tcG9uZW50LnByb3RvdHlwZS5pc1JlYWN0Q29tcG9uZW50ID0ge307XG5cbi8qKlxuICogU2V0cyBhIHN1YnNldCBvZiB0aGUgc3RhdGUuIEFsd2F5cyB1c2UgdGhpcyB0byBtdXRhdGVcbiAqIHN0YXRlLiBZb3Ugc2hvdWxkIHRyZWF0IGB0aGlzLnN0YXRlYCBhcyBpbW11dGFibGUuXG4gKlxuICogVGhlcmUgaXMgbm8gZ3VhcmFudGVlIHRoYXQgYHRoaXMuc3RhdGVgIHdpbGwgYmUgaW1tZWRpYXRlbHkgdXBkYXRlZCwgc29cbiAqIGFjY2Vzc2luZyBgdGhpcy5zdGF0ZWAgYWZ0ZXIgY2FsbGluZyB0aGlzIG1ldGhvZCBtYXkgcmV0dXJuIHRoZSBvbGQgdmFsdWUuXG4gKlxuICogVGhlcmUgaXMgbm8gZ3VhcmFudGVlIHRoYXQgY2FsbHMgdG8gYHNldFN0YXRlYCB3aWxsIHJ1biBzeW5jaHJvbm91c2x5LFxuICogYXMgdGhleSBtYXkgZXZlbnR1YWxseSBiZSBiYXRjaGVkIHRvZ2V0aGVyLiAgWW91IGNhbiBwcm92aWRlIGFuIG9wdGlvbmFsXG4gKiBjYWxsYmFjayB0aGF0IHdpbGwgYmUgZXhlY3V0ZWQgd2hlbiB0aGUgY2FsbCB0byBzZXRTdGF0ZSBpcyBhY3R1YWxseVxuICogY29tcGxldGVkLlxuICpcbiAqIFdoZW4gYSBmdW5jdGlvbiBpcyBwcm92aWRlZCB0byBzZXRTdGF0ZSwgaXQgd2lsbCBiZSBjYWxsZWQgYXQgc29tZSBwb2ludCBpblxuICogdGhlIGZ1dHVyZSAobm90IHN5bmNocm9ub3VzbHkpLiBJdCB3aWxsIGJlIGNhbGxlZCB3aXRoIHRoZSB1cCB0byBkYXRlXG4gKiBjb21wb25lbnQgYXJndW1lbnRzIChzdGF0ZSwgcHJvcHMsIGNvbnRleHQpLiBUaGVzZSB2YWx1ZXMgY2FuIGJlIGRpZmZlcmVudFxuICogZnJvbSB0aGlzLiogYmVjYXVzZSB5b3VyIGZ1bmN0aW9uIG1heSBiZSBjYWxsZWQgYWZ0ZXIgcmVjZWl2ZVByb3BzIGJ1dCBiZWZvcmVcbiAqIHNob3VsZENvbXBvbmVudFVwZGF0ZSwgYW5kIHRoaXMgbmV3IHN0YXRlLCBwcm9wcywgYW5kIGNvbnRleHQgd2lsbCBub3QgeWV0IGJlXG4gKiBhc3NpZ25lZCB0byB0aGlzLlxuICpcbiAqIEBwYXJhbSB7b2JqZWN0fGZ1bmN0aW9ufSBwYXJ0aWFsU3RhdGUgTmV4dCBwYXJ0aWFsIHN0YXRlIG9yIGZ1bmN0aW9uIHRvXG4gKiAgICAgICAgcHJvZHVjZSBuZXh0IHBhcnRpYWwgc3RhdGUgdG8gYmUgbWVyZ2VkIHdpdGggY3VycmVudCBzdGF0ZS5cbiAqIEBwYXJhbSB7P2Z1bmN0aW9ufSBjYWxsYmFjayBDYWxsZWQgYWZ0ZXIgc3RhdGUgaXMgdXBkYXRlZC5cbiAqIEBmaW5hbFxuICogQHByb3RlY3RlZFxuICovXG5Db21wb25lbnQucHJvdG90eXBlLnNldFN0YXRlID0gZnVuY3Rpb24gKHBhcnRpYWxTdGF0ZSwgY2FsbGJhY2spIHtcbiAgKGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoISh0eXBlb2YgcGFydGlhbFN0YXRlID09PSAnb2JqZWN0JyB8fCB0eXBlb2YgcGFydGlhbFN0YXRlID09PSAnZnVuY3Rpb24nIHx8IHBhcnRpYWxTdGF0ZSA9PSBudWxsKSkge1xuICAgICAge1xuICAgICAgICB0aHJvdyBSZWFjdEVycm9yKEVycm9yKCdzZXRTdGF0ZSguLi4pOiB0YWtlcyBhbiBvYmplY3Qgb2Ygc3RhdGUgdmFyaWFibGVzIHRvIHVwZGF0ZSBvciBhIGZ1bmN0aW9uIHdoaWNoIHJldHVybnMgYW4gb2JqZWN0IG9mIHN0YXRlIHZhcmlhYmxlcy4nKSk7XG4gICAgICB9XG4gICAgfVxuICB9KSgpO1xuICB0aGlzLnVwZGF0ZXIuZW5xdWV1ZVNldFN0YXRlKHRoaXMsIHBhcnRpYWxTdGF0ZSwgY2FsbGJhY2ssICdzZXRTdGF0ZScpO1xufTtcblxuLyoqXG4gKiBGb3JjZXMgYW4gdXBkYXRlLiBUaGlzIHNob3VsZCBvbmx5IGJlIGludm9rZWQgd2hlbiBpdCBpcyBrbm93biB3aXRoXG4gKiBjZXJ0YWludHkgdGhhdCB3ZSBhcmUgKipub3QqKiBpbiBhIERPTSB0cmFuc2FjdGlvbi5cbiAqXG4gKiBZb3UgbWF5IHdhbnQgdG8gY2FsbCB0aGlzIHdoZW4geW91IGtub3cgdGhhdCBzb21lIGRlZXBlciBhc3BlY3Qgb2YgdGhlXG4gKiBjb21wb25lbnQncyBzdGF0ZSBoYXMgY2hhbmdlZCBidXQgYHNldFN0YXRlYCB3YXMgbm90IGNhbGxlZC5cbiAqXG4gKiBUaGlzIHdpbGwgbm90IGludm9rZSBgc2hvdWxkQ29tcG9uZW50VXBkYXRlYCwgYnV0IGl0IHdpbGwgaW52b2tlXG4gKiBgY29tcG9uZW50V2lsbFVwZGF0ZWAgYW5kIGBjb21wb25lbnREaWRVcGRhdGVgLlxuICpcbiAqIEBwYXJhbSB7P2Z1bmN0aW9ufSBjYWxsYmFjayBDYWxsZWQgYWZ0ZXIgdXBkYXRlIGlzIGNvbXBsZXRlLlxuICogQGZpbmFsXG4gKiBAcHJvdGVjdGVkXG4gKi9cbkNvbXBvbmVudC5wcm90b3R5cGUuZm9yY2VVcGRhdGUgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgdGhpcy51cGRhdGVyLmVucXVldWVGb3JjZVVwZGF0ZSh0aGlzLCBjYWxsYmFjaywgJ2ZvcmNlVXBkYXRlJyk7XG59O1xuXG4vKipcbiAqIERlcHJlY2F0ZWQgQVBJcy4gVGhlc2UgQVBJcyB1c2VkIHRvIGV4aXN0IG9uIGNsYXNzaWMgUmVhY3QgY2xhc3NlcyBidXQgc2luY2VcbiAqIHdlIHdvdWxkIGxpa2UgdG8gZGVwcmVjYXRlIHRoZW0sIHdlJ3JlIG5vdCBnb2luZyB0byBtb3ZlIHRoZW0gb3ZlciB0byB0aGlzXG4gKiBtb2Rlcm4gYmFzZSBjbGFzcy4gSW5zdGVhZCwgd2UgZGVmaW5lIGEgZ2V0dGVyIHRoYXQgd2FybnMgaWYgaXQncyBhY2Nlc3NlZC5cbiAqL1xue1xuICB2YXIgZGVwcmVjYXRlZEFQSXMgPSB7XG4gICAgaXNNb3VudGVkOiBbJ2lzTW91bnRlZCcsICdJbnN0ZWFkLCBtYWtlIHN1cmUgdG8gY2xlYW4gdXAgc3Vic2NyaXB0aW9ucyBhbmQgcGVuZGluZyByZXF1ZXN0cyBpbiAnICsgJ2NvbXBvbmVudFdpbGxVbm1vdW50IHRvIHByZXZlbnQgbWVtb3J5IGxlYWtzLiddLFxuICAgIHJlcGxhY2VTdGF0ZTogWydyZXBsYWNlU3RhdGUnLCAnUmVmYWN0b3IgeW91ciBjb2RlIHRvIHVzZSBzZXRTdGF0ZSBpbnN0ZWFkIChzZWUgJyArICdodHRwczovL2dpdGh1Yi5jb20vZmFjZWJvb2svcmVhY3QvaXNzdWVzLzMyMzYpLiddXG4gIH07XG4gIHZhciBkZWZpbmVEZXByZWNhdGlvbldhcm5pbmcgPSBmdW5jdGlvbiAobWV0aG9kTmFtZSwgaW5mbykge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShDb21wb25lbnQucHJvdG90eXBlLCBtZXRob2ROYW1lLCB7XG4gICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbG93UHJpb3JpdHlXYXJuaW5nJDEoZmFsc2UsICclcyguLi4pIGlzIGRlcHJlY2F0ZWQgaW4gcGxhaW4gSmF2YVNjcmlwdCBSZWFjdCBjbGFzc2VzLiAlcycsIGluZm9bMF0sIGluZm9bMV0pO1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuICBmb3IgKHZhciBmbk5hbWUgaW4gZGVwcmVjYXRlZEFQSXMpIHtcbiAgICBpZiAoZGVwcmVjYXRlZEFQSXMuaGFzT3duUHJvcGVydHkoZm5OYW1lKSkge1xuICAgICAgZGVmaW5lRGVwcmVjYXRpb25XYXJuaW5nKGZuTmFtZSwgZGVwcmVjYXRlZEFQSXNbZm5OYW1lXSk7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIENvbXBvbmVudER1bW15KCkge31cbkNvbXBvbmVudER1bW15LnByb3RvdHlwZSA9IENvbXBvbmVudC5wcm90b3R5cGU7XG5cbi8qKlxuICogQ29udmVuaWVuY2UgY29tcG9uZW50IHdpdGggZGVmYXVsdCBzaGFsbG93IGVxdWFsaXR5IGNoZWNrIGZvciBzQ1UuXG4gKi9cbmZ1bmN0aW9uIFB1cmVDb21wb25lbnQocHJvcHMsIGNvbnRleHQsIHVwZGF0ZXIpIHtcbiAgdGhpcy5wcm9wcyA9IHByb3BzO1xuICB0aGlzLmNvbnRleHQgPSBjb250ZXh0O1xuICAvLyBJZiBhIGNvbXBvbmVudCBoYXMgc3RyaW5nIHJlZnMsIHdlIHdpbGwgYXNzaWduIGEgZGlmZmVyZW50IG9iamVjdCBsYXRlci5cbiAgdGhpcy5yZWZzID0gZW1wdHlPYmplY3Q7XG4gIHRoaXMudXBkYXRlciA9IHVwZGF0ZXIgfHwgUmVhY3ROb29wVXBkYXRlUXVldWU7XG59XG5cbnZhciBwdXJlQ29tcG9uZW50UHJvdG90eXBlID0gUHVyZUNvbXBvbmVudC5wcm90b3R5cGUgPSBuZXcgQ29tcG9uZW50RHVtbXkoKTtcbnB1cmVDb21wb25lbnRQcm90b3R5cGUuY29uc3RydWN0b3IgPSBQdXJlQ29tcG9uZW50O1xuLy8gQXZvaWQgYW4gZXh0cmEgcHJvdG90eXBlIGp1bXAgZm9yIHRoZXNlIG1ldGhvZHMuXG5fYXNzaWduKHB1cmVDb21wb25lbnRQcm90b3R5cGUsIENvbXBvbmVudC5wcm90b3R5cGUpO1xucHVyZUNvbXBvbmVudFByb3RvdHlwZS5pc1B1cmVSZWFjdENvbXBvbmVudCA9IHRydWU7XG5cbi8vIGFuIGltbXV0YWJsZSBvYmplY3Qgd2l0aCBhIHNpbmdsZSBtdXRhYmxlIHZhbHVlXG5mdW5jdGlvbiBjcmVhdGVSZWYoKSB7XG4gIHZhciByZWZPYmplY3QgPSB7XG4gICAgY3VycmVudDogbnVsbFxuICB9O1xuICB7XG4gICAgT2JqZWN0LnNlYWwocmVmT2JqZWN0KTtcbiAgfVxuICByZXR1cm4gcmVmT2JqZWN0O1xufVxuXG4vKipcbiAqIEtlZXBzIHRyYWNrIG9mIHRoZSBjdXJyZW50IGRpc3BhdGNoZXIuXG4gKi9cbnZhciBSZWFjdEN1cnJlbnREaXNwYXRjaGVyID0ge1xuICAvKipcbiAgICogQGludGVybmFsXG4gICAqIEB0eXBlIHtSZWFjdENvbXBvbmVudH1cbiAgICovXG4gIGN1cnJlbnQ6IG51bGxcbn07XG5cbi8qKlxuICogS2VlcHMgdHJhY2sgb2YgdGhlIGN1cnJlbnQgYmF0Y2gncyBjb25maWd1cmF0aW9uIHN1Y2ggYXMgaG93IGxvbmcgYW4gdXBkYXRlXG4gKiBzaG91bGQgc3VzcGVuZCBmb3IgaWYgaXQgbmVlZHMgdG8uXG4gKi9cbnZhciBSZWFjdEN1cnJlbnRCYXRjaENvbmZpZyA9IHtcbiAgc3VzcGVuc2U6IG51bGxcbn07XG5cbi8qKlxuICogS2VlcHMgdHJhY2sgb2YgdGhlIGN1cnJlbnQgb3duZXIuXG4gKlxuICogVGhlIGN1cnJlbnQgb3duZXIgaXMgdGhlIGNvbXBvbmVudCB3aG8gc2hvdWxkIG93biBhbnkgY29tcG9uZW50cyB0aGF0IGFyZVxuICogY3VycmVudGx5IGJlaW5nIGNvbnN0cnVjdGVkLlxuICovXG52YXIgUmVhY3RDdXJyZW50T3duZXIgPSB7XG4gIC8qKlxuICAgKiBAaW50ZXJuYWxcbiAgICogQHR5cGUge1JlYWN0Q29tcG9uZW50fVxuICAgKi9cbiAgY3VycmVudDogbnVsbFxufTtcblxudmFyIEJFRk9SRV9TTEFTSF9SRSA9IC9eKC4qKVtcXFxcXFwvXS87XG5cbnZhciBkZXNjcmliZUNvbXBvbmVudEZyYW1lID0gZnVuY3Rpb24gKG5hbWUsIHNvdXJjZSwgb3duZXJOYW1lKSB7XG4gIHZhciBzb3VyY2VJbmZvID0gJyc7XG4gIGlmIChzb3VyY2UpIHtcbiAgICB2YXIgcGF0aCA9IHNvdXJjZS5maWxlTmFtZTtcbiAgICB2YXIgZmlsZU5hbWUgPSBwYXRoLnJlcGxhY2UoQkVGT1JFX1NMQVNIX1JFLCAnJyk7XG4gICAge1xuICAgICAgLy8gSW4gREVWLCBpbmNsdWRlIGNvZGUgZm9yIGEgY29tbW9uIHNwZWNpYWwgY2FzZTpcbiAgICAgIC8vIHByZWZlciBcImZvbGRlci9pbmRleC5qc1wiIGluc3RlYWQgb2YganVzdCBcImluZGV4LmpzXCIuXG4gICAgICBpZiAoL15pbmRleFxcLi8udGVzdChmaWxlTmFtZSkpIHtcbiAgICAgICAgdmFyIG1hdGNoID0gcGF0aC5tYXRjaChCRUZPUkVfU0xBU0hfUkUpO1xuICAgICAgICBpZiAobWF0Y2gpIHtcbiAgICAgICAgICB2YXIgcGF0aEJlZm9yZVNsYXNoID0gbWF0Y2hbMV07XG4gICAgICAgICAgaWYgKHBhdGhCZWZvcmVTbGFzaCkge1xuICAgICAgICAgICAgdmFyIGZvbGRlck5hbWUgPSBwYXRoQmVmb3JlU2xhc2gucmVwbGFjZShCRUZPUkVfU0xBU0hfUkUsICcnKTtcbiAgICAgICAgICAgIGZpbGVOYW1lID0gZm9sZGVyTmFtZSArICcvJyArIGZpbGVOYW1lO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBzb3VyY2VJbmZvID0gJyAoYXQgJyArIGZpbGVOYW1lICsgJzonICsgc291cmNlLmxpbmVOdW1iZXIgKyAnKSc7XG4gIH0gZWxzZSBpZiAob3duZXJOYW1lKSB7XG4gICAgc291cmNlSW5mbyA9ICcgKGNyZWF0ZWQgYnkgJyArIG93bmVyTmFtZSArICcpJztcbiAgfVxuICByZXR1cm4gJ1xcbiAgICBpbiAnICsgKG5hbWUgfHwgJ1Vua25vd24nKSArIHNvdXJjZUluZm87XG59O1xuXG52YXIgUmVzb2x2ZWQgPSAxO1xuXG5cbmZ1bmN0aW9uIHJlZmluZVJlc29sdmVkTGF6eUNvbXBvbmVudChsYXp5Q29tcG9uZW50KSB7XG4gIHJldHVybiBsYXp5Q29tcG9uZW50Ll9zdGF0dXMgPT09IFJlc29sdmVkID8gbGF6eUNvbXBvbmVudC5fcmVzdWx0IDogbnVsbDtcbn1cblxuZnVuY3Rpb24gZ2V0V3JhcHBlZE5hbWUob3V0ZXJUeXBlLCBpbm5lclR5cGUsIHdyYXBwZXJOYW1lKSB7XG4gIHZhciBmdW5jdGlvbk5hbWUgPSBpbm5lclR5cGUuZGlzcGxheU5hbWUgfHwgaW5uZXJUeXBlLm5hbWUgfHwgJyc7XG4gIHJldHVybiBvdXRlclR5cGUuZGlzcGxheU5hbWUgfHwgKGZ1bmN0aW9uTmFtZSAhPT0gJycgPyB3cmFwcGVyTmFtZSArICcoJyArIGZ1bmN0aW9uTmFtZSArICcpJyA6IHdyYXBwZXJOYW1lKTtcbn1cblxuZnVuY3Rpb24gZ2V0Q29tcG9uZW50TmFtZSh0eXBlKSB7XG4gIGlmICh0eXBlID09IG51bGwpIHtcbiAgICAvLyBIb3N0IHJvb3QsIHRleHQgbm9kZSBvciBqdXN0IGludmFsaWQgdHlwZS5cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICB7XG4gICAgaWYgKHR5cGVvZiB0eXBlLnRhZyA9PT0gJ251bWJlcicpIHtcbiAgICAgIHdhcm5pbmdXaXRob3V0U3RhY2skMShmYWxzZSwgJ1JlY2VpdmVkIGFuIHVuZXhwZWN0ZWQgb2JqZWN0IGluIGdldENvbXBvbmVudE5hbWUoKS4gJyArICdUaGlzIGlzIGxpa2VseSBhIGJ1ZyBpbiBSZWFjdC4gUGxlYXNlIGZpbGUgYW4gaXNzdWUuJyk7XG4gICAgfVxuICB9XG4gIGlmICh0eXBlb2YgdHlwZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiB0eXBlLmRpc3BsYXlOYW1lIHx8IHR5cGUubmFtZSB8fCBudWxsO1xuICB9XG4gIGlmICh0eXBlb2YgdHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gdHlwZTtcbiAgfVxuICBzd2l0Y2ggKHR5cGUpIHtcbiAgICBjYXNlIFJFQUNUX0ZSQUdNRU5UX1RZUEU6XG4gICAgICByZXR1cm4gJ0ZyYWdtZW50JztcbiAgICBjYXNlIFJFQUNUX1BPUlRBTF9UWVBFOlxuICAgICAgcmV0dXJuICdQb3J0YWwnO1xuICAgIGNhc2UgUkVBQ1RfUFJPRklMRVJfVFlQRTpcbiAgICAgIHJldHVybiAnUHJvZmlsZXInO1xuICAgIGNhc2UgUkVBQ1RfU1RSSUNUX01PREVfVFlQRTpcbiAgICAgIHJldHVybiAnU3RyaWN0TW9kZSc7XG4gICAgY2FzZSBSRUFDVF9TVVNQRU5TRV9UWVBFOlxuICAgICAgcmV0dXJuICdTdXNwZW5zZSc7XG4gICAgY2FzZSBSRUFDVF9TVVNQRU5TRV9MSVNUX1RZUEU6XG4gICAgICByZXR1cm4gJ1N1c3BlbnNlTGlzdCc7XG4gIH1cbiAgaWYgKHR5cGVvZiB0eXBlID09PSAnb2JqZWN0Jykge1xuICAgIHN3aXRjaCAodHlwZS4kJHR5cGVvZikge1xuICAgICAgY2FzZSBSRUFDVF9DT05URVhUX1RZUEU6XG4gICAgICAgIHJldHVybiAnQ29udGV4dC5Db25zdW1lcic7XG4gICAgICBjYXNlIFJFQUNUX1BST1ZJREVSX1RZUEU6XG4gICAgICAgIHJldHVybiAnQ29udGV4dC5Qcm92aWRlcic7XG4gICAgICBjYXNlIFJFQUNUX0ZPUldBUkRfUkVGX1RZUEU6XG4gICAgICAgIHJldHVybiBnZXRXcmFwcGVkTmFtZSh0eXBlLCB0eXBlLnJlbmRlciwgJ0ZvcndhcmRSZWYnKTtcbiAgICAgIGNhc2UgUkVBQ1RfTUVNT19UWVBFOlxuICAgICAgICByZXR1cm4gZ2V0Q29tcG9uZW50TmFtZSh0eXBlLnR5cGUpO1xuICAgICAgY2FzZSBSRUFDVF9MQVpZX1RZUEU6XG4gICAgICAgIHtcbiAgICAgICAgICB2YXIgdGhlbmFibGUgPSB0eXBlO1xuICAgICAgICAgIHZhciByZXNvbHZlZFRoZW5hYmxlID0gcmVmaW5lUmVzb2x2ZWRMYXp5Q29tcG9uZW50KHRoZW5hYmxlKTtcbiAgICAgICAgICBpZiAocmVzb2x2ZWRUaGVuYWJsZSkge1xuICAgICAgICAgICAgcmV0dXJuIGdldENvbXBvbmVudE5hbWUocmVzb2x2ZWRUaGVuYWJsZSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBudWxsO1xufVxuXG52YXIgUmVhY3REZWJ1Z0N1cnJlbnRGcmFtZSA9IHt9O1xuXG52YXIgY3VycmVudGx5VmFsaWRhdGluZ0VsZW1lbnQgPSBudWxsO1xuXG5mdW5jdGlvbiBzZXRDdXJyZW50bHlWYWxpZGF0aW5nRWxlbWVudChlbGVtZW50KSB7XG4gIHtcbiAgICBjdXJyZW50bHlWYWxpZGF0aW5nRWxlbWVudCA9IGVsZW1lbnQ7XG4gIH1cbn1cblxue1xuICAvLyBTdGFjayBpbXBsZW1lbnRhdGlvbiBpbmplY3RlZCBieSB0aGUgY3VycmVudCByZW5kZXJlci5cbiAgUmVhY3REZWJ1Z0N1cnJlbnRGcmFtZS5nZXRDdXJyZW50U3RhY2sgPSBudWxsO1xuXG4gIFJlYWN0RGVidWdDdXJyZW50RnJhbWUuZ2V0U3RhY2tBZGRlbmR1bSA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc3RhY2sgPSAnJztcblxuICAgIC8vIEFkZCBhbiBleHRyYSB0b3AgZnJhbWUgd2hpbGUgYW4gZWxlbWVudCBpcyBiZWluZyB2YWxpZGF0ZWRcbiAgICBpZiAoY3VycmVudGx5VmFsaWRhdGluZ0VsZW1lbnQpIHtcbiAgICAgIHZhciBuYW1lID0gZ2V0Q29tcG9uZW50TmFtZShjdXJyZW50bHlWYWxpZGF0aW5nRWxlbWVudC50eXBlKTtcbiAgICAgIHZhciBvd25lciA9IGN1cnJlbnRseVZhbGlkYXRpbmdFbGVtZW50Ll9vd25lcjtcbiAgICAgIHN0YWNrICs9IGRlc2NyaWJlQ29tcG9uZW50RnJhbWUobmFtZSwgY3VycmVudGx5VmFsaWRhdGluZ0VsZW1lbnQuX3NvdXJjZSwgb3duZXIgJiYgZ2V0Q29tcG9uZW50TmFtZShvd25lci50eXBlKSk7XG4gICAgfVxuXG4gICAgLy8gRGVsZWdhdGUgdG8gdGhlIGluamVjdGVkIHJlbmRlcmVyLXNwZWNpZmljIGltcGxlbWVudGF0aW9uXG4gICAgdmFyIGltcGwgPSBSZWFjdERlYnVnQ3VycmVudEZyYW1lLmdldEN1cnJlbnRTdGFjaztcbiAgICBpZiAoaW1wbCkge1xuICAgICAgc3RhY2sgKz0gaW1wbCgpIHx8ICcnO1xuICAgIH1cblxuICAgIHJldHVybiBzdGFjaztcbiAgfTtcbn1cblxuLyoqXG4gKiBVc2VkIGJ5IGFjdCgpIHRvIHRyYWNrIHdoZXRoZXIgeW91J3JlIGluc2lkZSBhbiBhY3QoKSBzY29wZS5cbiAqL1xuXG52YXIgSXNTb21lUmVuZGVyZXJBY3RpbmcgPSB7XG4gIGN1cnJlbnQ6IGZhbHNlXG59O1xuXG52YXIgUmVhY3RTaGFyZWRJbnRlcm5hbHMgPSB7XG4gIFJlYWN0Q3VycmVudERpc3BhdGNoZXI6IFJlYWN0Q3VycmVudERpc3BhdGNoZXIsXG4gIFJlYWN0Q3VycmVudEJhdGNoQ29uZmlnOiBSZWFjdEN1cnJlbnRCYXRjaENvbmZpZyxcbiAgUmVhY3RDdXJyZW50T3duZXI6IFJlYWN0Q3VycmVudE93bmVyLFxuICBJc1NvbWVSZW5kZXJlckFjdGluZzogSXNTb21lUmVuZGVyZXJBY3RpbmcsXG4gIC8vIFVzZWQgYnkgcmVuZGVyZXJzIHRvIGF2b2lkIGJ1bmRsaW5nIG9iamVjdC1hc3NpZ24gdHdpY2UgaW4gVU1EIGJ1bmRsZXM6XG4gIGFzc2lnbjogX2Fzc2lnblxufTtcblxue1xuICBfYXNzaWduKFJlYWN0U2hhcmVkSW50ZXJuYWxzLCB7XG4gICAgLy8gVGhlc2Ugc2hvdWxkIG5vdCBiZSBpbmNsdWRlZCBpbiBwcm9kdWN0aW9uLlxuICAgIFJlYWN0RGVidWdDdXJyZW50RnJhbWU6IFJlYWN0RGVidWdDdXJyZW50RnJhbWUsXG4gICAgLy8gU2hpbSBmb3IgUmVhY3QgRE9NIDE2LjAuMCB3aGljaCBzdGlsbCBkZXN0cnVjdHVyZWQgKGJ1dCBub3QgdXNlZCkgdGhpcy5cbiAgICAvLyBUT0RPOiByZW1vdmUgaW4gUmVhY3QgMTcuMC5cbiAgICBSZWFjdENvbXBvbmVudFRyZWVIb29rOiB7fVxuICB9KTtcbn1cblxuLyoqXG4gKiBTaW1pbGFyIHRvIGludmFyaWFudCBidXQgb25seSBsb2dzIGEgd2FybmluZyBpZiB0aGUgY29uZGl0aW9uIGlzIG5vdCBtZXQuXG4gKiBUaGlzIGNhbiBiZSB1c2VkIHRvIGxvZyBpc3N1ZXMgaW4gZGV2ZWxvcG1lbnQgZW52aXJvbm1lbnRzIGluIGNyaXRpY2FsXG4gKiBwYXRocy4gUmVtb3ZpbmcgdGhlIGxvZ2dpbmcgY29kZSBmb3IgcHJvZHVjdGlvbiBlbnZpcm9ubWVudHMgd2lsbCBrZWVwIHRoZVxuICogc2FtZSBsb2dpYyBhbmQgZm9sbG93IHRoZSBzYW1lIGNvZGUgcGF0aHMuXG4gKi9cblxudmFyIHdhcm5pbmcgPSB3YXJuaW5nV2l0aG91dFN0YWNrJDE7XG5cbntcbiAgd2FybmluZyA9IGZ1bmN0aW9uIChjb25kaXRpb24sIGZvcm1hdCkge1xuICAgIGlmIChjb25kaXRpb24pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIFJlYWN0RGVidWdDdXJyZW50RnJhbWUgPSBSZWFjdFNoYXJlZEludGVybmFscy5SZWFjdERlYnVnQ3VycmVudEZyYW1lO1xuICAgIHZhciBzdGFjayA9IFJlYWN0RGVidWdDdXJyZW50RnJhbWUuZ2V0U3RhY2tBZGRlbmR1bSgpO1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSByZWFjdC1pbnRlcm5hbC93YXJuaW5nLWFuZC1pbnZhcmlhbnQtYXJnc1xuXG4gICAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuID4gMiA/IF9sZW4gLSAyIDogMCksIF9rZXkgPSAyOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgICBhcmdzW19rZXkgLSAyXSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgICB9XG5cbiAgICB3YXJuaW5nV2l0aG91dFN0YWNrJDEuYXBwbHkodW5kZWZpbmVkLCBbZmFsc2UsIGZvcm1hdCArICclcyddLmNvbmNhdChhcmdzLCBbc3RhY2tdKSk7XG4gIH07XG59XG5cbnZhciB3YXJuaW5nJDEgPSB3YXJuaW5nO1xuXG52YXIgaGFzT3duUHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuXG52YXIgUkVTRVJWRURfUFJPUFMgPSB7XG4gIGtleTogdHJ1ZSxcbiAgcmVmOiB0cnVlLFxuICBfX3NlbGY6IHRydWUsXG4gIF9fc291cmNlOiB0cnVlXG59O1xuXG52YXIgc3BlY2lhbFByb3BLZXlXYXJuaW5nU2hvd24gPSB2b2lkIDA7XG52YXIgc3BlY2lhbFByb3BSZWZXYXJuaW5nU2hvd24gPSB2b2lkIDA7XG5cbmZ1bmN0aW9uIGhhc1ZhbGlkUmVmKGNvbmZpZykge1xuICB7XG4gICAgaWYgKGhhc093blByb3BlcnR5LmNhbGwoY29uZmlnLCAncmVmJykpIHtcbiAgICAgIHZhciBnZXR0ZXIgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGNvbmZpZywgJ3JlZicpLmdldDtcbiAgICAgIGlmIChnZXR0ZXIgJiYgZ2V0dGVyLmlzUmVhY3RXYXJuaW5nKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIGNvbmZpZy5yZWYgIT09IHVuZGVmaW5lZDtcbn1cblxuZnVuY3Rpb24gaGFzVmFsaWRLZXkoY29uZmlnKSB7XG4gIHtcbiAgICBpZiAoaGFzT3duUHJvcGVydHkuY2FsbChjb25maWcsICdrZXknKSkge1xuICAgICAgdmFyIGdldHRlciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoY29uZmlnLCAna2V5JykuZ2V0O1xuICAgICAgaWYgKGdldHRlciAmJiBnZXR0ZXIuaXNSZWFjdFdhcm5pbmcpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gY29uZmlnLmtleSAhPT0gdW5kZWZpbmVkO1xufVxuXG5mdW5jdGlvbiBkZWZpbmVLZXlQcm9wV2FybmluZ0dldHRlcihwcm9wcywgZGlzcGxheU5hbWUpIHtcbiAgdmFyIHdhcm5BYm91dEFjY2Vzc2luZ0tleSA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIXNwZWNpYWxQcm9wS2V5V2FybmluZ1Nob3duKSB7XG4gICAgICBzcGVjaWFsUHJvcEtleVdhcm5pbmdTaG93biA9IHRydWU7XG4gICAgICB3YXJuaW5nV2l0aG91dFN0YWNrJDEoZmFsc2UsICclczogYGtleWAgaXMgbm90IGEgcHJvcC4gVHJ5aW5nIHRvIGFjY2VzcyBpdCB3aWxsIHJlc3VsdCAnICsgJ2luIGB1bmRlZmluZWRgIGJlaW5nIHJldHVybmVkLiBJZiB5b3UgbmVlZCB0byBhY2Nlc3MgdGhlIHNhbWUgJyArICd2YWx1ZSB3aXRoaW4gdGhlIGNoaWxkIGNvbXBvbmVudCwgeW91IHNob3VsZCBwYXNzIGl0IGFzIGEgZGlmZmVyZW50ICcgKyAncHJvcC4gKGh0dHBzOi8vZmIubWUvcmVhY3Qtc3BlY2lhbC1wcm9wcyknLCBkaXNwbGF5TmFtZSk7XG4gICAgfVxuICB9O1xuICB3YXJuQWJvdXRBY2Nlc3NpbmdLZXkuaXNSZWFjdFdhcm5pbmcgPSB0cnVlO1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkocHJvcHMsICdrZXknLCB7XG4gICAgZ2V0OiB3YXJuQWJvdXRBY2Nlc3NpbmdLZXksXG4gICAgY29uZmlndXJhYmxlOiB0cnVlXG4gIH0pO1xufVxuXG5mdW5jdGlvbiBkZWZpbmVSZWZQcm9wV2FybmluZ0dldHRlcihwcm9wcywgZGlzcGxheU5hbWUpIHtcbiAgdmFyIHdhcm5BYm91dEFjY2Vzc2luZ1JlZiA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIXNwZWNpYWxQcm9wUmVmV2FybmluZ1Nob3duKSB7XG4gICAgICBzcGVjaWFsUHJvcFJlZldhcm5pbmdTaG93biA9IHRydWU7XG4gICAgICB3YXJuaW5nV2l0aG91dFN0YWNrJDEoZmFsc2UsICclczogYHJlZmAgaXMgbm90IGEgcHJvcC4gVHJ5aW5nIHRvIGFjY2VzcyBpdCB3aWxsIHJlc3VsdCAnICsgJ2luIGB1bmRlZmluZWRgIGJlaW5nIHJldHVybmVkLiBJZiB5b3UgbmVlZCB0byBhY2Nlc3MgdGhlIHNhbWUgJyArICd2YWx1ZSB3aXRoaW4gdGhlIGNoaWxkIGNvbXBvbmVudCwgeW91IHNob3VsZCBwYXNzIGl0IGFzIGEgZGlmZmVyZW50ICcgKyAncHJvcC4gKGh0dHBzOi8vZmIubWUvcmVhY3Qtc3BlY2lhbC1wcm9wcyknLCBkaXNwbGF5TmFtZSk7XG4gICAgfVxuICB9O1xuICB3YXJuQWJvdXRBY2Nlc3NpbmdSZWYuaXNSZWFjdFdhcm5pbmcgPSB0cnVlO1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkocHJvcHMsICdyZWYnLCB7XG4gICAgZ2V0OiB3YXJuQWJvdXRBY2Nlc3NpbmdSZWYsXG4gICAgY29uZmlndXJhYmxlOiB0cnVlXG4gIH0pO1xufVxuXG4vKipcbiAqIEZhY3RvcnkgbWV0aG9kIHRvIGNyZWF0ZSBhIG5ldyBSZWFjdCBlbGVtZW50LiBUaGlzIG5vIGxvbmdlciBhZGhlcmVzIHRvXG4gKiB0aGUgY2xhc3MgcGF0dGVybiwgc28gZG8gbm90IHVzZSBuZXcgdG8gY2FsbCBpdC4gQWxzbywgbm8gaW5zdGFuY2VvZiBjaGVja1xuICogd2lsbCB3b3JrLiBJbnN0ZWFkIHRlc3QgJCR0eXBlb2YgZmllbGQgYWdhaW5zdCBTeW1ib2wuZm9yKCdyZWFjdC5lbGVtZW50JykgdG8gY2hlY2tcbiAqIGlmIHNvbWV0aGluZyBpcyBhIFJlYWN0IEVsZW1lbnQuXG4gKlxuICogQHBhcmFtIHsqfSB0eXBlXG4gKiBAcGFyYW0geyp9IHByb3BzXG4gKiBAcGFyYW0geyp9IGtleVxuICogQHBhcmFtIHtzdHJpbmd8b2JqZWN0fSByZWZcbiAqIEBwYXJhbSB7Kn0gb3duZXJcbiAqIEBwYXJhbSB7Kn0gc2VsZiBBICp0ZW1wb3JhcnkqIGhlbHBlciB0byBkZXRlY3QgcGxhY2VzIHdoZXJlIGB0aGlzYCBpc1xuICogZGlmZmVyZW50IGZyb20gdGhlIGBvd25lcmAgd2hlbiBSZWFjdC5jcmVhdGVFbGVtZW50IGlzIGNhbGxlZCwgc28gdGhhdCB3ZVxuICogY2FuIHdhcm4uIFdlIHdhbnQgdG8gZ2V0IHJpZCBvZiBvd25lciBhbmQgcmVwbGFjZSBzdHJpbmcgYHJlZmBzIHdpdGggYXJyb3dcbiAqIGZ1bmN0aW9ucywgYW5kIGFzIGxvbmcgYXMgYHRoaXNgIGFuZCBvd25lciBhcmUgdGhlIHNhbWUsIHRoZXJlIHdpbGwgYmUgbm9cbiAqIGNoYW5nZSBpbiBiZWhhdmlvci5cbiAqIEBwYXJhbSB7Kn0gc291cmNlIEFuIGFubm90YXRpb24gb2JqZWN0IChhZGRlZCBieSBhIHRyYW5zcGlsZXIgb3Igb3RoZXJ3aXNlKVxuICogaW5kaWNhdGluZyBmaWxlbmFtZSwgbGluZSBudW1iZXIsIGFuZC9vciBvdGhlciBpbmZvcm1hdGlvbi5cbiAqIEBpbnRlcm5hbFxuICovXG52YXIgUmVhY3RFbGVtZW50ID0gZnVuY3Rpb24gKHR5cGUsIGtleSwgcmVmLCBzZWxmLCBzb3VyY2UsIG93bmVyLCBwcm9wcykge1xuICB2YXIgZWxlbWVudCA9IHtcbiAgICAvLyBUaGlzIHRhZyBhbGxvd3MgdXMgdG8gdW5pcXVlbHkgaWRlbnRpZnkgdGhpcyBhcyBhIFJlYWN0IEVsZW1lbnRcbiAgICAkJHR5cGVvZjogUkVBQ1RfRUxFTUVOVF9UWVBFLFxuXG4gICAgLy8gQnVpbHQtaW4gcHJvcGVydGllcyB0aGF0IGJlbG9uZyBvbiB0aGUgZWxlbWVudFxuICAgIHR5cGU6IHR5cGUsXG4gICAga2V5OiBrZXksXG4gICAgcmVmOiByZWYsXG4gICAgcHJvcHM6IHByb3BzLFxuXG4gICAgLy8gUmVjb3JkIHRoZSBjb21wb25lbnQgcmVzcG9uc2libGUgZm9yIGNyZWF0aW5nIHRoaXMgZWxlbWVudC5cbiAgICBfb3duZXI6IG93bmVyXG4gIH07XG5cbiAge1xuICAgIC8vIFRoZSB2YWxpZGF0aW9uIGZsYWcgaXMgY3VycmVudGx5IG11dGF0aXZlLiBXZSBwdXQgaXQgb25cbiAgICAvLyBhbiBleHRlcm5hbCBiYWNraW5nIHN0b3JlIHNvIHRoYXQgd2UgY2FuIGZyZWV6ZSB0aGUgd2hvbGUgb2JqZWN0LlxuICAgIC8vIFRoaXMgY2FuIGJlIHJlcGxhY2VkIHdpdGggYSBXZWFrTWFwIG9uY2UgdGhleSBhcmUgaW1wbGVtZW50ZWQgaW5cbiAgICAvLyBjb21tb25seSB1c2VkIGRldmVsb3BtZW50IGVudmlyb25tZW50cy5cbiAgICBlbGVtZW50Ll9zdG9yZSA9IHt9O1xuXG4gICAgLy8gVG8gbWFrZSBjb21wYXJpbmcgUmVhY3RFbGVtZW50cyBlYXNpZXIgZm9yIHRlc3RpbmcgcHVycG9zZXMsIHdlIG1ha2VcbiAgICAvLyB0aGUgdmFsaWRhdGlvbiBmbGFnIG5vbi1lbnVtZXJhYmxlICh3aGVyZSBwb3NzaWJsZSwgd2hpY2ggc2hvdWxkXG4gICAgLy8gaW5jbHVkZSBldmVyeSBlbnZpcm9ubWVudCB3ZSBydW4gdGVzdHMgaW4pLCBzbyB0aGUgdGVzdCBmcmFtZXdvcmtcbiAgICAvLyBpZ25vcmVzIGl0LlxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlbGVtZW50Ll9zdG9yZSwgJ3ZhbGlkYXRlZCcsIHtcbiAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgdmFsdWU6IGZhbHNlXG4gICAgfSk7XG4gICAgLy8gc2VsZiBhbmQgc291cmNlIGFyZSBERVYgb25seSBwcm9wZXJ0aWVzLlxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlbGVtZW50LCAnX3NlbGYnLCB7XG4gICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgICB2YWx1ZTogc2VsZlxuICAgIH0pO1xuICAgIC8vIFR3byBlbGVtZW50cyBjcmVhdGVkIGluIHR3byBkaWZmZXJlbnQgcGxhY2VzIHNob3VsZCBiZSBjb25zaWRlcmVkXG4gICAgLy8gZXF1YWwgZm9yIHRlc3RpbmcgcHVycG9zZXMgYW5kIHRoZXJlZm9yZSB3ZSBoaWRlIGl0IGZyb20gZW51bWVyYXRpb24uXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGVsZW1lbnQsICdfc291cmNlJywge1xuICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgd3JpdGFibGU6IGZhbHNlLFxuICAgICAgdmFsdWU6IHNvdXJjZVxuICAgIH0pO1xuICAgIGlmIChPYmplY3QuZnJlZXplKSB7XG4gICAgICBPYmplY3QuZnJlZXplKGVsZW1lbnQucHJvcHMpO1xuICAgICAgT2JqZWN0LmZyZWV6ZShlbGVtZW50KTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZWxlbWVudDtcbn07XG5cbi8qKlxuICogaHR0cHM6Ly9naXRodWIuY29tL3JlYWN0anMvcmZjcy9wdWxsLzEwN1xuICogQHBhcmFtIHsqfSB0eXBlXG4gKiBAcGFyYW0ge29iamVjdH0gcHJvcHNcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXlcbiAqL1xuXG5cbi8qKlxuICogaHR0cHM6Ly9naXRodWIuY29tL3JlYWN0anMvcmZjcy9wdWxsLzEwN1xuICogQHBhcmFtIHsqfSB0eXBlXG4gKiBAcGFyYW0ge29iamVjdH0gcHJvcHNcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXlcbiAqL1xuZnVuY3Rpb24ganN4REVWKHR5cGUsIGNvbmZpZywgbWF5YmVLZXksIHNvdXJjZSwgc2VsZikge1xuICB2YXIgcHJvcE5hbWUgPSB2b2lkIDA7XG5cbiAgLy8gUmVzZXJ2ZWQgbmFtZXMgYXJlIGV4dHJhY3RlZFxuICB2YXIgcHJvcHMgPSB7fTtcblxuICB2YXIga2V5ID0gbnVsbDtcbiAgdmFyIHJlZiA9IG51bGw7XG5cbiAgaWYgKGhhc1ZhbGlkUmVmKGNvbmZpZykpIHtcbiAgICByZWYgPSBjb25maWcucmVmO1xuICB9XG5cbiAgaWYgKGhhc1ZhbGlkS2V5KGNvbmZpZykpIHtcbiAgICBrZXkgPSAnJyArIGNvbmZpZy5rZXk7XG4gIH1cblxuICAvLyBSZW1haW5pbmcgcHJvcGVydGllcyBhcmUgYWRkZWQgdG8gYSBuZXcgcHJvcHMgb2JqZWN0XG4gIGZvciAocHJvcE5hbWUgaW4gY29uZmlnKSB7XG4gICAgaWYgKGhhc093blByb3BlcnR5LmNhbGwoY29uZmlnLCBwcm9wTmFtZSkgJiYgIVJFU0VSVkVEX1BST1BTLmhhc093blByb3BlcnR5KHByb3BOYW1lKSkge1xuICAgICAgcHJvcHNbcHJvcE5hbWVdID0gY29uZmlnW3Byb3BOYW1lXTtcbiAgICB9XG4gIH1cblxuICAvLyBpbnRlbnRpb25hbGx5IG5vdCBjaGVja2luZyBpZiBrZXkgd2FzIHNldCBhYm92ZVxuICAvLyB0aGlzIGtleSBpcyBoaWdoZXIgcHJpb3JpdHkgYXMgaXQncyBzdGF0aWNcbiAgaWYgKG1heWJlS2V5ICE9PSB1bmRlZmluZWQpIHtcbiAgICBrZXkgPSAnJyArIG1heWJlS2V5O1xuICB9XG5cbiAgLy8gUmVzb2x2ZSBkZWZhdWx0IHByb3BzXG4gIGlmICh0eXBlICYmIHR5cGUuZGVmYXVsdFByb3BzKSB7XG4gICAgdmFyIGRlZmF1bHRQcm9wcyA9IHR5cGUuZGVmYXVsdFByb3BzO1xuICAgIGZvciAocHJvcE5hbWUgaW4gZGVmYXVsdFByb3BzKSB7XG4gICAgICBpZiAocHJvcHNbcHJvcE5hbWVdID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcHJvcHNbcHJvcE5hbWVdID0gZGVmYXVsdFByb3BzW3Byb3BOYW1lXTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBpZiAoa2V5IHx8IHJlZikge1xuICAgIHZhciBkaXNwbGF5TmFtZSA9IHR5cGVvZiB0eXBlID09PSAnZnVuY3Rpb24nID8gdHlwZS5kaXNwbGF5TmFtZSB8fCB0eXBlLm5hbWUgfHwgJ1Vua25vd24nIDogdHlwZTtcbiAgICBpZiAoa2V5KSB7XG4gICAgICBkZWZpbmVLZXlQcm9wV2FybmluZ0dldHRlcihwcm9wcywgZGlzcGxheU5hbWUpO1xuICAgIH1cbiAgICBpZiAocmVmKSB7XG4gICAgICBkZWZpbmVSZWZQcm9wV2FybmluZ0dldHRlcihwcm9wcywgZGlzcGxheU5hbWUpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBSZWFjdEVsZW1lbnQodHlwZSwga2V5LCByZWYsIHNlbGYsIHNvdXJjZSwgUmVhY3RDdXJyZW50T3duZXIuY3VycmVudCwgcHJvcHMpO1xufVxuXG4vKipcbiAqIENyZWF0ZSBhbmQgcmV0dXJuIGEgbmV3IFJlYWN0RWxlbWVudCBvZiB0aGUgZ2l2ZW4gdHlwZS5cbiAqIFNlZSBodHRwczovL3JlYWN0anMub3JnL2RvY3MvcmVhY3QtYXBpLmh0bWwjY3JlYXRlZWxlbWVudFxuICovXG5mdW5jdGlvbiBjcmVhdGVFbGVtZW50KHR5cGUsIGNvbmZpZywgY2hpbGRyZW4pIHtcbiAgdmFyIHByb3BOYW1lID0gdm9pZCAwO1xuXG4gIC8vIFJlc2VydmVkIG5hbWVzIGFyZSBleHRyYWN0ZWRcbiAgdmFyIHByb3BzID0ge307XG5cbiAgdmFyIGtleSA9IG51bGw7XG4gIHZhciByZWYgPSBudWxsO1xuICB2YXIgc2VsZiA9IG51bGw7XG4gIHZhciBzb3VyY2UgPSBudWxsO1xuXG4gIGlmIChjb25maWcgIT0gbnVsbCkge1xuICAgIGlmIChoYXNWYWxpZFJlZihjb25maWcpKSB7XG4gICAgICByZWYgPSBjb25maWcucmVmO1xuICAgIH1cbiAgICBpZiAoaGFzVmFsaWRLZXkoY29uZmlnKSkge1xuICAgICAga2V5ID0gJycgKyBjb25maWcua2V5O1xuICAgIH1cblxuICAgIHNlbGYgPSBjb25maWcuX19zZWxmID09PSB1bmRlZmluZWQgPyBudWxsIDogY29uZmlnLl9fc2VsZjtcbiAgICBzb3VyY2UgPSBjb25maWcuX19zb3VyY2UgPT09IHVuZGVmaW5lZCA/IG51bGwgOiBjb25maWcuX19zb3VyY2U7XG4gICAgLy8gUmVtYWluaW5nIHByb3BlcnRpZXMgYXJlIGFkZGVkIHRvIGEgbmV3IHByb3BzIG9iamVjdFxuICAgIGZvciAocHJvcE5hbWUgaW4gY29uZmlnKSB7XG4gICAgICBpZiAoaGFzT3duUHJvcGVydHkuY2FsbChjb25maWcsIHByb3BOYW1lKSAmJiAhUkVTRVJWRURfUFJPUFMuaGFzT3duUHJvcGVydHkocHJvcE5hbWUpKSB7XG4gICAgICAgIHByb3BzW3Byb3BOYW1lXSA9IGNvbmZpZ1twcm9wTmFtZV07XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gQ2hpbGRyZW4gY2FuIGJlIG1vcmUgdGhhbiBvbmUgYXJndW1lbnQsIGFuZCB0aG9zZSBhcmUgdHJhbnNmZXJyZWQgb250b1xuICAvLyB0aGUgbmV3bHkgYWxsb2NhdGVkIHByb3BzIG9iamVjdC5cbiAgdmFyIGNoaWxkcmVuTGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aCAtIDI7XG4gIGlmIChjaGlsZHJlbkxlbmd0aCA9PT0gMSkge1xuICAgIHByb3BzLmNoaWxkcmVuID0gY2hpbGRyZW47XG4gIH0gZWxzZSBpZiAoY2hpbGRyZW5MZW5ndGggPiAxKSB7XG4gICAgdmFyIGNoaWxkQXJyYXkgPSBBcnJheShjaGlsZHJlbkxlbmd0aCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZHJlbkxlbmd0aDsgaSsrKSB7XG4gICAgICBjaGlsZEFycmF5W2ldID0gYXJndW1lbnRzW2kgKyAyXTtcbiAgICB9XG4gICAge1xuICAgICAgaWYgKE9iamVjdC5mcmVlemUpIHtcbiAgICAgICAgT2JqZWN0LmZyZWV6ZShjaGlsZEFycmF5KTtcbiAgICAgIH1cbiAgICB9XG4gICAgcHJvcHMuY2hpbGRyZW4gPSBjaGlsZEFycmF5O1xuICB9XG5cbiAgLy8gUmVzb2x2ZSBkZWZhdWx0IHByb3BzXG4gIGlmICh0eXBlICYmIHR5cGUuZGVmYXVsdFByb3BzKSB7XG4gICAgdmFyIGRlZmF1bHRQcm9wcyA9IHR5cGUuZGVmYXVsdFByb3BzO1xuICAgIGZvciAocHJvcE5hbWUgaW4gZGVmYXVsdFByb3BzKSB7XG4gICAgICBpZiAocHJvcHNbcHJvcE5hbWVdID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcHJvcHNbcHJvcE5hbWVdID0gZGVmYXVsdFByb3BzW3Byb3BOYW1lXTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAge1xuICAgIGlmIChrZXkgfHwgcmVmKSB7XG4gICAgICB2YXIgZGlzcGxheU5hbWUgPSB0eXBlb2YgdHlwZSA9PT0gJ2Z1bmN0aW9uJyA/IHR5cGUuZGlzcGxheU5hbWUgfHwgdHlwZS5uYW1lIHx8ICdVbmtub3duJyA6IHR5cGU7XG4gICAgICBpZiAoa2V5KSB7XG4gICAgICAgIGRlZmluZUtleVByb3BXYXJuaW5nR2V0dGVyKHByb3BzLCBkaXNwbGF5TmFtZSk7XG4gICAgICB9XG4gICAgICBpZiAocmVmKSB7XG4gICAgICAgIGRlZmluZVJlZlByb3BXYXJuaW5nR2V0dGVyKHByb3BzLCBkaXNwbGF5TmFtZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBSZWFjdEVsZW1lbnQodHlwZSwga2V5LCByZWYsIHNlbGYsIHNvdXJjZSwgUmVhY3RDdXJyZW50T3duZXIuY3VycmVudCwgcHJvcHMpO1xufVxuXG4vKipcbiAqIFJldHVybiBhIGZ1bmN0aW9uIHRoYXQgcHJvZHVjZXMgUmVhY3RFbGVtZW50cyBvZiBhIGdpdmVuIHR5cGUuXG4gKiBTZWUgaHR0cHM6Ly9yZWFjdGpzLm9yZy9kb2NzL3JlYWN0LWFwaS5odG1sI2NyZWF0ZWZhY3RvcnlcbiAqL1xuXG5cbmZ1bmN0aW9uIGNsb25lQW5kUmVwbGFjZUtleShvbGRFbGVtZW50LCBuZXdLZXkpIHtcbiAgdmFyIG5ld0VsZW1lbnQgPSBSZWFjdEVsZW1lbnQob2xkRWxlbWVudC50eXBlLCBuZXdLZXksIG9sZEVsZW1lbnQucmVmLCBvbGRFbGVtZW50Ll9zZWxmLCBvbGRFbGVtZW50Ll9zb3VyY2UsIG9sZEVsZW1lbnQuX293bmVyLCBvbGRFbGVtZW50LnByb3BzKTtcblxuICByZXR1cm4gbmV3RWxlbWVudDtcbn1cblxuLyoqXG4gKiBDbG9uZSBhbmQgcmV0dXJuIGEgbmV3IFJlYWN0RWxlbWVudCB1c2luZyBlbGVtZW50IGFzIHRoZSBzdGFydGluZyBwb2ludC5cbiAqIFNlZSBodHRwczovL3JlYWN0anMub3JnL2RvY3MvcmVhY3QtYXBpLmh0bWwjY2xvbmVlbGVtZW50XG4gKi9cbmZ1bmN0aW9uIGNsb25lRWxlbWVudChlbGVtZW50LCBjb25maWcsIGNoaWxkcmVuKSB7XG4gIChmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCEhKGVsZW1lbnQgPT09IG51bGwgfHwgZWxlbWVudCA9PT0gdW5kZWZpbmVkKSkge1xuICAgICAge1xuICAgICAgICB0aHJvdyBSZWFjdEVycm9yKEVycm9yKCdSZWFjdC5jbG9uZUVsZW1lbnQoLi4uKTogVGhlIGFyZ3VtZW50IG11c3QgYmUgYSBSZWFjdCBlbGVtZW50LCBidXQgeW91IHBhc3NlZCAnICsgZWxlbWVudCArICcuJykpO1xuICAgICAgfVxuICAgIH1cbiAgfSkoKTtcblxuICB2YXIgcHJvcE5hbWUgPSB2b2lkIDA7XG5cbiAgLy8gT3JpZ2luYWwgcHJvcHMgYXJlIGNvcGllZFxuICB2YXIgcHJvcHMgPSBfYXNzaWduKHt9LCBlbGVtZW50LnByb3BzKTtcblxuICAvLyBSZXNlcnZlZCBuYW1lcyBhcmUgZXh0cmFjdGVkXG4gIHZhciBrZXkgPSBlbGVtZW50LmtleTtcbiAgdmFyIHJlZiA9IGVsZW1lbnQucmVmO1xuICAvLyBTZWxmIGlzIHByZXNlcnZlZCBzaW5jZSB0aGUgb3duZXIgaXMgcHJlc2VydmVkLlxuICB2YXIgc2VsZiA9IGVsZW1lbnQuX3NlbGY7XG4gIC8vIFNvdXJjZSBpcyBwcmVzZXJ2ZWQgc2luY2UgY2xvbmVFbGVtZW50IGlzIHVubGlrZWx5IHRvIGJlIHRhcmdldGVkIGJ5IGFcbiAgLy8gdHJhbnNwaWxlciwgYW5kIHRoZSBvcmlnaW5hbCBzb3VyY2UgaXMgcHJvYmFibHkgYSBiZXR0ZXIgaW5kaWNhdG9yIG9mIHRoZVxuICAvLyB0cnVlIG93bmVyLlxuICB2YXIgc291cmNlID0gZWxlbWVudC5fc291cmNlO1xuXG4gIC8vIE93bmVyIHdpbGwgYmUgcHJlc2VydmVkLCB1bmxlc3MgcmVmIGlzIG92ZXJyaWRkZW5cbiAgdmFyIG93bmVyID0gZWxlbWVudC5fb3duZXI7XG5cbiAgaWYgKGNvbmZpZyAhPSBudWxsKSB7XG4gICAgaWYgKGhhc1ZhbGlkUmVmKGNvbmZpZykpIHtcbiAgICAgIC8vIFNpbGVudGx5IHN0ZWFsIHRoZSByZWYgZnJvbSB0aGUgcGFyZW50LlxuICAgICAgcmVmID0gY29uZmlnLnJlZjtcbiAgICAgIG93bmVyID0gUmVhY3RDdXJyZW50T3duZXIuY3VycmVudDtcbiAgICB9XG4gICAgaWYgKGhhc1ZhbGlkS2V5KGNvbmZpZykpIHtcbiAgICAgIGtleSA9ICcnICsgY29uZmlnLmtleTtcbiAgICB9XG5cbiAgICAvLyBSZW1haW5pbmcgcHJvcGVydGllcyBvdmVycmlkZSBleGlzdGluZyBwcm9wc1xuICAgIHZhciBkZWZhdWx0UHJvcHMgPSB2b2lkIDA7XG4gICAgaWYgKGVsZW1lbnQudHlwZSAmJiBlbGVtZW50LnR5cGUuZGVmYXVsdFByb3BzKSB7XG4gICAgICBkZWZhdWx0UHJvcHMgPSBlbGVtZW50LnR5cGUuZGVmYXVsdFByb3BzO1xuICAgIH1cbiAgICBmb3IgKHByb3BOYW1lIGluIGNvbmZpZykge1xuICAgICAgaWYgKGhhc093blByb3BlcnR5LmNhbGwoY29uZmlnLCBwcm9wTmFtZSkgJiYgIVJFU0VSVkVEX1BST1BTLmhhc093blByb3BlcnR5KHByb3BOYW1lKSkge1xuICAgICAgICBpZiAoY29uZmlnW3Byb3BOYW1lXSA9PT0gdW5kZWZpbmVkICYmIGRlZmF1bHRQcm9wcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgLy8gUmVzb2x2ZSBkZWZhdWx0IHByb3BzXG4gICAgICAgICAgcHJvcHNbcHJvcE5hbWVdID0gZGVmYXVsdFByb3BzW3Byb3BOYW1lXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwcm9wc1twcm9wTmFtZV0gPSBjb25maWdbcHJvcE5hbWVdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gQ2hpbGRyZW4gY2FuIGJlIG1vcmUgdGhhbiBvbmUgYXJndW1lbnQsIGFuZCB0aG9zZSBhcmUgdHJhbnNmZXJyZWQgb250b1xuICAvLyB0aGUgbmV3bHkgYWxsb2NhdGVkIHByb3BzIG9iamVjdC5cbiAgdmFyIGNoaWxkcmVuTGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aCAtIDI7XG4gIGlmIChjaGlsZHJlbkxlbmd0aCA9PT0gMSkge1xuICAgIHByb3BzLmNoaWxkcmVuID0gY2hpbGRyZW47XG4gIH0gZWxzZSBpZiAoY2hpbGRyZW5MZW5ndGggPiAxKSB7XG4gICAgdmFyIGNoaWxkQXJyYXkgPSBBcnJheShjaGlsZHJlbkxlbmd0aCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZHJlbkxlbmd0aDsgaSsrKSB7XG4gICAgICBjaGlsZEFycmF5W2ldID0gYXJndW1lbnRzW2kgKyAyXTtcbiAgICB9XG4gICAgcHJvcHMuY2hpbGRyZW4gPSBjaGlsZEFycmF5O1xuICB9XG5cbiAgcmV0dXJuIFJlYWN0RWxlbWVudChlbGVtZW50LnR5cGUsIGtleSwgcmVmLCBzZWxmLCBzb3VyY2UsIG93bmVyLCBwcm9wcyk7XG59XG5cbi8qKlxuICogVmVyaWZpZXMgdGhlIG9iamVjdCBpcyBhIFJlYWN0RWxlbWVudC5cbiAqIFNlZSBodHRwczovL3JlYWN0anMub3JnL2RvY3MvcmVhY3QtYXBpLmh0bWwjaXN2YWxpZGVsZW1lbnRcbiAqIEBwYXJhbSB7P29iamVjdH0gb2JqZWN0XG4gKiBAcmV0dXJuIHtib29sZWFufSBUcnVlIGlmIGBvYmplY3RgIGlzIGEgUmVhY3RFbGVtZW50LlxuICogQGZpbmFsXG4gKi9cbmZ1bmN0aW9uIGlzVmFsaWRFbGVtZW50KG9iamVjdCkge1xuICByZXR1cm4gdHlwZW9mIG9iamVjdCA9PT0gJ29iamVjdCcgJiYgb2JqZWN0ICE9PSBudWxsICYmIG9iamVjdC4kJHR5cGVvZiA9PT0gUkVBQ1RfRUxFTUVOVF9UWVBFO1xufVxuXG52YXIgU0VQQVJBVE9SID0gJy4nO1xudmFyIFNVQlNFUEFSQVRPUiA9ICc6JztcblxuLyoqXG4gKiBFc2NhcGUgYW5kIHdyYXAga2V5IHNvIGl0IGlzIHNhZmUgdG8gdXNlIGFzIGEgcmVhY3RpZFxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgdG8gYmUgZXNjYXBlZC5cbiAqIEByZXR1cm4ge3N0cmluZ30gdGhlIGVzY2FwZWQga2V5LlxuICovXG5mdW5jdGlvbiBlc2NhcGUoa2V5KSB7XG4gIHZhciBlc2NhcGVSZWdleCA9IC9bPTpdL2c7XG4gIHZhciBlc2NhcGVyTG9va3VwID0ge1xuICAgICc9JzogJz0wJyxcbiAgICAnOic6ICc9MidcbiAgfTtcbiAgdmFyIGVzY2FwZWRTdHJpbmcgPSAoJycgKyBrZXkpLnJlcGxhY2UoZXNjYXBlUmVnZXgsIGZ1bmN0aW9uIChtYXRjaCkge1xuICAgIHJldHVybiBlc2NhcGVyTG9va3VwW21hdGNoXTtcbiAgfSk7XG5cbiAgcmV0dXJuICckJyArIGVzY2FwZWRTdHJpbmc7XG59XG5cbi8qKlxuICogVE9ETzogVGVzdCB0aGF0IGEgc2luZ2xlIGNoaWxkIGFuZCBhbiBhcnJheSB3aXRoIG9uZSBpdGVtIGhhdmUgdGhlIHNhbWUga2V5XG4gKiBwYXR0ZXJuLlxuICovXG5cbnZhciBkaWRXYXJuQWJvdXRNYXBzID0gZmFsc2U7XG5cbnZhciB1c2VyUHJvdmlkZWRLZXlFc2NhcGVSZWdleCA9IC9cXC8rL2c7XG5mdW5jdGlvbiBlc2NhcGVVc2VyUHJvdmlkZWRLZXkodGV4dCkge1xuICByZXR1cm4gKCcnICsgdGV4dCkucmVwbGFjZSh1c2VyUHJvdmlkZWRLZXlFc2NhcGVSZWdleCwgJyQmLycpO1xufVxuXG52YXIgUE9PTF9TSVpFID0gMTA7XG52YXIgdHJhdmVyc2VDb250ZXh0UG9vbCA9IFtdO1xuZnVuY3Rpb24gZ2V0UG9vbGVkVHJhdmVyc2VDb250ZXh0KG1hcFJlc3VsdCwga2V5UHJlZml4LCBtYXBGdW5jdGlvbiwgbWFwQ29udGV4dCkge1xuICBpZiAodHJhdmVyc2VDb250ZXh0UG9vbC5sZW5ndGgpIHtcbiAgICB2YXIgdHJhdmVyc2VDb250ZXh0ID0gdHJhdmVyc2VDb250ZXh0UG9vbC5wb3AoKTtcbiAgICB0cmF2ZXJzZUNvbnRleHQucmVzdWx0ID0gbWFwUmVzdWx0O1xuICAgIHRyYXZlcnNlQ29udGV4dC5rZXlQcmVmaXggPSBrZXlQcmVmaXg7XG4gICAgdHJhdmVyc2VDb250ZXh0LmZ1bmMgPSBtYXBGdW5jdGlvbjtcbiAgICB0cmF2ZXJzZUNvbnRleHQuY29udGV4dCA9IG1hcENvbnRleHQ7XG4gICAgdHJhdmVyc2VDb250ZXh0LmNvdW50ID0gMDtcbiAgICByZXR1cm4gdHJhdmVyc2VDb250ZXh0O1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB7XG4gICAgICByZXN1bHQ6IG1hcFJlc3VsdCxcbiAgICAgIGtleVByZWZpeDoga2V5UHJlZml4LFxuICAgICAgZnVuYzogbWFwRnVuY3Rpb24sXG4gICAgICBjb250ZXh0OiBtYXBDb250ZXh0LFxuICAgICAgY291bnQ6IDBcbiAgICB9O1xuICB9XG59XG5cbmZ1bmN0aW9uIHJlbGVhc2VUcmF2ZXJzZUNvbnRleHQodHJhdmVyc2VDb250ZXh0KSB7XG4gIHRyYXZlcnNlQ29udGV4dC5yZXN1bHQgPSBudWxsO1xuICB0cmF2ZXJzZUNvbnRleHQua2V5UHJlZml4ID0gbnVsbDtcbiAgdHJhdmVyc2VDb250ZXh0LmZ1bmMgPSBudWxsO1xuICB0cmF2ZXJzZUNvbnRleHQuY29udGV4dCA9IG51bGw7XG4gIHRyYXZlcnNlQ29udGV4dC5jb3VudCA9IDA7XG4gIGlmICh0cmF2ZXJzZUNvbnRleHRQb29sLmxlbmd0aCA8IFBPT0xfU0laRSkge1xuICAgIHRyYXZlcnNlQ29udGV4dFBvb2wucHVzaCh0cmF2ZXJzZUNvbnRleHQpO1xuICB9XG59XG5cbi8qKlxuICogQHBhcmFtIHs/Kn0gY2hpbGRyZW4gQ2hpbGRyZW4gdHJlZSBjb250YWluZXIuXG4gKiBAcGFyYW0geyFzdHJpbmd9IG5hbWVTb0ZhciBOYW1lIG9mIHRoZSBrZXkgcGF0aCBzbyBmYXIuXG4gKiBAcGFyYW0geyFmdW5jdGlvbn0gY2FsbGJhY2sgQ2FsbGJhY2sgdG8gaW52b2tlIHdpdGggZWFjaCBjaGlsZCBmb3VuZC5cbiAqIEBwYXJhbSB7Pyp9IHRyYXZlcnNlQ29udGV4dCBVc2VkIHRvIHBhc3MgaW5mb3JtYXRpb24gdGhyb3VnaG91dCB0aGUgdHJhdmVyc2FsXG4gKiBwcm9jZXNzLlxuICogQHJldHVybiB7IW51bWJlcn0gVGhlIG51bWJlciBvZiBjaGlsZHJlbiBpbiB0aGlzIHN1YnRyZWUuXG4gKi9cbmZ1bmN0aW9uIHRyYXZlcnNlQWxsQ2hpbGRyZW5JbXBsKGNoaWxkcmVuLCBuYW1lU29GYXIsIGNhbGxiYWNrLCB0cmF2ZXJzZUNvbnRleHQpIHtcbiAgdmFyIHR5cGUgPSB0eXBlb2YgY2hpbGRyZW47XG5cbiAgaWYgKHR5cGUgPT09ICd1bmRlZmluZWQnIHx8IHR5cGUgPT09ICdib29sZWFuJykge1xuICAgIC8vIEFsbCBvZiB0aGUgYWJvdmUgYXJlIHBlcmNlaXZlZCBhcyBudWxsLlxuICAgIGNoaWxkcmVuID0gbnVsbDtcbiAgfVxuXG4gIHZhciBpbnZva2VDYWxsYmFjayA9IGZhbHNlO1xuXG4gIGlmIChjaGlsZHJlbiA9PT0gbnVsbCkge1xuICAgIGludm9rZUNhbGxiYWNrID0gdHJ1ZTtcbiAgfSBlbHNlIHtcbiAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgICBjYXNlICdudW1iZXInOlxuICAgICAgICBpbnZva2VDYWxsYmFjayA9IHRydWU7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnb2JqZWN0JzpcbiAgICAgICAgc3dpdGNoIChjaGlsZHJlbi4kJHR5cGVvZikge1xuICAgICAgICAgIGNhc2UgUkVBQ1RfRUxFTUVOVF9UWVBFOlxuICAgICAgICAgIGNhc2UgUkVBQ1RfUE9SVEFMX1RZUEU6XG4gICAgICAgICAgICBpbnZva2VDYWxsYmFjayA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9XG4gIH1cblxuICBpZiAoaW52b2tlQ2FsbGJhY2spIHtcbiAgICBjYWxsYmFjayh0cmF2ZXJzZUNvbnRleHQsIGNoaWxkcmVuLFxuICAgIC8vIElmIGl0J3MgdGhlIG9ubHkgY2hpbGQsIHRyZWF0IHRoZSBuYW1lIGFzIGlmIGl0IHdhcyB3cmFwcGVkIGluIGFuIGFycmF5XG4gICAgLy8gc28gdGhhdCBpdCdzIGNvbnNpc3RlbnQgaWYgdGhlIG51bWJlciBvZiBjaGlsZHJlbiBncm93cy5cbiAgICBuYW1lU29GYXIgPT09ICcnID8gU0VQQVJBVE9SICsgZ2V0Q29tcG9uZW50S2V5KGNoaWxkcmVuLCAwKSA6IG5hbWVTb0Zhcik7XG4gICAgcmV0dXJuIDE7XG4gIH1cblxuICB2YXIgY2hpbGQgPSB2b2lkIDA7XG4gIHZhciBuZXh0TmFtZSA9IHZvaWQgMDtcbiAgdmFyIHN1YnRyZWVDb3VudCA9IDA7IC8vIENvdW50IG9mIGNoaWxkcmVuIGZvdW5kIGluIHRoZSBjdXJyZW50IHN1YnRyZWUuXG4gIHZhciBuZXh0TmFtZVByZWZpeCA9IG5hbWVTb0ZhciA9PT0gJycgPyBTRVBBUkFUT1IgOiBuYW1lU29GYXIgKyBTVUJTRVBBUkFUT1I7XG5cbiAgaWYgKEFycmF5LmlzQXJyYXkoY2hpbGRyZW4pKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgY2hpbGQgPSBjaGlsZHJlbltpXTtcbiAgICAgIG5leHROYW1lID0gbmV4dE5hbWVQcmVmaXggKyBnZXRDb21wb25lbnRLZXkoY2hpbGQsIGkpO1xuICAgICAgc3VidHJlZUNvdW50ICs9IHRyYXZlcnNlQWxsQ2hpbGRyZW5JbXBsKGNoaWxkLCBuZXh0TmFtZSwgY2FsbGJhY2ssIHRyYXZlcnNlQ29udGV4dCk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHZhciBpdGVyYXRvckZuID0gZ2V0SXRlcmF0b3JGbihjaGlsZHJlbik7XG4gICAgaWYgKHR5cGVvZiBpdGVyYXRvckZuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICB7XG4gICAgICAgIC8vIFdhcm4gYWJvdXQgdXNpbmcgTWFwcyBhcyBjaGlsZHJlblxuICAgICAgICBpZiAoaXRlcmF0b3JGbiA9PT0gY2hpbGRyZW4uZW50cmllcykge1xuICAgICAgICAgICFkaWRXYXJuQWJvdXRNYXBzID8gd2FybmluZyQxKGZhbHNlLCAnVXNpbmcgTWFwcyBhcyBjaGlsZHJlbiBpcyB1bnN1cHBvcnRlZCBhbmQgd2lsbCBsaWtlbHkgeWllbGQgJyArICd1bmV4cGVjdGVkIHJlc3VsdHMuIENvbnZlcnQgaXQgdG8gYSBzZXF1ZW5jZS9pdGVyYWJsZSBvZiBrZXllZCAnICsgJ1JlYWN0RWxlbWVudHMgaW5zdGVhZC4nKSA6IHZvaWQgMDtcbiAgICAgICAgICBkaWRXYXJuQWJvdXRNYXBzID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB2YXIgaXRlcmF0b3IgPSBpdGVyYXRvckZuLmNhbGwoY2hpbGRyZW4pO1xuICAgICAgdmFyIHN0ZXAgPSB2b2lkIDA7XG4gICAgICB2YXIgaWkgPSAwO1xuICAgICAgd2hpbGUgKCEoc3RlcCA9IGl0ZXJhdG9yLm5leHQoKSkuZG9uZSkge1xuICAgICAgICBjaGlsZCA9IHN0ZXAudmFsdWU7XG4gICAgICAgIG5leHROYW1lID0gbmV4dE5hbWVQcmVmaXggKyBnZXRDb21wb25lbnRLZXkoY2hpbGQsIGlpKyspO1xuICAgICAgICBzdWJ0cmVlQ291bnQgKz0gdHJhdmVyc2VBbGxDaGlsZHJlbkltcGwoY2hpbGQsIG5leHROYW1lLCBjYWxsYmFjaywgdHJhdmVyc2VDb250ZXh0KTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICdvYmplY3QnKSB7XG4gICAgICB2YXIgYWRkZW5kdW0gPSAnJztcbiAgICAgIHtcbiAgICAgICAgYWRkZW5kdW0gPSAnIElmIHlvdSBtZWFudCB0byByZW5kZXIgYSBjb2xsZWN0aW9uIG9mIGNoaWxkcmVuLCB1c2UgYW4gYXJyYXkgJyArICdpbnN0ZWFkLicgKyBSZWFjdERlYnVnQ3VycmVudEZyYW1lLmdldFN0YWNrQWRkZW5kdW0oKTtcbiAgICAgIH1cbiAgICAgIHZhciBjaGlsZHJlblN0cmluZyA9ICcnICsgY2hpbGRyZW47XG4gICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICB7XG4gICAgICAgICAge1xuICAgICAgICAgICAgdGhyb3cgUmVhY3RFcnJvcihFcnJvcignT2JqZWN0cyBhcmUgbm90IHZhbGlkIGFzIGEgUmVhY3QgY2hpbGQgKGZvdW5kOiAnICsgKGNoaWxkcmVuU3RyaW5nID09PSAnW29iamVjdCBPYmplY3RdJyA/ICdvYmplY3Qgd2l0aCBrZXlzIHsnICsgT2JqZWN0LmtleXMoY2hpbGRyZW4pLmpvaW4oJywgJykgKyAnfScgOiBjaGlsZHJlblN0cmluZykgKyAnKS4nICsgYWRkZW5kdW0pKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pKCk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHN1YnRyZWVDb3VudDtcbn1cblxuLyoqXG4gKiBUcmF2ZXJzZXMgY2hpbGRyZW4gdGhhdCBhcmUgdHlwaWNhbGx5IHNwZWNpZmllZCBhcyBgcHJvcHMuY2hpbGRyZW5gLCBidXRcbiAqIG1pZ2h0IGFsc28gYmUgc3BlY2lmaWVkIHRocm91Z2ggYXR0cmlidXRlczpcbiAqXG4gKiAtIGB0cmF2ZXJzZUFsbENoaWxkcmVuKHRoaXMucHJvcHMuY2hpbGRyZW4sIC4uLilgXG4gKiAtIGB0cmF2ZXJzZUFsbENoaWxkcmVuKHRoaXMucHJvcHMubGVmdFBhbmVsQ2hpbGRyZW4sIC4uLilgXG4gKlxuICogVGhlIGB0cmF2ZXJzZUNvbnRleHRgIGlzIGFuIG9wdGlvbmFsIGFyZ3VtZW50IHRoYXQgaXMgcGFzc2VkIHRocm91Z2ggdGhlXG4gKiBlbnRpcmUgdHJhdmVyc2FsLiBJdCBjYW4gYmUgdXNlZCB0byBzdG9yZSBhY2N1bXVsYXRpb25zIG9yIGFueXRoaW5nIGVsc2UgdGhhdFxuICogdGhlIGNhbGxiYWNrIG1pZ2h0IGZpbmQgcmVsZXZhbnQuXG4gKlxuICogQHBhcmFtIHs/Kn0gY2hpbGRyZW4gQ2hpbGRyZW4gdHJlZSBvYmplY3QuXG4gKiBAcGFyYW0geyFmdW5jdGlvbn0gY2FsbGJhY2sgVG8gaW52b2tlIHVwb24gdHJhdmVyc2luZyBlYWNoIGNoaWxkLlxuICogQHBhcmFtIHs/Kn0gdHJhdmVyc2VDb250ZXh0IENvbnRleHQgZm9yIHRyYXZlcnNhbC5cbiAqIEByZXR1cm4geyFudW1iZXJ9IFRoZSBudW1iZXIgb2YgY2hpbGRyZW4gaW4gdGhpcyBzdWJ0cmVlLlxuICovXG5mdW5jdGlvbiB0cmF2ZXJzZUFsbENoaWxkcmVuKGNoaWxkcmVuLCBjYWxsYmFjaywgdHJhdmVyc2VDb250ZXh0KSB7XG4gIGlmIChjaGlsZHJlbiA9PSBudWxsKSB7XG4gICAgcmV0dXJuIDA7XG4gIH1cblxuICByZXR1cm4gdHJhdmVyc2VBbGxDaGlsZHJlbkltcGwoY2hpbGRyZW4sICcnLCBjYWxsYmFjaywgdHJhdmVyc2VDb250ZXh0KTtcbn1cblxuLyoqXG4gKiBHZW5lcmF0ZSBhIGtleSBzdHJpbmcgdGhhdCBpZGVudGlmaWVzIGEgY29tcG9uZW50IHdpdGhpbiBhIHNldC5cbiAqXG4gKiBAcGFyYW0geyp9IGNvbXBvbmVudCBBIGNvbXBvbmVudCB0aGF0IGNvdWxkIGNvbnRhaW4gYSBtYW51YWwga2V5LlxuICogQHBhcmFtIHtudW1iZXJ9IGluZGV4IEluZGV4IHRoYXQgaXMgdXNlZCBpZiBhIG1hbnVhbCBrZXkgaXMgbm90IHByb3ZpZGVkLlxuICogQHJldHVybiB7c3RyaW5nfVxuICovXG5mdW5jdGlvbiBnZXRDb21wb25lbnRLZXkoY29tcG9uZW50LCBpbmRleCkge1xuICAvLyBEbyBzb21lIHR5cGVjaGVja2luZyBoZXJlIHNpbmNlIHdlIGNhbGwgdGhpcyBibGluZGx5LiBXZSB3YW50IHRvIGVuc3VyZVxuICAvLyB0aGF0IHdlIGRvbid0IGJsb2NrIHBvdGVudGlhbCBmdXR1cmUgRVMgQVBJcy5cbiAgaWYgKHR5cGVvZiBjb21wb25lbnQgPT09ICdvYmplY3QnICYmIGNvbXBvbmVudCAhPT0gbnVsbCAmJiBjb21wb25lbnQua2V5ICE9IG51bGwpIHtcbiAgICAvLyBFeHBsaWNpdCBrZXlcbiAgICByZXR1cm4gZXNjYXBlKGNvbXBvbmVudC5rZXkpO1xuICB9XG4gIC8vIEltcGxpY2l0IGtleSBkZXRlcm1pbmVkIGJ5IHRoZSBpbmRleCBpbiB0aGUgc2V0XG4gIHJldHVybiBpbmRleC50b1N0cmluZygzNik7XG59XG5cbmZ1bmN0aW9uIGZvckVhY2hTaW5nbGVDaGlsZChib29rS2VlcGluZywgY2hpbGQsIG5hbWUpIHtcbiAgdmFyIGZ1bmMgPSBib29rS2VlcGluZy5mdW5jLFxuICAgICAgY29udGV4dCA9IGJvb2tLZWVwaW5nLmNvbnRleHQ7XG5cbiAgZnVuYy5jYWxsKGNvbnRleHQsIGNoaWxkLCBib29rS2VlcGluZy5jb3VudCsrKTtcbn1cblxuLyoqXG4gKiBJdGVyYXRlcyB0aHJvdWdoIGNoaWxkcmVuIHRoYXQgYXJlIHR5cGljYWxseSBzcGVjaWZpZWQgYXMgYHByb3BzLmNoaWxkcmVuYC5cbiAqXG4gKiBTZWUgaHR0cHM6Ly9yZWFjdGpzLm9yZy9kb2NzL3JlYWN0LWFwaS5odG1sI3JlYWN0Y2hpbGRyZW5mb3JlYWNoXG4gKlxuICogVGhlIHByb3ZpZGVkIGZvckVhY2hGdW5jKGNoaWxkLCBpbmRleCkgd2lsbCBiZSBjYWxsZWQgZm9yIGVhY2hcbiAqIGxlYWYgY2hpbGQuXG4gKlxuICogQHBhcmFtIHs/Kn0gY2hpbGRyZW4gQ2hpbGRyZW4gdHJlZSBjb250YWluZXIuXG4gKiBAcGFyYW0ge2Z1bmN0aW9uKCosIGludCl9IGZvckVhY2hGdW5jXG4gKiBAcGFyYW0geyp9IGZvckVhY2hDb250ZXh0IENvbnRleHQgZm9yIGZvckVhY2hDb250ZXh0LlxuICovXG5mdW5jdGlvbiBmb3JFYWNoQ2hpbGRyZW4oY2hpbGRyZW4sIGZvckVhY2hGdW5jLCBmb3JFYWNoQ29udGV4dCkge1xuICBpZiAoY2hpbGRyZW4gPT0gbnVsbCkge1xuICAgIHJldHVybiBjaGlsZHJlbjtcbiAgfVxuICB2YXIgdHJhdmVyc2VDb250ZXh0ID0gZ2V0UG9vbGVkVHJhdmVyc2VDb250ZXh0KG51bGwsIG51bGwsIGZvckVhY2hGdW5jLCBmb3JFYWNoQ29udGV4dCk7XG4gIHRyYXZlcnNlQWxsQ2hpbGRyZW4oY2hpbGRyZW4sIGZvckVhY2hTaW5nbGVDaGlsZCwgdHJhdmVyc2VDb250ZXh0KTtcbiAgcmVsZWFzZVRyYXZlcnNlQ29udGV4dCh0cmF2ZXJzZUNvbnRleHQpO1xufVxuXG5mdW5jdGlvbiBtYXBTaW5nbGVDaGlsZEludG9Db250ZXh0KGJvb2tLZWVwaW5nLCBjaGlsZCwgY2hpbGRLZXkpIHtcbiAgdmFyIHJlc3VsdCA9IGJvb2tLZWVwaW5nLnJlc3VsdCxcbiAgICAgIGtleVByZWZpeCA9IGJvb2tLZWVwaW5nLmtleVByZWZpeCxcbiAgICAgIGZ1bmMgPSBib29rS2VlcGluZy5mdW5jLFxuICAgICAgY29udGV4dCA9IGJvb2tLZWVwaW5nLmNvbnRleHQ7XG5cblxuICB2YXIgbWFwcGVkQ2hpbGQgPSBmdW5jLmNhbGwoY29udGV4dCwgY2hpbGQsIGJvb2tLZWVwaW5nLmNvdW50KyspO1xuICBpZiAoQXJyYXkuaXNBcnJheShtYXBwZWRDaGlsZCkpIHtcbiAgICBtYXBJbnRvV2l0aEtleVByZWZpeEludGVybmFsKG1hcHBlZENoaWxkLCByZXN1bHQsIGNoaWxkS2V5LCBmdW5jdGlvbiAoYykge1xuICAgICAgcmV0dXJuIGM7XG4gICAgfSk7XG4gIH0gZWxzZSBpZiAobWFwcGVkQ2hpbGQgIT0gbnVsbCkge1xuICAgIGlmIChpc1ZhbGlkRWxlbWVudChtYXBwZWRDaGlsZCkpIHtcbiAgICAgIG1hcHBlZENoaWxkID0gY2xvbmVBbmRSZXBsYWNlS2V5KG1hcHBlZENoaWxkLFxuICAgICAgLy8gS2VlcCBib3RoIHRoZSAobWFwcGVkKSBhbmQgb2xkIGtleXMgaWYgdGhleSBkaWZmZXIsIGp1c3QgYXNcbiAgICAgIC8vIHRyYXZlcnNlQWxsQ2hpbGRyZW4gdXNlZCB0byBkbyBmb3Igb2JqZWN0cyBhcyBjaGlsZHJlblxuICAgICAga2V5UHJlZml4ICsgKG1hcHBlZENoaWxkLmtleSAmJiAoIWNoaWxkIHx8IGNoaWxkLmtleSAhPT0gbWFwcGVkQ2hpbGQua2V5KSA/IGVzY2FwZVVzZXJQcm92aWRlZEtleShtYXBwZWRDaGlsZC5rZXkpICsgJy8nIDogJycpICsgY2hpbGRLZXkpO1xuICAgIH1cbiAgICByZXN1bHQucHVzaChtYXBwZWRDaGlsZCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gbWFwSW50b1dpdGhLZXlQcmVmaXhJbnRlcm5hbChjaGlsZHJlbiwgYXJyYXksIHByZWZpeCwgZnVuYywgY29udGV4dCkge1xuICB2YXIgZXNjYXBlZFByZWZpeCA9ICcnO1xuICBpZiAocHJlZml4ICE9IG51bGwpIHtcbiAgICBlc2NhcGVkUHJlZml4ID0gZXNjYXBlVXNlclByb3ZpZGVkS2V5KHByZWZpeCkgKyAnLyc7XG4gIH1cbiAgdmFyIHRyYXZlcnNlQ29udGV4dCA9IGdldFBvb2xlZFRyYXZlcnNlQ29udGV4dChhcnJheSwgZXNjYXBlZFByZWZpeCwgZnVuYywgY29udGV4dCk7XG4gIHRyYXZlcnNlQWxsQ2hpbGRyZW4oY2hpbGRyZW4sIG1hcFNpbmdsZUNoaWxkSW50b0NvbnRleHQsIHRyYXZlcnNlQ29udGV4dCk7XG4gIHJlbGVhc2VUcmF2ZXJzZUNvbnRleHQodHJhdmVyc2VDb250ZXh0KTtcbn1cblxuLyoqXG4gKiBNYXBzIGNoaWxkcmVuIHRoYXQgYXJlIHR5cGljYWxseSBzcGVjaWZpZWQgYXMgYHByb3BzLmNoaWxkcmVuYC5cbiAqXG4gKiBTZWUgaHR0cHM6Ly9yZWFjdGpzLm9yZy9kb2NzL3JlYWN0LWFwaS5odG1sI3JlYWN0Y2hpbGRyZW5tYXBcbiAqXG4gKiBUaGUgcHJvdmlkZWQgbWFwRnVuY3Rpb24oY2hpbGQsIGtleSwgaW5kZXgpIHdpbGwgYmUgY2FsbGVkIGZvciBlYWNoXG4gKiBsZWFmIGNoaWxkLlxuICpcbiAqIEBwYXJhbSB7Pyp9IGNoaWxkcmVuIENoaWxkcmVuIHRyZWUgY29udGFpbmVyLlxuICogQHBhcmFtIHtmdW5jdGlvbigqLCBpbnQpfSBmdW5jIFRoZSBtYXAgZnVuY3Rpb24uXG4gKiBAcGFyYW0geyp9IGNvbnRleHQgQ29udGV4dCBmb3IgbWFwRnVuY3Rpb24uXG4gKiBAcmV0dXJuIHtvYmplY3R9IE9iamVjdCBjb250YWluaW5nIHRoZSBvcmRlcmVkIG1hcCBvZiByZXN1bHRzLlxuICovXG5mdW5jdGlvbiBtYXBDaGlsZHJlbihjaGlsZHJlbiwgZnVuYywgY29udGV4dCkge1xuICBpZiAoY2hpbGRyZW4gPT0gbnVsbCkge1xuICAgIHJldHVybiBjaGlsZHJlbjtcbiAgfVxuICB2YXIgcmVzdWx0ID0gW107XG4gIG1hcEludG9XaXRoS2V5UHJlZml4SW50ZXJuYWwoY2hpbGRyZW4sIHJlc3VsdCwgbnVsbCwgZnVuYywgY29udGV4dCk7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogQ291bnQgdGhlIG51bWJlciBvZiBjaGlsZHJlbiB0aGF0IGFyZSB0eXBpY2FsbHkgc3BlY2lmaWVkIGFzXG4gKiBgcHJvcHMuY2hpbGRyZW5gLlxuICpcbiAqIFNlZSBodHRwczovL3JlYWN0anMub3JnL2RvY3MvcmVhY3QtYXBpLmh0bWwjcmVhY3RjaGlsZHJlbmNvdW50XG4gKlxuICogQHBhcmFtIHs/Kn0gY2hpbGRyZW4gQ2hpbGRyZW4gdHJlZSBjb250YWluZXIuXG4gKiBAcmV0dXJuIHtudW1iZXJ9IFRoZSBudW1iZXIgb2YgY2hpbGRyZW4uXG4gKi9cbmZ1bmN0aW9uIGNvdW50Q2hpbGRyZW4oY2hpbGRyZW4pIHtcbiAgcmV0dXJuIHRyYXZlcnNlQWxsQ2hpbGRyZW4oY2hpbGRyZW4sIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfSwgbnVsbCk7XG59XG5cbi8qKlxuICogRmxhdHRlbiBhIGNoaWxkcmVuIG9iamVjdCAodHlwaWNhbGx5IHNwZWNpZmllZCBhcyBgcHJvcHMuY2hpbGRyZW5gKSBhbmRcbiAqIHJldHVybiBhbiBhcnJheSB3aXRoIGFwcHJvcHJpYXRlbHkgcmUta2V5ZWQgY2hpbGRyZW4uXG4gKlxuICogU2VlIGh0dHBzOi8vcmVhY3Rqcy5vcmcvZG9jcy9yZWFjdC1hcGkuaHRtbCNyZWFjdGNoaWxkcmVudG9hcnJheVxuICovXG5mdW5jdGlvbiB0b0FycmF5KGNoaWxkcmVuKSB7XG4gIHZhciByZXN1bHQgPSBbXTtcbiAgbWFwSW50b1dpdGhLZXlQcmVmaXhJbnRlcm5hbChjaGlsZHJlbiwgcmVzdWx0LCBudWxsLCBmdW5jdGlvbiAoY2hpbGQpIHtcbiAgICByZXR1cm4gY2hpbGQ7XG4gIH0pO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIFJldHVybnMgdGhlIGZpcnN0IGNoaWxkIGluIGEgY29sbGVjdGlvbiBvZiBjaGlsZHJlbiBhbmQgdmVyaWZpZXMgdGhhdCB0aGVyZVxuICogaXMgb25seSBvbmUgY2hpbGQgaW4gdGhlIGNvbGxlY3Rpb24uXG4gKlxuICogU2VlIGh0dHBzOi8vcmVhY3Rqcy5vcmcvZG9jcy9yZWFjdC1hcGkuaHRtbCNyZWFjdGNoaWxkcmVub25seVxuICpcbiAqIFRoZSBjdXJyZW50IGltcGxlbWVudGF0aW9uIG9mIHRoaXMgZnVuY3Rpb24gYXNzdW1lcyB0aGF0IGEgc2luZ2xlIGNoaWxkIGdldHNcbiAqIHBhc3NlZCB3aXRob3V0IGEgd3JhcHBlciwgYnV0IHRoZSBwdXJwb3NlIG9mIHRoaXMgaGVscGVyIGZ1bmN0aW9uIGlzIHRvXG4gKiBhYnN0cmFjdCBhd2F5IHRoZSBwYXJ0aWN1bGFyIHN0cnVjdHVyZSBvZiBjaGlsZHJlbi5cbiAqXG4gKiBAcGFyYW0gez9vYmplY3R9IGNoaWxkcmVuIENoaWxkIGNvbGxlY3Rpb24gc3RydWN0dXJlLlxuICogQHJldHVybiB7UmVhY3RFbGVtZW50fSBUaGUgZmlyc3QgYW5kIG9ubHkgYFJlYWN0RWxlbWVudGAgY29udGFpbmVkIGluIHRoZVxuICogc3RydWN0dXJlLlxuICovXG5mdW5jdGlvbiBvbmx5Q2hpbGQoY2hpbGRyZW4pIHtcbiAgKGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIWlzVmFsaWRFbGVtZW50KGNoaWxkcmVuKSkge1xuICAgICAge1xuICAgICAgICB0aHJvdyBSZWFjdEVycm9yKEVycm9yKCdSZWFjdC5DaGlsZHJlbi5vbmx5IGV4cGVjdGVkIHRvIHJlY2VpdmUgYSBzaW5nbGUgUmVhY3QgZWxlbWVudCBjaGlsZC4nKSk7XG4gICAgICB9XG4gICAgfVxuICB9KSgpO1xuICByZXR1cm4gY2hpbGRyZW47XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUNvbnRleHQoZGVmYXVsdFZhbHVlLCBjYWxjdWxhdGVDaGFuZ2VkQml0cykge1xuICBpZiAoY2FsY3VsYXRlQ2hhbmdlZEJpdHMgPT09IHVuZGVmaW5lZCkge1xuICAgIGNhbGN1bGF0ZUNoYW5nZWRCaXRzID0gbnVsbDtcbiAgfSBlbHNlIHtcbiAgICB7XG4gICAgICAhKGNhbGN1bGF0ZUNoYW5nZWRCaXRzID09PSBudWxsIHx8IHR5cGVvZiBjYWxjdWxhdGVDaGFuZ2VkQml0cyA9PT0gJ2Z1bmN0aW9uJykgPyB3YXJuaW5nV2l0aG91dFN0YWNrJDEoZmFsc2UsICdjcmVhdGVDb250ZXh0OiBFeHBlY3RlZCB0aGUgb3B0aW9uYWwgc2Vjb25kIGFyZ3VtZW50IHRvIGJlIGEgJyArICdmdW5jdGlvbi4gSW5zdGVhZCByZWNlaXZlZDogJXMnLCBjYWxjdWxhdGVDaGFuZ2VkQml0cykgOiB2b2lkIDA7XG4gICAgfVxuICB9XG5cbiAgdmFyIGNvbnRleHQgPSB7XG4gICAgJCR0eXBlb2Y6IFJFQUNUX0NPTlRFWFRfVFlQRSxcbiAgICBfY2FsY3VsYXRlQ2hhbmdlZEJpdHM6IGNhbGN1bGF0ZUNoYW5nZWRCaXRzLFxuICAgIC8vIEFzIGEgd29ya2Fyb3VuZCB0byBzdXBwb3J0IG11bHRpcGxlIGNvbmN1cnJlbnQgcmVuZGVyZXJzLCB3ZSBjYXRlZ29yaXplXG4gICAgLy8gc29tZSByZW5kZXJlcnMgYXMgcHJpbWFyeSBhbmQgb3RoZXJzIGFzIHNlY29uZGFyeS4gV2Ugb25seSBleHBlY3RcbiAgICAvLyB0aGVyZSB0byBiZSB0d28gY29uY3VycmVudCByZW5kZXJlcnMgYXQgbW9zdDogUmVhY3QgTmF0aXZlIChwcmltYXJ5KSBhbmRcbiAgICAvLyBGYWJyaWMgKHNlY29uZGFyeSk7IFJlYWN0IERPTSAocHJpbWFyeSkgYW5kIFJlYWN0IEFSVCAoc2Vjb25kYXJ5KS5cbiAgICAvLyBTZWNvbmRhcnkgcmVuZGVyZXJzIHN0b3JlIHRoZWlyIGNvbnRleHQgdmFsdWVzIG9uIHNlcGFyYXRlIGZpZWxkcy5cbiAgICBfY3VycmVudFZhbHVlOiBkZWZhdWx0VmFsdWUsXG4gICAgX2N1cnJlbnRWYWx1ZTI6IGRlZmF1bHRWYWx1ZSxcbiAgICAvLyBVc2VkIHRvIHRyYWNrIGhvdyBtYW55IGNvbmN1cnJlbnQgcmVuZGVyZXJzIHRoaXMgY29udGV4dCBjdXJyZW50bHlcbiAgICAvLyBzdXBwb3J0cyB3aXRoaW4gaW4gYSBzaW5nbGUgcmVuZGVyZXIuIFN1Y2ggYXMgcGFyYWxsZWwgc2VydmVyIHJlbmRlcmluZy5cbiAgICBfdGhyZWFkQ291bnQ6IDAsXG4gICAgLy8gVGhlc2UgYXJlIGNpcmN1bGFyXG4gICAgUHJvdmlkZXI6IG51bGwsXG4gICAgQ29uc3VtZXI6IG51bGxcbiAgfTtcblxuICBjb250ZXh0LlByb3ZpZGVyID0ge1xuICAgICQkdHlwZW9mOiBSRUFDVF9QUk9WSURFUl9UWVBFLFxuICAgIF9jb250ZXh0OiBjb250ZXh0XG4gIH07XG5cbiAgdmFyIGhhc1dhcm5lZEFib3V0VXNpbmdOZXN0ZWRDb250ZXh0Q29uc3VtZXJzID0gZmFsc2U7XG4gIHZhciBoYXNXYXJuZWRBYm91dFVzaW5nQ29uc3VtZXJQcm92aWRlciA9IGZhbHNlO1xuXG4gIHtcbiAgICAvLyBBIHNlcGFyYXRlIG9iamVjdCwgYnV0IHByb3hpZXMgYmFjayB0byB0aGUgb3JpZ2luYWwgY29udGV4dCBvYmplY3QgZm9yXG4gICAgLy8gYmFja3dhcmRzIGNvbXBhdGliaWxpdHkuIEl0IGhhcyBhIGRpZmZlcmVudCAkJHR5cGVvZiwgc28gd2UgY2FuIHByb3Blcmx5XG4gICAgLy8gd2FybiBmb3IgdGhlIGluY29ycmVjdCB1c2FnZSBvZiBDb250ZXh0IGFzIGEgQ29uc3VtZXIuXG4gICAgdmFyIENvbnN1bWVyID0ge1xuICAgICAgJCR0eXBlb2Y6IFJFQUNUX0NPTlRFWFRfVFlQRSxcbiAgICAgIF9jb250ZXh0OiBjb250ZXh0LFxuICAgICAgX2NhbGN1bGF0ZUNoYW5nZWRCaXRzOiBjb250ZXh0Ll9jYWxjdWxhdGVDaGFuZ2VkQml0c1xuICAgIH07XG4gICAgLy8gJEZsb3dGaXhNZTogRmxvdyBjb21wbGFpbnMgYWJvdXQgbm90IHNldHRpbmcgYSB2YWx1ZSwgd2hpY2ggaXMgaW50ZW50aW9uYWwgaGVyZVxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKENvbnN1bWVyLCB7XG4gICAgICBQcm92aWRlcjoge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBpZiAoIWhhc1dhcm5lZEFib3V0VXNpbmdDb25zdW1lclByb3ZpZGVyKSB7XG4gICAgICAgICAgICBoYXNXYXJuZWRBYm91dFVzaW5nQ29uc3VtZXJQcm92aWRlciA9IHRydWU7XG4gICAgICAgICAgICB3YXJuaW5nJDEoZmFsc2UsICdSZW5kZXJpbmcgPENvbnRleHQuQ29uc3VtZXIuUHJvdmlkZXI+IGlzIG5vdCBzdXBwb3J0ZWQgYW5kIHdpbGwgYmUgcmVtb3ZlZCBpbiAnICsgJ2EgZnV0dXJlIG1ham9yIHJlbGVhc2UuIERpZCB5b3UgbWVhbiB0byByZW5kZXIgPENvbnRleHQuUHJvdmlkZXI+IGluc3RlYWQ/Jyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBjb250ZXh0LlByb3ZpZGVyO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uIChfUHJvdmlkZXIpIHtcbiAgICAgICAgICBjb250ZXh0LlByb3ZpZGVyID0gX1Byb3ZpZGVyO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgX2N1cnJlbnRWYWx1ZToge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICByZXR1cm4gY29udGV4dC5fY3VycmVudFZhbHVlO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uIChfY3VycmVudFZhbHVlKSB7XG4gICAgICAgICAgY29udGV4dC5fY3VycmVudFZhbHVlID0gX2N1cnJlbnRWYWx1ZTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIF9jdXJyZW50VmFsdWUyOiB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHJldHVybiBjb250ZXh0Ll9jdXJyZW50VmFsdWUyO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uIChfY3VycmVudFZhbHVlMikge1xuICAgICAgICAgIGNvbnRleHQuX2N1cnJlbnRWYWx1ZTIgPSBfY3VycmVudFZhbHVlMjtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIF90aHJlYWRDb3VudDoge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICByZXR1cm4gY29udGV4dC5fdGhyZWFkQ291bnQ7XG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24gKF90aHJlYWRDb3VudCkge1xuICAgICAgICAgIGNvbnRleHQuX3RocmVhZENvdW50ID0gX3RocmVhZENvdW50O1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgQ29uc3VtZXI6IHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgaWYgKCFoYXNXYXJuZWRBYm91dFVzaW5nTmVzdGVkQ29udGV4dENvbnN1bWVycykge1xuICAgICAgICAgICAgaGFzV2FybmVkQWJvdXRVc2luZ05lc3RlZENvbnRleHRDb25zdW1lcnMgPSB0cnVlO1xuICAgICAgICAgICAgd2FybmluZyQxKGZhbHNlLCAnUmVuZGVyaW5nIDxDb250ZXh0LkNvbnN1bWVyLkNvbnN1bWVyPiBpcyBub3Qgc3VwcG9ydGVkIGFuZCB3aWxsIGJlIHJlbW92ZWQgaW4gJyArICdhIGZ1dHVyZSBtYWpvciByZWxlYXNlLiBEaWQgeW91IG1lYW4gdG8gcmVuZGVyIDxDb250ZXh0LkNvbnN1bWVyPiBpbnN0ZWFkPycpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gY29udGV4dC5Db25zdW1lcjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICAgIC8vICRGbG93Rml4TWU6IEZsb3cgY29tcGxhaW5zIGFib3V0IG1pc3NpbmcgcHJvcGVydGllcyBiZWNhdXNlIGl0IGRvZXNuJ3QgdW5kZXJzdGFuZCBkZWZpbmVQcm9wZXJ0eVxuICAgIGNvbnRleHQuQ29uc3VtZXIgPSBDb25zdW1lcjtcbiAgfVxuXG4gIHtcbiAgICBjb250ZXh0Ll9jdXJyZW50UmVuZGVyZXIgPSBudWxsO1xuICAgIGNvbnRleHQuX2N1cnJlbnRSZW5kZXJlcjIgPSBudWxsO1xuICB9XG5cbiAgcmV0dXJuIGNvbnRleHQ7XG59XG5cbmZ1bmN0aW9uIGxhenkoY3Rvcikge1xuICB2YXIgbGF6eVR5cGUgPSB7XG4gICAgJCR0eXBlb2Y6IFJFQUNUX0xBWllfVFlQRSxcbiAgICBfY3RvcjogY3RvcixcbiAgICAvLyBSZWFjdCB1c2VzIHRoZXNlIGZpZWxkcyB0byBzdG9yZSB0aGUgcmVzdWx0LlxuICAgIF9zdGF0dXM6IC0xLFxuICAgIF9yZXN1bHQ6IG51bGxcbiAgfTtcblxuICB7XG4gICAgLy8gSW4gcHJvZHVjdGlvbiwgdGhpcyB3b3VsZCBqdXN0IHNldCBpdCBvbiB0aGUgb2JqZWN0LlxuICAgIHZhciBkZWZhdWx0UHJvcHMgPSB2b2lkIDA7XG4gICAgdmFyIHByb3BUeXBlcyA9IHZvaWQgMDtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyhsYXp5VHlwZSwge1xuICAgICAgZGVmYXVsdFByb3BzOiB7XG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcmV0dXJuIGRlZmF1bHRQcm9wcztcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAobmV3RGVmYXVsdFByb3BzKSB7XG4gICAgICAgICAgd2FybmluZyQxKGZhbHNlLCAnUmVhY3QubGF6eSguLi4pOiBJdCBpcyBub3Qgc3VwcG9ydGVkIHRvIGFzc2lnbiBgZGVmYXVsdFByb3BzYCB0byAnICsgJ2EgbGF6eSBjb21wb25lbnQgaW1wb3J0LiBFaXRoZXIgc3BlY2lmeSB0aGVtIHdoZXJlIHRoZSBjb21wb25lbnQgJyArICdpcyBkZWZpbmVkLCBvciBjcmVhdGUgYSB3cmFwcGluZyBjb21wb25lbnQgYXJvdW5kIGl0LicpO1xuICAgICAgICAgIGRlZmF1bHRQcm9wcyA9IG5ld0RlZmF1bHRQcm9wcztcbiAgICAgICAgICAvLyBNYXRjaCBwcm9kdWN0aW9uIGJlaGF2aW9yIG1vcmUgY2xvc2VseTpcbiAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobGF6eVR5cGUsICdkZWZhdWx0UHJvcHMnLCB7XG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBwcm9wVHlwZXM6IHtcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICByZXR1cm4gcHJvcFR5cGVzO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uIChuZXdQcm9wVHlwZXMpIHtcbiAgICAgICAgICB3YXJuaW5nJDEoZmFsc2UsICdSZWFjdC5sYXp5KC4uLik6IEl0IGlzIG5vdCBzdXBwb3J0ZWQgdG8gYXNzaWduIGBwcm9wVHlwZXNgIHRvICcgKyAnYSBsYXp5IGNvbXBvbmVudCBpbXBvcnQuIEVpdGhlciBzcGVjaWZ5IHRoZW0gd2hlcmUgdGhlIGNvbXBvbmVudCAnICsgJ2lzIGRlZmluZWQsIG9yIGNyZWF0ZSBhIHdyYXBwaW5nIGNvbXBvbmVudCBhcm91bmQgaXQuJyk7XG4gICAgICAgICAgcHJvcFR5cGVzID0gbmV3UHJvcFR5cGVzO1xuICAgICAgICAgIC8vIE1hdGNoIHByb2R1Y3Rpb24gYmVoYXZpb3IgbW9yZSBjbG9zZWx5OlxuICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShsYXp5VHlwZSwgJ3Byb3BUeXBlcycsIHtcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIGxhenlUeXBlO1xufVxuXG5mdW5jdGlvbiBmb3J3YXJkUmVmKHJlbmRlcikge1xuICB7XG4gICAgaWYgKHJlbmRlciAhPSBudWxsICYmIHJlbmRlci4kJHR5cGVvZiA9PT0gUkVBQ1RfTUVNT19UWVBFKSB7XG4gICAgICB3YXJuaW5nV2l0aG91dFN0YWNrJDEoZmFsc2UsICdmb3J3YXJkUmVmIHJlcXVpcmVzIGEgcmVuZGVyIGZ1bmN0aW9uIGJ1dCByZWNlaXZlZCBhIGBtZW1vYCAnICsgJ2NvbXBvbmVudC4gSW5zdGVhZCBvZiBmb3J3YXJkUmVmKG1lbW8oLi4uKSksIHVzZSAnICsgJ21lbW8oZm9yd2FyZFJlZiguLi4pKS4nKTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiByZW5kZXIgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHdhcm5pbmdXaXRob3V0U3RhY2skMShmYWxzZSwgJ2ZvcndhcmRSZWYgcmVxdWlyZXMgYSByZW5kZXIgZnVuY3Rpb24gYnV0IHdhcyBnaXZlbiAlcy4nLCByZW5kZXIgPT09IG51bGwgPyAnbnVsbCcgOiB0eXBlb2YgcmVuZGVyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgIShcbiAgICAgIC8vIERvIG5vdCB3YXJuIGZvciAwIGFyZ3VtZW50cyBiZWNhdXNlIGl0IGNvdWxkIGJlIGR1ZSB0byB1c2FnZSBvZiB0aGUgJ2FyZ3VtZW50cycgb2JqZWN0XG4gICAgICByZW5kZXIubGVuZ3RoID09PSAwIHx8IHJlbmRlci5sZW5ndGggPT09IDIpID8gd2FybmluZ1dpdGhvdXRTdGFjayQxKGZhbHNlLCAnZm9yd2FyZFJlZiByZW5kZXIgZnVuY3Rpb25zIGFjY2VwdCBleGFjdGx5IHR3byBwYXJhbWV0ZXJzOiBwcm9wcyBhbmQgcmVmLiAlcycsIHJlbmRlci5sZW5ndGggPT09IDEgPyAnRGlkIHlvdSBmb3JnZXQgdG8gdXNlIHRoZSByZWYgcGFyYW1ldGVyPycgOiAnQW55IGFkZGl0aW9uYWwgcGFyYW1ldGVyIHdpbGwgYmUgdW5kZWZpbmVkLicpIDogdm9pZCAwO1xuICAgIH1cblxuICAgIGlmIChyZW5kZXIgIT0gbnVsbCkge1xuICAgICAgIShyZW5kZXIuZGVmYXVsdFByb3BzID09IG51bGwgJiYgcmVuZGVyLnByb3BUeXBlcyA9PSBudWxsKSA/IHdhcm5pbmdXaXRob3V0U3RhY2skMShmYWxzZSwgJ2ZvcndhcmRSZWYgcmVuZGVyIGZ1bmN0aW9ucyBkbyBub3Qgc3VwcG9ydCBwcm9wVHlwZXMgb3IgZGVmYXVsdFByb3BzLiAnICsgJ0RpZCB5b3UgYWNjaWRlbnRhbGx5IHBhc3MgYSBSZWFjdCBjb21wb25lbnQ/JykgOiB2b2lkIDA7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICAkJHR5cGVvZjogUkVBQ1RfRk9SV0FSRF9SRUZfVFlQRSxcbiAgICByZW5kZXI6IHJlbmRlclxuICB9O1xufVxuXG5mdW5jdGlvbiBpc1ZhbGlkRWxlbWVudFR5cGUodHlwZSkge1xuICByZXR1cm4gdHlwZW9mIHR5cGUgPT09ICdzdHJpbmcnIHx8IHR5cGVvZiB0eXBlID09PSAnZnVuY3Rpb24nIHx8XG4gIC8vIE5vdGU6IGl0cyB0eXBlb2YgbWlnaHQgYmUgb3RoZXIgdGhhbiAnc3ltYm9sJyBvciAnbnVtYmVyJyBpZiBpdCdzIGEgcG9seWZpbGwuXG4gIHR5cGUgPT09IFJFQUNUX0ZSQUdNRU5UX1RZUEUgfHwgdHlwZSA9PT0gUkVBQ1RfQ09OQ1VSUkVOVF9NT0RFX1RZUEUgfHwgdHlwZSA9PT0gUkVBQ1RfUFJPRklMRVJfVFlQRSB8fCB0eXBlID09PSBSRUFDVF9TVFJJQ1RfTU9ERV9UWVBFIHx8IHR5cGUgPT09IFJFQUNUX1NVU1BFTlNFX1RZUEUgfHwgdHlwZSA9PT0gUkVBQ1RfU1VTUEVOU0VfTElTVF9UWVBFIHx8IHR5cGVvZiB0eXBlID09PSAnb2JqZWN0JyAmJiB0eXBlICE9PSBudWxsICYmICh0eXBlLiQkdHlwZW9mID09PSBSRUFDVF9MQVpZX1RZUEUgfHwgdHlwZS4kJHR5cGVvZiA9PT0gUkVBQ1RfTUVNT19UWVBFIHx8IHR5cGUuJCR0eXBlb2YgPT09IFJFQUNUX1BST1ZJREVSX1RZUEUgfHwgdHlwZS4kJHR5cGVvZiA9PT0gUkVBQ1RfQ09OVEVYVF9UWVBFIHx8IHR5cGUuJCR0eXBlb2YgPT09IFJFQUNUX0ZPUldBUkRfUkVGX1RZUEUgfHwgdHlwZS4kJHR5cGVvZiA9PT0gUkVBQ1RfRlVOREFNRU5UQUxfVFlQRSB8fCB0eXBlLiQkdHlwZW9mID09PSBSRUFDVF9SRVNQT05ERVJfVFlQRSk7XG59XG5cbmZ1bmN0aW9uIG1lbW8odHlwZSwgY29tcGFyZSkge1xuICB7XG4gICAgaWYgKCFpc1ZhbGlkRWxlbWVudFR5cGUodHlwZSkpIHtcbiAgICAgIHdhcm5pbmdXaXRob3V0U3RhY2skMShmYWxzZSwgJ21lbW86IFRoZSBmaXJzdCBhcmd1bWVudCBtdXN0IGJlIGEgY29tcG9uZW50LiBJbnN0ZWFkICcgKyAncmVjZWl2ZWQ6ICVzJywgdHlwZSA9PT0gbnVsbCA/ICdudWxsJyA6IHR5cGVvZiB0eXBlKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHtcbiAgICAkJHR5cGVvZjogUkVBQ1RfTUVNT19UWVBFLFxuICAgIHR5cGU6IHR5cGUsXG4gICAgY29tcGFyZTogY29tcGFyZSA9PT0gdW5kZWZpbmVkID8gbnVsbCA6IGNvbXBhcmVcbiAgfTtcbn1cblxuZnVuY3Rpb24gcmVzb2x2ZURpc3BhdGNoZXIoKSB7XG4gIHZhciBkaXNwYXRjaGVyID0gUmVhY3RDdXJyZW50RGlzcGF0Y2hlci5jdXJyZW50O1xuICAoZnVuY3Rpb24gKCkge1xuICAgIGlmICghKGRpc3BhdGNoZXIgIT09IG51bGwpKSB7XG4gICAgICB7XG4gICAgICAgIHRocm93IFJlYWN0RXJyb3IoRXJyb3IoJ0ludmFsaWQgaG9vayBjYWxsLiBIb29rcyBjYW4gb25seSBiZSBjYWxsZWQgaW5zaWRlIG9mIHRoZSBib2R5IG9mIGEgZnVuY3Rpb24gY29tcG9uZW50LiBUaGlzIGNvdWxkIGhhcHBlbiBmb3Igb25lIG9mIHRoZSBmb2xsb3dpbmcgcmVhc29uczpcXG4xLiBZb3UgbWlnaHQgaGF2ZSBtaXNtYXRjaGluZyB2ZXJzaW9ucyBvZiBSZWFjdCBhbmQgdGhlIHJlbmRlcmVyIChzdWNoIGFzIFJlYWN0IERPTSlcXG4yLiBZb3UgbWlnaHQgYmUgYnJlYWtpbmcgdGhlIFJ1bGVzIG9mIEhvb2tzXFxuMy4gWW91IG1pZ2h0IGhhdmUgbW9yZSB0aGFuIG9uZSBjb3B5IG9mIFJlYWN0IGluIHRoZSBzYW1lIGFwcFxcblNlZSBodHRwczovL2ZiLm1lL3JlYWN0LWludmFsaWQtaG9vay1jYWxsIGZvciB0aXBzIGFib3V0IGhvdyB0byBkZWJ1ZyBhbmQgZml4IHRoaXMgcHJvYmxlbS4nKSk7XG4gICAgICB9XG4gICAgfVxuICB9KSgpO1xuICByZXR1cm4gZGlzcGF0Y2hlcjtcbn1cblxuZnVuY3Rpb24gdXNlQ29udGV4dChDb250ZXh0LCB1bnN0YWJsZV9vYnNlcnZlZEJpdHMpIHtcbiAgdmFyIGRpc3BhdGNoZXIgPSByZXNvbHZlRGlzcGF0Y2hlcigpO1xuICB7XG4gICAgISh1bnN0YWJsZV9vYnNlcnZlZEJpdHMgPT09IHVuZGVmaW5lZCkgPyB3YXJuaW5nJDEoZmFsc2UsICd1c2VDb250ZXh0KCkgc2Vjb25kIGFyZ3VtZW50IGlzIHJlc2VydmVkIGZvciBmdXR1cmUgJyArICd1c2UgaW4gUmVhY3QuIFBhc3NpbmcgaXQgaXMgbm90IHN1cHBvcnRlZC4gJyArICdZb3UgcGFzc2VkOiAlcy4lcycsIHVuc3RhYmxlX29ic2VydmVkQml0cywgdHlwZW9mIHVuc3RhYmxlX29ic2VydmVkQml0cyA9PT0gJ251bWJlcicgJiYgQXJyYXkuaXNBcnJheShhcmd1bWVudHNbMl0pID8gJ1xcblxcbkRpZCB5b3UgY2FsbCBhcnJheS5tYXAodXNlQ29udGV4dCk/ICcgKyAnQ2FsbGluZyBIb29rcyBpbnNpZGUgYSBsb29wIGlzIG5vdCBzdXBwb3J0ZWQuICcgKyAnTGVhcm4gbW9yZSBhdCBodHRwczovL2ZiLm1lL3J1bGVzLW9mLWhvb2tzJyA6ICcnKSA6IHZvaWQgMDtcblxuICAgIC8vIFRPRE86IGFkZCBhIG1vcmUgZ2VuZXJpYyB3YXJuaW5nIGZvciBpbnZhbGlkIHZhbHVlcy5cbiAgICBpZiAoQ29udGV4dC5fY29udGV4dCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB2YXIgcmVhbENvbnRleHQgPSBDb250ZXh0Ll9jb250ZXh0O1xuICAgICAgLy8gRG9uJ3QgZGVkdXBsaWNhdGUgYmVjYXVzZSB0aGlzIGxlZ2l0aW1hdGVseSBjYXVzZXMgYnVnc1xuICAgICAgLy8gYW5kIG5vYm9keSBzaG91bGQgYmUgdXNpbmcgdGhpcyBpbiBleGlzdGluZyBjb2RlLlxuICAgICAgaWYgKHJlYWxDb250ZXh0LkNvbnN1bWVyID09PSBDb250ZXh0KSB7XG4gICAgICAgIHdhcm5pbmckMShmYWxzZSwgJ0NhbGxpbmcgdXNlQ29udGV4dChDb250ZXh0LkNvbnN1bWVyKSBpcyBub3Qgc3VwcG9ydGVkLCBtYXkgY2F1c2UgYnVncywgYW5kIHdpbGwgYmUgJyArICdyZW1vdmVkIGluIGEgZnV0dXJlIG1ham9yIHJlbGVhc2UuIERpZCB5b3UgbWVhbiB0byBjYWxsIHVzZUNvbnRleHQoQ29udGV4dCkgaW5zdGVhZD8nKTtcbiAgICAgIH0gZWxzZSBpZiAocmVhbENvbnRleHQuUHJvdmlkZXIgPT09IENvbnRleHQpIHtcbiAgICAgICAgd2FybmluZyQxKGZhbHNlLCAnQ2FsbGluZyB1c2VDb250ZXh0KENvbnRleHQuUHJvdmlkZXIpIGlzIG5vdCBzdXBwb3J0ZWQuICcgKyAnRGlkIHlvdSBtZWFuIHRvIGNhbGwgdXNlQ29udGV4dChDb250ZXh0KSBpbnN0ZWFkPycpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gZGlzcGF0Y2hlci51c2VDb250ZXh0KENvbnRleHQsIHVuc3RhYmxlX29ic2VydmVkQml0cyk7XG59XG5cbmZ1bmN0aW9uIHVzZVN0YXRlKGluaXRpYWxTdGF0ZSkge1xuICB2YXIgZGlzcGF0Y2hlciA9IHJlc29sdmVEaXNwYXRjaGVyKCk7XG4gIHJldHVybiBkaXNwYXRjaGVyLnVzZVN0YXRlKGluaXRpYWxTdGF0ZSk7XG59XG5cbmZ1bmN0aW9uIHVzZVJlZHVjZXIocmVkdWNlciwgaW5pdGlhbEFyZywgaW5pdCkge1xuICB2YXIgZGlzcGF0Y2hlciA9IHJlc29sdmVEaXNwYXRjaGVyKCk7XG4gIHJldHVybiBkaXNwYXRjaGVyLnVzZVJlZHVjZXIocmVkdWNlciwgaW5pdGlhbEFyZywgaW5pdCk7XG59XG5cbmZ1bmN0aW9uIHVzZVJlZihpbml0aWFsVmFsdWUpIHtcbiAgdmFyIGRpc3BhdGNoZXIgPSByZXNvbHZlRGlzcGF0Y2hlcigpO1xuICByZXR1cm4gZGlzcGF0Y2hlci51c2VSZWYoaW5pdGlhbFZhbHVlKTtcbn1cblxuZnVuY3Rpb24gdXNlRWZmZWN0KGNyZWF0ZSwgaW5wdXRzKSB7XG4gIHZhciBkaXNwYXRjaGVyID0gcmVzb2x2ZURpc3BhdGNoZXIoKTtcbiAgcmV0dXJuIGRpc3BhdGNoZXIudXNlRWZmZWN0KGNyZWF0ZSwgaW5wdXRzKTtcbn1cblxuZnVuY3Rpb24gdXNlTGF5b3V0RWZmZWN0KGNyZWF0ZSwgaW5wdXRzKSB7XG4gIHZhciBkaXNwYXRjaGVyID0gcmVzb2x2ZURpc3BhdGNoZXIoKTtcbiAgcmV0dXJuIGRpc3BhdGNoZXIudXNlTGF5b3V0RWZmZWN0KGNyZWF0ZSwgaW5wdXRzKTtcbn1cblxuZnVuY3Rpb24gdXNlQ2FsbGJhY2soY2FsbGJhY2ssIGlucHV0cykge1xuICB2YXIgZGlzcGF0Y2hlciA9IHJlc29sdmVEaXNwYXRjaGVyKCk7XG4gIHJldHVybiBkaXNwYXRjaGVyLnVzZUNhbGxiYWNrKGNhbGxiYWNrLCBpbnB1dHMpO1xufVxuXG5mdW5jdGlvbiB1c2VNZW1vKGNyZWF0ZSwgaW5wdXRzKSB7XG4gIHZhciBkaXNwYXRjaGVyID0gcmVzb2x2ZURpc3BhdGNoZXIoKTtcbiAgcmV0dXJuIGRpc3BhdGNoZXIudXNlTWVtbyhjcmVhdGUsIGlucHV0cyk7XG59XG5cbmZ1bmN0aW9uIHVzZUltcGVyYXRpdmVIYW5kbGUocmVmLCBjcmVhdGUsIGlucHV0cykge1xuICB2YXIgZGlzcGF0Y2hlciA9IHJlc29sdmVEaXNwYXRjaGVyKCk7XG4gIHJldHVybiBkaXNwYXRjaGVyLnVzZUltcGVyYXRpdmVIYW5kbGUocmVmLCBjcmVhdGUsIGlucHV0cyk7XG59XG5cbmZ1bmN0aW9uIHVzZURlYnVnVmFsdWUodmFsdWUsIGZvcm1hdHRlckZuKSB7XG4gIHtcbiAgICB2YXIgZGlzcGF0Y2hlciA9IHJlc29sdmVEaXNwYXRjaGVyKCk7XG4gICAgcmV0dXJuIGRpc3BhdGNoZXIudXNlRGVidWdWYWx1ZSh2YWx1ZSwgZm9ybWF0dGVyRm4pO1xuICB9XG59XG5cbnZhciBlbXB0eU9iamVjdCQxID0ge307XG5cbmZ1bmN0aW9uIHVzZVJlc3BvbmRlcihyZXNwb25kZXIsIGxpc3RlbmVyUHJvcHMpIHtcbiAgdmFyIGRpc3BhdGNoZXIgPSByZXNvbHZlRGlzcGF0Y2hlcigpO1xuICB7XG4gICAgaWYgKHJlc3BvbmRlciA9PSBudWxsIHx8IHJlc3BvbmRlci4kJHR5cGVvZiAhPT0gUkVBQ1RfUkVTUE9OREVSX1RZUEUpIHtcbiAgICAgIHdhcm5pbmckMShmYWxzZSwgJ3VzZVJlc3BvbmRlcjogaW52YWxpZCBmaXJzdCBhcmd1bWVudC4gRXhwZWN0ZWQgYW4gZXZlbnQgcmVzcG9uZGVyLCBidXQgaW5zdGVhZCBnb3QgJXMnLCByZXNwb25kZXIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZGlzcGF0Y2hlci51c2VSZXNwb25kZXIocmVzcG9uZGVyLCBsaXN0ZW5lclByb3BzIHx8IGVtcHR5T2JqZWN0JDEpO1xufVxuXG4vLyBXaXRoaW4gdGhlIHNjb3BlIG9mIHRoZSBjYWxsYmFjaywgbWFyayBhbGwgdXBkYXRlcyBhcyBiZWluZyBhbGxvd2VkIHRvIHN1c3BlbmQuXG5mdW5jdGlvbiB3aXRoU3VzcGVuc2VDb25maWcoc2NvcGUsIGNvbmZpZykge1xuICB2YXIgcHJldmlvdXNDb25maWcgPSBSZWFjdEN1cnJlbnRCYXRjaENvbmZpZy5zdXNwZW5zZTtcbiAgUmVhY3RDdXJyZW50QmF0Y2hDb25maWcuc3VzcGVuc2UgPSBjb25maWcgPT09IHVuZGVmaW5lZCA/IG51bGwgOiBjb25maWc7XG4gIHRyeSB7XG4gICAgc2NvcGUoKTtcbiAgfSBmaW5hbGx5IHtcbiAgICBSZWFjdEN1cnJlbnRCYXRjaENvbmZpZy5zdXNwZW5zZSA9IHByZXZpb3VzQ29uZmlnO1xuICB9XG59XG5cbi8qKlxuICogUmVhY3RFbGVtZW50VmFsaWRhdG9yIHByb3ZpZGVzIGEgd3JhcHBlciBhcm91bmQgYSBlbGVtZW50IGZhY3RvcnlcbiAqIHdoaWNoIHZhbGlkYXRlcyB0aGUgcHJvcHMgcGFzc2VkIHRvIHRoZSBlbGVtZW50LiBUaGlzIGlzIGludGVuZGVkIHRvIGJlXG4gKiB1c2VkIG9ubHkgaW4gREVWIGFuZCBjb3VsZCBiZSByZXBsYWNlZCBieSBhIHN0YXRpYyB0eXBlIGNoZWNrZXIgZm9yIGxhbmd1YWdlc1xuICogdGhhdCBzdXBwb3J0IGl0LlxuICovXG5cbnZhciBwcm9wVHlwZXNNaXNzcGVsbFdhcm5pbmdTaG93biA9IHZvaWQgMDtcblxue1xuICBwcm9wVHlwZXNNaXNzcGVsbFdhcm5pbmdTaG93biA9IGZhbHNlO1xufVxuXG5mdW5jdGlvbiBnZXREZWNsYXJhdGlvbkVycm9yQWRkZW5kdW0oKSB7XG4gIGlmIChSZWFjdEN1cnJlbnRPd25lci5jdXJyZW50KSB7XG4gICAgdmFyIG5hbWUgPSBnZXRDb21wb25lbnROYW1lKFJlYWN0Q3VycmVudE93bmVyLmN1cnJlbnQudHlwZSk7XG4gICAgaWYgKG5hbWUpIHtcbiAgICAgIHJldHVybiAnXFxuXFxuQ2hlY2sgdGhlIHJlbmRlciBtZXRob2Qgb2YgYCcgKyBuYW1lICsgJ2AuJztcbiAgICB9XG4gIH1cbiAgcmV0dXJuICcnO1xufVxuXG5mdW5jdGlvbiBnZXRTb3VyY2VJbmZvRXJyb3JBZGRlbmR1bShzb3VyY2UpIHtcbiAgaWYgKHNvdXJjZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgdmFyIGZpbGVOYW1lID0gc291cmNlLmZpbGVOYW1lLnJlcGxhY2UoL14uKltcXFxcXFwvXS8sICcnKTtcbiAgICB2YXIgbGluZU51bWJlciA9IHNvdXJjZS5saW5lTnVtYmVyO1xuICAgIHJldHVybiAnXFxuXFxuQ2hlY2sgeW91ciBjb2RlIGF0ICcgKyBmaWxlTmFtZSArICc6JyArIGxpbmVOdW1iZXIgKyAnLic7XG4gIH1cbiAgcmV0dXJuICcnO1xufVxuXG5mdW5jdGlvbiBnZXRTb3VyY2VJbmZvRXJyb3JBZGRlbmR1bUZvclByb3BzKGVsZW1lbnRQcm9wcykge1xuICBpZiAoZWxlbWVudFByb3BzICE9PSBudWxsICYmIGVsZW1lbnRQcm9wcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIGdldFNvdXJjZUluZm9FcnJvckFkZGVuZHVtKGVsZW1lbnRQcm9wcy5fX3NvdXJjZSk7XG4gIH1cbiAgcmV0dXJuICcnO1xufVxuXG4vKipcbiAqIFdhcm4gaWYgdGhlcmUncyBubyBrZXkgZXhwbGljaXRseSBzZXQgb24gZHluYW1pYyBhcnJheXMgb2YgY2hpbGRyZW4gb3JcbiAqIG9iamVjdCBrZXlzIGFyZSBub3QgdmFsaWQuIFRoaXMgYWxsb3dzIHVzIHRvIGtlZXAgdHJhY2sgb2YgY2hpbGRyZW4gYmV0d2VlblxuICogdXBkYXRlcy5cbiAqL1xudmFyIG93bmVySGFzS2V5VXNlV2FybmluZyA9IHt9O1xuXG5mdW5jdGlvbiBnZXRDdXJyZW50Q29tcG9uZW50RXJyb3JJbmZvKHBhcmVudFR5cGUpIHtcbiAgdmFyIGluZm8gPSBnZXREZWNsYXJhdGlvbkVycm9yQWRkZW5kdW0oKTtcblxuICBpZiAoIWluZm8pIHtcbiAgICB2YXIgcGFyZW50TmFtZSA9IHR5cGVvZiBwYXJlbnRUeXBlID09PSAnc3RyaW5nJyA/IHBhcmVudFR5cGUgOiBwYXJlbnRUeXBlLmRpc3BsYXlOYW1lIHx8IHBhcmVudFR5cGUubmFtZTtcbiAgICBpZiAocGFyZW50TmFtZSkge1xuICAgICAgaW5mbyA9ICdcXG5cXG5DaGVjayB0aGUgdG9wLWxldmVsIHJlbmRlciBjYWxsIHVzaW5nIDwnICsgcGFyZW50TmFtZSArICc+Lic7XG4gICAgfVxuICB9XG4gIHJldHVybiBpbmZvO1xufVxuXG4vKipcbiAqIFdhcm4gaWYgdGhlIGVsZW1lbnQgZG9lc24ndCBoYXZlIGFuIGV4cGxpY2l0IGtleSBhc3NpZ25lZCB0byBpdC5cbiAqIFRoaXMgZWxlbWVudCBpcyBpbiBhbiBhcnJheS4gVGhlIGFycmF5IGNvdWxkIGdyb3cgYW5kIHNocmluayBvciBiZVxuICogcmVvcmRlcmVkLiBBbGwgY2hpbGRyZW4gdGhhdCBoYXZlbid0IGFscmVhZHkgYmVlbiB2YWxpZGF0ZWQgYXJlIHJlcXVpcmVkIHRvXG4gKiBoYXZlIGEgXCJrZXlcIiBwcm9wZXJ0eSBhc3NpZ25lZCB0byBpdC4gRXJyb3Igc3RhdHVzZXMgYXJlIGNhY2hlZCBzbyBhIHdhcm5pbmdcbiAqIHdpbGwgb25seSBiZSBzaG93biBvbmNlLlxuICpcbiAqIEBpbnRlcm5hbFxuICogQHBhcmFtIHtSZWFjdEVsZW1lbnR9IGVsZW1lbnQgRWxlbWVudCB0aGF0IHJlcXVpcmVzIGEga2V5LlxuICogQHBhcmFtIHsqfSBwYXJlbnRUeXBlIGVsZW1lbnQncyBwYXJlbnQncyB0eXBlLlxuICovXG5mdW5jdGlvbiB2YWxpZGF0ZUV4cGxpY2l0S2V5KGVsZW1lbnQsIHBhcmVudFR5cGUpIHtcbiAgaWYgKCFlbGVtZW50Ll9zdG9yZSB8fCBlbGVtZW50Ll9zdG9yZS52YWxpZGF0ZWQgfHwgZWxlbWVudC5rZXkgIT0gbnVsbCkge1xuICAgIHJldHVybjtcbiAgfVxuICBlbGVtZW50Ll9zdG9yZS52YWxpZGF0ZWQgPSB0cnVlO1xuXG4gIHZhciBjdXJyZW50Q29tcG9uZW50RXJyb3JJbmZvID0gZ2V0Q3VycmVudENvbXBvbmVudEVycm9ySW5mbyhwYXJlbnRUeXBlKTtcbiAgaWYgKG93bmVySGFzS2V5VXNlV2FybmluZ1tjdXJyZW50Q29tcG9uZW50RXJyb3JJbmZvXSkge1xuICAgIHJldHVybjtcbiAgfVxuICBvd25lckhhc0tleVVzZVdhcm5pbmdbY3VycmVudENvbXBvbmVudEVycm9ySW5mb10gPSB0cnVlO1xuXG4gIC8vIFVzdWFsbHkgdGhlIGN1cnJlbnQgb3duZXIgaXMgdGhlIG9mZmVuZGVyLCBidXQgaWYgaXQgYWNjZXB0cyBjaGlsZHJlbiBhcyBhXG4gIC8vIHByb3BlcnR5LCBpdCBtYXkgYmUgdGhlIGNyZWF0b3Igb2YgdGhlIGNoaWxkIHRoYXQncyByZXNwb25zaWJsZSBmb3JcbiAgLy8gYXNzaWduaW5nIGl0IGEga2V5LlxuICB2YXIgY2hpbGRPd25lciA9ICcnO1xuICBpZiAoZWxlbWVudCAmJiBlbGVtZW50Ll9vd25lciAmJiBlbGVtZW50Ll9vd25lciAhPT0gUmVhY3RDdXJyZW50T3duZXIuY3VycmVudCkge1xuICAgIC8vIEdpdmUgdGhlIGNvbXBvbmVudCB0aGF0IG9yaWdpbmFsbHkgY3JlYXRlZCB0aGlzIGNoaWxkLlxuICAgIGNoaWxkT3duZXIgPSAnIEl0IHdhcyBwYXNzZWQgYSBjaGlsZCBmcm9tICcgKyBnZXRDb21wb25lbnROYW1lKGVsZW1lbnQuX293bmVyLnR5cGUpICsgJy4nO1xuICB9XG5cbiAgc2V0Q3VycmVudGx5VmFsaWRhdGluZ0VsZW1lbnQoZWxlbWVudCk7XG4gIHtcbiAgICB3YXJuaW5nJDEoZmFsc2UsICdFYWNoIGNoaWxkIGluIGEgbGlzdCBzaG91bGQgaGF2ZSBhIHVuaXF1ZSBcImtleVwiIHByb3AuJyArICclcyVzIFNlZSBodHRwczovL2ZiLm1lL3JlYWN0LXdhcm5pbmcta2V5cyBmb3IgbW9yZSBpbmZvcm1hdGlvbi4nLCBjdXJyZW50Q29tcG9uZW50RXJyb3JJbmZvLCBjaGlsZE93bmVyKTtcbiAgfVxuICBzZXRDdXJyZW50bHlWYWxpZGF0aW5nRWxlbWVudChudWxsKTtcbn1cblxuLyoqXG4gKiBFbnN1cmUgdGhhdCBldmVyeSBlbGVtZW50IGVpdGhlciBpcyBwYXNzZWQgaW4gYSBzdGF0aWMgbG9jYXRpb24sIGluIGFuXG4gKiBhcnJheSB3aXRoIGFuIGV4cGxpY2l0IGtleXMgcHJvcGVydHkgZGVmaW5lZCwgb3IgaW4gYW4gb2JqZWN0IGxpdGVyYWxcbiAqIHdpdGggdmFsaWQga2V5IHByb3BlcnR5LlxuICpcbiAqIEBpbnRlcm5hbFxuICogQHBhcmFtIHtSZWFjdE5vZGV9IG5vZGUgU3RhdGljYWxseSBwYXNzZWQgY2hpbGQgb2YgYW55IHR5cGUuXG4gKiBAcGFyYW0geyp9IHBhcmVudFR5cGUgbm9kZSdzIHBhcmVudCdzIHR5cGUuXG4gKi9cbmZ1bmN0aW9uIHZhbGlkYXRlQ2hpbGRLZXlzKG5vZGUsIHBhcmVudFR5cGUpIHtcbiAgaWYgKHR5cGVvZiBub2RlICE9PSAnb2JqZWN0Jykge1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAoQXJyYXkuaXNBcnJheShub2RlKSkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZS5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGNoaWxkID0gbm9kZVtpXTtcbiAgICAgIGlmIChpc1ZhbGlkRWxlbWVudChjaGlsZCkpIHtcbiAgICAgICAgdmFsaWRhdGVFeHBsaWNpdEtleShjaGlsZCwgcGFyZW50VHlwZSk7XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2UgaWYgKGlzVmFsaWRFbGVtZW50KG5vZGUpKSB7XG4gICAgLy8gVGhpcyBlbGVtZW50IHdhcyBwYXNzZWQgaW4gYSB2YWxpZCBsb2NhdGlvbi5cbiAgICBpZiAobm9kZS5fc3RvcmUpIHtcbiAgICAgIG5vZGUuX3N0b3JlLnZhbGlkYXRlZCA9IHRydWU7XG4gICAgfVxuICB9IGVsc2UgaWYgKG5vZGUpIHtcbiAgICB2YXIgaXRlcmF0b3JGbiA9IGdldEl0ZXJhdG9yRm4obm9kZSk7XG4gICAgaWYgKHR5cGVvZiBpdGVyYXRvckZuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAvLyBFbnRyeSBpdGVyYXRvcnMgdXNlZCB0byBwcm92aWRlIGltcGxpY2l0IGtleXMsXG4gICAgICAvLyBidXQgbm93IHdlIHByaW50IGEgc2VwYXJhdGUgd2FybmluZyBmb3IgdGhlbSBsYXRlci5cbiAgICAgIGlmIChpdGVyYXRvckZuICE9PSBub2RlLmVudHJpZXMpIHtcbiAgICAgICAgdmFyIGl0ZXJhdG9yID0gaXRlcmF0b3JGbi5jYWxsKG5vZGUpO1xuICAgICAgICB2YXIgc3RlcCA9IHZvaWQgMDtcbiAgICAgICAgd2hpbGUgKCEoc3RlcCA9IGl0ZXJhdG9yLm5leHQoKSkuZG9uZSkge1xuICAgICAgICAgIGlmIChpc1ZhbGlkRWxlbWVudChzdGVwLnZhbHVlKSkge1xuICAgICAgICAgICAgdmFsaWRhdGVFeHBsaWNpdEtleShzdGVwLnZhbHVlLCBwYXJlbnRUeXBlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBHaXZlbiBhbiBlbGVtZW50LCB2YWxpZGF0ZSB0aGF0IGl0cyBwcm9wcyBmb2xsb3cgdGhlIHByb3BUeXBlcyBkZWZpbml0aW9uLFxuICogcHJvdmlkZWQgYnkgdGhlIHR5cGUuXG4gKlxuICogQHBhcmFtIHtSZWFjdEVsZW1lbnR9IGVsZW1lbnRcbiAqL1xuZnVuY3Rpb24gdmFsaWRhdGVQcm9wVHlwZXMoZWxlbWVudCkge1xuICB2YXIgdHlwZSA9IGVsZW1lbnQudHlwZTtcbiAgaWYgKHR5cGUgPT09IG51bGwgfHwgdHlwZSA9PT0gdW5kZWZpbmVkIHx8IHR5cGVvZiB0eXBlID09PSAnc3RyaW5nJykge1xuICAgIHJldHVybjtcbiAgfVxuICB2YXIgbmFtZSA9IGdldENvbXBvbmVudE5hbWUodHlwZSk7XG4gIHZhciBwcm9wVHlwZXMgPSB2b2lkIDA7XG4gIGlmICh0eXBlb2YgdHlwZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHByb3BUeXBlcyA9IHR5cGUucHJvcFR5cGVzO1xuICB9IGVsc2UgaWYgKHR5cGVvZiB0eXBlID09PSAnb2JqZWN0JyAmJiAodHlwZS4kJHR5cGVvZiA9PT0gUkVBQ1RfRk9SV0FSRF9SRUZfVFlQRSB8fFxuICAvLyBOb3RlOiBNZW1vIG9ubHkgY2hlY2tzIG91dGVyIHByb3BzIGhlcmUuXG4gIC8vIElubmVyIHByb3BzIGFyZSBjaGVja2VkIGluIHRoZSByZWNvbmNpbGVyLlxuICB0eXBlLiQkdHlwZW9mID09PSBSRUFDVF9NRU1PX1RZUEUpKSB7XG4gICAgcHJvcFR5cGVzID0gdHlwZS5wcm9wVHlwZXM7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmIChwcm9wVHlwZXMpIHtcbiAgICBzZXRDdXJyZW50bHlWYWxpZGF0aW5nRWxlbWVudChlbGVtZW50KTtcbiAgICBjaGVja1Byb3BUeXBlcyhwcm9wVHlwZXMsIGVsZW1lbnQucHJvcHMsICdwcm9wJywgbmFtZSwgUmVhY3REZWJ1Z0N1cnJlbnRGcmFtZS5nZXRTdGFja0FkZGVuZHVtKTtcbiAgICBzZXRDdXJyZW50bHlWYWxpZGF0aW5nRWxlbWVudChudWxsKTtcbiAgfSBlbHNlIGlmICh0eXBlLlByb3BUeXBlcyAhPT0gdW5kZWZpbmVkICYmICFwcm9wVHlwZXNNaXNzcGVsbFdhcm5pbmdTaG93bikge1xuICAgIHByb3BUeXBlc01pc3NwZWxsV2FybmluZ1Nob3duID0gdHJ1ZTtcbiAgICB3YXJuaW5nV2l0aG91dFN0YWNrJDEoZmFsc2UsICdDb21wb25lbnQgJXMgZGVjbGFyZWQgYFByb3BUeXBlc2AgaW5zdGVhZCBvZiBgcHJvcFR5cGVzYC4gRGlkIHlvdSBtaXNzcGVsbCB0aGUgcHJvcGVydHkgYXNzaWdubWVudD8nLCBuYW1lIHx8ICdVbmtub3duJyk7XG4gIH1cbiAgaWYgKHR5cGVvZiB0eXBlLmdldERlZmF1bHRQcm9wcyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICF0eXBlLmdldERlZmF1bHRQcm9wcy5pc1JlYWN0Q2xhc3NBcHByb3ZlZCA/IHdhcm5pbmdXaXRob3V0U3RhY2skMShmYWxzZSwgJ2dldERlZmF1bHRQcm9wcyBpcyBvbmx5IHVzZWQgb24gY2xhc3NpYyBSZWFjdC5jcmVhdGVDbGFzcyAnICsgJ2RlZmluaXRpb25zLiBVc2UgYSBzdGF0aWMgcHJvcGVydHkgbmFtZWQgYGRlZmF1bHRQcm9wc2AgaW5zdGVhZC4nKSA6IHZvaWQgMDtcbiAgfVxufVxuXG4vKipcbiAqIEdpdmVuIGEgZnJhZ21lbnQsIHZhbGlkYXRlIHRoYXQgaXQgY2FuIG9ubHkgYmUgcHJvdmlkZWQgd2l0aCBmcmFnbWVudCBwcm9wc1xuICogQHBhcmFtIHtSZWFjdEVsZW1lbnR9IGZyYWdtZW50XG4gKi9cbmZ1bmN0aW9uIHZhbGlkYXRlRnJhZ21lbnRQcm9wcyhmcmFnbWVudCkge1xuICBzZXRDdXJyZW50bHlWYWxpZGF0aW5nRWxlbWVudChmcmFnbWVudCk7XG5cbiAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhmcmFnbWVudC5wcm9wcyk7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBrZXkgPSBrZXlzW2ldO1xuICAgIGlmIChrZXkgIT09ICdjaGlsZHJlbicgJiYga2V5ICE9PSAna2V5Jykge1xuICAgICAgd2FybmluZyQxKGZhbHNlLCAnSW52YWxpZCBwcm9wIGAlc2Agc3VwcGxpZWQgdG8gYFJlYWN0LkZyYWdtZW50YC4gJyArICdSZWFjdC5GcmFnbWVudCBjYW4gb25seSBoYXZlIGBrZXlgIGFuZCBgY2hpbGRyZW5gIHByb3BzLicsIGtleSk7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBpZiAoZnJhZ21lbnQucmVmICE9PSBudWxsKSB7XG4gICAgd2FybmluZyQxKGZhbHNlLCAnSW52YWxpZCBhdHRyaWJ1dGUgYHJlZmAgc3VwcGxpZWQgdG8gYFJlYWN0LkZyYWdtZW50YC4nKTtcbiAgfVxuXG4gIHNldEN1cnJlbnRseVZhbGlkYXRpbmdFbGVtZW50KG51bGwpO1xufVxuXG5mdW5jdGlvbiBqc3hXaXRoVmFsaWRhdGlvbih0eXBlLCBwcm9wcywga2V5LCBpc1N0YXRpY0NoaWxkcmVuLCBzb3VyY2UsIHNlbGYpIHtcbiAgdmFyIHZhbGlkVHlwZSA9IGlzVmFsaWRFbGVtZW50VHlwZSh0eXBlKTtcblxuICAvLyBXZSB3YXJuIGluIHRoaXMgY2FzZSBidXQgZG9uJ3QgdGhyb3cuIFdlIGV4cGVjdCB0aGUgZWxlbWVudCBjcmVhdGlvbiB0b1xuICAvLyBzdWNjZWVkIGFuZCB0aGVyZSB3aWxsIGxpa2VseSBiZSBlcnJvcnMgaW4gcmVuZGVyLlxuICBpZiAoIXZhbGlkVHlwZSkge1xuICAgIHZhciBpbmZvID0gJyc7XG4gICAgaWYgKHR5cGUgPT09IHVuZGVmaW5lZCB8fCB0eXBlb2YgdHlwZSA9PT0gJ29iamVjdCcgJiYgdHlwZSAhPT0gbnVsbCAmJiBPYmplY3Qua2V5cyh0eXBlKS5sZW5ndGggPT09IDApIHtcbiAgICAgIGluZm8gKz0gJyBZb3UgbGlrZWx5IGZvcmdvdCB0byBleHBvcnQgeW91ciBjb21wb25lbnQgZnJvbSB0aGUgZmlsZSAnICsgXCJpdCdzIGRlZmluZWQgaW4sIG9yIHlvdSBtaWdodCBoYXZlIG1peGVkIHVwIGRlZmF1bHQgYW5kIG5hbWVkIGltcG9ydHMuXCI7XG4gICAgfVxuXG4gICAgdmFyIHNvdXJjZUluZm8gPSBnZXRTb3VyY2VJbmZvRXJyb3JBZGRlbmR1bShzb3VyY2UpO1xuICAgIGlmIChzb3VyY2VJbmZvKSB7XG4gICAgICBpbmZvICs9IHNvdXJjZUluZm87XG4gICAgfSBlbHNlIHtcbiAgICAgIGluZm8gKz0gZ2V0RGVjbGFyYXRpb25FcnJvckFkZGVuZHVtKCk7XG4gICAgfVxuXG4gICAgdmFyIHR5cGVTdHJpbmcgPSB2b2lkIDA7XG4gICAgaWYgKHR5cGUgPT09IG51bGwpIHtcbiAgICAgIHR5cGVTdHJpbmcgPSAnbnVsbCc7XG4gICAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KHR5cGUpKSB7XG4gICAgICB0eXBlU3RyaW5nID0gJ2FycmF5JztcbiAgICB9IGVsc2UgaWYgKHR5cGUgIT09IHVuZGVmaW5lZCAmJiB0eXBlLiQkdHlwZW9mID09PSBSRUFDVF9FTEVNRU5UX1RZUEUpIHtcbiAgICAgIHR5cGVTdHJpbmcgPSAnPCcgKyAoZ2V0Q29tcG9uZW50TmFtZSh0eXBlLnR5cGUpIHx8ICdVbmtub3duJykgKyAnIC8+JztcbiAgICAgIGluZm8gPSAnIERpZCB5b3UgYWNjaWRlbnRhbGx5IGV4cG9ydCBhIEpTWCBsaXRlcmFsIGluc3RlYWQgb2YgYSBjb21wb25lbnQ/JztcbiAgICB9IGVsc2Uge1xuICAgICAgdHlwZVN0cmluZyA9IHR5cGVvZiB0eXBlO1xuICAgIH1cblxuICAgIHdhcm5pbmckMShmYWxzZSwgJ1JlYWN0LmpzeDogdHlwZSBpcyBpbnZhbGlkIC0tIGV4cGVjdGVkIGEgc3RyaW5nIChmb3IgJyArICdidWlsdC1pbiBjb21wb25lbnRzKSBvciBhIGNsYXNzL2Z1bmN0aW9uIChmb3IgY29tcG9zaXRlICcgKyAnY29tcG9uZW50cykgYnV0IGdvdDogJXMuJXMnLCB0eXBlU3RyaW5nLCBpbmZvKTtcbiAgfVxuXG4gIHZhciBlbGVtZW50ID0ganN4REVWKHR5cGUsIHByb3BzLCBrZXksIHNvdXJjZSwgc2VsZik7XG5cbiAgLy8gVGhlIHJlc3VsdCBjYW4gYmUgbnVsbGlzaCBpZiBhIG1vY2sgb3IgYSBjdXN0b20gZnVuY3Rpb24gaXMgdXNlZC5cbiAgLy8gVE9ETzogRHJvcCB0aGlzIHdoZW4gdGhlc2UgYXJlIG5vIGxvbmdlciBhbGxvd2VkIGFzIHRoZSB0eXBlIGFyZ3VtZW50LlxuICBpZiAoZWxlbWVudCA9PSBudWxsKSB7XG4gICAgcmV0dXJuIGVsZW1lbnQ7XG4gIH1cblxuICAvLyBTa2lwIGtleSB3YXJuaW5nIGlmIHRoZSB0eXBlIGlzbid0IHZhbGlkIHNpbmNlIG91ciBrZXkgdmFsaWRhdGlvbiBsb2dpY1xuICAvLyBkb2Vzbid0IGV4cGVjdCBhIG5vbi1zdHJpbmcvZnVuY3Rpb24gdHlwZSBhbmQgY2FuIHRocm93IGNvbmZ1c2luZyBlcnJvcnMuXG4gIC8vIFdlIGRvbid0IHdhbnQgZXhjZXB0aW9uIGJlaGF2aW9yIHRvIGRpZmZlciBiZXR3ZWVuIGRldiBhbmQgcHJvZC5cbiAgLy8gKFJlbmRlcmluZyB3aWxsIHRocm93IHdpdGggYSBoZWxwZnVsIG1lc3NhZ2UgYW5kIGFzIHNvb24gYXMgdGhlIHR5cGUgaXNcbiAgLy8gZml4ZWQsIHRoZSBrZXkgd2FybmluZ3Mgd2lsbCBhcHBlYXIuKVxuICBpZiAodmFsaWRUeXBlKSB7XG4gICAgdmFyIGNoaWxkcmVuID0gcHJvcHMuY2hpbGRyZW47XG4gICAgaWYgKGNoaWxkcmVuICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGlmIChpc1N0YXRpY0NoaWxkcmVuKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICB2YWxpZGF0ZUNoaWxkS2V5cyhjaGlsZHJlbltpXSwgdHlwZSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhbGlkYXRlQ2hpbGRLZXlzKGNoaWxkcmVuLCB0eXBlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBpZiAocHJvcHMua2V5ICE9PSB1bmRlZmluZWQpIHtcbiAgICB3YXJuaW5nJDEoZmFsc2UsICdSZWFjdC5qc3g6IFNwcmVhZGluZyBhIGtleSB0byBKU1ggaXMgYSBkZXByZWNhdGVkIHBhdHRlcm4uICcgKyAnRXhwbGljaXRseSBwYXNzIGEga2V5IGFmdGVyIHNwcmVhZGluZyBwcm9wcyBpbiB5b3VyIEpTWCBjYWxsLiAnICsgJ0UuZy4gPENvbXBvbmVudE5hbWUgey4uLnByb3BzfSBrZXk9e2tleX0gLz4nKTtcbiAgfVxuXG4gIGlmICh0eXBlID09PSBSRUFDVF9GUkFHTUVOVF9UWVBFKSB7XG4gICAgdmFsaWRhdGVGcmFnbWVudFByb3BzKGVsZW1lbnQpO1xuICB9IGVsc2Uge1xuICAgIHZhbGlkYXRlUHJvcFR5cGVzKGVsZW1lbnQpO1xuICB9XG5cbiAgcmV0dXJuIGVsZW1lbnQ7XG59XG5cbi8vIFRoZXNlIHR3byBmdW5jdGlvbnMgZXhpc3QgdG8gc3RpbGwgZ2V0IGNoaWxkIHdhcm5pbmdzIGluIGRldlxuLy8gZXZlbiB3aXRoIHRoZSBwcm9kIHRyYW5zZm9ybS4gVGhpcyBtZWFucyB0aGF0IGpzeERFViBpcyBwdXJlbHlcbi8vIG9wdC1pbiBiZWhhdmlvciBmb3IgYmV0dGVyIG1lc3NhZ2VzIGJ1dCB0aGF0IHdlIHdvbid0IHN0b3Bcbi8vIGdpdmluZyB5b3Ugd2FybmluZ3MgaWYgeW91IHVzZSBwcm9kdWN0aW9uIGFwaXMuXG5mdW5jdGlvbiBqc3hXaXRoVmFsaWRhdGlvblN0YXRpYyh0eXBlLCBwcm9wcywga2V5KSB7XG4gIHJldHVybiBqc3hXaXRoVmFsaWRhdGlvbih0eXBlLCBwcm9wcywga2V5LCB0cnVlKTtcbn1cblxuZnVuY3Rpb24ganN4V2l0aFZhbGlkYXRpb25EeW5hbWljKHR5cGUsIHByb3BzLCBrZXkpIHtcbiAgcmV0dXJuIGpzeFdpdGhWYWxpZGF0aW9uKHR5cGUsIHByb3BzLCBrZXksIGZhbHNlKTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlRWxlbWVudFdpdGhWYWxpZGF0aW9uKHR5cGUsIHByb3BzLCBjaGlsZHJlbikge1xuICB2YXIgdmFsaWRUeXBlID0gaXNWYWxpZEVsZW1lbnRUeXBlKHR5cGUpO1xuXG4gIC8vIFdlIHdhcm4gaW4gdGhpcyBjYXNlIGJ1dCBkb24ndCB0aHJvdy4gV2UgZXhwZWN0IHRoZSBlbGVtZW50IGNyZWF0aW9uIHRvXG4gIC8vIHN1Y2NlZWQgYW5kIHRoZXJlIHdpbGwgbGlrZWx5IGJlIGVycm9ycyBpbiByZW5kZXIuXG4gIGlmICghdmFsaWRUeXBlKSB7XG4gICAgdmFyIGluZm8gPSAnJztcbiAgICBpZiAodHlwZSA9PT0gdW5kZWZpbmVkIHx8IHR5cGVvZiB0eXBlID09PSAnb2JqZWN0JyAmJiB0eXBlICE9PSBudWxsICYmIE9iamVjdC5rZXlzKHR5cGUpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgaW5mbyArPSAnIFlvdSBsaWtlbHkgZm9yZ290IHRvIGV4cG9ydCB5b3VyIGNvbXBvbmVudCBmcm9tIHRoZSBmaWxlICcgKyBcIml0J3MgZGVmaW5lZCBpbiwgb3IgeW91IG1pZ2h0IGhhdmUgbWl4ZWQgdXAgZGVmYXVsdCBhbmQgbmFtZWQgaW1wb3J0cy5cIjtcbiAgICB9XG5cbiAgICB2YXIgc291cmNlSW5mbyA9IGdldFNvdXJjZUluZm9FcnJvckFkZGVuZHVtRm9yUHJvcHMocHJvcHMpO1xuICAgIGlmIChzb3VyY2VJbmZvKSB7XG4gICAgICBpbmZvICs9IHNvdXJjZUluZm87XG4gICAgfSBlbHNlIHtcbiAgICAgIGluZm8gKz0gZ2V0RGVjbGFyYXRpb25FcnJvckFkZGVuZHVtKCk7XG4gICAgfVxuXG4gICAgdmFyIHR5cGVTdHJpbmcgPSB2b2lkIDA7XG4gICAgaWYgKHR5cGUgPT09IG51bGwpIHtcbiAgICAgIHR5cGVTdHJpbmcgPSAnbnVsbCc7XG4gICAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KHR5cGUpKSB7XG4gICAgICB0eXBlU3RyaW5nID0gJ2FycmF5JztcbiAgICB9IGVsc2UgaWYgKHR5cGUgIT09IHVuZGVmaW5lZCAmJiB0eXBlLiQkdHlwZW9mID09PSBSRUFDVF9FTEVNRU5UX1RZUEUpIHtcbiAgICAgIHR5cGVTdHJpbmcgPSAnPCcgKyAoZ2V0Q29tcG9uZW50TmFtZSh0eXBlLnR5cGUpIHx8ICdVbmtub3duJykgKyAnIC8+JztcbiAgICAgIGluZm8gPSAnIERpZCB5b3UgYWNjaWRlbnRhbGx5IGV4cG9ydCBhIEpTWCBsaXRlcmFsIGluc3RlYWQgb2YgYSBjb21wb25lbnQ/JztcbiAgICB9IGVsc2Uge1xuICAgICAgdHlwZVN0cmluZyA9IHR5cGVvZiB0eXBlO1xuICAgIH1cblxuICAgIHdhcm5pbmckMShmYWxzZSwgJ1JlYWN0LmNyZWF0ZUVsZW1lbnQ6IHR5cGUgaXMgaW52YWxpZCAtLSBleHBlY3RlZCBhIHN0cmluZyAoZm9yICcgKyAnYnVpbHQtaW4gY29tcG9uZW50cykgb3IgYSBjbGFzcy9mdW5jdGlvbiAoZm9yIGNvbXBvc2l0ZSAnICsgJ2NvbXBvbmVudHMpIGJ1dCBnb3Q6ICVzLiVzJywgdHlwZVN0cmluZywgaW5mbyk7XG4gIH1cblxuICB2YXIgZWxlbWVudCA9IGNyZWF0ZUVsZW1lbnQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblxuICAvLyBUaGUgcmVzdWx0IGNhbiBiZSBudWxsaXNoIGlmIGEgbW9jayBvciBhIGN1c3RvbSBmdW5jdGlvbiBpcyB1c2VkLlxuICAvLyBUT0RPOiBEcm9wIHRoaXMgd2hlbiB0aGVzZSBhcmUgbm8gbG9uZ2VyIGFsbG93ZWQgYXMgdGhlIHR5cGUgYXJndW1lbnQuXG4gIGlmIChlbGVtZW50ID09IG51bGwpIHtcbiAgICByZXR1cm4gZWxlbWVudDtcbiAgfVxuXG4gIC8vIFNraXAga2V5IHdhcm5pbmcgaWYgdGhlIHR5cGUgaXNuJ3QgdmFsaWQgc2luY2Ugb3VyIGtleSB2YWxpZGF0aW9uIGxvZ2ljXG4gIC8vIGRvZXNuJ3QgZXhwZWN0IGEgbm9uLXN0cmluZy9mdW5jdGlvbiB0eXBlIGFuZCBjYW4gdGhyb3cgY29uZnVzaW5nIGVycm9ycy5cbiAgLy8gV2UgZG9uJ3Qgd2FudCBleGNlcHRpb24gYmVoYXZpb3IgdG8gZGlmZmVyIGJldHdlZW4gZGV2IGFuZCBwcm9kLlxuICAvLyAoUmVuZGVyaW5nIHdpbGwgdGhyb3cgd2l0aCBhIGhlbHBmdWwgbWVzc2FnZSBhbmQgYXMgc29vbiBhcyB0aGUgdHlwZSBpc1xuICAvLyBmaXhlZCwgdGhlIGtleSB3YXJuaW5ncyB3aWxsIGFwcGVhci4pXG4gIGlmICh2YWxpZFR5cGUpIHtcbiAgICBmb3IgKHZhciBpID0gMjsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFsaWRhdGVDaGlsZEtleXMoYXJndW1lbnRzW2ldLCB0eXBlKTtcbiAgICB9XG4gIH1cblxuICBpZiAodHlwZSA9PT0gUkVBQ1RfRlJBR01FTlRfVFlQRSkge1xuICAgIHZhbGlkYXRlRnJhZ21lbnRQcm9wcyhlbGVtZW50KTtcbiAgfSBlbHNlIHtcbiAgICB2YWxpZGF0ZVByb3BUeXBlcyhlbGVtZW50KTtcbiAgfVxuXG4gIHJldHVybiBlbGVtZW50O1xufVxuXG5mdW5jdGlvbiBjcmVhdGVGYWN0b3J5V2l0aFZhbGlkYXRpb24odHlwZSkge1xuICB2YXIgdmFsaWRhdGVkRmFjdG9yeSA9IGNyZWF0ZUVsZW1lbnRXaXRoVmFsaWRhdGlvbi5iaW5kKG51bGwsIHR5cGUpO1xuICB2YWxpZGF0ZWRGYWN0b3J5LnR5cGUgPSB0eXBlO1xuICAvLyBMZWdhY3kgaG9vazogcmVtb3ZlIGl0XG4gIHtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodmFsaWRhdGVkRmFjdG9yeSwgJ3R5cGUnLCB7XG4gICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICBsb3dQcmlvcml0eVdhcm5pbmckMShmYWxzZSwgJ0ZhY3RvcnkudHlwZSBpcyBkZXByZWNhdGVkLiBBY2Nlc3MgdGhlIGNsYXNzIGRpcmVjdGx5ICcgKyAnYmVmb3JlIHBhc3NpbmcgaXQgdG8gY3JlYXRlRmFjdG9yeS4nKTtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICd0eXBlJywge1xuICAgICAgICAgIHZhbHVlOiB0eXBlXG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gdHlwZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiB2YWxpZGF0ZWRGYWN0b3J5O1xufVxuXG5mdW5jdGlvbiBjbG9uZUVsZW1lbnRXaXRoVmFsaWRhdGlvbihlbGVtZW50LCBwcm9wcywgY2hpbGRyZW4pIHtcbiAgdmFyIG5ld0VsZW1lbnQgPSBjbG9uZUVsZW1lbnQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgZm9yICh2YXIgaSA9IDI7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICB2YWxpZGF0ZUNoaWxkS2V5cyhhcmd1bWVudHNbaV0sIG5ld0VsZW1lbnQudHlwZSk7XG4gIH1cbiAgdmFsaWRhdGVQcm9wVHlwZXMobmV3RWxlbWVudCk7XG4gIHJldHVybiBuZXdFbGVtZW50O1xufVxuXG52YXIgaGFzQmFkTWFwUG9seWZpbGwgPSB2b2lkIDA7XG5cbntcbiAgaGFzQmFkTWFwUG9seWZpbGwgPSBmYWxzZTtcbiAgdHJ5IHtcbiAgICB2YXIgZnJvemVuT2JqZWN0ID0gT2JqZWN0LmZyZWV6ZSh7fSk7XG4gICAgdmFyIHRlc3RNYXAgPSBuZXcgTWFwKFtbZnJvemVuT2JqZWN0LCBudWxsXV0pO1xuICAgIHZhciB0ZXN0U2V0ID0gbmV3IFNldChbZnJvemVuT2JqZWN0XSk7XG4gICAgLy8gVGhpcyBpcyBuZWNlc3NhcnkgZm9yIFJvbGx1cCB0byBub3QgY29uc2lkZXIgdGhlc2UgdW51c2VkLlxuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9yb2xsdXAvcm9sbHVwL2lzc3Vlcy8xNzcxXG4gICAgLy8gVE9ETzogd2UgY2FuIHJlbW92ZSB0aGVzZSBpZiBSb2xsdXAgZml4ZXMgdGhlIGJ1Zy5cbiAgICB0ZXN0TWFwLnNldCgwLCAwKTtcbiAgICB0ZXN0U2V0LmFkZCgwKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIC8vIFRPRE86IENvbnNpZGVyIHdhcm5pbmcgYWJvdXQgYmFkIHBvbHlmaWxsc1xuICAgIGhhc0JhZE1hcFBvbHlmaWxsID0gdHJ1ZTtcbiAgfVxufVxuXG5mdW5jdGlvbiBjcmVhdGVGdW5kYW1lbnRhbENvbXBvbmVudChpbXBsKSB7XG4gIC8vIFdlIHVzZSByZXNwb25kZXIgYXMgYSBNYXAga2V5IGxhdGVyIG9uLiBXaGVuIHdlIGhhdmUgYSBiYWRcbiAgLy8gcG9seWZpbGwsIHRoZW4gd2UgY2FuJ3QgdXNlIGl0IGFzIGEga2V5IGFzIHRoZSBwb2x5ZmlsbCB0cmllc1xuICAvLyB0byBhZGQgYSBwcm9wZXJ0eSB0byB0aGUgb2JqZWN0LlxuICBpZiAodHJ1ZSAmJiAhaGFzQmFkTWFwUG9seWZpbGwpIHtcbiAgICBPYmplY3QuZnJlZXplKGltcGwpO1xuICB9XG4gIHZhciBmdW5kYW1hbnRhbENvbXBvbmVudCA9IHtcbiAgICAkJHR5cGVvZjogUkVBQ1RfRlVOREFNRU5UQUxfVFlQRSxcbiAgICBpbXBsOiBpbXBsXG4gIH07XG4gIHtcbiAgICBPYmplY3QuZnJlZXplKGZ1bmRhbWFudGFsQ29tcG9uZW50KTtcbiAgfVxuICByZXR1cm4gZnVuZGFtYW50YWxDb21wb25lbnQ7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUV2ZW50UmVzcG9uZGVyKGRpc3BsYXlOYW1lLCByZXNwb25kZXJDb25maWcpIHtcbiAgdmFyIGdldEluaXRpYWxTdGF0ZSA9IHJlc3BvbmRlckNvbmZpZy5nZXRJbml0aWFsU3RhdGUsXG4gICAgICBvbkV2ZW50ID0gcmVzcG9uZGVyQ29uZmlnLm9uRXZlbnQsXG4gICAgICBvbk1vdW50ID0gcmVzcG9uZGVyQ29uZmlnLm9uTW91bnQsXG4gICAgICBvblVubW91bnQgPSByZXNwb25kZXJDb25maWcub25Vbm1vdW50LFxuICAgICAgb25Pd25lcnNoaXBDaGFuZ2UgPSByZXNwb25kZXJDb25maWcub25Pd25lcnNoaXBDaGFuZ2UsXG4gICAgICBvblJvb3RFdmVudCA9IHJlc3BvbmRlckNvbmZpZy5vblJvb3RFdmVudCxcbiAgICAgIHJvb3RFdmVudFR5cGVzID0gcmVzcG9uZGVyQ29uZmlnLnJvb3RFdmVudFR5cGVzLFxuICAgICAgdGFyZ2V0RXZlbnRUeXBlcyA9IHJlc3BvbmRlckNvbmZpZy50YXJnZXRFdmVudFR5cGVzO1xuXG4gIHZhciBldmVudFJlc3BvbmRlciA9IHtcbiAgICAkJHR5cGVvZjogUkVBQ1RfUkVTUE9OREVSX1RZUEUsXG4gICAgZGlzcGxheU5hbWU6IGRpc3BsYXlOYW1lLFxuICAgIGdldEluaXRpYWxTdGF0ZTogZ2V0SW5pdGlhbFN0YXRlIHx8IG51bGwsXG4gICAgb25FdmVudDogb25FdmVudCB8fCBudWxsLFxuICAgIG9uTW91bnQ6IG9uTW91bnQgfHwgbnVsbCxcbiAgICBvbk93bmVyc2hpcENoYW5nZTogb25Pd25lcnNoaXBDaGFuZ2UgfHwgbnVsbCxcbiAgICBvblJvb3RFdmVudDogb25Sb290RXZlbnQgfHwgbnVsbCxcbiAgICBvblVubW91bnQ6IG9uVW5tb3VudCB8fCBudWxsLFxuICAgIHJvb3RFdmVudFR5cGVzOiByb290RXZlbnRUeXBlcyB8fCBudWxsLFxuICAgIHRhcmdldEV2ZW50VHlwZXM6IHRhcmdldEV2ZW50VHlwZXMgfHwgbnVsbFxuICB9O1xuICAvLyBXZSB1c2UgcmVzcG9uZGVyIGFzIGEgTWFwIGtleSBsYXRlciBvbi4gV2hlbiB3ZSBoYXZlIGEgYmFkXG4gIC8vIHBvbHlmaWxsLCB0aGVuIHdlIGNhbid0IHVzZSBpdCBhcyBhIGtleSBhcyB0aGUgcG9seWZpbGwgdHJpZXNcbiAgLy8gdG8gYWRkIGEgcHJvcGVydHkgdG8gdGhlIG9iamVjdC5cbiAgaWYgKHRydWUgJiYgIWhhc0JhZE1hcFBvbHlmaWxsKSB7XG4gICAgT2JqZWN0LmZyZWV6ZShldmVudFJlc3BvbmRlcik7XG4gIH1cbiAgcmV0dXJuIGV2ZW50UmVzcG9uZGVyO1xufVxuXG4vLyBIZWxwcyBpZGVudGlmeSBzaWRlIGVmZmVjdHMgaW4gYmVnaW4tcGhhc2UgbGlmZWN5Y2xlIGhvb2tzIGFuZCBzZXRTdGF0ZSByZWR1Y2VyczpcblxuXG4vLyBJbiBzb21lIGNhc2VzLCBTdHJpY3RNb2RlIHNob3VsZCBhbHNvIGRvdWJsZS1yZW5kZXIgbGlmZWN5Y2xlcy5cbi8vIFRoaXMgY2FuIGJlIGNvbmZ1c2luZyBmb3IgdGVzdHMgdGhvdWdoLFxuLy8gQW5kIGl0IGNhbiBiZSBiYWQgZm9yIHBlcmZvcm1hbmNlIGluIHByb2R1Y3Rpb24uXG4vLyBUaGlzIGZlYXR1cmUgZmxhZyBjYW4gYmUgdXNlZCB0byBjb250cm9sIHRoZSBiZWhhdmlvcjpcblxuXG4vLyBUbyBwcmVzZXJ2ZSB0aGUgXCJQYXVzZSBvbiBjYXVnaHQgZXhjZXB0aW9uc1wiIGJlaGF2aW9yIG9mIHRoZSBkZWJ1Z2dlciwgd2Vcbi8vIHJlcGxheSB0aGUgYmVnaW4gcGhhc2Ugb2YgYSBmYWlsZWQgY29tcG9uZW50IGluc2lkZSBpbnZva2VHdWFyZGVkQ2FsbGJhY2suXG5cblxuLy8gV2FybiBhYm91dCBkZXByZWNhdGVkLCBhc3luYy11bnNhZmUgbGlmZWN5Y2xlczsgcmVsYXRlcyB0byBSRkMgIzY6XG5cblxuLy8gR2F0aGVyIGFkdmFuY2VkIHRpbWluZyBtZXRyaWNzIGZvciBQcm9maWxlciBzdWJ0cmVlcy5cblxuXG4vLyBUcmFjZSB3aGljaCBpbnRlcmFjdGlvbnMgdHJpZ2dlciBlYWNoIGNvbW1pdC5cblxuXG4vLyBPbmx5IHVzZWQgaW4gd3d3IGJ1aWxkcy5cbiAvLyBUT0RPOiB0cnVlPyBIZXJlIGl0IG1pZ2h0IGp1c3QgYmUgZmFsc2UuXG5cbi8vIE9ubHkgdXNlZCBpbiB3d3cgYnVpbGRzLlxuXG5cbi8vIE9ubHkgdXNlZCBpbiB3d3cgYnVpbGRzLlxuXG5cbi8vIERpc2FibGUgamF2YXNjcmlwdDogVVJMIHN0cmluZ3MgaW4gaHJlZiBmb3IgWFNTIHByb3RlY3Rpb24uXG5cblxuLy8gUmVhY3QgRmlyZTogcHJldmVudCB0aGUgdmFsdWUgYW5kIGNoZWNrZWQgYXR0cmlidXRlcyBmcm9tIHN5bmNpbmdcbi8vIHdpdGggdGhlaXIgcmVsYXRlZCBET00gcHJvcGVydGllc1xuXG5cbi8vIFRoZXNlIEFQSXMgd2lsbCBubyBsb25nZXIgYmUgXCJ1bnN0YWJsZVwiIGluIHRoZSB1cGNvbWluZyAxNi43IHJlbGVhc2UsXG4vLyBDb250cm9sIHRoaXMgYmVoYXZpb3Igd2l0aCBhIGZsYWcgdG8gc3VwcG9ydCAxNi42IG1pbm9yIHJlbGVhc2VzIGluIHRoZSBtZWFud2hpbGUuXG5cblxuXG5cbi8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vcmVhY3QtbmF0aXZlLWNvbW11bml0eS9kaXNjdXNzaW9ucy1hbmQtcHJvcG9zYWxzL2lzc3Vlcy83MiBmb3IgbW9yZSBpbmZvcm1hdGlvblxuLy8gVGhpcyBpcyBhIGZsYWcgc28gd2UgY2FuIGZpeCB3YXJuaW5ncyBpbiBSTiBjb3JlIGJlZm9yZSB0dXJuaW5nIGl0IG9uXG5cblxuLy8gRXhwZXJpbWVudGFsIFJlYWN0IEZsYXJlIGV2ZW50IHN5c3RlbSBhbmQgZXZlbnQgY29tcG9uZW50cyBzdXBwb3J0LlxudmFyIGVuYWJsZUZsYXJlQVBJID0gZmFsc2U7XG5cbi8vIEV4cGVyaW1lbnRhbCBIb3N0IENvbXBvbmVudCBzdXBwb3J0LlxudmFyIGVuYWJsZUZ1bmRhbWVudGFsQVBJID0gZmFsc2U7XG5cbi8vIE5ldyBBUEkgZm9yIEpTWCB0cmFuc2Zvcm1zIHRvIHRhcmdldCAtIGh0dHBzOi8vZ2l0aHViLmNvbS9yZWFjdGpzL3JmY3MvcHVsbC8xMDdcbnZhciBlbmFibGVKU1hUcmFuc2Zvcm1BUEkgPSBmYWxzZTtcblxuLy8gV2Ugd2lsbCBlbmZvcmNlIG1vY2tpbmcgc2NoZWR1bGVyIHdpdGggc2NoZWR1bGVyL3Vuc3RhYmxlX21vY2sgYXQgc29tZSBwb2ludC4gKHYxNz8pXG4vLyBUaWxsIHRoZW4sIHdlIHdhcm4gYWJvdXQgdGhlIG1pc3NpbmcgbW9jaywgYnV0IHN0aWxsIGZhbGxiYWNrIHRvIGEgc3luYyBtb2RlIGNvbXBhdGlibGUgdmVyc2lvblxuXG4vLyBUZW1wb3JhcnkgZmxhZyB0byByZXZlcnQgdGhlIGZpeCBpbiAjMTU2NTBcblxuXG4vLyBGb3IgdGVzdHMsIHdlIGZsdXNoIHN1c3BlbnNlIGZhbGxiYWNrcyBpbiBhbiBhY3Qgc2NvcGU7XG4vLyAqZXhjZXB0KiBpbiBzb21lIG9mIG91ciBvd24gdGVzdHMsIHdoZXJlIHdlIHRlc3QgaW5jcmVtZW50YWwgbG9hZGluZyBzdGF0ZXMuXG5cblxuLy8gQ2hhbmdlcyBwcmlvcml0eSBvZiBzb21lIGV2ZW50cyBsaWtlIG1vdXNlbW92ZSB0byB1c2VyLWJsb2NraW5nIHByaW9yaXR5LFxuLy8gYnV0IHdpdGhvdXQgbWFraW5nIHRoZW0gZGlzY3JldGUuIFRoZSBmbGFnIGV4aXN0cyBpbiBjYXNlIGl0IGNhdXNlc1xuLy8gc3RhcnZhdGlvbiBwcm9ibGVtcy5cblxuXG4vLyBBZGQgYSBjYWxsYmFjayBwcm9wZXJ0eSB0byBzdXNwZW5zZSB0byBub3RpZnkgd2hpY2ggcHJvbWlzZXMgYXJlIGN1cnJlbnRseVxuLy8gaW4gdGhlIHVwZGF0ZSBxdWV1ZS4gVGhpcyBhbGxvd3MgcmVwb3J0aW5nIGFuZCB0cmFjaW5nIG9mIHdoYXQgaXMgY2F1c2luZ1xuLy8gdGhlIHVzZXIgdG8gc2VlIGEgbG9hZGluZyBzdGF0ZS5cblxuXG4vLyBQYXJ0IG9mIHRoZSBzaW1wbGlmaWNhdGlvbiBvZiBSZWFjdC5jcmVhdGVFbGVtZW50IHNvIHdlIGNhbiBldmVudHVhbGx5IG1vdmVcbi8vIGZyb20gUmVhY3QuY3JlYXRlRWxlbWVudCB0byBSZWFjdC5qc3hcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9yZWFjdGpzL3JmY3MvYmxvYi9jcmVhdGVsZW1lbnQtcmZjL3RleHQvMDAwMC1jcmVhdGUtZWxlbWVudC1jaGFuZ2VzLm1kXG5cbnZhciBSZWFjdCA9IHtcbiAgQ2hpbGRyZW46IHtcbiAgICBtYXA6IG1hcENoaWxkcmVuLFxuICAgIGZvckVhY2g6IGZvckVhY2hDaGlsZHJlbixcbiAgICBjb3VudDogY291bnRDaGlsZHJlbixcbiAgICB0b0FycmF5OiB0b0FycmF5LFxuICAgIG9ubHk6IG9ubHlDaGlsZFxuICB9LFxuXG4gIGNyZWF0ZVJlZjogY3JlYXRlUmVmLFxuICBDb21wb25lbnQ6IENvbXBvbmVudCxcbiAgUHVyZUNvbXBvbmVudDogUHVyZUNvbXBvbmVudCxcblxuICBjcmVhdGVDb250ZXh0OiBjcmVhdGVDb250ZXh0LFxuICBmb3J3YXJkUmVmOiBmb3J3YXJkUmVmLFxuICBsYXp5OiBsYXp5LFxuICBtZW1vOiBtZW1vLFxuXG4gIHVzZUNhbGxiYWNrOiB1c2VDYWxsYmFjayxcbiAgdXNlQ29udGV4dDogdXNlQ29udGV4dCxcbiAgdXNlRWZmZWN0OiB1c2VFZmZlY3QsXG4gIHVzZUltcGVyYXRpdmVIYW5kbGU6IHVzZUltcGVyYXRpdmVIYW5kbGUsXG4gIHVzZURlYnVnVmFsdWU6IHVzZURlYnVnVmFsdWUsXG4gIHVzZUxheW91dEVmZmVjdDogdXNlTGF5b3V0RWZmZWN0LFxuICB1c2VNZW1vOiB1c2VNZW1vLFxuICB1c2VSZWR1Y2VyOiB1c2VSZWR1Y2VyLFxuICB1c2VSZWY6IHVzZVJlZixcbiAgdXNlU3RhdGU6IHVzZVN0YXRlLFxuXG4gIEZyYWdtZW50OiBSRUFDVF9GUkFHTUVOVF9UWVBFLFxuICBQcm9maWxlcjogUkVBQ1RfUFJPRklMRVJfVFlQRSxcbiAgU3RyaWN0TW9kZTogUkVBQ1RfU1RSSUNUX01PREVfVFlQRSxcbiAgU3VzcGVuc2U6IFJFQUNUX1NVU1BFTlNFX1RZUEUsXG4gIHVuc3RhYmxlX1N1c3BlbnNlTGlzdDogUkVBQ1RfU1VTUEVOU0VfTElTVF9UWVBFLFxuXG4gIGNyZWF0ZUVsZW1lbnQ6IGNyZWF0ZUVsZW1lbnRXaXRoVmFsaWRhdGlvbixcbiAgY2xvbmVFbGVtZW50OiBjbG9uZUVsZW1lbnRXaXRoVmFsaWRhdGlvbixcbiAgY3JlYXRlRmFjdG9yeTogY3JlYXRlRmFjdG9yeVdpdGhWYWxpZGF0aW9uLFxuICBpc1ZhbGlkRWxlbWVudDogaXNWYWxpZEVsZW1lbnQsXG5cbiAgdmVyc2lvbjogUmVhY3RWZXJzaW9uLFxuXG4gIHVuc3RhYmxlX3dpdGhTdXNwZW5zZUNvbmZpZzogd2l0aFN1c3BlbnNlQ29uZmlnLFxuXG4gIF9fU0VDUkVUX0lOVEVSTkFMU19ET19OT1RfVVNFX09SX1lPVV9XSUxMX0JFX0ZJUkVEOiBSZWFjdFNoYXJlZEludGVybmFsc1xufTtcblxuaWYgKGVuYWJsZUZsYXJlQVBJKSB7XG4gIFJlYWN0LnVuc3RhYmxlX3VzZVJlc3BvbmRlciA9IHVzZVJlc3BvbmRlcjtcbiAgUmVhY3QudW5zdGFibGVfY3JlYXRlUmVzcG9uZGVyID0gY3JlYXRlRXZlbnRSZXNwb25kZXI7XG59XG5cbmlmIChlbmFibGVGdW5kYW1lbnRhbEFQSSkge1xuICBSZWFjdC51bnN0YWJsZV9jcmVhdGVGdW5kYW1lbnRhbCA9IGNyZWF0ZUZ1bmRhbWVudGFsQ29tcG9uZW50O1xufVxuXG4vLyBOb3RlOiBzb21lIEFQSXMgYXJlIGFkZGVkIHdpdGggZmVhdHVyZSBmbGFncy5cbi8vIE1ha2Ugc3VyZSB0aGF0IHN0YWJsZSBidWlsZHMgZm9yIG9wZW4gc291cmNlXG4vLyBkb24ndCBtb2RpZnkgdGhlIFJlYWN0IG9iamVjdCB0byBhdm9pZCBkZW9wdHMuXG4vLyBBbHNvIGxldCdzIG5vdCBleHBvc2UgdGhlaXIgbmFtZXMgaW4gc3RhYmxlIGJ1aWxkcy5cblxuaWYgKGVuYWJsZUpTWFRyYW5zZm9ybUFQSSkge1xuICB7XG4gICAgUmVhY3QuanN4REVWID0ganN4V2l0aFZhbGlkYXRpb247XG4gICAgUmVhY3QuanN4ID0ganN4V2l0aFZhbGlkYXRpb25EeW5hbWljO1xuICAgIFJlYWN0LmpzeHMgPSBqc3hXaXRoVmFsaWRhdGlvblN0YXRpYztcbiAgfVxufVxuXG5cblxudmFyIFJlYWN0JDIgPSBPYmplY3QuZnJlZXplKHtcblx0ZGVmYXVsdDogUmVhY3Rcbn0pO1xuXG52YXIgUmVhY3QkMyA9ICggUmVhY3QkMiAmJiBSZWFjdCApIHx8IFJlYWN0JDI7XG5cbi8vIFRPRE86IGRlY2lkZSBvbiB0aGUgdG9wLWxldmVsIGV4cG9ydCBmb3JtLlxuLy8gVGhpcyBpcyBoYWNreSBidXQgbWFrZXMgaXQgd29yayB3aXRoIGJvdGggUm9sbHVwIGFuZCBKZXN0LlxudmFyIHJlYWN0ID0gUmVhY3QkMy5kZWZhdWx0IHx8IFJlYWN0JDM7XG5cbm1vZHVsZS5leHBvcnRzID0gcmVhY3Q7XG4gIH0pKCk7XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ3Byb2R1Y3Rpb24nKSB7XG4gIG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9janMvcmVhY3QucHJvZHVjdGlvbi5taW4uanMnKTtcbn0gZWxzZSB7XG4gIG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9janMvcmVhY3QuZGV2ZWxvcG1lbnQuanMnKTtcbn1cbiIsIi8qIGVzbGludC1kaXNhYmxlIG5vLXBhcmFtLXJlYXNzaWduICovXG5pbXBvcnQgeyBub3JtYWxpemVPcHRpb25zIH0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQgeyBsb2dnZXIgfSBmcm9tICcuLi9pbmRleCc7XG5cbmNvbnN0IERFRkFVTFRfT1BUSU9OUyA9IHsgZHJvcHBpbmc6IGZhbHNlLCBzbGlkaW5nOiBmYWxzZSB9O1xuY29uc3QgTk9PUCA9ICh2LCBjYikgPT4gY2Iodik7XG5cbmZ1bmN0aW9uIENTUEJ1ZmZlcihzaXplID0gMCwgeyBkcm9wcGluZywgc2xpZGluZyB9ID0gREVGQVVMVF9PUFRJT05TKSB7XG4gIGNvbnN0IGFwaSA9IHtcbiAgICB2YWx1ZTogW10sXG4gICAgcHV0czogW10sXG4gICAgdGFrZXM6IFtdLFxuICAgIGhvb2tzOiB7XG4gICAgICBiZWZvcmVQdXQ6IE5PT1AsXG4gICAgICBhZnRlclB1dDogTk9PUCxcbiAgICAgIGJlZm9yZVRha2U6IE5PT1AsXG4gICAgICBhZnRlclRha2U6IE5PT1AsXG4gICAgfSxcbiAgICBwYXJlbnQ6IG51bGwsXG4gICAgZHJvcHBpbmcsXG4gICAgc2xpZGluZyxcbiAgfTtcblxuICBhcGkuYmVmb3JlUHV0ID0gaG9vayA9PiAoYXBpLmhvb2tzLmJlZm9yZVB1dCA9IGhvb2spO1xuICBhcGkuYWZ0ZXJQdXQgPSBob29rID0+IChhcGkuaG9va3MuYWZ0ZXJQdXQgPSBob29rKTtcbiAgYXBpLmJlZm9yZVRha2UgPSBob29rID0+IChhcGkuaG9va3MuYmVmb3JlVGFrZSA9IGhvb2spO1xuICBhcGkuYWZ0ZXJUYWtlID0gaG9vayA9PiAoYXBpLmhvb2tzLmFmdGVyVGFrZSA9IGhvb2spO1xuICBhcGkuaXNFbXB0eSA9ICgpID0+IGFwaS52YWx1ZS5sZW5ndGggPT09IDA7XG4gIGFwaS5yZXNldCA9ICgpID0+IHtcbiAgICBhcGkudmFsdWUgPSBbXTtcbiAgICBhcGkucHV0cyA9IFtdO1xuICAgIGFwaS50YWtlcyA9IFtdO1xuICAgIGFwaS5ob29rcyA9IHtcbiAgICAgIGJlZm9yZVB1dDogTk9PUCxcbiAgICAgIGFmdGVyUHV0OiBOT09QLFxuICAgICAgYmVmb3JlVGFrZTogTk9PUCxcbiAgICAgIGFmdGVyVGFrZTogTk9PUCxcbiAgICB9O1xuICB9O1xuICBhcGkuc2V0VmFsdWUgPSB2ID0+IHtcbiAgICBhcGkudmFsdWUgPSB2O1xuICB9O1xuICBhcGkuZ2V0VmFsdWUgPSAoKSA9PiBhcGkudmFsdWU7XG4gIGFwaS5kZWNvbXBvc2VUYWtlcnMgPSAoKSA9PlxuICAgIGFwaS50YWtlcy5yZWR1Y2UoXG4gICAgICAocmVzLCB0YWtlT2JqKSA9PiB7XG4gICAgICAgIHJlc1t0YWtlT2JqLm9wdGlvbnMucmVhZCA/ICdyZWFkZXJzJyA6ICd0YWtlcnMnXS5wdXNoKHRha2VPYmopO1xuICAgICAgICByZXR1cm4gcmVzO1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgcmVhZGVyczogW10sXG4gICAgICAgIHRha2VyczogW10sXG4gICAgICB9XG4gICAgKTtcbiAgYXBpLmNvbnN1bWVUYWtlID0gKHRha2VPYmosIHZhbHVlKSA9PiB7XG4gICAgaWYgKCF0YWtlT2JqLm9wdGlvbnMubGlzdGVuKSB7XG4gICAgICBjb25zdCBpZHggPSBhcGkudGFrZXMuZmluZEluZGV4KHQgPT4gdCA9PT0gdGFrZU9iaik7XG4gICAgICBpZiAoaWR4ID49IDApIGFwaS50YWtlcy5zcGxpY2UoaWR4LCAxKTtcbiAgICB9XG4gICAgdGFrZU9iai5jYWxsYmFjayh2YWx1ZSk7XG4gIH07XG4gIGFwaS5kZWxldGVUYWtlciA9IGNiID0+IHtcbiAgICBjb25zdCBpZHggPSBhcGkudGFrZXMuZmluZEluZGV4KCh7IGNhbGxiYWNrIH0pID0+IGNhbGxiYWNrID09PSBjYik7XG4gICAgaWYgKGlkeCA+PSAwKSB7XG4gICAgICBhcGkudGFrZXMuc3BsaWNlKGlkeCwgMSk7XG4gICAgfVxuICB9O1xuICBhcGkuZGVsZXRlTGlzdGVuZXJzID0gKCkgPT4ge1xuICAgIGFwaS50YWtlcyA9IGFwaS50YWtlcy5maWx0ZXIoKHsgb3B0aW9ucyB9KSA9PiAhb3B0aW9ucy5saXN0ZW4pO1xuICB9O1xuXG4gIGFwaS5zZXRWYWx1ZSA9IHYgPT4gKGFwaS52YWx1ZSA9IHYpO1xuXG4gIGNvbnN0IHB1dCA9IChpdGVtLCBjYWxsYmFjaykgPT4ge1xuICAgIGNvbnN0IHsgcmVhZGVycywgdGFrZXJzIH0gPSBhcGkuZGVjb21wb3NlVGFrZXJzKCk7XG4gICAgLy8gY29uc29sZS5sb2coXG4gICAgLy8gICBgcHV0PSR7aXRlbX1gLFxuICAgIC8vICAgYHJlYWRlcnM9JHtyZWFkZXJzLmxlbmd0aH1gLFxuICAgIC8vICAgYHRha2Vycz0ke3Rha2Vycy5sZW5ndGh9YCxcbiAgICAvLyAgIGB2YWx1ZT0ke2FwaS52YWx1ZS5sZW5ndGh9IHNpemU9JHtzaXplfWBcbiAgICAvLyApO1xuXG4gICAgLy8gcmVzb2x2aW5nIHJlYWRlcnNcbiAgICByZWFkZXJzLmZvckVhY2gocmVhZGVyID0+IGFwaS5jb25zdW1lVGFrZShyZWFkZXIsIGl0ZW0pKTtcblxuICAgIC8vIHJlc29sdmluZyB0YWtlcnNcbiAgICBpZiAodGFrZXJzLmxlbmd0aCA+IDApIHtcbiAgICAgIGFwaS5jb25zdW1lVGFrZSh0YWtlcnNbMF0sIGl0ZW0pO1xuICAgICAgY2FsbGJhY2sodHJ1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChhcGkudmFsdWUubGVuZ3RoIDwgc2l6ZSkge1xuICAgICAgICBhcGkudmFsdWUucHVzaChpdGVtKTtcbiAgICAgICAgY2FsbGJhY2sodHJ1ZSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmIChkcm9wcGluZykge1xuICAgICAgICBjYWxsYmFjayhmYWxzZSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmIChzbGlkaW5nKSB7XG4gICAgICAgIGFwaS52YWx1ZS5zaGlmdCgpO1xuICAgICAgICBhcGkudmFsdWUucHVzaChpdGVtKTtcbiAgICAgICAgY2FsbGJhY2sodHJ1ZSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGFwaS5wdXRzLnB1c2goe1xuICAgICAgICBjYWxsYmFjazogdiA9PiB7XG4gICAgICAgICAgYXBpLnZhbHVlLnB1c2goaXRlbSk7XG4gICAgICAgICAgY2FsbGJhY2sodiB8fCB0cnVlKTtcbiAgICAgICAgfSxcbiAgICAgICAgaXRlbSxcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcblxuICBjb25zdCB0YWtlID0gKGNhbGxiYWNrLCBvcHRpb25zKSA9PiB7XG4gICAgLy8gY29uc29sZS5sb2coJ3Rha2UnLCBgcHV0cz0ke2FwaS5wdXRzLmxlbmd0aH1gLCBgdmFsdWU9JHthcGkudmFsdWUubGVuZ3RofWApO1xuICAgIGNvbnN0IHN1YnNjcmliZSA9ICgpID0+IHtcbiAgICAgIGFwaS50YWtlcy5wdXNoKHsgY2FsbGJhY2ssIG9wdGlvbnMgfSk7XG4gICAgICByZXR1cm4gKCkgPT4gYXBpLmRlbGV0ZVRha2VyKGNhbGxiYWNrKTtcbiAgICB9O1xuICAgIG9wdGlvbnMgPSBub3JtYWxpemVPcHRpb25zKG9wdGlvbnMpO1xuICAgIGlmIChvcHRpb25zLmxpc3Rlbikge1xuICAgICAgb3B0aW9ucy5yZWFkID0gdHJ1ZTtcbiAgICAgIGlmIChvcHRpb25zLmluaXRpYWxDYWxsKSB7XG4gICAgICAgIGNhbGxiYWNrKGFwaS52YWx1ZVswXSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gc3Vic2NyaWJlKCk7XG4gICAgfVxuICAgIGlmIChvcHRpb25zLnJlYWQpIHtcbiAgICAgIGNhbGxiYWNrKGFwaS52YWx1ZVswXSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChhcGkudmFsdWUubGVuZ3RoID09PSAwKSB7XG4gICAgICBpZiAoYXBpLnB1dHMubGVuZ3RoID4gMCkge1xuICAgICAgICBhcGkucHV0cy5zaGlmdCgpLmNhbGxiYWNrKCk7XG4gICAgICAgIGNhbGxiYWNrKGFwaS52YWx1ZS5zaGlmdCgpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBzdWJzY3JpYmUoKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgdiA9IGFwaS52YWx1ZS5zaGlmdCgpO1xuICAgICAgY2FsbGJhY2sodik7XG4gICAgICBpZiAoYXBpLnZhbHVlLmxlbmd0aCA8IHNpemUgJiYgYXBpLnB1dHMubGVuZ3RoID4gMCkge1xuICAgICAgICBhcGkucHV0cy5zaGlmdCgpLmNhbGxiYWNrKCk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiAoKSA9PiB7fTtcbiAgfTtcblxuICBhcGkucHV0ID0gKGl0ZW0sIGNhbGxiYWNrKSA9PiB7XG4gICAgbG9nZ2VyLmxvZyhhcGkucGFyZW50LCAnQ0hBTk5FTF9QVVRfSU5JVElBVEVEJywgaXRlbSk7XG4gICAgYXBpLmhvb2tzLmJlZm9yZVB1dChpdGVtLCBiZWZvcmVQdXRJdGVtID0+IHtcbiAgICAgIHB1dChiZWZvcmVQdXRJdGVtLCBwdXRPcFJlcyA9PlxuICAgICAgICBhcGkuaG9va3MuYWZ0ZXJQdXQocHV0T3BSZXMsIGFmdGVyUHV0SXRlbSA9PiB7XG4gICAgICAgICAgbG9nZ2VyLmxvZyhhcGkucGFyZW50LCAnQ0hBTk5FTF9QVVRfUkVTT0xWRUQnLCBhZnRlclB1dEl0ZW0pO1xuICAgICAgICAgIGNhbGxiYWNrKGFmdGVyUHV0SXRlbSk7XG4gICAgICAgIH0pXG4gICAgICApO1xuICAgIH0pO1xuICB9O1xuICBhcGkudGFrZSA9IChjYWxsYmFjaywgb3B0aW9ucykgPT4ge1xuICAgIGxldCB1bnN1YnNjcmliZSA9ICgpID0+IHt9O1xuICAgIGxvZ2dlci5sb2coXG4gICAgICBhcGkucGFyZW50LFxuICAgICAgb3B0aW9ucy5saXN0ZW4gPyAnQ0hBTk5FTF9MSVNURU4nIDogJ0NIQU5ORUxfVEFLRV9JTklUSUFURUQnXG4gICAgKTtcbiAgICBhcGkuaG9va3MuYmVmb3JlVGFrZShcbiAgICAgIHVuZGVmaW5lZCxcbiAgICAgICgpID0+XG4gICAgICAgICh1bnN1YnNjcmliZSA9IHRha2UoXG4gICAgICAgICAgdGFrZU9wUmVzID0+XG4gICAgICAgICAgICBhcGkuaG9va3MuYWZ0ZXJUYWtlKHRha2VPcFJlcywgYWZ0ZXJUYWtlSXRlbSA9PiB7XG4gICAgICAgICAgICAgIGxvZ2dlci5sb2coYXBpLnBhcmVudCwgJ0NIQU5ORUxfVEFLRV9SRVNPTFZFRCcsIGFmdGVyVGFrZUl0ZW0pO1xuICAgICAgICAgICAgICBjYWxsYmFjayhhZnRlclRha2VJdGVtKTtcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgIG9wdGlvbnNcbiAgICAgICAgKSlcbiAgICApO1xuICAgIHJldHVybiAoKSA9PiB1bnN1YnNjcmliZSgpO1xuICB9O1xuXG4gIHJldHVybiBhcGk7XG59XG5cbmNvbnN0IGJ1ZmZlciA9IHtcbiAgZml4ZWQ6IChzaXplID0gMCkgPT4gQ1NQQnVmZmVyKHNpemUsIHsgZHJvcHBpbmc6IGZhbHNlLCBzbGlkaW5nOiBmYWxzZSB9KSxcbiAgZHJvcHBpbmc6IChzaXplID0gMSkgPT4ge1xuICAgIGlmIChzaXplIDwgMSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgZHJvcHBpbmcgYnVmZmVyIHNob3VsZCBoYXZlIGF0IGxlYXN0IHNpemUgb2Ygb25lLicpO1xuICAgIH1cbiAgICByZXR1cm4gQ1NQQnVmZmVyKHNpemUsIHsgZHJvcHBpbmc6IHRydWUsIHNsaWRpbmc6IGZhbHNlIH0pO1xuICB9LFxuICBzbGlkaW5nOiAoc2l6ZSA9IDEpID0+IHtcbiAgICBpZiAoc2l6ZSA8IDEpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignVGhlIHNsaWRpbmcgYnVmZmVyIHNob3VsZCBoYXZlIGF0IGxlYXN0IHNpemUgb2Ygb25lLicpO1xuICAgIH1cbiAgICByZXR1cm4gQ1NQQnVmZmVyKHNpemUsIHsgZHJvcHBpbmc6IGZhbHNlLCBzbGlkaW5nOiB0cnVlIH0pO1xuICB9LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgYnVmZmVyO1xuIiwiaW1wb3J0IHsgZ2V0SWQsIHNldFByb3AgfSBmcm9tICcuLi91dGlscyc7XG5pbXBvcnQgeyBDSEFOTkVMUywgbG9nZ2VyLCBncmlkLCBPUEVOLCByZWdpc3RlciB9IGZyb20gJy4uL2luZGV4JztcbmltcG9ydCBidWZmZXIgZnJvbSAnLi9idWYnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjaGFuKGlkLCBidWZmLCBwYXJlbnQgPSBudWxsKSB7XG4gIGxldCBzdGF0ZSA9IE9QRU47XG5cbiAgaWQgPSBpZCA/IGdldElkKGlkKSA6IGdldElkKCdjaCcpO1xuICBidWZmID0gYnVmZiB8fCBidWZmZXIuZml4ZWQoKTtcblxuICBpZiAoQ0hBTk5FTFMuZXhpc3RzKGlkKSkge1xuICAgIHRocm93IG5ldyBFcnJvcihgQ2hhbm5lbCB3aXRoIGlkIFwiJHtpZH1cIiBhbHJlYWR5IGV4aXN0cy5gKTtcbiAgfVxuXG4gIGNvbnN0IGNoYW5uZWwgPSBmdW5jdGlvbihzdHIsIG5hbWUpIHtcbiAgICBpZiAoc3RyLmxlbmd0aCA+IDEpIHtcbiAgICAgIHNldFByb3AoY2hhbm5lbCwgJ25hbWUnLCBzdHJbMF0gKyBuYW1lICsgc3RyWzFdKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2V0UHJvcChjaGFubmVsLCAnbmFtZScsIHN0clswXSk7XG4gICAgfVxuICAgIGxvZ2dlci5zZXRXaG9OYW1lKGNoYW5uZWwuaWQsIGNoYW5uZWwubmFtZSk7XG4gICAgcmV0dXJuIGNoYW5uZWw7XG4gIH07XG4gIGNoYW5uZWwuaWQgPSBpZDtcbiAgY2hhbm5lbFsnQGNoYW5uZWwnXSA9IHRydWU7XG4gIGNoYW5uZWwucGFyZW50ID0gcGFyZW50O1xuICBjb25zdCBhcGkgPSBDSEFOTkVMUy5zZXQoaWQsIGNoYW5uZWwpO1xuXG4gIGJ1ZmYucGFyZW50ID0gYXBpO1xuXG4gIGFwaS5pc0FjdGl2ZSA9ICgpID0+IGFwaS5zdGF0ZSgpID09PSBPUEVOO1xuICBhcGkuYnVmZiA9IGJ1ZmY7XG4gIGFwaS5zdGF0ZSA9IHMgPT4ge1xuICAgIGlmICh0eXBlb2YgcyAhPT0gJ3VuZGVmaW5lZCcpIHN0YXRlID0gcztcbiAgICByZXR1cm4gc3RhdGU7XG4gIH07XG4gIGFwaS52YWx1ZSA9ICgpID0+IGJ1ZmYuZ2V0VmFsdWUoKTtcbiAgYXBpLmJlZm9yZVB1dCA9IGJ1ZmYuYmVmb3JlUHV0O1xuICBhcGkuYWZ0ZXJQdXQgPSBidWZmLmFmdGVyUHV0O1xuICBhcGkuYmVmb3JlVGFrZSA9IGJ1ZmYuYmVmb3JlVGFrZTtcbiAgYXBpLmFmdGVyVGFrZSA9IGJ1ZmYuYWZ0ZXJUYWtlO1xuICBhcGkuZXhwb3J0QXMgPSBrZXkgPT4gcmVnaXN0ZXIoa2V5LCBhcGkpO1xuICBncmlkLmFkZChhcGkpO1xuICBsb2dnZXIubG9nKGFwaSwgJ0NIQU5ORUxfQ1JFQVRFRCcsIGFwaS52YWx1ZSgpKTtcblxuICByZXR1cm4gYXBpO1xufVxuIiwiLyogZXNsaW50LWRpc2FibGUgbm8tdXNlLWJlZm9yZS1kZWZpbmUsIG5vLXBhcmFtLXJlYXNzaWduICovXG5pbXBvcnQge1xuICBPUEVOLFxuICBDTE9TRUQsXG4gIEVOREVELFxuICBQVVQsXG4gIFRBS0UsXG4gIFNMRUVQLFxuICBOT09QLFxuICBDSEFOTkVMUyxcbiAgU1RPUCxcbiAgUkVBRCxcbiAgQ0FMTF9ST1VUSU5FLFxuICBGT1JLX1JPVVRJTkUsXG4gIE5PVEhJTkcsXG4gIE9ORV9PRixcbiAgQUxMX1JFUVVJUkVELFxuICBncmlkLFxuICBjaGFuLFxuICB1c2UsXG4gIGxvZ2dlcixcbn0gZnJvbSAnLi4vaW5kZXgnO1xuaW1wb3J0IHsgaXNQcm9taXNlLCBnZXRJZCwgZ2V0RnVuY05hbWUgfSBmcm9tICcuLi91dGlscyc7XG5pbXBvcnQgeyBub3JtYWxpemVDaGFubmVscywgbm9ybWFsaXplT3B0aW9ucywgbm9ybWFsaXplVG8gfSBmcm9tICcuL3V0aWxzJztcblxuY29uc3Qgbm9vcCA9ICgpID0+IHt9O1xuY29uc3Qgb3BzID0ge307XG5cbi8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogcHV0XG5cbm9wcy5zcHV0ID0gZnVuY3Rpb24gc3B1dChjaGFubmVscywgaXRlbSA9IG51bGwsIGNhbGxiYWNrID0gbm9vcCkge1xuICBjaGFubmVscyA9IG5vcm1hbGl6ZUNoYW5uZWxzKGNoYW5uZWxzKTtcbiAgY29uc3QgcmVzdWx0ID0gY2hhbm5lbHMubWFwKCgpID0+IE5PVEhJTkcpO1xuICBjb25zdCBzZXRSZXN1bHQgPSAoaWR4LCB2YWx1ZSkgPT4ge1xuICAgIHJlc3VsdFtpZHhdID0gdmFsdWU7XG4gICAgaWYgKCFyZXN1bHQuaW5jbHVkZXMoTk9USElORykpIHtcbiAgICAgIGNhbGxiYWNrKHJlc3VsdC5sZW5ndGggPT09IDEgPyByZXN1bHRbMF0gOiByZXN1bHQpO1xuICAgIH1cbiAgfTtcbiAgY2hhbm5lbHMuZm9yRWFjaCgoY2hhbm5lbCwgaWR4KSA9PiB7XG4gICAgY29uc3QgY2hTdGF0ZSA9IGNoYW5uZWwuc3RhdGUoKTtcbiAgICBpZiAoY2hTdGF0ZSAhPT0gT1BFTikge1xuICAgICAgc2V0UmVzdWx0KGlkeCwgY2hTdGF0ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNoYW5uZWwuYnVmZi5wdXQoaXRlbSwgcHV0UmVzdWx0ID0+IHNldFJlc3VsdChpZHgsIHB1dFJlc3VsdCkpO1xuICAgIH1cbiAgfSk7XG59O1xub3BzLnB1dCA9IGZ1bmN0aW9uIHB1dChjaGFubmVscywgaXRlbSkge1xuICByZXR1cm4geyBjaGFubmVscywgb3A6IFBVVCwgaXRlbSB9O1xufTtcblxuLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiB0YWtlXG5cbm9wcy5zdGFrZSA9IGZ1bmN0aW9uIHN0YWtlKGNoYW5uZWxzLCBjYWxsYmFjaywgb3B0aW9ucykge1xuICBjaGFubmVscyA9IG5vcm1hbGl6ZUNoYW5uZWxzKGNoYW5uZWxzKTtcbiAgb3B0aW9ucyA9IG5vcm1hbGl6ZU9wdGlvbnMob3B0aW9ucyk7XG4gIGNhbGxiYWNrID0gbm9ybWFsaXplVG8oY2FsbGJhY2spO1xuICBsZXQgdW5zdWJzY3JpYmVycztcbiAgaWYgKG9wdGlvbnMuc3RyYXRlZ3kgPT09IEFMTF9SRVFVSVJFRCkge1xuICAgIGNvbnN0IHJlc3VsdCA9IGNoYW5uZWxzLm1hcCgoKSA9PiBOT1RISU5HKTtcbiAgICBjb25zdCBzZXRSZXN1bHQgPSAoaWR4LCB2YWx1ZSkgPT4ge1xuICAgICAgcmVzdWx0W2lkeF0gPSB2YWx1ZTtcbiAgICAgIGlmICghcmVzdWx0LmluY2x1ZGVzKE5PVEhJTkcpKSB7XG4gICAgICAgIGNhbGxiYWNrKHJlc3VsdC5sZW5ndGggPT09IDEgPyByZXN1bHRbMF0gOiBbLi4ucmVzdWx0XSk7XG4gICAgICB9XG4gICAgfTtcbiAgICB1bnN1YnNjcmliZXJzID0gY2hhbm5lbHMubWFwKChjaGFubmVsLCBpZHgpID0+IHtcbiAgICAgIGNvbnN0IGNoU3RhdGUgPSBjaGFubmVsLnN0YXRlKCk7XG4gICAgICBpZiAoY2hTdGF0ZSA9PT0gRU5ERUQpIHtcbiAgICAgICAgc2V0UmVzdWx0KGlkeCwgY2hTdGF0ZSk7XG4gICAgICB9IGVsc2UgaWYgKGNoU3RhdGUgPT09IENMT1NFRCAmJiBjaGFubmVsLmJ1ZmYuaXNFbXB0eSgpKSB7XG4gICAgICAgIGNoYW5uZWwuc3RhdGUoRU5ERUQpO1xuICAgICAgICBzZXRSZXN1bHQoaWR4LCBFTkRFRCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gY2hhbm5lbC5idWZmLnRha2UoXG4gICAgICAgICAgdGFrZVJlc3VsdCA9PiBzZXRSZXN1bHQoaWR4LCB0YWtlUmVzdWx0KSxcbiAgICAgICAgICBvcHRpb25zXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0gZWxzZSBpZiAob3B0aW9ucy5zdHJhdGVneSA9PT0gT05FX09GKSB7XG4gICAgY29uc3QgZG9uZSA9ICguLi50YWtlUmVzdWx0KSA9PiB7XG4gICAgICAvLyBUaGlzIGZ1bmN0aW9uIGlzIGhlcmUgdG8gY2xlYW4gdXAgdGhlIHVucmVzb2x2ZWQgYnVmZmVyIHJlYWRlcnMuXG4gICAgICAvLyBJbiB0aGUgT05FX09GIHN0cmF0ZWd5IHRoZXJlIGFyZSBwZW5kaW5nIHJlYWRlcnMgdGhhdCBzaG91bGQgYmVcbiAgICAgIC8vIGtpbGxlZCBzaW5jZSBvbmUgb2YgdGhlIG90aGVycyBpbiB0aGUgbGlzdCBpcyBjYWxsZWQuIEFuZCB0aGlzXG4gICAgICAvLyBzaG91bGQgaGFwcGVuIG9ubHkgaWYgd2UgYXJlIG5vdCBsaXN0ZW5pbmcuXG4gICAgICBpZiAoIW9wdGlvbnMubGlzdGVuKSB7XG4gICAgICAgIHVuc3Vic2NyaWJlcnMuZmlsdGVyKGYgPT4gZikuZm9yRWFjaChmID0+IGYoKSk7XG4gICAgICB9XG4gICAgICBjYWxsYmFjayguLi50YWtlUmVzdWx0KTtcbiAgICB9O1xuICAgIHVuc3Vic2NyaWJlcnMgPSBjaGFubmVscy5tYXAoKGNoYW5uZWwsIGlkeCkgPT4ge1xuICAgICAgY29uc3QgY2hTdGF0ZSA9IGNoYW5uZWwuc3RhdGUoKTtcbiAgICAgIGlmIChjaFN0YXRlID09PSBFTkRFRCkge1xuICAgICAgICBkb25lKGNoU3RhdGUsIGlkeCk7XG4gICAgICB9IGVsc2UgaWYgKGNoU3RhdGUgPT09IENMT1NFRCAmJiBjaGFubmVsLmJ1ZmYuaXNFbXB0eSgpKSB7XG4gICAgICAgIGNoYW5uZWwuc3RhdGUoRU5ERUQpO1xuICAgICAgICBkb25lKEVOREVELCBpZHgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGNoYW5uZWwuYnVmZi50YWtlKHRha2VSZXN1bHQgPT4gZG9uZSh0YWtlUmVzdWx0LCBpZHgpLCBvcHRpb25zKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYFVucmVjb2duaXplZCBzdHJhdGVneSBcIiR7b3B0aW9ucy5zdHJhdGVneX1cImApO1xuICB9XG4gIHJldHVybiBmdW5jdGlvbiB1bnN1YnNjcmliZSgpIHtcbiAgICB1bnN1YnNjcmliZXJzLmZpbHRlcihmID0+IGYpLmZvckVhY2goZiA9PiBmKCkpO1xuICB9O1xufTtcbm9wcy50YWtlID0gZnVuY3Rpb24gdGFrZShjaGFubmVscywgb3B0aW9ucykge1xuICByZXR1cm4geyBjaGFubmVscywgb3A6IFRBS0UsIG9wdGlvbnMgfTtcbn07XG5cbi8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogcmVhZFxuXG5vcHMucmVhZCA9IGZ1bmN0aW9uIHJlYWQoY2hhbm5lbHMsIG9wdGlvbnMpIHtcbiAgcmV0dXJuIHsgY2hhbm5lbHMsIG9wOiBSRUFELCBvcHRpb25zOiB7IC4uLm9wdGlvbnMsIHJlYWQ6IHRydWUgfSB9O1xufTtcbm9wcy5zcmVhZCA9IGZ1bmN0aW9uIHNyZWFkKGNoYW5uZWxzLCB0bywgb3B0aW9ucykge1xuICByZXR1cm4gb3BzLnN0YWtlKGNoYW5uZWxzLCB0bywgeyAuLi5vcHRpb25zLCByZWFkOiB0cnVlIH0pO1xufTtcbm9wcy51bnN1YkFsbCA9IGZ1bmN0aW9uIHVuc3ViQWxsKGNoYW5uZWwpIHtcbiAgY2hhbm5lbC5idWZmLmRlbGV0ZUxpc3RlbmVycygpO1xufTtcblxuLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiBsaXN0ZW5cblxub3BzLmxpc3RlbiA9IGZ1bmN0aW9uIGxpc3RlbihjaGFubmVscywgdG8sIG9wdGlvbnMpIHtcbiAgcmV0dXJuIG9wcy5zdGFrZShjaGFubmVscywgdG8sIHsgLi4ub3B0aW9ucywgbGlzdGVuOiB0cnVlIH0pO1xufTtcblxuLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiBjbG9zZSwgcmVzZXQsIGNhbGwsIGZvcmssIG1lcmdlLCB0aW1lb3V0LCBpc0NoYW5uZWxcblxub3BzLmNsb3NlID0gZnVuY3Rpb24gY2xvc2UoY2hhbm5lbHMpIHtcbiAgY2hhbm5lbHMgPSBub3JtYWxpemVDaGFubmVscyhjaGFubmVscyk7XG4gIGNoYW5uZWxzLmZvckVhY2goY2ggPT4ge1xuICAgIGNvbnN0IG5ld1N0YXRlID0gY2guYnVmZi5pc0VtcHR5KCkgPyBFTkRFRCA6IENMT1NFRDtcbiAgICBjaC5zdGF0ZShuZXdTdGF0ZSk7XG4gICAgY2guYnVmZi5wdXRzLmZvckVhY2gocCA9PiBwLmNhbGxiYWNrKG5ld1N0YXRlKSk7XG4gICAgY2guYnVmZi5kZWxldGVMaXN0ZW5lcnMoKTtcbiAgICBjaC5idWZmLnRha2VzLmZvckVhY2godCA9PiB0LmNhbGxiYWNrKG5ld1N0YXRlKSk7XG4gICAgZ3JpZC5yZW1vdmUoY2gpO1xuICAgIENIQU5ORUxTLmRlbChjaC5pZCk7XG4gICAgbG9nZ2VyLmxvZyhjaCwgJ0NIQU5ORUxfQ0xPU0VEJyk7XG4gIH0pO1xuICByZXR1cm4geyBvcDogTk9PUCB9O1xufTtcbm9wcy5zY2xvc2UgPSBmdW5jdGlvbiBzY2xvc2UoaWQpIHtcbiAgcmV0dXJuIG9wcy5jbG9zZShpZCk7XG59O1xub3BzLmNoYW5uZWxSZXNldCA9IGZ1bmN0aW9uIGNoYW5uZWxSZXNldChjaGFubmVscykge1xuICBjaGFubmVscyA9IG5vcm1hbGl6ZUNoYW5uZWxzKGNoYW5uZWxzKTtcbiAgY2hhbm5lbHMuZm9yRWFjaChjaCA9PiB7XG4gICAgY2guc3RhdGUoT1BFTik7XG4gICAgY2guYnVmZi5yZXNldCgpO1xuICAgIGxvZ2dlci5sb2coY2gsICdDSEFOTkVMX1JFU0VUJyk7XG4gIH0pO1xuICByZXR1cm4geyBvcDogTk9PUCB9O1xufTtcbm9wcy5zY2hhbm5lbFJlc2V0ID0gZnVuY3Rpb24gc2NoYW5uZWxSZXNldChpZCkge1xuICBvcHMuY2hhbm5lbFJlc2V0KGlkKTtcbn07XG5vcHMuY2FsbCA9IGZ1bmN0aW9uIGNhbGwocm91dGluZSwgLi4uYXJncykge1xuICByZXR1cm4geyBvcDogQ0FMTF9ST1VUSU5FLCByb3V0aW5lLCBhcmdzIH07XG59O1xub3BzLmZvcmsgPSBmdW5jdGlvbiBmb3JrKHJvdXRpbmUsIC4uLmFyZ3MpIHtcbiAgcmV0dXJuIHsgb3A6IEZPUktfUk9VVElORSwgcm91dGluZSwgYXJncyB9O1xufTtcbm9wcy5tZXJnZSA9IGZ1bmN0aW9uIG1lcmdlKC4uLmNoYW5uZWxzKSB7XG4gIGNvbnN0IG5ld0NoID0gY2hhbigpO1xuXG4gIGNoYW5uZWxzLmZvckVhY2goY2ggPT4ge1xuICAgIChmdW5jdGlvbiB0YWtlcigpIHtcbiAgICAgIG9wcy5zdGFrZShjaCwgdiA9PiB7XG4gICAgICAgIGlmICh2ICE9PSBDTE9TRUQgJiYgdiAhPT0gRU5ERUQgJiYgbmV3Q2guc3RhdGUoKSA9PT0gT1BFTikge1xuICAgICAgICAgIG9wcy5zcHV0KG5ld0NoLCB2LCB0YWtlcik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pKCk7XG4gIH0pO1xuICByZXR1cm4gbmV3Q2g7XG59O1xub3BzLnRpbWVvdXQgPSBmdW5jdGlvbiB0aW1lb3V0KGludGVydmFsKSB7XG4gIGNvbnN0IGNoID0gY2hhbigpO1xuICBzZXRUaW1lb3V0KCgpID0+IG9wcy5jbG9zZShjaCksIGludGVydmFsKTtcbiAgcmV0dXJuIGNoO1xufTtcbm9wcy5pc0NoYW5uZWwgPSBjaCA9PiBjaCAmJiBjaFsnQGNoYW5uZWwnXSA9PT0gdHJ1ZTtcbm9wcy5pc1JpZXcgPSByID0+IHIgJiYgclsnQHJpZXcnXSA9PT0gdHJ1ZTtcbm9wcy5pc1N0YXRlID0gcyA9PiBzICYmIHNbJ0BzdGF0ZSddID09PSB0cnVlO1xub3BzLmlzUm91dGluZSA9IHIgPT4gciAmJiByWydAcm91dGluZSddID09PSB0cnVlO1xub3BzLnZlcmlmeUNoYW5uZWwgPSBmdW5jdGlvbiB2ZXJpZnlDaGFubmVsKGNoLCB0aHJvd0Vycm9yID0gdHJ1ZSkge1xuICBpZiAob3BzLmlzQ2hhbm5lbChjaCkpIHJldHVybiBjaDtcbiAgaWYgKHRocm93RXJyb3IpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICBgJHtjaH0ke1xuICAgICAgICB0eXBlb2YgY2ggIT09ICd1bmRlZmluZWQnID8gYCAoJHt0eXBlb2YgY2h9KWAgOiAnJ1xuICAgICAgfSBpcyBub3QgYSBjaGFubmVsLiR7XG4gICAgICAgIHR5cGVvZiBjaCA9PT0gJ3N0cmluZydcbiAgICAgICAgICA/IGAgRGlkIHlvdSBmb3JnZXQgdG8gZGVmaW5lIGl0P1xcbkV4YW1wbGU6IGNoYW4oXCIke2NofVwiKWBcbiAgICAgICAgICA6ICcnXG4gICAgICB9YFxuICAgICk7XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59O1xuXG4vLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqIGdvL3JvdXRpbmVcblxub3BzLmdvID0gZnVuY3Rpb24gZ28oZnVuYywgZG9uZSA9ICgpID0+IHt9LCBhcmdzID0gW10sIHBhcmVudCA9IG51bGwpIHtcbiAgY29uc3QgUlVOTklORyA9ICdSVU5OSU5HJztcbiAgY29uc3QgU1RPUFBFRCA9ICdTVE9QUEVEJztcbiAgbGV0IHN0YXRlID0gUlVOTklORztcbiAgY29uc3QgbmFtZSA9IGdldEZ1bmNOYW1lKGZ1bmMpO1xuXG4gIGNvbnN0IGFwaSA9IHtcbiAgICBpZDogZ2V0SWQoYHJvdXRpbmVfJHtuYW1lfWApLFxuICAgICdAcm91dGluZSc6IHRydWUsXG4gICAgcGFyZW50LFxuICAgIG5hbWUsXG4gICAgY2hpbGRyZW46IFtdLFxuICAgIHN0b3AoKSB7XG4gICAgICBzdGF0ZSA9IFNUT1BQRUQ7XG4gICAgICB0aGlzLmNoaWxkcmVuLmZvckVhY2gociA9PiByLnN0b3AoKSk7XG4gICAgICBncmlkLnJlbW92ZShhcGkpO1xuICAgICAgbG9nZ2VyLmxvZyhhcGksICdST1VUSU5FX1NUT1BQRUQnKTtcbiAgICB9LFxuICAgIHJlcnVuKCkge1xuICAgICAgZ2VuID0gZnVuYyguLi5hcmdzKTtcbiAgICAgIG5leHQoKTtcbiAgICAgIGxvZ2dlci5sb2codGhpcywgJ1JPVVRJTkVfUkVSVU4nKTtcbiAgICB9LFxuICB9O1xuICBjb25zdCBhZGRTdWJSb3V0aW5lID0gciA9PiBhcGkuY2hpbGRyZW4ucHVzaChyKTtcblxuICBsb2dnZXIubG9nKGFwaSwgJ1JPVVRJTkVfU1RBUlRFRCcpO1xuICBsZXQgZ2VuID0gZnVuYyguLi5hcmdzKTtcblxuICBmdW5jdGlvbiBwcm9jZXNzR2VuZXJhdG9yU3RlcChpKSB7XG4gICAgc3dpdGNoIChpLnZhbHVlLm9wKSB7XG4gICAgICBjYXNlIFBVVDpcbiAgICAgICAgb3BzLnNwdXQoaS52YWx1ZS5jaGFubmVscywgaS52YWx1ZS5pdGVtLCBuZXh0KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFRBS0U6XG4gICAgICAgIG9wcy5zdGFrZShcbiAgICAgICAgICBpLnZhbHVlLmNoYW5uZWxzLFxuICAgICAgICAgICguLi5uZXh0QXJncykgPT4ge1xuICAgICAgICAgICAgbmV4dChuZXh0QXJncy5sZW5ndGggPT09IDEgPyBuZXh0QXJnc1swXSA6IG5leHRBcmdzKTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGkudmFsdWUub3B0aW9uc1xuICAgICAgICApO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgTk9PUDpcbiAgICAgICAgbmV4dCgpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgU0xFRVA6XG4gICAgICAgIHNldFRpbWVvdXQobmV4dCwgaS52YWx1ZS5tcyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBTVE9QOlxuICAgICAgICBhcGkuc3RvcCgpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgUkVBRDpcbiAgICAgICAgb3BzLnNyZWFkKGkudmFsdWUuY2hhbm5lbHMsIG5leHQsIGkudmFsdWUub3B0aW9ucyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBDQUxMX1JPVVRJTkU6XG4gICAgICAgIGFkZFN1YlJvdXRpbmUob3BzLmdvKGkudmFsdWUucm91dGluZSwgbmV4dCwgaS52YWx1ZS5hcmdzLCBhcGkuaWQpKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIEZPUktfUk9VVElORTpcbiAgICAgICAgYWRkU3ViUm91dGluZShvcHMuZ28oaS52YWx1ZS5yb3V0aW5lLCAoKSA9PiB7fSwgaS52YWx1ZS5hcmdzLCBhcGkuaWQpKTtcbiAgICAgICAgbmV4dCgpO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5yZWNvZ25pemVkIG9wZXJhdGlvbiAke2kudmFsdWUub3B9IGZvciBhIHJvdXRpbmUuYCk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gbmV4dCh2YWx1ZSkge1xuICAgIGlmIChzdGF0ZSA9PT0gU1RPUFBFRCkgcmV0dXJuO1xuICAgIGNvbnN0IHN0ZXAgPSBnZW4ubmV4dCh2YWx1ZSk7XG4gICAgaWYgKHN0ZXAuZG9uZSA9PT0gdHJ1ZSkge1xuICAgICAgaWYgKGRvbmUpIGRvbmUoc3RlcC52YWx1ZSk7XG4gICAgICBpZiAoc3RlcC52YWx1ZSAmJiBzdGVwLnZhbHVlWydAZ28nXSA9PT0gdHJ1ZSkge1xuICAgICAgICBhcGkucmVydW4oKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGdyaWQucmVtb3ZlKGFwaSk7XG4gICAgICAgIGxvZ2dlci5sb2coYXBpLCAnUk9VVElORV9FTkQnKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGlzUHJvbWlzZShzdGVwLnZhbHVlKSkge1xuICAgICAgbG9nZ2VyLmxvZyhhcGksICdST1VUSU5FX0FTWU5DX0JFR0lOJyk7XG4gICAgICBzdGVwLnZhbHVlXG4gICAgICAgIC50aGVuKCguLi5hc3luY1Jlc3VsdCkgPT4ge1xuICAgICAgICAgIGxvZ2dlci5sb2coYXBpLCAnUk9VVElORV9BU1lOQ19FTkQnKTtcbiAgICAgICAgICBuZXh0KC4uLmFzeW5jUmVzdWx0KTtcbiAgICAgICAgfSlcbiAgICAgICAgLmNhdGNoKGVyciA9PiB7XG4gICAgICAgICAgbG9nZ2VyLmxvZyhhcGksICdST1VUSU5FX0FTWU5DX0VSUk9SJywgZXJyKTtcbiAgICAgICAgICBwcm9jZXNzR2VuZXJhdG9yU3RlcChnZW4udGhyb3coZXJyKSk7XG4gICAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBwcm9jZXNzR2VuZXJhdG9yU3RlcChzdGVwKTtcbiAgICB9XG4gIH1cblxuICBncmlkLmFkZChhcGkpO1xuICBuZXh0KCk7XG5cbiAgcmV0dXJuIGFwaTtcbn07XG5vcHMuZ29bJ0BnbyddID0gdHJ1ZTtcbm9wcy5nby53aXRoID0gKC4uLm1hcHMpID0+IHtcbiAgY29uc3QgcmVkdWNlZE1hcHMgPSBtYXBzLnJlZHVjZSgocmVzLCBpdGVtKSA9PiB7XG4gICAgaWYgKHR5cGVvZiBpdGVtID09PSAnc3RyaW5nJykge1xuICAgICAgcmVzID0geyAuLi5yZXMsIFtpdGVtXTogdXNlKGl0ZW0pIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlcyA9IHsgLi4ucmVzLCAuLi5pdGVtIH07XG4gICAgfVxuICAgIHJldHVybiByZXM7XG4gIH0sIHt9KTtcbiAgcmV0dXJuIChmdW5jLCBkb25lID0gKCkgPT4ge30sIC4uLmFyZ3MpID0+IHtcbiAgICBhcmdzLnB1c2gocmVkdWNlZE1hcHMpO1xuICAgIHJldHVybiBvcHMuZ28oZnVuYywgZG9uZSwgYXJncyk7XG4gIH07XG59O1xuXG5vcHMuc2xlZXAgPSBmdW5jdGlvbiBzbGVlcChtcywgY2FsbGJhY2spIHtcbiAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHNldFRpbWVvdXQoY2FsbGJhY2ssIG1zKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4geyBvcDogU0xFRVAsIG1zIH07XG4gIH1cbn07XG5cbm9wcy5zdG9wID0gZnVuY3Rpb24gc3RvcCgpIHtcbiAgcmV0dXJuIHsgb3A6IFNUT1AgfTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IG9wcztcbiIsImltcG9ydCB7IGdvLCBzcHV0LCBzY2xvc2UsIGdyaWQsIGxvZ2dlciwgY2hhbiwgYnVmZmVyIH0gZnJvbSAnLi4vaW5kZXgnO1xuaW1wb3J0IHsgZ2V0SWQsIGlzR2VuZXJhdG9yRnVuY3Rpb24sIHNldFByb3AgfSBmcm9tICcuLi91dGlscyc7XG5cbmNvbnN0IERFRkFVTFRfU0VMRUNUT1IgPSB2ID0+IHY7XG5jb25zdCBERUZBVUxUX1JFRFVDRVIgPSAoXywgdikgPT4gdjtcbmNvbnN0IERFRkFVTFRfRVJST1IgPSBlID0+IHtcbiAgdGhyb3cgZTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHN0YXRlKGluaXRpYWxWYWx1ZSwgcGFyZW50ID0gbnVsbCkge1xuICBsZXQgdmFsdWUgPSBpbml0aWFsVmFsdWU7XG4gIGNvbnN0IGlkID0gZ2V0SWQoJ3N0YXRlJyk7XG4gIGNvbnN0IGNoaWxkcmVuID0gW107XG5cbiAgZnVuY3Rpb24gc3luY0NoaWxkcmVuKGluaXRpYXRvcikge1xuICAgIGNoaWxkcmVuLmZvckVhY2goYyA9PiB7XG4gICAgICBpZiAoYy5pZCAhPT0gaW5pdGlhdG9yLmlkKSB7XG4gICAgICAgIHNwdXQoYywgeyB2YWx1ZSwgX19zeW5jaW5nOiB0cnVlIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgY29uc3QgYXBpID0gZnVuY3Rpb24oc3RyLCBuYW1lKSB7XG4gICAgaWYgKHN0ci5sZW5ndGggPiAxKSB7XG4gICAgICBzZXRQcm9wKGFwaSwgJ25hbWUnLCBzdHJbMF0gKyBuYW1lICsgc3RyWzFdKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2V0UHJvcChhcGksICduYW1lJywgc3RyWzBdKTtcbiAgICB9XG4gICAgbG9nZ2VyLnNldFdob05hbWUoYXBpLmlkLCBhcGkubmFtZSk7XG4gICAgcmV0dXJuIGFwaTtcbiAgfTtcblxuICBzZXRQcm9wKGFwaSwgJ25hbWUnLCAnc3RhdGUnKTtcblxuICBhcGkuaWQgPSBpZDtcbiAgYXBpWydAc3RhdGUnXSA9IHRydWU7XG4gIGFwaS5wYXJlbnQgPSBwYXJlbnQ7XG4gIGFwaS5jaGlsZHJlbiA9ICgpID0+IGNoaWxkcmVuO1xuICBhcGkuY2hhbiA9IChcbiAgICBzZWxlY3RvciA9IERFRkFVTFRfU0VMRUNUT1IsXG4gICAgcmVkdWNlciA9IERFRkFVTFRfUkVEVUNFUixcbiAgICBvbkVycm9yID0gREVGQVVMVF9FUlJPUlxuICApID0+IHtcbiAgICBjb25zdCBidWZmID0gYnVmZmVyLnNsaWRpbmcoMSk7XG4gICAgYnVmZi5zZXRWYWx1ZShbdmFsdWVdKTtcbiAgICBjb25zdCBjaCA9IGNoYW4oJ3NsaWRpbmcnLCBidWZmLCBpZCk7XG4gICAgY2guYWZ0ZXJUYWtlKChpdGVtLCBjYikgPT4ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKGlzR2VuZXJhdG9yRnVuY3Rpb24oc2VsZWN0b3IpKSB7XG4gICAgICAgICAgZ28oc2VsZWN0b3IsIHJvdXRpbmVSZXMgPT4gY2Iocm91dGluZVJlcyksIFtpdGVtXSwgaWQpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjYihzZWxlY3RvcihpdGVtKSk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIG9uRXJyb3IoZSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgY2guYmVmb3JlUHV0KChwYXlsb2FkLCBjYikgPT4ge1xuICAgICAgaWYgKFxuICAgICAgICBwYXlsb2FkICE9PSBudWxsICYmXG4gICAgICAgIHR5cGVvZiBwYXlsb2FkID09PSAnb2JqZWN0JyAmJlxuICAgICAgICAnX19zeW5jaW5nJyBpbiBwYXlsb2FkICYmXG4gICAgICAgIHBheWxvYWQuX19zeW5jaW5nXG4gICAgICApIHtcbiAgICAgICAgY2IocGF5bG9hZC52YWx1ZSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHRyeSB7XG4gICAgICAgIGlmIChpc0dlbmVyYXRvckZ1bmN0aW9uKHJlZHVjZXIpKSB7XG4gICAgICAgICAgZ28oXG4gICAgICAgICAgICByZWR1Y2VyLFxuICAgICAgICAgICAgZ2VuUmVzdWx0ID0+IHtcbiAgICAgICAgICAgICAgdmFsdWUgPSBnZW5SZXN1bHQ7XG4gICAgICAgICAgICAgIHN5bmNDaGlsZHJlbihjaCk7XG4gICAgICAgICAgICAgIGNiKHZhbHVlKTtcbiAgICAgICAgICAgICAgbG9nZ2VyLmxvZyhhcGksICdTVEFURV9WQUxVRV9TRVQnLCB2YWx1ZSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgW3ZhbHVlLCBwYXlsb2FkXSxcbiAgICAgICAgICAgIGlkXG4gICAgICAgICAgKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmFsdWUgPSByZWR1Y2VyKHZhbHVlLCBwYXlsb2FkKTtcbiAgICAgICAgc3luY0NoaWxkcmVuKGNoKTtcbiAgICAgICAgY2IodmFsdWUpO1xuICAgICAgICBsb2dnZXIubG9nKGFwaSwgJ1NUQVRFX1ZBTFVFX1NFVCcsIHZhbHVlKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgb25FcnJvcihlKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBjaGlsZHJlbi5wdXNoKGNoKTtcbiAgICByZXR1cm4gY2g7XG4gIH07XG4gIGFwaS5zZWxlY3QgPSAoc2VsZWN0b3IsIG9uRXJyb3IpID0+XG4gICAgYXBpLmNoYW4oc2VsZWN0b3IsIERFRkFVTFRfUkVEVUNFUiwgb25FcnJvcik7XG4gIGFwaS5tdXRhdGUgPSAocmVkdWNlciwgb25FcnJvcikgPT5cbiAgICBhcGkuY2hhbihERUZBVUxUX1NFTEVDVE9SLCByZWR1Y2VyLCBvbkVycm9yKTtcbiAgYXBpLmRlc3Ryb3kgPSAoKSA9PiB7XG4gICAgY2hpbGRyZW4uZm9yRWFjaChjaCA9PiBzY2xvc2UoY2gpKTtcbiAgICB2YWx1ZSA9IHVuZGVmaW5lZDtcbiAgICBncmlkLnJlbW92ZShhcGkpO1xuICAgIGxvZ2dlci5sb2coYXBpLCAnU1RBVEVfREVTVFJPWUVEJyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG4gIGFwaS5nZXQgPSAoKSA9PiB2YWx1ZTtcbiAgYXBpLnNldCA9IG5ld1ZhbHVlID0+IHtcbiAgICB2YWx1ZSA9IG5ld1ZhbHVlO1xuICAgIHN5bmNDaGlsZHJlbih7fSk7XG4gICAgbG9nZ2VyLmxvZyhhcGksICdTVEFURV9WQUxVRV9TRVQnLCBuZXdWYWx1ZSk7XG4gICAgcmV0dXJuIG5ld1ZhbHVlO1xuICB9O1xuXG4gIGxvZ2dlci5sb2coYXBpLCAnU1RBVEVfQ1JFQVRFRCcsIHZhbHVlKTtcblxuICBhcGkuREVGQVVMVCA9IGFwaS5jaGFuKClgZGVmYXVsdGA7XG5cbiAgZ3JpZC5hZGQoYXBpKTtcblxuICByZXR1cm4gYXBpO1xufVxuIiwiLyogZXNsaW50LWRpc2FibGUgbm8tcGFyYW0tcmVhc3NpZ24sIG5vLW11bHRpLWFzc2lnbiAqL1xuaW1wb3J0IHtcbiAgQUxMX1JFUVVJUkVELFxuICBpc0NoYW5uZWwsXG4gIGlzU3RhdGUsXG4gIHNwdXQsXG4gIHZlcmlmeUNoYW5uZWwsXG59IGZyb20gJy4uL2luZGV4JztcblxuZXhwb3J0IGZ1bmN0aW9uIG5vcm1hbGl6ZUNoYW5uZWxzKGNoYW5uZWxzKSB7XG4gIGlmICghQXJyYXkuaXNBcnJheShjaGFubmVscykpIGNoYW5uZWxzID0gW2NoYW5uZWxzXTtcbiAgcmV0dXJuIGNoYW5uZWxzLm1hcChjaCA9PiB7XG4gICAgaWYgKGlzU3RhdGUoY2gpKSByZXR1cm4gY2guREVGQVVMVDtcbiAgICByZXR1cm4gdmVyaWZ5Q2hhbm5lbChjaCk7XG4gIH0pO1xufVxuXG5jb25zdCBERUZBVUxUX09QVElPTlMgPSB7XG4gIG9uRXJyb3I6IG51bGwsXG4gIGluaXRpYWxDYWxsOiBmYWxzZSxcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBub3JtYWxpemVUbyh0bykge1xuICBpZiAoaXNDaGFubmVsKHRvKSkge1xuICAgIHJldHVybiB2ID0+IHNwdXQodG8sIHYpO1xuICB9XG4gIGlmICh0eXBlb2YgdG8gPT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gdG87XG4gIH1cbiAgdGhyb3cgbmV3IEVycm9yKFxuICAgIGAke3RvfSR7XG4gICAgICB0eXBlb2YgdG8gIT09ICd1bmRlZmluZWQnID8gYCAoJHt0eXBlb2YgdG99KWAgOiAnJ1xuICAgIH0gaXMgbm90IGEgY2hhbm5lbC4ke1xuICAgICAgdHlwZW9mIGNoID09PSAnc3RyaW5nJ1xuICAgICAgICA/IGAgRGlkIHlvdSBmb3JnZXQgdG8gZGVmaW5lIGl0P1xcbkV4YW1wbGU6IGNoYW4oXCIke3RvfVwiKWBcbiAgICAgICAgOiAnJ1xuICAgIH1gXG4gICk7XG59XG5leHBvcnQgZnVuY3Rpb24gbm9ybWFsaXplT3B0aW9ucyhvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IERFRkFVTFRfT1BUSU9OUztcbiAgY29uc3Qgb25FcnJvciA9IG9wdGlvbnMub25FcnJvciB8fCBERUZBVUxUX09QVElPTlMub25FcnJvcjtcbiAgY29uc3Qgc3RyYXRlZ3kgPSBvcHRpb25zLnN0cmF0ZWd5IHx8IEFMTF9SRVFVSVJFRDtcbiAgY29uc3QgbGlzdGVuID0gJ2xpc3RlbicgaW4gb3B0aW9ucyA/IG9wdGlvbnMubGlzdGVuIDogZmFsc2U7XG4gIGNvbnN0IHJlYWQgPSAncmVhZCcgaW4gb3B0aW9ucyA/IG9wdGlvbnMucmVhZCA6IGZhbHNlO1xuICBjb25zdCBpbml0aWFsQ2FsbCA9XG4gICAgJ2luaXRpYWxDYWxsJyBpbiBvcHRpb25zXG4gICAgICA/IG9wdGlvbnMuaW5pdGlhbENhbGxcbiAgICAgIDogREVGQVVMVF9PUFRJT05TLmluaXRpYWxDYWxsO1xuXG4gIHJldHVybiB7XG4gICAgb25FcnJvcixcbiAgICBzdHJhdGVneSxcbiAgICBpbml0aWFsQ2FsbCxcbiAgICBsaXN0ZW4sXG4gICAgcmVhZCxcbiAgICB1c2VyVGFrZUNhbGxiYWNrOiBvcHRpb25zLnVzZXJUYWtlQ2FsbGJhY2ssXG4gIH07XG59XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBHcmlkKCkge1xuICBjb25zdCBncmlkQVBJID0ge307XG4gIGxldCBub2RlcyA9IFtdO1xuXG4gIGdyaWRBUEkuYWRkID0gcHJvZHVjdCA9PiB7XG4gICAgaWYgKCFwcm9kdWN0IHx8ICFwcm9kdWN0LmlkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIGBFYWNoIG5vZGUgaW4gdGhlIGdyaWQgbXVzdCBiZSBhbiBvYmplY3Qgd2l0aCBcImlkXCIgZmllbGQuIEluc3RlYWQgXCIke3Byb2R1Y3R9XCIgZ2l2ZW4uYFxuICAgICAgKTtcbiAgICB9XG4gICAgbm9kZXMucHVzaChwcm9kdWN0KTtcbiAgfTtcbiAgZ3JpZEFQSS5yZW1vdmUgPSBwcm9kdWN0ID0+IHtcbiAgICBjb25zdCBpZHggPSBub2Rlcy5maW5kSW5kZXgoKHsgaWQgfSkgPT4gaWQgPT09IHByb2R1Y3QuaWQpO1xuXG4gICAgaWYgKGlkeCA+PSAwKSB7XG4gICAgICAvLyBzcGxpY2UgYmVjYXVzZSBvZiBodHRwczovL2tyYXNpbWlydHNvbmV2LmNvbS9ibG9nL2FydGljbGUvZm9yZWFjaC1vci1ub3QtdG8tZm9yZWFjaFxuICAgICAgbm9kZXMuc3BsaWNlKGlkeCwgMSk7XG4gICAgfVxuICB9O1xuICBncmlkQVBJLnJlc2V0ID0gKCkgPT4ge1xuICAgIG5vZGVzID0gW107XG4gIH07XG4gIGdyaWRBUEkubm9kZXMgPSAoKSA9PiBub2RlcztcbiAgZ3JpZEFQSS5nZXROb2RlQnlJZCA9IG5vZGVJZCA9PiBub2Rlcy5maW5kKCh7IGlkIH0pID0+IGlkID09PSBub2RlSWQpO1xuXG4gIHJldHVybiBncmlkQVBJO1xufVxuIiwiaW1wb3J0IFIgZnJvbSAnLi9yZWdpc3RyeSc7XG5pbXBvcnQgR3JpZCBmcm9tICcuL2dyaWQnO1xuaW1wb3J0IExvZ2dlciBmcm9tICcuL2xvZ2dlcic7XG5pbXBvcnQgeyByZXNldElkcyB9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHJlYWN0UmlldyBmcm9tICcuL3JlYWN0JztcbmltcG9ydCBiIGZyb20gJy4vY3NwL2J1Zic7XG5pbXBvcnQgYyBmcm9tICcuL2NzcC9jaGFubmVsJztcbmltcG9ydCBvcHMgZnJvbSAnLi9jc3Avb3BzJztcbmltcG9ydCBzIGZyb20gJy4vY3NwL3N0YXRlJztcbmltcG9ydCBpbnNwIGZyb20gJy4vaW5zcGVjdG9yJztcblxuZXhwb3J0IGNvbnN0IE9QRU4gPSBTeW1ib2woJ09QRU4nKTtcbmV4cG9ydCBjb25zdCBDTE9TRUQgPSBTeW1ib2woJ0NMT1NFRCcpO1xuZXhwb3J0IGNvbnN0IEVOREVEID0gU3ltYm9sKCdFTkRFRCcpO1xuZXhwb3J0IGNvbnN0IFBVVCA9ICdQVVQnO1xuZXhwb3J0IGNvbnN0IFRBS0UgPSAnVEFLRSc7XG5leHBvcnQgY29uc3QgTk9PUCA9ICdOT09QJztcbmV4cG9ydCBjb25zdCBTTEVFUCA9ICdTTEVFUCc7XG5leHBvcnQgY29uc3QgU1RPUCA9ICdTVE9QJztcbmV4cG9ydCBjb25zdCBSRUFEID0gJ1JFQUQnO1xuZXhwb3J0IGNvbnN0IENBTExfUk9VVElORSA9ICdDQUxMX1JPVVRJTkUnO1xuZXhwb3J0IGNvbnN0IEZPUktfUk9VVElORSA9ICdGT1JLX1JPVVRJTkUnO1xuZXhwb3J0IGNvbnN0IE5PVEhJTkcgPSBTeW1ib2woJ05PVEhJTkcnKTtcbmV4cG9ydCBjb25zdCBBTExfUkVRVUlSRUQgPSBTeW1ib2woJ0FMTF9SRVFVSVJFRCcpO1xuZXhwb3J0IGNvbnN0IE9ORV9PRiA9IFN5bWJvbCgnT05FX09GJyk7XG5cbmV4cG9ydCBjb25zdCBDSEFOTkVMUyA9IHtcbiAgY2hhbm5lbHM6IHt9LFxuICBnZXRBbGwoKSB7XG4gICAgcmV0dXJuIHRoaXMuY2hhbm5lbHM7XG4gIH0sXG4gIGdldChpZCkge1xuICAgIHJldHVybiB0aGlzLmNoYW5uZWxzW2lkXTtcbiAgfSxcbiAgc2V0KGlkLCBjaCkge1xuICAgIHRoaXMuY2hhbm5lbHNbaWRdID0gY2g7XG4gICAgcmV0dXJuIGNoO1xuICB9LFxuICBkZWwoaWQpIHtcbiAgICBkZWxldGUgdGhpcy5jaGFubmVsc1tpZF07XG4gIH0sXG4gIGV4aXN0cyhpZCkge1xuICAgIHJldHVybiAhIXRoaXMuY2hhbm5lbHNbaWRdO1xuICB9LFxuICByZXNldCgpIHtcbiAgICB0aGlzLmNoYW5uZWxzID0ge307XG4gIH0sXG59O1xuXG5leHBvcnQgY29uc3QgYnVmZmVyID0gYjtcbmV4cG9ydCBjb25zdCBjaGFuID0gYztcbmV4cG9ydCBjb25zdCBmaXhlZCA9IChzaXplID0gMCwgaWQgPSBudWxsLCBwYXJlbnQgPSBudWxsKSA9PlxuICBjaGFuKGlkIHx8ICdmaXhlZCcsIGJ1ZmZlci5maXhlZChzaXplKSwgcGFyZW50KTtcbmV4cG9ydCBjb25zdCBzbGlkaW5nID0gKHNpemUgPSAxLCBpZCA9IG51bGwsIHBhcmVudCA9IG51bGwpID0+XG4gIGNoYW4oaWQgfHwgJ3NsaWRpbmcnLCBidWZmZXIuc2xpZGluZyhzaXplKSwgcGFyZW50KTtcbmV4cG9ydCBjb25zdCBkcm9wcGluZyA9IChzaXplID0gMSwgaWQgPSBudWxsLCBwYXJlbnQgPSBudWxsKSA9PlxuICBjaGFuKGlkIHx8ICdkcm9wcGluZycsIGJ1ZmZlci5kcm9wcGluZyhzaXplKSwgcGFyZW50KTtcbmV4cG9ydCBjb25zdCBzdGF0ZSA9IHM7XG5cbmV4cG9ydCAqIGZyb20gJy4vcmlldyc7XG5cbmV4cG9ydCBjb25zdCByZWFjdCA9IHtcbiAgcmlldzogKC4uLmFyZ3MpID0+IHJlYWN0UmlldyguLi5hcmdzKSxcbn07XG5leHBvcnQgY29uc3QgdXNlID0gKG5hbWUsIC4uLmFyZ3MpID0+IFIucHJvZHVjZShuYW1lLCAuLi5hcmdzKTtcbmV4cG9ydCBjb25zdCByZWdpc3RlciA9IChuYW1lLCB3aGF0ZXZlcikgPT4ge1xuICBSLmRlZmluZVByb2R1Y3QobmFtZSwgKCkgPT4gd2hhdGV2ZXIpO1xuICByZXR1cm4gd2hhdGV2ZXI7XG59O1xuZXhwb3J0IGNvbnN0IGxvZ2dlciA9IG5ldyBMb2dnZXIoKTtcbmV4cG9ydCBjb25zdCBncmlkID0gbmV3IEdyaWQoKTtcbmV4cG9ydCBjb25zdCByZXNldCA9ICgpID0+IChcbiAgcmVzZXRJZHMoKSwgZ3JpZC5yZXNldCgpLCBSLnJlc2V0KCksIENIQU5ORUxTLnJlc2V0KCksIGxvZ2dlci5yZXNldCgpXG4pO1xuZXhwb3J0IGNvbnN0IHJlZ2lzdHJ5ID0gUjtcbmV4cG9ydCBjb25zdCBzcHV0ID0gb3BzLnNwdXQ7XG5leHBvcnQgY29uc3QgcHV0ID0gb3BzLnB1dDtcbmV4cG9ydCBjb25zdCBzdGFrZSA9IG9wcy5zdGFrZTtcbmV4cG9ydCBjb25zdCB0YWtlID0gb3BzLnRha2U7XG5leHBvcnQgY29uc3QgcmVhZCA9IG9wcy5yZWFkO1xuZXhwb3J0IGNvbnN0IHNyZWFkID0gb3BzLnNyZWFkO1xuZXhwb3J0IGNvbnN0IGxpc3RlbiA9IG9wcy5saXN0ZW47XG5leHBvcnQgY29uc3QgdW5zdWJBbGwgPSBvcHMudW5zdWJBbGw7XG5leHBvcnQgY29uc3QgY2xvc2UgPSBvcHMuY2xvc2U7XG5leHBvcnQgY29uc3Qgc2Nsb3NlID0gb3BzLnNjbG9zZTtcbmV4cG9ydCBjb25zdCBjaGFubmVsUmVzZXQgPSBvcHMuY2hhbm5lbFJlc2V0O1xuZXhwb3J0IGNvbnN0IHNjaGFubmVsUmVzZXQgPSBvcHMuc2NoYW5uZWxSZXNldDtcbmV4cG9ydCBjb25zdCBjYWxsID0gb3BzLmNhbGw7XG5leHBvcnQgY29uc3QgZm9yayA9IG9wcy5mb3JrO1xuZXhwb3J0IGNvbnN0IG1lcmdlID0gb3BzLm1lcmdlO1xuZXhwb3J0IGNvbnN0IHRpbWVvdXQgPSBvcHMudGltZW91dDtcbmV4cG9ydCBjb25zdCB2ZXJpZnlDaGFubmVsID0gb3BzLnZlcmlmeUNoYW5uZWw7XG5leHBvcnQgY29uc3QgaXNDaGFubmVsID0gb3BzLmlzQ2hhbm5lbDtcbmV4cG9ydCBjb25zdCBnZXRDaGFubmVsID0gb3BzLmdldENoYW5uZWw7XG5leHBvcnQgY29uc3QgaXNSaWV3ID0gb3BzLmlzUmlldztcbmV4cG9ydCBjb25zdCBpc1N0YXRlID0gb3BzLmlzU3RhdGU7XG5leHBvcnQgY29uc3QgaXNSb3V0aW5lID0gb3BzLmlzUm91dGluZTtcbmV4cG9ydCBjb25zdCBnbyA9IG9wcy5nbztcbmV4cG9ydCBjb25zdCBzbGVlcCA9IG9wcy5zbGVlcDtcbmV4cG9ydCBjb25zdCBzdG9wID0gb3BzLnN0b3A7XG5leHBvcnQgY29uc3QgaW5zcGVjdG9yID0gaW5zcChsb2dnZXIpO1xuIiwiLyogZXNsaW50LWRpc2FibGUgbm8tcmVzdHJpY3RlZC1nbG9iYWxzICovXG5jb25zdCBpc0RlZmluZWQgPSB3aGF0ID0+IHR5cGVvZiB3aGF0ICE9PSAndW5kZWZpbmVkJztcbmZ1bmN0aW9uIGdldE9yaWdpbigpIHtcbiAgaWYgKFxuICAgIGlzRGVmaW5lZChsb2NhdGlvbikgJiZcbiAgICBpc0RlZmluZWQobG9jYXRpb24ucHJvdG9jb2wpICYmXG4gICAgaXNEZWZpbmVkKGxvY2F0aW9uLmhvc3QpXG4gICkge1xuICAgIHJldHVybiBgJHtsb2NhdGlvbi5wcm90b2NvbH0vLyR7bG9jYXRpb24uaG9zdH1gO1xuICB9XG4gIHJldHVybiAndW5rbm93bic7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGluc3BlY3Rvcihsb2dnZXIpIHtcbiAgcmV0dXJuIChjYWxsYmFjayA9ICgpID0+IHt9LCBsb2dTbmFwc2hvdHNUb0NvbnNvbGUgPSBmYWxzZSkgPT4ge1xuICAgIGxvZ2dlci5lbmFibGUoKTtcbiAgICBsb2dnZXIub24oc25hcHNob3QgPT4ge1xuICAgICAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGlmIChsb2dTbmFwc2hvdHNUb0NvbnNvbGUpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnUmlldzppbnNwZWN0b3InLCBzbmFwc2hvdCk7XG4gICAgICAgIH1cbiAgICAgICAgY2FsbGJhY2soc25hcHNob3QpO1xuICAgICAgICB3aW5kb3cucG9zdE1lc3NhZ2UoXG4gICAgICAgICAge1xuICAgICAgICAgICAgdHlwZTogJ1JJRVdfU05BUFNIT1QnLFxuICAgICAgICAgICAgc291cmNlOiAncmlldycsXG4gICAgICAgICAgICBvcmlnaW46IGdldE9yaWdpbigpLFxuICAgICAgICAgICAgc25hcHNob3QsXG4gICAgICAgICAgICB0aW1lOiBuZXcgRGF0ZSgpLmdldFRpbWUoKSxcbiAgICAgICAgICB9LFxuICAgICAgICAgICcqJ1xuICAgICAgICApO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xufVxuIiwiLyogZXNsaW50LWRpc2FibGUgbm8tdXNlLWJlZm9yZS1kZWZpbmUgKi9cbmltcG9ydCB7IGlzQ2hhbm5lbCwgaXNSaWV3LCBpc1N0YXRlLCBpc1JvdXRpbmUgfSBmcm9tICcuL2luZGV4JztcbmltcG9ydCBzYW5pdGl6ZSBmcm9tICcuL3Nhbml0aXplJztcblxuY29uc3QgUklFVyA9ICdSSUVXJztcbmNvbnN0IFNUQVRFID0gJ1NUQVRFJztcbmNvbnN0IENIQU5ORUwgPSAnQ0hBTk5FTCc7XG5jb25zdCBST1VUSU5FID0gJ1JPVVRJTkUnO1xuXG5mdW5jdGlvbiBub3JtYWxpemVSaWV3KHIpIHtcbiAgcmV0dXJuIHtcbiAgICBpZDogci5pZCxcbiAgICBuYW1lOiByLm5hbWUsXG4gICAgdHlwZTogUklFVyxcbiAgICB2aWV3RGF0YTogc2FuaXRpemUoci5yZW5kZXJlci5kYXRhKCkpLFxuICAgIGNoaWxkcmVuOiByLmNoaWxkcmVuLm1hcChjaGlsZCA9PiB7XG4gICAgICBpZiAoaXNTdGF0ZShjaGlsZCkpIHtcbiAgICAgICAgcmV0dXJuIG5vcm1hbGl6ZVN0YXRlKGNoaWxkKTtcbiAgICAgIH1cbiAgICAgIGlmIChpc0NoYW5uZWwoY2hpbGQpKSB7XG4gICAgICAgIHJldHVybiBub3JtYWxpemVDaGFubmVsKGNoaWxkKTtcbiAgICAgIH1cbiAgICAgIGlmIChpc1JvdXRpbmUoY2hpbGQpKSB7XG4gICAgICAgIHJldHVybiBub3JtYWxpemVSb3V0aW5lKGNoaWxkKTtcbiAgICAgIH1cbiAgICAgIGNvbnNvbGUud2FybignUmlldyBsb2dnZXI6IHVucmVjb2duaXplZCByaWV3IGNoaWxkJywgY2hpbGQpO1xuICAgIH0pLFxuICB9O1xufVxuZnVuY3Rpb24gbm9ybWFsaXplU3RhdGUocykge1xuICByZXR1cm4ge1xuICAgIGlkOiBzLmlkLFxuICAgIG5hbWU6IHMubmFtZSxcbiAgICBwYXJlbnQ6IHMucGFyZW50LFxuICAgIHR5cGU6IFNUQVRFLFxuICAgIHZhbHVlOiBzYW5pdGl6ZShzLmdldCgpKSxcbiAgICBjaGlsZHJlbjogcy5jaGlsZHJlbigpLm1hcChjaGlsZCA9PiB7XG4gICAgICBpZiAoaXNDaGFubmVsKGNoaWxkKSkge1xuICAgICAgICByZXR1cm4gbm9ybWFsaXplQ2hhbm5lbChjaGlsZCk7XG4gICAgICB9XG4gICAgICBjb25zb2xlLndhcm4oJ1JpZXcgbG9nZ2VyOiB1bnJlY29nbml6ZWQgc3RhdGUgY2hpbGQnLCBjaGlsZCk7XG4gICAgfSksXG4gIH07XG59XG5mdW5jdGlvbiBub3JtYWxpemVDaGFubmVsKGMpIHtcbiAgY29uc3QgbyA9IHtcbiAgICBpZDogYy5pZCxcbiAgICBuYW1lOiBjLm5hbWUsXG4gICAgcGFyZW50OiBjLnBhcmVudCxcbiAgICB0eXBlOiBDSEFOTkVMLFxuICAgIHZhbHVlOiBzYW5pdGl6ZShjLnZhbHVlKCkpLFxuICAgIHB1dHM6IGMuYnVmZi5wdXRzLm1hcCgoeyBpdGVtIH0pID0+ICh7IGl0ZW0gfSkpLFxuICAgIHRha2VzOiBjLmJ1ZmYudGFrZXMubWFwKCh7IG9wdGlvbnMgfSkgPT4gKHtcbiAgICAgIHJlYWQ6IG9wdGlvbnMucmVhZCxcbiAgICAgIGxpc3Rlbjogb3B0aW9ucy5saXN0ZW4sXG4gICAgfSkpLFxuICB9O1xuICByZXR1cm4gbztcbn1cbmZ1bmN0aW9uIG5vcm1hbGl6ZVJvdXRpbmUocikge1xuICByZXR1cm4ge1xuICAgIGlkOiByLmlkLFxuICAgIHR5cGU6IFJPVVRJTkUsXG4gICAgbmFtZTogci5uYW1lLFxuICAgIHBhcmVudDogci5wYXJlbnQsXG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIExvZ2dlcigpIHtcbiAgY29uc3QgYXBpID0ge307XG4gIGxldCBmcmFtZXMgPSBbXTtcbiAgbGV0IGRhdGEgPSBbXTtcbiAgbGV0IGluUHJvZ3Jlc3MgPSBmYWxzZTtcbiAgbGV0IGVuYWJsZWQgPSBmYWxzZTtcbiAgY29uc3QgbGlzdGVuZXJzID0gW107XG5cbiAgYXBpLm9uID0gbGlzdGVuZXIgPT4gbGlzdGVuZXJzLnB1c2gobGlzdGVuZXIpO1xuICBhcGkubG9nID0gKHdobywgd2hhdCwgbWV0YSkgPT4ge1xuICAgIGlmICghZW5hYmxlZCkgcmV0dXJuIG51bGw7XG4gICAgaWYgKGlzUmlldyh3aG8pKSB7XG4gICAgICB3aG8gPSBub3JtYWxpemVSaWV3KHdobyk7XG4gICAgfSBlbHNlIGlmIChpc1N0YXRlKHdobykpIHtcbiAgICAgIHdobyA9IG5vcm1hbGl6ZVN0YXRlKHdobyk7XG4gICAgfSBlbHNlIGlmIChpc0NoYW5uZWwod2hvKSkge1xuICAgICAgd2hvID0gbm9ybWFsaXplQ2hhbm5lbCh3aG8pO1xuICAgIH0gZWxzZSBpZiAoaXNSb3V0aW5lKHdobykpIHtcbiAgICAgIHdobyA9IG5vcm1hbGl6ZVJvdXRpbmUod2hvKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS53YXJuKCdSaWV3IGxvZ2dlcjogdW5yZWNvZ25pemVkIHdobycsIHdobywgd2hhdCk7XG4gICAgfVxuICAgIGRhdGEucHVzaCh7XG4gICAgICB3aG8sXG4gICAgICB3aGF0LFxuICAgICAgbWV0YTogc2FuaXRpemUobWV0YSksXG4gICAgfSk7XG4gICAgaWYgKCFpblByb2dyZXNzKSB7XG4gICAgICBpblByb2dyZXNzID0gdHJ1ZTtcbiAgICAgIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgICBjb25zdCBzID0gYXBpLmZyYW1lKGRhdGEpO1xuICAgICAgICBpblByb2dyZXNzID0gZmFsc2U7XG4gICAgICAgIGRhdGEgPSBbXTtcbiAgICAgICAgbGlzdGVuZXJzLmZvckVhY2gobCA9PiBsKHMpKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcbiAgYXBpLmZyYW1lID0gYWN0aW9ucyA9PiB7XG4gICAgaWYgKCFlbmFibGVkKSByZXR1cm4gbnVsbDtcbiAgICBjb25zdCBmcmFtZSA9IHNhbml0aXplKGFjdGlvbnMpO1xuICAgIGZyYW1lcy5wdXNoKGZyYW1lKTtcbiAgICByZXR1cm4gZnJhbWU7XG4gIH07XG4gIGFwaS5ub3cgPSAoKSA9PiAoZnJhbWVzLmxlbmd0aCA+IDAgPyBmcmFtZXNbZnJhbWVzLmxlbmd0aCAtIDFdIDogbnVsbCk7XG4gIGFwaS5mcmFtZXMgPSAoKSA9PiBmcmFtZXM7XG4gIGFwaS5yZXNldCA9ICgpID0+IHtcbiAgICBmcmFtZXMgPSBbXTtcbiAgICBlbmFibGVkID0gZmFsc2U7XG4gIH07XG4gIGFwaS5lbmFibGUgPSAoKSA9PiB7XG4gICAgZW5hYmxlZCA9IHRydWU7XG4gIH07XG4gIGFwaS5kaXNhYmxlID0gKCkgPT4ge1xuICAgIGVuYWJsZWQgPSBmYWxzZTtcbiAgfTtcbiAgYXBpLnNldFdob05hbWUgPSAoaWQsIG5hbWUpID0+IHtcbiAgICBkYXRhLmZvckVhY2goYWN0aW9uID0+IHtcbiAgICAgIGlmIChhY3Rpb24ud2hvLmlkID09PSBpZCkge1xuICAgICAgICBhY3Rpb24ud2hvLm5hbWUgPSBuYW1lO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGZyYW1lcy5mb3JFYWNoKGZyYW1lID0+IHtcbiAgICAgIGZyYW1lLmZvckVhY2goYWN0aW9uID0+IHtcbiAgICAgICAgaWYgKGFjdGlvbi53aG8uaWQgPT09IGlkKSB7XG4gICAgICAgICAgYWN0aW9uLndoby5uYW1lID0gbmFtZTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH07XG5cbiAgcmV0dXJuIGFwaTtcbn1cbiIsIi8qIGVzbGludC1kaXNhYmxlICovXG5pbXBvcnQgUmVhY3QsIHsgdXNlU3RhdGUsIHVzZUVmZmVjdCwgdXNlUmVmIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgZ2V0RnVuY05hbWUgfSBmcm9tICcuLi91dGlscyc7XG5pbXBvcnQgeyBuYW1lZFJpZXcgfSBmcm9tICcuLi9pbmRleCc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHJpZXcoVmlldywgLi4ucm91dGluZXMpIHtcbiAgY29uc3QgbmFtZSA9IGdldEZ1bmNOYW1lKFZpZXcpO1xuICBjb25zdCBjcmVhdGVCcmlkZ2UgPSBmdW5jdGlvbihleHRlcm5hbHMgPSBbXSkge1xuICAgIGNvbnN0IGNvbXAgPSBmdW5jdGlvbihvdXRlclByb3BzKSB7XG4gICAgICBsZXQgW2luc3RhbmNlLCBzZXRJbnN0YW5jZV0gPSB1c2VTdGF0ZShudWxsKTtcbiAgICAgIGNvbnN0IFtjb250ZW50LCBzZXRDb250ZW50XSA9IHVzZVN0YXRlKG51bGwpO1xuICAgICAgY29uc3QgbW91bnRlZCA9IHVzZVJlZih0cnVlKTtcblxuICAgICAgLy8gdXBkYXRpbmcgcHJvcHNcbiAgICAgIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgICAgIGlmIChpbnN0YW5jZSkge1xuICAgICAgICAgIGluc3RhbmNlLnVwZGF0ZShvdXRlclByb3BzKTtcbiAgICAgICAgfVxuICAgICAgfSwgW291dGVyUHJvcHNdKTtcblxuICAgICAgLy8gbW91bnRpbmdcbiAgICAgIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgICAgIGluc3RhbmNlID0gbmFtZWRSaWV3KG5hbWUsIHByb3BzID0+IHtcbiAgICAgICAgICBpZiAoIW1vdW50ZWQpIHJldHVybjtcbiAgICAgICAgICBpZiAocHJvcHMgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHNldENvbnRlbnQobnVsbCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNldENvbnRlbnQocHJvcHMpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSwgLi4ucm91dGluZXMpO1xuXG4gICAgICAgIGlmIChleHRlcm5hbHMgJiYgZXh0ZXJuYWxzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBpbnN0YW5jZSA9IGluc3RhbmNlLndpdGgoLi4uZXh0ZXJuYWxzKTtcbiAgICAgICAgfVxuICAgICAgICBpbnN0YW5jZS5uYW1lID0gbmFtZTtcblxuICAgICAgICBzZXRJbnN0YW5jZShpbnN0YW5jZSk7XG4gICAgICAgIGluc3RhbmNlLm1vdW50KG91dGVyUHJvcHMpO1xuICAgICAgICBtb3VudGVkLmN1cnJlbnQgPSB0cnVlO1xuXG4gICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICBtb3VudGVkLmN1cnJlbnQgPSBmYWxzZTtcbiAgICAgICAgICBpbnN0YW5jZS51bm1vdW50KCk7XG4gICAgICAgIH07XG4gICAgICB9LCBbXSk7XG5cbiAgICAgIHJldHVybiBjb250ZW50ID09PSBudWxsID8gbnVsbCA6IFJlYWN0LmNyZWF0ZUVsZW1lbnQoVmlldywgY29udGVudCk7XG4gICAgfTtcblxuICAgIGNvbXAuZGlzcGxheU5hbWUgPSBgUmlld18ke25hbWV9YDtcbiAgICBjb21wLndpdGggPSAoLi4ubWFwcykgPT4gY3JlYXRlQnJpZGdlKG1hcHMpO1xuXG4gICAgcmV0dXJuIGNvbXA7XG4gIH07XG5cbiAgcmV0dXJuIGNyZWF0ZUJyaWRnZSgpO1xufVxuIiwiLyogZXNsaW50LWRpc2FibGUgbm8tdXNlLWJlZm9yZS1kZWZpbmUgKi9cbmZ1bmN0aW9uIFJlZ2lzdHJ5KCkge1xuICBjb25zdCBhcGkgPSB7fTtcbiAgbGV0IHByb2R1Y3RzID0ge307XG5cbiAgYXBpLmRlZmluZVByb2R1Y3QgPSAodHlwZSwgZnVuYykgPT4ge1xuICAgIGlmIChwcm9kdWN0c1t0eXBlXSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBBIHJlc291cmNlIHdpdGggdHlwZSBcIiR7dHlwZX1cIiBhbHJlYWR5IGV4aXN0cy5gKTtcbiAgICB9XG4gICAgcHJvZHVjdHNbdHlwZV0gPSBmdW5jO1xuICB9O1xuICBhcGkudW5kZWZpbmVQcm9kdWN0ID0gdHlwZSA9PiB7XG4gICAgaWYgKCFwcm9kdWN0c1t0eXBlXSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICBgVGhlcmUgaXMgbm8gcmVzb3VyY2Ugd2l0aCB0eXBlIFwiJHt0eXBlfVwiIHRvIGJlIHJlbW92ZWQuYFxuICAgICAgKTtcbiAgICB9XG4gICAgZGVsZXRlIHByb2R1Y3RzW3R5cGVdO1xuICB9O1xuICBhcGkucHJvZHVjZSA9ICh0eXBlLCAuLi5hcmdzKSA9PiB7XG4gICAgaWYgKCFwcm9kdWN0c1t0eXBlXSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBUaGVyZSBpcyBubyByZXNvdXJjZSB3aXRoIHR5cGUgXCIke3R5cGV9XCIuYCk7XG4gICAgfVxuICAgIHJldHVybiBwcm9kdWN0c1t0eXBlXSguLi5hcmdzKTtcbiAgfTtcbiAgYXBpLnJlc2V0ID0gKCkgPT4ge1xuICAgIHByb2R1Y3RzID0ge307XG4gIH07XG4gIGFwaS5kZWJ1ZyA9ICgpID0+ICh7XG4gICAgcHJvZHVjdE5hbWVzOiBPYmplY3Qua2V5cyhwcm9kdWN0cyksXG4gIH0pO1xuXG4gIHJldHVybiBhcGk7XG59XG5cbmNvbnN0IHIgPSBSZWdpc3RyeSgpO1xuXG5leHBvcnQgZGVmYXVsdCByO1xuIiwiLyogZXNsaW50LWRpc2FibGUgbm8tcGFyYW0tcmVhc3NpZ24sIG5vLXVzZS1iZWZvcmUtZGVmaW5lICovXG5cbmltcG9ydCB7XG4gIHVzZSxcbiAgc3RhdGUgYXMgU3RhdGUsXG4gIGlzU3RhdGUsXG4gIGdvLFxuICBsaXN0ZW4sXG4gIGNsb3NlLFxuICBzcHV0LFxuICBncmlkLFxuICBsb2dnZXIsXG4gIGlzUm91dGluZSxcbiAgQ0xPU0VELFxuICBFTkRFRCxcbiAgdmVyaWZ5Q2hhbm5lbCxcbiAgc2xpZGluZyBhcyBTbGlkaW5nLFxuICBmaXhlZCBhcyBGaXhlZCxcbiAgZHJvcHBpbmcgYXMgRHJvcHBpbmcsXG4gIGlzQ2hhbm5lbCxcbn0gZnJvbSAnLi9pbmRleCc7XG5pbXBvcnQge1xuICBpc09iamVjdEVtcHR5LFxuICBnZXRGdW5jTmFtZSxcbiAgZ2V0SWQsXG4gIHJlcXVpcmVPYmplY3QsXG4gIGFjY3VtdWxhdGUsXG59IGZyb20gJy4vdXRpbHMnO1xuXG5jb25zdCBSZW5kZXJlciA9IGZ1bmN0aW9uKHB1c2hEYXRhVG9WaWV3KSB7XG4gIGxldCBkYXRhID0ge307XG4gIGxldCBpblByb2dyZXNzID0gZmFsc2U7XG4gIGxldCBhY3RpdmUgPSB0cnVlO1xuXG4gIHJldHVybiB7XG4gICAgcHVzaChuZXdEYXRhKSB7XG4gICAgICBpZiAobmV3RGF0YSA9PT0gQ0xPU0VEIHx8IG5ld0RhdGEgPT09IEVOREVEKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGRhdGEgPSBhY2N1bXVsYXRlKGRhdGEsIG5ld0RhdGEpO1xuICAgICAgaWYgKCFpblByb2dyZXNzKSB7XG4gICAgICAgIGluUHJvZ3Jlc3MgPSB0cnVlO1xuICAgICAgICBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IHtcbiAgICAgICAgICBpZiAoYWN0aXZlKSB7XG4gICAgICAgICAgICBwdXNoRGF0YVRvVmlldyhkYXRhKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaW5Qcm9ncmVzcyA9IGZhbHNlO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGRlc3Ryb3koKSB7XG4gICAgICBhY3RpdmUgPSBmYWxzZTtcbiAgICB9LFxuICAgIGRhdGEoKSB7XG4gICAgICByZXR1cm4gZGF0YTtcbiAgICB9LFxuICB9O1xufTtcbmV4cG9ydCBmdW5jdGlvbiByaWV3KHZpZXdGdW5jLCAuLi5yb3V0aW5lcykge1xuICBjb25zdCBuYW1lID0gZ2V0RnVuY05hbWUodmlld0Z1bmMpO1xuICByZXR1cm4gbmFtZWRSaWV3KG5hbWUsIHZpZXdGdW5jLCAuLi5yb3V0aW5lcyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBuYW1lZFJpZXcobmFtZSwgdmlld0Z1bmMsIC4uLnJvdXRpbmVzKSB7XG4gIGNvbnN0IHJlbmRlcmVyID0gUmVuZGVyZXIodmFsdWUgPT4ge1xuICAgIHZpZXdGdW5jKHZhbHVlKTtcbiAgICBsb2dnZXIubG9nKGFwaSwgJ1JJRVdfUkVOREVSRUQnLCB2YWx1ZSk7XG4gIH0pO1xuICBjb25zdCBpZCA9IGdldElkKGAke25hbWV9X3JpZXdgKTtcbiAgY29uc3QgYXBpID0ge1xuICAgIGlkLFxuICAgIG5hbWUsXG4gICAgJ0ByaWV3JzogdHJ1ZSxcbiAgICBjaGlsZHJlbjogW10sXG4gICAgcmVuZGVyZXIsXG4gIH07XG4gIGxldCBjbGVhbnVwcyA9IFtdO1xuICBsZXQgZXh0ZXJuYWxzID0ge307XG4gIGxldCBzdWJzY3JpcHRpb25zID0ge307XG4gIGNvbnN0IGFkZENoaWxkID0gZnVuY3Rpb24obykge1xuICAgIGFwaS5jaGlsZHJlbi5wdXNoKG8pO1xuICAgIHJldHVybiBvO1xuICB9O1xuICBjb25zdCBzdGF0ZSA9IGluaXRpYWxWYWx1ZSA9PiBhZGRDaGlsZChTdGF0ZShpbml0aWFsVmFsdWUsIGlkKSk7XG4gIGNvbnN0IHNsaWRpbmcgPSBuID0+IGFkZENoaWxkKFNsaWRpbmcobiwgYHNsaWRpbmdfJHtuYW1lfWAsIGlkKSk7XG4gIGNvbnN0IGZpeGVkID0gbiA9PiBhZGRDaGlsZChGaXhlZChuLCBgZml4ZWRfJHtuYW1lfWAsIGlkKSk7XG4gIGNvbnN0IGRyb3BwaW5nID0gbiA9PiBhZGRDaGlsZChEcm9wcGluZyhuLCBgZHJvcHBpbmdfJHtuYW1lfWAsIGlkKSk7XG4gIGNvbnN0IHN1YnNjcmliZSA9IGZ1bmN0aW9uKHRvLCBmdW5jKSB7XG4gICAgaWYgKCEodG8uaWQgaW4gc3Vic2NyaXB0aW9ucykpIHtcbiAgICAgIHN1YnNjcmlwdGlvbnNbdG8uaWRdID0gbGlzdGVuKHRvLCBmdW5jLCB7IGluaXRpYWxDYWxsOiB0cnVlIH0pO1xuICAgIH1cbiAgfTtcbiAgY29uc3QgVklFV19DSEFOTkVMID0gc2xpZGluZygxKWB2aWV3YDtcbiAgY29uc3QgUFJPUFNfQ0hBTk5FTCA9IHNsaWRpbmcoMSlgcHJvcHNgO1xuXG4gIGNvbnN0IG5vcm1hbGl6ZVJlbmRlckRhdGEgPSB2YWx1ZSA9PlxuICAgIE9iamVjdC5rZXlzKHZhbHVlKS5yZWR1Y2UoKG9iaiwga2V5KSA9PiB7XG4gICAgICBjb25zdCBjaCA9IHZlcmlmeUNoYW5uZWwodmFsdWVba2V5XSwgZmFsc2UpO1xuICAgICAgaWYgKGNoICE9PSBudWxsKSB7XG4gICAgICAgIHN1YnNjcmliZShjaCwgdiA9PiBzcHV0KFZJRVdfQ0hBTk5FTCwgeyBba2V5XTogdiB9KSk7XG4gICAgICB9IGVsc2UgaWYgKGlzU3RhdGUodmFsdWVba2V5XSkpIHtcbiAgICAgICAgc3Vic2NyaWJlKHZhbHVlW2tleV0uREVGQVVMVCwgdiA9PiBzcHV0KFZJRVdfQ0hBTk5FTCwgeyBba2V5XTogdiB9KSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvYmpba2V5XSA9IHZhbHVlW2tleV07XG4gICAgICB9XG4gICAgICByZXR1cm4gb2JqO1xuICAgIH0sIHt9KTtcblxuICBhcGkubW91bnQgPSBmdW5jdGlvbihwcm9wcyA9IHt9KSB7XG4gICAgcmVxdWlyZU9iamVjdChwcm9wcyk7XG4gICAgc3B1dChQUk9QU19DSEFOTkVMLCBwcm9wcyk7XG4gICAgc3Vic2NyaWJlKFBST1BTX0NIQU5ORUwsIG5ld1Byb3BzID0+IHtcbiAgICAgIHNwdXQoVklFV19DSEFOTkVMLCBuZXdQcm9wcyk7XG4gICAgfSk7XG4gICAgc3Vic2NyaWJlKFZJRVdfQ0hBTk5FTCwgcmVuZGVyZXIucHVzaCk7XG4gICAgYXBpLmNoaWxkcmVuID0gYXBpLmNoaWxkcmVuLmNvbmNhdChcbiAgICAgIHJvdXRpbmVzLm1hcChyID0+XG4gICAgICAgIGdvKFxuICAgICAgICAgIHIsXG4gICAgICAgICAgcmVzdWx0ID0+IHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgcmVzdWx0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgIGNsZWFudXBzLnB1c2gocmVzdWx0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgcmVuZGVyOiB2YWx1ZSA9PiB7XG4gICAgICAgICAgICAgICAgcmVxdWlyZU9iamVjdCh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgc3B1dChWSUVXX0NIQU5ORUwsIG5vcm1hbGl6ZVJlbmRlckRhdGEodmFsdWUpKTtcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgc3RhdGUsXG4gICAgICAgICAgICAgIGZpeGVkLFxuICAgICAgICAgICAgICBzbGlkaW5nLFxuICAgICAgICAgICAgICBkcm9wcGluZyxcbiAgICAgICAgICAgICAgcHJvcHM6IFBST1BTX0NIQU5ORUwsXG4gICAgICAgICAgICAgIC4uLmV4dGVybmFscyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgICBpZFxuICAgICAgICApXG4gICAgICApXG4gICAgKTtcbiAgICBpZiAoIWlzT2JqZWN0RW1wdHkoZXh0ZXJuYWxzKSkge1xuICAgICAgc3B1dChWSUVXX0NIQU5ORUwsIG5vcm1hbGl6ZVJlbmRlckRhdGEoZXh0ZXJuYWxzKSk7XG4gICAgfVxuICAgIGxvZ2dlci5sb2coYXBpLCAnUklFV19NT1VOVEVEJywgcHJvcHMpO1xuICB9O1xuXG4gIGFwaS51bm1vdW50ID0gZnVuY3Rpb24oKSB7XG4gICAgY2xlYW51cHMuZm9yRWFjaChjID0+IGMoKSk7XG4gICAgY2xlYW51cHMgPSBbXTtcbiAgICBPYmplY3Qua2V5cyhzdWJzY3JpcHRpb25zKS5mb3JFYWNoKHN1YklkID0+IHtcbiAgICAgIHN1YnNjcmlwdGlvbnNbc3ViSWRdKCk7XG4gICAgfSk7XG4gICAgc3Vic2NyaXB0aW9ucyA9IHt9O1xuICAgIGFwaS5jaGlsZHJlbi5mb3JFYWNoKGMgPT4ge1xuICAgICAgaWYgKGlzU3RhdGUoYykpIHtcbiAgICAgICAgYy5kZXN0cm95KCk7XG4gICAgICB9IGVsc2UgaWYgKGlzUm91dGluZShjKSkge1xuICAgICAgICBjLnN0b3AoKTtcbiAgICAgIH0gZWxzZSBpZiAoaXNDaGFubmVsKGMpKSB7XG4gICAgICAgIGNsb3NlKGMpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGFwaS5jaGlsZHJlbiA9IFtdO1xuICAgIHJlbmRlcmVyLmRlc3Ryb3koKTtcbiAgICBncmlkLnJlbW92ZShhcGkpO1xuICAgIGxvZ2dlci5sb2coYXBpLCAnUklFV19VTk1PVU5URUQnKTtcbiAgfTtcblxuICBhcGkudXBkYXRlID0gZnVuY3Rpb24ocHJvcHMgPSB7fSkge1xuICAgIHJlcXVpcmVPYmplY3QocHJvcHMpO1xuICAgIHNwdXQoUFJPUFNfQ0hBTk5FTCwgcHJvcHMpO1xuICAgIGxvZ2dlci5sb2coYXBpLCAnUklFV19VUERBVEVEJywgcHJvcHMpO1xuICB9O1xuXG4gIGFwaS53aXRoID0gKC4uLm1hcHMpID0+IHtcbiAgICBhcGkuX19zZXRFeHRlcm5hbHMobWFwcyk7XG4gICAgcmV0dXJuIGFwaTtcbiAgfTtcblxuICBhcGkudGVzdCA9IG1hcCA9PiB7XG4gICAgY29uc3QgbmV3SW5zdGFuY2UgPSByaWV3KHZpZXdGdW5jLCAuLi5yb3V0aW5lcyk7XG5cbiAgICBuZXdJbnN0YW5jZS5fX3NldEV4dGVybmFscyhbbWFwXSk7XG4gICAgcmV0dXJuIG5ld0luc3RhbmNlO1xuICB9O1xuXG4gIGFwaS5fX3NldEV4dGVybmFscyA9IG1hcHMgPT4ge1xuICAgIGNvbnN0IHJlZHVjZWRNYXBzID0gbWFwcy5yZWR1Y2UoKHJlcywgaXRlbSkgPT4ge1xuICAgICAgaWYgKHR5cGVvZiBpdGVtID09PSAnc3RyaW5nJykge1xuICAgICAgICByZXMgPSB7IC4uLnJlcywgW2l0ZW1dOiB1c2UoaXRlbSkgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlcyA9IHsgLi4ucmVzLCAuLi5pdGVtIH07XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzO1xuICAgIH0sIHt9KTtcbiAgICBleHRlcm5hbHMgPSB7IC4uLmV4dGVybmFscywgLi4ucmVkdWNlZE1hcHMgfTtcbiAgfTtcblxuICBncmlkLmFkZChhcGkpO1xuICBsb2dnZXIubG9nKGFwaSwgJ1JJRVdfQ1JFQVRFRCcpO1xuXG4gIHJldHVybiBhcGk7XG59XG4iLCJpbXBvcnQgQ2lyY3VsYXJKU09OIGZyb20gJy4vdmVuZG9ycy9DaXJjdWxhckpTT04nO1xuaW1wb3J0IFNlcmlhbGl6ZUVycm9yIGZyb20gJy4vdmVuZG9ycy9TZXJpYWxpemVFcnJvcic7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHNhbml0aXplKHNvbWV0aGluZywgc2hvd0Vycm9ySW5Db25zb2xlID0gZmFsc2UpIHtcbiAgbGV0IHJlc3VsdDtcblxuICB0cnkge1xuICAgIHJlc3VsdCA9IEpTT04ucGFyc2UoXG4gICAgICBDaXJjdWxhckpTT04uc3RyaW5naWZ5KFxuICAgICAgICBzb21ldGhpbmcsXG4gICAgICAgIGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcbiAgICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICByZXR1cm4gdmFsdWUubmFtZSA9PT0gJydcbiAgICAgICAgICAgICAgPyAnPGFub255bW91cz4nXG4gICAgICAgICAgICAgIDogYGZ1bmN0aW9uICR7dmFsdWUubmFtZX0oKWA7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgICAgICByZXR1cm4gU2VyaWFsaXplRXJyb3IodmFsdWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgIH0sXG4gICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgdHJ1ZVxuICAgICAgKVxuICAgICk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgaWYgKHNob3dFcnJvckluQ29uc29sZSkge1xuICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgIH1cbiAgICByZXN1bHQgPSBudWxsO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG4iLCIvKiBlc2xpbnQtZGlzYWJsZSAqL1xuLyohXG5Db3B5cmlnaHQgKEMpIDIwMTMtMjAxNyBieSBBbmRyZWEgR2lhbW1hcmNoaSAtIEBXZWJSZWZsZWN0aW9uXG5cblBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbm9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbmluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbnRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbmNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcblxuVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbmFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuXG5USEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG5JTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbkZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbk9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cblRIRSBTT0ZUV0FSRS5cblxuKi9cbnZhclxuLy8gc2hvdWxkIGJlIGEgbm90IHNvIGNvbW1vbiBjaGFyXG4vLyBwb3NzaWJseSBvbmUgSlNPTiBkb2VzIG5vdCBlbmNvZGVcbi8vIHBvc3NpYmx5IG9uZSBlbmNvZGVVUklDb21wb25lbnQgZG9lcyBub3QgZW5jb2RlXG4vLyByaWdodCBub3cgdGhpcyBjaGFyIGlzICd+JyBidXQgdGhpcyBtaWdodCBjaGFuZ2UgaW4gdGhlIGZ1dHVyZVxuc3BlY2lhbENoYXIgPSAnficsXG5zYWZlU3BlY2lhbENoYXIgPSAnXFxcXHgnICsgKFxuICAnMCcgKyBzcGVjaWFsQ2hhci5jaGFyQ29kZUF0KDApLnRvU3RyaW5nKDE2KVxuKS5zbGljZSgtMiksXG5lc2NhcGVkU2FmZVNwZWNpYWxDaGFyID0gJ1xcXFwnICsgc2FmZVNwZWNpYWxDaGFyLFxuc3BlY2lhbENoYXJSRyA9IG5ldyBSZWdFeHAoc2FmZVNwZWNpYWxDaGFyLCAnZycpLFxuc2FmZVNwZWNpYWxDaGFyUkcgPSBuZXcgUmVnRXhwKGVzY2FwZWRTYWZlU3BlY2lhbENoYXIsICdnJyksXG5cbnNhZmVTdGFydFdpdGhTcGVjaWFsQ2hhclJHID0gbmV3IFJlZ0V4cCgnKD86XnwoW15cXFxcXFxcXF0pKScgKyBlc2NhcGVkU2FmZVNwZWNpYWxDaGFyKSxcblxuaW5kZXhPZiA9IFtdLmluZGV4T2YgfHwgZnVuY3Rpb24odil7XG4gIGZvcih2YXIgaT10aGlzLmxlbmd0aDtpLS0mJnRoaXNbaV0hPT12Oyk7XG4gIHJldHVybiBpO1xufSxcbiRTdHJpbmcgPSBTdHJpbmcgIC8vIHRoZXJlJ3Mgbm8gd2F5IHRvIGRyb3Agd2FybmluZ3MgaW4gSlNIaW50XG4gICAgICAgICAgICAgICAgICAvLyBhYm91dCBuZXcgU3RyaW5nIC4uLiB3ZWxsLCBJIG5lZWQgdGhhdCBoZXJlIVxuICAgICAgICAgICAgICAgICAgLy8gZmFrZWQsIGFuZCBoYXBweSBsaW50ZXIhXG47XG5cbmZ1bmN0aW9uIGdlbmVyYXRlUmVwbGFjZXIodmFsdWUsIHJlcGxhY2VyLCByZXNvbHZlKSB7XG52YXJcbiAgaW5zcGVjdCA9ICEhcmVwbGFjZXIsXG4gIHBhdGggPSBbXSxcbiAgYWxsICA9IFt2YWx1ZV0sXG4gIHNlZW4gPSBbdmFsdWVdLFxuICBtYXBwID0gW3Jlc29sdmUgPyBzcGVjaWFsQ2hhciA6ICc8Y2lyY3VsYXI+J10sXG4gIGxhc3QgPSB2YWx1ZSxcbiAgbHZsICA9IDEsXG4gIGksIGZuXG47XG5pZiAoaW5zcGVjdCkge1xuICBmbiA9IHR5cGVvZiByZXBsYWNlciA9PT0gJ29iamVjdCcgP1xuICAgIGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4gICAgICByZXR1cm4ga2V5ICE9PSAnJyAmJiByZXBsYWNlci5pbmRleE9mKGtleSkgPCAwID8gdm9pZCAwIDogdmFsdWU7XG4gICAgfSA6XG4gICAgcmVwbGFjZXI7XG59XG5yZXR1cm4gZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuICAvLyB0aGUgcmVwbGFjZXIgaGFzIHJpZ2h0cyB0byBkZWNpZGVcbiAgLy8gaWYgYSBuZXcgb2JqZWN0IHNob3VsZCBiZSByZXR1cm5lZFxuICAvLyBvciBpZiB0aGVyZSdzIHNvbWUga2V5IHRvIGRyb3BcbiAgLy8gbGV0J3MgY2FsbCBpdCBoZXJlIHJhdGhlciB0aGFuIFwidG9vIGxhdGVcIlxuICBpZiAoaW5zcGVjdCkgdmFsdWUgPSBmbi5jYWxsKHRoaXMsIGtleSwgdmFsdWUpO1xuXG4gIC8vIGRpZCB5b3Uga25vdyA/IFNhZmFyaSBwYXNzZXMga2V5cyBhcyBpbnRlZ2VycyBmb3IgYXJyYXlzXG4gIC8vIHdoaWNoIG1lYW5zIGlmIChrZXkpIHdoZW4ga2V5ID09PSAwIHdvbid0IHBhc3MgdGhlIGNoZWNrXG4gIGlmIChrZXkgIT09ICcnKSB7XG4gICAgaWYgKGxhc3QgIT09IHRoaXMpIHtcbiAgICAgIGkgPSBsdmwgLSBpbmRleE9mLmNhbGwoYWxsLCB0aGlzKSAtIDE7XG4gICAgICBsdmwgLT0gaTtcbiAgICAgIGFsbC5zcGxpY2UobHZsLCBhbGwubGVuZ3RoKTtcbiAgICAgIHBhdGguc3BsaWNlKGx2bCAtIDEsIHBhdGgubGVuZ3RoKTtcbiAgICAgIGxhc3QgPSB0aGlzO1xuICAgIH1cbiAgICAvLyBjb25zb2xlLmxvZyhsdmwsIGtleSwgcGF0aCk7XG4gICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUpIHtcbiAgICAvLyBpZiBvYmplY3QgaXNuJ3QgcmVmZXJyaW5nIHRvIHBhcmVudCBvYmplY3QsIGFkZCB0byB0aGVcbiAgICAgIC8vIG9iamVjdCBwYXRoIHN0YWNrLiBPdGhlcndpc2UgaXQgaXMgYWxyZWFkeSB0aGVyZS5cbiAgICAgIGlmIChpbmRleE9mLmNhbGwoYWxsLCB2YWx1ZSkgPCAwKSB7XG4gICAgICAgIGFsbC5wdXNoKGxhc3QgPSB2YWx1ZSk7XG4gICAgICB9XG4gICAgICBsdmwgPSBhbGwubGVuZ3RoO1xuICAgICAgaSA9IGluZGV4T2YuY2FsbChzZWVuLCB2YWx1ZSk7XG4gICAgICBpZiAoaSA8IDApIHtcbiAgICAgICAgaSA9IHNlZW4ucHVzaCh2YWx1ZSkgLSAxO1xuICAgICAgICBpZiAocmVzb2x2ZSkge1xuICAgICAgICAgIC8vIGtleSBjYW5ub3QgY29udGFpbiBzcGVjaWFsQ2hhciBidXQgY291bGQgYmUgbm90IGEgc3RyaW5nXG4gICAgICAgICAgcGF0aC5wdXNoKCgnJyArIGtleSkucmVwbGFjZShzcGVjaWFsQ2hhclJHLCBzYWZlU3BlY2lhbENoYXIpKTtcbiAgICAgICAgICBtYXBwW2ldID0gc3BlY2lhbENoYXIgKyBwYXRoLmpvaW4oc3BlY2lhbENoYXIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG1hcHBbaV0gPSBtYXBwWzBdO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YWx1ZSA9IG1hcHBbaV07XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnICYmIHJlc29sdmUpIHtcbiAgICAgICAgLy8gZW5zdXJlIG5vIHNwZWNpYWwgY2hhciBpbnZvbHZlZCBvbiBkZXNlcmlhbGl6YXRpb25cbiAgICAgICAgLy8gaW4gdGhpcyBjYXNlIG9ubHkgZmlyc3QgY2hhciBpcyBpbXBvcnRhbnRcbiAgICAgICAgLy8gbm8gbmVlZCB0byByZXBsYWNlIGFsbCB2YWx1ZSAoYmV0dGVyIHBlcmZvcm1hbmNlKVxuICAgICAgICB2YWx1ZSA9IHZhbHVlIC5yZXBsYWNlKHNhZmVTcGVjaWFsQ2hhciwgZXNjYXBlZFNhZmVTcGVjaWFsQ2hhcilcbiAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZShzcGVjaWFsQ2hhciwgc2FmZVNwZWNpYWxDaGFyKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHZhbHVlO1xufTtcbn1cblxuZnVuY3Rpb24gcmV0cmlldmVGcm9tUGF0aChjdXJyZW50LCBrZXlzKSB7XG5mb3IodmFyIGkgPSAwLCBsZW5ndGggPSBrZXlzLmxlbmd0aDsgaSA8IGxlbmd0aDsgY3VycmVudCA9IGN1cnJlbnRbXG4gIC8vIGtleXMgc2hvdWxkIGJlIG5vcm1hbGl6ZWQgYmFjayBoZXJlXG4gIGtleXNbaSsrXS5yZXBsYWNlKHNhZmVTcGVjaWFsQ2hhclJHLCBzcGVjaWFsQ2hhcilcbl0pO1xucmV0dXJuIGN1cnJlbnQ7XG59XG5cbmZ1bmN0aW9uIGdlbmVyYXRlUmV2aXZlcihyZXZpdmVyKSB7XG5yZXR1cm4gZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuICB2YXIgaXNTdHJpbmcgPSB0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnO1xuICBpZiAoaXNTdHJpbmcgJiYgdmFsdWUuY2hhckF0KDApID09PSBzcGVjaWFsQ2hhcikge1xuICAgIHJldHVybiBuZXcgJFN0cmluZyh2YWx1ZS5zbGljZSgxKSk7XG4gIH1cbiAgaWYgKGtleSA9PT0gJycpIHZhbHVlID0gcmVnZW5lcmF0ZSh2YWx1ZSwgdmFsdWUsIHt9KTtcbiAgLy8gYWdhaW4sIG9ubHkgb25lIG5lZWRlZCwgZG8gbm90IHVzZSB0aGUgUmVnRXhwIGZvciB0aGlzIHJlcGxhY2VtZW50XG4gIC8vIG9ubHkga2V5cyBuZWVkIHRoZSBSZWdFeHBcbiAgaWYgKGlzU3RyaW5nKSB2YWx1ZSA9IHZhbHVlIC5yZXBsYWNlKHNhZmVTdGFydFdpdGhTcGVjaWFsQ2hhclJHLCAnJDEnICsgc3BlY2lhbENoYXIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZShlc2NhcGVkU2FmZVNwZWNpYWxDaGFyLCBzYWZlU3BlY2lhbENoYXIpO1xuICByZXR1cm4gcmV2aXZlciA/IHJldml2ZXIuY2FsbCh0aGlzLCBrZXksIHZhbHVlKSA6IHZhbHVlO1xufTtcbn1cblxuZnVuY3Rpb24gcmVnZW5lcmF0ZUFycmF5KHJvb3QsIGN1cnJlbnQsIHJldHJpZXZlKSB7XG5mb3IgKHZhciBpID0gMCwgbGVuZ3RoID0gY3VycmVudC5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICBjdXJyZW50W2ldID0gcmVnZW5lcmF0ZShyb290LCBjdXJyZW50W2ldLCByZXRyaWV2ZSk7XG59XG5yZXR1cm4gY3VycmVudDtcbn1cblxuZnVuY3Rpb24gcmVnZW5lcmF0ZU9iamVjdChyb290LCBjdXJyZW50LCByZXRyaWV2ZSkge1xuZm9yICh2YXIga2V5IGluIGN1cnJlbnQpIHtcbiAgaWYgKGN1cnJlbnQuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgIGN1cnJlbnRba2V5XSA9IHJlZ2VuZXJhdGUocm9vdCwgY3VycmVudFtrZXldLCByZXRyaWV2ZSk7XG4gIH1cbn1cbnJldHVybiBjdXJyZW50O1xufVxuXG5mdW5jdGlvbiByZWdlbmVyYXRlKHJvb3QsIGN1cnJlbnQsIHJldHJpZXZlKSB7XG5yZXR1cm4gY3VycmVudCBpbnN0YW5jZW9mIEFycmF5ID9cbiAgLy8gZmFzdCBBcnJheSByZWNvbnN0cnVjdGlvblxuICByZWdlbmVyYXRlQXJyYXkocm9vdCwgY3VycmVudCwgcmV0cmlldmUpIDpcbiAgKFxuICAgIGN1cnJlbnQgaW5zdGFuY2VvZiAkU3RyaW5nID9cbiAgICAgIChcbiAgICAgICAgLy8gcm9vdCBpcyBhbiBlbXB0eSBzdHJpbmdcbiAgICAgICAgY3VycmVudC5sZW5ndGggP1xuICAgICAgICAgIChcbiAgICAgICAgICAgIHJldHJpZXZlLmhhc093blByb3BlcnR5KGN1cnJlbnQpID9cbiAgICAgICAgICAgICAgcmV0cmlldmVbY3VycmVudF0gOlxuICAgICAgICAgICAgICByZXRyaWV2ZVtjdXJyZW50XSA9IHJldHJpZXZlRnJvbVBhdGgoXG4gICAgICAgICAgICAgICAgcm9vdCwgY3VycmVudC5zcGxpdChzcGVjaWFsQ2hhcilcbiAgICAgICAgICAgICAgKVxuICAgICAgICAgICkgOlxuICAgICAgICAgIHJvb3RcbiAgICAgICkgOlxuICAgICAgKFxuICAgICAgICBjdXJyZW50IGluc3RhbmNlb2YgT2JqZWN0ID9cbiAgICAgICAgICAvLyBkZWRpY2F0ZWQgT2JqZWN0IHBhcnNlclxuICAgICAgICAgIHJlZ2VuZXJhdGVPYmplY3Qocm9vdCwgY3VycmVudCwgcmV0cmlldmUpIDpcbiAgICAgICAgICAvLyB2YWx1ZSBhcyBpdCBpc1xuICAgICAgICAgIGN1cnJlbnRcbiAgICAgIClcbiAgKVxuO1xufVxuXG5mdW5jdGlvbiBzdHJpbmdpZnlSZWN1cnNpb24odmFsdWUsIHJlcGxhY2VyLCBzcGFjZSwgZG9Ob3RSZXNvbHZlKSB7XG5yZXR1cm4gSlNPTi5zdHJpbmdpZnkodmFsdWUsIGdlbmVyYXRlUmVwbGFjZXIodmFsdWUsIHJlcGxhY2VyLCAhZG9Ob3RSZXNvbHZlKSwgc3BhY2UpO1xufVxuXG5mdW5jdGlvbiBwYXJzZVJlY3Vyc2lvbih0ZXh0LCByZXZpdmVyKSB7XG5yZXR1cm4gSlNPTi5wYXJzZSh0ZXh0LCBnZW5lcmF0ZVJldml2ZXIocmV2aXZlcikpO1xufVxuXG5leHBvcnQgZGVmYXVsdCB7XG4gIHN0cmluZ2lmeTogc3RyaW5naWZ5UmVjdXJzaW9uLFxuICBwYXJzZTogcGFyc2VSZWN1cnNpb25cbn0iLCIvKiBlc2xpbnQtZGlzYWJsZSAqL1xuLy8gQ3JlZGl0czogaHR0cHM6Ly9naXRodWIuY29tL3NpbmRyZXNvcmh1cy9zZXJpYWxpemUtZXJyb3JcblxuJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHZhbHVlID0+IHtcblx0aWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcpIHtcblx0XHRyZXR1cm4gZGVzdHJveUNpcmN1bGFyKHZhbHVlLCBbXSk7XG5cdH1cblxuXHQvLyBQZW9wbGUgc29tZXRpbWVzIHRocm93IHRoaW5ncyBiZXNpZGVzIEVycm9yIG9iamVjdHMsIHNv4oCmXG5cblx0aWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdC8vIEpTT04uc3RyaW5naWZ5IGRpc2NhcmRzIGZ1bmN0aW9ucy4gV2UgZG8gdG9vLCB1bmxlc3MgYSBmdW5jdGlvbiBpcyB0aHJvd24gZGlyZWN0bHkuXG5cdFx0cmV0dXJuIGBbRnVuY3Rpb246ICR7KHZhbHVlLm5hbWUgfHwgJ2Fub255bW91cycpfV1gO1xuXHR9XG5cblx0cmV0dXJuIHZhbHVlO1xufTtcblxuLy8gaHR0cHM6Ly93d3cubnBtanMuY29tL3BhY2thZ2UvZGVzdHJveS1jaXJjdWxhclxuZnVuY3Rpb24gZGVzdHJveUNpcmN1bGFyKGZyb20sIHNlZW4pIHtcblx0Y29uc3QgdG8gPSBBcnJheS5pc0FycmF5KGZyb20pID8gW10gOiB7fTtcblxuXHRzZWVuLnB1c2goZnJvbSk7XG5cblx0Zm9yIChjb25zdCBrZXkgb2YgT2JqZWN0LmtleXMoZnJvbSkpIHtcblx0XHRjb25zdCB2YWx1ZSA9IGZyb21ba2V5XTtcblxuXHRcdGlmICh0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdGNvbnRpbnVlO1xuXHRcdH1cblxuXHRcdGlmICghdmFsdWUgfHwgdHlwZW9mIHZhbHVlICE9PSAnb2JqZWN0Jykge1xuXHRcdFx0dG9ba2V5XSA9IHZhbHVlO1xuXHRcdFx0Y29udGludWU7XG5cdFx0fVxuXG5cdFx0aWYgKHNlZW4uaW5kZXhPZihmcm9tW2tleV0pID09PSAtMSkge1xuXHRcdFx0dG9ba2V5XSA9IGRlc3Ryb3lDaXJjdWxhcihmcm9tW2tleV0sIHNlZW4uc2xpY2UoMCkpO1xuXHRcdFx0Y29udGludWU7XG5cdFx0fVxuXG5cdFx0dG9ba2V5XSA9ICdbQ2lyY3VsYXJdJztcblx0fVxuXG5cdGlmICh0eXBlb2YgZnJvbS5uYW1lID09PSAnc3RyaW5nJykge1xuXHRcdHRvLm5hbWUgPSBmcm9tLm5hbWU7XG5cdH1cblxuXHRpZiAodHlwZW9mIGZyb20ubWVzc2FnZSA9PT0gJ3N0cmluZycpIHtcblx0XHR0by5tZXNzYWdlID0gZnJvbS5tZXNzYWdlO1xuXHR9XG5cblx0aWYgKHR5cGVvZiBmcm9tLnN0YWNrID09PSAnc3RyaW5nJykge1xuXHRcdHRvLnN0YWNrID0gZnJvbS5zdGFjaztcblx0fVxuXG5cdHJldHVybiB0bztcbn0iLCJleHBvcnQgY29uc3QgZ2V0RnVuY05hbWUgPSBmdW5jID0+IHtcbiAgaWYgKGZ1bmMubmFtZSkgcmV0dXJuIGZ1bmMubmFtZTtcbiAgY29uc3QgcmVzdWx0ID0gL15mdW5jdGlvblxccysoW1xcd1xcJF0rKVxccypcXCgvLmV4ZWMoZnVuYy50b1N0cmluZygpKTtcblxuICByZXR1cm4gcmVzdWx0ID8gcmVzdWx0WzFdIDogJ3Vua25vd24nO1xufTtcblxubGV0IGlkcyA9IDA7XG5cbmV4cG9ydCBjb25zdCBnZXRJZCA9IHByZWZpeCA9PiBgJHtwcmVmaXh9XyR7KytpZHN9YDtcblxuZXhwb3J0IGZ1bmN0aW9uIGlzT2JqZWN0RW1wdHkob2JqKSB7XG4gIGZvciAoY29uc3QgcHJvcCBpbiBvYmopIHtcbiAgICBpZiAob2JqLmhhc093blByb3BlcnR5KHByb3ApKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG4gIHJldHVybiB0cnVlO1xufVxuZXhwb3J0IGZ1bmN0aW9uIHJlcXVpcmVPYmplY3Qob2JqKSB7XG4gIGlmIChcbiAgICB0eXBlb2Ygb2JqID09PSAndW5kZWZpbmVkJyB8fFxuICAgIG9iaiA9PT0gbnVsbCB8fFxuICAgICh0eXBlb2Ygb2JqICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2Ygb2JqICE9PSAnb2JqZWN0JylcbiAgKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBBIGtleS12YWx1ZSBvYmplY3QgZXhwZWN0ZWQuIEluc3RlYWQgXCIke29ian1cIiBwYXNzZWQuYCk7XG4gIH1cbn1cbmV4cG9ydCBjb25zdCBhY2N1bXVsYXRlID0gKGN1cnJlbnQsIG5ld0RhdGEpID0+ICh7IC4uLmN1cnJlbnQsIC4uLm5ld0RhdGEgfSk7XG5leHBvcnQgY29uc3QgaXNQcm9taXNlID0gb2JqID0+IG9iaiAmJiB0eXBlb2Ygb2JqLnRoZW4gPT09ICdmdW5jdGlvbic7XG5leHBvcnQgY29uc3QgaXNPYmplY3RMaXRlcmFsID0gb2JqID0+XG4gIG9iaiA/IG9iai5jb25zdHJ1Y3RvciA9PT0ge30uY29uc3RydWN0b3IgOiBmYWxzZTtcbmV4cG9ydCBjb25zdCBpc0dlbmVyYXRvciA9IG9iaiA9PlxuICBvYmogJiYgdHlwZW9mIG9iai5uZXh0ID09PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBvYmoudGhyb3cgPT09ICdmdW5jdGlvbic7XG5leHBvcnQgY29uc3QgaXNHZW5lcmF0b3JGdW5jdGlvbiA9IGZuID0+IHtcbiAgY29uc3QgeyBjb25zdHJ1Y3RvciB9ID0gZm47XG4gIGlmICghY29uc3RydWN0b3IpIHJldHVybiBmYWxzZTtcbiAgaWYgKFxuICAgIGNvbnN0cnVjdG9yLm5hbWUgPT09ICdHZW5lcmF0b3JGdW5jdGlvbicgfHxcbiAgICBjb25zdHJ1Y3Rvci5kaXNwbGF5TmFtZSA9PT0gJ0dlbmVyYXRvckZ1bmN0aW9uJ1xuICApIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gaXNHZW5lcmF0b3IoY29uc3RydWN0b3IucHJvdG90eXBlKTtcbn07XG5leHBvcnQgZnVuY3Rpb24gcmVzZXRJZHMoKSB7XG4gIGlkcyA9IDA7XG59XG5leHBvcnQgZnVuY3Rpb24gc2V0UHJvcCh3aG8sIHByb3BOYW1lLCB2YWx1ZSkge1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkod2hvLCBwcm9wTmFtZSwge1xuICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgIHZhbHVlLFxuICB9KTtcbn1cbiIsImZ1bmN0aW9uIF90YWdnZWRUZW1wbGF0ZUxpdGVyYWwoc3RyaW5ncywgcmF3KSB7XG4gIGlmICghcmF3KSB7XG4gICAgcmF3ID0gc3RyaW5ncy5zbGljZSgwKTtcbiAgfVxuXG4gIHJldHVybiBPYmplY3QuZnJlZXplKE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHN0cmluZ3MsIHtcbiAgICByYXc6IHtcbiAgICAgIHZhbHVlOiBPYmplY3QuZnJlZXplKHJhdylcbiAgICB9XG4gIH0pKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBfdGFnZ2VkVGVtcGxhdGVMaXRlcmFsOyIsIi8qKlxuICogQ29weXJpZ2h0IChjKSAyMDE0LXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxudmFyIHJ1bnRpbWUgPSAoZnVuY3Rpb24gKGV4cG9ydHMpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgdmFyIE9wID0gT2JqZWN0LnByb3RvdHlwZTtcbiAgdmFyIGhhc093biA9IE9wLmhhc093blByb3BlcnR5O1xuICB2YXIgdW5kZWZpbmVkOyAvLyBNb3JlIGNvbXByZXNzaWJsZSB0aGFuIHZvaWQgMC5cbiAgdmFyICRTeW1ib2wgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgPyBTeW1ib2wgOiB7fTtcbiAgdmFyIGl0ZXJhdG9yU3ltYm9sID0gJFN5bWJvbC5pdGVyYXRvciB8fCBcIkBAaXRlcmF0b3JcIjtcbiAgdmFyIGFzeW5jSXRlcmF0b3JTeW1ib2wgPSAkU3ltYm9sLmFzeW5jSXRlcmF0b3IgfHwgXCJAQGFzeW5jSXRlcmF0b3JcIjtcbiAgdmFyIHRvU3RyaW5nVGFnU3ltYm9sID0gJFN5bWJvbC50b1N0cmluZ1RhZyB8fCBcIkBAdG9TdHJpbmdUYWdcIjtcblxuICBmdW5jdGlvbiB3cmFwKGlubmVyRm4sIG91dGVyRm4sIHNlbGYsIHRyeUxvY3NMaXN0KSB7XG4gICAgLy8gSWYgb3V0ZXJGbiBwcm92aWRlZCBhbmQgb3V0ZXJGbi5wcm90b3R5cGUgaXMgYSBHZW5lcmF0b3IsIHRoZW4gb3V0ZXJGbi5wcm90b3R5cGUgaW5zdGFuY2VvZiBHZW5lcmF0b3IuXG4gICAgdmFyIHByb3RvR2VuZXJhdG9yID0gb3V0ZXJGbiAmJiBvdXRlckZuLnByb3RvdHlwZSBpbnN0YW5jZW9mIEdlbmVyYXRvciA/IG91dGVyRm4gOiBHZW5lcmF0b3I7XG4gICAgdmFyIGdlbmVyYXRvciA9IE9iamVjdC5jcmVhdGUocHJvdG9HZW5lcmF0b3IucHJvdG90eXBlKTtcbiAgICB2YXIgY29udGV4dCA9IG5ldyBDb250ZXh0KHRyeUxvY3NMaXN0IHx8IFtdKTtcblxuICAgIC8vIFRoZSAuX2ludm9rZSBtZXRob2QgdW5pZmllcyB0aGUgaW1wbGVtZW50YXRpb25zIG9mIHRoZSAubmV4dCxcbiAgICAvLyAudGhyb3csIGFuZCAucmV0dXJuIG1ldGhvZHMuXG4gICAgZ2VuZXJhdG9yLl9pbnZva2UgPSBtYWtlSW52b2tlTWV0aG9kKGlubmVyRm4sIHNlbGYsIGNvbnRleHQpO1xuXG4gICAgcmV0dXJuIGdlbmVyYXRvcjtcbiAgfVxuICBleHBvcnRzLndyYXAgPSB3cmFwO1xuXG4gIC8vIFRyeS9jYXRjaCBoZWxwZXIgdG8gbWluaW1pemUgZGVvcHRpbWl6YXRpb25zLiBSZXR1cm5zIGEgY29tcGxldGlvblxuICAvLyByZWNvcmQgbGlrZSBjb250ZXh0LnRyeUVudHJpZXNbaV0uY29tcGxldGlvbi4gVGhpcyBpbnRlcmZhY2UgY291bGRcbiAgLy8gaGF2ZSBiZWVuIChhbmQgd2FzIHByZXZpb3VzbHkpIGRlc2lnbmVkIHRvIHRha2UgYSBjbG9zdXJlIHRvIGJlXG4gIC8vIGludm9rZWQgd2l0aG91dCBhcmd1bWVudHMsIGJ1dCBpbiBhbGwgdGhlIGNhc2VzIHdlIGNhcmUgYWJvdXQgd2VcbiAgLy8gYWxyZWFkeSBoYXZlIGFuIGV4aXN0aW5nIG1ldGhvZCB3ZSB3YW50IHRvIGNhbGwsIHNvIHRoZXJlJ3Mgbm8gbmVlZFxuICAvLyB0byBjcmVhdGUgYSBuZXcgZnVuY3Rpb24gb2JqZWN0LiBXZSBjYW4gZXZlbiBnZXQgYXdheSB3aXRoIGFzc3VtaW5nXG4gIC8vIHRoZSBtZXRob2QgdGFrZXMgZXhhY3RseSBvbmUgYXJndW1lbnQsIHNpbmNlIHRoYXQgaGFwcGVucyB0byBiZSB0cnVlXG4gIC8vIGluIGV2ZXJ5IGNhc2UsIHNvIHdlIGRvbid0IGhhdmUgdG8gdG91Y2ggdGhlIGFyZ3VtZW50cyBvYmplY3QuIFRoZVxuICAvLyBvbmx5IGFkZGl0aW9uYWwgYWxsb2NhdGlvbiByZXF1aXJlZCBpcyB0aGUgY29tcGxldGlvbiByZWNvcmQsIHdoaWNoXG4gIC8vIGhhcyBhIHN0YWJsZSBzaGFwZSBhbmQgc28gaG9wZWZ1bGx5IHNob3VsZCBiZSBjaGVhcCB0byBhbGxvY2F0ZS5cbiAgZnVuY3Rpb24gdHJ5Q2F0Y2goZm4sIG9iaiwgYXJnKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiB7IHR5cGU6IFwibm9ybWFsXCIsIGFyZzogZm4uY2FsbChvYmosIGFyZykgfTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHJldHVybiB7IHR5cGU6IFwidGhyb3dcIiwgYXJnOiBlcnIgfTtcbiAgICB9XG4gIH1cblxuICB2YXIgR2VuU3RhdGVTdXNwZW5kZWRTdGFydCA9IFwic3VzcGVuZGVkU3RhcnRcIjtcbiAgdmFyIEdlblN0YXRlU3VzcGVuZGVkWWllbGQgPSBcInN1c3BlbmRlZFlpZWxkXCI7XG4gIHZhciBHZW5TdGF0ZUV4ZWN1dGluZyA9IFwiZXhlY3V0aW5nXCI7XG4gIHZhciBHZW5TdGF0ZUNvbXBsZXRlZCA9IFwiY29tcGxldGVkXCI7XG5cbiAgLy8gUmV0dXJuaW5nIHRoaXMgb2JqZWN0IGZyb20gdGhlIGlubmVyRm4gaGFzIHRoZSBzYW1lIGVmZmVjdCBhc1xuICAvLyBicmVha2luZyBvdXQgb2YgdGhlIGRpc3BhdGNoIHN3aXRjaCBzdGF0ZW1lbnQuXG4gIHZhciBDb250aW51ZVNlbnRpbmVsID0ge307XG5cbiAgLy8gRHVtbXkgY29uc3RydWN0b3IgZnVuY3Rpb25zIHRoYXQgd2UgdXNlIGFzIHRoZSAuY29uc3RydWN0b3IgYW5kXG4gIC8vIC5jb25zdHJ1Y3Rvci5wcm90b3R5cGUgcHJvcGVydGllcyBmb3IgZnVuY3Rpb25zIHRoYXQgcmV0dXJuIEdlbmVyYXRvclxuICAvLyBvYmplY3RzLiBGb3IgZnVsbCBzcGVjIGNvbXBsaWFuY2UsIHlvdSBtYXkgd2lzaCB0byBjb25maWd1cmUgeW91clxuICAvLyBtaW5pZmllciBub3QgdG8gbWFuZ2xlIHRoZSBuYW1lcyBvZiB0aGVzZSB0d28gZnVuY3Rpb25zLlxuICBmdW5jdGlvbiBHZW5lcmF0b3IoKSB7fVxuICBmdW5jdGlvbiBHZW5lcmF0b3JGdW5jdGlvbigpIHt9XG4gIGZ1bmN0aW9uIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlKCkge31cblxuICAvLyBUaGlzIGlzIGEgcG9seWZpbGwgZm9yICVJdGVyYXRvclByb3RvdHlwZSUgZm9yIGVudmlyb25tZW50cyB0aGF0XG4gIC8vIGRvbid0IG5hdGl2ZWx5IHN1cHBvcnQgaXQuXG4gIHZhciBJdGVyYXRvclByb3RvdHlwZSA9IHt9O1xuICBJdGVyYXRvclByb3RvdHlwZVtpdGVyYXRvclN5bWJvbF0gPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgdmFyIGdldFByb3RvID0gT2JqZWN0LmdldFByb3RvdHlwZU9mO1xuICB2YXIgTmF0aXZlSXRlcmF0b3JQcm90b3R5cGUgPSBnZXRQcm90byAmJiBnZXRQcm90byhnZXRQcm90byh2YWx1ZXMoW10pKSk7XG4gIGlmIChOYXRpdmVJdGVyYXRvclByb3RvdHlwZSAmJlxuICAgICAgTmF0aXZlSXRlcmF0b3JQcm90b3R5cGUgIT09IE9wICYmXG4gICAgICBoYXNPd24uY2FsbChOYXRpdmVJdGVyYXRvclByb3RvdHlwZSwgaXRlcmF0b3JTeW1ib2wpKSB7XG4gICAgLy8gVGhpcyBlbnZpcm9ubWVudCBoYXMgYSBuYXRpdmUgJUl0ZXJhdG9yUHJvdG90eXBlJTsgdXNlIGl0IGluc3RlYWRcbiAgICAvLyBvZiB0aGUgcG9seWZpbGwuXG4gICAgSXRlcmF0b3JQcm90b3R5cGUgPSBOYXRpdmVJdGVyYXRvclByb3RvdHlwZTtcbiAgfVxuXG4gIHZhciBHcCA9IEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlLnByb3RvdHlwZSA9XG4gICAgR2VuZXJhdG9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoSXRlcmF0b3JQcm90b3R5cGUpO1xuICBHZW5lcmF0b3JGdW5jdGlvbi5wcm90b3R5cGUgPSBHcC5jb25zdHJ1Y3RvciA9IEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlO1xuICBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IEdlbmVyYXRvckZ1bmN0aW9uO1xuICBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZVt0b1N0cmluZ1RhZ1N5bWJvbF0gPVxuICAgIEdlbmVyYXRvckZ1bmN0aW9uLmRpc3BsYXlOYW1lID0gXCJHZW5lcmF0b3JGdW5jdGlvblwiO1xuXG4gIC8vIEhlbHBlciBmb3IgZGVmaW5pbmcgdGhlIC5uZXh0LCAudGhyb3csIGFuZCAucmV0dXJuIG1ldGhvZHMgb2YgdGhlXG4gIC8vIEl0ZXJhdG9yIGludGVyZmFjZSBpbiB0ZXJtcyBvZiBhIHNpbmdsZSAuX2ludm9rZSBtZXRob2QuXG4gIGZ1bmN0aW9uIGRlZmluZUl0ZXJhdG9yTWV0aG9kcyhwcm90b3R5cGUpIHtcbiAgICBbXCJuZXh0XCIsIFwidGhyb3dcIiwgXCJyZXR1cm5cIl0uZm9yRWFjaChmdW5jdGlvbihtZXRob2QpIHtcbiAgICAgIHByb3RvdHlwZVttZXRob2RdID0gZnVuY3Rpb24oYXJnKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9pbnZva2UobWV0aG9kLCBhcmcpO1xuICAgICAgfTtcbiAgICB9KTtcbiAgfVxuXG4gIGV4cG9ydHMuaXNHZW5lcmF0b3JGdW5jdGlvbiA9IGZ1bmN0aW9uKGdlbkZ1bikge1xuICAgIHZhciBjdG9yID0gdHlwZW9mIGdlbkZ1biA9PT0gXCJmdW5jdGlvblwiICYmIGdlbkZ1bi5jb25zdHJ1Y3RvcjtcbiAgICByZXR1cm4gY3RvclxuICAgICAgPyBjdG9yID09PSBHZW5lcmF0b3JGdW5jdGlvbiB8fFxuICAgICAgICAvLyBGb3IgdGhlIG5hdGl2ZSBHZW5lcmF0b3JGdW5jdGlvbiBjb25zdHJ1Y3RvciwgdGhlIGJlc3Qgd2UgY2FuXG4gICAgICAgIC8vIGRvIGlzIHRvIGNoZWNrIGl0cyAubmFtZSBwcm9wZXJ0eS5cbiAgICAgICAgKGN0b3IuZGlzcGxheU5hbWUgfHwgY3Rvci5uYW1lKSA9PT0gXCJHZW5lcmF0b3JGdW5jdGlvblwiXG4gICAgICA6IGZhbHNlO1xuICB9O1xuXG4gIGV4cG9ydHMubWFyayA9IGZ1bmN0aW9uKGdlbkZ1bikge1xuICAgIGlmIChPYmplY3Quc2V0UHJvdG90eXBlT2YpIHtcbiAgICAgIE9iamVjdC5zZXRQcm90b3R5cGVPZihnZW5GdW4sIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZ2VuRnVuLl9fcHJvdG9fXyA9IEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlO1xuICAgICAgaWYgKCEodG9TdHJpbmdUYWdTeW1ib2wgaW4gZ2VuRnVuKSkge1xuICAgICAgICBnZW5GdW5bdG9TdHJpbmdUYWdTeW1ib2xdID0gXCJHZW5lcmF0b3JGdW5jdGlvblwiO1xuICAgICAgfVxuICAgIH1cbiAgICBnZW5GdW4ucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShHcCk7XG4gICAgcmV0dXJuIGdlbkZ1bjtcbiAgfTtcblxuICAvLyBXaXRoaW4gdGhlIGJvZHkgb2YgYW55IGFzeW5jIGZ1bmN0aW9uLCBgYXdhaXQgeGAgaXMgdHJhbnNmb3JtZWQgdG9cbiAgLy8gYHlpZWxkIHJlZ2VuZXJhdG9yUnVudGltZS5hd3JhcCh4KWAsIHNvIHRoYXQgdGhlIHJ1bnRpbWUgY2FuIHRlc3RcbiAgLy8gYGhhc093bi5jYWxsKHZhbHVlLCBcIl9fYXdhaXRcIilgIHRvIGRldGVybWluZSBpZiB0aGUgeWllbGRlZCB2YWx1ZSBpc1xuICAvLyBtZWFudCB0byBiZSBhd2FpdGVkLlxuICBleHBvcnRzLmF3cmFwID0gZnVuY3Rpb24oYXJnKSB7XG4gICAgcmV0dXJuIHsgX19hd2FpdDogYXJnIH07XG4gIH07XG5cbiAgZnVuY3Rpb24gQXN5bmNJdGVyYXRvcihnZW5lcmF0b3IpIHtcbiAgICBmdW5jdGlvbiBpbnZva2UobWV0aG9kLCBhcmcsIHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgdmFyIHJlY29yZCA9IHRyeUNhdGNoKGdlbmVyYXRvclttZXRob2RdLCBnZW5lcmF0b3IsIGFyZyk7XG4gICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICByZWplY3QocmVjb3JkLmFyZyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgcmVzdWx0ID0gcmVjb3JkLmFyZztcbiAgICAgICAgdmFyIHZhbHVlID0gcmVzdWx0LnZhbHVlO1xuICAgICAgICBpZiAodmFsdWUgJiZcbiAgICAgICAgICAgIHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIiAmJlxuICAgICAgICAgICAgaGFzT3duLmNhbGwodmFsdWUsIFwiX19hd2FpdFwiKSkge1xuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodmFsdWUuX19hd2FpdCkudGhlbihmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgaW52b2tlKFwibmV4dFwiLCB2YWx1ZSwgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgICB9LCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgICAgIGludm9rZShcInRocm93XCIsIGVyciwgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodmFsdWUpLnRoZW4oZnVuY3Rpb24odW53cmFwcGVkKSB7XG4gICAgICAgICAgLy8gV2hlbiBhIHlpZWxkZWQgUHJvbWlzZSBpcyByZXNvbHZlZCwgaXRzIGZpbmFsIHZhbHVlIGJlY29tZXNcbiAgICAgICAgICAvLyB0aGUgLnZhbHVlIG9mIHRoZSBQcm9taXNlPHt2YWx1ZSxkb25lfT4gcmVzdWx0IGZvciB0aGVcbiAgICAgICAgICAvLyBjdXJyZW50IGl0ZXJhdGlvbi5cbiAgICAgICAgICByZXN1bHQudmFsdWUgPSB1bndyYXBwZWQ7XG4gICAgICAgICAgcmVzb2x2ZShyZXN1bHQpO1xuICAgICAgICB9LCBmdW5jdGlvbihlcnJvcikge1xuICAgICAgICAgIC8vIElmIGEgcmVqZWN0ZWQgUHJvbWlzZSB3YXMgeWllbGRlZCwgdGhyb3cgdGhlIHJlamVjdGlvbiBiYWNrXG4gICAgICAgICAgLy8gaW50byB0aGUgYXN5bmMgZ2VuZXJhdG9yIGZ1bmN0aW9uIHNvIGl0IGNhbiBiZSBoYW5kbGVkIHRoZXJlLlxuICAgICAgICAgIHJldHVybiBpbnZva2UoXCJ0aHJvd1wiLCBlcnJvciwgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIHByZXZpb3VzUHJvbWlzZTtcblxuICAgIGZ1bmN0aW9uIGVucXVldWUobWV0aG9kLCBhcmcpIHtcbiAgICAgIGZ1bmN0aW9uIGNhbGxJbnZva2VXaXRoTWV0aG9kQW5kQXJnKCkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgaW52b2tlKG1ldGhvZCwgYXJnLCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHByZXZpb3VzUHJvbWlzZSA9XG4gICAgICAgIC8vIElmIGVucXVldWUgaGFzIGJlZW4gY2FsbGVkIGJlZm9yZSwgdGhlbiB3ZSB3YW50IHRvIHdhaXQgdW50aWxcbiAgICAgICAgLy8gYWxsIHByZXZpb3VzIFByb21pc2VzIGhhdmUgYmVlbiByZXNvbHZlZCBiZWZvcmUgY2FsbGluZyBpbnZva2UsXG4gICAgICAgIC8vIHNvIHRoYXQgcmVzdWx0cyBhcmUgYWx3YXlzIGRlbGl2ZXJlZCBpbiB0aGUgY29ycmVjdCBvcmRlci4gSWZcbiAgICAgICAgLy8gZW5xdWV1ZSBoYXMgbm90IGJlZW4gY2FsbGVkIGJlZm9yZSwgdGhlbiBpdCBpcyBpbXBvcnRhbnQgdG9cbiAgICAgICAgLy8gY2FsbCBpbnZva2UgaW1tZWRpYXRlbHksIHdpdGhvdXQgd2FpdGluZyBvbiBhIGNhbGxiYWNrIHRvIGZpcmUsXG4gICAgICAgIC8vIHNvIHRoYXQgdGhlIGFzeW5jIGdlbmVyYXRvciBmdW5jdGlvbiBoYXMgdGhlIG9wcG9ydHVuaXR5IHRvIGRvXG4gICAgICAgIC8vIGFueSBuZWNlc3Nhcnkgc2V0dXAgaW4gYSBwcmVkaWN0YWJsZSB3YXkuIFRoaXMgcHJlZGljdGFiaWxpdHlcbiAgICAgICAgLy8gaXMgd2h5IHRoZSBQcm9taXNlIGNvbnN0cnVjdG9yIHN5bmNocm9ub3VzbHkgaW52b2tlcyBpdHNcbiAgICAgICAgLy8gZXhlY3V0b3IgY2FsbGJhY2ssIGFuZCB3aHkgYXN5bmMgZnVuY3Rpb25zIHN5bmNocm9ub3VzbHlcbiAgICAgICAgLy8gZXhlY3V0ZSBjb2RlIGJlZm9yZSB0aGUgZmlyc3QgYXdhaXQuIFNpbmNlIHdlIGltcGxlbWVudCBzaW1wbGVcbiAgICAgICAgLy8gYXN5bmMgZnVuY3Rpb25zIGluIHRlcm1zIG9mIGFzeW5jIGdlbmVyYXRvcnMsIGl0IGlzIGVzcGVjaWFsbHlcbiAgICAgICAgLy8gaW1wb3J0YW50IHRvIGdldCB0aGlzIHJpZ2h0LCBldmVuIHRob3VnaCBpdCByZXF1aXJlcyBjYXJlLlxuICAgICAgICBwcmV2aW91c1Byb21pc2UgPyBwcmV2aW91c1Byb21pc2UudGhlbihcbiAgICAgICAgICBjYWxsSW52b2tlV2l0aE1ldGhvZEFuZEFyZyxcbiAgICAgICAgICAvLyBBdm9pZCBwcm9wYWdhdGluZyBmYWlsdXJlcyB0byBQcm9taXNlcyByZXR1cm5lZCBieSBsYXRlclxuICAgICAgICAgIC8vIGludm9jYXRpb25zIG9mIHRoZSBpdGVyYXRvci5cbiAgICAgICAgICBjYWxsSW52b2tlV2l0aE1ldGhvZEFuZEFyZ1xuICAgICAgICApIDogY2FsbEludm9rZVdpdGhNZXRob2RBbmRBcmcoKTtcbiAgICB9XG5cbiAgICAvLyBEZWZpbmUgdGhlIHVuaWZpZWQgaGVscGVyIG1ldGhvZCB0aGF0IGlzIHVzZWQgdG8gaW1wbGVtZW50IC5uZXh0LFxuICAgIC8vIC50aHJvdywgYW5kIC5yZXR1cm4gKHNlZSBkZWZpbmVJdGVyYXRvck1ldGhvZHMpLlxuICAgIHRoaXMuX2ludm9rZSA9IGVucXVldWU7XG4gIH1cblxuICBkZWZpbmVJdGVyYXRvck1ldGhvZHMoQXN5bmNJdGVyYXRvci5wcm90b3R5cGUpO1xuICBBc3luY0l0ZXJhdG9yLnByb3RvdHlwZVthc3luY0l0ZXJhdG9yU3ltYm9sXSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcbiAgZXhwb3J0cy5Bc3luY0l0ZXJhdG9yID0gQXN5bmNJdGVyYXRvcjtcblxuICAvLyBOb3RlIHRoYXQgc2ltcGxlIGFzeW5jIGZ1bmN0aW9ucyBhcmUgaW1wbGVtZW50ZWQgb24gdG9wIG9mXG4gIC8vIEFzeW5jSXRlcmF0b3Igb2JqZWN0czsgdGhleSBqdXN0IHJldHVybiBhIFByb21pc2UgZm9yIHRoZSB2YWx1ZSBvZlxuICAvLyB0aGUgZmluYWwgcmVzdWx0IHByb2R1Y2VkIGJ5IHRoZSBpdGVyYXRvci5cbiAgZXhwb3J0cy5hc3luYyA9IGZ1bmN0aW9uKGlubmVyRm4sIG91dGVyRm4sIHNlbGYsIHRyeUxvY3NMaXN0KSB7XG4gICAgdmFyIGl0ZXIgPSBuZXcgQXN5bmNJdGVyYXRvcihcbiAgICAgIHdyYXAoaW5uZXJGbiwgb3V0ZXJGbiwgc2VsZiwgdHJ5TG9jc0xpc3QpXG4gICAgKTtcblxuICAgIHJldHVybiBleHBvcnRzLmlzR2VuZXJhdG9yRnVuY3Rpb24ob3V0ZXJGbilcbiAgICAgID8gaXRlciAvLyBJZiBvdXRlckZuIGlzIGEgZ2VuZXJhdG9yLCByZXR1cm4gdGhlIGZ1bGwgaXRlcmF0b3IuXG4gICAgICA6IGl0ZXIubmV4dCgpLnRoZW4oZnVuY3Rpb24ocmVzdWx0KSB7XG4gICAgICAgICAgcmV0dXJuIHJlc3VsdC5kb25lID8gcmVzdWx0LnZhbHVlIDogaXRlci5uZXh0KCk7XG4gICAgICAgIH0pO1xuICB9O1xuXG4gIGZ1bmN0aW9uIG1ha2VJbnZva2VNZXRob2QoaW5uZXJGbiwgc2VsZiwgY29udGV4dCkge1xuICAgIHZhciBzdGF0ZSA9IEdlblN0YXRlU3VzcGVuZGVkU3RhcnQ7XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gaW52b2tlKG1ldGhvZCwgYXJnKSB7XG4gICAgICBpZiAoc3RhdGUgPT09IEdlblN0YXRlRXhlY3V0aW5nKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkdlbmVyYXRvciBpcyBhbHJlYWR5IHJ1bm5pbmdcIik7XG4gICAgICB9XG5cbiAgICAgIGlmIChzdGF0ZSA9PT0gR2VuU3RhdGVDb21wbGV0ZWQpIHtcbiAgICAgICAgaWYgKG1ldGhvZCA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgdGhyb3cgYXJnO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQmUgZm9yZ2l2aW5nLCBwZXIgMjUuMy4zLjMuMyBvZiB0aGUgc3BlYzpcbiAgICAgICAgLy8gaHR0cHM6Ly9wZW9wbGUubW96aWxsYS5vcmcvfmpvcmVuZG9yZmYvZXM2LWRyYWZ0Lmh0bWwjc2VjLWdlbmVyYXRvcnJlc3VtZVxuICAgICAgICByZXR1cm4gZG9uZVJlc3VsdCgpO1xuICAgICAgfVxuXG4gICAgICBjb250ZXh0Lm1ldGhvZCA9IG1ldGhvZDtcbiAgICAgIGNvbnRleHQuYXJnID0gYXJnO1xuXG4gICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICB2YXIgZGVsZWdhdGUgPSBjb250ZXh0LmRlbGVnYXRlO1xuICAgICAgICBpZiAoZGVsZWdhdGUpIHtcbiAgICAgICAgICB2YXIgZGVsZWdhdGVSZXN1bHQgPSBtYXliZUludm9rZURlbGVnYXRlKGRlbGVnYXRlLCBjb250ZXh0KTtcbiAgICAgICAgICBpZiAoZGVsZWdhdGVSZXN1bHQpIHtcbiAgICAgICAgICAgIGlmIChkZWxlZ2F0ZVJlc3VsdCA9PT0gQ29udGludWVTZW50aW5lbCkgY29udGludWU7XG4gICAgICAgICAgICByZXR1cm4gZGVsZWdhdGVSZXN1bHQ7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbnRleHQubWV0aG9kID09PSBcIm5leHRcIikge1xuICAgICAgICAgIC8vIFNldHRpbmcgY29udGV4dC5fc2VudCBmb3IgbGVnYWN5IHN1cHBvcnQgb2YgQmFiZWwnc1xuICAgICAgICAgIC8vIGZ1bmN0aW9uLnNlbnQgaW1wbGVtZW50YXRpb24uXG4gICAgICAgICAgY29udGV4dC5zZW50ID0gY29udGV4dC5fc2VudCA9IGNvbnRleHQuYXJnO1xuXG4gICAgICAgIH0gZWxzZSBpZiAoY29udGV4dC5tZXRob2QgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgIGlmIChzdGF0ZSA9PT0gR2VuU3RhdGVTdXNwZW5kZWRTdGFydCkge1xuICAgICAgICAgICAgc3RhdGUgPSBHZW5TdGF0ZUNvbXBsZXRlZDtcbiAgICAgICAgICAgIHRocm93IGNvbnRleHQuYXJnO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbnRleHQuZGlzcGF0Y2hFeGNlcHRpb24oY29udGV4dC5hcmcpO1xuXG4gICAgICAgIH0gZWxzZSBpZiAoY29udGV4dC5tZXRob2QgPT09IFwicmV0dXJuXCIpIHtcbiAgICAgICAgICBjb250ZXh0LmFicnVwdChcInJldHVyblwiLCBjb250ZXh0LmFyZyk7XG4gICAgICAgIH1cblxuICAgICAgICBzdGF0ZSA9IEdlblN0YXRlRXhlY3V0aW5nO1xuXG4gICAgICAgIHZhciByZWNvcmQgPSB0cnlDYXRjaChpbm5lckZuLCBzZWxmLCBjb250ZXh0KTtcbiAgICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcIm5vcm1hbFwiKSB7XG4gICAgICAgICAgLy8gSWYgYW4gZXhjZXB0aW9uIGlzIHRocm93biBmcm9tIGlubmVyRm4sIHdlIGxlYXZlIHN0YXRlID09PVxuICAgICAgICAgIC8vIEdlblN0YXRlRXhlY3V0aW5nIGFuZCBsb29wIGJhY2sgZm9yIGFub3RoZXIgaW52b2NhdGlvbi5cbiAgICAgICAgICBzdGF0ZSA9IGNvbnRleHQuZG9uZVxuICAgICAgICAgICAgPyBHZW5TdGF0ZUNvbXBsZXRlZFxuICAgICAgICAgICAgOiBHZW5TdGF0ZVN1c3BlbmRlZFlpZWxkO1xuXG4gICAgICAgICAgaWYgKHJlY29yZC5hcmcgPT09IENvbnRpbnVlU2VudGluZWwpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB2YWx1ZTogcmVjb3JkLmFyZyxcbiAgICAgICAgICAgIGRvbmU6IGNvbnRleHQuZG9uZVxuICAgICAgICAgIH07XG5cbiAgICAgICAgfSBlbHNlIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgc3RhdGUgPSBHZW5TdGF0ZUNvbXBsZXRlZDtcbiAgICAgICAgICAvLyBEaXNwYXRjaCB0aGUgZXhjZXB0aW9uIGJ5IGxvb3BpbmcgYmFjayBhcm91bmQgdG8gdGhlXG4gICAgICAgICAgLy8gY29udGV4dC5kaXNwYXRjaEV4Y2VwdGlvbihjb250ZXh0LmFyZykgY2FsbCBhYm92ZS5cbiAgICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwidGhyb3dcIjtcbiAgICAgICAgICBjb250ZXh0LmFyZyA9IHJlY29yZC5hcmc7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgLy8gQ2FsbCBkZWxlZ2F0ZS5pdGVyYXRvcltjb250ZXh0Lm1ldGhvZF0oY29udGV4dC5hcmcpIGFuZCBoYW5kbGUgdGhlXG4gIC8vIHJlc3VsdCwgZWl0aGVyIGJ5IHJldHVybmluZyBhIHsgdmFsdWUsIGRvbmUgfSByZXN1bHQgZnJvbSB0aGVcbiAgLy8gZGVsZWdhdGUgaXRlcmF0b3IsIG9yIGJ5IG1vZGlmeWluZyBjb250ZXh0Lm1ldGhvZCBhbmQgY29udGV4dC5hcmcsXG4gIC8vIHNldHRpbmcgY29udGV4dC5kZWxlZ2F0ZSB0byBudWxsLCBhbmQgcmV0dXJuaW5nIHRoZSBDb250aW51ZVNlbnRpbmVsLlxuICBmdW5jdGlvbiBtYXliZUludm9rZURlbGVnYXRlKGRlbGVnYXRlLCBjb250ZXh0KSB7XG4gICAgdmFyIG1ldGhvZCA9IGRlbGVnYXRlLml0ZXJhdG9yW2NvbnRleHQubWV0aG9kXTtcbiAgICBpZiAobWV0aG9kID09PSB1bmRlZmluZWQpIHtcbiAgICAgIC8vIEEgLnRocm93IG9yIC5yZXR1cm4gd2hlbiB0aGUgZGVsZWdhdGUgaXRlcmF0b3IgaGFzIG5vIC50aHJvd1xuICAgICAgLy8gbWV0aG9kIGFsd2F5cyB0ZXJtaW5hdGVzIHRoZSB5aWVsZCogbG9vcC5cbiAgICAgIGNvbnRleHQuZGVsZWdhdGUgPSBudWxsO1xuXG4gICAgICBpZiAoY29udGV4dC5tZXRob2QgPT09IFwidGhyb3dcIikge1xuICAgICAgICAvLyBOb3RlOiBbXCJyZXR1cm5cIl0gbXVzdCBiZSB1c2VkIGZvciBFUzMgcGFyc2luZyBjb21wYXRpYmlsaXR5LlxuICAgICAgICBpZiAoZGVsZWdhdGUuaXRlcmF0b3JbXCJyZXR1cm5cIl0pIHtcbiAgICAgICAgICAvLyBJZiB0aGUgZGVsZWdhdGUgaXRlcmF0b3IgaGFzIGEgcmV0dXJuIG1ldGhvZCwgZ2l2ZSBpdCBhXG4gICAgICAgICAgLy8gY2hhbmNlIHRvIGNsZWFuIHVwLlxuICAgICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJyZXR1cm5cIjtcbiAgICAgICAgICBjb250ZXh0LmFyZyA9IHVuZGVmaW5lZDtcbiAgICAgICAgICBtYXliZUludm9rZURlbGVnYXRlKGRlbGVnYXRlLCBjb250ZXh0KTtcblxuICAgICAgICAgIGlmIChjb250ZXh0Lm1ldGhvZCA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgICAvLyBJZiBtYXliZUludm9rZURlbGVnYXRlKGNvbnRleHQpIGNoYW5nZWQgY29udGV4dC5tZXRob2QgZnJvbVxuICAgICAgICAgICAgLy8gXCJyZXR1cm5cIiB0byBcInRocm93XCIsIGxldCB0aGF0IG92ZXJyaWRlIHRoZSBUeXBlRXJyb3IgYmVsb3cuXG4gICAgICAgICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwidGhyb3dcIjtcbiAgICAgICAgY29udGV4dC5hcmcgPSBuZXcgVHlwZUVycm9yKFxuICAgICAgICAgIFwiVGhlIGl0ZXJhdG9yIGRvZXMgbm90IHByb3ZpZGUgYSAndGhyb3cnIG1ldGhvZFwiKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfVxuXG4gICAgdmFyIHJlY29yZCA9IHRyeUNhdGNoKG1ldGhvZCwgZGVsZWdhdGUuaXRlcmF0b3IsIGNvbnRleHQuYXJnKTtcblxuICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICBjb250ZXh0Lm1ldGhvZCA9IFwidGhyb3dcIjtcbiAgICAgIGNvbnRleHQuYXJnID0gcmVjb3JkLmFyZztcbiAgICAgIGNvbnRleHQuZGVsZWdhdGUgPSBudWxsO1xuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfVxuXG4gICAgdmFyIGluZm8gPSByZWNvcmQuYXJnO1xuXG4gICAgaWYgKCEgaW5mbykge1xuICAgICAgY29udGV4dC5tZXRob2QgPSBcInRocm93XCI7XG4gICAgICBjb250ZXh0LmFyZyA9IG5ldyBUeXBlRXJyb3IoXCJpdGVyYXRvciByZXN1bHQgaXMgbm90IGFuIG9iamVjdFwiKTtcbiAgICAgIGNvbnRleHQuZGVsZWdhdGUgPSBudWxsO1xuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfVxuXG4gICAgaWYgKGluZm8uZG9uZSkge1xuICAgICAgLy8gQXNzaWduIHRoZSByZXN1bHQgb2YgdGhlIGZpbmlzaGVkIGRlbGVnYXRlIHRvIHRoZSB0ZW1wb3JhcnlcbiAgICAgIC8vIHZhcmlhYmxlIHNwZWNpZmllZCBieSBkZWxlZ2F0ZS5yZXN1bHROYW1lIChzZWUgZGVsZWdhdGVZaWVsZCkuXG4gICAgICBjb250ZXh0W2RlbGVnYXRlLnJlc3VsdE5hbWVdID0gaW5mby52YWx1ZTtcblxuICAgICAgLy8gUmVzdW1lIGV4ZWN1dGlvbiBhdCB0aGUgZGVzaXJlZCBsb2NhdGlvbiAoc2VlIGRlbGVnYXRlWWllbGQpLlxuICAgICAgY29udGV4dC5uZXh0ID0gZGVsZWdhdGUubmV4dExvYztcblxuICAgICAgLy8gSWYgY29udGV4dC5tZXRob2Qgd2FzIFwidGhyb3dcIiBidXQgdGhlIGRlbGVnYXRlIGhhbmRsZWQgdGhlXG4gICAgICAvLyBleGNlcHRpb24sIGxldCB0aGUgb3V0ZXIgZ2VuZXJhdG9yIHByb2NlZWQgbm9ybWFsbHkuIElmXG4gICAgICAvLyBjb250ZXh0Lm1ldGhvZCB3YXMgXCJuZXh0XCIsIGZvcmdldCBjb250ZXh0LmFyZyBzaW5jZSBpdCBoYXMgYmVlblxuICAgICAgLy8gXCJjb25zdW1lZFwiIGJ5IHRoZSBkZWxlZ2F0ZSBpdGVyYXRvci4gSWYgY29udGV4dC5tZXRob2Qgd2FzXG4gICAgICAvLyBcInJldHVyblwiLCBhbGxvdyB0aGUgb3JpZ2luYWwgLnJldHVybiBjYWxsIHRvIGNvbnRpbnVlIGluIHRoZVxuICAgICAgLy8gb3V0ZXIgZ2VuZXJhdG9yLlxuICAgICAgaWYgKGNvbnRleHQubWV0aG9kICE9PSBcInJldHVyblwiKSB7XG4gICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJuZXh0XCI7XG4gICAgICAgIGNvbnRleHQuYXJnID0gdW5kZWZpbmVkO1xuICAgICAgfVxuXG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFJlLXlpZWxkIHRoZSByZXN1bHQgcmV0dXJuZWQgYnkgdGhlIGRlbGVnYXRlIG1ldGhvZC5cbiAgICAgIHJldHVybiBpbmZvO1xuICAgIH1cblxuICAgIC8vIFRoZSBkZWxlZ2F0ZSBpdGVyYXRvciBpcyBmaW5pc2hlZCwgc28gZm9yZ2V0IGl0IGFuZCBjb250aW51ZSB3aXRoXG4gICAgLy8gdGhlIG91dGVyIGdlbmVyYXRvci5cbiAgICBjb250ZXh0LmRlbGVnYXRlID0gbnVsbDtcbiAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgfVxuXG4gIC8vIERlZmluZSBHZW5lcmF0b3IucHJvdG90eXBlLntuZXh0LHRocm93LHJldHVybn0gaW4gdGVybXMgb2YgdGhlXG4gIC8vIHVuaWZpZWQgLl9pbnZva2UgaGVscGVyIG1ldGhvZC5cbiAgZGVmaW5lSXRlcmF0b3JNZXRob2RzKEdwKTtcblxuICBHcFt0b1N0cmluZ1RhZ1N5bWJvbF0gPSBcIkdlbmVyYXRvclwiO1xuXG4gIC8vIEEgR2VuZXJhdG9yIHNob3VsZCBhbHdheXMgcmV0dXJuIGl0c2VsZiBhcyB0aGUgaXRlcmF0b3Igb2JqZWN0IHdoZW4gdGhlXG4gIC8vIEBAaXRlcmF0b3IgZnVuY3Rpb24gaXMgY2FsbGVkIG9uIGl0LiBTb21lIGJyb3dzZXJzJyBpbXBsZW1lbnRhdGlvbnMgb2YgdGhlXG4gIC8vIGl0ZXJhdG9yIHByb3RvdHlwZSBjaGFpbiBpbmNvcnJlY3RseSBpbXBsZW1lbnQgdGhpcywgY2F1c2luZyB0aGUgR2VuZXJhdG9yXG4gIC8vIG9iamVjdCB0byBub3QgYmUgcmV0dXJuZWQgZnJvbSB0aGlzIGNhbGwuIFRoaXMgZW5zdXJlcyB0aGF0IGRvZXNuJ3QgaGFwcGVuLlxuICAvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2ZhY2Vib29rL3JlZ2VuZXJhdG9yL2lzc3Vlcy8yNzQgZm9yIG1vcmUgZGV0YWlscy5cbiAgR3BbaXRlcmF0b3JTeW1ib2xdID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgR3AudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gXCJbb2JqZWN0IEdlbmVyYXRvcl1cIjtcbiAgfTtcblxuICBmdW5jdGlvbiBwdXNoVHJ5RW50cnkobG9jcykge1xuICAgIHZhciBlbnRyeSA9IHsgdHJ5TG9jOiBsb2NzWzBdIH07XG5cbiAgICBpZiAoMSBpbiBsb2NzKSB7XG4gICAgICBlbnRyeS5jYXRjaExvYyA9IGxvY3NbMV07XG4gICAgfVxuXG4gICAgaWYgKDIgaW4gbG9jcykge1xuICAgICAgZW50cnkuZmluYWxseUxvYyA9IGxvY3NbMl07XG4gICAgICBlbnRyeS5hZnRlckxvYyA9IGxvY3NbM107XG4gICAgfVxuXG4gICAgdGhpcy50cnlFbnRyaWVzLnB1c2goZW50cnkpO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVzZXRUcnlFbnRyeShlbnRyeSkge1xuICAgIHZhciByZWNvcmQgPSBlbnRyeS5jb21wbGV0aW9uIHx8IHt9O1xuICAgIHJlY29yZC50eXBlID0gXCJub3JtYWxcIjtcbiAgICBkZWxldGUgcmVjb3JkLmFyZztcbiAgICBlbnRyeS5jb21wbGV0aW9uID0gcmVjb3JkO1xuICB9XG5cbiAgZnVuY3Rpb24gQ29udGV4dCh0cnlMb2NzTGlzdCkge1xuICAgIC8vIFRoZSByb290IGVudHJ5IG9iamVjdCAoZWZmZWN0aXZlbHkgYSB0cnkgc3RhdGVtZW50IHdpdGhvdXQgYSBjYXRjaFxuICAgIC8vIG9yIGEgZmluYWxseSBibG9jaykgZ2l2ZXMgdXMgYSBwbGFjZSB0byBzdG9yZSB2YWx1ZXMgdGhyb3duIGZyb21cbiAgICAvLyBsb2NhdGlvbnMgd2hlcmUgdGhlcmUgaXMgbm8gZW5jbG9zaW5nIHRyeSBzdGF0ZW1lbnQuXG4gICAgdGhpcy50cnlFbnRyaWVzID0gW3sgdHJ5TG9jOiBcInJvb3RcIiB9XTtcbiAgICB0cnlMb2NzTGlzdC5mb3JFYWNoKHB1c2hUcnlFbnRyeSwgdGhpcyk7XG4gICAgdGhpcy5yZXNldCh0cnVlKTtcbiAgfVxuXG4gIGV4cG9ydHMua2V5cyA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICAgIHZhciBrZXlzID0gW107XG4gICAgZm9yICh2YXIga2V5IGluIG9iamVjdCkge1xuICAgICAga2V5cy5wdXNoKGtleSk7XG4gICAgfVxuICAgIGtleXMucmV2ZXJzZSgpO1xuXG4gICAgLy8gUmF0aGVyIHRoYW4gcmV0dXJuaW5nIGFuIG9iamVjdCB3aXRoIGEgbmV4dCBtZXRob2QsIHdlIGtlZXBcbiAgICAvLyB0aGluZ3Mgc2ltcGxlIGFuZCByZXR1cm4gdGhlIG5leHQgZnVuY3Rpb24gaXRzZWxmLlxuICAgIHJldHVybiBmdW5jdGlvbiBuZXh0KCkge1xuICAgICAgd2hpbGUgKGtleXMubGVuZ3RoKSB7XG4gICAgICAgIHZhciBrZXkgPSBrZXlzLnBvcCgpO1xuICAgICAgICBpZiAoa2V5IGluIG9iamVjdCkge1xuICAgICAgICAgIG5leHQudmFsdWUgPSBrZXk7XG4gICAgICAgICAgbmV4dC5kb25lID0gZmFsc2U7XG4gICAgICAgICAgcmV0dXJuIG5leHQ7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gVG8gYXZvaWQgY3JlYXRpbmcgYW4gYWRkaXRpb25hbCBvYmplY3QsIHdlIGp1c3QgaGFuZyB0aGUgLnZhbHVlXG4gICAgICAvLyBhbmQgLmRvbmUgcHJvcGVydGllcyBvZmYgdGhlIG5leHQgZnVuY3Rpb24gb2JqZWN0IGl0c2VsZi4gVGhpc1xuICAgICAgLy8gYWxzbyBlbnN1cmVzIHRoYXQgdGhlIG1pbmlmaWVyIHdpbGwgbm90IGFub255bWl6ZSB0aGUgZnVuY3Rpb24uXG4gICAgICBuZXh0LmRvbmUgPSB0cnVlO1xuICAgICAgcmV0dXJuIG5leHQ7XG4gICAgfTtcbiAgfTtcblxuICBmdW5jdGlvbiB2YWx1ZXMoaXRlcmFibGUpIHtcbiAgICBpZiAoaXRlcmFibGUpIHtcbiAgICAgIHZhciBpdGVyYXRvck1ldGhvZCA9IGl0ZXJhYmxlW2l0ZXJhdG9yU3ltYm9sXTtcbiAgICAgIGlmIChpdGVyYXRvck1ldGhvZCkge1xuICAgICAgICByZXR1cm4gaXRlcmF0b3JNZXRob2QuY2FsbChpdGVyYWJsZSk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2YgaXRlcmFibGUubmV4dCA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIHJldHVybiBpdGVyYWJsZTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFpc05hTihpdGVyYWJsZS5sZW5ndGgpKSB7XG4gICAgICAgIHZhciBpID0gLTEsIG5leHQgPSBmdW5jdGlvbiBuZXh0KCkge1xuICAgICAgICAgIHdoaWxlICgrK2kgPCBpdGVyYWJsZS5sZW5ndGgpIHtcbiAgICAgICAgICAgIGlmIChoYXNPd24uY2FsbChpdGVyYWJsZSwgaSkpIHtcbiAgICAgICAgICAgICAgbmV4dC52YWx1ZSA9IGl0ZXJhYmxlW2ldO1xuICAgICAgICAgICAgICBuZXh0LmRvbmUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgcmV0dXJuIG5leHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgbmV4dC52YWx1ZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICBuZXh0LmRvbmUgPSB0cnVlO1xuXG4gICAgICAgICAgcmV0dXJuIG5leHQ7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIG5leHQubmV4dCA9IG5leHQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gUmV0dXJuIGFuIGl0ZXJhdG9yIHdpdGggbm8gdmFsdWVzLlxuICAgIHJldHVybiB7IG5leHQ6IGRvbmVSZXN1bHQgfTtcbiAgfVxuICBleHBvcnRzLnZhbHVlcyA9IHZhbHVlcztcblxuICBmdW5jdGlvbiBkb25lUmVzdWx0KCkge1xuICAgIHJldHVybiB7IHZhbHVlOiB1bmRlZmluZWQsIGRvbmU6IHRydWUgfTtcbiAgfVxuXG4gIENvbnRleHQucHJvdG90eXBlID0ge1xuICAgIGNvbnN0cnVjdG9yOiBDb250ZXh0LFxuXG4gICAgcmVzZXQ6IGZ1bmN0aW9uKHNraXBUZW1wUmVzZXQpIHtcbiAgICAgIHRoaXMucHJldiA9IDA7XG4gICAgICB0aGlzLm5leHQgPSAwO1xuICAgICAgLy8gUmVzZXR0aW5nIGNvbnRleHQuX3NlbnQgZm9yIGxlZ2FjeSBzdXBwb3J0IG9mIEJhYmVsJ3NcbiAgICAgIC8vIGZ1bmN0aW9uLnNlbnQgaW1wbGVtZW50YXRpb24uXG4gICAgICB0aGlzLnNlbnQgPSB0aGlzLl9zZW50ID0gdW5kZWZpbmVkO1xuICAgICAgdGhpcy5kb25lID0gZmFsc2U7XG4gICAgICB0aGlzLmRlbGVnYXRlID0gbnVsbDtcblxuICAgICAgdGhpcy5tZXRob2QgPSBcIm5leHRcIjtcbiAgICAgIHRoaXMuYXJnID0gdW5kZWZpbmVkO1xuXG4gICAgICB0aGlzLnRyeUVudHJpZXMuZm9yRWFjaChyZXNldFRyeUVudHJ5KTtcblxuICAgICAgaWYgKCFza2lwVGVtcFJlc2V0KSB7XG4gICAgICAgIGZvciAodmFyIG5hbWUgaW4gdGhpcykge1xuICAgICAgICAgIC8vIE5vdCBzdXJlIGFib3V0IHRoZSBvcHRpbWFsIG9yZGVyIG9mIHRoZXNlIGNvbmRpdGlvbnM6XG4gICAgICAgICAgaWYgKG5hbWUuY2hhckF0KDApID09PSBcInRcIiAmJlxuICAgICAgICAgICAgICBoYXNPd24uY2FsbCh0aGlzLCBuYW1lKSAmJlxuICAgICAgICAgICAgICAhaXNOYU4oK25hbWUuc2xpY2UoMSkpKSB7XG4gICAgICAgICAgICB0aGlzW25hbWVdID0gdW5kZWZpbmVkO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBzdG9wOiBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMuZG9uZSA9IHRydWU7XG5cbiAgICAgIHZhciByb290RW50cnkgPSB0aGlzLnRyeUVudHJpZXNbMF07XG4gICAgICB2YXIgcm9vdFJlY29yZCA9IHJvb3RFbnRyeS5jb21wbGV0aW9uO1xuICAgICAgaWYgKHJvb3RSZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgIHRocm93IHJvb3RSZWNvcmQuYXJnO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5ydmFsO1xuICAgIH0sXG5cbiAgICBkaXNwYXRjaEV4Y2VwdGlvbjogZnVuY3Rpb24oZXhjZXB0aW9uKSB7XG4gICAgICBpZiAodGhpcy5kb25lKSB7XG4gICAgICAgIHRocm93IGV4Y2VwdGlvbjtcbiAgICAgIH1cblxuICAgICAgdmFyIGNvbnRleHQgPSB0aGlzO1xuICAgICAgZnVuY3Rpb24gaGFuZGxlKGxvYywgY2F1Z2h0KSB7XG4gICAgICAgIHJlY29yZC50eXBlID0gXCJ0aHJvd1wiO1xuICAgICAgICByZWNvcmQuYXJnID0gZXhjZXB0aW9uO1xuICAgICAgICBjb250ZXh0Lm5leHQgPSBsb2M7XG5cbiAgICAgICAgaWYgKGNhdWdodCkge1xuICAgICAgICAgIC8vIElmIHRoZSBkaXNwYXRjaGVkIGV4Y2VwdGlvbiB3YXMgY2F1Z2h0IGJ5IGEgY2F0Y2ggYmxvY2ssXG4gICAgICAgICAgLy8gdGhlbiBsZXQgdGhhdCBjYXRjaCBibG9jayBoYW5kbGUgdGhlIGV4Y2VwdGlvbiBub3JtYWxseS5cbiAgICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwibmV4dFwiO1xuICAgICAgICAgIGNvbnRleHQuYXJnID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuICEhIGNhdWdodDtcbiAgICAgIH1cblxuICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHJ5RW50cmllcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICB2YXIgZW50cnkgPSB0aGlzLnRyeUVudHJpZXNbaV07XG4gICAgICAgIHZhciByZWNvcmQgPSBlbnRyeS5jb21wbGV0aW9uO1xuXG4gICAgICAgIGlmIChlbnRyeS50cnlMb2MgPT09IFwicm9vdFwiKSB7XG4gICAgICAgICAgLy8gRXhjZXB0aW9uIHRocm93biBvdXRzaWRlIG9mIGFueSB0cnkgYmxvY2sgdGhhdCBjb3VsZCBoYW5kbGVcbiAgICAgICAgICAvLyBpdCwgc28gc2V0IHRoZSBjb21wbGV0aW9uIHZhbHVlIG9mIHRoZSBlbnRpcmUgZnVuY3Rpb24gdG9cbiAgICAgICAgICAvLyB0aHJvdyB0aGUgZXhjZXB0aW9uLlxuICAgICAgICAgIHJldHVybiBoYW5kbGUoXCJlbmRcIik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZW50cnkudHJ5TG9jIDw9IHRoaXMucHJldikge1xuICAgICAgICAgIHZhciBoYXNDYXRjaCA9IGhhc093bi5jYWxsKGVudHJ5LCBcImNhdGNoTG9jXCIpO1xuICAgICAgICAgIHZhciBoYXNGaW5hbGx5ID0gaGFzT3duLmNhbGwoZW50cnksIFwiZmluYWxseUxvY1wiKTtcblxuICAgICAgICAgIGlmIChoYXNDYXRjaCAmJiBoYXNGaW5hbGx5KSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wcmV2IDwgZW50cnkuY2F0Y2hMb2MpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZShlbnRyeS5jYXRjaExvYywgdHJ1ZSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMucHJldiA8IGVudHJ5LmZpbmFsbHlMb2MpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZShlbnRyeS5maW5hbGx5TG9jKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIH0gZWxzZSBpZiAoaGFzQ2F0Y2gpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnByZXYgPCBlbnRyeS5jYXRjaExvYykge1xuICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlKGVudHJ5LmNhdGNoTG9jLCB0cnVlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIH0gZWxzZSBpZiAoaGFzRmluYWxseSkge1xuICAgICAgICAgICAgaWYgKHRoaXMucHJldiA8IGVudHJ5LmZpbmFsbHlMb2MpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZShlbnRyeS5maW5hbGx5TG9jKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJ0cnkgc3RhdGVtZW50IHdpdGhvdXQgY2F0Y2ggb3IgZmluYWxseVwiKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgYWJydXB0OiBmdW5jdGlvbih0eXBlLCBhcmcpIHtcbiAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldO1xuICAgICAgICBpZiAoZW50cnkudHJ5TG9jIDw9IHRoaXMucHJldiAmJlxuICAgICAgICAgICAgaGFzT3duLmNhbGwoZW50cnksIFwiZmluYWxseUxvY1wiKSAmJlxuICAgICAgICAgICAgdGhpcy5wcmV2IDwgZW50cnkuZmluYWxseUxvYykge1xuICAgICAgICAgIHZhciBmaW5hbGx5RW50cnkgPSBlbnRyeTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoZmluYWxseUVudHJ5ICYmXG4gICAgICAgICAgKHR5cGUgPT09IFwiYnJlYWtcIiB8fFxuICAgICAgICAgICB0eXBlID09PSBcImNvbnRpbnVlXCIpICYmXG4gICAgICAgICAgZmluYWxseUVudHJ5LnRyeUxvYyA8PSBhcmcgJiZcbiAgICAgICAgICBhcmcgPD0gZmluYWxseUVudHJ5LmZpbmFsbHlMb2MpIHtcbiAgICAgICAgLy8gSWdub3JlIHRoZSBmaW5hbGx5IGVudHJ5IGlmIGNvbnRyb2wgaXMgbm90IGp1bXBpbmcgdG8gYVxuICAgICAgICAvLyBsb2NhdGlvbiBvdXRzaWRlIHRoZSB0cnkvY2F0Y2ggYmxvY2suXG4gICAgICAgIGZpbmFsbHlFbnRyeSA9IG51bGw7XG4gICAgICB9XG5cbiAgICAgIHZhciByZWNvcmQgPSBmaW5hbGx5RW50cnkgPyBmaW5hbGx5RW50cnkuY29tcGxldGlvbiA6IHt9O1xuICAgICAgcmVjb3JkLnR5cGUgPSB0eXBlO1xuICAgICAgcmVjb3JkLmFyZyA9IGFyZztcblxuICAgICAgaWYgKGZpbmFsbHlFbnRyeSkge1xuICAgICAgICB0aGlzLm1ldGhvZCA9IFwibmV4dFwiO1xuICAgICAgICB0aGlzLm5leHQgPSBmaW5hbGx5RW50cnkuZmluYWxseUxvYztcbiAgICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLmNvbXBsZXRlKHJlY29yZCk7XG4gICAgfSxcblxuICAgIGNvbXBsZXRlOiBmdW5jdGlvbihyZWNvcmQsIGFmdGVyTG9jKSB7XG4gICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICB0aHJvdyByZWNvcmQuYXJnO1xuICAgICAgfVxuXG4gICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwiYnJlYWtcIiB8fFxuICAgICAgICAgIHJlY29yZC50eXBlID09PSBcImNvbnRpbnVlXCIpIHtcbiAgICAgICAgdGhpcy5uZXh0ID0gcmVjb3JkLmFyZztcbiAgICAgIH0gZWxzZSBpZiAocmVjb3JkLnR5cGUgPT09IFwicmV0dXJuXCIpIHtcbiAgICAgICAgdGhpcy5ydmFsID0gdGhpcy5hcmcgPSByZWNvcmQuYXJnO1xuICAgICAgICB0aGlzLm1ldGhvZCA9IFwicmV0dXJuXCI7XG4gICAgICAgIHRoaXMubmV4dCA9IFwiZW5kXCI7XG4gICAgICB9IGVsc2UgaWYgKHJlY29yZC50eXBlID09PSBcIm5vcm1hbFwiICYmIGFmdGVyTG9jKSB7XG4gICAgICAgIHRoaXMubmV4dCA9IGFmdGVyTG9jO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICB9LFxuXG4gICAgZmluaXNoOiBmdW5jdGlvbihmaW5hbGx5TG9jKSB7XG4gICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTtcbiAgICAgICAgaWYgKGVudHJ5LmZpbmFsbHlMb2MgPT09IGZpbmFsbHlMb2MpIHtcbiAgICAgICAgICB0aGlzLmNvbXBsZXRlKGVudHJ5LmNvbXBsZXRpb24sIGVudHJ5LmFmdGVyTG9jKTtcbiAgICAgICAgICByZXNldFRyeUVudHJ5KGVudHJ5KTtcbiAgICAgICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBcImNhdGNoXCI6IGZ1bmN0aW9uKHRyeUxvYykge1xuICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHJ5RW50cmllcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICB2YXIgZW50cnkgPSB0aGlzLnRyeUVudHJpZXNbaV07XG4gICAgICAgIGlmIChlbnRyeS50cnlMb2MgPT09IHRyeUxvYykge1xuICAgICAgICAgIHZhciByZWNvcmQgPSBlbnRyeS5jb21wbGV0aW9uO1xuICAgICAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgICB2YXIgdGhyb3duID0gcmVjb3JkLmFyZztcbiAgICAgICAgICAgIHJlc2V0VHJ5RW50cnkoZW50cnkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gdGhyb3duO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIFRoZSBjb250ZXh0LmNhdGNoIG1ldGhvZCBtdXN0IG9ubHkgYmUgY2FsbGVkIHdpdGggYSBsb2NhdGlvblxuICAgICAgLy8gYXJndW1lbnQgdGhhdCBjb3JyZXNwb25kcyB0byBhIGtub3duIGNhdGNoIGJsb2NrLlxuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiaWxsZWdhbCBjYXRjaCBhdHRlbXB0XCIpO1xuICAgIH0sXG5cbiAgICBkZWxlZ2F0ZVlpZWxkOiBmdW5jdGlvbihpdGVyYWJsZSwgcmVzdWx0TmFtZSwgbmV4dExvYykge1xuICAgICAgdGhpcy5kZWxlZ2F0ZSA9IHtcbiAgICAgICAgaXRlcmF0b3I6IHZhbHVlcyhpdGVyYWJsZSksXG4gICAgICAgIHJlc3VsdE5hbWU6IHJlc3VsdE5hbWUsXG4gICAgICAgIG5leHRMb2M6IG5leHRMb2NcbiAgICAgIH07XG5cbiAgICAgIGlmICh0aGlzLm1ldGhvZCA9PT0gXCJuZXh0XCIpIHtcbiAgICAgICAgLy8gRGVsaWJlcmF0ZWx5IGZvcmdldCB0aGUgbGFzdCBzZW50IHZhbHVlIHNvIHRoYXQgd2UgZG9uJ3RcbiAgICAgICAgLy8gYWNjaWRlbnRhbGx5IHBhc3MgaXQgb24gdG8gdGhlIGRlbGVnYXRlLlxuICAgICAgICB0aGlzLmFyZyA9IHVuZGVmaW5lZDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfVxuICB9O1xuXG4gIC8vIFJlZ2FyZGxlc3Mgb2Ygd2hldGhlciB0aGlzIHNjcmlwdCBpcyBleGVjdXRpbmcgYXMgYSBDb21tb25KUyBtb2R1bGVcbiAgLy8gb3Igbm90LCByZXR1cm4gdGhlIHJ1bnRpbWUgb2JqZWN0IHNvIHRoYXQgd2UgY2FuIGRlY2xhcmUgdGhlIHZhcmlhYmxlXG4gIC8vIHJlZ2VuZXJhdG9yUnVudGltZSBpbiB0aGUgb3V0ZXIgc2NvcGUsIHdoaWNoIGFsbG93cyB0aGlzIG1vZHVsZSB0byBiZVxuICAvLyBpbmplY3RlZCBlYXNpbHkgYnkgYGJpbi9yZWdlbmVyYXRvciAtLWluY2x1ZGUtcnVudGltZSBzY3JpcHQuanNgLlxuICByZXR1cm4gZXhwb3J0cztcblxufShcbiAgLy8gSWYgdGhpcyBzY3JpcHQgaXMgZXhlY3V0aW5nIGFzIGEgQ29tbW9uSlMgbW9kdWxlLCB1c2UgbW9kdWxlLmV4cG9ydHNcbiAgLy8gYXMgdGhlIHJlZ2VuZXJhdG9yUnVudGltZSBuYW1lc3BhY2UuIE90aGVyd2lzZSBjcmVhdGUgYSBuZXcgZW1wdHlcbiAgLy8gb2JqZWN0LiBFaXRoZXIgd2F5LCB0aGUgcmVzdWx0aW5nIG9iamVjdCB3aWxsIGJlIHVzZWQgdG8gaW5pdGlhbGl6ZVxuICAvLyB0aGUgcmVnZW5lcmF0b3JSdW50aW1lIHZhcmlhYmxlIGF0IHRoZSB0b3Agb2YgdGhpcyBmaWxlLlxuICB0eXBlb2YgbW9kdWxlID09PSBcIm9iamVjdFwiID8gbW9kdWxlLmV4cG9ydHMgOiB7fVxuKSk7XG5cbnRyeSB7XG4gIHJlZ2VuZXJhdG9yUnVudGltZSA9IHJ1bnRpbWU7XG59IGNhdGNoIChhY2NpZGVudGFsU3RyaWN0TW9kZSkge1xuICAvLyBUaGlzIG1vZHVsZSBzaG91bGQgbm90IGJlIHJ1bm5pbmcgaW4gc3RyaWN0IG1vZGUsIHNvIHRoZSBhYm92ZVxuICAvLyBhc3NpZ25tZW50IHNob3VsZCBhbHdheXMgd29yayB1bmxlc3Mgc29tZXRoaW5nIGlzIG1pc2NvbmZpZ3VyZWQuIEp1c3RcbiAgLy8gaW4gY2FzZSBydW50aW1lLmpzIGFjY2lkZW50YWxseSBydW5zIGluIHN0cmljdCBtb2RlLCB3ZSBjYW4gZXNjYXBlXG4gIC8vIHN0cmljdCBtb2RlIHVzaW5nIGEgZ2xvYmFsIEZ1bmN0aW9uIGNhbGwuIFRoaXMgY291bGQgY29uY2VpdmFibHkgZmFpbFxuICAvLyBpZiBhIENvbnRlbnQgU2VjdXJpdHkgUG9saWN5IGZvcmJpZHMgdXNpbmcgRnVuY3Rpb24sIGJ1dCBpbiB0aGF0IGNhc2VcbiAgLy8gdGhlIHByb3BlciBzb2x1dGlvbiBpcyB0byBmaXggdGhlIGFjY2lkZW50YWwgc3RyaWN0IG1vZGUgcHJvYmxlbS4gSWZcbiAgLy8geW91J3ZlIG1pc2NvbmZpZ3VyZWQgeW91ciBidW5kbGVyIHRvIGZvcmNlIHN0cmljdCBtb2RlIGFuZCBhcHBsaWVkIGFcbiAgLy8gQ1NQIHRvIGZvcmJpZCBGdW5jdGlvbiwgYW5kIHlvdSdyZSBub3Qgd2lsbGluZyB0byBmaXggZWl0aGVyIG9mIHRob3NlXG4gIC8vIHByb2JsZW1zLCBwbGVhc2UgZGV0YWlsIHlvdXIgdW5pcXVlIHByZWRpY2FtZW50IGluIGEgR2l0SHViIGlzc3VlLlxuICBGdW5jdGlvbihcInJcIiwgXCJyZWdlbmVyYXRvclJ1bnRpbWUgPSByXCIpKHJ1bnRpbWUpO1xufVxuIiwiLyogZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLXZhcnMgKi9cbmltcG9ydCB7XG4gIGdvLFxuICBmaXhlZCxcbiAgc2xlZXAsXG4gIHB1dCxcbiAgdGFrZSxcbiAgc3B1dCxcbiAgc2xpZGluZyxcbiAgaW5zcGVjdG9yLFxuICBzdGFrZSxcbiAgc3RhdGUsXG4gIGxpc3Rlbixcbn0gZnJvbSAnLi4vLi4vLi4vc3JjJztcblxuaW5zcGVjdG9yKCgpID0+IHt9LCB0cnVlKTtcblxuY29uc3QgcyA9IHN0YXRlKCdmb28nKTtcbmNvbnN0IHRvTG93ZXJDYXNlID0gcy5zZWxlY3QodiA9PiB2LnRvTG93ZXJDYXNlKCkpYHRvTG93ZXJDYXNlYDtcblxubGlzdGVuKHRvTG93ZXJDYXNlLCB2ID0+IGNvbnNvbGUubG9nKHYpKTtcbnNwdXQocywgJ0JBUicpO1xuXG4vLyBjb25zdCB1cGRhdGUgPSBzLm11dGF0ZSgoY3VycmVudCwgcGF5bG9hZCkgPT4gY3VycmVudCArIHBheWxvYWQpO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==