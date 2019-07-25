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

/***/ "../../lib/ActElement.js":
/*!*************************************************************!*\
  !*** /Users/krasimir/Work/Krasimir/actml/lib/ActElement.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

function getFuncName(func) {
  if (func.name) return func.name;
  var result = /^function\s+([\w\$]+)\s*\(/.exec(func.toString());
  return result ? result[1] : 'unknown';
}

;

var createElement = function createElement(func, props, children) {
  if (typeof func !== 'function') {
    throw new Error('ActML element expects a function. "' + func + '" given instead.');
  }

  return {
    __actml: true,
    __used: 0,
    __running: false,
    id: null,
    props: props,
    name: getFuncName(func),
    children: children,
    initialize: function initialize(id) {
      var used = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      this.id = id;
      this.__used = used;
      this.__running = false;
    },
    mergeProps: function mergeProps(newProps) {
      this.props = Object.assign({}, this.props, newProps);
    },
    used: function used() {
      return this.__used;
    },
    isRunning: function isRunning() {
      return this.__running;
    },
    in: function _in() {
      this.__running = true;
    },
    consume: function consume() {
      return func(this.props);
    },
    out: function out() {
      this.__used += 1;
      this.__running = false;
    }
  };
};

exports.default = createElement;

/***/ }),

/***/ "../../lib/Context.js":
/*!**********************************************************!*\
  !*** /Users/krasimir/Work/Krasimir/actml/lib/Context.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createContextFactory;

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}
/* eslint-disable consistent-return */


var CONTEXT_KEY = '__CONTEXT_KEY__';
var PUBLIC_CONTEXT_KEY = exports.PUBLIC_CONTEXT_KEY = '__PUBLIC_CONTEXT_KEY__';
var ids = 0;

function getId() {
  return 'c' + ++ids;
}

;

function resolveContext(node, id) {
  var stack = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  stack.push(node.element.name);

  if (node[CONTEXT_KEY] && id in node[CONTEXT_KEY]) {
    return node[CONTEXT_KEY][id];
  } else if (node.parent) {
    return resolveContext(node.parent, id, stack);
  }

  console.warn('A context consumer is used with no provider.\n  Stack:\n' + stack.map(function (name) {
    return '    <' + name + '>';
  }).join('\n'));
}

function createContextFactory(processor) {
  return function createContext(initialValue) {
    var _ref3;

    var id = getId();

    var Provider = function Provider(_ref) {
      var value = _ref.value,
          children = _ref.children;
      var node = processor.node();

      if (!node[CONTEXT_KEY]) {
        node[CONTEXT_KEY] = {};
      }

      node[CONTEXT_KEY][id] = value;
      return children;
    };

    var Consumer = function Consumer(_ref2) {
      var children = _ref2.children;
      var node = processor.node();
      children(resolveContext(node, id) || initialValue);
    };

    return _ref3 = {}, _defineProperty(_ref3, PUBLIC_CONTEXT_KEY, function () {
      var node = processor.node();
      return resolveContext(node, id) || initialValue;
    }), _defineProperty(_ref3, 'Provider', Provider), _defineProperty(_ref3, 'Consumer', Consumer), _ref3;
  };
}

;

/***/ }),

/***/ "../../lib/Processor.js":
/*!************************************************************!*\
  !*** /Users/krasimir/Work/Krasimir/actml/lib/Processor.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createProcessor;

var _isActMLElement = __webpack_require__(/*! ./utils/isActMLElement */ "../../lib/utils/isActMLElement.js");

var _isActMLElement2 = _interopRequireDefault(_isActMLElement);

var _Tree = __webpack_require__(/*! ./Tree */ "../../lib/Tree.js");

var _Tree2 = _interopRequireDefault(_Tree);

var _usePubSub = __webpack_require__(/*! ./hooks/usePubSub */ "../../lib/hooks/usePubSub.js");

var _usePubSub2 = _interopRequireDefault(_usePubSub);

var _useState = __webpack_require__(/*! ./hooks/useState */ "../../lib/hooks/useState.js");

var _useState2 = _interopRequireDefault(_useState);

var _useEffect = __webpack_require__(/*! ./hooks/useEffect */ "../../lib/hooks/useEffect.js");

var _useEffect2 = _interopRequireDefault(_useEffect);

var _Queue = __webpack_require__(/*! ./Queue */ "../../lib/Queue.js");

var _Queue2 = _interopRequireDefault(_Queue);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}
/* eslint-disable no-use-before-define, consistent-return */


var CHILDREN = '__ACTML_CHILDREN__';
var CONSUME = 'CONSUME';
var PROCESS_RESULT = 'PROCESS_RESULT';
var RETURNED_ELEMENT = 'RETURNED_ELEMENT';
var CHILD = 'CHILD';

var isGenerator = function isGenerator(obj) {
  return obj && typeof obj['next'] === 'function';
};

var isPromise = function isPromise(obj) {
  return obj && typeof obj['then'] === 'function';
};

function createChildrenFunc(node, processNode) {
  var f = function f() {
    var _arguments = arguments;
    var children = node.element.children;

    if (children && children.length > 0) {
      var queueItemsToAdd = [];
      var results = [];
      var childrenQueue = (0, _Queue2.default)('  ' + node.element.name + ':children');

      var _loop = function _loop(i) {
        if ((0, _isActMLElement2.default)(children[i])) {
          var _children$i;

          (_children$i = children[i]).mergeProps.apply(_children$i, _arguments);

          queueItemsToAdd.push(function () {
            return processNode(node.addChildNode(children[i]));
          });
        } else if (typeof children[i] === 'function') {
          var funcResult = children[i].apply(children, _arguments);

          if ((0, _isActMLElement2.default)(funcResult)) {
            queueItemsToAdd.push(function () {
              return processNode(node.addChildNode(funcResult));
            });
          } else {
            results.push(funcResult);
          }
        } else {
          results.push(children[i]);
        }
      };

      for (var i = 0; i < children.length; i++) {
        _loop(i);
      }

      queueItemsToAdd.reverse().forEach(function (func) {
        childrenQueue.prependItem(CHILD, func, function (r) {
          return results.push(r);
        });
      });
      childrenQueue.process();
      return childrenQueue.onDone(function () {
        return results;
      });
    }
  };

  f[CHILDREN] = true;
  return f;
}

function createProcessor() {
  var tree = (0, _Tree2.default)();
  var currentNode = null;

  var processNode = function processNode(node) {
    currentNode = node;
    node.in();

    node.rerun = function () {
      return processNode(node);
    };

    node.element.mergeProps({
      children: createChildrenFunc(node, processNode)
    });
    var results = {};
    var queue = (0, _Queue2.default)(' ' + node.element.name); // CONSUME

    queue.add(CONSUME, function () {
      return node.element.consume();
    }, function (result) {
      return results[CONSUME] = result;
    }); // PROCESS_RESULT

    queue.add(PROCESS_RESULT, function () {
      var consumption = results[CONSUME]; // ActML element

      if ((0, _isActMLElement2.default)(consumption)) {
        queue.prependItem(RETURNED_ELEMENT, function () {
          return processNode(node.addChildNode(consumption));
        }, function (result) {
          return results[RETURNED_ELEMENT] = result;
        }); // generator
      } else if (isGenerator(consumption)) {
        var generator = consumption;
        queue.prependItem(RETURNED_ELEMENT, function () {
          return new Promise(function (generatorDone) {
            var genResult = void 0;

            (function iterate(value) {
              genResult = generator.next(value);

              if (!genResult.done) {
                if ((0, _isActMLElement2.default)(genResult.value)) {
                  var res = processNode(node.addChildNode(genResult.value));

                  if (isPromise(res)) {
                    res.then(function (r) {
                      return iterate(r);
                    });
                  } else {
                    iterate(res);
                  }
                }
              } else {
                if ((0, _isActMLElement2.default)(genResult.value)) {
                  var _res = processNode(node.addChildNode(genResult.value));

                  if (isPromise(_res)) {
                    _res.then(function (r) {
                      return generatorDone(r);
                    });
                  } else {
                    generatorDone(_res);
                  }
                } else {
                  generatorDone(genResult.value);
                }
              }
            })();
          });
        }, function (result) {
          return results[RETURNED_ELEMENT] = result;
        }); // children
      } else if (consumption && consumption[CHILDREN]) {
        queue.prependItem(RETURNED_ELEMENT, function () {
          return consumption();
        }, function (result) {
          results[RETURNED_ELEMENT] = result && result.length === 1 ? result[0] : result;
        });
      }
    }); // Running the queue

    queue.process(); // Getting the result. It is either a promise if there is
    // something asynchronous or a value

    return queue.onDone(function () {
      node.out();
      return RETURNED_ELEMENT in results ? results[RETURNED_ELEMENT] : results[CONSUME];
    });
  };

  return {
    node: function node() {
      return currentNode;
    },
    run: function run(element) {
      var rootNode = tree.resolveRoot(element);
      return processNode(rootNode);
    },
    onNodeIn: function onNodeIn(callback) {
      tree.addNodeInCallback(callback);
    },
    onNodeOut: function onNodeOut(callback) {
      tree.addNodeOutCallback(callback);
    },
    onNodeRemove: function onNodeRemove(callback) {
      tree.onNodeRemove(callback);
    },
    system: function system() {
      return {
        tree: tree,
        reset: function reset() {
          currentNode = null;
          tree.reset();

          _usePubSub2.default.clear();

          _useState2.default.clear();

          _useEffect2.default.clear();
        }
      };
    }
  };
}

;

/***/ }),

/***/ "../../lib/Queue.js":
/*!********************************************************!*\
  !*** /Users/krasimir/Work/Krasimir/actml/lib/Queue.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createQueue;

function _toConsumableArray(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }

    return arr2;
  } else {
    return Array.from(arr);
  }
}
/* eslint-disable no-return-assign */


var LOGS = false;

var log = function log() {
  var _console;

  return LOGS ? (_console = console).log.apply(_console, arguments) : null;
};

var isPromise = function isPromise(obj) {
  return obj && typeof obj['then'] === 'function';
};

var createItem = function createItem(type, func) {
  var onDone = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {};
  return {
    type: type,
    func: func,
    onDone: onDone
  };
};

function createQueue(context) {
  var items = [];
  var async = false;
  var running = false;

  var release = function release() {};

  return {
    add: function add(type, func, onDone) {
      log(context + ':Q: [...' + type + '] (' + (items.length + 1) + ' total)');
      items.push(createItem(type, func, onDone));
    },
    prependItem: function prependItem(type, func, onDone) {
      log(context + ':Q: [' + type + '...] (' + (items.length + 1) + ' total)');
      items = [createItem(type, func, onDone)].concat(_toConsumableArray(items));
    },
    process: function process(lastResult) {
      var _this = this;

      running = true;

      if (items.length === 0) {
        log(context + ':Q:done');
        running = false;
        release();
        return;
      }

      var item = items.shift();
      log(context + ':Q: ' + item.type + '() (' + items.length + ' left)');
      var result = item.func(lastResult);

      if (isPromise(result)) {
        async = true;
        result.then(function (asyncResult) {
          item.onDone(asyncResult);

          _this.process(asyncResult);
        }).catch(function (error) {
          release(error);
        });
      } else {
        item.onDone(result);
        this.process(result);
      }
    },
    onDone: function onDone(getResult) {
      if (async) {
        return new Promise(function (done, reject) {
          release = function release(error) {
            if (error) {
              reject(error);
            } else {
              done(getResult());
            }
          };
        });
      }

      return getResult();
    },
    isRunning: function isRunning() {
      return running;
    }
  };
}

;

/***/ }),

/***/ "../../lib/Tree.js":
/*!*******************************************************!*\
  !*** /Users/krasimir/Work/Krasimir/actml/lib/Tree.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

exports.default = Tree;

function _objectWithoutProperties(obj, keys) {
  var target = {};

  for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue;
    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
    target[i] = obj[i];
  }

  return target;
}
/* eslint-disable no-use-before-define, no-return-assign, max-len */


var LOGS = false;

var log = function log() {
  var _console;

  return LOGS ? (_console = console).log.apply(_console, arguments) : null;
};

function Tree() {
  var onNodeIn = [];
  var onNodeOut = [];
  var _onNodeRemove = [];
  var root = createNewNode();
  var ids = 0;

  function getId() {
    return 'a' + ++ids;
  }

  ;

  function useSameNode(node, newElement) {
    newElement.initialize(node.element.id, node.element.used());
    node.element = newElement;
    return node;
  }

  function treeDiff(oldElement, newElement) {
    if (oldElement && oldElement.name === newElement.name) {
      if (oldElement.props && newElement.props) {
        return oldElement.props.key === newElement.props.key;
      }

      return true;
    }

    return false;
  }

  function createNewNode(element, parent) {
    if (element) {
      element.initialize(getId());
    }

    var node = {
      element: element,
      children: [],
      parent: parent,
      cursor: 0,
      in: function _in() {
        var _this = this;

        log('-> ' + this.element.name);
        this.element.in();
        onNodeIn.forEach(function (c) {
          return c(_this);
        });

        if (true) {
          node.log('node:in');
        }
      },
      out: function out() {
        var _this2 = this;

        log('<- ' + this.element.name);
        this.element.out(); // If there're more nodes in the tree than what was processed

        if (this.cursor < this.children.length) {
          this.children.splice(this.cursor, this.children.length - this.cursor).forEach(function (removedNode) {
            return _onNodeRemove.forEach(function (c) {
              return c(removedNode);
            });
          });
        }

        this.cursor = 0;

        if (true) {
          node.log('node:out');
        }

        onNodeOut.forEach(function (c) {
          return c(_this2);
        });

        if (true) {
          if (this.logs) this.logs = [];
        }
      },
      addChildNode: function addChildNode(newElement) {
        var _this3 = this;

        var childNode = this.children[this.cursor]; // using the same node

        if (childNode && treeDiff(childNode.element, newElement)) {
          this.cursor += 1;
          return useSameNode(childNode, newElement);
        } // creating a new node


        var newChildNode = createNewNode(newElement, this);

        if (this.children[this.cursor]) {
          _onNodeRemove.forEach(function (c) {
            return c(_this3.children[_this3.cursor]);
          });
        }

        this.children[this.cursor] = newChildNode;
        this.cursor += 1;
        return newChildNode;
      }
    };

    if (true) {
      node.log = function (type, meta) {
        if (!('logs' in node)) node.logs = [];
        node.logs.push({
          type: type,
          meta: meta,
          time: performance.now()
        });
      };
    }

    return node;
  }

  return {
    resolveRoot: function resolveRoot(element) {
      return root = treeDiff(root.element, element) ? useSameNode(root, element) : createNewNode(element);
    },
    reset: function reset() {
      root = createNewNode();
      ids = 0;
    },
    getNumOfElements: function getNumOfElements() {
      return ids;
    },
    diagnose: function diagnose() {
      if (true) {
        return function loopOver(node) {
          var ind = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

          var _ref = node.element.props ? node.element.props : {},
              children = _ref.children,
              rest = _objectWithoutProperties(_ref, ['children']); // eslint-disable-line no-unused-vars


          return {
            ind: ind,
            name: node.element.name,
            logs: node.logs,
            props: _extends({
              children: '<function children>'
            }, rest),
            used: node.element.used(),
            id: node.element.id,
            children: node.children.map(function (child) {
              return loopOver(child, ind + 1);
            })
          };
        }(root);
      }

      throw new Error('Not available in production mode');
    },
    addNodeInCallback: function addNodeInCallback(callback) {
      onNodeIn.push(callback);
    },
    addNodeOutCallback: function addNodeOutCallback(callback) {
      onNodeOut.push(callback);
    },
    onNodeRemove: function onNodeRemove(callback) {
      _onNodeRemove.push(callback);
    }
  };
}

;

/***/ }),

/***/ "../../lib/hooks/useContext.js":
/*!*******************************************************************!*\
  !*** /Users/krasimir/Work/Krasimir/actml/lib/hooks/useContext.js ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _isValidHookContext = __webpack_require__(/*! ./utils/isValidHookContext */ "../../lib/hooks/utils/isValidHookContext.js");

var _isValidHookContext2 = _interopRequireDefault(_isValidHookContext);

var _Context = __webpack_require__(/*! ../Context */ "../../lib/Context.js");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}

var createUseElementHook = function createUseElementHook(processor) {
  return function (Context) {
    (0, _isValidHookContext2.default)(processor);
    return Context[_Context.PUBLIC_CONTEXT_KEY]();
  };
};

exports.default = createUseElementHook;

/***/ }),

/***/ "../../lib/hooks/useEffect.js":
/*!******************************************************************!*\
  !*** /Users/krasimir/Work/Krasimir/actml/lib/hooks/useEffect.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fastDeepEqual = __webpack_require__(/*! fast-deep-equal */ "../../node_modules/fast-deep-equal/index.js");

var _fastDeepEqual2 = _interopRequireDefault(_fastDeepEqual);

var _isValidHookContext = __webpack_require__(/*! ./utils/isValidHookContext */ "../../lib/hooks/utils/isValidHookContext.js");

var _isValidHookContext2 = _interopRequireDefault(_isValidHookContext);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}
/* eslint-disable no-return-assign */


var Storage = {
  elements: {},
  get: function get(element) {
    if (this.elements[element.id]) {
      return this.elements[element.id];
    }

    return this.elements[element.id] = {
      effects: [],
      consumer: 0
    };
  },
  cleanUp: function cleanUp(id) {
    if (this.elements[id]) {
      delete this.elements[id];
    }
  }
};

var createEffect = function createEffect(callback, deps) {
  return {
    callback: callback,
    deps: deps
  };
};

var updateEffect = function updateEffect(effect, callback, deps) {
  effect.callback = callback;
  effect.oldDeps = effect.deps;
  effect.deps = deps;
  return effect;
};

function depsEqual(oldDeps, newDeps) {
  if (!oldDeps) return false;
  if (oldDeps.length !== newDeps.length) return false;
  return (0, _fastDeepEqual2.default)(oldDeps, newDeps);
}

function resolveEffect(node, effect) {
  var deps = effect.deps,
      oldDeps = effect.oldDeps,
      callback = effect.callback;

  if (typeof deps === 'undefined') {
    effect.cleanUp = callback();
  } else if (deps.length === 0) {
    if (node.element.used() === 1) {
      effect.cleanUp = callback();
      if (true) node.log('useEffect:fired');
    }
  } else {
    var areEqual = depsEqual(oldDeps, deps);

    if (!areEqual) {
      effect.cleanUp = callback();
      if (true) node.log('useEffect:fired');
    }
  }
}

var createUseEffectHook = function createUseEffectHook(processor) {
  processor.onNodeRemove(function (node) {
    var element = node.element;
    var storage = Storage.get(element);
    storage.effects.forEach(function (effect) {
      if (effect.cleanUp) {
        effect.cleanUp();
        if (true) node.log('useEffect:cleanUp');
      }
    });
    Storage.cleanUp(node.element.id);
  });
  processor.onNodeOut(function (node) {
    var element = node.element;
    var storage = Storage.get(element);

    if (storage.effects.length > 0) {
      storage.effects.forEach(function (effect) {
        return resolveEffect(node, effect);
      });
    }
  });
  return function (callback, deps) {
    (0, _isValidHookContext2.default)(processor);
    var node = processor.node();
    var element = node.element;
    var storage = Storage.get(element); // first run

    if (element.used() === 0) {
      storage.effects.push(createEffect(callback, deps)); // other runs
    } else {
      var index = storage.consumer;
      storage.consumer = index < storage.effects.length - 1 ? storage.consumer + 1 : 0;
      updateEffect(storage.effects[index], callback, deps);
    }
  };
};

exports.default = createUseEffectHook;

createUseEffectHook.clear = function () {
  Storage.elements = {};
};

/***/ }),

/***/ "../../lib/hooks/useElement.js":
/*!*******************************************************************!*\
  !*** /Users/krasimir/Work/Krasimir/actml/lib/hooks/useElement.js ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _isValidHookContext = __webpack_require__(/*! ./utils/isValidHookContext */ "../../lib/hooks/utils/isValidHookContext.js");

var _isValidHookContext2 = _interopRequireDefault(_isValidHookContext);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}

var createUseElementHook = function createUseElementHook(processor) {
  return function () {
    (0, _isValidHookContext2.default)(processor);
    return processor.node().element;
  };
};

exports.default = createUseElementHook;

/***/ }),

/***/ "../../lib/hooks/usePubSub.js":
/*!******************************************************************!*\
  !*** /Users/krasimir/Work/Krasimir/actml/lib/hooks/usePubSub.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createUsePubSubHook;

var _isValidHookContext = __webpack_require__(/*! ./utils/isValidHookContext */ "../../lib/hooks/utils/isValidHookContext.js");

var _isValidHookContext2 = _interopRequireDefault(_isValidHookContext);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}

var subscribers = {};

var subscribe = function subscribe(node, element, type, callback) {
  if (!subscribers[type]) subscribers[type] = {};

  if (true) {
    if (!subscribers[type][element.id]) {
      node.log('usePubSub:subscribe', type);
    }
  }

  subscribers[type][element.id] = callback;
  return function () {
    if (true) {
      node.log('usePubSub:unsubscribe', type);
    }

    delete subscribers[type][element.id];
  };
};

var publish = function publish(node, type, payload) {
  if (!subscribers[type]) return;

  if (true) {
    node.log('usePubSub:publish:' + type, payload);
  }

  Object.keys(subscribers[type]).forEach(function (id) {
    subscribers[type][id](payload);
  });
};

function createUsePubSubHook(processor) {
  processor.onNodeRemove(function (node) {
    Object.keys(subscribers).forEach(function (type) {
      if (subscribers[type][node.element.id]) {
        delete subscribers[type][node.element.id];
      }
    });
  });
  return function (scopedElement) {
    (0, _isValidHookContext2.default)(processor);
    var node = processor.node();
    var el = scopedElement || node.element;

    var subscribeFunc = function subscribeFunc() {
      for (var _len = arguments.length, params = Array(_len), _key = 0; _key < _len; _key++) {
        params[_key] = arguments[_key];
      }

      return subscribe.apply(undefined, [node, el].concat(params));
    };

    var publishFunc = function publishFunc() {
      for (var _len2 = arguments.length, params = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        params[_key2] = arguments[_key2];
      }

      return publish.apply(undefined, [node].concat(params));
    };

    return {
      subscribe: subscribeFunc,
      publish: publishFunc,
      subscribers: subscribers
    };
  };
}

createUsePubSubHook.clear = function () {
  subscribers = {};
};

/***/ }),

/***/ "../../lib/hooks/useReducer.js":
/*!*******************************************************************!*\
  !*** /Users/krasimir/Work/Krasimir/actml/lib/hooks/useReducer.js ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();

exports.default = createUseReducerHook;

var _isValidHookContext = __webpack_require__(/*! ./utils/isValidHookContext */ "../../lib/hooks/utils/isValidHookContext.js");

var _isValidHookContext2 = _interopRequireDefault(_isValidHookContext);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}

function _objectWithoutProperties(obj, keys) {
  var target = {};

  for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue;
    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
    target[i] = obj[i];
  }

  return target;
}

function createDispatchElement(dispatch) {
  return function (_ref) {
    var action = _ref.action,
        propsToAction = _ref.propsToAction,
        rest = _objectWithoutProperties(_ref, ['action', 'propsToAction']);

    if (action) {
      dispatch(action);
    } else if (propsToAction) {
      dispatch(propsToAction(rest));
    } else {
      throw new Error('<Dispatch> expects "action" or "propsToAction" prop.');
    }
  };
}

function createUseReducerHook(processor, useState) {
  return function (reducer, initialState) {
    (0, _isValidHookContext2.default)(processor);
    var node = processor.node();

    var _useState = useState(initialState),
        _useState2 = _slicedToArray(_useState, 2),
        state = _useState2[0],
        setState = _useState2[1];

    var dispatch = function dispatch(action) {
      if (true) {
        node.log('useReducer:dispatch', action.type);
      }

      setState(reducer(state(), action));
    };

    return [state, dispatch, createDispatchElement(dispatch), // <Dispatch>
    function () {
      return state();
    } // <GetState>
    ];
  };
}

/***/ }),

/***/ "../../lib/hooks/useState.js":
/*!*****************************************************************!*\
  !*** /Users/krasimir/Work/Krasimir/actml/lib/hooks/useState.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createUseStateHook;

var _isValidHookContext = __webpack_require__(/*! ./utils/isValidHookContext */ "../../lib/hooks/utils/isValidHookContext.js");

var _isValidHookContext2 = _interopRequireDefault(_isValidHookContext);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}

var Storage = {
  elements: {},
  get: function get(element) {
    if (this.elements[element.id]) {
      return this.elements[element.id];
    }

    return this.elements[element.id] = {
      states: [],
      consumer: 0
    };
  },
  cleanUp: function cleanUp(id) {
    if (this.elements[id]) {
      delete this.elements[id];
    }
  }
};
/* eslint-disable no-return-assign */

function createUseStateHook(processor) {
  processor.onNodeRemove(function (node) {
    return Storage.cleanUp(node.element.id);
  });
  return function (initialState) {
    (0, _isValidHookContext2.default)(processor);
    var node = processor.node();
    var element = node.element;
    var storage = Storage.get(element);
    var index = void 0; // first run

    if (element.used() === 0) {
      storage.states.push(initialState);
      index = storage.states.length - 1; // other runs
    } else {
      index = storage.consumer;
      storage.consumer = index < storage.states.length - 1 ? storage.consumer + 1 : 0;
    }

    if (true) node.log('useState:consumed', storage.states[index]);
    return [function () {
      return storage.states[index];
    }, function (newState) {
      if (true) node.log('useState:set', newState);
      storage.states[index] = newState;

      if (!element.isRunning()) {
        if (true) node.log('useState:rerun');
        node.rerun();
      }

      return newState;
    }];
  };
}

createUseStateHook.clear = function () {
  Storage.elements = {};
};

/***/ }),

/***/ "../../lib/hooks/utils/isValidHookContext.js":
/*!*********************************************************************************!*\
  !*** /Users/krasimir/Work/Krasimir/actml/lib/hooks/utils/isValidHookContext.js ***!
  \*********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isValidHookContext;

function isValidHookContext(processor) {
  if (!processor) {
    throw new Error('Something terribly wrong happened. The hook factory function is called without a processor.');
  }

  if (!processor.node()) {
    throw new Error('Hooks must be called in the context of an ActML element.');
  }
}

;

/***/ }),

/***/ "../../lib/index.js":
/*!********************************************************!*\
  !*** /Users/krasimir/Work/Krasimir/actml/lib/index.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createRuntime = createRuntime;

var _Processor = __webpack_require__(/*! ./Processor */ "../../lib/Processor.js");

var _Processor2 = _interopRequireDefault(_Processor);

var _isActMLElement = __webpack_require__(/*! ./utils/isActMLElement */ "../../lib/utils/isActMLElement.js");

var _isActMLElement2 = _interopRequireDefault(_isActMLElement);

var _ActElement = __webpack_require__(/*! ./ActElement */ "../../lib/ActElement.js");

var _ActElement2 = _interopRequireDefault(_ActElement);

var _useElement = __webpack_require__(/*! ./hooks/useElement */ "../../lib/hooks/useElement.js");

var _useElement2 = _interopRequireDefault(_useElement);

var _usePubSub = __webpack_require__(/*! ./hooks/usePubSub */ "../../lib/hooks/usePubSub.js");

var _usePubSub2 = _interopRequireDefault(_usePubSub);

var _useState = __webpack_require__(/*! ./hooks/useState */ "../../lib/hooks/useState.js");

var _useState2 = _interopRequireDefault(_useState);

var _useReducer = __webpack_require__(/*! ./hooks/useReducer */ "../../lib/hooks/useReducer.js");

var _useReducer2 = _interopRequireDefault(_useReducer);

var _useEffect = __webpack_require__(/*! ./hooks/useEffect */ "../../lib/hooks/useEffect.js");

var _useEffect2 = _interopRequireDefault(_useEffect);

var _useContext = __webpack_require__(/*! ./hooks/useContext */ "../../lib/hooks/useContext.js");

var _useContext2 = _interopRequireDefault(_useContext);

var _Context = __webpack_require__(/*! ./Context */ "../../lib/Context.js");

var _Context2 = _interopRequireDefault(_Context);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}

function createRuntime() {
  var processor = (0, _Processor2.default)();

  function A(func, props) {
    for (var _len = arguments.length, children = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      children[_key - 2] = arguments[_key];
    }

    return (0, _ActElement2.default)(func, props, children);
  }

  function run(element) {
    if (!(0, _isActMLElement2.default)(element)) {
      throw new Error('ActML element expected. Instead ' + element.toString() + ' passed.');
    }

    return processor.run(element);
  }

  var Fragment = function Fragment(_ref) {
    var children = _ref.children;
    return children;
  };

  var useElement = (0, _useElement2.default)(processor);
  var useState = (0, _useState2.default)(processor);
  var usePubSub = (0, _usePubSub2.default)(processor);
  var useReducer = (0, _useReducer2.default)(processor, useState);
  var useEffect = (0, _useEffect2.default)(processor);
  var useContext = (0, _useContext2.default)(processor);
  var createContext = (0, _Context2.default)(processor);
  return {
    A: A,
    run: run,
    Fragment: Fragment,
    processor: processor,
    useElement: useElement,
    usePubSub: usePubSub,
    useState: useState,
    useReducer: useReducer,
    useEffect: useEffect,
    useContext: useContext,
    createContext: createContext
  };
}

var runtime = createRuntime();
module.exports = runtime;
module.exports.createRuntime = createRuntime();

/***/ }),

/***/ "../../lib/utils/isActMLElement.js":
/*!***********************************************************************!*\
  !*** /Users/krasimir/Work/Krasimir/actml/lib/utils/isActMLElement.js ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isActMLElement;

function isActMLElement(element) {
  return element && element.__actml === true;
}

;

/***/ }),

/***/ "../../node_modules/fast-deep-equal/index.js":
/*!*********************************************************************************!*\
  !*** /Users/krasimir/Work/Krasimir/actml/node_modules/fast-deep-equal/index.js ***!
  \*********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isArray = Array.isArray;
var keyList = Object.keys;
var hasProp = Object.prototype.hasOwnProperty;

module.exports = function equal(a, b) {
  if (a === b) return true;

  if (a && b && typeof a == 'object' && typeof b == 'object') {
    var arrA = isArray(a)
      , arrB = isArray(b)
      , i
      , length
      , key;

    if (arrA && arrB) {
      length = a.length;
      if (length != b.length) return false;
      for (i = length; i-- !== 0;)
        if (!equal(a[i], b[i])) return false;
      return true;
    }

    if (arrA != arrB) return false;

    var dateA = a instanceof Date
      , dateB = b instanceof Date;
    if (dateA != dateB) return false;
    if (dateA && dateB) return a.getTime() == b.getTime();

    var regexpA = a instanceof RegExp
      , regexpB = b instanceof RegExp;
    if (regexpA != regexpB) return false;
    if (regexpA && regexpB) return a.toString() == b.toString();

    var keys = keyList(a);
    length = keys.length;

    if (length !== keyList(b).length)
      return false;

    for (i = length; i-- !== 0;)
      if (!hasProp.call(b, keys[i])) return false;

    for (i = length; i-- !== 0;) {
      key = keys[i];
      if (!equal(a[key], b[key])) return false;
    }

    return true;
  }

  return a!==a && b!==b;
};


/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/arrayWithHoles.js":
/*!***************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/arrayWithHoles.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

module.exports = _arrayWithHoles;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/arrayWithoutHoles.js":
/*!******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/arrayWithoutHoles.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }

    return arr2;
  }
}

module.exports = _arrayWithoutHoles;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/defineProperty.js":
/*!***************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/defineProperty.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

module.exports = _defineProperty;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/iterableToArray.js":
/*!****************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/iterableToArray.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

module.exports = _iterableToArray;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/iterableToArrayLimit.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/iterableToArrayLimit.js ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _iterableToArrayLimit(arr, i) {
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

module.exports = _iterableToArrayLimit;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/nonIterableRest.js":
/*!****************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/nonIterableRest.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
}

module.exports = _nonIterableRest;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/nonIterableSpread.js":
/*!******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/nonIterableSpread.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

module.exports = _nonIterableSpread;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/objectSpread2.js":
/*!**************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/objectSpread2.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var defineProperty = __webpack_require__(/*! ./defineProperty */ "./node_modules/@babel/runtime/helpers/defineProperty.js");

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    if (i % 2) {
      var source = arguments[i] != null ? arguments[i] : {};
      var ownKeys = Object.keys(source);

      if (typeof Object.getOwnPropertySymbols === 'function') {
        ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
          return Object.getOwnPropertyDescriptor(source, sym).enumerable;
        }));
      }

      ownKeys.forEach(function (key) {
        defineProperty(target, key, source[key]);
      });
    } else {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(arguments[i]));
    }
  }

  return target;
}

module.exports = _objectSpread2;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/slicedToArray.js":
/*!**************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/slicedToArray.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var arrayWithHoles = __webpack_require__(/*! ./arrayWithHoles */ "./node_modules/@babel/runtime/helpers/arrayWithHoles.js");

var iterableToArrayLimit = __webpack_require__(/*! ./iterableToArrayLimit */ "./node_modules/@babel/runtime/helpers/iterableToArrayLimit.js");

var nonIterableRest = __webpack_require__(/*! ./nonIterableRest */ "./node_modules/@babel/runtime/helpers/nonIterableRest.js");

function _slicedToArray(arr, i) {
  return arrayWithHoles(arr) || iterableToArrayLimit(arr, i) || nonIterableRest();
}

module.exports = _slicedToArray;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/toConsumableArray.js":
/*!******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/toConsumableArray.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var arrayWithoutHoles = __webpack_require__(/*! ./arrayWithoutHoles */ "./node_modules/@babel/runtime/helpers/arrayWithoutHoles.js");

var iterableToArray = __webpack_require__(/*! ./iterableToArray */ "./node_modules/@babel/runtime/helpers/iterableToArray.js");

var nonIterableSpread = __webpack_require__(/*! ./nonIterableSpread */ "./node_modules/@babel/runtime/helpers/nonIterableSpread.js");

function _toConsumableArray(arr) {
  return arrayWithoutHoles(arr) || iterableToArray(arr) || nonIterableSpread();
}

module.exports = _toConsumableArray;

/***/ }),

/***/ "./node_modules/actml-inspector/lib/helpers/sanitize.js":
/*!**************************************************************!*\
  !*** ./node_modules/actml-inspector/lib/helpers/sanitize.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = sanitize;

var _CircularJSON = __webpack_require__(/*! ./vendor/CircularJSON */ "./node_modules/actml-inspector/lib/helpers/vendor/CircularJSON.js");

var _CircularJSON2 = _interopRequireDefault(_CircularJSON);

var _SerializeError = __webpack_require__(/*! ./vendor/SerializeError */ "./node_modules/actml-inspector/lib/helpers/vendor/SerializeError.js");

var _SerializeError2 = _interopRequireDefault(_SerializeError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var stringify = _CircularJSON2.default.stringify;
function sanitize(something) {
  var showErrorInConsole = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  var result;

  try {
    result = JSON.parse(stringify(something, function (key, value) {
      if (typeof value === 'function') {
        return value.name === '' ? '<anonymous>' : 'function ' + value.name + '()';
      }
      if (value instanceof Error) {
        return (0, _SerializeError2.default)(value);
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

/***/ "./node_modules/actml-inspector/lib/helpers/vendor/CircularJSON.js":
/*!*************************************************************************!*\
  !*** ./node_modules/actml-inspector/lib/helpers/vendor/CircularJSON.js ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

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
var
// should be a not so common char
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
  for (var i = this.length; i-- && this[i] !== v;) {}
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
    fn = (typeof replacer === 'undefined' ? 'undefined' : _typeof(replacer)) === 'object' ? function (key, value) {
      return key !== '' && replacer.indexOf(key) < 0 ? void 0 : value;
    } : replacer;
  }
  return function (key, value) {
    // the replacer has rights to decide
    // if a new object should be returned
    // or if there's some key to drop
    // let's call it here rather than "too late"
    if (inspect) value = fn.call(this, key, value);

    // did you know ? Safari passes keys as integers for arrays
    // which means if (key) when key === 0 won't pass the check
    if (key !== '') {
      if (last !== this) {
        i = lvl - indexOf.call(all, this) - 1;
        lvl -= i;
        all.splice(lvl, all.length);
        path.splice(lvl - 1, path.length);
        last = this;
      }
      // console.log(lvl, key, path);
      if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && value) {
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
  for (var i = 0, length = keys.length; i < length; current = current[
  // keys should be normalized back here
  keys[i++].replace(safeSpecialCharRG, specialChar)]) {}
  return current;
}

function generateReviver(reviver) {
  return function (key, value) {
    var isString = typeof value === 'string';
    if (isString && value.charAt(0) === specialChar) {
      return new $String(value.slice(1));
    }
    if (key === '') value = regenerate(value, value, {});
    // again, only one needed, do not use the RegExp for this replacement
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
  return current instanceof Array ?
  // fast Array reconstruction
  regenerateArray(root, current, retrieve) : current instanceof $String ?
  // root is an empty string
  current.length ? retrieve.hasOwnProperty(current) ? retrieve[current] : retrieve[current] = retrieveFromPath(root, current.split(specialChar)) : root : current instanceof Object ?
  // dedicated Object parser
  regenerateObject(root, current, retrieve) :
  // value as it is
  current;
}

function stringifyRecursion(value, replacer, space, doNotResolve) {
  return JSON.stringify(value, generateReplacer(value, replacer, !doNotResolve), space);
}

function parseRecursion(text, reviver) {
  return JSON.parse(text, generateReviver(reviver));
}

exports.default = {
  stringify: stringifyRecursion,
  parse: parseRecursion
};

/***/ }),

/***/ "./node_modules/actml-inspector/lib/helpers/vendor/SerializeError.js":
/*!***************************************************************************!*\
  !*** ./node_modules/actml-inspector/lib/helpers/vendor/SerializeError.js ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* eslint-disable */
// Credits: https://github.com/sindresorhus/serialize-error



var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

module.exports = function (value) {
	if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') {
		return destroyCircular(value, []);
	}

	// People sometimes throw things besides Error objects, so…

	if (typeof value === 'function') {
		// JSON.stringify discards functions. We do too, unless a function is thrown directly.
		return '[Function: ' + (value.name || 'anonymous') + ']';
	}

	return value;
};

// https://www.npmjs.com/package/destroy-circular
function destroyCircular(from, seen) {
	var to = Array.isArray(from) ? [] : {};

	seen.push(from);

	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
		for (var _iterator = Object.keys(from)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
			var key = _step.value;

			var value = from[key];

			if (typeof value === 'function') {
				continue;
			}

			if (!value || (typeof value === 'undefined' ? 'undefined' : _typeof(value)) !== 'object') {
				to[key] = value;
				continue;
			}

			if (seen.indexOf(from[key]) === -1) {
				to[key] = destroyCircular(from[key], seen.slice(0));
				continue;
			}

			to[key] = '[Circular]';
		}
	} catch (err) {
		_didIteratorError = true;
		_iteratorError = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion && _iterator.return) {
				_iterator.return();
			}
		} finally {
			if (_didIteratorError) {
				throw _iteratorError;
			}
		}
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

/***/ "./node_modules/actml-inspector/lib/index.js":
/*!***************************************************!*\
  !*** ./node_modules/actml-inspector/lib/index.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _sanitize = __webpack_require__(/*! ./helpers/sanitize */ "./node_modules/actml-inspector/lib/helpers/sanitize.js");

var _sanitize2 = _interopRequireDefault(_sanitize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var IN = 'IN';
var OUT = 'OUT';
var REMOVE = 'REMOVE';

var isRunningInNode = typeof process !== 'undefined' && typeof process.release !== 'undefined' && process.release.name === 'node';

var trim = function trim(str, len) {
  var emp = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '...';
  return str.length > len ? str.substr(0, len) + emp : str;
};
var getIndMargin = function getIndMargin(ind) {
  return 'margin-left: ' + ind * 20 + 'px;';
};
var getIndSpaces = function getIndSpaces(ind) {
  return [].concat(_toConsumableArray(Array(ind * 2).keys())).map(function (x) {
    return ' ';
  }).join('');
};
var parseLogMeta = function parseLogMeta(meta) {
  if (typeof meta === 'undefined') return '';
  if (typeof meta === 'string' || typeof meta === 'boolean' || typeof meta === 'number') {
    return '(' + JSON.stringify(meta) + ')';
  }
  if ((typeof meta === 'undefined' ? 'undefined' : _typeof(meta)) === 'object') {
    if (Array.isArray(meta)) {
      return '([...' + meta.length + '])';
    }
    return '(' + trim(JSON.stringify((0, _sanitize2.default)(meta)), 50) + ')';
  }
  return '(' + (typeof meta === 'undefined' ? 'undefined' : _typeof(meta)) + ')';
};

var print = {
  entrance: function entrance(what, ind) {
    if (!isRunningInNode) {
      return [null, '%c' + what, 'color: #b0b0b0;' + getIndMargin(ind)];
    }
    return [null, '\x1b[38m%s\x1b[0m', '' + (getIndSpaces(ind) + what)];
  },
  default: function _default(what, ind) {
    if (!isRunningInNode) {
      return [null, '%c' + what, getIndMargin(ind)];
    }
    return [null, '' + (getIndSpaces(ind) + what)];
  },
  hook: function hook(what, ind, time) {
    if (!isRunningInNode) {
      return [time, '%c' + what, 'color: #999;' + getIndMargin(ind)];
    }
    return [time, '\x1b[34m%s\x1b[0m', '' + (getIndSpaces(ind) + what)];
  },
  current: function current(what, ind) {
    if (!isRunningInNode) {
      return [null, '%c' + what, 'font-weight: bold; border: solid 1px #999; border-radius: 2px; padding: 1px 0;' + getIndMargin(ind)];
    }
    return [null, getIndSpaces(ind) + ('\x1B[100m' + what + '\x1B[0m')];
  }
};

function _printSnapshotToConsole(snapshot) {
  var _snapshot = _slicedToArray(snapshot, 3),
      type = _snapshot[0],
      node = _snapshot[1],
      tree = _snapshot[2];

  var printLines = [print.entrance('', 0)];

  printLines = printLines.concat(function loop(_ref) {
    var id = _ref.id,
        ind = _ref.ind,
        name = _ref.name,
        used = _ref.used,
        children = _ref.children,
        logs = _ref.logs;

    var lines = [];
    var elementOpenTag = '<' + name + (used > 0 ? '(' + used + ')' : '') + '>';

    lines.push(id === node.element.id ? print.current(elementOpenTag, ind) : print.default(elementOpenTag, ind));
    if (logs && logs.length > 0) {
      lines = lines.concat(logs.map(function (_ref2) {
        var type = _ref2.type,
            meta = _ref2.meta,
            time = _ref2.time;

        return print.hook('\u2937 ' + type + parseLogMeta(meta), ind, time);
      }));
    }
    if (children.length > 0) {
      children.map(function (child) {
        lines = lines.concat(loop(child));
      });
      lines.push(id === node.element.id ? print.current('</' + name + '>', ind) : print.default('</' + name + '>', ind));
    }
    return lines;
  }(tree));

  // console.clear();
  var sortedHookTimes = printLines.filter(function (_ref3) {
    var _ref4 = _slicedToArray(_ref3, 1),
        time = _ref4[0];

    return time !== null;
  }).map(function (_ref5) {
    var _ref6 = _slicedToArray(_ref5, 1),
        time = _ref6[0];

    return time;
  }).sort(function (a, b) {
    return a > b ? 1 : -1;
  });

  printLines.forEach(function (_ref7) {
    var _ref8 = _toArray(_ref7),
        time = _ref8[0],
        line = _ref8.slice(1);

    if (sortedHookTimes.length > 0 && time) {
      var _console;

      (_console = console).log.apply(_console, _toConsumableArray(line).concat([sortedHookTimes.findIndex(function (t) {
        return t === time;
      })]));
    } else {
      var _console2;

      (_console2 = console).log.apply(_console2, _toConsumableArray(line));
    }
  });
}

exports.default = {
  watch: function watch(processor) {
    var snapshots = [];

    function snapshot(type, node) {
      snapshots.push([type, { element: { id: node.element.id } }, processor.system().tree.diagnose()]);
      _printSnapshotToConsole(snapshots[snapshots.length - 1]);
    }

    // processor.onNodeIn(node => snapshot(IN, node));
    processor.onNodeOut(function (node) {
      return snapshot(OUT, node);
    });
    // processor.onNodeRemove(node => snapshot(REMOVE, node));
  },
  printSnapshotToConsole: function printSnapshotToConsole(snapshots) {
    snapshots.forEach(_printSnapshotToConsole);
  }
};
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../process/browser.js */ "./node_modules/process/browser.js")))

/***/ }),

/***/ "./node_modules/process/browser.js":
/*!*****************************************!*\
  !*** ./node_modules/process/browser.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


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

/***/ "./src/CheckForEditField.js":
/*!**********************************!*\
  !*** ./src/CheckForEditField.js ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return CheckForEditField; });
/* harmony import */ var _lib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../lib */ "../../lib/index.js");
/* harmony import */ var _lib__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_lib__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _DOM__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./DOM */ "./src/DOM.js");
/* eslint-disable react/prop-types */

/** @jsx A */


function CheckForEditField(_ref) {
  var todos = _ref.todos;
  return Object(_lib__WEBPACK_IMPORTED_MODULE_0__["A"])(_DOM__WEBPACK_IMPORTED_MODULE_1__["FocusField"], {
    index: todos.findIndex(function (_ref2) {
      var editing = _ref2.editing;
      return editing;
    })
  });
}

/***/ }),

/***/ "./src/DOM.js":
/*!********************!*\
  !*** ./src/DOM.js ***!
  \********************/
/*! exports provided: FillContainer, Container, FocusField, ProgressChecker, Footer, FilterOptionsTabs */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FillContainer", function() { return FillContainer; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Container", function() { return Container; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FocusField", function() { return FocusField; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ProgressChecker", function() { return ProgressChecker; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Footer", function() { return Footer; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FilterOptionsTabs", function() { return FilterOptionsTabs; });
/* harmony import */ var _Store__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Store */ "./src/Store.js");
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ */ "./src/index.js");
/* harmony import */ var _lib__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../lib */ "../../lib/index.js");
/* harmony import */ var _lib__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_lib__WEBPACK_IMPORTED_MODULE_2__);




var $ = function $(selector) {
  return document.querySelector(selector);
};

var list = $('.todo-list');
var header = $('.header');
var ENTER = 13;
var ESC = 27;
function FillContainer(_ref) {
  var children = _ref.children;
  list.innerHTML = children();
}
function Container(_ref2) {
  var onUserAction = _ref2.onUserAction;
  Object(_lib__WEBPACK_IMPORTED_MODULE_2__["useEffect"])(function () {
    list.addEventListener('click', function (e) {
      var todoIndex = parseInt(e.target.getAttribute('data-index'), 10);

      if (e.target.hasAttribute('data-toggle')) {
        onUserAction(_Store__WEBPACK_IMPORTED_MODULE_0__["TOGGLE"], todoIndex);
      } else if (e.target.hasAttribute('data-delete')) {
        onUserAction(_Store__WEBPACK_IMPORTED_MODULE_0__["DELETE"], todoIndex);
      }
    });
    list.addEventListener('dblclick', function (e) {
      var todoIndex = parseInt(e.target.getAttribute('data-index'), 10);

      if (e.target.hasAttribute('data-label')) {
        onUserAction(_Store__WEBPACK_IMPORTED_MODULE_0__["EDIT"], todoIndex);
      }
    });
    list.addEventListener('focusout', function (e) {
      var todoIndex = parseInt(e.target.getAttribute('data-index'), 10);

      if (e.target.hasAttribute('data-edit')) {
        onUserAction(_Store__WEBPACK_IMPORTED_MODULE_0__["EDIT_TODO"], {
          index: todoIndex,
          label: e.target.value
        });
      }
    });
    list.addEventListener('keyup', function (e) {
      var todoIndex = parseInt(e.target.getAttribute('data-index'), 10);

      if (e.target.hasAttribute('data-edit') && e.keyCode === ENTER) {
        onUserAction(_Store__WEBPACK_IMPORTED_MODULE_0__["EDIT_TODO"], {
          index: todoIndex,
          label: e.target.value
        });
      } else if (e.target.hasAttribute('data-edit') && e.keyCode === ESC) {
        onUserAction(_Store__WEBPACK_IMPORTED_MODULE_0__["EDIT"], todoIndex);
      }
    });
    header.addEventListener('keyup', function (e) {
      if (e.target.hasAttribute('data-new') && e.keyCode === ENTER) {
        onUserAction(_Store__WEBPACK_IMPORTED_MODULE_0__["NEW_TODO"], e.target.value);
        e.target.value = '';
      }
    });
  }, []);
}
function FocusField(_ref3) {
  var index = _ref3.index;
  var el = $(".edit[data-index=\"".concat(index, "\"]"));

  if (el) {
    el.focus();
    el.selectionStart = el.selectionEnd = el.value.length;
  }
}
;
function ProgressChecker(_ref4) {
  var todos = _ref4.todos;
  var completed = todos.filter(function (_ref5) {
    var completed = _ref5.completed;
    return completed;
  }).length;
  var itemsLeft = todos.length - completed;
  $('[data-count]').innerHTML = "\n    <strong>".concat(itemsLeft, "</strong> ").concat(itemsLeft > 1 || itemsLeft === 0 ? 'items' : 'item', " left\n  ");
}
;
function Footer(_ref6) {
  var onUserAction = _ref6.onUserAction;
  Object(_lib__WEBPACK_IMPORTED_MODULE_2__["useEffect"])(function () {
    $('[data-filter]').addEventListener('click', function (e) {
      if (e.target.hasAttribute('data-all')) {
        onUserAction(___WEBPACK_IMPORTED_MODULE_1__["FILTER_ALL"]);
      } else if (e.target.hasAttribute('data-active')) {
        onUserAction(___WEBPACK_IMPORTED_MODULE_1__["FILTER_ACTIVE"]);
      } else if (e.target.hasAttribute('data-completed')) {
        onUserAction(___WEBPACK_IMPORTED_MODULE_1__["FILTER_COMPLETED"]);
      }
    });
    $('[data-clear-completed]').addEventListener('click', function () {
      onUserAction(_Store__WEBPACK_IMPORTED_MODULE_0__["CLEAR_COMPLETED"]);
    });
  }, []);
}
;
function FilterOptionsTabs(_ref7) {
  var filter = _ref7.filter;
  Object(_lib__WEBPACK_IMPORTED_MODULE_2__["useEffect"])(function () {
    $('[data-all]').setAttribute('class', filter === ___WEBPACK_IMPORTED_MODULE_1__["FILTER_ALL"] ? 'selected' : '');
    $('[data-active]').setAttribute('class', filter === ___WEBPACK_IMPORTED_MODULE_1__["FILTER_ACTIVE"] ? 'selected' : '');
    $('[data-completed]').setAttribute('class', filter === ___WEBPACK_IMPORTED_MODULE_1__["FILTER_COMPLETED"] ? 'selected' : '');
  }, [filter]);
}

/***/ }),

/***/ "./src/Persist.js":
/*!************************!*\
  !*** ./src/Persist.js ***!
  \************************/
/*! exports provided: useLocalStorage, Persist */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "useLocalStorage", function() { return useLocalStorage; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Persist", function() { return Persist; });
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ "./node_modules/@babel/runtime/helpers/slicedToArray.js");
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _lib__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../lib */ "../../lib/index.js");
/* harmony import */ var _lib__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_lib__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _Store__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Store */ "./src/Store.js");



var initialValue = JSON.stringify([Object(_Store__WEBPACK_IMPORTED_MODULE_2__["ToDo"])({
  label: 'ActML is using JSX'
}), Object(_Store__WEBPACK_IMPORTED_MODULE_2__["ToDo"])({
  label: 'It is like React but not for rendering'
})]);
var useLocalStorage = function useLocalStorage() {
  var _useState = Object(_lib__WEBPACK_IMPORTED_MODULE_1__["useState"])(JSON.parse(localStorage.getItem('todos') || initialValue)),
      _useState2 = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0___default()(_useState, 1),
      getData = _useState2[0];

  return getData();
};
var Persist = function Persist(_ref) {
  var todos = _ref.todos;
  localStorage.setItem('todos', JSON.stringify(todos));
};

/***/ }),

/***/ "./src/Renderer.js":
/*!*************************!*\
  !*** ./src/Renderer.js ***!
  \*************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Renderer; });
/* harmony import */ var _lib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../lib */ "../../lib/index.js");
/* harmony import */ var _lib__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_lib__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _DOM__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./DOM */ "./src/DOM.js");
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ */ "./src/index.js");
/* eslint-disable react/prop-types */

/** @jsx A */



function Renderer(_ref) {
  var todos = _ref.todos,
      filter = _ref.filter;
  return Object(_lib__WEBPACK_IMPORTED_MODULE_0__["A"])(_DOM__WEBPACK_IMPORTED_MODULE_1__["FillContainer"], null, function () {
    return todos.filter(function (_ref2) {
      var completed = _ref2.completed;
      if (filter === ___WEBPACK_IMPORTED_MODULE_2__["FILTER_ALL"]) return true;
      if (filter === ___WEBPACK_IMPORTED_MODULE_2__["FILTER_ACTIVE"]) return !completed;
      if (filter === ___WEBPACK_IMPORTED_MODULE_2__["FILTER_COMPLETED"]) return completed;
      return false;
    }).map(function (todo, i) {
      var liClass = todo.editing ? 'editing' : todo.completed ? 'completed' : '';
      return "\n            <li class='".concat(liClass, "'>\n              <div class=\"view\">\n                <input \n                  class=\"toggle\"\n                  type=\"checkbox\"\n                  data-index=\"").concat(i, "\"\n                  data-toggle\n                  ").concat(todo.completed ? 'checked' : '', ">\n                <label data-index=\"").concat(i, "\" data-label>").concat(todo.label, "</label>\n                <button\n                  class=\"destroy\"\n                  data-index=\"").concat(i, "\"\n                  data-delete></button>\n              </div>\n              <input class=\"edit\" value=\"").concat(todo.label, "\" data-index=\"").concat(i, "\" data-edit>\n            </li>\n          ");
    }).join('');
  });
}
;

/***/ }),

/***/ "./src/Store.js":
/*!**********************!*\
  !*** ./src/Store.js ***!
  \**********************/
/*! exports provided: TOGGLE, NEW_TODO, DELETE, EDIT, EDIT_TODO, CLEAR_COMPLETED, ToDo, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TOGGLE", function() { return TOGGLE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NEW_TODO", function() { return NEW_TODO; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DELETE", function() { return DELETE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EDIT", function() { return EDIT; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EDIT_TODO", function() { return EDIT_TODO; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CLEAR_COMPLETED", function() { return CLEAR_COMPLETED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ToDo", function() { return ToDo; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Store; });
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ "./node_modules/@babel/runtime/helpers/slicedToArray.js");
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/toConsumableArray */ "./node_modules/@babel/runtime/helpers/toConsumableArray.js");
/* harmony import */ var _babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_helpers_objectSpread2__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/objectSpread2 */ "./node_modules/@babel/runtime/helpers/objectSpread2.js");
/* harmony import */ var _babel_runtime_helpers_objectSpread2__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_objectSpread2__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _lib__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../lib */ "../../lib/index.js");
/* harmony import */ var _lib__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_lib__WEBPACK_IMPORTED_MODULE_3__);




/* eslint-disable react/prop-types */

/** @jsx A */

var TOGGLE = 'TOGGLE';
var NEW_TODO = 'NEW_TODO';
var DELETE = 'DELETE';
var EDIT = 'EDIT';
var EDIT_TODO = 'EDIT_TODO';
var CLEAR_COMPLETED = 'CLEAR_COMPLETED';

var toggle = function toggle(todoIndex) {
  return {
    type: TOGGLE,
    todoIndex: todoIndex
  };
};

var deleteTodo = function deleteTodo(todoIndex) {
  return {
    type: DELETE,
    todoIndex: todoIndex
  };
};

var newTodo = function newTodo(label) {
  return {
    type: NEW_TODO,
    label: label
  };
};

var edit = function edit(todoIndex) {
  return {
    type: EDIT,
    todoIndex: todoIndex
  };
};

var editToDo = function editToDo(_ref) {
  var index = _ref.index,
      label = _ref.label;
  return {
    type: EDIT_TODO,
    index: index,
    label: label
  };
};

var clearCompleted = function clearCompleted() {
  return {
    type: CLEAR_COMPLETED
  };
};

var ToDo = function ToDo(_ref2) {
  var label = _ref2.label;
  return {
    label: label,
    completed: false,
    editing: false
  };
};

var reducer = function reducer(todos, action) {
  switch (action.type) {
    case TOGGLE:
      return todos.map(function (todo, index) {
        if (index === action.todoIndex) {
          return _babel_runtime_helpers_objectSpread2__WEBPACK_IMPORTED_MODULE_2___default()({}, todo, {
            completed: !todo.completed
          });
        }

        return todo;
      });

    case EDIT:
      return todos.map(function (todo, index) {
        if (index === action.todoIndex) {
          return _babel_runtime_helpers_objectSpread2__WEBPACK_IMPORTED_MODULE_2___default()({}, todo, {
            editing: !todo.editing
          });
        }

        return _babel_runtime_helpers_objectSpread2__WEBPACK_IMPORTED_MODULE_2___default()({}, todo, {
          editing: false
        });
      });

    case EDIT_TODO:
      return todos.map(function (todo, index) {
        if (index === action.index) {
          return _babel_runtime_helpers_objectSpread2__WEBPACK_IMPORTED_MODULE_2___default()({}, todo, {
            label: action.label,
            editing: false
          });
        }

        return todo;
      });

    case NEW_TODO:
      return [].concat(_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_1___default()(todos), [ToDo({
        label: action.label
      })]);

    case DELETE:
      return todos.filter(function (todo, index) {
        return index !== action.todoIndex;
      });

    case CLEAR_COMPLETED:
      return todos.filter(function (todo) {
        return !todo.completed;
      });

    default:
      return todos;
  }
};

function Store(_ref3) {
  var initialValue = _ref3.initialValue,
      children = _ref3.children;

  var _useReducer = Object(_lib__WEBPACK_IMPORTED_MODULE_3__["useReducer"])(reducer, initialValue),
      _useReducer2 = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0___default()(_useReducer, 2),
      todos = _useReducer2[0],
      dispatch = _useReducer2[1];

  var _usePubSub = Object(_lib__WEBPACK_IMPORTED_MODULE_3__["usePubSub"])(),
      subscribe = _usePubSub.subscribe;

  Object(_lib__WEBPACK_IMPORTED_MODULE_3__["useEffect"])(function () {
    subscribe(TOGGLE, function (todoIndex) {
      return dispatch(toggle(todoIndex));
    });
    subscribe(NEW_TODO, function (label) {
      return dispatch(newTodo(label));
    });
    subscribe(DELETE, function (todoIndex) {
      return dispatch(deleteTodo(todoIndex));
    });
    subscribe(EDIT, function (label) {
      return dispatch(edit(label));
    });
    subscribe(EDIT_TODO, function (payload) {
      return dispatch(editToDo(payload));
    });
    subscribe(CLEAR_COMPLETED, function () {
      return dispatch(clearCompleted());
    });
  }, []);
  children({
    todos: todos()
  });
}

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! exports provided: FILTER_ALL, FILTER_ACTIVE, FILTER_COMPLETED */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FILTER_ALL", function() { return FILTER_ALL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FILTER_ACTIVE", function() { return FILTER_ACTIVE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FILTER_COMPLETED", function() { return FILTER_COMPLETED; });
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ "./node_modules/@babel/runtime/helpers/slicedToArray.js");
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _lib__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../lib */ "../../lib/index.js");
/* harmony import */ var _lib__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_lib__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var actml_inspector__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! actml-inspector */ "./node_modules/actml-inspector/lib/index.js");
/* harmony import */ var actml_inspector__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(actml_inspector__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _Store__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Store */ "./src/Store.js");
/* harmony import */ var _Renderer__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Renderer */ "./src/Renderer.js");
/* harmony import */ var _CheckForEditField__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./CheckForEditField */ "./src/CheckForEditField.js");
/* harmony import */ var _DOM__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./DOM */ "./src/DOM.js");
/* harmony import */ var _Persist__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./Persist */ "./src/Persist.js");


/** @jsx A */


actml_inspector__WEBPACK_IMPORTED_MODULE_2___default.a.watch(_lib__WEBPACK_IMPORTED_MODULE_1__["processor"]);
console.log(actml_inspector__WEBPACK_IMPORTED_MODULE_2___default.a);





var FILTER_ALL = 'FILTER_ALL';
var FILTER_ACTIVE = 'FILTER_ACTIVE';
var FILTER_COMPLETED = 'FILTER_COMPLETED';

function App() {
  var initialValue = Object(_Persist__WEBPACK_IMPORTED_MODULE_7__["useLocalStorage"])();

  var _usePubSub = Object(_lib__WEBPACK_IMPORTED_MODULE_1__["usePubSub"])(),
      publish = _usePubSub.publish,
      subscribe = _usePubSub.subscribe;

  var _useState = Object(_lib__WEBPACK_IMPORTED_MODULE_1__["useState"])(FILTER_ALL),
      _useState2 = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0___default()(_useState, 2),
      filter = _useState2[0],
      setFilter = _useState2[1];

  Object(_lib__WEBPACK_IMPORTED_MODULE_1__["useEffect"])(function () {
    subscribe(FILTER_ALL, function () {
      return setFilter(FILTER_ALL);
    });
    subscribe(FILTER_ACTIVE, function () {
      return setFilter(FILTER_ACTIVE);
    });
    subscribe(FILTER_COMPLETED, function () {
      return setFilter(FILTER_COMPLETED);
    });
  }, []);
  return Object(_lib__WEBPACK_IMPORTED_MODULE_1__["A"])(_lib__WEBPACK_IMPORTED_MODULE_1__["Fragment"], null, Object(_lib__WEBPACK_IMPORTED_MODULE_1__["A"])(_DOM__WEBPACK_IMPORTED_MODULE_6__["Container"], {
    onUserAction: publish
  }), Object(_lib__WEBPACK_IMPORTED_MODULE_1__["A"])(_DOM__WEBPACK_IMPORTED_MODULE_6__["Footer"], {
    onUserAction: publish
  }), Object(_lib__WEBPACK_IMPORTED_MODULE_1__["A"])(_Store__WEBPACK_IMPORTED_MODULE_3__["default"], {
    initialValue: initialValue
  }, Object(_lib__WEBPACK_IMPORTED_MODULE_1__["A"])(_DOM__WEBPACK_IMPORTED_MODULE_6__["FilterOptionsTabs"], {
    filter: filter()
  }), Object(_lib__WEBPACK_IMPORTED_MODULE_1__["A"])(_Renderer__WEBPACK_IMPORTED_MODULE_4__["default"], {
    filter: filter()
  }), Object(_lib__WEBPACK_IMPORTED_MODULE_1__["A"])(_CheckForEditField__WEBPACK_IMPORTED_MODULE_5__["default"], null), Object(_lib__WEBPACK_IMPORTED_MODULE_1__["A"])(_DOM__WEBPACK_IMPORTED_MODULE_6__["ProgressChecker"], null), Object(_lib__WEBPACK_IMPORTED_MODULE_1__["A"])(_Persist__WEBPACK_IMPORTED_MODULE_7__["Persist"], null)));
}

;
Object(_lib__WEBPACK_IMPORTED_MODULE_1__["run"])(Object(_lib__WEBPACK_IMPORTED_MODULE_1__["A"])(App, null));

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy9Vc2Vycy9rcmFzaW1pci9Xb3JrL0tyYXNpbWlyL2FjdG1sL2xpYi9BY3RFbGVtZW50LmpzIiwid2VicGFjazovLy8vVXNlcnMva3Jhc2ltaXIvV29yay9LcmFzaW1pci9hY3RtbC9saWIvQ29udGV4dC5qcyIsIndlYnBhY2s6Ly8vL1VzZXJzL2tyYXNpbWlyL1dvcmsvS3Jhc2ltaXIvYWN0bWwvbGliL1Byb2Nlc3Nvci5qcyIsIndlYnBhY2s6Ly8vL1VzZXJzL2tyYXNpbWlyL1dvcmsvS3Jhc2ltaXIvYWN0bWwvbGliL1F1ZXVlLmpzIiwid2VicGFjazovLy8vVXNlcnMva3Jhc2ltaXIvV29yay9LcmFzaW1pci9hY3RtbC9saWIvVHJlZS5qcyIsIndlYnBhY2s6Ly8vL1VzZXJzL2tyYXNpbWlyL1dvcmsvS3Jhc2ltaXIvYWN0bWwvbGliL2hvb2tzL3VzZUNvbnRleHQuanMiLCJ3ZWJwYWNrOi8vLy9Vc2Vycy9rcmFzaW1pci9Xb3JrL0tyYXNpbWlyL2FjdG1sL2xpYi9ob29rcy91c2VFZmZlY3QuanMiLCJ3ZWJwYWNrOi8vLy9Vc2Vycy9rcmFzaW1pci9Xb3JrL0tyYXNpbWlyL2FjdG1sL2xpYi9ob29rcy91c2VFbGVtZW50LmpzIiwid2VicGFjazovLy8vVXNlcnMva3Jhc2ltaXIvV29yay9LcmFzaW1pci9hY3RtbC9saWIvaG9va3MvdXNlUHViU3ViLmpzIiwid2VicGFjazovLy8vVXNlcnMva3Jhc2ltaXIvV29yay9LcmFzaW1pci9hY3RtbC9saWIvaG9va3MvdXNlUmVkdWNlci5qcyIsIndlYnBhY2s6Ly8vL1VzZXJzL2tyYXNpbWlyL1dvcmsvS3Jhc2ltaXIvYWN0bWwvbGliL2hvb2tzL3VzZVN0YXRlLmpzIiwid2VicGFjazovLy8vVXNlcnMva3Jhc2ltaXIvV29yay9LcmFzaW1pci9hY3RtbC9saWIvaG9va3MvdXRpbHMvaXNWYWxpZEhvb2tDb250ZXh0LmpzIiwid2VicGFjazovLy8vVXNlcnMva3Jhc2ltaXIvV29yay9LcmFzaW1pci9hY3RtbC9saWIvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy9Vc2Vycy9rcmFzaW1pci9Xb3JrL0tyYXNpbWlyL2FjdG1sL2xpYi91dGlscy9pc0FjdE1MRWxlbWVudC5qcyIsIndlYnBhY2s6Ly8vL1VzZXJzL2tyYXNpbWlyL1dvcmsvS3Jhc2ltaXIvYWN0bWwvbm9kZV9tb2R1bGVzL2Zhc3QtZGVlcC1lcXVhbC9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9hcnJheVdpdGhIb2xlcy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9hcnJheVdpdGhvdXRIb2xlcy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9kZWZpbmVQcm9wZXJ0eS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9pdGVyYWJsZVRvQXJyYXkuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lL2hlbHBlcnMvaXRlcmFibGVUb0FycmF5TGltaXQuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lL2hlbHBlcnMvbm9uSXRlcmFibGVSZXN0LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL25vbkl0ZXJhYmxlU3ByZWFkLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL29iamVjdFNwcmVhZDIuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lL2hlbHBlcnMvc2xpY2VkVG9BcnJheS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy90b0NvbnN1bWFibGVBcnJheS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYWN0bWwtaW5zcGVjdG9yL2xpYi9oZWxwZXJzL3Nhbml0aXplLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9hY3RtbC1pbnNwZWN0b3IvbGliL2hlbHBlcnMvdmVuZG9yL0NpcmN1bGFySlNPTi5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYWN0bWwtaW5zcGVjdG9yL2xpYi9oZWxwZXJzL3ZlbmRvci9TZXJpYWxpemVFcnJvci5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYWN0bWwtaW5zcGVjdG9yL2xpYi9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9yZWdlbmVyYXRvci1ydW50aW1lL3J1bnRpbWUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0NoZWNrRm9yRWRpdEZpZWxkLmpzIiwid2VicGFjazovLy8uL3NyYy9ET00uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1BlcnNpc3QuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1JlbmRlcmVyLmpzIiwid2VicGFjazovLy8uL3NyYy9TdG9yZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvaW5kZXguanMiXSwibmFtZXMiOlsiT2JqZWN0IiwiZGVmaW5lUHJvcGVydHkiLCJleHBvcnRzIiwidmFsdWUiLCJnZXRGdW5jTmFtZSIsImZ1bmMiLCJuYW1lIiwicmVzdWx0IiwiZXhlYyIsInRvU3RyaW5nIiwiY3JlYXRlRWxlbWVudCIsInByb3BzIiwiY2hpbGRyZW4iLCJFcnJvciIsIl9fYWN0bWwiLCJfX3VzZWQiLCJfX3J1bm5pbmciLCJpZCIsImluaXRpYWxpemUiLCJ1c2VkIiwiYXJndW1lbnRzIiwibGVuZ3RoIiwidW5kZWZpbmVkIiwibWVyZ2VQcm9wcyIsIm5ld1Byb3BzIiwiYXNzaWduIiwiaXNSdW5uaW5nIiwiaW4iLCJfaW4iLCJjb25zdW1lIiwib3V0IiwiZGVmYXVsdCIsImNyZWF0ZUNvbnRleHRGYWN0b3J5IiwiX2RlZmluZVByb3BlcnR5Iiwib2JqIiwia2V5IiwiZW51bWVyYWJsZSIsImNvbmZpZ3VyYWJsZSIsIndyaXRhYmxlIiwiQ09OVEVYVF9LRVkiLCJQVUJMSUNfQ09OVEVYVF9LRVkiLCJpZHMiLCJnZXRJZCIsInJlc29sdmVDb250ZXh0Iiwibm9kZSIsInN0YWNrIiwicHVzaCIsImVsZW1lbnQiLCJwYXJlbnQiLCJjb25zb2xlIiwid2FybiIsIm1hcCIsImpvaW4iLCJwcm9jZXNzb3IiLCJjcmVhdGVDb250ZXh0IiwiaW5pdGlhbFZhbHVlIiwiX3JlZjMiLCJQcm92aWRlciIsIl9yZWYiLCJDb25zdW1lciIsIl9yZWYyIiwiY3JlYXRlUHJvY2Vzc29yIiwiX2lzQWN0TUxFbGVtZW50IiwicmVxdWlyZSIsIl9pc0FjdE1MRWxlbWVudDIiLCJfaW50ZXJvcFJlcXVpcmVEZWZhdWx0IiwiX1RyZWUiLCJfVHJlZTIiLCJfdXNlUHViU3ViIiwiX3VzZVB1YlN1YjIiLCJfdXNlU3RhdGUiLCJfdXNlU3RhdGUyIiwiX3VzZUVmZmVjdCIsIl91c2VFZmZlY3QyIiwiX1F1ZXVlIiwiX1F1ZXVlMiIsIl9fZXNNb2R1bGUiLCJDSElMRFJFTiIsIkNPTlNVTUUiLCJQUk9DRVNTX1JFU1VMVCIsIlJFVFVSTkVEX0VMRU1FTlQiLCJDSElMRCIsImlzR2VuZXJhdG9yIiwiaXNQcm9taXNlIiwiY3JlYXRlQ2hpbGRyZW5GdW5jIiwicHJvY2Vzc05vZGUiLCJmIiwiX2FyZ3VtZW50cyIsInF1ZXVlSXRlbXNUb0FkZCIsInJlc3VsdHMiLCJjaGlsZHJlblF1ZXVlIiwiX2xvb3AiLCJpIiwiX2NoaWxkcmVuJGkiLCJhcHBseSIsImFkZENoaWxkTm9kZSIsImZ1bmNSZXN1bHQiLCJyZXZlcnNlIiwiZm9yRWFjaCIsInByZXBlbmRJdGVtIiwiciIsInByb2Nlc3MiLCJvbkRvbmUiLCJ0cmVlIiwiY3VycmVudE5vZGUiLCJyZXJ1biIsInF1ZXVlIiwiYWRkIiwiY29uc3VtcHRpb24iLCJnZW5lcmF0b3IiLCJQcm9taXNlIiwiZ2VuZXJhdG9yRG9uZSIsImdlblJlc3VsdCIsIml0ZXJhdGUiLCJuZXh0IiwiZG9uZSIsInJlcyIsInRoZW4iLCJfcmVzIiwicnVuIiwicm9vdE5vZGUiLCJyZXNvbHZlUm9vdCIsIm9uTm9kZUluIiwiY2FsbGJhY2siLCJhZGROb2RlSW5DYWxsYmFjayIsIm9uTm9kZU91dCIsImFkZE5vZGVPdXRDYWxsYmFjayIsIm9uTm9kZVJlbW92ZSIsInN5c3RlbSIsInJlc2V0IiwiY2xlYXIiLCJjcmVhdGVRdWV1ZSIsIl90b0NvbnN1bWFibGVBcnJheSIsImFyciIsIkFycmF5IiwiaXNBcnJheSIsImFycjIiLCJmcm9tIiwiTE9HUyIsImxvZyIsIl9jb25zb2xlIiwiY3JlYXRlSXRlbSIsInR5cGUiLCJjb250ZXh0IiwiaXRlbXMiLCJhc3luYyIsInJ1bm5pbmciLCJyZWxlYXNlIiwiY29uY2F0IiwibGFzdFJlc3VsdCIsIl90aGlzIiwiaXRlbSIsInNoaWZ0IiwiYXN5bmNSZXN1bHQiLCJjYXRjaCIsImVycm9yIiwiZ2V0UmVzdWx0IiwicmVqZWN0IiwiX2V4dGVuZHMiLCJ0YXJnZXQiLCJzb3VyY2UiLCJwcm90b3R5cGUiLCJoYXNPd25Qcm9wZXJ0eSIsImNhbGwiLCJUcmVlIiwiX29iamVjdFdpdGhvdXRQcm9wZXJ0aWVzIiwia2V5cyIsImluZGV4T2YiLCJfb25Ob2RlUmVtb3ZlIiwicm9vdCIsImNyZWF0ZU5ld05vZGUiLCJ1c2VTYW1lTm9kZSIsIm5ld0VsZW1lbnQiLCJ0cmVlRGlmZiIsIm9sZEVsZW1lbnQiLCJjdXJzb3IiLCJjIiwiX19ERVZfXyIsIl90aGlzMiIsInNwbGljZSIsInJlbW92ZWROb2RlIiwibG9ncyIsIl90aGlzMyIsImNoaWxkTm9kZSIsIm5ld0NoaWxkTm9kZSIsIm1ldGEiLCJ0aW1lIiwicGVyZm9ybWFuY2UiLCJub3ciLCJnZXROdW1PZkVsZW1lbnRzIiwiZGlhZ25vc2UiLCJsb29wT3ZlciIsImluZCIsInJlc3QiLCJjaGlsZCIsIl9pc1ZhbGlkSG9va0NvbnRleHQiLCJfaXNWYWxpZEhvb2tDb250ZXh0MiIsIl9Db250ZXh0IiwiY3JlYXRlVXNlRWxlbWVudEhvb2siLCJDb250ZXh0IiwiX2Zhc3REZWVwRXF1YWwiLCJfZmFzdERlZXBFcXVhbDIiLCJTdG9yYWdlIiwiZWxlbWVudHMiLCJnZXQiLCJlZmZlY3RzIiwiY29uc3VtZXIiLCJjbGVhblVwIiwiY3JlYXRlRWZmZWN0IiwiZGVwcyIsInVwZGF0ZUVmZmVjdCIsImVmZmVjdCIsIm9sZERlcHMiLCJkZXBzRXF1YWwiLCJuZXdEZXBzIiwicmVzb2x2ZUVmZmVjdCIsImFyZUVxdWFsIiwiY3JlYXRlVXNlRWZmZWN0SG9vayIsInN0b3JhZ2UiLCJpbmRleCIsImNyZWF0ZVVzZVB1YlN1Ykhvb2siLCJzdWJzY3JpYmVycyIsInN1YnNjcmliZSIsInB1Ymxpc2giLCJwYXlsb2FkIiwic2NvcGVkRWxlbWVudCIsImVsIiwic3Vic2NyaWJlRnVuYyIsIl9sZW4iLCJwYXJhbXMiLCJfa2V5IiwicHVibGlzaEZ1bmMiLCJfbGVuMiIsIl9rZXkyIiwiX3NsaWNlZFRvQXJyYXkiLCJzbGljZUl0ZXJhdG9yIiwiX2FyciIsIl9uIiwiX2QiLCJfZSIsIl9pIiwiU3ltYm9sIiwiaXRlcmF0b3IiLCJfcyIsImVyciIsIlR5cGVFcnJvciIsImNyZWF0ZVVzZVJlZHVjZXJIb29rIiwiY3JlYXRlRGlzcGF0Y2hFbGVtZW50IiwiZGlzcGF0Y2giLCJhY3Rpb24iLCJwcm9wc1RvQWN0aW9uIiwidXNlU3RhdGUiLCJyZWR1Y2VyIiwiaW5pdGlhbFN0YXRlIiwic3RhdGUiLCJzZXRTdGF0ZSIsImNyZWF0ZVVzZVN0YXRlSG9vayIsInN0YXRlcyIsIm5ld1N0YXRlIiwiaXNWYWxpZEhvb2tDb250ZXh0IiwiY3JlYXRlUnVudGltZSIsIl9Qcm9jZXNzb3IiLCJfUHJvY2Vzc29yMiIsIl9BY3RFbGVtZW50IiwiX0FjdEVsZW1lbnQyIiwiX3VzZUVsZW1lbnQiLCJfdXNlRWxlbWVudDIiLCJfdXNlUmVkdWNlciIsIl91c2VSZWR1Y2VyMiIsIl91c2VDb250ZXh0IiwiX3VzZUNvbnRleHQyIiwiX0NvbnRleHQyIiwiQSIsIkZyYWdtZW50IiwidXNlRWxlbWVudCIsInVzZVB1YlN1YiIsInVzZVJlZHVjZXIiLCJ1c2VFZmZlY3QiLCJ1c2VDb250ZXh0IiwicnVudGltZSIsIm1vZHVsZSIsImlzQWN0TUxFbGVtZW50IiwiQ2hlY2tGb3JFZGl0RmllbGQiLCJ0b2RvcyIsImZpbmRJbmRleCIsImVkaXRpbmciLCIkIiwic2VsZWN0b3IiLCJkb2N1bWVudCIsInF1ZXJ5U2VsZWN0b3IiLCJsaXN0IiwiaGVhZGVyIiwiRU5URVIiLCJFU0MiLCJGaWxsQ29udGFpbmVyIiwiaW5uZXJIVE1MIiwiQ29udGFpbmVyIiwib25Vc2VyQWN0aW9uIiwiYWRkRXZlbnRMaXN0ZW5lciIsImUiLCJ0b2RvSW5kZXgiLCJwYXJzZUludCIsImdldEF0dHJpYnV0ZSIsImhhc0F0dHJpYnV0ZSIsIlRPR0dMRSIsIkRFTEVURSIsIkVESVQiLCJFRElUX1RPRE8iLCJsYWJlbCIsImtleUNvZGUiLCJORVdfVE9ETyIsIkZvY3VzRmllbGQiLCJmb2N1cyIsInNlbGVjdGlvblN0YXJ0Iiwic2VsZWN0aW9uRW5kIiwiUHJvZ3Jlc3NDaGVja2VyIiwiY29tcGxldGVkIiwiZmlsdGVyIiwiaXRlbXNMZWZ0IiwiRm9vdGVyIiwiRklMVEVSX0FMTCIsIkZJTFRFUl9BQ1RJVkUiLCJGSUxURVJfQ09NUExFVEVEIiwiQ0xFQVJfQ09NUExFVEVEIiwiRmlsdGVyT3B0aW9uc1RhYnMiLCJzZXRBdHRyaWJ1dGUiLCJKU09OIiwic3RyaW5naWZ5IiwiVG9EbyIsInVzZUxvY2FsU3RvcmFnZSIsInBhcnNlIiwibG9jYWxTdG9yYWdlIiwiZ2V0SXRlbSIsImdldERhdGEiLCJQZXJzaXN0Iiwic2V0SXRlbSIsIlJlbmRlcmVyIiwidG9kbyIsImxpQ2xhc3MiLCJ0b2dnbGUiLCJkZWxldGVUb2RvIiwibmV3VG9kbyIsImVkaXQiLCJlZGl0VG9EbyIsImNsZWFyQ29tcGxldGVkIiwiU3RvcmUiLCJpbnNwZWN0b3IiLCJ3YXRjaCIsIkFwcCIsInNldEZpbHRlciJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esa0RBQTBDLGdDQUFnQztBQUMxRTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGdFQUF3RCxrQkFBa0I7QUFDMUU7QUFDQSx5REFBaUQsY0FBYztBQUMvRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaURBQXlDLGlDQUFpQztBQUMxRSx3SEFBZ0gsbUJBQW1CLEVBQUU7QUFDckk7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7O0FBR0E7QUFDQTs7Ozs7Ozs7Ozs7OztBQ2xGYTs7QUFFYkEsTUFBTSxDQUFDQyxjQUFQLENBQXNCQyxPQUF0QixFQUErQixZQUEvQixFQUE2QztBQUMzQ0MsT0FBSyxFQUFFO0FBRG9DLENBQTdDOztBQUdBLFNBQVNDLFdBQVQsQ0FBcUJDLElBQXJCLEVBQTJCO0FBQ3pCLE1BQUlBLElBQUksQ0FBQ0MsSUFBVCxFQUFlLE9BQU9ELElBQUksQ0FBQ0MsSUFBWjtBQUNmLE1BQUlDLE1BQU0sR0FBRyw2QkFBNkJDLElBQTdCLENBQWtDSCxJQUFJLENBQUNJLFFBQUwsRUFBbEMsQ0FBYjtBQUVBLFNBQU9GLE1BQU0sR0FBR0EsTUFBTSxDQUFDLENBQUQsQ0FBVCxHQUFlLFNBQTVCO0FBQ0Q7O0FBQUE7O0FBRUQsSUFB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QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxHQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBLEdBQUc7QUFDSDtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsT0FBTztBQUNQLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDZCQUE2QixXQUFXLHNCQUFzQixFQUFFO0FBQ2hFO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLEU7Ozs7Ozs7Ozs7OztBQ3pLQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7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O0FBQ0E7O0FBRUEsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBLFNBQVM7QUFDVDtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0Esb0NBQW9DLGNBQWM7QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsaUNBQWlDLGtCQUFrQjtBQUNuRDtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsaUJBQWlCOztBQUVqQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsaUJBQWlCO0FBQ3pDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7O0FBRUE7QUFDQSxZQUFZO0FBQ1o7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSw4Q0FBOEMsUUFBUTtBQUN0RDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7O0FBRUEsV0FBVztBQUNYO0FBQ0E7QUFDQTs7QUFFQSxXQUFXO0FBQ1g7QUFDQTtBQUNBOztBQUVBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQSw4Q0FBOEMsUUFBUTtBQUN0RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFD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Q0FBZjtBQUFBLEtBQWIsQ0FBVDtBQUNBbEcsYUFBUyxDQUFDbUcsYUFBRCxFQUFnQjtBQUFBLGFBQU00QixTQUFTLENBQUM1QixhQUFELENBQWY7QUFBQSxLQUFoQixDQUFUO0FBQ0FuRyxhQUFTLENBQUNvRyxnQkFBRCxFQUFtQjtBQUFBLGFBQU0yQixTQUFTLENBQUMzQixnQkFBRCxDQUFmO0FBQUEsS0FBbkIsQ0FBVDtBQUNELEdBSlEsRUFJTixFQUpNLENBQVQ7QUFNQSxTQUNFLCtDQUFDLDZDQUFELFFBQ0UsK0NBQUMsOENBQUQ7QUFBVyxnQkFBWSxFQUFHbkc7QUFBMUIsSUFERixFQUVFLCtDQUFDLDJDQUFEO0FBQVEsZ0JBQVksRUFBR0E7QUFBdkIsSUFGRixFQUdFLCtDQUFDLDhDQUFEO0FBQU8sZ0JBQVksRUFBR3hLO0FBQXRCLEtBQ0UsK0NBQUMsc0RBQUQ7QUFBbUIsVUFBTSxFQUFHc1EsTUFBTTtBQUFsQyxJQURGLEVBRUUsK0NBQUMsaURBQUQ7QUFBVSxVQUFNLEVBQUdBLE1BQU07QUFBekIsSUFGRixFQUdFLCtDQUFDLDBEQUFELE9BSEYsRUFJRSwrQ0FBQyxvREFBRCxPQUpGLEVBS0UsK0NBQUMsZ0RBQUQsT0FMRixDQUhGLENBREY7QUFhRDs7QUFBQTtBQUVEdE0sZ0RBQUcsQ0FBQywrQ0FBQyxHQUFELE9BQUQsQ0FBSCxDIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiL1wiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMCk7XG4iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5mdW5jdGlvbiBnZXRGdW5jTmFtZShmdW5jKSB7XG4gIGlmIChmdW5jLm5hbWUpIHJldHVybiBmdW5jLm5hbWU7XG4gIHZhciByZXN1bHQgPSAvXmZ1bmN0aW9uXFxzKyhbXFx3XFwkXSspXFxzKlxcKC8uZXhlYyhmdW5jLnRvU3RyaW5nKCkpO1xuXG4gIHJldHVybiByZXN1bHQgPyByZXN1bHRbMV0gOiAndW5rbm93bic7XG59O1xuXG52YXIgY3JlYXRlRWxlbWVudCA9IGZ1bmN0aW9uIGNyZWF0ZUVsZW1lbnQoZnVuYywgcHJvcHMsIGNoaWxkcmVuKSB7XG4gIGlmICh0eXBlb2YgZnVuYyAhPT0gJ2Z1bmN0aW9uJykge1xuICAgIHRocm93IG5ldyBFcnJvcignQWN0TUwgZWxlbWVudCBleHBlY3RzIGEgZnVuY3Rpb24uIFwiJyArIGZ1bmMgKyAnXCIgZ2l2ZW4gaW5zdGVhZC4nKTtcbiAgfVxuICByZXR1cm4ge1xuICAgIF9fYWN0bWw6IHRydWUsXG4gICAgX191c2VkOiAwLFxuICAgIF9fcnVubmluZzogZmFsc2UsXG4gICAgaWQ6IG51bGwsXG4gICAgcHJvcHM6IHByb3BzLFxuICAgIG5hbWU6IGdldEZ1bmNOYW1lKGZ1bmMpLFxuICAgIGNoaWxkcmVuOiBjaGlsZHJlbixcbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbiBpbml0aWFsaXplKGlkKSB7XG4gICAgICB2YXIgdXNlZCA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogMDtcblxuICAgICAgdGhpcy5pZCA9IGlkO1xuICAgICAgdGhpcy5fX3VzZWQgPSB1c2VkO1xuICAgICAgdGhpcy5fX3J1bm5pbmcgPSBmYWxzZTtcbiAgICB9LFxuICAgIG1lcmdlUHJvcHM6IGZ1bmN0aW9uIG1lcmdlUHJvcHMobmV3UHJvcHMpIHtcbiAgICAgIHRoaXMucHJvcHMgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLnByb3BzLCBuZXdQcm9wcyk7XG4gICAgfSxcbiAgICB1c2VkOiBmdW5jdGlvbiB1c2VkKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX191c2VkO1xuICAgIH0sXG4gICAgaXNSdW5uaW5nOiBmdW5jdGlvbiBpc1J1bm5pbmcoKSB7XG4gICAgICByZXR1cm4gdGhpcy5fX3J1bm5pbmc7XG4gICAgfSxcbiAgICBpbjogZnVuY3Rpb24gX2luKCkge1xuICAgICAgdGhpcy5fX3J1bm5pbmcgPSB0cnVlO1xuICAgIH0sXG4gICAgY29uc3VtZTogZnVuY3Rpb24gY29uc3VtZSgpIHtcbiAgICAgIHJldHVybiBmdW5jKHRoaXMucHJvcHMpO1xuICAgIH0sXG4gICAgb3V0OiBmdW5jdGlvbiBvdXQoKSB7XG4gICAgICB0aGlzLl9fdXNlZCArPSAxO1xuICAgICAgdGhpcy5fX3J1bm5pbmcgPSBmYWxzZTtcbiAgICB9XG4gIH07XG59O1xuXG5leHBvcnRzLmRlZmF1bHQgPSBjcmVhdGVFbGVtZW50OyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuZGVmYXVsdCA9IGNyZWF0ZUNvbnRleHRGYWN0b3J5O1xuXG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHZhbHVlKSB7IGlmIChrZXkgaW4gb2JqKSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgeyB2YWx1ZTogdmFsdWUsIGVudW1lcmFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSwgd3JpdGFibGU6IHRydWUgfSk7IH0gZWxzZSB7IG9ialtrZXldID0gdmFsdWU7IH0gcmV0dXJuIG9iajsgfVxuXG4vKiBlc2xpbnQtZGlzYWJsZSBjb25zaXN0ZW50LXJldHVybiAqL1xudmFyIENPTlRFWFRfS0VZID0gJ19fQ09OVEVYVF9LRVlfXyc7XG5cbnZhciBQVUJMSUNfQ09OVEVYVF9LRVkgPSBleHBvcnRzLlBVQkxJQ19DT05URVhUX0tFWSA9ICdfX1BVQkxJQ19DT05URVhUX0tFWV9fJztcblxudmFyIGlkcyA9IDA7XG5cbmZ1bmN0aW9uIGdldElkKCkge1xuICByZXR1cm4gJ2MnICsgKytpZHM7XG59O1xuZnVuY3Rpb24gcmVzb2x2ZUNvbnRleHQobm9kZSwgaWQpIHtcbiAgdmFyIHN0YWNrID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMl0gOiBbXTtcblxuICBzdGFjay5wdXNoKG5vZGUuZWxlbWVudC5uYW1lKTtcbiAgaWYgKG5vZGVbQ09OVEVYVF9LRVldICYmIGlkIGluIG5vZGVbQ09OVEVYVF9LRVldKSB7XG4gICAgcmV0dXJuIG5vZGVbQ09OVEVYVF9LRVldW2lkXTtcbiAgfSBlbHNlIGlmIChub2RlLnBhcmVudCkge1xuICAgIHJldHVybiByZXNvbHZlQ29udGV4dChub2RlLnBhcmVudCwgaWQsIHN0YWNrKTtcbiAgfVxuICBjb25zb2xlLndhcm4oJ0EgY29udGV4dCBjb25zdW1lciBpcyB1c2VkIHdpdGggbm8gcHJvdmlkZXIuXFxuICBTdGFjazpcXG4nICsgc3RhY2subWFwKGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgcmV0dXJuICcgICAgPCcgKyBuYW1lICsgJz4nO1xuICB9KS5qb2luKCdcXG4nKSk7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUNvbnRleHRGYWN0b3J5KHByb2Nlc3Nvcikge1xuICByZXR1cm4gZnVuY3Rpb24gY3JlYXRlQ29udGV4dChpbml0aWFsVmFsdWUpIHtcbiAgICB2YXIgX3JlZjM7XG5cbiAgICB2YXIgaWQgPSBnZXRJZCgpO1xuXG4gICAgdmFyIFByb3ZpZGVyID0gZnVuY3Rpb24gUHJvdmlkZXIoX3JlZikge1xuICAgICAgdmFyIHZhbHVlID0gX3JlZi52YWx1ZSxcbiAgICAgICAgICBjaGlsZHJlbiA9IF9yZWYuY2hpbGRyZW47XG5cbiAgICAgIHZhciBub2RlID0gcHJvY2Vzc29yLm5vZGUoKTtcblxuICAgICAgaWYgKCFub2RlW0NPTlRFWFRfS0VZXSkge1xuICAgICAgICBub2RlW0NPTlRFWFRfS0VZXSA9IHt9O1xuICAgICAgfVxuICAgICAgbm9kZVtDT05URVhUX0tFWV1baWRdID0gdmFsdWU7XG5cbiAgICAgIHJldHVybiBjaGlsZHJlbjtcbiAgICB9O1xuICAgIHZhciBDb25zdW1lciA9IGZ1bmN0aW9uIENvbnN1bWVyKF9yZWYyKSB7XG4gICAgICB2YXIgY2hpbGRyZW4gPSBfcmVmMi5jaGlsZHJlbjtcblxuICAgICAgdmFyIG5vZGUgPSBwcm9jZXNzb3Iubm9kZSgpO1xuXG4gICAgICBjaGlsZHJlbihyZXNvbHZlQ29udGV4dChub2RlLCBpZCkgfHwgaW5pdGlhbFZhbHVlKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIF9yZWYzID0ge30sIF9kZWZpbmVQcm9wZXJ0eShfcmVmMywgUFVCTElDX0NPTlRFWFRfS0VZLCBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgbm9kZSA9IHByb2Nlc3Nvci5ub2RlKCk7XG5cbiAgICAgIHJldHVybiByZXNvbHZlQ29udGV4dChub2RlLCBpZCkgfHwgaW5pdGlhbFZhbHVlO1xuICAgIH0pLCBfZGVmaW5lUHJvcGVydHkoX3JlZjMsICdQcm92aWRlcicsIFByb3ZpZGVyKSwgX2RlZmluZVByb3BlcnR5KF9yZWYzLCAnQ29uc3VtZXInLCBDb25zdW1lciksIF9yZWYzO1xuICB9O1xufTsiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLmRlZmF1bHQgPSBjcmVhdGVQcm9jZXNzb3I7XG5cbnZhciBfaXNBY3RNTEVsZW1lbnQgPSByZXF1aXJlKCcuL3V0aWxzL2lzQWN0TUxFbGVtZW50Jyk7XG5cbnZhciBfaXNBY3RNTEVsZW1lbnQyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfaXNBY3RNTEVsZW1lbnQpO1xuXG52YXIgX1RyZWUgPSByZXF1aXJlKCcuL1RyZWUnKTtcblxudmFyIF9UcmVlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX1RyZWUpO1xuXG52YXIgX3VzZVB1YlN1YiA9IHJlcXVpcmUoJy4vaG9va3MvdXNlUHViU3ViJyk7XG5cbnZhciBfdXNlUHViU3ViMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3VzZVB1YlN1Yik7XG5cbnZhciBfdXNlU3RhdGUgPSByZXF1aXJlKCcuL2hvb2tzL3VzZVN0YXRlJyk7XG5cbnZhciBfdXNlU3RhdGUyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfdXNlU3RhdGUpO1xuXG52YXIgX3VzZUVmZmVjdCA9IHJlcXVpcmUoJy4vaG9va3MvdXNlRWZmZWN0Jyk7XG5cbnZhciBfdXNlRWZmZWN0MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3VzZUVmZmVjdCk7XG5cbnZhciBfUXVldWUgPSByZXF1aXJlKCcuL1F1ZXVlJyk7XG5cbnZhciBfUXVldWUyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfUXVldWUpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG4vKiBlc2xpbnQtZGlzYWJsZSBuby11c2UtYmVmb3JlLWRlZmluZSwgY29uc2lzdGVudC1yZXR1cm4gKi9cbnZhciBDSElMRFJFTiA9ICdfX0FDVE1MX0NISUxEUkVOX18nO1xuXG52YXIgQ09OU1VNRSA9ICdDT05TVU1FJztcbnZhciBQUk9DRVNTX1JFU1VMVCA9ICdQUk9DRVNTX1JFU1VMVCc7XG52YXIgUkVUVVJORURfRUxFTUVOVCA9ICdSRVRVUk5FRF9FTEVNRU5UJztcbnZhciBDSElMRCA9ICdDSElMRCc7XG5cbnZhciBpc0dlbmVyYXRvciA9IGZ1bmN0aW9uIGlzR2VuZXJhdG9yKG9iaikge1xuICByZXR1cm4gb2JqICYmIHR5cGVvZiBvYmpbJ25leHQnXSA9PT0gJ2Z1bmN0aW9uJztcbn07XG52YXIgaXNQcm9taXNlID0gZnVuY3Rpb24gaXNQcm9taXNlKG9iaikge1xuICByZXR1cm4gb2JqICYmIHR5cGVvZiBvYmpbJ3RoZW4nXSA9PT0gJ2Z1bmN0aW9uJztcbn07XG5cbmZ1bmN0aW9uIGNyZWF0ZUNoaWxkcmVuRnVuYyhub2RlLCBwcm9jZXNzTm9kZSkge1xuICB2YXIgZiA9IGZ1bmN0aW9uIGYoKSB7XG4gICAgdmFyIF9hcmd1bWVudHMgPSBhcmd1bWVudHM7XG4gICAgdmFyIGNoaWxkcmVuID0gbm9kZS5lbGVtZW50LmNoaWxkcmVuO1xuXG5cbiAgICBpZiAoY2hpbGRyZW4gJiYgY2hpbGRyZW4ubGVuZ3RoID4gMCkge1xuICAgICAgdmFyIHF1ZXVlSXRlbXNUb0FkZCA9IFtdO1xuICAgICAgdmFyIHJlc3VsdHMgPSBbXTtcbiAgICAgIHZhciBjaGlsZHJlblF1ZXVlID0gKDAsIF9RdWV1ZTIuZGVmYXVsdCkoJyAgJyArIG5vZGUuZWxlbWVudC5uYW1lICsgJzpjaGlsZHJlbicpO1xuXG4gICAgICB2YXIgX2xvb3AgPSBmdW5jdGlvbiBfbG9vcChpKSB7XG4gICAgICAgIGlmICgoMCwgX2lzQWN0TUxFbGVtZW50Mi5kZWZhdWx0KShjaGlsZHJlbltpXSkpIHtcbiAgICAgICAgICB2YXIgX2NoaWxkcmVuJGk7XG5cbiAgICAgICAgICAoX2NoaWxkcmVuJGkgPSBjaGlsZHJlbltpXSkubWVyZ2VQcm9wcy5hcHBseShfY2hpbGRyZW4kaSwgX2FyZ3VtZW50cyk7XG4gICAgICAgICAgcXVldWVJdGVtc1RvQWRkLnB1c2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHByb2Nlc3NOb2RlKG5vZGUuYWRkQ2hpbGROb2RlKGNoaWxkcmVuW2ldKSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGNoaWxkcmVuW2ldID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgdmFyIGZ1bmNSZXN1bHQgPSBjaGlsZHJlbltpXS5hcHBseShjaGlsZHJlbiwgX2FyZ3VtZW50cyk7XG5cbiAgICAgICAgICBpZiAoKDAsIF9pc0FjdE1MRWxlbWVudDIuZGVmYXVsdCkoZnVuY1Jlc3VsdCkpIHtcbiAgICAgICAgICAgIHF1ZXVlSXRlbXNUb0FkZC5wdXNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHByb2Nlc3NOb2RlKG5vZGUuYWRkQ2hpbGROb2RlKGZ1bmNSZXN1bHQpKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXN1bHRzLnB1c2goZnVuY1Jlc3VsdCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlc3VsdHMucHVzaChjaGlsZHJlbltpXSk7XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgX2xvb3AoaSk7XG4gICAgICB9XG4gICAgICBxdWV1ZUl0ZW1zVG9BZGQucmV2ZXJzZSgpLmZvckVhY2goZnVuY3Rpb24gKGZ1bmMpIHtcbiAgICAgICAgY2hpbGRyZW5RdWV1ZS5wcmVwZW5kSXRlbShDSElMRCwgZnVuYywgZnVuY3Rpb24gKHIpIHtcbiAgICAgICAgICByZXR1cm4gcmVzdWx0cy5wdXNoKHIpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgICAgY2hpbGRyZW5RdWV1ZS5wcm9jZXNzKCk7XG4gICAgICByZXR1cm4gY2hpbGRyZW5RdWV1ZS5vbkRvbmUoZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gcmVzdWx0cztcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcblxuICBmW0NISUxEUkVOXSA9IHRydWU7XG4gIHJldHVybiBmO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVQcm9jZXNzb3IoKSB7XG4gIHZhciB0cmVlID0gKDAsIF9UcmVlMi5kZWZhdWx0KSgpO1xuICB2YXIgY3VycmVudE5vZGUgPSBudWxsO1xuXG4gIHZhciBwcm9jZXNzTm9kZSA9IGZ1bmN0aW9uIHByb2Nlc3NOb2RlKG5vZGUpIHtcbiAgICBjdXJyZW50Tm9kZSA9IG5vZGU7XG4gICAgbm9kZS5pbigpO1xuICAgIG5vZGUucmVydW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gcHJvY2Vzc05vZGUobm9kZSk7XG4gICAgfTtcbiAgICBub2RlLmVsZW1lbnQubWVyZ2VQcm9wcyh7XG4gICAgICBjaGlsZHJlbjogY3JlYXRlQ2hpbGRyZW5GdW5jKG5vZGUsIHByb2Nlc3NOb2RlKVxuICAgIH0pO1xuXG4gICAgdmFyIHJlc3VsdHMgPSB7fTtcbiAgICB2YXIgcXVldWUgPSAoMCwgX1F1ZXVlMi5kZWZhdWx0KSgnICcgKyBub2RlLmVsZW1lbnQubmFtZSk7XG5cbiAgICAvLyBDT05TVU1FXG4gICAgcXVldWUuYWRkKENPTlNVTUUsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBub2RlLmVsZW1lbnQuY29uc3VtZSgpO1xuICAgIH0sIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgIHJldHVybiByZXN1bHRzW0NPTlNVTUVdID0gcmVzdWx0O1xuICAgIH0pO1xuXG4gICAgLy8gUFJPQ0VTU19SRVNVTFRcbiAgICBxdWV1ZS5hZGQoUFJPQ0VTU19SRVNVTFQsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBjb25zdW1wdGlvbiA9IHJlc3VsdHNbQ09OU1VNRV07XG5cbiAgICAgIC8vIEFjdE1MIGVsZW1lbnRcbiAgICAgIGlmICgoMCwgX2lzQWN0TUxFbGVtZW50Mi5kZWZhdWx0KShjb25zdW1wdGlvbikpIHtcbiAgICAgICAgcXVldWUucHJlcGVuZEl0ZW0oUkVUVVJORURfRUxFTUVOVCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHJldHVybiBwcm9jZXNzTm9kZShub2RlLmFkZENoaWxkTm9kZShjb25zdW1wdGlvbikpO1xuICAgICAgICB9LCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgcmV0dXJuIHJlc3VsdHNbUkVUVVJORURfRUxFTUVOVF0gPSByZXN1bHQ7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIGdlbmVyYXRvclxuICAgICAgfSBlbHNlIGlmIChpc0dlbmVyYXRvcihjb25zdW1wdGlvbikpIHtcbiAgICAgICAgdmFyIGdlbmVyYXRvciA9IGNvbnN1bXB0aW9uO1xuXG4gICAgICAgIHF1ZXVlLnByZXBlbmRJdGVtKFJFVFVSTkVEX0VMRU1FTlQsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKGdlbmVyYXRvckRvbmUpIHtcbiAgICAgICAgICAgIHZhciBnZW5SZXN1bHQgPSB2b2lkIDA7XG5cbiAgICAgICAgICAgIChmdW5jdGlvbiBpdGVyYXRlKHZhbHVlKSB7XG4gICAgICAgICAgICAgIGdlblJlc3VsdCA9IGdlbmVyYXRvci5uZXh0KHZhbHVlKTtcbiAgICAgICAgICAgICAgaWYgKCFnZW5SZXN1bHQuZG9uZSkge1xuICAgICAgICAgICAgICAgIGlmICgoMCwgX2lzQWN0TUxFbGVtZW50Mi5kZWZhdWx0KShnZW5SZXN1bHQudmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICB2YXIgcmVzID0gcHJvY2Vzc05vZGUobm9kZS5hZGRDaGlsZE5vZGUoZ2VuUmVzdWx0LnZhbHVlKSk7XG5cbiAgICAgICAgICAgICAgICAgIGlmIChpc1Byb21pc2UocmVzKSkge1xuICAgICAgICAgICAgICAgICAgICByZXMudGhlbihmdW5jdGlvbiAocikge1xuICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBpdGVyYXRlKHIpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGl0ZXJhdGUocmVzKTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKCgwLCBfaXNBY3RNTEVsZW1lbnQyLmRlZmF1bHQpKGdlblJlc3VsdC52YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgIHZhciBfcmVzID0gcHJvY2Vzc05vZGUobm9kZS5hZGRDaGlsZE5vZGUoZ2VuUmVzdWx0LnZhbHVlKSk7XG5cbiAgICAgICAgICAgICAgICAgIGlmIChpc1Byb21pc2UoX3JlcykpIHtcbiAgICAgICAgICAgICAgICAgICAgX3Jlcy50aGVuKGZ1bmN0aW9uIChyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGdlbmVyYXRvckRvbmUocik7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZ2VuZXJhdG9yRG9uZShfcmVzKTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgZ2VuZXJhdG9yRG9uZShnZW5SZXN1bHQudmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSwgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgIHJldHVybiByZXN1bHRzW1JFVFVSTkVEX0VMRU1FTlRdID0gcmVzdWx0O1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBjaGlsZHJlblxuICAgICAgfSBlbHNlIGlmIChjb25zdW1wdGlvbiAmJiBjb25zdW1wdGlvbltDSElMRFJFTl0pIHtcbiAgICAgICAgcXVldWUucHJlcGVuZEl0ZW0oUkVUVVJORURfRUxFTUVOVCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHJldHVybiBjb25zdW1wdGlvbigpO1xuICAgICAgICB9LCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgcmVzdWx0c1tSRVRVUk5FRF9FTEVNRU5UXSA9IHJlc3VsdCAmJiByZXN1bHQubGVuZ3RoID09PSAxID8gcmVzdWx0WzBdIDogcmVzdWx0O1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIFJ1bm5pbmcgdGhlIHF1ZXVlXG4gICAgcXVldWUucHJvY2VzcygpO1xuXG4gICAgLy8gR2V0dGluZyB0aGUgcmVzdWx0LiBJdCBpcyBlaXRoZXIgYSBwcm9taXNlIGlmIHRoZXJlIGlzXG4gICAgLy8gc29tZXRoaW5nIGFzeW5jaHJvbm91cyBvciBhIHZhbHVlXG4gICAgcmV0dXJuIHF1ZXVlLm9uRG9uZShmdW5jdGlvbiAoKSB7XG4gICAgICBub2RlLm91dCgpO1xuICAgICAgcmV0dXJuIFJFVFVSTkVEX0VMRU1FTlQgaW4gcmVzdWx0cyA/IHJlc3VsdHNbUkVUVVJORURfRUxFTUVOVF0gOiByZXN1bHRzW0NPTlNVTUVdO1xuICAgIH0pO1xuICB9O1xuXG4gIHJldHVybiB7XG4gICAgbm9kZTogZnVuY3Rpb24gbm9kZSgpIHtcbiAgICAgIHJldHVybiBjdXJyZW50Tm9kZTtcbiAgICB9LFxuICAgIHJ1bjogZnVuY3Rpb24gcnVuKGVsZW1lbnQpIHtcbiAgICAgIHZhciByb290Tm9kZSA9IHRyZWUucmVzb2x2ZVJvb3QoZWxlbWVudCk7XG5cbiAgICAgIHJldHVybiBwcm9jZXNzTm9kZShyb290Tm9kZSk7XG4gICAgfSxcbiAgICBvbk5vZGVJbjogZnVuY3Rpb24gb25Ob2RlSW4oY2FsbGJhY2spIHtcbiAgICAgIHRyZWUuYWRkTm9kZUluQ2FsbGJhY2soY2FsbGJhY2spO1xuICAgIH0sXG4gICAgb25Ob2RlT3V0OiBmdW5jdGlvbiBvbk5vZGVPdXQoY2FsbGJhY2spIHtcbiAgICAgIHRyZWUuYWRkTm9kZU91dENhbGxiYWNrKGNhbGxiYWNrKTtcbiAgICB9LFxuICAgIG9uTm9kZVJlbW92ZTogZnVuY3Rpb24gb25Ob2RlUmVtb3ZlKGNhbGxiYWNrKSB7XG4gICAgICB0cmVlLm9uTm9kZVJlbW92ZShjYWxsYmFjayk7XG4gICAgfSxcbiAgICBzeXN0ZW06IGZ1bmN0aW9uIHN5c3RlbSgpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHRyZWU6IHRyZWUsXG4gICAgICAgIHJlc2V0OiBmdW5jdGlvbiByZXNldCgpIHtcbiAgICAgICAgICBjdXJyZW50Tm9kZSA9IG51bGw7XG4gICAgICAgICAgdHJlZS5yZXNldCgpO1xuICAgICAgICAgIF91c2VQdWJTdWIyLmRlZmF1bHQuY2xlYXIoKTtcbiAgICAgICAgICBfdXNlU3RhdGUyLmRlZmF1bHQuY2xlYXIoKTtcbiAgICAgICAgICBfdXNlRWZmZWN0Mi5kZWZhdWx0LmNsZWFyKCk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfVxuICB9O1xufTsiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLmRlZmF1bHQgPSBjcmVhdGVRdWV1ZTtcblxuZnVuY3Rpb24gX3RvQ29uc3VtYWJsZUFycmF5KGFycikgeyBpZiAoQXJyYXkuaXNBcnJheShhcnIpKSB7IGZvciAodmFyIGkgPSAwLCBhcnIyID0gQXJyYXkoYXJyLmxlbmd0aCk7IGkgPCBhcnIubGVuZ3RoOyBpKyspIHsgYXJyMltpXSA9IGFycltpXTsgfSByZXR1cm4gYXJyMjsgfSBlbHNlIHsgcmV0dXJuIEFycmF5LmZyb20oYXJyKTsgfSB9XG5cbi8qIGVzbGludC1kaXNhYmxlIG5vLXJldHVybi1hc3NpZ24gKi9cbnZhciBMT0dTID0gZmFsc2U7XG52YXIgbG9nID0gZnVuY3Rpb24gbG9nKCkge1xuICB2YXIgX2NvbnNvbGU7XG5cbiAgcmV0dXJuIExPR1MgPyAoX2NvbnNvbGUgPSBjb25zb2xlKS5sb2cuYXBwbHkoX2NvbnNvbGUsIGFyZ3VtZW50cykgOiBudWxsO1xufTtcbnZhciBpc1Byb21pc2UgPSBmdW5jdGlvbiBpc1Byb21pc2Uob2JqKSB7XG4gIHJldHVybiBvYmogJiYgdHlwZW9mIG9ialsndGhlbiddID09PSAnZnVuY3Rpb24nO1xufTtcbnZhciBjcmVhdGVJdGVtID0gZnVuY3Rpb24gY3JlYXRlSXRlbSh0eXBlLCBmdW5jKSB7XG4gIHZhciBvbkRvbmUgPSBhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBhcmd1bWVudHNbMl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1syXSA6IGZ1bmN0aW9uICgpIHt9O1xuICByZXR1cm4ge1xuICAgIHR5cGU6IHR5cGUsXG4gICAgZnVuYzogZnVuYyxcbiAgICBvbkRvbmU6IG9uRG9uZVxuICB9O1xufTtcblxuZnVuY3Rpb24gY3JlYXRlUXVldWUoY29udGV4dCkge1xuICB2YXIgaXRlbXMgPSBbXTtcbiAgdmFyIGFzeW5jID0gZmFsc2U7XG4gIHZhciBydW5uaW5nID0gZmFsc2U7XG4gIHZhciByZWxlYXNlID0gZnVuY3Rpb24gcmVsZWFzZSgpIHt9O1xuXG4gIHJldHVybiB7XG4gICAgYWRkOiBmdW5jdGlvbiBhZGQodHlwZSwgZnVuYywgb25Eb25lKSB7XG4gICAgICBsb2coY29udGV4dCArICc6UTogWy4uLicgKyB0eXBlICsgJ10gKCcgKyAoaXRlbXMubGVuZ3RoICsgMSkgKyAnIHRvdGFsKScpO1xuICAgICAgaXRlbXMucHVzaChjcmVhdGVJdGVtKHR5cGUsIGZ1bmMsIG9uRG9uZSkpO1xuICAgIH0sXG4gICAgcHJlcGVuZEl0ZW06IGZ1bmN0aW9uIHByZXBlbmRJdGVtKHR5cGUsIGZ1bmMsIG9uRG9uZSkge1xuICAgICAgbG9nKGNvbnRleHQgKyAnOlE6IFsnICsgdHlwZSArICcuLi5dICgnICsgKGl0ZW1zLmxlbmd0aCArIDEpICsgJyB0b3RhbCknKTtcbiAgICAgIGl0ZW1zID0gW2NyZWF0ZUl0ZW0odHlwZSwgZnVuYywgb25Eb25lKV0uY29uY2F0KF90b0NvbnN1bWFibGVBcnJheShpdGVtcykpO1xuICAgIH0sXG4gICAgcHJvY2VzczogZnVuY3Rpb24gcHJvY2VzcyhsYXN0UmVzdWx0KSB7XG4gICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICBydW5uaW5nID0gdHJ1ZTtcbiAgICAgIGlmIChpdGVtcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgbG9nKGNvbnRleHQgKyAnOlE6ZG9uZScpO1xuICAgICAgICBydW5uaW5nID0gZmFsc2U7XG4gICAgICAgIHJlbGVhc2UoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB2YXIgaXRlbSA9IGl0ZW1zLnNoaWZ0KCk7XG5cbiAgICAgIGxvZyhjb250ZXh0ICsgJzpROiAnICsgaXRlbS50eXBlICsgJygpICgnICsgaXRlbXMubGVuZ3RoICsgJyBsZWZ0KScpO1xuICAgICAgdmFyIHJlc3VsdCA9IGl0ZW0uZnVuYyhsYXN0UmVzdWx0KTtcblxuICAgICAgaWYgKGlzUHJvbWlzZShyZXN1bHQpKSB7XG4gICAgICAgIGFzeW5jID0gdHJ1ZTtcbiAgICAgICAgcmVzdWx0LnRoZW4oZnVuY3Rpb24gKGFzeW5jUmVzdWx0KSB7XG4gICAgICAgICAgaXRlbS5vbkRvbmUoYXN5bmNSZXN1bHQpO1xuICAgICAgICAgIF90aGlzLnByb2Nlc3MoYXN5bmNSZXN1bHQpO1xuICAgICAgICB9KS5jYXRjaChmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICByZWxlYXNlKGVycm9yKTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpdGVtLm9uRG9uZShyZXN1bHQpO1xuICAgICAgICB0aGlzLnByb2Nlc3MocmVzdWx0KTtcbiAgICAgIH1cbiAgICB9LFxuICAgIG9uRG9uZTogZnVuY3Rpb24gb25Eb25lKGdldFJlc3VsdCkge1xuICAgICAgaWYgKGFzeW5jKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAoZG9uZSwgcmVqZWN0KSB7XG4gICAgICAgICAgcmVsZWFzZSA9IGZ1bmN0aW9uIHJlbGVhc2UoZXJyb3IpIHtcbiAgICAgICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgICByZWplY3QoZXJyb3IpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgZG9uZShnZXRSZXN1bHQoKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gZ2V0UmVzdWx0KCk7XG4gICAgfSxcbiAgICBpc1J1bm5pbmc6IGZ1bmN0aW9uIGlzUnVubmluZygpIHtcbiAgICAgIHJldHVybiBydW5uaW5nO1xuICAgIH1cbiAgfTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHsgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHsgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTsgZm9yICh2YXIga2V5IGluIHNvdXJjZSkgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkgeyB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldOyB9IH0gfSByZXR1cm4gdGFyZ2V0OyB9O1xuXG5leHBvcnRzLmRlZmF1bHQgPSBUcmVlO1xuXG5mdW5jdGlvbiBfb2JqZWN0V2l0aG91dFByb3BlcnRpZXMob2JqLCBrZXlzKSB7IHZhciB0YXJnZXQgPSB7fTsgZm9yICh2YXIgaSBpbiBvYmopIHsgaWYgKGtleXMuaW5kZXhPZihpKSA+PSAwKSBjb250aW51ZTsgaWYgKCFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBpKSkgY29udGludWU7IHRhcmdldFtpXSA9IG9ialtpXTsgfSByZXR1cm4gdGFyZ2V0OyB9XG5cbi8qIGVzbGludC1kaXNhYmxlIG5vLXVzZS1iZWZvcmUtZGVmaW5lLCBuby1yZXR1cm4tYXNzaWduLCBtYXgtbGVuICovXG52YXIgTE9HUyA9IGZhbHNlO1xudmFyIGxvZyA9IGZ1bmN0aW9uIGxvZygpIHtcbiAgdmFyIF9jb25zb2xlO1xuXG4gIHJldHVybiBMT0dTID8gKF9jb25zb2xlID0gY29uc29sZSkubG9nLmFwcGx5KF9jb25zb2xlLCBhcmd1bWVudHMpIDogbnVsbDtcbn07XG5cbmZ1bmN0aW9uIFRyZWUoKSB7XG4gIHZhciBvbk5vZGVJbiA9IFtdO1xuICB2YXIgb25Ob2RlT3V0ID0gW107XG4gIHZhciBfb25Ob2RlUmVtb3ZlID0gW107XG4gIHZhciByb290ID0gY3JlYXRlTmV3Tm9kZSgpO1xuICB2YXIgaWRzID0gMDtcblxuICBmdW5jdGlvbiBnZXRJZCgpIHtcbiAgICByZXR1cm4gJ2EnICsgKytpZHM7XG4gIH07XG4gIGZ1bmN0aW9uIHVzZVNhbWVOb2RlKG5vZGUsIG5ld0VsZW1lbnQpIHtcbiAgICBuZXdFbGVtZW50LmluaXRpYWxpemUobm9kZS5lbGVtZW50LmlkLCBub2RlLmVsZW1lbnQudXNlZCgpKTtcbiAgICBub2RlLmVsZW1lbnQgPSBuZXdFbGVtZW50O1xuICAgIHJldHVybiBub2RlO1xuICB9XG4gIGZ1bmN0aW9uIHRyZWVEaWZmKG9sZEVsZW1lbnQsIG5ld0VsZW1lbnQpIHtcbiAgICBpZiAob2xkRWxlbWVudCAmJiBvbGRFbGVtZW50Lm5hbWUgPT09IG5ld0VsZW1lbnQubmFtZSkge1xuICAgICAgaWYgKG9sZEVsZW1lbnQucHJvcHMgJiYgbmV3RWxlbWVudC5wcm9wcykge1xuICAgICAgICByZXR1cm4gb2xkRWxlbWVudC5wcm9wcy5rZXkgPT09IG5ld0VsZW1lbnQucHJvcHMua2V5O1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBmdW5jdGlvbiBjcmVhdGVOZXdOb2RlKGVsZW1lbnQsIHBhcmVudCkge1xuICAgIGlmIChlbGVtZW50KSB7XG4gICAgICBlbGVtZW50LmluaXRpYWxpemUoZ2V0SWQoKSk7XG4gICAgfVxuXG4gICAgdmFyIG5vZGUgPSB7XG4gICAgICBlbGVtZW50OiBlbGVtZW50LFxuICAgICAgY2hpbGRyZW46IFtdLFxuICAgICAgcGFyZW50OiBwYXJlbnQsXG4gICAgICBjdXJzb3I6IDAsXG4gICAgICBpbjogZnVuY3Rpb24gX2luKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICAgIGxvZygnLT4gJyArIHRoaXMuZWxlbWVudC5uYW1lKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmluKCk7XG4gICAgICAgIG9uTm9kZUluLmZvckVhY2goZnVuY3Rpb24gKGMpIHtcbiAgICAgICAgICByZXR1cm4gYyhfdGhpcyk7XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoX19ERVZfXykge1xuICAgICAgICAgIG5vZGUubG9nKCdub2RlOmluJyk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBvdXQ6IGZ1bmN0aW9uIG91dCgpIHtcbiAgICAgICAgdmFyIF90aGlzMiA9IHRoaXM7XG5cbiAgICAgICAgbG9nKCc8LSAnICsgdGhpcy5lbGVtZW50Lm5hbWUpO1xuICAgICAgICB0aGlzLmVsZW1lbnQub3V0KCk7XG4gICAgICAgIC8vIElmIHRoZXJlJ3JlIG1vcmUgbm9kZXMgaW4gdGhlIHRyZWUgdGhhbiB3aGF0IHdhcyBwcm9jZXNzZWRcbiAgICAgICAgaWYgKHRoaXMuY3Vyc29yIDwgdGhpcy5jaGlsZHJlbi5sZW5ndGgpIHtcbiAgICAgICAgICB0aGlzLmNoaWxkcmVuLnNwbGljZSh0aGlzLmN1cnNvciwgdGhpcy5jaGlsZHJlbi5sZW5ndGggLSB0aGlzLmN1cnNvcikuZm9yRWFjaChmdW5jdGlvbiAocmVtb3ZlZE5vZGUpIHtcbiAgICAgICAgICAgIHJldHVybiBfb25Ob2RlUmVtb3ZlLmZvckVhY2goZnVuY3Rpb24gKGMpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGMocmVtb3ZlZE5vZGUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jdXJzb3IgPSAwO1xuICAgICAgICBpZiAoX19ERVZfXykge1xuICAgICAgICAgIG5vZGUubG9nKCdub2RlOm91dCcpO1xuICAgICAgICB9XG4gICAgICAgIG9uTm9kZU91dC5mb3JFYWNoKGZ1bmN0aW9uIChjKSB7XG4gICAgICAgICAgcmV0dXJuIGMoX3RoaXMyKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChfX0RFVl9fKSB7XG4gICAgICAgICAgaWYgKHRoaXMubG9ncykgdGhpcy5sb2dzID0gW107XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBhZGRDaGlsZE5vZGU6IGZ1bmN0aW9uIGFkZENoaWxkTm9kZShuZXdFbGVtZW50KSB7XG4gICAgICAgIHZhciBfdGhpczMgPSB0aGlzO1xuXG4gICAgICAgIHZhciBjaGlsZE5vZGUgPSB0aGlzLmNoaWxkcmVuW3RoaXMuY3Vyc29yXTtcblxuICAgICAgICAvLyB1c2luZyB0aGUgc2FtZSBub2RlXG4gICAgICAgIGlmIChjaGlsZE5vZGUgJiYgdHJlZURpZmYoY2hpbGROb2RlLmVsZW1lbnQsIG5ld0VsZW1lbnQpKSB7XG4gICAgICAgICAgdGhpcy5jdXJzb3IgKz0gMTtcbiAgICAgICAgICByZXR1cm4gdXNlU2FtZU5vZGUoY2hpbGROb2RlLCBuZXdFbGVtZW50KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGNyZWF0aW5nIGEgbmV3IG5vZGVcbiAgICAgICAgdmFyIG5ld0NoaWxkTm9kZSA9IGNyZWF0ZU5ld05vZGUobmV3RWxlbWVudCwgdGhpcyk7XG5cbiAgICAgICAgaWYgKHRoaXMuY2hpbGRyZW5bdGhpcy5jdXJzb3JdKSB7XG4gICAgICAgICAgX29uTm9kZVJlbW92ZS5mb3JFYWNoKGZ1bmN0aW9uIChjKSB7XG4gICAgICAgICAgICByZXR1cm4gYyhfdGhpczMuY2hpbGRyZW5bX3RoaXMzLmN1cnNvcl0pO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY2hpbGRyZW5bdGhpcy5jdXJzb3JdID0gbmV3Q2hpbGROb2RlO1xuICAgICAgICB0aGlzLmN1cnNvciArPSAxO1xuICAgICAgICByZXR1cm4gbmV3Q2hpbGROb2RlO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBpZiAoX19ERVZfXykge1xuICAgICAgbm9kZS5sb2cgPSBmdW5jdGlvbiAodHlwZSwgbWV0YSkge1xuICAgICAgICBpZiAoISgnbG9ncycgaW4gbm9kZSkpIG5vZGUubG9ncyA9IFtdO1xuICAgICAgICBub2RlLmxvZ3MucHVzaCh7IHR5cGU6IHR5cGUsIG1ldGE6IG1ldGEsIHRpbWU6IHBlcmZvcm1hbmNlLm5vdygpIH0pO1xuICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4gbm9kZTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgcmVzb2x2ZVJvb3Q6IGZ1bmN0aW9uIHJlc29sdmVSb290KGVsZW1lbnQpIHtcbiAgICAgIHJldHVybiByb290ID0gdHJlZURpZmYocm9vdC5lbGVtZW50LCBlbGVtZW50KSA/IHVzZVNhbWVOb2RlKHJvb3QsIGVsZW1lbnQpIDogY3JlYXRlTmV3Tm9kZShlbGVtZW50KTtcbiAgICB9LFxuICAgIHJlc2V0OiBmdW5jdGlvbiByZXNldCgpIHtcbiAgICAgIHJvb3QgPSBjcmVhdGVOZXdOb2RlKCk7XG4gICAgICBpZHMgPSAwO1xuICAgIH0sXG4gICAgZ2V0TnVtT2ZFbGVtZW50czogZnVuY3Rpb24gZ2V0TnVtT2ZFbGVtZW50cygpIHtcbiAgICAgIHJldHVybiBpZHM7XG4gICAgfSxcbiAgICBkaWFnbm9zZTogZnVuY3Rpb24gZGlhZ25vc2UoKSB7XG4gICAgICBpZiAoX19ERVZfXykge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gbG9vcE92ZXIobm9kZSkge1xuICAgICAgICAgIHZhciBpbmQgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IDA7XG5cbiAgICAgICAgICB2YXIgX3JlZiA9IG5vZGUuZWxlbWVudC5wcm9wcyA/IG5vZGUuZWxlbWVudC5wcm9wcyA6IHt9LFxuICAgICAgICAgICAgICBjaGlsZHJlbiA9IF9yZWYuY2hpbGRyZW4sXG4gICAgICAgICAgICAgIHJlc3QgPSBfb2JqZWN0V2l0aG91dFByb3BlcnRpZXMoX3JlZiwgWydjaGlsZHJlbiddKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xuXG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGluZDogaW5kLFxuICAgICAgICAgICAgbmFtZTogbm9kZS5lbGVtZW50Lm5hbWUsXG4gICAgICAgICAgICBsb2dzOiBub2RlLmxvZ3MsXG4gICAgICAgICAgICBwcm9wczogX2V4dGVuZHMoe1xuICAgICAgICAgICAgICBjaGlsZHJlbjogJzxmdW5jdGlvbiBjaGlsZHJlbj4nXG4gICAgICAgICAgICB9LCByZXN0KSxcbiAgICAgICAgICAgIHVzZWQ6IG5vZGUuZWxlbWVudC51c2VkKCksXG4gICAgICAgICAgICBpZDogbm9kZS5lbGVtZW50LmlkLFxuICAgICAgICAgICAgY2hpbGRyZW46IG5vZGUuY2hpbGRyZW4ubWFwKGZ1bmN0aW9uIChjaGlsZCkge1xuICAgICAgICAgICAgICByZXR1cm4gbG9vcE92ZXIoY2hpbGQsIGluZCArIDEpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9O1xuICAgICAgICB9KHJvb3QpO1xuICAgICAgfVxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdOb3QgYXZhaWxhYmxlIGluIHByb2R1Y3Rpb24gbW9kZScpO1xuICAgIH0sXG4gICAgYWRkTm9kZUluQ2FsbGJhY2s6IGZ1bmN0aW9uIGFkZE5vZGVJbkNhbGxiYWNrKGNhbGxiYWNrKSB7XG4gICAgICBvbk5vZGVJbi5wdXNoKGNhbGxiYWNrKTtcbiAgICB9LFxuICAgIGFkZE5vZGVPdXRDYWxsYmFjazogZnVuY3Rpb24gYWRkTm9kZU91dENhbGxiYWNrKGNhbGxiYWNrKSB7XG4gICAgICBvbk5vZGVPdXQucHVzaChjYWxsYmFjayk7XG4gICAgfSxcbiAgICBvbk5vZGVSZW1vdmU6IGZ1bmN0aW9uIG9uTm9kZVJlbW92ZShjYWxsYmFjaykge1xuICAgICAgX29uTm9kZVJlbW92ZS5wdXNoKGNhbGxiYWNrKTtcbiAgICB9XG4gIH07XG59OyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9pc1ZhbGlkSG9va0NvbnRleHQgPSByZXF1aXJlKCcuL3V0aWxzL2lzVmFsaWRIb29rQ29udGV4dCcpO1xuXG52YXIgX2lzVmFsaWRIb29rQ29udGV4dDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9pc1ZhbGlkSG9va0NvbnRleHQpO1xuXG52YXIgX0NvbnRleHQgPSByZXF1aXJlKCcuLi9Db250ZXh0Jyk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbnZhciBjcmVhdGVVc2VFbGVtZW50SG9vayA9IGZ1bmN0aW9uIGNyZWF0ZVVzZUVsZW1lbnRIb29rKHByb2Nlc3Nvcikge1xuICByZXR1cm4gZnVuY3Rpb24gKENvbnRleHQpIHtcbiAgICAoMCwgX2lzVmFsaWRIb29rQ29udGV4dDIuZGVmYXVsdCkocHJvY2Vzc29yKTtcblxuICAgIHJldHVybiBDb250ZXh0W19Db250ZXh0LlBVQkxJQ19DT05URVhUX0tFWV0oKTtcbiAgfTtcbn07XG5cbmV4cG9ydHMuZGVmYXVsdCA9IGNyZWF0ZVVzZUVsZW1lbnRIb29rOyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9mYXN0RGVlcEVxdWFsID0gcmVxdWlyZSgnZmFzdC1kZWVwLWVxdWFsJyk7XG5cbnZhciBfZmFzdERlZXBFcXVhbDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9mYXN0RGVlcEVxdWFsKTtcblxudmFyIF9pc1ZhbGlkSG9va0NvbnRleHQgPSByZXF1aXJlKCcuL3V0aWxzL2lzVmFsaWRIb29rQ29udGV4dCcpO1xuXG52YXIgX2lzVmFsaWRIb29rQ29udGV4dDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9pc1ZhbGlkSG9va0NvbnRleHQpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG4vKiBlc2xpbnQtZGlzYWJsZSBuby1yZXR1cm4tYXNzaWduICovXG52YXIgU3RvcmFnZSA9IHtcbiAgZWxlbWVudHM6IHt9LFxuICBnZXQ6IGZ1bmN0aW9uIGdldChlbGVtZW50KSB7XG4gICAgaWYgKHRoaXMuZWxlbWVudHNbZWxlbWVudC5pZF0pIHtcbiAgICAgIHJldHVybiB0aGlzLmVsZW1lbnRzW2VsZW1lbnQuaWRdO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5lbGVtZW50c1tlbGVtZW50LmlkXSA9IHsgZWZmZWN0czogW10sIGNvbnN1bWVyOiAwIH07XG4gIH0sXG4gIGNsZWFuVXA6IGZ1bmN0aW9uIGNsZWFuVXAoaWQpIHtcbiAgICBpZiAodGhpcy5lbGVtZW50c1tpZF0pIHtcbiAgICAgIGRlbGV0ZSB0aGlzLmVsZW1lbnRzW2lkXTtcbiAgICB9XG4gIH1cbn07XG5cbnZhciBjcmVhdGVFZmZlY3QgPSBmdW5jdGlvbiBjcmVhdGVFZmZlY3QoY2FsbGJhY2ssIGRlcHMpIHtcbiAgcmV0dXJuIHtcbiAgICBjYWxsYmFjazogY2FsbGJhY2ssXG4gICAgZGVwczogZGVwc1xuICB9O1xufTtcbnZhciB1cGRhdGVFZmZlY3QgPSBmdW5jdGlvbiB1cGRhdGVFZmZlY3QoZWZmZWN0LCBjYWxsYmFjaywgZGVwcykge1xuICBlZmZlY3QuY2FsbGJhY2sgPSBjYWxsYmFjaztcbiAgZWZmZWN0Lm9sZERlcHMgPSBlZmZlY3QuZGVwcztcbiAgZWZmZWN0LmRlcHMgPSBkZXBzO1xuICByZXR1cm4gZWZmZWN0O1xufTtcblxuZnVuY3Rpb24gZGVwc0VxdWFsKG9sZERlcHMsIG5ld0RlcHMpIHtcbiAgaWYgKCFvbGREZXBzKSByZXR1cm4gZmFsc2U7XG4gIGlmIChvbGREZXBzLmxlbmd0aCAhPT0gbmV3RGVwcy5sZW5ndGgpIHJldHVybiBmYWxzZTtcbiAgcmV0dXJuICgwLCBfZmFzdERlZXBFcXVhbDIuZGVmYXVsdCkob2xkRGVwcywgbmV3RGVwcyk7XG59XG5mdW5jdGlvbiByZXNvbHZlRWZmZWN0KG5vZGUsIGVmZmVjdCkge1xuICB2YXIgZGVwcyA9IGVmZmVjdC5kZXBzLFxuICAgICAgb2xkRGVwcyA9IGVmZmVjdC5vbGREZXBzLFxuICAgICAgY2FsbGJhY2sgPSBlZmZlY3QuY2FsbGJhY2s7XG5cblxuICBpZiAodHlwZW9mIGRlcHMgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgZWZmZWN0LmNsZWFuVXAgPSBjYWxsYmFjaygpO1xuICB9IGVsc2UgaWYgKGRlcHMubGVuZ3RoID09PSAwKSB7XG4gICAgaWYgKG5vZGUuZWxlbWVudC51c2VkKCkgPT09IDEpIHtcbiAgICAgIGVmZmVjdC5jbGVhblVwID0gY2FsbGJhY2soKTtcbiAgICAgIGlmIChfX0RFVl9fKSBub2RlLmxvZygndXNlRWZmZWN0OmZpcmVkJyk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHZhciBhcmVFcXVhbCA9IGRlcHNFcXVhbChvbGREZXBzLCBkZXBzKTtcblxuICAgIGlmICghYXJlRXF1YWwpIHtcbiAgICAgIGVmZmVjdC5jbGVhblVwID0gY2FsbGJhY2soKTtcbiAgICAgIGlmIChfX0RFVl9fKSBub2RlLmxvZygndXNlRWZmZWN0OmZpcmVkJyk7XG4gICAgfVxuICB9XG59XG5cbnZhciBjcmVhdGVVc2VFZmZlY3RIb29rID0gZnVuY3Rpb24gY3JlYXRlVXNlRWZmZWN0SG9vayhwcm9jZXNzb3IpIHtcbiAgcHJvY2Vzc29yLm9uTm9kZVJlbW92ZShmdW5jdGlvbiAobm9kZSkge1xuICAgIHZhciBlbGVtZW50ID0gbm9kZS5lbGVtZW50O1xuXG4gICAgdmFyIHN0b3JhZ2UgPSBTdG9yYWdlLmdldChlbGVtZW50KTtcblxuICAgIHN0b3JhZ2UuZWZmZWN0cy5mb3JFYWNoKGZ1bmN0aW9uIChlZmZlY3QpIHtcbiAgICAgIGlmIChlZmZlY3QuY2xlYW5VcCkge1xuICAgICAgICBlZmZlY3QuY2xlYW5VcCgpO1xuICAgICAgICBpZiAoX19ERVZfXykgbm9kZS5sb2coJ3VzZUVmZmVjdDpjbGVhblVwJyk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgU3RvcmFnZS5jbGVhblVwKG5vZGUuZWxlbWVudC5pZCk7XG4gIH0pO1xuICBwcm9jZXNzb3Iub25Ob2RlT3V0KGZ1bmN0aW9uIChub2RlKSB7XG4gICAgdmFyIGVsZW1lbnQgPSBub2RlLmVsZW1lbnQ7XG5cbiAgICB2YXIgc3RvcmFnZSA9IFN0b3JhZ2UuZ2V0KGVsZW1lbnQpO1xuXG4gICAgaWYgKHN0b3JhZ2UuZWZmZWN0cy5sZW5ndGggPiAwKSB7XG4gICAgICBzdG9yYWdlLmVmZmVjdHMuZm9yRWFjaChmdW5jdGlvbiAoZWZmZWN0KSB7XG4gICAgICAgIHJldHVybiByZXNvbHZlRWZmZWN0KG5vZGUsIGVmZmVjdCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gZnVuY3Rpb24gKGNhbGxiYWNrLCBkZXBzKSB7XG4gICAgKDAsIF9pc1ZhbGlkSG9va0NvbnRleHQyLmRlZmF1bHQpKHByb2Nlc3Nvcik7XG5cbiAgICB2YXIgbm9kZSA9IHByb2Nlc3Nvci5ub2RlKCk7XG4gICAgdmFyIGVsZW1lbnQgPSBub2RlLmVsZW1lbnQ7XG5cbiAgICB2YXIgc3RvcmFnZSA9IFN0b3JhZ2UuZ2V0KGVsZW1lbnQpO1xuXG4gICAgLy8gZmlyc3QgcnVuXG4gICAgaWYgKGVsZW1lbnQudXNlZCgpID09PSAwKSB7XG4gICAgICBzdG9yYWdlLmVmZmVjdHMucHVzaChjcmVhdGVFZmZlY3QoY2FsbGJhY2ssIGRlcHMpKTtcblxuICAgICAgLy8gb3RoZXIgcnVuc1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgaW5kZXggPSBzdG9yYWdlLmNvbnN1bWVyO1xuXG4gICAgICBzdG9yYWdlLmNvbnN1bWVyID0gaW5kZXggPCBzdG9yYWdlLmVmZmVjdHMubGVuZ3RoIC0gMSA/IHN0b3JhZ2UuY29uc3VtZXIgKyAxIDogMDtcbiAgICAgIHVwZGF0ZUVmZmVjdChzdG9yYWdlLmVmZmVjdHNbaW5kZXhdLCBjYWxsYmFjaywgZGVwcyk7XG4gICAgfVxuICB9O1xufTtcblxuZXhwb3J0cy5kZWZhdWx0ID0gY3JlYXRlVXNlRWZmZWN0SG9vaztcblxuXG5jcmVhdGVVc2VFZmZlY3RIb29rLmNsZWFyID0gZnVuY3Rpb24gKCkge1xuICBTdG9yYWdlLmVsZW1lbnRzID0ge307XG59OyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9pc1ZhbGlkSG9va0NvbnRleHQgPSByZXF1aXJlKCcuL3V0aWxzL2lzVmFsaWRIb29rQ29udGV4dCcpO1xuXG52YXIgX2lzVmFsaWRIb29rQ29udGV4dDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9pc1ZhbGlkSG9va0NvbnRleHQpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG52YXIgY3JlYXRlVXNlRWxlbWVudEhvb2sgPSBmdW5jdGlvbiBjcmVhdGVVc2VFbGVtZW50SG9vayhwcm9jZXNzb3IpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAoMCwgX2lzVmFsaWRIb29rQ29udGV4dDIuZGVmYXVsdCkocHJvY2Vzc29yKTtcblxuICAgIHJldHVybiBwcm9jZXNzb3Iubm9kZSgpLmVsZW1lbnQ7XG4gIH07XG59O1xuXG5leHBvcnRzLmRlZmF1bHQgPSBjcmVhdGVVc2VFbGVtZW50SG9vazsiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLmRlZmF1bHQgPSBjcmVhdGVVc2VQdWJTdWJIb29rO1xuXG52YXIgX2lzVmFsaWRIb29rQ29udGV4dCA9IHJlcXVpcmUoJy4vdXRpbHMvaXNWYWxpZEhvb2tDb250ZXh0Jyk7XG5cbnZhciBfaXNWYWxpZEhvb2tDb250ZXh0MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2lzVmFsaWRIb29rQ29udGV4dCk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbnZhciBzdWJzY3JpYmVycyA9IHt9O1xuXG52YXIgc3Vic2NyaWJlID0gZnVuY3Rpb24gc3Vic2NyaWJlKG5vZGUsIGVsZW1lbnQsIHR5cGUsIGNhbGxiYWNrKSB7XG4gIGlmICghc3Vic2NyaWJlcnNbdHlwZV0pIHN1YnNjcmliZXJzW3R5cGVdID0ge307XG4gIGlmIChfX0RFVl9fKSB7XG4gICAgaWYgKCFzdWJzY3JpYmVyc1t0eXBlXVtlbGVtZW50LmlkXSkge1xuICAgICAgbm9kZS5sb2coJ3VzZVB1YlN1YjpzdWJzY3JpYmUnLCB0eXBlKTtcbiAgICB9XG4gIH1cbiAgc3Vic2NyaWJlcnNbdHlwZV1bZWxlbWVudC5pZF0gPSBjYWxsYmFjaztcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoX19ERVZfXykge1xuICAgICAgbm9kZS5sb2coJ3VzZVB1YlN1Yjp1bnN1YnNjcmliZScsIHR5cGUpO1xuICAgIH1cbiAgICBkZWxldGUgc3Vic2NyaWJlcnNbdHlwZV1bZWxlbWVudC5pZF07XG4gIH07XG59O1xudmFyIHB1Ymxpc2ggPSBmdW5jdGlvbiBwdWJsaXNoKG5vZGUsIHR5cGUsIHBheWxvYWQpIHtcbiAgaWYgKCFzdWJzY3JpYmVyc1t0eXBlXSkgcmV0dXJuO1xuICBpZiAoX19ERVZfXykge1xuICAgIG5vZGUubG9nKCd1c2VQdWJTdWI6cHVibGlzaDonICsgdHlwZSwgcGF5bG9hZCk7XG4gIH1cbiAgT2JqZWN0LmtleXMoc3Vic2NyaWJlcnNbdHlwZV0pLmZvckVhY2goZnVuY3Rpb24gKGlkKSB7XG4gICAgc3Vic2NyaWJlcnNbdHlwZV1baWRdKHBheWxvYWQpO1xuICB9KTtcbn07XG5cbmZ1bmN0aW9uIGNyZWF0ZVVzZVB1YlN1Ykhvb2socHJvY2Vzc29yKSB7XG4gIHByb2Nlc3Nvci5vbk5vZGVSZW1vdmUoZnVuY3Rpb24gKG5vZGUpIHtcbiAgICBPYmplY3Qua2V5cyhzdWJzY3JpYmVycykuZm9yRWFjaChmdW5jdGlvbiAodHlwZSkge1xuICAgICAgaWYgKHN1YnNjcmliZXJzW3R5cGVdW25vZGUuZWxlbWVudC5pZF0pIHtcbiAgICAgICAgZGVsZXRlIHN1YnNjcmliZXJzW3R5cGVdW25vZGUuZWxlbWVudC5pZF07XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xuICByZXR1cm4gZnVuY3Rpb24gKHNjb3BlZEVsZW1lbnQpIHtcbiAgICAoMCwgX2lzVmFsaWRIb29rQ29udGV4dDIuZGVmYXVsdCkocHJvY2Vzc29yKTtcblxuICAgIHZhciBub2RlID0gcHJvY2Vzc29yLm5vZGUoKTtcbiAgICB2YXIgZWwgPSBzY29wZWRFbGVtZW50IHx8IG5vZGUuZWxlbWVudDtcbiAgICB2YXIgc3Vic2NyaWJlRnVuYyA9IGZ1bmN0aW9uIHN1YnNjcmliZUZ1bmMoKSB7XG4gICAgICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgcGFyYW1zID0gQXJyYXkoX2xlbiksIF9rZXkgPSAwOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgICAgIHBhcmFtc1tfa2V5XSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHN1YnNjcmliZS5hcHBseSh1bmRlZmluZWQsIFtub2RlLCBlbF0uY29uY2F0KHBhcmFtcykpO1xuICAgIH07XG4gICAgdmFyIHB1Ymxpc2hGdW5jID0gZnVuY3Rpb24gcHVibGlzaEZ1bmMoKSB7XG4gICAgICBmb3IgKHZhciBfbGVuMiA9IGFyZ3VtZW50cy5sZW5ndGgsIHBhcmFtcyA9IEFycmF5KF9sZW4yKSwgX2tleTIgPSAwOyBfa2V5MiA8IF9sZW4yOyBfa2V5MisrKSB7XG4gICAgICAgIHBhcmFtc1tfa2V5Ml0gPSBhcmd1bWVudHNbX2tleTJdO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcHVibGlzaC5hcHBseSh1bmRlZmluZWQsIFtub2RlXS5jb25jYXQocGFyYW1zKSk7XG4gICAgfTtcblxuICAgIHJldHVybiB7XG4gICAgICBzdWJzY3JpYmU6IHN1YnNjcmliZUZ1bmMsXG4gICAgICBwdWJsaXNoOiBwdWJsaXNoRnVuYyxcbiAgICAgIHN1YnNjcmliZXJzOiBzdWJzY3JpYmVyc1xuICAgIH07XG4gIH07XG59XG5cbmNyZWF0ZVVzZVB1YlN1Ykhvb2suY2xlYXIgPSBmdW5jdGlvbiAoKSB7XG4gIHN1YnNjcmliZXJzID0ge307XG59OyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9zbGljZWRUb0FycmF5ID0gZnVuY3Rpb24gKCkgeyBmdW5jdGlvbiBzbGljZUl0ZXJhdG9yKGFyciwgaSkgeyB2YXIgX2FyciA9IFtdOyB2YXIgX24gPSB0cnVlOyB2YXIgX2QgPSBmYWxzZTsgdmFyIF9lID0gdW5kZWZpbmVkOyB0cnkgeyBmb3IgKHZhciBfaSA9IGFycltTeW1ib2wuaXRlcmF0b3JdKCksIF9zOyAhKF9uID0gKF9zID0gX2kubmV4dCgpKS5kb25lKTsgX24gPSB0cnVlKSB7IF9hcnIucHVzaChfcy52YWx1ZSk7IGlmIChpICYmIF9hcnIubGVuZ3RoID09PSBpKSBicmVhazsgfSB9IGNhdGNoIChlcnIpIHsgX2QgPSB0cnVlOyBfZSA9IGVycjsgfSBmaW5hbGx5IHsgdHJ5IHsgaWYgKCFfbiAmJiBfaVtcInJldHVyblwiXSkgX2lbXCJyZXR1cm5cIl0oKTsgfSBmaW5hbGx5IHsgaWYgKF9kKSB0aHJvdyBfZTsgfSB9IHJldHVybiBfYXJyOyB9IHJldHVybiBmdW5jdGlvbiAoYXJyLCBpKSB7IGlmIChBcnJheS5pc0FycmF5KGFycikpIHsgcmV0dXJuIGFycjsgfSBlbHNlIGlmIChTeW1ib2wuaXRlcmF0b3IgaW4gT2JqZWN0KGFycikpIHsgcmV0dXJuIHNsaWNlSXRlcmF0b3IoYXJyLCBpKTsgfSBlbHNlIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkludmFsaWQgYXR0ZW1wdCB0byBkZXN0cnVjdHVyZSBub24taXRlcmFibGUgaW5zdGFuY2VcIik7IH0gfTsgfSgpO1xuXG5leHBvcnRzLmRlZmF1bHQgPSBjcmVhdGVVc2VSZWR1Y2VySG9vaztcblxudmFyIF9pc1ZhbGlkSG9va0NvbnRleHQgPSByZXF1aXJlKCcuL3V0aWxzL2lzVmFsaWRIb29rQ29udGV4dCcpO1xuXG52YXIgX2lzVmFsaWRIb29rQ29udGV4dDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9pc1ZhbGlkSG9va0NvbnRleHQpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG5mdW5jdGlvbiBfb2JqZWN0V2l0aG91dFByb3BlcnRpZXMob2JqLCBrZXlzKSB7IHZhciB0YXJnZXQgPSB7fTsgZm9yICh2YXIgaSBpbiBvYmopIHsgaWYgKGtleXMuaW5kZXhPZihpKSA+PSAwKSBjb250aW51ZTsgaWYgKCFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBpKSkgY29udGludWU7IHRhcmdldFtpXSA9IG9ialtpXTsgfSByZXR1cm4gdGFyZ2V0OyB9XG5cbmZ1bmN0aW9uIGNyZWF0ZURpc3BhdGNoRWxlbWVudChkaXNwYXRjaCkge1xuICByZXR1cm4gZnVuY3Rpb24gKF9yZWYpIHtcbiAgICB2YXIgYWN0aW9uID0gX3JlZi5hY3Rpb24sXG4gICAgICAgIHByb3BzVG9BY3Rpb24gPSBfcmVmLnByb3BzVG9BY3Rpb24sXG4gICAgICAgIHJlc3QgPSBfb2JqZWN0V2l0aG91dFByb3BlcnRpZXMoX3JlZiwgWydhY3Rpb24nLCAncHJvcHNUb0FjdGlvbiddKTtcblxuICAgIGlmIChhY3Rpb24pIHtcbiAgICAgIGRpc3BhdGNoKGFjdGlvbik7XG4gICAgfSBlbHNlIGlmIChwcm9wc1RvQWN0aW9uKSB7XG4gICAgICBkaXNwYXRjaChwcm9wc1RvQWN0aW9uKHJlc3QpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCc8RGlzcGF0Y2g+IGV4cGVjdHMgXCJhY3Rpb25cIiBvciBcInByb3BzVG9BY3Rpb25cIiBwcm9wLicpO1xuICAgIH1cbiAgfTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlVXNlUmVkdWNlckhvb2socHJvY2Vzc29yLCB1c2VTdGF0ZSkge1xuICByZXR1cm4gZnVuY3Rpb24gKHJlZHVjZXIsIGluaXRpYWxTdGF0ZSkge1xuICAgICgwLCBfaXNWYWxpZEhvb2tDb250ZXh0Mi5kZWZhdWx0KShwcm9jZXNzb3IpO1xuXG4gICAgdmFyIG5vZGUgPSBwcm9jZXNzb3Iubm9kZSgpO1xuXG4gICAgdmFyIF91c2VTdGF0ZSA9IHVzZVN0YXRlKGluaXRpYWxTdGF0ZSksXG4gICAgICAgIF91c2VTdGF0ZTIgPSBfc2xpY2VkVG9BcnJheShfdXNlU3RhdGUsIDIpLFxuICAgICAgICBzdGF0ZSA9IF91c2VTdGF0ZTJbMF0sXG4gICAgICAgIHNldFN0YXRlID0gX3VzZVN0YXRlMlsxXTtcblxuICAgIHZhciBkaXNwYXRjaCA9IGZ1bmN0aW9uIGRpc3BhdGNoKGFjdGlvbikge1xuICAgICAgaWYgKF9fREVWX18pIHtcbiAgICAgICAgbm9kZS5sb2coJ3VzZVJlZHVjZXI6ZGlzcGF0Y2gnLCBhY3Rpb24udHlwZSk7XG4gICAgICB9XG4gICAgICBzZXRTdGF0ZShyZWR1Y2VyKHN0YXRlKCksIGFjdGlvbikpO1xuICAgIH07XG5cbiAgICByZXR1cm4gW3N0YXRlLCBkaXNwYXRjaCwgY3JlYXRlRGlzcGF0Y2hFbGVtZW50KGRpc3BhdGNoKSwgLy8gPERpc3BhdGNoPlxuICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBzdGF0ZSgpO1xuICAgIH0gLy8gPEdldFN0YXRlPlxuICAgIF07XG4gIH07XG59IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gY3JlYXRlVXNlU3RhdGVIb29rO1xuXG52YXIgX2lzVmFsaWRIb29rQ29udGV4dCA9IHJlcXVpcmUoJy4vdXRpbHMvaXNWYWxpZEhvb2tDb250ZXh0Jyk7XG5cbnZhciBfaXNWYWxpZEhvb2tDb250ZXh0MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2lzVmFsaWRIb29rQ29udGV4dCk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbnZhciBTdG9yYWdlID0ge1xuICBlbGVtZW50czoge30sXG4gIGdldDogZnVuY3Rpb24gZ2V0KGVsZW1lbnQpIHtcbiAgICBpZiAodGhpcy5lbGVtZW50c1tlbGVtZW50LmlkXSkge1xuICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudHNbZWxlbWVudC5pZF07XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmVsZW1lbnRzW2VsZW1lbnQuaWRdID0geyBzdGF0ZXM6IFtdLCBjb25zdW1lcjogMCB9O1xuICB9LFxuICBjbGVhblVwOiBmdW5jdGlvbiBjbGVhblVwKGlkKSB7XG4gICAgaWYgKHRoaXMuZWxlbWVudHNbaWRdKSB7XG4gICAgICBkZWxldGUgdGhpcy5lbGVtZW50c1tpZF07XG4gICAgfVxuICB9XG59OyAvKiBlc2xpbnQtZGlzYWJsZSBuby1yZXR1cm4tYXNzaWduICovXG5mdW5jdGlvbiBjcmVhdGVVc2VTdGF0ZUhvb2socHJvY2Vzc29yKSB7XG4gIHByb2Nlc3Nvci5vbk5vZGVSZW1vdmUoZnVuY3Rpb24gKG5vZGUpIHtcbiAgICByZXR1cm4gU3RvcmFnZS5jbGVhblVwKG5vZGUuZWxlbWVudC5pZCk7XG4gIH0pO1xuICByZXR1cm4gZnVuY3Rpb24gKGluaXRpYWxTdGF0ZSkge1xuICAgICgwLCBfaXNWYWxpZEhvb2tDb250ZXh0Mi5kZWZhdWx0KShwcm9jZXNzb3IpO1xuXG4gICAgdmFyIG5vZGUgPSBwcm9jZXNzb3Iubm9kZSgpO1xuICAgIHZhciBlbGVtZW50ID0gbm9kZS5lbGVtZW50O1xuXG4gICAgdmFyIHN0b3JhZ2UgPSBTdG9yYWdlLmdldChlbGVtZW50KTtcblxuICAgIHZhciBpbmRleCA9IHZvaWQgMDtcblxuICAgIC8vIGZpcnN0IHJ1blxuICAgIGlmIChlbGVtZW50LnVzZWQoKSA9PT0gMCkge1xuICAgICAgc3RvcmFnZS5zdGF0ZXMucHVzaChpbml0aWFsU3RhdGUpO1xuICAgICAgaW5kZXggPSBzdG9yYWdlLnN0YXRlcy5sZW5ndGggLSAxO1xuXG4gICAgICAvLyBvdGhlciBydW5zXG4gICAgfSBlbHNlIHtcbiAgICAgIGluZGV4ID0gc3RvcmFnZS5jb25zdW1lcjtcbiAgICAgIHN0b3JhZ2UuY29uc3VtZXIgPSBpbmRleCA8IHN0b3JhZ2Uuc3RhdGVzLmxlbmd0aCAtIDEgPyBzdG9yYWdlLmNvbnN1bWVyICsgMSA6IDA7XG4gICAgfVxuICAgIGlmIChfX0RFVl9fKSBub2RlLmxvZygndXNlU3RhdGU6Y29uc3VtZWQnLCBzdG9yYWdlLnN0YXRlc1tpbmRleF0pO1xuXG4gICAgcmV0dXJuIFtmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gc3RvcmFnZS5zdGF0ZXNbaW5kZXhdO1xuICAgIH0sIGZ1bmN0aW9uIChuZXdTdGF0ZSkge1xuICAgICAgaWYgKF9fREVWX18pIG5vZGUubG9nKCd1c2VTdGF0ZTpzZXQnLCBuZXdTdGF0ZSk7XG4gICAgICBzdG9yYWdlLnN0YXRlc1tpbmRleF0gPSBuZXdTdGF0ZTtcbiAgICAgIGlmICghZWxlbWVudC5pc1J1bm5pbmcoKSkge1xuICAgICAgICBpZiAoX19ERVZfXykgbm9kZS5sb2coJ3VzZVN0YXRlOnJlcnVuJyk7XG4gICAgICAgIG5vZGUucmVydW4oKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBuZXdTdGF0ZTtcbiAgICB9XTtcbiAgfTtcbn1cblxuY3JlYXRlVXNlU3RhdGVIb29rLmNsZWFyID0gZnVuY3Rpb24gKCkge1xuICBTdG9yYWdlLmVsZW1lbnRzID0ge307XG59OyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuZGVmYXVsdCA9IGlzVmFsaWRIb29rQ29udGV4dDtcbmZ1bmN0aW9uIGlzVmFsaWRIb29rQ29udGV4dChwcm9jZXNzb3IpIHtcbiAgaWYgKCFwcm9jZXNzb3IpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1NvbWV0aGluZyB0ZXJyaWJseSB3cm9uZyBoYXBwZW5lZC4gVGhlIGhvb2sgZmFjdG9yeSBmdW5jdGlvbiBpcyBjYWxsZWQgd2l0aG91dCBhIHByb2Nlc3Nvci4nKTtcbiAgfVxuICBpZiAoIXByb2Nlc3Nvci5ub2RlKCkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0hvb2tzIG11c3QgYmUgY2FsbGVkIGluIHRoZSBjb250ZXh0IG9mIGFuIEFjdE1MIGVsZW1lbnQuJyk7XG4gIH1cbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5jcmVhdGVSdW50aW1lID0gY3JlYXRlUnVudGltZTtcblxudmFyIF9Qcm9jZXNzb3IgPSByZXF1aXJlKCcuL1Byb2Nlc3NvcicpO1xuXG52YXIgX1Byb2Nlc3NvcjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9Qcm9jZXNzb3IpO1xuXG52YXIgX2lzQWN0TUxFbGVtZW50ID0gcmVxdWlyZSgnLi91dGlscy9pc0FjdE1MRWxlbWVudCcpO1xuXG52YXIgX2lzQWN0TUxFbGVtZW50MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2lzQWN0TUxFbGVtZW50KTtcblxudmFyIF9BY3RFbGVtZW50ID0gcmVxdWlyZSgnLi9BY3RFbGVtZW50Jyk7XG5cbnZhciBfQWN0RWxlbWVudDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9BY3RFbGVtZW50KTtcblxudmFyIF91c2VFbGVtZW50ID0gcmVxdWlyZSgnLi9ob29rcy91c2VFbGVtZW50Jyk7XG5cbnZhciBfdXNlRWxlbWVudDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF91c2VFbGVtZW50KTtcblxudmFyIF91c2VQdWJTdWIgPSByZXF1aXJlKCcuL2hvb2tzL3VzZVB1YlN1YicpO1xuXG52YXIgX3VzZVB1YlN1YjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF91c2VQdWJTdWIpO1xuXG52YXIgX3VzZVN0YXRlID0gcmVxdWlyZSgnLi9ob29rcy91c2VTdGF0ZScpO1xuXG52YXIgX3VzZVN0YXRlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3VzZVN0YXRlKTtcblxudmFyIF91c2VSZWR1Y2VyID0gcmVxdWlyZSgnLi9ob29rcy91c2VSZWR1Y2VyJyk7XG5cbnZhciBfdXNlUmVkdWNlcjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF91c2VSZWR1Y2VyKTtcblxudmFyIF91c2VFZmZlY3QgPSByZXF1aXJlKCcuL2hvb2tzL3VzZUVmZmVjdCcpO1xuXG52YXIgX3VzZUVmZmVjdDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF91c2VFZmZlY3QpO1xuXG52YXIgX3VzZUNvbnRleHQgPSByZXF1aXJlKCcuL2hvb2tzL3VzZUNvbnRleHQnKTtcblxudmFyIF91c2VDb250ZXh0MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3VzZUNvbnRleHQpO1xuXG52YXIgX0NvbnRleHQgPSByZXF1aXJlKCcuL0NvbnRleHQnKTtcblxudmFyIF9Db250ZXh0MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX0NvbnRleHQpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG5mdW5jdGlvbiBjcmVhdGVSdW50aW1lKCkge1xuICB2YXIgcHJvY2Vzc29yID0gKDAsIF9Qcm9jZXNzb3IyLmRlZmF1bHQpKCk7XG5cbiAgZnVuY3Rpb24gQShmdW5jLCBwcm9wcykge1xuICAgIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBjaGlsZHJlbiA9IEFycmF5KF9sZW4gPiAyID8gX2xlbiAtIDIgOiAwKSwgX2tleSA9IDI7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICAgIGNoaWxkcmVuW19rZXkgLSAyXSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgICB9XG5cbiAgICByZXR1cm4gKDAsIF9BY3RFbGVtZW50Mi5kZWZhdWx0KShmdW5jLCBwcm9wcywgY2hpbGRyZW4pO1xuICB9XG4gIGZ1bmN0aW9uIHJ1bihlbGVtZW50KSB7XG4gICAgaWYgKCEoMCwgX2lzQWN0TUxFbGVtZW50Mi5kZWZhdWx0KShlbGVtZW50KSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdBY3RNTCBlbGVtZW50IGV4cGVjdGVkLiBJbnN0ZWFkICcgKyBlbGVtZW50LnRvU3RyaW5nKCkgKyAnIHBhc3NlZC4nKTtcbiAgICB9XG4gICAgcmV0dXJuIHByb2Nlc3Nvci5ydW4oZWxlbWVudCk7XG4gIH1cbiAgdmFyIEZyYWdtZW50ID0gZnVuY3Rpb24gRnJhZ21lbnQoX3JlZikge1xuICAgIHZhciBjaGlsZHJlbiA9IF9yZWYuY2hpbGRyZW47XG4gICAgcmV0dXJuIGNoaWxkcmVuO1xuICB9O1xuICB2YXIgdXNlRWxlbWVudCA9ICgwLCBfdXNlRWxlbWVudDIuZGVmYXVsdCkocHJvY2Vzc29yKTtcbiAgdmFyIHVzZVN0YXRlID0gKDAsIF91c2VTdGF0ZTIuZGVmYXVsdCkocHJvY2Vzc29yKTtcbiAgdmFyIHVzZVB1YlN1YiA9ICgwLCBfdXNlUHViU3ViMi5kZWZhdWx0KShwcm9jZXNzb3IpO1xuICB2YXIgdXNlUmVkdWNlciA9ICgwLCBfdXNlUmVkdWNlcjIuZGVmYXVsdCkocHJvY2Vzc29yLCB1c2VTdGF0ZSk7XG4gIHZhciB1c2VFZmZlY3QgPSAoMCwgX3VzZUVmZmVjdDIuZGVmYXVsdCkocHJvY2Vzc29yKTtcbiAgdmFyIHVzZUNvbnRleHQgPSAoMCwgX3VzZUNvbnRleHQyLmRlZmF1bHQpKHByb2Nlc3Nvcik7XG4gIHZhciBjcmVhdGVDb250ZXh0ID0gKDAsIF9Db250ZXh0Mi5kZWZhdWx0KShwcm9jZXNzb3IpO1xuXG4gIHJldHVybiB7XG4gICAgQTogQSxcbiAgICBydW46IHJ1bixcbiAgICBGcmFnbWVudDogRnJhZ21lbnQsXG4gICAgcHJvY2Vzc29yOiBwcm9jZXNzb3IsXG4gICAgdXNlRWxlbWVudDogdXNlRWxlbWVudCxcbiAgICB1c2VQdWJTdWI6IHVzZVB1YlN1YixcbiAgICB1c2VTdGF0ZTogdXNlU3RhdGUsXG4gICAgdXNlUmVkdWNlcjogdXNlUmVkdWNlcixcbiAgICB1c2VFZmZlY3Q6IHVzZUVmZmVjdCxcbiAgICB1c2VDb250ZXh0OiB1c2VDb250ZXh0LFxuICAgIGNyZWF0ZUNvbnRleHQ6IGNyZWF0ZUNvbnRleHRcbiAgfTtcbn1cblxudmFyIHJ1bnRpbWUgPSBjcmVhdGVSdW50aW1lKCk7XG5cbm1vZHVsZS5leHBvcnRzID0gcnVudGltZTtcbm1vZHVsZS5leHBvcnRzLmNyZWF0ZVJ1bnRpbWUgPSBjcmVhdGVSdW50aW1lKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLmRlZmF1bHQgPSBpc0FjdE1MRWxlbWVudDtcbmZ1bmN0aW9uIGlzQWN0TUxFbGVtZW50KGVsZW1lbnQpIHtcbiAgcmV0dXJuIGVsZW1lbnQgJiYgZWxlbWVudC5fX2FjdG1sID09PSB0cnVlO1xufTsiLCIndXNlIHN0cmljdCc7XG5cbnZhciBpc0FycmF5ID0gQXJyYXkuaXNBcnJheTtcbnZhciBrZXlMaXN0ID0gT2JqZWN0LmtleXM7XG52YXIgaGFzUHJvcCA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZXF1YWwoYSwgYikge1xuICBpZiAoYSA9PT0gYikgcmV0dXJuIHRydWU7XG5cbiAgaWYgKGEgJiYgYiAmJiB0eXBlb2YgYSA9PSAnb2JqZWN0JyAmJiB0eXBlb2YgYiA9PSAnb2JqZWN0Jykge1xuICAgIHZhciBhcnJBID0gaXNBcnJheShhKVxuICAgICAgLCBhcnJCID0gaXNBcnJheShiKVxuICAgICAgLCBpXG4gICAgICAsIGxlbmd0aFxuICAgICAgLCBrZXk7XG5cbiAgICBpZiAoYXJyQSAmJiBhcnJCKSB7XG4gICAgICBsZW5ndGggPSBhLmxlbmd0aDtcbiAgICAgIGlmIChsZW5ndGggIT0gYi5sZW5ndGgpIHJldHVybiBmYWxzZTtcbiAgICAgIGZvciAoaSA9IGxlbmd0aDsgaS0tICE9PSAwOylcbiAgICAgICAgaWYgKCFlcXVhbChhW2ldLCBiW2ldKSkgcmV0dXJuIGZhbHNlO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgaWYgKGFyckEgIT0gYXJyQikgcmV0dXJuIGZhbHNlO1xuXG4gICAgdmFyIGRhdGVBID0gYSBpbnN0YW5jZW9mIERhdGVcbiAgICAgICwgZGF0ZUIgPSBiIGluc3RhbmNlb2YgRGF0ZTtcbiAgICBpZiAoZGF0ZUEgIT0gZGF0ZUIpIHJldHVybiBmYWxzZTtcbiAgICBpZiAoZGF0ZUEgJiYgZGF0ZUIpIHJldHVybiBhLmdldFRpbWUoKSA9PSBiLmdldFRpbWUoKTtcblxuICAgIHZhciByZWdleHBBID0gYSBpbnN0YW5jZW9mIFJlZ0V4cFxuICAgICAgLCByZWdleHBCID0gYiBpbnN0YW5jZW9mIFJlZ0V4cDtcbiAgICBpZiAocmVnZXhwQSAhPSByZWdleHBCKSByZXR1cm4gZmFsc2U7XG4gICAgaWYgKHJlZ2V4cEEgJiYgcmVnZXhwQikgcmV0dXJuIGEudG9TdHJpbmcoKSA9PSBiLnRvU3RyaW5nKCk7XG5cbiAgICB2YXIga2V5cyA9IGtleUxpc3QoYSk7XG4gICAgbGVuZ3RoID0ga2V5cy5sZW5ndGg7XG5cbiAgICBpZiAobGVuZ3RoICE9PSBrZXlMaXN0KGIpLmxlbmd0aClcbiAgICAgIHJldHVybiBmYWxzZTtcblxuICAgIGZvciAoaSA9IGxlbmd0aDsgaS0tICE9PSAwOylcbiAgICAgIGlmICghaGFzUHJvcC5jYWxsKGIsIGtleXNbaV0pKSByZXR1cm4gZmFsc2U7XG5cbiAgICBmb3IgKGkgPSBsZW5ndGg7IGktLSAhPT0gMDspIHtcbiAgICAgIGtleSA9IGtleXNbaV07XG4gICAgICBpZiAoIWVxdWFsKGFba2V5XSwgYltrZXldKSkgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgcmV0dXJuIGEhPT1hICYmIGIhPT1iO1xufTtcbiIsImZ1bmN0aW9uIF9hcnJheVdpdGhIb2xlcyhhcnIpIHtcbiAgaWYgKEFycmF5LmlzQXJyYXkoYXJyKSkgcmV0dXJuIGFycjtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBfYXJyYXlXaXRoSG9sZXM7IiwiZnVuY3Rpb24gX2FycmF5V2l0aG91dEhvbGVzKGFycikge1xuICBpZiAoQXJyYXkuaXNBcnJheShhcnIpKSB7XG4gICAgZm9yICh2YXIgaSA9IDAsIGFycjIgPSBuZXcgQXJyYXkoYXJyLmxlbmd0aCk7IGkgPCBhcnIubGVuZ3RoOyBpKyspIHtcbiAgICAgIGFycjJbaV0gPSBhcnJbaV07XG4gICAgfVxuXG4gICAgcmV0dXJuIGFycjI7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBfYXJyYXlXaXRob3V0SG9sZXM7IiwiZnVuY3Rpb24gX2RlZmluZVByb3BlcnR5KG9iaiwga2V5LCB2YWx1ZSkge1xuICBpZiAoa2V5IGluIG9iaikge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwge1xuICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgIHdyaXRhYmxlOiB0cnVlXG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgb2JqW2tleV0gPSB2YWx1ZTtcbiAgfVxuXG4gIHJldHVybiBvYmo7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gX2RlZmluZVByb3BlcnR5OyIsImZ1bmN0aW9uIF9pdGVyYWJsZVRvQXJyYXkoaXRlcikge1xuICBpZiAoU3ltYm9sLml0ZXJhdG9yIGluIE9iamVjdChpdGVyKSB8fCBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoaXRlcikgPT09IFwiW29iamVjdCBBcmd1bWVudHNdXCIpIHJldHVybiBBcnJheS5mcm9tKGl0ZXIpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IF9pdGVyYWJsZVRvQXJyYXk7IiwiZnVuY3Rpb24gX2l0ZXJhYmxlVG9BcnJheUxpbWl0KGFyciwgaSkge1xuICB2YXIgX2FyciA9IFtdO1xuICB2YXIgX24gPSB0cnVlO1xuICB2YXIgX2QgPSBmYWxzZTtcbiAgdmFyIF9lID0gdW5kZWZpbmVkO1xuXG4gIHRyeSB7XG4gICAgZm9yICh2YXIgX2kgPSBhcnJbU3ltYm9sLml0ZXJhdG9yXSgpLCBfczsgIShfbiA9IChfcyA9IF9pLm5leHQoKSkuZG9uZSk7IF9uID0gdHJ1ZSkge1xuICAgICAgX2Fyci5wdXNoKF9zLnZhbHVlKTtcblxuICAgICAgaWYgKGkgJiYgX2Fyci5sZW5ndGggPT09IGkpIGJyZWFrO1xuICAgIH1cbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgX2QgPSB0cnVlO1xuICAgIF9lID0gZXJyO1xuICB9IGZpbmFsbHkge1xuICAgIHRyeSB7XG4gICAgICBpZiAoIV9uICYmIF9pW1wicmV0dXJuXCJdICE9IG51bGwpIF9pW1wicmV0dXJuXCJdKCk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIGlmIChfZCkgdGhyb3cgX2U7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIF9hcnI7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gX2l0ZXJhYmxlVG9BcnJheUxpbWl0OyIsImZ1bmN0aW9uIF9ub25JdGVyYWJsZVJlc3QoKSB7XG4gIHRocm93IG5ldyBUeXBlRXJyb3IoXCJJbnZhbGlkIGF0dGVtcHQgdG8gZGVzdHJ1Y3R1cmUgbm9uLWl0ZXJhYmxlIGluc3RhbmNlXCIpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IF9ub25JdGVyYWJsZVJlc3Q7IiwiZnVuY3Rpb24gX25vbkl0ZXJhYmxlU3ByZWFkKCkge1xuICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiSW52YWxpZCBhdHRlbXB0IHRvIHNwcmVhZCBub24taXRlcmFibGUgaW5zdGFuY2VcIik7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gX25vbkl0ZXJhYmxlU3ByZWFkOyIsInZhciBkZWZpbmVQcm9wZXJ0eSA9IHJlcXVpcmUoXCIuL2RlZmluZVByb3BlcnR5XCIpO1xuXG5mdW5jdGlvbiBfb2JqZWN0U3ByZWFkMih0YXJnZXQpIHtcbiAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoaSAlIDIpIHtcbiAgICAgIHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV0gIT0gbnVsbCA/IGFyZ3VtZW50c1tpXSA6IHt9O1xuICAgICAgdmFyIG93bktleXMgPSBPYmplY3Qua2V5cyhzb3VyY2UpO1xuXG4gICAgICBpZiAodHlwZW9mIE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgb3duS2V5cyA9IG93bktleXMuY29uY2F0KE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMoc291cmNlKS5maWx0ZXIoZnVuY3Rpb24gKHN5bSkge1xuICAgICAgICAgIHJldHVybiBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHNvdXJjZSwgc3ltKS5lbnVtZXJhYmxlO1xuICAgICAgICB9KSk7XG4gICAgICB9XG5cbiAgICAgIG93bktleXMuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgIGRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCBzb3VyY2Vba2V5XSk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyhhcmd1bWVudHNbaV0pKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGFyZ2V0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IF9vYmplY3RTcHJlYWQyOyIsInZhciBhcnJheVdpdGhIb2xlcyA9IHJlcXVpcmUoXCIuL2FycmF5V2l0aEhvbGVzXCIpO1xuXG52YXIgaXRlcmFibGVUb0FycmF5TGltaXQgPSByZXF1aXJlKFwiLi9pdGVyYWJsZVRvQXJyYXlMaW1pdFwiKTtcblxudmFyIG5vbkl0ZXJhYmxlUmVzdCA9IHJlcXVpcmUoXCIuL25vbkl0ZXJhYmxlUmVzdFwiKTtcblxuZnVuY3Rpb24gX3NsaWNlZFRvQXJyYXkoYXJyLCBpKSB7XG4gIHJldHVybiBhcnJheVdpdGhIb2xlcyhhcnIpIHx8IGl0ZXJhYmxlVG9BcnJheUxpbWl0KGFyciwgaSkgfHwgbm9uSXRlcmFibGVSZXN0KCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gX3NsaWNlZFRvQXJyYXk7IiwidmFyIGFycmF5V2l0aG91dEhvbGVzID0gcmVxdWlyZShcIi4vYXJyYXlXaXRob3V0SG9sZXNcIik7XG5cbnZhciBpdGVyYWJsZVRvQXJyYXkgPSByZXF1aXJlKFwiLi9pdGVyYWJsZVRvQXJyYXlcIik7XG5cbnZhciBub25JdGVyYWJsZVNwcmVhZCA9IHJlcXVpcmUoXCIuL25vbkl0ZXJhYmxlU3ByZWFkXCIpO1xuXG5mdW5jdGlvbiBfdG9Db25zdW1hYmxlQXJyYXkoYXJyKSB7XG4gIHJldHVybiBhcnJheVdpdGhvdXRIb2xlcyhhcnIpIHx8IGl0ZXJhYmxlVG9BcnJheShhcnIpIHx8IG5vbkl0ZXJhYmxlU3ByZWFkKCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gX3RvQ29uc3VtYWJsZUFycmF5OyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuZGVmYXVsdCA9IHNhbml0aXplO1xuXG52YXIgX0NpcmN1bGFySlNPTiA9IHJlcXVpcmUoJy4vdmVuZG9yL0NpcmN1bGFySlNPTicpO1xuXG52YXIgX0NpcmN1bGFySlNPTjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9DaXJjdWxhckpTT04pO1xuXG52YXIgX1NlcmlhbGl6ZUVycm9yID0gcmVxdWlyZSgnLi92ZW5kb3IvU2VyaWFsaXplRXJyb3InKTtcblxudmFyIF9TZXJpYWxpemVFcnJvcjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9TZXJpYWxpemVFcnJvcik7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbnZhciBzdHJpbmdpZnkgPSBfQ2lyY3VsYXJKU09OMi5kZWZhdWx0LnN0cmluZ2lmeTtcbmZ1bmN0aW9uIHNhbml0aXplKHNvbWV0aGluZykge1xuICB2YXIgc2hvd0Vycm9ySW5Db25zb2xlID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiBmYWxzZTtcblxuICB2YXIgcmVzdWx0O1xuXG4gIHRyeSB7XG4gICAgcmVzdWx0ID0gSlNPTi5wYXJzZShzdHJpbmdpZnkoc29tZXRoaW5nLCBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICByZXR1cm4gdmFsdWUubmFtZSA9PT0gJycgPyAnPGFub255bW91cz4nIDogJ2Z1bmN0aW9uICcgKyB2YWx1ZS5uYW1lICsgJygpJztcbiAgICAgIH1cbiAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgIHJldHVybiAoMCwgX1NlcmlhbGl6ZUVycm9yMi5kZWZhdWx0KSh2YWx1ZSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfSwgdW5kZWZpbmVkLCB0cnVlKSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgaWYgKHNob3dFcnJvckluQ29uc29sZSkge1xuICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgIH1cbiAgICByZXN1bHQgPSBudWxsO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX3R5cGVvZiA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09PSBcInN5bWJvbFwiID8gZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gdHlwZW9mIG9iajsgfSA6IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgJiYgb2JqICE9PSBTeW1ib2wucHJvdG90eXBlID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7IH07XG5cbi8qIGVzbGludC1kaXNhYmxlICovXG4vKiFcbkNvcHlyaWdodCAoQykgMjAxMy0yMDE3IGJ5IEFuZHJlYSBHaWFtbWFyY2hpIC0gQFdlYlJlZmxlY3Rpb25cblxuUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxub2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xudG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG5mdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuXG5UaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG5cblRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbklNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG5BVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG5MSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuVEhFIFNPRlRXQVJFLlxuXG4qL1xudmFyXG4vLyBzaG91bGQgYmUgYSBub3Qgc28gY29tbW9uIGNoYXJcbi8vIHBvc3NpYmx5IG9uZSBKU09OIGRvZXMgbm90IGVuY29kZVxuLy8gcG9zc2libHkgb25lIGVuY29kZVVSSUNvbXBvbmVudCBkb2VzIG5vdCBlbmNvZGVcbi8vIHJpZ2h0IG5vdyB0aGlzIGNoYXIgaXMgJ34nIGJ1dCB0aGlzIG1pZ2h0IGNoYW5nZSBpbiB0aGUgZnV0dXJlXG5zcGVjaWFsQ2hhciA9ICd+JyxcbiAgICBzYWZlU3BlY2lhbENoYXIgPSAnXFxcXHgnICsgKCcwJyArIHNwZWNpYWxDaGFyLmNoYXJDb2RlQXQoMCkudG9TdHJpbmcoMTYpKS5zbGljZSgtMiksXG4gICAgZXNjYXBlZFNhZmVTcGVjaWFsQ2hhciA9ICdcXFxcJyArIHNhZmVTcGVjaWFsQ2hhcixcbiAgICBzcGVjaWFsQ2hhclJHID0gbmV3IFJlZ0V4cChzYWZlU3BlY2lhbENoYXIsICdnJyksXG4gICAgc2FmZVNwZWNpYWxDaGFyUkcgPSBuZXcgUmVnRXhwKGVzY2FwZWRTYWZlU3BlY2lhbENoYXIsICdnJyksXG4gICAgc2FmZVN0YXJ0V2l0aFNwZWNpYWxDaGFyUkcgPSBuZXcgUmVnRXhwKCcoPzpefChbXlxcXFxcXFxcXSkpJyArIGVzY2FwZWRTYWZlU3BlY2lhbENoYXIpLFxuICAgIGluZGV4T2YgPSBbXS5pbmRleE9mIHx8IGZ1bmN0aW9uICh2KSB7XG4gIGZvciAodmFyIGkgPSB0aGlzLmxlbmd0aDsgaS0tICYmIHRoaXNbaV0gIT09IHY7KSB7fVxuICByZXR1cm4gaTtcbn0sXG4gICAgJFN0cmluZyA9IFN0cmluZyAvLyB0aGVyZSdzIG5vIHdheSB0byBkcm9wIHdhcm5pbmdzIGluIEpTSGludFxuLy8gYWJvdXQgbmV3IFN0cmluZyAuLi4gd2VsbCwgSSBuZWVkIHRoYXQgaGVyZSFcbi8vIGZha2VkLCBhbmQgaGFwcHkgbGludGVyIVxuO1xuXG5mdW5jdGlvbiBnZW5lcmF0ZVJlcGxhY2VyKHZhbHVlLCByZXBsYWNlciwgcmVzb2x2ZSkge1xuICB2YXIgaW5zcGVjdCA9ICEhcmVwbGFjZXIsXG4gICAgICBwYXRoID0gW10sXG4gICAgICBhbGwgPSBbdmFsdWVdLFxuICAgICAgc2VlbiA9IFt2YWx1ZV0sXG4gICAgICBtYXBwID0gW3Jlc29sdmUgPyBzcGVjaWFsQ2hhciA6ICc8Y2lyY3VsYXI+J10sXG4gICAgICBsYXN0ID0gdmFsdWUsXG4gICAgICBsdmwgPSAxLFxuICAgICAgaSxcbiAgICAgIGZuO1xuICBpZiAoaW5zcGVjdCkge1xuICAgIGZuID0gKHR5cGVvZiByZXBsYWNlciA9PT0gJ3VuZGVmaW5lZCcgPyAndW5kZWZpbmVkJyA6IF90eXBlb2YocmVwbGFjZXIpKSA9PT0gJ29iamVjdCcgPyBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICAgICAgcmV0dXJuIGtleSAhPT0gJycgJiYgcmVwbGFjZXIuaW5kZXhPZihrZXkpIDwgMCA/IHZvaWQgMCA6IHZhbHVlO1xuICAgIH0gOiByZXBsYWNlcjtcbiAgfVxuICByZXR1cm4gZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbiAgICAvLyB0aGUgcmVwbGFjZXIgaGFzIHJpZ2h0cyB0byBkZWNpZGVcbiAgICAvLyBpZiBhIG5ldyBvYmplY3Qgc2hvdWxkIGJlIHJldHVybmVkXG4gICAgLy8gb3IgaWYgdGhlcmUncyBzb21lIGtleSB0byBkcm9wXG4gICAgLy8gbGV0J3MgY2FsbCBpdCBoZXJlIHJhdGhlciB0aGFuIFwidG9vIGxhdGVcIlxuICAgIGlmIChpbnNwZWN0KSB2YWx1ZSA9IGZuLmNhbGwodGhpcywga2V5LCB2YWx1ZSk7XG5cbiAgICAvLyBkaWQgeW91IGtub3cgPyBTYWZhcmkgcGFzc2VzIGtleXMgYXMgaW50ZWdlcnMgZm9yIGFycmF5c1xuICAgIC8vIHdoaWNoIG1lYW5zIGlmIChrZXkpIHdoZW4ga2V5ID09PSAwIHdvbid0IHBhc3MgdGhlIGNoZWNrXG4gICAgaWYgKGtleSAhPT0gJycpIHtcbiAgICAgIGlmIChsYXN0ICE9PSB0aGlzKSB7XG4gICAgICAgIGkgPSBsdmwgLSBpbmRleE9mLmNhbGwoYWxsLCB0aGlzKSAtIDE7XG4gICAgICAgIGx2bCAtPSBpO1xuICAgICAgICBhbGwuc3BsaWNlKGx2bCwgYWxsLmxlbmd0aCk7XG4gICAgICAgIHBhdGguc3BsaWNlKGx2bCAtIDEsIHBhdGgubGVuZ3RoKTtcbiAgICAgICAgbGFzdCA9IHRoaXM7XG4gICAgICB9XG4gICAgICAvLyBjb25zb2xlLmxvZyhsdmwsIGtleSwgcGF0aCk7XG4gICAgICBpZiAoKHR5cGVvZiB2YWx1ZSA9PT0gJ3VuZGVmaW5lZCcgPyAndW5kZWZpbmVkJyA6IF90eXBlb2YodmFsdWUpKSA9PT0gJ29iamVjdCcgJiYgdmFsdWUpIHtcbiAgICAgICAgLy8gaWYgb2JqZWN0IGlzbid0IHJlZmVycmluZyB0byBwYXJlbnQgb2JqZWN0LCBhZGQgdG8gdGhlXG4gICAgICAgIC8vIG9iamVjdCBwYXRoIHN0YWNrLiBPdGhlcndpc2UgaXQgaXMgYWxyZWFkeSB0aGVyZS5cbiAgICAgICAgaWYgKGluZGV4T2YuY2FsbChhbGwsIHZhbHVlKSA8IDApIHtcbiAgICAgICAgICBhbGwucHVzaChsYXN0ID0gdmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIGx2bCA9IGFsbC5sZW5ndGg7XG4gICAgICAgIGkgPSBpbmRleE9mLmNhbGwoc2VlbiwgdmFsdWUpO1xuICAgICAgICBpZiAoaSA8IDApIHtcbiAgICAgICAgICBpID0gc2Vlbi5wdXNoKHZhbHVlKSAtIDE7XG4gICAgICAgICAgaWYgKHJlc29sdmUpIHtcbiAgICAgICAgICAgIC8vIGtleSBjYW5ub3QgY29udGFpbiBzcGVjaWFsQ2hhciBidXQgY291bGQgYmUgbm90IGEgc3RyaW5nXG4gICAgICAgICAgICBwYXRoLnB1c2goKCcnICsga2V5KS5yZXBsYWNlKHNwZWNpYWxDaGFyUkcsIHNhZmVTcGVjaWFsQ2hhcikpO1xuICAgICAgICAgICAgbWFwcFtpXSA9IHNwZWNpYWxDaGFyICsgcGF0aC5qb2luKHNwZWNpYWxDaGFyKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbWFwcFtpXSA9IG1hcHBbMF07XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhbHVlID0gbWFwcFtpXTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgJiYgcmVzb2x2ZSkge1xuICAgICAgICAgIC8vIGVuc3VyZSBubyBzcGVjaWFsIGNoYXIgaW52b2x2ZWQgb24gZGVzZXJpYWxpemF0aW9uXG4gICAgICAgICAgLy8gaW4gdGhpcyBjYXNlIG9ubHkgZmlyc3QgY2hhciBpcyBpbXBvcnRhbnRcbiAgICAgICAgICAvLyBubyBuZWVkIHRvIHJlcGxhY2UgYWxsIHZhbHVlIChiZXR0ZXIgcGVyZm9ybWFuY2UpXG4gICAgICAgICAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKHNhZmVTcGVjaWFsQ2hhciwgZXNjYXBlZFNhZmVTcGVjaWFsQ2hhcikucmVwbGFjZShzcGVjaWFsQ2hhciwgc2FmZVNwZWNpYWxDaGFyKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdmFsdWU7XG4gIH07XG59XG5cbmZ1bmN0aW9uIHJldHJpZXZlRnJvbVBhdGgoY3VycmVudCwga2V5cykge1xuICBmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0ga2V5cy5sZW5ndGg7IGkgPCBsZW5ndGg7IGN1cnJlbnQgPSBjdXJyZW50W1xuICAvLyBrZXlzIHNob3VsZCBiZSBub3JtYWxpemVkIGJhY2sgaGVyZVxuICBrZXlzW2krK10ucmVwbGFjZShzYWZlU3BlY2lhbENoYXJSRywgc3BlY2lhbENoYXIpXSkge31cbiAgcmV0dXJuIGN1cnJlbnQ7XG59XG5cbmZ1bmN0aW9uIGdlbmVyYXRlUmV2aXZlcihyZXZpdmVyKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICAgIHZhciBpc1N0cmluZyA9IHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZyc7XG4gICAgaWYgKGlzU3RyaW5nICYmIHZhbHVlLmNoYXJBdCgwKSA9PT0gc3BlY2lhbENoYXIpIHtcbiAgICAgIHJldHVybiBuZXcgJFN0cmluZyh2YWx1ZS5zbGljZSgxKSk7XG4gICAgfVxuICAgIGlmIChrZXkgPT09ICcnKSB2YWx1ZSA9IHJlZ2VuZXJhdGUodmFsdWUsIHZhbHVlLCB7fSk7XG4gICAgLy8gYWdhaW4sIG9ubHkgb25lIG5lZWRlZCwgZG8gbm90IHVzZSB0aGUgUmVnRXhwIGZvciB0aGlzIHJlcGxhY2VtZW50XG4gICAgLy8gb25seSBrZXlzIG5lZWQgdGhlIFJlZ0V4cFxuICAgIGlmIChpc1N0cmluZykgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKHNhZmVTdGFydFdpdGhTcGVjaWFsQ2hhclJHLCAnJDEnICsgc3BlY2lhbENoYXIpLnJlcGxhY2UoZXNjYXBlZFNhZmVTcGVjaWFsQ2hhciwgc2FmZVNwZWNpYWxDaGFyKTtcbiAgICByZXR1cm4gcmV2aXZlciA/IHJldml2ZXIuY2FsbCh0aGlzLCBrZXksIHZhbHVlKSA6IHZhbHVlO1xuICB9O1xufVxuXG5mdW5jdGlvbiByZWdlbmVyYXRlQXJyYXkocm9vdCwgY3VycmVudCwgcmV0cmlldmUpIHtcbiAgZm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IGN1cnJlbnQubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICBjdXJyZW50W2ldID0gcmVnZW5lcmF0ZShyb290LCBjdXJyZW50W2ldLCByZXRyaWV2ZSk7XG4gIH1cbiAgcmV0dXJuIGN1cnJlbnQ7XG59XG5cbmZ1bmN0aW9uIHJlZ2VuZXJhdGVPYmplY3Qocm9vdCwgY3VycmVudCwgcmV0cmlldmUpIHtcbiAgZm9yICh2YXIga2V5IGluIGN1cnJlbnQpIHtcbiAgICBpZiAoY3VycmVudC5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICBjdXJyZW50W2tleV0gPSByZWdlbmVyYXRlKHJvb3QsIGN1cnJlbnRba2V5XSwgcmV0cmlldmUpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gY3VycmVudDtcbn1cblxuZnVuY3Rpb24gcmVnZW5lcmF0ZShyb290LCBjdXJyZW50LCByZXRyaWV2ZSkge1xuICByZXR1cm4gY3VycmVudCBpbnN0YW5jZW9mIEFycmF5ID9cbiAgLy8gZmFzdCBBcnJheSByZWNvbnN0cnVjdGlvblxuICByZWdlbmVyYXRlQXJyYXkocm9vdCwgY3VycmVudCwgcmV0cmlldmUpIDogY3VycmVudCBpbnN0YW5jZW9mICRTdHJpbmcgP1xuICAvLyByb290IGlzIGFuIGVtcHR5IHN0cmluZ1xuICBjdXJyZW50Lmxlbmd0aCA/IHJldHJpZXZlLmhhc093blByb3BlcnR5KGN1cnJlbnQpID8gcmV0cmlldmVbY3VycmVudF0gOiByZXRyaWV2ZVtjdXJyZW50XSA9IHJldHJpZXZlRnJvbVBhdGgocm9vdCwgY3VycmVudC5zcGxpdChzcGVjaWFsQ2hhcikpIDogcm9vdCA6IGN1cnJlbnQgaW5zdGFuY2VvZiBPYmplY3QgP1xuICAvLyBkZWRpY2F0ZWQgT2JqZWN0IHBhcnNlclxuICByZWdlbmVyYXRlT2JqZWN0KHJvb3QsIGN1cnJlbnQsIHJldHJpZXZlKSA6XG4gIC8vIHZhbHVlIGFzIGl0IGlzXG4gIGN1cnJlbnQ7XG59XG5cbmZ1bmN0aW9uIHN0cmluZ2lmeVJlY3Vyc2lvbih2YWx1ZSwgcmVwbGFjZXIsIHNwYWNlLCBkb05vdFJlc29sdmUpIHtcbiAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHZhbHVlLCBnZW5lcmF0ZVJlcGxhY2VyKHZhbHVlLCByZXBsYWNlciwgIWRvTm90UmVzb2x2ZSksIHNwYWNlKTtcbn1cblxuZnVuY3Rpb24gcGFyc2VSZWN1cnNpb24odGV4dCwgcmV2aXZlcikge1xuICByZXR1cm4gSlNPTi5wYXJzZSh0ZXh0LCBnZW5lcmF0ZVJldml2ZXIocmV2aXZlcikpO1xufVxuXG5leHBvcnRzLmRlZmF1bHQgPSB7XG4gIHN0cmluZ2lmeTogc3RyaW5naWZ5UmVjdXJzaW9uLFxuICBwYXJzZTogcGFyc2VSZWN1cnNpb25cbn07IiwiLyogZXNsaW50LWRpc2FibGUgKi9cbi8vIENyZWRpdHM6IGh0dHBzOi8vZ2l0aHViLmNvbS9zaW5kcmVzb3JodXMvc2VyaWFsaXplLWVycm9yXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIF90eXBlb2YgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIFN5bWJvbC5pdGVyYXRvciA9PT0gXCJzeW1ib2xcIiA/IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIHR5cGVvZiBvYmo7IH0gOiBmdW5jdGlvbiAob2JqKSB7IHJldHVybiBvYmogJiYgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gU3ltYm9sICYmIG9iaiAhPT0gU3ltYm9sLnByb3RvdHlwZSA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqOyB9O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuXHRpZiAoKHR5cGVvZiB2YWx1ZSA9PT0gJ3VuZGVmaW5lZCcgPyAndW5kZWZpbmVkJyA6IF90eXBlb2YodmFsdWUpKSA9PT0gJ29iamVjdCcpIHtcblx0XHRyZXR1cm4gZGVzdHJveUNpcmN1bGFyKHZhbHVlLCBbXSk7XG5cdH1cblxuXHQvLyBQZW9wbGUgc29tZXRpbWVzIHRocm93IHRoaW5ncyBiZXNpZGVzIEVycm9yIG9iamVjdHMsIHNv4oCmXG5cblx0aWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdC8vIEpTT04uc3RyaW5naWZ5IGRpc2NhcmRzIGZ1bmN0aW9ucy4gV2UgZG8gdG9vLCB1bmxlc3MgYSBmdW5jdGlvbiBpcyB0aHJvd24gZGlyZWN0bHkuXG5cdFx0cmV0dXJuICdbRnVuY3Rpb246ICcgKyAodmFsdWUubmFtZSB8fCAnYW5vbnltb3VzJykgKyAnXSc7XG5cdH1cblxuXHRyZXR1cm4gdmFsdWU7XG59O1xuXG4vLyBodHRwczovL3d3dy5ucG1qcy5jb20vcGFja2FnZS9kZXN0cm95LWNpcmN1bGFyXG5mdW5jdGlvbiBkZXN0cm95Q2lyY3VsYXIoZnJvbSwgc2Vlbikge1xuXHR2YXIgdG8gPSBBcnJheS5pc0FycmF5KGZyb20pID8gW10gOiB7fTtcblxuXHRzZWVuLnB1c2goZnJvbSk7XG5cblx0dmFyIF9pdGVyYXRvck5vcm1hbENvbXBsZXRpb24gPSB0cnVlO1xuXHR2YXIgX2RpZEl0ZXJhdG9yRXJyb3IgPSBmYWxzZTtcblx0dmFyIF9pdGVyYXRvckVycm9yID0gdW5kZWZpbmVkO1xuXG5cdHRyeSB7XG5cdFx0Zm9yICh2YXIgX2l0ZXJhdG9yID0gT2JqZWN0LmtleXMoZnJvbSlbU3ltYm9sLml0ZXJhdG9yXSgpLCBfc3RlcDsgIShfaXRlcmF0b3JOb3JtYWxDb21wbGV0aW9uID0gKF9zdGVwID0gX2l0ZXJhdG9yLm5leHQoKSkuZG9uZSk7IF9pdGVyYXRvck5vcm1hbENvbXBsZXRpb24gPSB0cnVlKSB7XG5cdFx0XHR2YXIga2V5ID0gX3N0ZXAudmFsdWU7XG5cblx0XHRcdHZhciB2YWx1ZSA9IGZyb21ba2V5XTtcblxuXHRcdFx0aWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0XHRjb250aW51ZTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCF2YWx1ZSB8fCAodHlwZW9mIHZhbHVlID09PSAndW5kZWZpbmVkJyA/ICd1bmRlZmluZWQnIDogX3R5cGVvZih2YWx1ZSkpICE9PSAnb2JqZWN0Jykge1xuXHRcdFx0XHR0b1trZXldID0gdmFsdWU7XG5cdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoc2Vlbi5pbmRleE9mKGZyb21ba2V5XSkgPT09IC0xKSB7XG5cdFx0XHRcdHRvW2tleV0gPSBkZXN0cm95Q2lyY3VsYXIoZnJvbVtrZXldLCBzZWVuLnNsaWNlKDApKTtcblx0XHRcdFx0Y29udGludWU7XG5cdFx0XHR9XG5cblx0XHRcdHRvW2tleV0gPSAnW0NpcmN1bGFyXSc7XG5cdFx0fVxuXHR9IGNhdGNoIChlcnIpIHtcblx0XHRfZGlkSXRlcmF0b3JFcnJvciA9IHRydWU7XG5cdFx0X2l0ZXJhdG9yRXJyb3IgPSBlcnI7XG5cdH0gZmluYWxseSB7XG5cdFx0dHJ5IHtcblx0XHRcdGlmICghX2l0ZXJhdG9yTm9ybWFsQ29tcGxldGlvbiAmJiBfaXRlcmF0b3IucmV0dXJuKSB7XG5cdFx0XHRcdF9pdGVyYXRvci5yZXR1cm4oKTtcblx0XHRcdH1cblx0XHR9IGZpbmFsbHkge1xuXHRcdFx0aWYgKF9kaWRJdGVyYXRvckVycm9yKSB7XG5cdFx0XHRcdHRocm93IF9pdGVyYXRvckVycm9yO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdGlmICh0eXBlb2YgZnJvbS5uYW1lID09PSAnc3RyaW5nJykge1xuXHRcdHRvLm5hbWUgPSBmcm9tLm5hbWU7XG5cdH1cblxuXHRpZiAodHlwZW9mIGZyb20ubWVzc2FnZSA9PT0gJ3N0cmluZycpIHtcblx0XHR0by5tZXNzYWdlID0gZnJvbS5tZXNzYWdlO1xuXHR9XG5cblx0aWYgKHR5cGVvZiBmcm9tLnN0YWNrID09PSAnc3RyaW5nJykge1xuXHRcdHRvLnN0YWNrID0gZnJvbS5zdGFjaztcblx0fVxuXG5cdHJldHVybiB0bztcbn0iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfc2xpY2VkVG9BcnJheSA9IGZ1bmN0aW9uICgpIHsgZnVuY3Rpb24gc2xpY2VJdGVyYXRvcihhcnIsIGkpIHsgdmFyIF9hcnIgPSBbXTsgdmFyIF9uID0gdHJ1ZTsgdmFyIF9kID0gZmFsc2U7IHZhciBfZSA9IHVuZGVmaW5lZDsgdHJ5IHsgZm9yICh2YXIgX2kgPSBhcnJbU3ltYm9sLml0ZXJhdG9yXSgpLCBfczsgIShfbiA9IChfcyA9IF9pLm5leHQoKSkuZG9uZSk7IF9uID0gdHJ1ZSkgeyBfYXJyLnB1c2goX3MudmFsdWUpOyBpZiAoaSAmJiBfYXJyLmxlbmd0aCA9PT0gaSkgYnJlYWs7IH0gfSBjYXRjaCAoZXJyKSB7IF9kID0gdHJ1ZTsgX2UgPSBlcnI7IH0gZmluYWxseSB7IHRyeSB7IGlmICghX24gJiYgX2lbXCJyZXR1cm5cIl0pIF9pW1wicmV0dXJuXCJdKCk7IH0gZmluYWxseSB7IGlmIChfZCkgdGhyb3cgX2U7IH0gfSByZXR1cm4gX2FycjsgfSByZXR1cm4gZnVuY3Rpb24gKGFyciwgaSkgeyBpZiAoQXJyYXkuaXNBcnJheShhcnIpKSB7IHJldHVybiBhcnI7IH0gZWxzZSBpZiAoU3ltYm9sLml0ZXJhdG9yIGluIE9iamVjdChhcnIpKSB7IHJldHVybiBzbGljZUl0ZXJhdG9yKGFyciwgaSk7IH0gZWxzZSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJJbnZhbGlkIGF0dGVtcHQgdG8gZGVzdHJ1Y3R1cmUgbm9uLWl0ZXJhYmxlIGluc3RhbmNlXCIpOyB9IH07IH0oKTtcblxudmFyIF90eXBlb2YgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIFN5bWJvbC5pdGVyYXRvciA9PT0gXCJzeW1ib2xcIiA/IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIHR5cGVvZiBvYmo7IH0gOiBmdW5jdGlvbiAob2JqKSB7IHJldHVybiBvYmogJiYgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gU3ltYm9sICYmIG9iaiAhPT0gU3ltYm9sLnByb3RvdHlwZSA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqOyB9O1xuXG52YXIgX3Nhbml0aXplID0gcmVxdWlyZSgnLi9oZWxwZXJzL3Nhbml0aXplJyk7XG5cbnZhciBfc2FuaXRpemUyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfc2FuaXRpemUpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG5mdW5jdGlvbiBfdG9BcnJheShhcnIpIHsgcmV0dXJuIEFycmF5LmlzQXJyYXkoYXJyKSA/IGFyciA6IEFycmF5LmZyb20oYXJyKTsgfVxuXG5mdW5jdGlvbiBfdG9Db25zdW1hYmxlQXJyYXkoYXJyKSB7IGlmIChBcnJheS5pc0FycmF5KGFycikpIHsgZm9yICh2YXIgaSA9IDAsIGFycjIgPSBBcnJheShhcnIubGVuZ3RoKTsgaSA8IGFyci5sZW5ndGg7IGkrKykgeyBhcnIyW2ldID0gYXJyW2ldOyB9IHJldHVybiBhcnIyOyB9IGVsc2UgeyByZXR1cm4gQXJyYXkuZnJvbShhcnIpOyB9IH1cblxudmFyIElOID0gJ0lOJztcbnZhciBPVVQgPSAnT1VUJztcbnZhciBSRU1PVkUgPSAnUkVNT1ZFJztcblxudmFyIGlzUnVubmluZ0luTm9kZSA9IHR5cGVvZiBwcm9jZXNzICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgcHJvY2Vzcy5yZWxlYXNlICE9PSAndW5kZWZpbmVkJyAmJiBwcm9jZXNzLnJlbGVhc2UubmFtZSA9PT0gJ25vZGUnO1xuXG52YXIgdHJpbSA9IGZ1bmN0aW9uIHRyaW0oc3RyLCBsZW4pIHtcbiAgdmFyIGVtcCA9IGFyZ3VtZW50cy5sZW5ndGggPiAyICYmIGFyZ3VtZW50c1syXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzJdIDogJy4uLic7XG4gIHJldHVybiBzdHIubGVuZ3RoID4gbGVuID8gc3RyLnN1YnN0cigwLCBsZW4pICsgZW1wIDogc3RyO1xufTtcbnZhciBnZXRJbmRNYXJnaW4gPSBmdW5jdGlvbiBnZXRJbmRNYXJnaW4oaW5kKSB7XG4gIHJldHVybiAnbWFyZ2luLWxlZnQ6ICcgKyBpbmQgKiAyMCArICdweDsnO1xufTtcbnZhciBnZXRJbmRTcGFjZXMgPSBmdW5jdGlvbiBnZXRJbmRTcGFjZXMoaW5kKSB7XG4gIHJldHVybiBbXS5jb25jYXQoX3RvQ29uc3VtYWJsZUFycmF5KEFycmF5KGluZCAqIDIpLmtleXMoKSkpLm1hcChmdW5jdGlvbiAoeCkge1xuICAgIHJldHVybiAnICc7XG4gIH0pLmpvaW4oJycpO1xufTtcbnZhciBwYXJzZUxvZ01ldGEgPSBmdW5jdGlvbiBwYXJzZUxvZ01ldGEobWV0YSkge1xuICBpZiAodHlwZW9mIG1ldGEgPT09ICd1bmRlZmluZWQnKSByZXR1cm4gJyc7XG4gIGlmICh0eXBlb2YgbWV0YSA9PT0gJ3N0cmluZycgfHwgdHlwZW9mIG1ldGEgPT09ICdib29sZWFuJyB8fCB0eXBlb2YgbWV0YSA9PT0gJ251bWJlcicpIHtcbiAgICByZXR1cm4gJygnICsgSlNPTi5zdHJpbmdpZnkobWV0YSkgKyAnKSc7XG4gIH1cbiAgaWYgKCh0eXBlb2YgbWV0YSA9PT0gJ3VuZGVmaW5lZCcgPyAndW5kZWZpbmVkJyA6IF90eXBlb2YobWV0YSkpID09PSAnb2JqZWN0Jykge1xuICAgIGlmIChBcnJheS5pc0FycmF5KG1ldGEpKSB7XG4gICAgICByZXR1cm4gJyhbLi4uJyArIG1ldGEubGVuZ3RoICsgJ10pJztcbiAgICB9XG4gICAgcmV0dXJuICcoJyArIHRyaW0oSlNPTi5zdHJpbmdpZnkoKDAsIF9zYW5pdGl6ZTIuZGVmYXVsdCkobWV0YSkpLCA1MCkgKyAnKSc7XG4gIH1cbiAgcmV0dXJuICcoJyArICh0eXBlb2YgbWV0YSA9PT0gJ3VuZGVmaW5lZCcgPyAndW5kZWZpbmVkJyA6IF90eXBlb2YobWV0YSkpICsgJyknO1xufTtcblxudmFyIHByaW50ID0ge1xuICBlbnRyYW5jZTogZnVuY3Rpb24gZW50cmFuY2Uod2hhdCwgaW5kKSB7XG4gICAgaWYgKCFpc1J1bm5pbmdJbk5vZGUpIHtcbiAgICAgIHJldHVybiBbbnVsbCwgJyVjJyArIHdoYXQsICdjb2xvcjogI2IwYjBiMDsnICsgZ2V0SW5kTWFyZ2luKGluZCldO1xuICAgIH1cbiAgICByZXR1cm4gW251bGwsICdcXHgxYlszOG0lc1xceDFiWzBtJywgJycgKyAoZ2V0SW5kU3BhY2VzKGluZCkgKyB3aGF0KV07XG4gIH0sXG4gIGRlZmF1bHQ6IGZ1bmN0aW9uIF9kZWZhdWx0KHdoYXQsIGluZCkge1xuICAgIGlmICghaXNSdW5uaW5nSW5Ob2RlKSB7XG4gICAgICByZXR1cm4gW251bGwsICclYycgKyB3aGF0LCBnZXRJbmRNYXJnaW4oaW5kKV07XG4gICAgfVxuICAgIHJldHVybiBbbnVsbCwgJycgKyAoZ2V0SW5kU3BhY2VzKGluZCkgKyB3aGF0KV07XG4gIH0sXG4gIGhvb2s6IGZ1bmN0aW9uIGhvb2sod2hhdCwgaW5kLCB0aW1lKSB7XG4gICAgaWYgKCFpc1J1bm5pbmdJbk5vZGUpIHtcbiAgICAgIHJldHVybiBbdGltZSwgJyVjJyArIHdoYXQsICdjb2xvcjogIzk5OTsnICsgZ2V0SW5kTWFyZ2luKGluZCldO1xuICAgIH1cbiAgICByZXR1cm4gW3RpbWUsICdcXHgxYlszNG0lc1xceDFiWzBtJywgJycgKyAoZ2V0SW5kU3BhY2VzKGluZCkgKyB3aGF0KV07XG4gIH0sXG4gIGN1cnJlbnQ6IGZ1bmN0aW9uIGN1cnJlbnQod2hhdCwgaW5kKSB7XG4gICAgaWYgKCFpc1J1bm5pbmdJbk5vZGUpIHtcbiAgICAgIHJldHVybiBbbnVsbCwgJyVjJyArIHdoYXQsICdmb250LXdlaWdodDogYm9sZDsgYm9yZGVyOiBzb2xpZCAxcHggIzk5OTsgYm9yZGVyLXJhZGl1czogMnB4OyBwYWRkaW5nOiAxcHggMDsnICsgZ2V0SW5kTWFyZ2luKGluZCldO1xuICAgIH1cbiAgICByZXR1cm4gW251bGwsIGdldEluZFNwYWNlcyhpbmQpICsgKCdcXHgxQlsxMDBtJyArIHdoYXQgKyAnXFx4MUJbMG0nKV07XG4gIH1cbn07XG5cbmZ1bmN0aW9uIF9wcmludFNuYXBzaG90VG9Db25zb2xlKHNuYXBzaG90KSB7XG4gIHZhciBfc25hcHNob3QgPSBfc2xpY2VkVG9BcnJheShzbmFwc2hvdCwgMyksXG4gICAgICB0eXBlID0gX3NuYXBzaG90WzBdLFxuICAgICAgbm9kZSA9IF9zbmFwc2hvdFsxXSxcbiAgICAgIHRyZWUgPSBfc25hcHNob3RbMl07XG5cbiAgdmFyIHByaW50TGluZXMgPSBbcHJpbnQuZW50cmFuY2UoJycsIDApXTtcblxuICBwcmludExpbmVzID0gcHJpbnRMaW5lcy5jb25jYXQoZnVuY3Rpb24gbG9vcChfcmVmKSB7XG4gICAgdmFyIGlkID0gX3JlZi5pZCxcbiAgICAgICAgaW5kID0gX3JlZi5pbmQsXG4gICAgICAgIG5hbWUgPSBfcmVmLm5hbWUsXG4gICAgICAgIHVzZWQgPSBfcmVmLnVzZWQsXG4gICAgICAgIGNoaWxkcmVuID0gX3JlZi5jaGlsZHJlbixcbiAgICAgICAgbG9ncyA9IF9yZWYubG9ncztcblxuICAgIHZhciBsaW5lcyA9IFtdO1xuICAgIHZhciBlbGVtZW50T3BlblRhZyA9ICc8JyArIG5hbWUgKyAodXNlZCA+IDAgPyAnKCcgKyB1c2VkICsgJyknIDogJycpICsgJz4nO1xuXG4gICAgbGluZXMucHVzaChpZCA9PT0gbm9kZS5lbGVtZW50LmlkID8gcHJpbnQuY3VycmVudChlbGVtZW50T3BlblRhZywgaW5kKSA6IHByaW50LmRlZmF1bHQoZWxlbWVudE9wZW5UYWcsIGluZCkpO1xuICAgIGlmIChsb2dzICYmIGxvZ3MubGVuZ3RoID4gMCkge1xuICAgICAgbGluZXMgPSBsaW5lcy5jb25jYXQobG9ncy5tYXAoZnVuY3Rpb24gKF9yZWYyKSB7XG4gICAgICAgIHZhciB0eXBlID0gX3JlZjIudHlwZSxcbiAgICAgICAgICAgIG1ldGEgPSBfcmVmMi5tZXRhLFxuICAgICAgICAgICAgdGltZSA9IF9yZWYyLnRpbWU7XG5cbiAgICAgICAgcmV0dXJuIHByaW50Lmhvb2soJ1xcdTI5MzcgJyArIHR5cGUgKyBwYXJzZUxvZ01ldGEobWV0YSksIGluZCwgdGltZSk7XG4gICAgICB9KSk7XG4gICAgfVxuICAgIGlmIChjaGlsZHJlbi5sZW5ndGggPiAwKSB7XG4gICAgICBjaGlsZHJlbi5tYXAoZnVuY3Rpb24gKGNoaWxkKSB7XG4gICAgICAgIGxpbmVzID0gbGluZXMuY29uY2F0KGxvb3AoY2hpbGQpKTtcbiAgICAgIH0pO1xuICAgICAgbGluZXMucHVzaChpZCA9PT0gbm9kZS5lbGVtZW50LmlkID8gcHJpbnQuY3VycmVudCgnPC8nICsgbmFtZSArICc+JywgaW5kKSA6IHByaW50LmRlZmF1bHQoJzwvJyArIG5hbWUgKyAnPicsIGluZCkpO1xuICAgIH1cbiAgICByZXR1cm4gbGluZXM7XG4gIH0odHJlZSkpO1xuXG4gIC8vIGNvbnNvbGUuY2xlYXIoKTtcbiAgdmFyIHNvcnRlZEhvb2tUaW1lcyA9IHByaW50TGluZXMuZmlsdGVyKGZ1bmN0aW9uIChfcmVmMykge1xuICAgIHZhciBfcmVmNCA9IF9zbGljZWRUb0FycmF5KF9yZWYzLCAxKSxcbiAgICAgICAgdGltZSA9IF9yZWY0WzBdO1xuXG4gICAgcmV0dXJuIHRpbWUgIT09IG51bGw7XG4gIH0pLm1hcChmdW5jdGlvbiAoX3JlZjUpIHtcbiAgICB2YXIgX3JlZjYgPSBfc2xpY2VkVG9BcnJheShfcmVmNSwgMSksXG4gICAgICAgIHRpbWUgPSBfcmVmNlswXTtcblxuICAgIHJldHVybiB0aW1lO1xuICB9KS5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgcmV0dXJuIGEgPiBiID8gMSA6IC0xO1xuICB9KTtcblxuICBwcmludExpbmVzLmZvckVhY2goZnVuY3Rpb24gKF9yZWY3KSB7XG4gICAgdmFyIF9yZWY4ID0gX3RvQXJyYXkoX3JlZjcpLFxuICAgICAgICB0aW1lID0gX3JlZjhbMF0sXG4gICAgICAgIGxpbmUgPSBfcmVmOC5zbGljZSgxKTtcblxuICAgIGlmIChzb3J0ZWRIb29rVGltZXMubGVuZ3RoID4gMCAmJiB0aW1lKSB7XG4gICAgICB2YXIgX2NvbnNvbGU7XG5cbiAgICAgIChfY29uc29sZSA9IGNvbnNvbGUpLmxvZy5hcHBseShfY29uc29sZSwgX3RvQ29uc3VtYWJsZUFycmF5KGxpbmUpLmNvbmNhdChbc29ydGVkSG9va1RpbWVzLmZpbmRJbmRleChmdW5jdGlvbiAodCkge1xuICAgICAgICByZXR1cm4gdCA9PT0gdGltZTtcbiAgICAgIH0pXSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgX2NvbnNvbGUyO1xuXG4gICAgICAoX2NvbnNvbGUyID0gY29uc29sZSkubG9nLmFwcGx5KF9jb25zb2xlMiwgX3RvQ29uc3VtYWJsZUFycmF5KGxpbmUpKTtcbiAgICB9XG4gIH0pO1xufVxuXG5leHBvcnRzLmRlZmF1bHQgPSB7XG4gIHdhdGNoOiBmdW5jdGlvbiB3YXRjaChwcm9jZXNzb3IpIHtcbiAgICB2YXIgc25hcHNob3RzID0gW107XG5cbiAgICBmdW5jdGlvbiBzbmFwc2hvdCh0eXBlLCBub2RlKSB7XG4gICAgICBzbmFwc2hvdHMucHVzaChbdHlwZSwgeyBlbGVtZW50OiB7IGlkOiBub2RlLmVsZW1lbnQuaWQgfSB9LCBwcm9jZXNzb3Iuc3lzdGVtKCkudHJlZS5kaWFnbm9zZSgpXSk7XG4gICAgICBfcHJpbnRTbmFwc2hvdFRvQ29uc29sZShzbmFwc2hvdHNbc25hcHNob3RzLmxlbmd0aCAtIDFdKTtcbiAgICB9XG5cbiAgICAvLyBwcm9jZXNzb3Iub25Ob2RlSW4obm9kZSA9PiBzbmFwc2hvdChJTiwgbm9kZSkpO1xuICAgIHByb2Nlc3Nvci5vbk5vZGVPdXQoZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgIHJldHVybiBzbmFwc2hvdChPVVQsIG5vZGUpO1xuICAgIH0pO1xuICAgIC8vIHByb2Nlc3Nvci5vbk5vZGVSZW1vdmUobm9kZSA9PiBzbmFwc2hvdChSRU1PVkUsIG5vZGUpKTtcbiAgfSxcbiAgcHJpbnRTbmFwc2hvdFRvQ29uc29sZTogZnVuY3Rpb24gcHJpbnRTbmFwc2hvdFRvQ29uc29sZShzbmFwc2hvdHMpIHtcbiAgICBzbmFwc2hvdHMuZm9yRWFjaChfcHJpbnRTbmFwc2hvdFRvQ29uc29sZSk7XG4gIH1cbn07IiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbi8vIGNhY2hlZCBmcm9tIHdoYXRldmVyIGdsb2JhbCBpcyBwcmVzZW50IHNvIHRoYXQgdGVzdCBydW5uZXJzIHRoYXQgc3R1YiBpdFxuLy8gZG9uJ3QgYnJlYWsgdGhpbmdzLiAgQnV0IHdlIG5lZWQgdG8gd3JhcCBpdCBpbiBhIHRyeSBjYXRjaCBpbiBjYXNlIGl0IGlzXG4vLyB3cmFwcGVkIGluIHN0cmljdCBtb2RlIGNvZGUgd2hpY2ggZG9lc24ndCBkZWZpbmUgYW55IGdsb2JhbHMuICBJdCdzIGluc2lkZSBhXG4vLyBmdW5jdGlvbiBiZWNhdXNlIHRyeS9jYXRjaGVzIGRlb3B0aW1pemUgaW4gY2VydGFpbiBlbmdpbmVzLlxuXG52YXIgY2FjaGVkU2V0VGltZW91dDtcbnZhciBjYWNoZWRDbGVhclRpbWVvdXQ7XG5cbmZ1bmN0aW9uIGRlZmF1bHRTZXRUaW1vdXQoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdzZXRUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG5mdW5jdGlvbiBkZWZhdWx0Q2xlYXJUaW1lb3V0ICgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2NsZWFyVGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuKGZ1bmN0aW9uICgpIHtcbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIHNldFRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIGNsZWFyVGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICB9XG59ICgpKVxuZnVuY3Rpb24gcnVuVGltZW91dChmdW4pIHtcbiAgICBpZiAoY2FjaGVkU2V0VGltZW91dCA9PT0gc2V0VGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgLy8gaWYgc2V0VGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZFNldFRpbWVvdXQgPT09IGRlZmF1bHRTZXRUaW1vdXQgfHwgIWNhY2hlZFNldFRpbWVvdXQpICYmIHNldFRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9IGNhdGNoKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0IHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKG51bGwsIGZ1biwgMCk7XG4gICAgICAgIH0gY2F0Y2goZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvclxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbCh0aGlzLCBmdW4sIDApO1xuICAgICAgICB9XG4gICAgfVxuXG5cbn1cbmZ1bmN0aW9uIHJ1bkNsZWFyVGltZW91dChtYXJrZXIpIHtcbiAgICBpZiAoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgLy8gaWYgY2xlYXJUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBkZWZhdWx0Q2xlYXJUaW1lb3V0IHx8ICFjYWNoZWRDbGVhclRpbWVvdXQpICYmIGNsZWFyVGltZW91dCkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfSBjYXRjaCAoZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgIHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwobnVsbCwgbWFya2VyKTtcbiAgICAgICAgfSBjYXRjaCAoZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvci5cbiAgICAgICAgICAgIC8vIFNvbWUgdmVyc2lvbnMgb2YgSS5FLiBoYXZlIGRpZmZlcmVudCBydWxlcyBmb3IgY2xlYXJUaW1lb3V0IHZzIHNldFRpbWVvdXRcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbCh0aGlzLCBtYXJrZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG5cblxufVxudmFyIHF1ZXVlID0gW107XG52YXIgZHJhaW5pbmcgPSBmYWxzZTtcbnZhciBjdXJyZW50UXVldWU7XG52YXIgcXVldWVJbmRleCA9IC0xO1xuXG5mdW5jdGlvbiBjbGVhblVwTmV4dFRpY2soKSB7XG4gICAgaWYgKCFkcmFpbmluZyB8fCAhY3VycmVudFF1ZXVlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBpZiAoY3VycmVudFF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBxdWV1ZSA9IGN1cnJlbnRRdWV1ZS5jb25jYXQocXVldWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICB9XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBkcmFpblF1ZXVlKCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBkcmFpblF1ZXVlKCkge1xuICAgIGlmIChkcmFpbmluZykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciB0aW1lb3V0ID0gcnVuVGltZW91dChjbGVhblVwTmV4dFRpY2spO1xuICAgIGRyYWluaW5nID0gdHJ1ZTtcblxuICAgIHZhciBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgd2hpbGUobGVuKSB7XG4gICAgICAgIGN1cnJlbnRRdWV1ZSA9IHF1ZXVlO1xuICAgICAgICBxdWV1ZSA9IFtdO1xuICAgICAgICB3aGlsZSAoKytxdWV1ZUluZGV4IDwgbGVuKSB7XG4gICAgICAgICAgICBpZiAoY3VycmVudFF1ZXVlKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudFF1ZXVlW3F1ZXVlSW5kZXhdLnJ1bigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICAgICAgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIH1cbiAgICBjdXJyZW50UXVldWUgPSBudWxsO1xuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgcnVuQ2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xufVxuXG5wcm9jZXNzLm5leHRUaWNrID0gZnVuY3Rpb24gKGZ1bikge1xuICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGggLSAxKTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHF1ZXVlLnB1c2gobmV3IEl0ZW0oZnVuLCBhcmdzKSk7XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCA9PT0gMSAmJiAhZHJhaW5pbmcpIHtcbiAgICAgICAgcnVuVGltZW91dChkcmFpblF1ZXVlKTtcbiAgICB9XG59O1xuXG4vLyB2OCBsaWtlcyBwcmVkaWN0aWJsZSBvYmplY3RzXG5mdW5jdGlvbiBJdGVtKGZ1biwgYXJyYXkpIHtcbiAgICB0aGlzLmZ1biA9IGZ1bjtcbiAgICB0aGlzLmFycmF5ID0gYXJyYXk7XG59XG5JdGVtLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5mdW4uYXBwbHkobnVsbCwgdGhpcy5hcnJheSk7XG59O1xucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5wcm9jZXNzLnZlcnNpb24gPSAnJzsgLy8gZW1wdHkgc3RyaW5nIHRvIGF2b2lkIHJlZ2V4cCBpc3N1ZXNcbnByb2Nlc3MudmVyc2lvbnMgPSB7fTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kT25jZUxpc3RlbmVyID0gbm9vcDtcblxucHJvY2Vzcy5saXN0ZW5lcnMgPSBmdW5jdGlvbiAobmFtZSkgeyByZXR1cm4gW10gfVxuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5cbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xucHJvY2Vzcy51bWFzayA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gMDsgfTtcbiIsIi8qKlxuICogQ29weXJpZ2h0IChjKSAyMDE0LXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxudmFyIHJ1bnRpbWUgPSAoZnVuY3Rpb24gKGV4cG9ydHMpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgdmFyIE9wID0gT2JqZWN0LnByb3RvdHlwZTtcbiAgdmFyIGhhc093biA9IE9wLmhhc093blByb3BlcnR5O1xuICB2YXIgdW5kZWZpbmVkOyAvLyBNb3JlIGNvbXByZXNzaWJsZSB0aGFuIHZvaWQgMC5cbiAgdmFyICRTeW1ib2wgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgPyBTeW1ib2wgOiB7fTtcbiAgdmFyIGl0ZXJhdG9yU3ltYm9sID0gJFN5bWJvbC5pdGVyYXRvciB8fCBcIkBAaXRlcmF0b3JcIjtcbiAgdmFyIGFzeW5jSXRlcmF0b3JTeW1ib2wgPSAkU3ltYm9sLmFzeW5jSXRlcmF0b3IgfHwgXCJAQGFzeW5jSXRlcmF0b3JcIjtcbiAgdmFyIHRvU3RyaW5nVGFnU3ltYm9sID0gJFN5bWJvbC50b1N0cmluZ1RhZyB8fCBcIkBAdG9TdHJpbmdUYWdcIjtcblxuICBmdW5jdGlvbiB3cmFwKGlubmVyRm4sIG91dGVyRm4sIHNlbGYsIHRyeUxvY3NMaXN0KSB7XG4gICAgLy8gSWYgb3V0ZXJGbiBwcm92aWRlZCBhbmQgb3V0ZXJGbi5wcm90b3R5cGUgaXMgYSBHZW5lcmF0b3IsIHRoZW4gb3V0ZXJGbi5wcm90b3R5cGUgaW5zdGFuY2VvZiBHZW5lcmF0b3IuXG4gICAgdmFyIHByb3RvR2VuZXJhdG9yID0gb3V0ZXJGbiAmJiBvdXRlckZuLnByb3RvdHlwZSBpbnN0YW5jZW9mIEdlbmVyYXRvciA/IG91dGVyRm4gOiBHZW5lcmF0b3I7XG4gICAgdmFyIGdlbmVyYXRvciA9IE9iamVjdC5jcmVhdGUocHJvdG9HZW5lcmF0b3IucHJvdG90eXBlKTtcbiAgICB2YXIgY29udGV4dCA9IG5ldyBDb250ZXh0KHRyeUxvY3NMaXN0IHx8IFtdKTtcblxuICAgIC8vIFRoZSAuX2ludm9rZSBtZXRob2QgdW5pZmllcyB0aGUgaW1wbGVtZW50YXRpb25zIG9mIHRoZSAubmV4dCxcbiAgICAvLyAudGhyb3csIGFuZCAucmV0dXJuIG1ldGhvZHMuXG4gICAgZ2VuZXJhdG9yLl9pbnZva2UgPSBtYWtlSW52b2tlTWV0aG9kKGlubmVyRm4sIHNlbGYsIGNvbnRleHQpO1xuXG4gICAgcmV0dXJuIGdlbmVyYXRvcjtcbiAgfVxuICBleHBvcnRzLndyYXAgPSB3cmFwO1xuXG4gIC8vIFRyeS9jYXRjaCBoZWxwZXIgdG8gbWluaW1pemUgZGVvcHRpbWl6YXRpb25zLiBSZXR1cm5zIGEgY29tcGxldGlvblxuICAvLyByZWNvcmQgbGlrZSBjb250ZXh0LnRyeUVudHJpZXNbaV0uY29tcGxldGlvbi4gVGhpcyBpbnRlcmZhY2UgY291bGRcbiAgLy8gaGF2ZSBiZWVuIChhbmQgd2FzIHByZXZpb3VzbHkpIGRlc2lnbmVkIHRvIHRha2UgYSBjbG9zdXJlIHRvIGJlXG4gIC8vIGludm9rZWQgd2l0aG91dCBhcmd1bWVudHMsIGJ1dCBpbiBhbGwgdGhlIGNhc2VzIHdlIGNhcmUgYWJvdXQgd2VcbiAgLy8gYWxyZWFkeSBoYXZlIGFuIGV4aXN0aW5nIG1ldGhvZCB3ZSB3YW50IHRvIGNhbGwsIHNvIHRoZXJlJ3Mgbm8gbmVlZFxuICAvLyB0byBjcmVhdGUgYSBuZXcgZnVuY3Rpb24gb2JqZWN0LiBXZSBjYW4gZXZlbiBnZXQgYXdheSB3aXRoIGFzc3VtaW5nXG4gIC8vIHRoZSBtZXRob2QgdGFrZXMgZXhhY3RseSBvbmUgYXJndW1lbnQsIHNpbmNlIHRoYXQgaGFwcGVucyB0byBiZSB0cnVlXG4gIC8vIGluIGV2ZXJ5IGNhc2UsIHNvIHdlIGRvbid0IGhhdmUgdG8gdG91Y2ggdGhlIGFyZ3VtZW50cyBvYmplY3QuIFRoZVxuICAvLyBvbmx5IGFkZGl0aW9uYWwgYWxsb2NhdGlvbiByZXF1aXJlZCBpcyB0aGUgY29tcGxldGlvbiByZWNvcmQsIHdoaWNoXG4gIC8vIGhhcyBhIHN0YWJsZSBzaGFwZSBhbmQgc28gaG9wZWZ1bGx5IHNob3VsZCBiZSBjaGVhcCB0byBhbGxvY2F0ZS5cbiAgZnVuY3Rpb24gdHJ5Q2F0Y2goZm4sIG9iaiwgYXJnKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiB7IHR5cGU6IFwibm9ybWFsXCIsIGFyZzogZm4uY2FsbChvYmosIGFyZykgfTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHJldHVybiB7IHR5cGU6IFwidGhyb3dcIiwgYXJnOiBlcnIgfTtcbiAgICB9XG4gIH1cblxuICB2YXIgR2VuU3RhdGVTdXNwZW5kZWRTdGFydCA9IFwic3VzcGVuZGVkU3RhcnRcIjtcbiAgdmFyIEdlblN0YXRlU3VzcGVuZGVkWWllbGQgPSBcInN1c3BlbmRlZFlpZWxkXCI7XG4gIHZhciBHZW5TdGF0ZUV4ZWN1dGluZyA9IFwiZXhlY3V0aW5nXCI7XG4gIHZhciBHZW5TdGF0ZUNvbXBsZXRlZCA9IFwiY29tcGxldGVkXCI7XG5cbiAgLy8gUmV0dXJuaW5nIHRoaXMgb2JqZWN0IGZyb20gdGhlIGlubmVyRm4gaGFzIHRoZSBzYW1lIGVmZmVjdCBhc1xuICAvLyBicmVha2luZyBvdXQgb2YgdGhlIGRpc3BhdGNoIHN3aXRjaCBzdGF0ZW1lbnQuXG4gIHZhciBDb250aW51ZVNlbnRpbmVsID0ge307XG5cbiAgLy8gRHVtbXkgY29uc3RydWN0b3IgZnVuY3Rpb25zIHRoYXQgd2UgdXNlIGFzIHRoZSAuY29uc3RydWN0b3IgYW5kXG4gIC8vIC5jb25zdHJ1Y3Rvci5wcm90b3R5cGUgcHJvcGVydGllcyBmb3IgZnVuY3Rpb25zIHRoYXQgcmV0dXJuIEdlbmVyYXRvclxuICAvLyBvYmplY3RzLiBGb3IgZnVsbCBzcGVjIGNvbXBsaWFuY2UsIHlvdSBtYXkgd2lzaCB0byBjb25maWd1cmUgeW91clxuICAvLyBtaW5pZmllciBub3QgdG8gbWFuZ2xlIHRoZSBuYW1lcyBvZiB0aGVzZSB0d28gZnVuY3Rpb25zLlxuICBmdW5jdGlvbiBHZW5lcmF0b3IoKSB7fVxuICBmdW5jdGlvbiBHZW5lcmF0b3JGdW5jdGlvbigpIHt9XG4gIGZ1bmN0aW9uIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlKCkge31cblxuICAvLyBUaGlzIGlzIGEgcG9seWZpbGwgZm9yICVJdGVyYXRvclByb3RvdHlwZSUgZm9yIGVudmlyb25tZW50cyB0aGF0XG4gIC8vIGRvbid0IG5hdGl2ZWx5IHN1cHBvcnQgaXQuXG4gIHZhciBJdGVyYXRvclByb3RvdHlwZSA9IHt9O1xuICBJdGVyYXRvclByb3RvdHlwZVtpdGVyYXRvclN5bWJvbF0gPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgdmFyIGdldFByb3RvID0gT2JqZWN0LmdldFByb3RvdHlwZU9mO1xuICB2YXIgTmF0aXZlSXRlcmF0b3JQcm90b3R5cGUgPSBnZXRQcm90byAmJiBnZXRQcm90byhnZXRQcm90byh2YWx1ZXMoW10pKSk7XG4gIGlmIChOYXRpdmVJdGVyYXRvclByb3RvdHlwZSAmJlxuICAgICAgTmF0aXZlSXRlcmF0b3JQcm90b3R5cGUgIT09IE9wICYmXG4gICAgICBoYXNPd24uY2FsbChOYXRpdmVJdGVyYXRvclByb3RvdHlwZSwgaXRlcmF0b3JTeW1ib2wpKSB7XG4gICAgLy8gVGhpcyBlbnZpcm9ubWVudCBoYXMgYSBuYXRpdmUgJUl0ZXJhdG9yUHJvdG90eXBlJTsgdXNlIGl0IGluc3RlYWRcbiAgICAvLyBvZiB0aGUgcG9seWZpbGwuXG4gICAgSXRlcmF0b3JQcm90b3R5cGUgPSBOYXRpdmVJdGVyYXRvclByb3RvdHlwZTtcbiAgfVxuXG4gIHZhciBHcCA9IEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlLnByb3RvdHlwZSA9XG4gICAgR2VuZXJhdG9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoSXRlcmF0b3JQcm90b3R5cGUpO1xuICBHZW5lcmF0b3JGdW5jdGlvbi5wcm90b3R5cGUgPSBHcC5jb25zdHJ1Y3RvciA9IEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlO1xuICBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IEdlbmVyYXRvckZ1bmN0aW9uO1xuICBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZVt0b1N0cmluZ1RhZ1N5bWJvbF0gPVxuICAgIEdlbmVyYXRvckZ1bmN0aW9uLmRpc3BsYXlOYW1lID0gXCJHZW5lcmF0b3JGdW5jdGlvblwiO1xuXG4gIC8vIEhlbHBlciBmb3IgZGVmaW5pbmcgdGhlIC5uZXh0LCAudGhyb3csIGFuZCAucmV0dXJuIG1ldGhvZHMgb2YgdGhlXG4gIC8vIEl0ZXJhdG9yIGludGVyZmFjZSBpbiB0ZXJtcyBvZiBhIHNpbmdsZSAuX2ludm9rZSBtZXRob2QuXG4gIGZ1bmN0aW9uIGRlZmluZUl0ZXJhdG9yTWV0aG9kcyhwcm90b3R5cGUpIHtcbiAgICBbXCJuZXh0XCIsIFwidGhyb3dcIiwgXCJyZXR1cm5cIl0uZm9yRWFjaChmdW5jdGlvbihtZXRob2QpIHtcbiAgICAgIHByb3RvdHlwZVttZXRob2RdID0gZnVuY3Rpb24oYXJnKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9pbnZva2UobWV0aG9kLCBhcmcpO1xuICAgICAgfTtcbiAgICB9KTtcbiAgfVxuXG4gIGV4cG9ydHMuaXNHZW5lcmF0b3JGdW5jdGlvbiA9IGZ1bmN0aW9uKGdlbkZ1bikge1xuICAgIHZhciBjdG9yID0gdHlwZW9mIGdlbkZ1biA9PT0gXCJmdW5jdGlvblwiICYmIGdlbkZ1bi5jb25zdHJ1Y3RvcjtcbiAgICByZXR1cm4gY3RvclxuICAgICAgPyBjdG9yID09PSBHZW5lcmF0b3JGdW5jdGlvbiB8fFxuICAgICAgICAvLyBGb3IgdGhlIG5hdGl2ZSBHZW5lcmF0b3JGdW5jdGlvbiBjb25zdHJ1Y3RvciwgdGhlIGJlc3Qgd2UgY2FuXG4gICAgICAgIC8vIGRvIGlzIHRvIGNoZWNrIGl0cyAubmFtZSBwcm9wZXJ0eS5cbiAgICAgICAgKGN0b3IuZGlzcGxheU5hbWUgfHwgY3Rvci5uYW1lKSA9PT0gXCJHZW5lcmF0b3JGdW5jdGlvblwiXG4gICAgICA6IGZhbHNlO1xuICB9O1xuXG4gIGV4cG9ydHMubWFyayA9IGZ1bmN0aW9uKGdlbkZ1bikge1xuICAgIGlmIChPYmplY3Quc2V0UHJvdG90eXBlT2YpIHtcbiAgICAgIE9iamVjdC5zZXRQcm90b3R5cGVPZihnZW5GdW4sIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZ2VuRnVuLl9fcHJvdG9fXyA9IEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlO1xuICAgICAgaWYgKCEodG9TdHJpbmdUYWdTeW1ib2wgaW4gZ2VuRnVuKSkge1xuICAgICAgICBnZW5GdW5bdG9TdHJpbmdUYWdTeW1ib2xdID0gXCJHZW5lcmF0b3JGdW5jdGlvblwiO1xuICAgICAgfVxuICAgIH1cbiAgICBnZW5GdW4ucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShHcCk7XG4gICAgcmV0dXJuIGdlbkZ1bjtcbiAgfTtcblxuICAvLyBXaXRoaW4gdGhlIGJvZHkgb2YgYW55IGFzeW5jIGZ1bmN0aW9uLCBgYXdhaXQgeGAgaXMgdHJhbnNmb3JtZWQgdG9cbiAgLy8gYHlpZWxkIHJlZ2VuZXJhdG9yUnVudGltZS5hd3JhcCh4KWAsIHNvIHRoYXQgdGhlIHJ1bnRpbWUgY2FuIHRlc3RcbiAgLy8gYGhhc093bi5jYWxsKHZhbHVlLCBcIl9fYXdhaXRcIilgIHRvIGRldGVybWluZSBpZiB0aGUgeWllbGRlZCB2YWx1ZSBpc1xuICAvLyBtZWFudCB0byBiZSBhd2FpdGVkLlxuICBleHBvcnRzLmF3cmFwID0gZnVuY3Rpb24oYXJnKSB7XG4gICAgcmV0dXJuIHsgX19hd2FpdDogYXJnIH07XG4gIH07XG5cbiAgZnVuY3Rpb24gQXN5bmNJdGVyYXRvcihnZW5lcmF0b3IpIHtcbiAgICBmdW5jdGlvbiBpbnZva2UobWV0aG9kLCBhcmcsIHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgdmFyIHJlY29yZCA9IHRyeUNhdGNoKGdlbmVyYXRvclttZXRob2RdLCBnZW5lcmF0b3IsIGFyZyk7XG4gICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICByZWplY3QocmVjb3JkLmFyZyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgcmVzdWx0ID0gcmVjb3JkLmFyZztcbiAgICAgICAgdmFyIHZhbHVlID0gcmVzdWx0LnZhbHVlO1xuICAgICAgICBpZiAodmFsdWUgJiZcbiAgICAgICAgICAgIHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIiAmJlxuICAgICAgICAgICAgaGFzT3duLmNhbGwodmFsdWUsIFwiX19hd2FpdFwiKSkge1xuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodmFsdWUuX19hd2FpdCkudGhlbihmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgaW52b2tlKFwibmV4dFwiLCB2YWx1ZSwgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgICB9LCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgICAgIGludm9rZShcInRocm93XCIsIGVyciwgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodmFsdWUpLnRoZW4oZnVuY3Rpb24odW53cmFwcGVkKSB7XG4gICAgICAgICAgLy8gV2hlbiBhIHlpZWxkZWQgUHJvbWlzZSBpcyByZXNvbHZlZCwgaXRzIGZpbmFsIHZhbHVlIGJlY29tZXNcbiAgICAgICAgICAvLyB0aGUgLnZhbHVlIG9mIHRoZSBQcm9taXNlPHt2YWx1ZSxkb25lfT4gcmVzdWx0IGZvciB0aGVcbiAgICAgICAgICAvLyBjdXJyZW50IGl0ZXJhdGlvbi5cbiAgICAgICAgICByZXN1bHQudmFsdWUgPSB1bndyYXBwZWQ7XG4gICAgICAgICAgcmVzb2x2ZShyZXN1bHQpO1xuICAgICAgICB9LCBmdW5jdGlvbihlcnJvcikge1xuICAgICAgICAgIC8vIElmIGEgcmVqZWN0ZWQgUHJvbWlzZSB3YXMgeWllbGRlZCwgdGhyb3cgdGhlIHJlamVjdGlvbiBiYWNrXG4gICAgICAgICAgLy8gaW50byB0aGUgYXN5bmMgZ2VuZXJhdG9yIGZ1bmN0aW9uIHNvIGl0IGNhbiBiZSBoYW5kbGVkIHRoZXJlLlxuICAgICAgICAgIHJldHVybiBpbnZva2UoXCJ0aHJvd1wiLCBlcnJvciwgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIHByZXZpb3VzUHJvbWlzZTtcblxuICAgIGZ1bmN0aW9uIGVucXVldWUobWV0aG9kLCBhcmcpIHtcbiAgICAgIGZ1bmN0aW9uIGNhbGxJbnZva2VXaXRoTWV0aG9kQW5kQXJnKCkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgaW52b2tlKG1ldGhvZCwgYXJnLCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHByZXZpb3VzUHJvbWlzZSA9XG4gICAgICAgIC8vIElmIGVucXVldWUgaGFzIGJlZW4gY2FsbGVkIGJlZm9yZSwgdGhlbiB3ZSB3YW50IHRvIHdhaXQgdW50aWxcbiAgICAgICAgLy8gYWxsIHByZXZpb3VzIFByb21pc2VzIGhhdmUgYmVlbiByZXNvbHZlZCBiZWZvcmUgY2FsbGluZyBpbnZva2UsXG4gICAgICAgIC8vIHNvIHRoYXQgcmVzdWx0cyBhcmUgYWx3YXlzIGRlbGl2ZXJlZCBpbiB0aGUgY29ycmVjdCBvcmRlci4gSWZcbiAgICAgICAgLy8gZW5xdWV1ZSBoYXMgbm90IGJlZW4gY2FsbGVkIGJlZm9yZSwgdGhlbiBpdCBpcyBpbXBvcnRhbnQgdG9cbiAgICAgICAgLy8gY2FsbCBpbnZva2UgaW1tZWRpYXRlbHksIHdpdGhvdXQgd2FpdGluZyBvbiBhIGNhbGxiYWNrIHRvIGZpcmUsXG4gICAgICAgIC8vIHNvIHRoYXQgdGhlIGFzeW5jIGdlbmVyYXRvciBmdW5jdGlvbiBoYXMgdGhlIG9wcG9ydHVuaXR5IHRvIGRvXG4gICAgICAgIC8vIGFueSBuZWNlc3Nhcnkgc2V0dXAgaW4gYSBwcmVkaWN0YWJsZSB3YXkuIFRoaXMgcHJlZGljdGFiaWxpdHlcbiAgICAgICAgLy8gaXMgd2h5IHRoZSBQcm9taXNlIGNvbnN0cnVjdG9yIHN5bmNocm9ub3VzbHkgaW52b2tlcyBpdHNcbiAgICAgICAgLy8gZXhlY3V0b3IgY2FsbGJhY2ssIGFuZCB3aHkgYXN5bmMgZnVuY3Rpb25zIHN5bmNocm9ub3VzbHlcbiAgICAgICAgLy8gZXhlY3V0ZSBjb2RlIGJlZm9yZSB0aGUgZmlyc3QgYXdhaXQuIFNpbmNlIHdlIGltcGxlbWVudCBzaW1wbGVcbiAgICAgICAgLy8gYXN5bmMgZnVuY3Rpb25zIGluIHRlcm1zIG9mIGFzeW5jIGdlbmVyYXRvcnMsIGl0IGlzIGVzcGVjaWFsbHlcbiAgICAgICAgLy8gaW1wb3J0YW50IHRvIGdldCB0aGlzIHJpZ2h0LCBldmVuIHRob3VnaCBpdCByZXF1aXJlcyBjYXJlLlxuICAgICAgICBwcmV2aW91c1Byb21pc2UgPyBwcmV2aW91c1Byb21pc2UudGhlbihcbiAgICAgICAgICBjYWxsSW52b2tlV2l0aE1ldGhvZEFuZEFyZyxcbiAgICAgICAgICAvLyBBdm9pZCBwcm9wYWdhdGluZyBmYWlsdXJlcyB0byBQcm9taXNlcyByZXR1cm5lZCBieSBsYXRlclxuICAgICAgICAgIC8vIGludm9jYXRpb25zIG9mIHRoZSBpdGVyYXRvci5cbiAgICAgICAgICBjYWxsSW52b2tlV2l0aE1ldGhvZEFuZEFyZ1xuICAgICAgICApIDogY2FsbEludm9rZVdpdGhNZXRob2RBbmRBcmcoKTtcbiAgICB9XG5cbiAgICAvLyBEZWZpbmUgdGhlIHVuaWZpZWQgaGVscGVyIG1ldGhvZCB0aGF0IGlzIHVzZWQgdG8gaW1wbGVtZW50IC5uZXh0LFxuICAgIC8vIC50aHJvdywgYW5kIC5yZXR1cm4gKHNlZSBkZWZpbmVJdGVyYXRvck1ldGhvZHMpLlxuICAgIHRoaXMuX2ludm9rZSA9IGVucXVldWU7XG4gIH1cblxuICBkZWZpbmVJdGVyYXRvck1ldGhvZHMoQXN5bmNJdGVyYXRvci5wcm90b3R5cGUpO1xuICBBc3luY0l0ZXJhdG9yLnByb3RvdHlwZVthc3luY0l0ZXJhdG9yU3ltYm9sXSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcbiAgZXhwb3J0cy5Bc3luY0l0ZXJhdG9yID0gQXN5bmNJdGVyYXRvcjtcblxuICAvLyBOb3RlIHRoYXQgc2ltcGxlIGFzeW5jIGZ1bmN0aW9ucyBhcmUgaW1wbGVtZW50ZWQgb24gdG9wIG9mXG4gIC8vIEFzeW5jSXRlcmF0b3Igb2JqZWN0czsgdGhleSBqdXN0IHJldHVybiBhIFByb21pc2UgZm9yIHRoZSB2YWx1ZSBvZlxuICAvLyB0aGUgZmluYWwgcmVzdWx0IHByb2R1Y2VkIGJ5IHRoZSBpdGVyYXRvci5cbiAgZXhwb3J0cy5hc3luYyA9IGZ1bmN0aW9uKGlubmVyRm4sIG91dGVyRm4sIHNlbGYsIHRyeUxvY3NMaXN0KSB7XG4gICAgdmFyIGl0ZXIgPSBuZXcgQXN5bmNJdGVyYXRvcihcbiAgICAgIHdyYXAoaW5uZXJGbiwgb3V0ZXJGbiwgc2VsZiwgdHJ5TG9jc0xpc3QpXG4gICAgKTtcblxuICAgIHJldHVybiBleHBvcnRzLmlzR2VuZXJhdG9yRnVuY3Rpb24ob3V0ZXJGbilcbiAgICAgID8gaXRlciAvLyBJZiBvdXRlckZuIGlzIGEgZ2VuZXJhdG9yLCByZXR1cm4gdGhlIGZ1bGwgaXRlcmF0b3IuXG4gICAgICA6IGl0ZXIubmV4dCgpLnRoZW4oZnVuY3Rpb24ocmVzdWx0KSB7XG4gICAgICAgICAgcmV0dXJuIHJlc3VsdC5kb25lID8gcmVzdWx0LnZhbHVlIDogaXRlci5uZXh0KCk7XG4gICAgICAgIH0pO1xuICB9O1xuXG4gIGZ1bmN0aW9uIG1ha2VJbnZva2VNZXRob2QoaW5uZXJGbiwgc2VsZiwgY29udGV4dCkge1xuICAgIHZhciBzdGF0ZSA9IEdlblN0YXRlU3VzcGVuZGVkU3RhcnQ7XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gaW52b2tlKG1ldGhvZCwgYXJnKSB7XG4gICAgICBpZiAoc3RhdGUgPT09IEdlblN0YXRlRXhlY3V0aW5nKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkdlbmVyYXRvciBpcyBhbHJlYWR5IHJ1bm5pbmdcIik7XG4gICAgICB9XG5cbiAgICAgIGlmIChzdGF0ZSA9PT0gR2VuU3RhdGVDb21wbGV0ZWQpIHtcbiAgICAgICAgaWYgKG1ldGhvZCA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgdGhyb3cgYXJnO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQmUgZm9yZ2l2aW5nLCBwZXIgMjUuMy4zLjMuMyBvZiB0aGUgc3BlYzpcbiAgICAgICAgLy8gaHR0cHM6Ly9wZW9wbGUubW96aWxsYS5vcmcvfmpvcmVuZG9yZmYvZXM2LWRyYWZ0Lmh0bWwjc2VjLWdlbmVyYXRvcnJlc3VtZVxuICAgICAgICByZXR1cm4gZG9uZVJlc3VsdCgpO1xuICAgICAgfVxuXG4gICAgICBjb250ZXh0Lm1ldGhvZCA9IG1ldGhvZDtcbiAgICAgIGNvbnRleHQuYXJnID0gYXJnO1xuXG4gICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICB2YXIgZGVsZWdhdGUgPSBjb250ZXh0LmRlbGVnYXRlO1xuICAgICAgICBpZiAoZGVsZWdhdGUpIHtcbiAgICAgICAgICB2YXIgZGVsZWdhdGVSZXN1bHQgPSBtYXliZUludm9rZURlbGVnYXRlKGRlbGVnYXRlLCBjb250ZXh0KTtcbiAgICAgICAgICBpZiAoZGVsZWdhdGVSZXN1bHQpIHtcbiAgICAgICAgICAgIGlmIChkZWxlZ2F0ZVJlc3VsdCA9PT0gQ29udGludWVTZW50aW5lbCkgY29udGludWU7XG4gICAgICAgICAgICByZXR1cm4gZGVsZWdhdGVSZXN1bHQ7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbnRleHQubWV0aG9kID09PSBcIm5leHRcIikge1xuICAgICAgICAgIC8vIFNldHRpbmcgY29udGV4dC5fc2VudCBmb3IgbGVnYWN5IHN1cHBvcnQgb2YgQmFiZWwnc1xuICAgICAgICAgIC8vIGZ1bmN0aW9uLnNlbnQgaW1wbGVtZW50YXRpb24uXG4gICAgICAgICAgY29udGV4dC5zZW50ID0gY29udGV4dC5fc2VudCA9IGNvbnRleHQuYXJnO1xuXG4gICAgICAgIH0gZWxzZSBpZiAoY29udGV4dC5tZXRob2QgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgIGlmIChzdGF0ZSA9PT0gR2VuU3RhdGVTdXNwZW5kZWRTdGFydCkge1xuICAgICAgICAgICAgc3RhdGUgPSBHZW5TdGF0ZUNvbXBsZXRlZDtcbiAgICAgICAgICAgIHRocm93IGNvbnRleHQuYXJnO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbnRleHQuZGlzcGF0Y2hFeGNlcHRpb24oY29udGV4dC5hcmcpO1xuXG4gICAgICAgIH0gZWxzZSBpZiAoY29udGV4dC5tZXRob2QgPT09IFwicmV0dXJuXCIpIHtcbiAgICAgICAgICBjb250ZXh0LmFicnVwdChcInJldHVyblwiLCBjb250ZXh0LmFyZyk7XG4gICAgICAgIH1cblxuICAgICAgICBzdGF0ZSA9IEdlblN0YXRlRXhlY3V0aW5nO1xuXG4gICAgICAgIHZhciByZWNvcmQgPSB0cnlDYXRjaChpbm5lckZuLCBzZWxmLCBjb250ZXh0KTtcbiAgICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcIm5vcm1hbFwiKSB7XG4gICAgICAgICAgLy8gSWYgYW4gZXhjZXB0aW9uIGlzIHRocm93biBmcm9tIGlubmVyRm4sIHdlIGxlYXZlIHN0YXRlID09PVxuICAgICAgICAgIC8vIEdlblN0YXRlRXhlY3V0aW5nIGFuZCBsb29wIGJhY2sgZm9yIGFub3RoZXIgaW52b2NhdGlvbi5cbiAgICAgICAgICBzdGF0ZSA9IGNvbnRleHQuZG9uZVxuICAgICAgICAgICAgPyBHZW5TdGF0ZUNvbXBsZXRlZFxuICAgICAgICAgICAgOiBHZW5TdGF0ZVN1c3BlbmRlZFlpZWxkO1xuXG4gICAgICAgICAgaWYgKHJlY29yZC5hcmcgPT09IENvbnRpbnVlU2VudGluZWwpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB2YWx1ZTogcmVjb3JkLmFyZyxcbiAgICAgICAgICAgIGRvbmU6IGNvbnRleHQuZG9uZVxuICAgICAgICAgIH07XG5cbiAgICAgICAgfSBlbHNlIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgc3RhdGUgPSBHZW5TdGF0ZUNvbXBsZXRlZDtcbiAgICAgICAgICAvLyBEaXNwYXRjaCB0aGUgZXhjZXB0aW9uIGJ5IGxvb3BpbmcgYmFjayBhcm91bmQgdG8gdGhlXG4gICAgICAgICAgLy8gY29udGV4dC5kaXNwYXRjaEV4Y2VwdGlvbihjb250ZXh0LmFyZykgY2FsbCBhYm92ZS5cbiAgICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwidGhyb3dcIjtcbiAgICAgICAgICBjb250ZXh0LmFyZyA9IHJlY29yZC5hcmc7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgLy8gQ2FsbCBkZWxlZ2F0ZS5pdGVyYXRvcltjb250ZXh0Lm1ldGhvZF0oY29udGV4dC5hcmcpIGFuZCBoYW5kbGUgdGhlXG4gIC8vIHJlc3VsdCwgZWl0aGVyIGJ5IHJldHVybmluZyBhIHsgdmFsdWUsIGRvbmUgfSByZXN1bHQgZnJvbSB0aGVcbiAgLy8gZGVsZWdhdGUgaXRlcmF0b3IsIG9yIGJ5IG1vZGlmeWluZyBjb250ZXh0Lm1ldGhvZCBhbmQgY29udGV4dC5hcmcsXG4gIC8vIHNldHRpbmcgY29udGV4dC5kZWxlZ2F0ZSB0byBudWxsLCBhbmQgcmV0dXJuaW5nIHRoZSBDb250aW51ZVNlbnRpbmVsLlxuICBmdW5jdGlvbiBtYXliZUludm9rZURlbGVnYXRlKGRlbGVnYXRlLCBjb250ZXh0KSB7XG4gICAgdmFyIG1ldGhvZCA9IGRlbGVnYXRlLml0ZXJhdG9yW2NvbnRleHQubWV0aG9kXTtcbiAgICBpZiAobWV0aG9kID09PSB1bmRlZmluZWQpIHtcbiAgICAgIC8vIEEgLnRocm93IG9yIC5yZXR1cm4gd2hlbiB0aGUgZGVsZWdhdGUgaXRlcmF0b3IgaGFzIG5vIC50aHJvd1xuICAgICAgLy8gbWV0aG9kIGFsd2F5cyB0ZXJtaW5hdGVzIHRoZSB5aWVsZCogbG9vcC5cbiAgICAgIGNvbnRleHQuZGVsZWdhdGUgPSBudWxsO1xuXG4gICAgICBpZiAoY29udGV4dC5tZXRob2QgPT09IFwidGhyb3dcIikge1xuICAgICAgICAvLyBOb3RlOiBbXCJyZXR1cm5cIl0gbXVzdCBiZSB1c2VkIGZvciBFUzMgcGFyc2luZyBjb21wYXRpYmlsaXR5LlxuICAgICAgICBpZiAoZGVsZWdhdGUuaXRlcmF0b3JbXCJyZXR1cm5cIl0pIHtcbiAgICAgICAgICAvLyBJZiB0aGUgZGVsZWdhdGUgaXRlcmF0b3IgaGFzIGEgcmV0dXJuIG1ldGhvZCwgZ2l2ZSBpdCBhXG4gICAgICAgICAgLy8gY2hhbmNlIHRvIGNsZWFuIHVwLlxuICAgICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJyZXR1cm5cIjtcbiAgICAgICAgICBjb250ZXh0LmFyZyA9IHVuZGVmaW5lZDtcbiAgICAgICAgICBtYXliZUludm9rZURlbGVnYXRlKGRlbGVnYXRlLCBjb250ZXh0KTtcblxuICAgICAgICAgIGlmIChjb250ZXh0Lm1ldGhvZCA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgICAvLyBJZiBtYXliZUludm9rZURlbGVnYXRlKGNvbnRleHQpIGNoYW5nZWQgY29udGV4dC5tZXRob2QgZnJvbVxuICAgICAgICAgICAgLy8gXCJyZXR1cm5cIiB0byBcInRocm93XCIsIGxldCB0aGF0IG92ZXJyaWRlIHRoZSBUeXBlRXJyb3IgYmVsb3cuXG4gICAgICAgICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwidGhyb3dcIjtcbiAgICAgICAgY29udGV4dC5hcmcgPSBuZXcgVHlwZUVycm9yKFxuICAgICAgICAgIFwiVGhlIGl0ZXJhdG9yIGRvZXMgbm90IHByb3ZpZGUgYSAndGhyb3cnIG1ldGhvZFwiKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfVxuXG4gICAgdmFyIHJlY29yZCA9IHRyeUNhdGNoKG1ldGhvZCwgZGVsZWdhdGUuaXRlcmF0b3IsIGNvbnRleHQuYXJnKTtcblxuICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICBjb250ZXh0Lm1ldGhvZCA9IFwidGhyb3dcIjtcbiAgICAgIGNvbnRleHQuYXJnID0gcmVjb3JkLmFyZztcbiAgICAgIGNvbnRleHQuZGVsZWdhdGUgPSBudWxsO1xuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfVxuXG4gICAgdmFyIGluZm8gPSByZWNvcmQuYXJnO1xuXG4gICAgaWYgKCEgaW5mbykge1xuICAgICAgY29udGV4dC5tZXRob2QgPSBcInRocm93XCI7XG4gICAgICBjb250ZXh0LmFyZyA9IG5ldyBUeXBlRXJyb3IoXCJpdGVyYXRvciByZXN1bHQgaXMgbm90IGFuIG9iamVjdFwiKTtcbiAgICAgIGNvbnRleHQuZGVsZWdhdGUgPSBudWxsO1xuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfVxuXG4gICAgaWYgKGluZm8uZG9uZSkge1xuICAgICAgLy8gQXNzaWduIHRoZSByZXN1bHQgb2YgdGhlIGZpbmlzaGVkIGRlbGVnYXRlIHRvIHRoZSB0ZW1wb3JhcnlcbiAgICAgIC8vIHZhcmlhYmxlIHNwZWNpZmllZCBieSBkZWxlZ2F0ZS5yZXN1bHROYW1lIChzZWUgZGVsZWdhdGVZaWVsZCkuXG4gICAgICBjb250ZXh0W2RlbGVnYXRlLnJlc3VsdE5hbWVdID0gaW5mby52YWx1ZTtcblxuICAgICAgLy8gUmVzdW1lIGV4ZWN1dGlvbiBhdCB0aGUgZGVzaXJlZCBsb2NhdGlvbiAoc2VlIGRlbGVnYXRlWWllbGQpLlxuICAgICAgY29udGV4dC5uZXh0ID0gZGVsZWdhdGUubmV4dExvYztcblxuICAgICAgLy8gSWYgY29udGV4dC5tZXRob2Qgd2FzIFwidGhyb3dcIiBidXQgdGhlIGRlbGVnYXRlIGhhbmRsZWQgdGhlXG4gICAgICAvLyBleGNlcHRpb24sIGxldCB0aGUgb3V0ZXIgZ2VuZXJhdG9yIHByb2NlZWQgbm9ybWFsbHkuIElmXG4gICAgICAvLyBjb250ZXh0Lm1ldGhvZCB3YXMgXCJuZXh0XCIsIGZvcmdldCBjb250ZXh0LmFyZyBzaW5jZSBpdCBoYXMgYmVlblxuICAgICAgLy8gXCJjb25zdW1lZFwiIGJ5IHRoZSBkZWxlZ2F0ZSBpdGVyYXRvci4gSWYgY29udGV4dC5tZXRob2Qgd2FzXG4gICAgICAvLyBcInJldHVyblwiLCBhbGxvdyB0aGUgb3JpZ2luYWwgLnJldHVybiBjYWxsIHRvIGNvbnRpbnVlIGluIHRoZVxuICAgICAgLy8gb3V0ZXIgZ2VuZXJhdG9yLlxuICAgICAgaWYgKGNvbnRleHQubWV0aG9kICE9PSBcInJldHVyblwiKSB7XG4gICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJuZXh0XCI7XG4gICAgICAgIGNvbnRleHQuYXJnID0gdW5kZWZpbmVkO1xuICAgICAgfVxuXG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFJlLXlpZWxkIHRoZSByZXN1bHQgcmV0dXJuZWQgYnkgdGhlIGRlbGVnYXRlIG1ldGhvZC5cbiAgICAgIHJldHVybiBpbmZvO1xuICAgIH1cblxuICAgIC8vIFRoZSBkZWxlZ2F0ZSBpdGVyYXRvciBpcyBmaW5pc2hlZCwgc28gZm9yZ2V0IGl0IGFuZCBjb250aW51ZSB3aXRoXG4gICAgLy8gdGhlIG91dGVyIGdlbmVyYXRvci5cbiAgICBjb250ZXh0LmRlbGVnYXRlID0gbnVsbDtcbiAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgfVxuXG4gIC8vIERlZmluZSBHZW5lcmF0b3IucHJvdG90eXBlLntuZXh0LHRocm93LHJldHVybn0gaW4gdGVybXMgb2YgdGhlXG4gIC8vIHVuaWZpZWQgLl9pbnZva2UgaGVscGVyIG1ldGhvZC5cbiAgZGVmaW5lSXRlcmF0b3JNZXRob2RzKEdwKTtcblxuICBHcFt0b1N0cmluZ1RhZ1N5bWJvbF0gPSBcIkdlbmVyYXRvclwiO1xuXG4gIC8vIEEgR2VuZXJhdG9yIHNob3VsZCBhbHdheXMgcmV0dXJuIGl0c2VsZiBhcyB0aGUgaXRlcmF0b3Igb2JqZWN0IHdoZW4gdGhlXG4gIC8vIEBAaXRlcmF0b3IgZnVuY3Rpb24gaXMgY2FsbGVkIG9uIGl0LiBTb21lIGJyb3dzZXJzJyBpbXBsZW1lbnRhdGlvbnMgb2YgdGhlXG4gIC8vIGl0ZXJhdG9yIHByb3RvdHlwZSBjaGFpbiBpbmNvcnJlY3RseSBpbXBsZW1lbnQgdGhpcywgY2F1c2luZyB0aGUgR2VuZXJhdG9yXG4gIC8vIG9iamVjdCB0byBub3QgYmUgcmV0dXJuZWQgZnJvbSB0aGlzIGNhbGwuIFRoaXMgZW5zdXJlcyB0aGF0IGRvZXNuJ3QgaGFwcGVuLlxuICAvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2ZhY2Vib29rL3JlZ2VuZXJhdG9yL2lzc3Vlcy8yNzQgZm9yIG1vcmUgZGV0YWlscy5cbiAgR3BbaXRlcmF0b3JTeW1ib2xdID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgR3AudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gXCJbb2JqZWN0IEdlbmVyYXRvcl1cIjtcbiAgfTtcblxuICBmdW5jdGlvbiBwdXNoVHJ5RW50cnkobG9jcykge1xuICAgIHZhciBlbnRyeSA9IHsgdHJ5TG9jOiBsb2NzWzBdIH07XG5cbiAgICBpZiAoMSBpbiBsb2NzKSB7XG4gICAgICBlbnRyeS5jYXRjaExvYyA9IGxvY3NbMV07XG4gICAgfVxuXG4gICAgaWYgKDIgaW4gbG9jcykge1xuICAgICAgZW50cnkuZmluYWxseUxvYyA9IGxvY3NbMl07XG4gICAgICBlbnRyeS5hZnRlckxvYyA9IGxvY3NbM107XG4gICAgfVxuXG4gICAgdGhpcy50cnlFbnRyaWVzLnB1c2goZW50cnkpO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVzZXRUcnlFbnRyeShlbnRyeSkge1xuICAgIHZhciByZWNvcmQgPSBlbnRyeS5jb21wbGV0aW9uIHx8IHt9O1xuICAgIHJlY29yZC50eXBlID0gXCJub3JtYWxcIjtcbiAgICBkZWxldGUgcmVjb3JkLmFyZztcbiAgICBlbnRyeS5jb21wbGV0aW9uID0gcmVjb3JkO1xuICB9XG5cbiAgZnVuY3Rpb24gQ29udGV4dCh0cnlMb2NzTGlzdCkge1xuICAgIC8vIFRoZSByb290IGVudHJ5IG9iamVjdCAoZWZmZWN0aXZlbHkgYSB0cnkgc3RhdGVtZW50IHdpdGhvdXQgYSBjYXRjaFxuICAgIC8vIG9yIGEgZmluYWxseSBibG9jaykgZ2l2ZXMgdXMgYSBwbGFjZSB0byBzdG9yZSB2YWx1ZXMgdGhyb3duIGZyb21cbiAgICAvLyBsb2NhdGlvbnMgd2hlcmUgdGhlcmUgaXMgbm8gZW5jbG9zaW5nIHRyeSBzdGF0ZW1lbnQuXG4gICAgdGhpcy50cnlFbnRyaWVzID0gW3sgdHJ5TG9jOiBcInJvb3RcIiB9XTtcbiAgICB0cnlMb2NzTGlzdC5mb3JFYWNoKHB1c2hUcnlFbnRyeSwgdGhpcyk7XG4gICAgdGhpcy5yZXNldCh0cnVlKTtcbiAgfVxuXG4gIGV4cG9ydHMua2V5cyA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICAgIHZhciBrZXlzID0gW107XG4gICAgZm9yICh2YXIga2V5IGluIG9iamVjdCkge1xuICAgICAga2V5cy5wdXNoKGtleSk7XG4gICAgfVxuICAgIGtleXMucmV2ZXJzZSgpO1xuXG4gICAgLy8gUmF0aGVyIHRoYW4gcmV0dXJuaW5nIGFuIG9iamVjdCB3aXRoIGEgbmV4dCBtZXRob2QsIHdlIGtlZXBcbiAgICAvLyB0aGluZ3Mgc2ltcGxlIGFuZCByZXR1cm4gdGhlIG5leHQgZnVuY3Rpb24gaXRzZWxmLlxuICAgIHJldHVybiBmdW5jdGlvbiBuZXh0KCkge1xuICAgICAgd2hpbGUgKGtleXMubGVuZ3RoKSB7XG4gICAgICAgIHZhciBrZXkgPSBrZXlzLnBvcCgpO1xuICAgICAgICBpZiAoa2V5IGluIG9iamVjdCkge1xuICAgICAgICAgIG5leHQudmFsdWUgPSBrZXk7XG4gICAgICAgICAgbmV4dC5kb25lID0gZmFsc2U7XG4gICAgICAgICAgcmV0dXJuIG5leHQ7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gVG8gYXZvaWQgY3JlYXRpbmcgYW4gYWRkaXRpb25hbCBvYmplY3QsIHdlIGp1c3QgaGFuZyB0aGUgLnZhbHVlXG4gICAgICAvLyBhbmQgLmRvbmUgcHJvcGVydGllcyBvZmYgdGhlIG5leHQgZnVuY3Rpb24gb2JqZWN0IGl0c2VsZi4gVGhpc1xuICAgICAgLy8gYWxzbyBlbnN1cmVzIHRoYXQgdGhlIG1pbmlmaWVyIHdpbGwgbm90IGFub255bWl6ZSB0aGUgZnVuY3Rpb24uXG4gICAgICBuZXh0LmRvbmUgPSB0cnVlO1xuICAgICAgcmV0dXJuIG5leHQ7XG4gICAgfTtcbiAgfTtcblxuICBmdW5jdGlvbiB2YWx1ZXMoaXRlcmFibGUpIHtcbiAgICBpZiAoaXRlcmFibGUpIHtcbiAgICAgIHZhciBpdGVyYXRvck1ldGhvZCA9IGl0ZXJhYmxlW2l0ZXJhdG9yU3ltYm9sXTtcbiAgICAgIGlmIChpdGVyYXRvck1ldGhvZCkge1xuICAgICAgICByZXR1cm4gaXRlcmF0b3JNZXRob2QuY2FsbChpdGVyYWJsZSk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2YgaXRlcmFibGUubmV4dCA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIHJldHVybiBpdGVyYWJsZTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFpc05hTihpdGVyYWJsZS5sZW5ndGgpKSB7XG4gICAgICAgIHZhciBpID0gLTEsIG5leHQgPSBmdW5jdGlvbiBuZXh0KCkge1xuICAgICAgICAgIHdoaWxlICgrK2kgPCBpdGVyYWJsZS5sZW5ndGgpIHtcbiAgICAgICAgICAgIGlmIChoYXNPd24uY2FsbChpdGVyYWJsZSwgaSkpIHtcbiAgICAgICAgICAgICAgbmV4dC52YWx1ZSA9IGl0ZXJhYmxlW2ldO1xuICAgICAgICAgICAgICBuZXh0LmRvbmUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgcmV0dXJuIG5leHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgbmV4dC52YWx1ZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICBuZXh0LmRvbmUgPSB0cnVlO1xuXG4gICAgICAgICAgcmV0dXJuIG5leHQ7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIG5leHQubmV4dCA9IG5leHQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gUmV0dXJuIGFuIGl0ZXJhdG9yIHdpdGggbm8gdmFsdWVzLlxuICAgIHJldHVybiB7IG5leHQ6IGRvbmVSZXN1bHQgfTtcbiAgfVxuICBleHBvcnRzLnZhbHVlcyA9IHZhbHVlcztcblxuICBmdW5jdGlvbiBkb25lUmVzdWx0KCkge1xuICAgIHJldHVybiB7IHZhbHVlOiB1bmRlZmluZWQsIGRvbmU6IHRydWUgfTtcbiAgfVxuXG4gIENvbnRleHQucHJvdG90eXBlID0ge1xuICAgIGNvbnN0cnVjdG9yOiBDb250ZXh0LFxuXG4gICAgcmVzZXQ6IGZ1bmN0aW9uKHNraXBUZW1wUmVzZXQpIHtcbiAgICAgIHRoaXMucHJldiA9IDA7XG4gICAgICB0aGlzLm5leHQgPSAwO1xuICAgICAgLy8gUmVzZXR0aW5nIGNvbnRleHQuX3NlbnQgZm9yIGxlZ2FjeSBzdXBwb3J0IG9mIEJhYmVsJ3NcbiAgICAgIC8vIGZ1bmN0aW9uLnNlbnQgaW1wbGVtZW50YXRpb24uXG4gICAgICB0aGlzLnNlbnQgPSB0aGlzLl9zZW50ID0gdW5kZWZpbmVkO1xuICAgICAgdGhpcy5kb25lID0gZmFsc2U7XG4gICAgICB0aGlzLmRlbGVnYXRlID0gbnVsbDtcblxuICAgICAgdGhpcy5tZXRob2QgPSBcIm5leHRcIjtcbiAgICAgIHRoaXMuYXJnID0gdW5kZWZpbmVkO1xuXG4gICAgICB0aGlzLnRyeUVudHJpZXMuZm9yRWFjaChyZXNldFRyeUVudHJ5KTtcblxuICAgICAgaWYgKCFza2lwVGVtcFJlc2V0KSB7XG4gICAgICAgIGZvciAodmFyIG5hbWUgaW4gdGhpcykge1xuICAgICAgICAgIC8vIE5vdCBzdXJlIGFib3V0IHRoZSBvcHRpbWFsIG9yZGVyIG9mIHRoZXNlIGNvbmRpdGlvbnM6XG4gICAgICAgICAgaWYgKG5hbWUuY2hhckF0KDApID09PSBcInRcIiAmJlxuICAgICAgICAgICAgICBoYXNPd24uY2FsbCh0aGlzLCBuYW1lKSAmJlxuICAgICAgICAgICAgICAhaXNOYU4oK25hbWUuc2xpY2UoMSkpKSB7XG4gICAgICAgICAgICB0aGlzW25hbWVdID0gdW5kZWZpbmVkO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBzdG9wOiBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMuZG9uZSA9IHRydWU7XG5cbiAgICAgIHZhciByb290RW50cnkgPSB0aGlzLnRyeUVudHJpZXNbMF07XG4gICAgICB2YXIgcm9vdFJlY29yZCA9IHJvb3RFbnRyeS5jb21wbGV0aW9uO1xuICAgICAgaWYgKHJvb3RSZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgIHRocm93IHJvb3RSZWNvcmQuYXJnO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5ydmFsO1xuICAgIH0sXG5cbiAgICBkaXNwYXRjaEV4Y2VwdGlvbjogZnVuY3Rpb24oZXhjZXB0aW9uKSB7XG4gICAgICBpZiAodGhpcy5kb25lKSB7XG4gICAgICAgIHRocm93IGV4Y2VwdGlvbjtcbiAgICAgIH1cblxuICAgICAgdmFyIGNvbnRleHQgPSB0aGlzO1xuICAgICAgZnVuY3Rpb24gaGFuZGxlKGxvYywgY2F1Z2h0KSB7XG4gICAgICAgIHJlY29yZC50eXBlID0gXCJ0aHJvd1wiO1xuICAgICAgICByZWNvcmQuYXJnID0gZXhjZXB0aW9uO1xuICAgICAgICBjb250ZXh0Lm5leHQgPSBsb2M7XG5cbiAgICAgICAgaWYgKGNhdWdodCkge1xuICAgICAgICAgIC8vIElmIHRoZSBkaXNwYXRjaGVkIGV4Y2VwdGlvbiB3YXMgY2F1Z2h0IGJ5IGEgY2F0Y2ggYmxvY2ssXG4gICAgICAgICAgLy8gdGhlbiBsZXQgdGhhdCBjYXRjaCBibG9jayBoYW5kbGUgdGhlIGV4Y2VwdGlvbiBub3JtYWxseS5cbiAgICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwibmV4dFwiO1xuICAgICAgICAgIGNvbnRleHQuYXJnID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuICEhIGNhdWdodDtcbiAgICAgIH1cblxuICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHJ5RW50cmllcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICB2YXIgZW50cnkgPSB0aGlzLnRyeUVudHJpZXNbaV07XG4gICAgICAgIHZhciByZWNvcmQgPSBlbnRyeS5jb21wbGV0aW9uO1xuXG4gICAgICAgIGlmIChlbnRyeS50cnlMb2MgPT09IFwicm9vdFwiKSB7XG4gICAgICAgICAgLy8gRXhjZXB0aW9uIHRocm93biBvdXRzaWRlIG9mIGFueSB0cnkgYmxvY2sgdGhhdCBjb3VsZCBoYW5kbGVcbiAgICAgICAgICAvLyBpdCwgc28gc2V0IHRoZSBjb21wbGV0aW9uIHZhbHVlIG9mIHRoZSBlbnRpcmUgZnVuY3Rpb24gdG9cbiAgICAgICAgICAvLyB0aHJvdyB0aGUgZXhjZXB0aW9uLlxuICAgICAgICAgIHJldHVybiBoYW5kbGUoXCJlbmRcIik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZW50cnkudHJ5TG9jIDw9IHRoaXMucHJldikge1xuICAgICAgICAgIHZhciBoYXNDYXRjaCA9IGhhc093bi5jYWxsKGVudHJ5LCBcImNhdGNoTG9jXCIpO1xuICAgICAgICAgIHZhciBoYXNGaW5hbGx5ID0gaGFzT3duLmNhbGwoZW50cnksIFwiZmluYWxseUxvY1wiKTtcblxuICAgICAgICAgIGlmIChoYXNDYXRjaCAmJiBoYXNGaW5hbGx5KSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wcmV2IDwgZW50cnkuY2F0Y2hMb2MpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZShlbnRyeS5jYXRjaExvYywgdHJ1ZSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMucHJldiA8IGVudHJ5LmZpbmFsbHlMb2MpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZShlbnRyeS5maW5hbGx5TG9jKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIH0gZWxzZSBpZiAoaGFzQ2F0Y2gpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnByZXYgPCBlbnRyeS5jYXRjaExvYykge1xuICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlKGVudHJ5LmNhdGNoTG9jLCB0cnVlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIH0gZWxzZSBpZiAoaGFzRmluYWxseSkge1xuICAgICAgICAgICAgaWYgKHRoaXMucHJldiA8IGVudHJ5LmZpbmFsbHlMb2MpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZShlbnRyeS5maW5hbGx5TG9jKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJ0cnkgc3RhdGVtZW50IHdpdGhvdXQgY2F0Y2ggb3IgZmluYWxseVwiKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgYWJydXB0OiBmdW5jdGlvbih0eXBlLCBhcmcpIHtcbiAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldO1xuICAgICAgICBpZiAoZW50cnkudHJ5TG9jIDw9IHRoaXMucHJldiAmJlxuICAgICAgICAgICAgaGFzT3duLmNhbGwoZW50cnksIFwiZmluYWxseUxvY1wiKSAmJlxuICAgICAgICAgICAgdGhpcy5wcmV2IDwgZW50cnkuZmluYWxseUxvYykge1xuICAgICAgICAgIHZhciBmaW5hbGx5RW50cnkgPSBlbnRyeTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoZmluYWxseUVudHJ5ICYmXG4gICAgICAgICAgKHR5cGUgPT09IFwiYnJlYWtcIiB8fFxuICAgICAgICAgICB0eXBlID09PSBcImNvbnRpbnVlXCIpICYmXG4gICAgICAgICAgZmluYWxseUVudHJ5LnRyeUxvYyA8PSBhcmcgJiZcbiAgICAgICAgICBhcmcgPD0gZmluYWxseUVudHJ5LmZpbmFsbHlMb2MpIHtcbiAgICAgICAgLy8gSWdub3JlIHRoZSBmaW5hbGx5IGVudHJ5IGlmIGNvbnRyb2wgaXMgbm90IGp1bXBpbmcgdG8gYVxuICAgICAgICAvLyBsb2NhdGlvbiBvdXRzaWRlIHRoZSB0cnkvY2F0Y2ggYmxvY2suXG4gICAgICAgIGZpbmFsbHlFbnRyeSA9IG51bGw7XG4gICAgICB9XG5cbiAgICAgIHZhciByZWNvcmQgPSBmaW5hbGx5RW50cnkgPyBmaW5hbGx5RW50cnkuY29tcGxldGlvbiA6IHt9O1xuICAgICAgcmVjb3JkLnR5cGUgPSB0eXBlO1xuICAgICAgcmVjb3JkLmFyZyA9IGFyZztcblxuICAgICAgaWYgKGZpbmFsbHlFbnRyeSkge1xuICAgICAgICB0aGlzLm1ldGhvZCA9IFwibmV4dFwiO1xuICAgICAgICB0aGlzLm5leHQgPSBmaW5hbGx5RW50cnkuZmluYWxseUxvYztcbiAgICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLmNvbXBsZXRlKHJlY29yZCk7XG4gICAgfSxcblxuICAgIGNvbXBsZXRlOiBmdW5jdGlvbihyZWNvcmQsIGFmdGVyTG9jKSB7XG4gICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICB0aHJvdyByZWNvcmQuYXJnO1xuICAgICAgfVxuXG4gICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwiYnJlYWtcIiB8fFxuICAgICAgICAgIHJlY29yZC50eXBlID09PSBcImNvbnRpbnVlXCIpIHtcbiAgICAgICAgdGhpcy5uZXh0ID0gcmVjb3JkLmFyZztcbiAgICAgIH0gZWxzZSBpZiAocmVjb3JkLnR5cGUgPT09IFwicmV0dXJuXCIpIHtcbiAgICAgICAgdGhpcy5ydmFsID0gdGhpcy5hcmcgPSByZWNvcmQuYXJnO1xuICAgICAgICB0aGlzLm1ldGhvZCA9IFwicmV0dXJuXCI7XG4gICAgICAgIHRoaXMubmV4dCA9IFwiZW5kXCI7XG4gICAgICB9IGVsc2UgaWYgKHJlY29yZC50eXBlID09PSBcIm5vcm1hbFwiICYmIGFmdGVyTG9jKSB7XG4gICAgICAgIHRoaXMubmV4dCA9IGFmdGVyTG9jO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICB9LFxuXG4gICAgZmluaXNoOiBmdW5jdGlvbihmaW5hbGx5TG9jKSB7XG4gICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTtcbiAgICAgICAgaWYgKGVudHJ5LmZpbmFsbHlMb2MgPT09IGZpbmFsbHlMb2MpIHtcbiAgICAgICAgICB0aGlzLmNvbXBsZXRlKGVudHJ5LmNvbXBsZXRpb24sIGVudHJ5LmFmdGVyTG9jKTtcbiAgICAgICAgICByZXNldFRyeUVudHJ5KGVudHJ5KTtcbiAgICAgICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBcImNhdGNoXCI6IGZ1bmN0aW9uKHRyeUxvYykge1xuICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHJ5RW50cmllcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICB2YXIgZW50cnkgPSB0aGlzLnRyeUVudHJpZXNbaV07XG4gICAgICAgIGlmIChlbnRyeS50cnlMb2MgPT09IHRyeUxvYykge1xuICAgICAgICAgIHZhciByZWNvcmQgPSBlbnRyeS5jb21wbGV0aW9uO1xuICAgICAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgICB2YXIgdGhyb3duID0gcmVjb3JkLmFyZztcbiAgICAgICAgICAgIHJlc2V0VHJ5RW50cnkoZW50cnkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gdGhyb3duO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIFRoZSBjb250ZXh0LmNhdGNoIG1ldGhvZCBtdXN0IG9ubHkgYmUgY2FsbGVkIHdpdGggYSBsb2NhdGlvblxuICAgICAgLy8gYXJndW1lbnQgdGhhdCBjb3JyZXNwb25kcyB0byBhIGtub3duIGNhdGNoIGJsb2NrLlxuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiaWxsZWdhbCBjYXRjaCBhdHRlbXB0XCIpO1xuICAgIH0sXG5cbiAgICBkZWxlZ2F0ZVlpZWxkOiBmdW5jdGlvbihpdGVyYWJsZSwgcmVzdWx0TmFtZSwgbmV4dExvYykge1xuICAgICAgdGhpcy5kZWxlZ2F0ZSA9IHtcbiAgICAgICAgaXRlcmF0b3I6IHZhbHVlcyhpdGVyYWJsZSksXG4gICAgICAgIHJlc3VsdE5hbWU6IHJlc3VsdE5hbWUsXG4gICAgICAgIG5leHRMb2M6IG5leHRMb2NcbiAgICAgIH07XG5cbiAgICAgIGlmICh0aGlzLm1ldGhvZCA9PT0gXCJuZXh0XCIpIHtcbiAgICAgICAgLy8gRGVsaWJlcmF0ZWx5IGZvcmdldCB0aGUgbGFzdCBzZW50IHZhbHVlIHNvIHRoYXQgd2UgZG9uJ3RcbiAgICAgICAgLy8gYWNjaWRlbnRhbGx5IHBhc3MgaXQgb24gdG8gdGhlIGRlbGVnYXRlLlxuICAgICAgICB0aGlzLmFyZyA9IHVuZGVmaW5lZDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfVxuICB9O1xuXG4gIC8vIFJlZ2FyZGxlc3Mgb2Ygd2hldGhlciB0aGlzIHNjcmlwdCBpcyBleGVjdXRpbmcgYXMgYSBDb21tb25KUyBtb2R1bGVcbiAgLy8gb3Igbm90LCByZXR1cm4gdGhlIHJ1bnRpbWUgb2JqZWN0IHNvIHRoYXQgd2UgY2FuIGRlY2xhcmUgdGhlIHZhcmlhYmxlXG4gIC8vIHJlZ2VuZXJhdG9yUnVudGltZSBpbiB0aGUgb3V0ZXIgc2NvcGUsIHdoaWNoIGFsbG93cyB0aGlzIG1vZHVsZSB0byBiZVxuICAvLyBpbmplY3RlZCBlYXNpbHkgYnkgYGJpbi9yZWdlbmVyYXRvciAtLWluY2x1ZGUtcnVudGltZSBzY3JpcHQuanNgLlxuICByZXR1cm4gZXhwb3J0cztcblxufShcbiAgLy8gSWYgdGhpcyBzY3JpcHQgaXMgZXhlY3V0aW5nIGFzIGEgQ29tbW9uSlMgbW9kdWxlLCB1c2UgbW9kdWxlLmV4cG9ydHNcbiAgLy8gYXMgdGhlIHJlZ2VuZXJhdG9yUnVudGltZSBuYW1lc3BhY2UuIE90aGVyd2lzZSBjcmVhdGUgYSBuZXcgZW1wdHlcbiAgLy8gb2JqZWN0LiBFaXRoZXIgd2F5LCB0aGUgcmVzdWx0aW5nIG9iamVjdCB3aWxsIGJlIHVzZWQgdG8gaW5pdGlhbGl6ZVxuICAvLyB0aGUgcmVnZW5lcmF0b3JSdW50aW1lIHZhcmlhYmxlIGF0IHRoZSB0b3Agb2YgdGhpcyBmaWxlLlxuICB0eXBlb2YgbW9kdWxlID09PSBcIm9iamVjdFwiID8gbW9kdWxlLmV4cG9ydHMgOiB7fVxuKSk7XG5cbnRyeSB7XG4gIHJlZ2VuZXJhdG9yUnVudGltZSA9IHJ1bnRpbWU7XG59IGNhdGNoIChhY2NpZGVudGFsU3RyaWN0TW9kZSkge1xuICAvLyBUaGlzIG1vZHVsZSBzaG91bGQgbm90IGJlIHJ1bm5pbmcgaW4gc3RyaWN0IG1vZGUsIHNvIHRoZSBhYm92ZVxuICAvLyBhc3NpZ25tZW50IHNob3VsZCBhbHdheXMgd29yayB1bmxlc3Mgc29tZXRoaW5nIGlzIG1pc2NvbmZpZ3VyZWQuIEp1c3RcbiAgLy8gaW4gY2FzZSBydW50aW1lLmpzIGFjY2lkZW50YWxseSBydW5zIGluIHN0cmljdCBtb2RlLCB3ZSBjYW4gZXNjYXBlXG4gIC8vIHN0cmljdCBtb2RlIHVzaW5nIGEgZ2xvYmFsIEZ1bmN0aW9uIGNhbGwuIFRoaXMgY291bGQgY29uY2VpdmFibHkgZmFpbFxuICAvLyBpZiBhIENvbnRlbnQgU2VjdXJpdHkgUG9saWN5IGZvcmJpZHMgdXNpbmcgRnVuY3Rpb24sIGJ1dCBpbiB0aGF0IGNhc2VcbiAgLy8gdGhlIHByb3BlciBzb2x1dGlvbiBpcyB0byBmaXggdGhlIGFjY2lkZW50YWwgc3RyaWN0IG1vZGUgcHJvYmxlbS4gSWZcbiAgLy8geW91J3ZlIG1pc2NvbmZpZ3VyZWQgeW91ciBidW5kbGVyIHRvIGZvcmNlIHN0cmljdCBtb2RlIGFuZCBhcHBsaWVkIGFcbiAgLy8gQ1NQIHRvIGZvcmJpZCBGdW5jdGlvbiwgYW5kIHlvdSdyZSBub3Qgd2lsbGluZyB0byBmaXggZWl0aGVyIG9mIHRob3NlXG4gIC8vIHByb2JsZW1zLCBwbGVhc2UgZGV0YWlsIHlvdXIgdW5pcXVlIHByZWRpY2FtZW50IGluIGEgR2l0SHViIGlzc3VlLlxuICBGdW5jdGlvbihcInJcIiwgXCJyZWdlbmVyYXRvclJ1bnRpbWUgPSByXCIpKHJ1bnRpbWUpO1xufVxuIiwiLyogZXNsaW50LWRpc2FibGUgcmVhY3QvcHJvcC10eXBlcyAqL1xuLyoqIEBqc3ggQSAqL1xuaW1wb3J0IHsgQSB9IGZyb20gJy4uLy4uLy4uL2xpYic7XG5cbmltcG9ydCB7IEZvY3VzRmllbGQgfSBmcm9tICcuL0RPTSc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIENoZWNrRm9yRWRpdEZpZWxkKHsgdG9kb3MgfSkge1xuICByZXR1cm4gPEZvY3VzRmllbGQgaW5kZXg9eyB0b2Rvcy5maW5kSW5kZXgoKHsgZWRpdGluZyB9KSA9PiBlZGl0aW5nKSB9IC8+O1xufVxuIiwiaW1wb3J0IHtcbiAgVE9HR0xFLFxuICBORVdfVE9ETyxcbiAgREVMRVRFLFxuICBFRElULFxuICBFRElUX1RPRE8sXG4gIENMRUFSX0NPTVBMRVRFRFxufSBmcm9tICcuL1N0b3JlJztcbmltcG9ydCB7XG4gIEZJTFRFUl9BTEwsXG4gIEZJTFRFUl9BQ1RJVkUsXG4gIEZJTFRFUl9DT01QTEVURURcbn0gZnJvbSAnLi8nO1xuaW1wb3J0IHsgdXNlRWZmZWN0IH0gZnJvbSAnLi4vLi4vLi4vbGliJztcblxuY29uc3QgJCA9IChzZWxlY3RvcikgPT4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik7XG5jb25zdCBsaXN0ID0gJCgnLnRvZG8tbGlzdCcpO1xuY29uc3QgaGVhZGVyID0gJCgnLmhlYWRlcicpO1xuXG5jb25zdCBFTlRFUiA9IDEzO1xuY29uc3QgRVNDID0gMjc7XG5cbmV4cG9ydCBmdW5jdGlvbiBGaWxsQ29udGFpbmVyKHsgY2hpbGRyZW4gfSkge1xuICBsaXN0LmlubmVySFRNTCA9IGNoaWxkcmVuKCk7XG59XG5leHBvcnQgZnVuY3Rpb24gQ29udGFpbmVyKHsgb25Vc2VyQWN0aW9uIH0pIHtcbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBsaXN0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgIGNvbnN0IHRvZG9JbmRleCA9IHBhcnNlSW50KGUudGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1pbmRleCcpLCAxMCk7XG5cbiAgICAgIGlmIChlLnRhcmdldC5oYXNBdHRyaWJ1dGUoJ2RhdGEtdG9nZ2xlJykpIHtcbiAgICAgICAgb25Vc2VyQWN0aW9uKFRPR0dMRSwgdG9kb0luZGV4KTtcbiAgICAgIH0gZWxzZSBpZiAoZS50YXJnZXQuaGFzQXR0cmlidXRlKCdkYXRhLWRlbGV0ZScpKSB7XG4gICAgICAgIG9uVXNlckFjdGlvbihERUxFVEUsIHRvZG9JbmRleCk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgbGlzdC5hZGRFdmVudExpc3RlbmVyKCdkYmxjbGljaycsIChlKSA9PiB7XG4gICAgICBjb25zdCB0b2RvSW5kZXggPSBwYXJzZUludChlLnRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtaW5kZXgnKSwgMTApO1xuXG4gICAgICBpZiAoZS50YXJnZXQuaGFzQXR0cmlidXRlKCdkYXRhLWxhYmVsJykpIHtcbiAgICAgICAgb25Vc2VyQWN0aW9uKEVESVQsIHRvZG9JbmRleCk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgbGlzdC5hZGRFdmVudExpc3RlbmVyKCdmb2N1c291dCcsIChlKSA9PiB7XG4gICAgICBjb25zdCB0b2RvSW5kZXggPSBwYXJzZUludChlLnRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtaW5kZXgnKSwgMTApO1xuXG4gICAgICBpZiAoZS50YXJnZXQuaGFzQXR0cmlidXRlKCdkYXRhLWVkaXQnKSkge1xuICAgICAgICBvblVzZXJBY3Rpb24oRURJVF9UT0RPLCB7IGluZGV4OiB0b2RvSW5kZXgsIGxhYmVsOiBlLnRhcmdldC52YWx1ZSB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBsaXN0LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgKGUpID0+IHtcbiAgICAgIGNvbnN0IHRvZG9JbmRleCA9IHBhcnNlSW50KGUudGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1pbmRleCcpLCAxMCk7XG5cbiAgICAgIGlmIChlLnRhcmdldC5oYXNBdHRyaWJ1dGUoJ2RhdGEtZWRpdCcpICYmIGUua2V5Q29kZSA9PT0gRU5URVIpIHtcbiAgICAgICAgb25Vc2VyQWN0aW9uKEVESVRfVE9ETywgeyBpbmRleDogdG9kb0luZGV4LCBsYWJlbDogZS50YXJnZXQudmFsdWUgfSk7XG4gICAgICB9IGVsc2UgaWYgKGUudGFyZ2V0Lmhhc0F0dHJpYnV0ZSgnZGF0YS1lZGl0JykgJiYgZS5rZXlDb2RlID09PSBFU0MpIHtcbiAgICAgICAgb25Vc2VyQWN0aW9uKEVESVQsIHRvZG9JbmRleCk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgaGVhZGVyLmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgKGUpID0+IHtcbiAgICAgIGlmIChlLnRhcmdldC5oYXNBdHRyaWJ1dGUoJ2RhdGEtbmV3JykgJiYgZS5rZXlDb2RlID09PSBFTlRFUikge1xuICAgICAgICBvblVzZXJBY3Rpb24oTkVXX1RPRE8sIGUudGFyZ2V0LnZhbHVlKTtcbiAgICAgICAgZS50YXJnZXQudmFsdWUgPSAnJztcbiAgICAgIH1cbiAgICB9KTtcbiAgfSwgW10pO1xufVxuZXhwb3J0IGZ1bmN0aW9uIEZvY3VzRmllbGQoeyBpbmRleCB9KSB7XG4gIGNvbnN0IGVsID0gJChgLmVkaXRbZGF0YS1pbmRleD1cIiR7IGluZGV4IH1cIl1gKTtcblxuICBpZiAoZWwpIHtcbiAgICBlbC5mb2N1cygpO1xuICAgIGVsLnNlbGVjdGlvblN0YXJ0ID0gZWwuc2VsZWN0aW9uRW5kID0gZWwudmFsdWUubGVuZ3RoO1xuICB9XG59O1xuZXhwb3J0IGZ1bmN0aW9uIFByb2dyZXNzQ2hlY2tlcih7IHRvZG9zIH0pIHtcbiAgY29uc3QgY29tcGxldGVkID0gdG9kb3MuZmlsdGVyKCh7IGNvbXBsZXRlZCB9KSA9PiBjb21wbGV0ZWQpLmxlbmd0aDtcbiAgY29uc3QgaXRlbXNMZWZ0ID0gdG9kb3MubGVuZ3RoIC0gY29tcGxldGVkO1xuXG4gICQoJ1tkYXRhLWNvdW50XScpLmlubmVySFRNTCA9IGBcbiAgICA8c3Ryb25nPiR7IGl0ZW1zTGVmdCB9PC9zdHJvbmc+ICR7IGl0ZW1zTGVmdCA+IDEgfHwgaXRlbXNMZWZ0ID09PSAwID8gJ2l0ZW1zJyA6ICdpdGVtJyB9IGxlZnRcbiAgYDtcbn07XG5leHBvcnQgZnVuY3Rpb24gRm9vdGVyKHsgb25Vc2VyQWN0aW9uIH0pIHtcbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICAkKCdbZGF0YS1maWx0ZXJdJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgaWYgKGUudGFyZ2V0Lmhhc0F0dHJpYnV0ZSgnZGF0YS1hbGwnKSkge1xuICAgICAgICBvblVzZXJBY3Rpb24oRklMVEVSX0FMTCk7XG4gICAgICB9IGVsc2UgaWYgKGUudGFyZ2V0Lmhhc0F0dHJpYnV0ZSgnZGF0YS1hY3RpdmUnKSkge1xuICAgICAgICBvblVzZXJBY3Rpb24oRklMVEVSX0FDVElWRSk7XG4gICAgICB9IGVsc2UgaWYgKGUudGFyZ2V0Lmhhc0F0dHJpYnV0ZSgnZGF0YS1jb21wbGV0ZWQnKSkge1xuICAgICAgICBvblVzZXJBY3Rpb24oRklMVEVSX0NPTVBMRVRFRCk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgJCgnW2RhdGEtY2xlYXItY29tcGxldGVkXScpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgb25Vc2VyQWN0aW9uKENMRUFSX0NPTVBMRVRFRCk7XG4gICAgfSk7XG4gIH0sIFtdKTtcbn07XG5leHBvcnQgZnVuY3Rpb24gRmlsdGVyT3B0aW9uc1RhYnMoeyBmaWx0ZXIgfSkge1xuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgICQoJ1tkYXRhLWFsbF0nKS5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgZmlsdGVyID09PSBGSUxURVJfQUxMID8gJ3NlbGVjdGVkJyA6ICcnKTtcbiAgICAkKCdbZGF0YS1hY3RpdmVdJykuc2V0QXR0cmlidXRlKCdjbGFzcycsIGZpbHRlciA9PT0gRklMVEVSX0FDVElWRSA/ICdzZWxlY3RlZCcgOiAnJyk7XG4gICAgJCgnW2RhdGEtY29tcGxldGVkXScpLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCBmaWx0ZXIgPT09IEZJTFRFUl9DT01QTEVURUQgPyAnc2VsZWN0ZWQnIDogJycpO1xuICB9LCBbIGZpbHRlciBdKTtcbn1cbiIsImltcG9ydCB7IHVzZVN0YXRlIH0gZnJvbSAnLi4vLi4vLi4vbGliJztcblxuaW1wb3J0IHsgVG9EbyB9IGZyb20gJy4vU3RvcmUnO1xuXG5jb25zdCBpbml0aWFsVmFsdWUgPSBKU09OLnN0cmluZ2lmeShbXG4gIFRvRG8oeyBsYWJlbDogJ0FjdE1MIGlzIHVzaW5nIEpTWCcgfSksXG4gIFRvRG8oeyBsYWJlbDogJ0l0IGlzIGxpa2UgUmVhY3QgYnV0IG5vdCBmb3IgcmVuZGVyaW5nJyB9KVxuXSk7XG5cbmV4cG9ydCBjb25zdCB1c2VMb2NhbFN0b3JhZ2UgPSAoKSA9PiB7XG4gIGNvbnN0IFsgZ2V0RGF0YSBdID0gdXNlU3RhdGUoSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndG9kb3MnKSB8fCBpbml0aWFsVmFsdWUpKTtcblxuICByZXR1cm4gZ2V0RGF0YSgpO1xufTtcbmV4cG9ydCBjb25zdCBQZXJzaXN0ID0gKHsgdG9kb3MgfSkgPT4ge1xuICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgndG9kb3MnLCBKU09OLnN0cmluZ2lmeSh0b2RvcykpO1xufTtcbiIsIi8qIGVzbGludC1kaXNhYmxlIHJlYWN0L3Byb3AtdHlwZXMgKi9cbi8qKiBAanN4IEEgKi9cbmltcG9ydCB7IEEgfSBmcm9tICcuLi8uLi8uLi9saWInO1xuXG5pbXBvcnQgeyBGaWxsQ29udGFpbmVyIH0gZnJvbSAnLi9ET00nO1xuaW1wb3J0IHsgRklMVEVSX0FMTCwgRklMVEVSX0FDVElWRSwgRklMVEVSX0NPTVBMRVRFRCB9IGZyb20gJy4vJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gUmVuZGVyZXIoeyB0b2RvcywgZmlsdGVyIH0pIHtcbiAgcmV0dXJuIChcbiAgICA8RmlsbENvbnRhaW5lcj5cbiAgICAgIHtcbiAgICAgICAgKCkgPT4gdG9kb3NcbiAgICAgICAgLmZpbHRlcigoeyBjb21wbGV0ZWQgfSkgPT4ge1xuICAgICAgICAgIGlmIChmaWx0ZXIgPT09IEZJTFRFUl9BTEwpIHJldHVybiB0cnVlO1xuICAgICAgICAgIGlmIChmaWx0ZXIgPT09IEZJTFRFUl9BQ1RJVkUpIHJldHVybiAhY29tcGxldGVkO1xuICAgICAgICAgIGlmIChmaWx0ZXIgPT09IEZJTFRFUl9DT01QTEVURUQpIHJldHVybiBjb21wbGV0ZWQ7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9KS5tYXAoKHRvZG8sIGkpID0+IHtcbiAgICAgICAgICBjb25zdCBsaUNsYXNzID0gdG9kby5lZGl0aW5nID8gJ2VkaXRpbmcnIDogKHRvZG8uY29tcGxldGVkID8gJ2NvbXBsZXRlZCcgOiAnJyk7XG5cbiAgICAgICAgICByZXR1cm4gYFxuICAgICAgICAgICAgPGxpIGNsYXNzPSckeyBsaUNsYXNzIH0nPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidmlld1wiPlxuICAgICAgICAgICAgICAgIDxpbnB1dCBcbiAgICAgICAgICAgICAgICAgIGNsYXNzPVwidG9nZ2xlXCJcbiAgICAgICAgICAgICAgICAgIHR5cGU9XCJjaGVja2JveFwiXG4gICAgICAgICAgICAgICAgICBkYXRhLWluZGV4PVwiJHsgaSB9XCJcbiAgICAgICAgICAgICAgICAgIGRhdGEtdG9nZ2xlXG4gICAgICAgICAgICAgICAgICAkeyB0b2RvLmNvbXBsZXRlZCA/ICdjaGVja2VkJyA6ICcnIH0+XG4gICAgICAgICAgICAgICAgPGxhYmVsIGRhdGEtaW5kZXg9XCIkeyBpIH1cIiBkYXRhLWxhYmVsPiR7IHRvZG8ubGFiZWwgfTwvbGFiZWw+XG4gICAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgICAgY2xhc3M9XCJkZXN0cm95XCJcbiAgICAgICAgICAgICAgICAgIGRhdGEtaW5kZXg9XCIkeyBpIH1cIlxuICAgICAgICAgICAgICAgICAgZGF0YS1kZWxldGU+PC9idXR0b24+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8aW5wdXQgY2xhc3M9XCJlZGl0XCIgdmFsdWU9XCIkeyB0b2RvLmxhYmVsIH1cIiBkYXRhLWluZGV4PVwiJHsgaSB9XCIgZGF0YS1lZGl0PlxuICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICBgO1xuICAgICAgICB9KS5qb2luKCcnKVxuICAgICAgfVxuICAgIDwvRmlsbENvbnRhaW5lcj5cbiAgKTtcbn07XG4iLCIvKiBlc2xpbnQtZGlzYWJsZSByZWFjdC9wcm9wLXR5cGVzICovXG4vKiogQGpzeCBBICovXG5pbXBvcnQgeyB1c2VSZWR1Y2VyLCB1c2VQdWJTdWIsIHVzZUVmZmVjdCB9IGZyb20gJy4uLy4uLy4uL2xpYic7XG5cbmV4cG9ydCBjb25zdCBUT0dHTEUgPSAnVE9HR0xFJztcbmV4cG9ydCBjb25zdCBORVdfVE9ETyA9ICdORVdfVE9ETyc7XG5leHBvcnQgY29uc3QgREVMRVRFID0gJ0RFTEVURSc7XG5leHBvcnQgY29uc3QgRURJVCA9ICdFRElUJztcbmV4cG9ydCBjb25zdCBFRElUX1RPRE8gPSAnRURJVF9UT0RPJztcbmV4cG9ydCBjb25zdCBDTEVBUl9DT01QTEVURUQgPSAnQ0xFQVJfQ09NUExFVEVEJztcblxuY29uc3QgdG9nZ2xlID0gKHRvZG9JbmRleCkgPT4gKHsgdHlwZTogVE9HR0xFLCB0b2RvSW5kZXggfSk7XG5jb25zdCBkZWxldGVUb2RvID0gKHRvZG9JbmRleCkgPT4gKHsgdHlwZTogREVMRVRFLCB0b2RvSW5kZXggfSk7XG5jb25zdCBuZXdUb2RvID0gKGxhYmVsKSA9PiAoeyB0eXBlOiBORVdfVE9ETywgbGFiZWwgfSk7XG5jb25zdCBlZGl0ID0gKHRvZG9JbmRleCkgPT4gKHsgdHlwZTogRURJVCwgdG9kb0luZGV4IH0pO1xuY29uc3QgZWRpdFRvRG8gPSAoeyBpbmRleCwgbGFiZWwgfSkgPT4gKHsgdHlwZTogRURJVF9UT0RPLCBpbmRleCwgbGFiZWwgfSk7XG5jb25zdCBjbGVhckNvbXBsZXRlZCA9ICgpID0+ICh7IHR5cGU6IENMRUFSX0NPTVBMRVRFRCB9KTtcblxuZXhwb3J0IGNvbnN0IFRvRG8gPSAoeyBsYWJlbCB9KSA9PiAoeyBsYWJlbCwgY29tcGxldGVkOiBmYWxzZSwgZWRpdGluZzogZmFsc2UgfSk7XG5cbmNvbnN0IHJlZHVjZXIgPSBmdW5jdGlvbiAodG9kb3MsIGFjdGlvbikge1xuICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XG4gICAgY2FzZSBUT0dHTEU6XG4gICAgICByZXR1cm4gdG9kb3MubWFwKCh0b2RvLCBpbmRleCkgPT4ge1xuICAgICAgICBpZiAoaW5kZXggPT09IGFjdGlvbi50b2RvSW5kZXgpIHtcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgLi4udG9kbyxcbiAgICAgICAgICAgIGNvbXBsZXRlZDogIXRvZG8uY29tcGxldGVkXG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdG9kbztcbiAgICAgIH0pO1xuICAgIGNhc2UgRURJVDpcbiAgICAgIHJldHVybiB0b2Rvcy5tYXAoKHRvZG8sIGluZGV4KSA9PiB7XG4gICAgICAgIGlmIChpbmRleCA9PT0gYWN0aW9uLnRvZG9JbmRleCkge1xuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAuLi50b2RvLFxuICAgICAgICAgICAgZWRpdGluZzogIXRvZG8uZWRpdGluZ1xuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAuLi50b2RvLFxuICAgICAgICAgIGVkaXRpbmc6IGZhbHNlXG4gICAgICAgIH07XG4gICAgICB9KTtcbiAgICBjYXNlIEVESVRfVE9ETzpcbiAgICAgIHJldHVybiB0b2Rvcy5tYXAoKHRvZG8sIGluZGV4KSA9PiB7XG4gICAgICAgIGlmIChpbmRleCA9PT0gYWN0aW9uLmluZGV4KSB7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIC4uLnRvZG8sXG4gICAgICAgICAgICBsYWJlbDogYWN0aW9uLmxhYmVsLFxuICAgICAgICAgICAgZWRpdGluZzogZmFsc2VcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0b2RvO1xuICAgICAgfSk7XG4gICAgY2FzZSBORVdfVE9ETzpcbiAgICAgIHJldHVybiBbIC4uLnRvZG9zLCBUb0RvKHsgbGFiZWw6IGFjdGlvbi5sYWJlbCB9KSBdO1xuICAgIGNhc2UgREVMRVRFOlxuICAgICAgcmV0dXJuIHRvZG9zLmZpbHRlcigodG9kbywgaW5kZXgpID0+IGluZGV4ICE9PSBhY3Rpb24udG9kb0luZGV4KTtcbiAgICBjYXNlIENMRUFSX0NPTVBMRVRFRDpcbiAgICAgIHJldHVybiB0b2Rvcy5maWx0ZXIoKHRvZG8pID0+ICF0b2RvLmNvbXBsZXRlZCk7XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiB0b2RvcztcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gU3RvcmUoeyBpbml0aWFsVmFsdWUsIGNoaWxkcmVuIH0pIHtcbiAgY29uc3QgWyB0b2RvcywgZGlzcGF0Y2ggXSA9IHVzZVJlZHVjZXIocmVkdWNlciwgaW5pdGlhbFZhbHVlKTtcbiAgY29uc3QgeyBzdWJzY3JpYmUgfSA9IHVzZVB1YlN1YigpO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgc3Vic2NyaWJlKFRPR0dMRSwgKHRvZG9JbmRleCkgPT4gZGlzcGF0Y2godG9nZ2xlKHRvZG9JbmRleCkpKTtcbiAgICBzdWJzY3JpYmUoTkVXX1RPRE8sIChsYWJlbCkgPT4gZGlzcGF0Y2gobmV3VG9kbyhsYWJlbCkpKTtcbiAgICBzdWJzY3JpYmUoREVMRVRFLCAodG9kb0luZGV4KSA9PiBkaXNwYXRjaChkZWxldGVUb2RvKHRvZG9JbmRleCkpKTtcbiAgICBzdWJzY3JpYmUoRURJVCwgKGxhYmVsKSA9PiBkaXNwYXRjaChlZGl0KGxhYmVsKSkpO1xuICAgIHN1YnNjcmliZShFRElUX1RPRE8sIChwYXlsb2FkKSA9PiBkaXNwYXRjaChlZGl0VG9EbyhwYXlsb2FkKSkpO1xuICAgIHN1YnNjcmliZShDTEVBUl9DT01QTEVURUQsICgpID0+IGRpc3BhdGNoKGNsZWFyQ29tcGxldGVkKCkpKTtcbiAgfSwgW10pO1xuXG4gIGNoaWxkcmVuKHsgdG9kb3M6IHRvZG9zKCkgfSk7XG59XG4iLCIvKiogQGpzeCBBICovXG5pbXBvcnQgeyBBLCBydW4sIEZyYWdtZW50LCB1c2VQdWJTdWIsIHVzZVN0YXRlLCB1c2VFZmZlY3QsIHByb2Nlc3NvciB9IGZyb20gJy4uLy4uLy4uL2xpYic7XG5pbXBvcnQgaW5zcGVjdG9yIGZyb20gJ2FjdG1sLWluc3BlY3Rvcic7XG5cbmluc3BlY3Rvci53YXRjaChwcm9jZXNzb3IpO1xuY29uc29sZS5sb2coaW5zcGVjdG9yKTtcblxuaW1wb3J0IFN0b3JlIGZyb20gJy4vU3RvcmUnO1xuaW1wb3J0IFJlbmRlcmVyIGZyb20gJy4vUmVuZGVyZXInO1xuaW1wb3J0IENoZWNrRm9yRWRpdEZpZWxkIGZyb20gJy4vQ2hlY2tGb3JFZGl0RmllbGQnO1xuaW1wb3J0IHsgUHJvZ3Jlc3NDaGVja2VyLCBGaWx0ZXJPcHRpb25zVGFicywgQ29udGFpbmVyLCBGb290ZXIgfSBmcm9tICcuL0RPTSc7XG5pbXBvcnQgeyB1c2VMb2NhbFN0b3JhZ2UsIFBlcnNpc3QgfSBmcm9tICcuL1BlcnNpc3QnO1xuXG5leHBvcnQgY29uc3QgRklMVEVSX0FMTCA9ICdGSUxURVJfQUxMJztcbmV4cG9ydCBjb25zdCBGSUxURVJfQUNUSVZFID0gJ0ZJTFRFUl9BQ1RJVkUnO1xuZXhwb3J0IGNvbnN0IEZJTFRFUl9DT01QTEVURUQgPSAnRklMVEVSX0NPTVBMRVRFRCc7XG5cbmZ1bmN0aW9uIEFwcCgpIHtcbiAgY29uc3QgaW5pdGlhbFZhbHVlID0gdXNlTG9jYWxTdG9yYWdlKCk7XG4gIGNvbnN0IHsgcHVibGlzaCwgc3Vic2NyaWJlIH0gPSB1c2VQdWJTdWIoKTtcbiAgY29uc3QgWyBmaWx0ZXIsIHNldEZpbHRlciBdID0gdXNlU3RhdGUoRklMVEVSX0FMTCk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBzdWJzY3JpYmUoRklMVEVSX0FMTCwgKCkgPT4gc2V0RmlsdGVyKEZJTFRFUl9BTEwpKTtcbiAgICBzdWJzY3JpYmUoRklMVEVSX0FDVElWRSwgKCkgPT4gc2V0RmlsdGVyKEZJTFRFUl9BQ1RJVkUpKTtcbiAgICBzdWJzY3JpYmUoRklMVEVSX0NPTVBMRVRFRCwgKCkgPT4gc2V0RmlsdGVyKEZJTFRFUl9DT01QTEVURUQpKTtcbiAgfSwgW10pO1xuXG4gIHJldHVybiAoXG4gICAgPEZyYWdtZW50PlxuICAgICAgPENvbnRhaW5lciBvblVzZXJBY3Rpb249eyBwdWJsaXNoIH0gLz5cbiAgICAgIDxGb290ZXIgb25Vc2VyQWN0aW9uPXsgcHVibGlzaCB9Lz5cbiAgICAgIDxTdG9yZSBpbml0aWFsVmFsdWU9eyBpbml0aWFsVmFsdWUgfT5cbiAgICAgICAgPEZpbHRlck9wdGlvbnNUYWJzIGZpbHRlcj17IGZpbHRlcigpIH0gLz5cbiAgICAgICAgPFJlbmRlcmVyIGZpbHRlcj17IGZpbHRlcigpIH0vPlxuICAgICAgICA8Q2hlY2tGb3JFZGl0RmllbGQgLz5cbiAgICAgICAgPFByb2dyZXNzQ2hlY2tlciAvPlxuICAgICAgICA8UGVyc2lzdCAvPlxuICAgICAgPC9TdG9yZT5cbiAgICA8L0ZyYWdtZW50PlxuICApO1xufTtcblxucnVuKDxBcHAgLz4pO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==