import '@testing-library/react/cleanup-after-each';

const { SimpleConsole } = require('./Console');

global.console = new SimpleConsole(process.stdout, process.stderr);
