const assert = require('assert');
const { format } = require('util');
const { Console } = require('console');

function simpleFormatter() {
  const TITLE_INDENT = '    ';
  const CONSOLE_INDENT = `${TITLE_INDENT}  `;

  return (type, message) => {
    message = message
      .split(/\n/)
      .map(line => CONSOLE_INDENT + line)
      .join('\n');

    return message;
  };
}

class SimpleConsole extends Console {
  constructor(stdout, stderr, formatBuffer) {
    super(stdout, stderr);
    this._formatBuffer = formatBuffer || simpleFormatter();
    this._counters = {};
    this._timers = {};
    this._groupDepth = 0;
  }

  _logToParentConsole(message) {
    super.log(message);
  }

  _log(type, message) {
    if (process.stdout.isTTY) {
      this._stdout.write('\x1b[999D\x1b[K');
    }
    this._logToParentConsole(
      this._formatBuffer(type, '  '.repeat(this._groupDepth) + message)
    );
  }

  assert(...args) {
    try {
      assert(...args);
    } catch (error) {
      this._log('assert', error.toString());
    }
  }

  count(label = 'default') {
    if (!this._counters[label]) {
      this._counters[label] = 0;
    }

    this._log('count', format(`${label}: ${++this._counters[label]}`));
  }

  countReset(label = 'default') {
    this._counters[label] = 0;
  }

  debug(...args) {
    this._log('debug', format(...args));
  }

  dir(...args) {
    this._log('dir', format(...args));
  }

  dirxml(...args) {
    this._log('dirxml', format(...args));
  }

  error(...args) {
    this._log('error', format(...args));
  }

  group(...args) {
    this._groupDepth++;

    if (args.length > 0) {
      this._log('group', format(...args));
    }
  }

  groupCollapsed(...args) {
    this._groupDepth++;

    if (args.length > 0) {
      this._log('groupCollapsed', format(...args));
    }
  }

  groupEnd() {
    if (this._groupDepth > 0) {
      this._groupDepth--;
    }
  }

  info(...args) {
    this._log('info', format(...args));
  }

  log(...args) {
    this._log('log', format(...args));
  }

  time(label = 'default') {
    if (this._timers[label]) {
      return;
    }

    this._timers[label] = new Date();
  }

  timeEnd(label = 'default') {
    const startTime = this._timers[label];

    if (startTime) {
      const endTime = new Date();
      const time = endTime - startTime;

      this._log('time', format(`${label}: ${time}ms`));
      delete this._timers[label];
    }
  }

  warn(...args) {
    this._log('warn', format(...args));
  }

  getBuffer() {
    return null;
  }
}

module.exports.SimpleConsole = SimpleConsole;
