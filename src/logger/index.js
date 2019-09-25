/* eslint-disable consistent-return */
const { table } = require('table');

import sanitize from './sanitize';
import { getFuncName } from '../utils';
import { isState } from '../state';
import { isRiew } from '../riew';
import grid from '../grid';

const INDENT = 12;

function normalizeState(state) {
  const queues = state.queues();

  return {
    id: state.id,
    value: sanitize(state.get()),
    effects: state.effects().filter(({ loggable }) => loggable).map(e => {
      const effectQueues = queues.filter(({ causedBy }) => {
        return causedBy === e.id;
      });

      if (effectQueues.length === 0) {
        return false;
      }

      return {
        ...normalizeEffect(e),
        queues: effectQueues.map(normalizeQueue)
      };
    }).filter(e => e !== false)
  };
}
function normalizeEffect(effect) {
  return {
    id: effect.id
  };
}
function normalizeQueue(q) {
  return {
    id: q.id,
    index: q.index,
    result: q.result,
    items: q.items.map(({ type, func }) => {
      return type;
    })
  };
}
function normalizeRiew(riew) {
  return {
    id: riew.id,
    name: riew.name,
    props: sanitize(riew.__output())
  };
}

function Logger() {
  const api = {};
  let listeners = [];

  api.__log = (type, product) => {
    if (!product.loggable) return;
    listeners.forEach(l => l(type, api.report()));
  };
  api.on = (listener) => {
    listeners.push(listener);
  };
  api.reset = () => {
    listeners = [];
  };
  api.report = () => {
    const gridSnapshot = {
      states: [],
      riews: []
    };
    const gridNodes = grid.nodes();

    gridNodes.forEach(node => {
      if (isState(node)) {
        if (node.loggable) {
          gridSnapshot.states.push(normalizeState(node));
        }
      } else if (isRiew(node)) {
        gridSnapshot.riews.push(normalizeRiew(node));
      } else {
        console.log('Unrecognizable node in the grid!', node);
      }
    });

    return gridSnapshot;
  };
  api.toConsole = () => {
    const report = api.report();
    const rows = [];
    const innerTableBorders = {
      topBody: '',
      topJoin: '',
      topLeft: '',
      topRight: '',

      bottomBody: '',
      bottomJoin: '',
      bottomLeft: '',
      bottomRight: '',

      bodyLeft: '',
      bodyRight: '',
      bodyJoin: '│',

      joinBody: '─',
      joinLeft: '├',
      joinRight: '┤',
      joinJoin: '┼'
    };

    rows.push(['ID', 'value', 'effects']);

    report.states.forEach(({ id, value, effects }) => {
      rows.push([
        id,
        JSON.stringify(value, null, 2),
        effects.length > 0 ? table(effects.reduce((rows, effect) => {
          effect.queues.forEach(q => {
            rows.push([
              effect.id,
              q.items.map((type, i) => {
                return `${ type }${ i === q.index ? '*' : ''}`;
              }).join('\n'),
              q.result
            ]);
          });
          return rows;
        }, [['id', 'Qs', 'Q result']]), { border: innerTableBorders }) : 'none'
      ]);
    });
    // console.log(JSON.stringify(report.states, null, 2));
    console.log(table(rows));
  };

  return api;
}

const logger = Logger();

export default logger;
