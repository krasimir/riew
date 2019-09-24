/* eslint-disable consistent-return */
const { table } = require('table');

import sanitize from './sanitize';
// import Table from 'cli-table3';
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

    rows.push(['ID', 'value', 'effects']);

    report.states.forEach(({ id, value, effects }) => {
      rows.push([
        id,
        JSON.stringify(value, null, 2),
        table(effects.reduce((rows, effect) => {
          // ?
          return rows;
        }, [['id', 'Qs', 'Q result']]))
      ]);
    });

    console.log(table(rows));
    /*
    const statesTable = new Table({
      head: ['ID', 'value', 'effects', 'Qs', 'Q result'],
      colWidths: [6, 19, 10, 10, 19]
    });
    const riewsTable = new Table({
      head: ['ID', 'name', 'props'],
      colWidths: [6, 11, 60]
    });
    const printQueueSteps = q => {
      return q.items.map((type, i) => {
        if (i === q.index) return `${ type }*`;
        return type;
      }).join('\n');
    };
    const statesRows = [];

    report.states.forEach(({ id, value, effects }) => {
      const rowSpan = effects.length + effects.reduce((n, effect, i) => {
        if (effect.queues.length > 1) {
          n += effect.queues.length - 1;
        }
        return n;
      }, 0);

      if (effects.length === 0) {
        statesRows.push([
          { rowSpan, content: id },
          { rowSpan, content: JSON.stringify(value, null, 2) }
        ]);
      } else {
        effects.forEach((effect, i) => {
          if (i === 0) {
            statesRows.push([
              { rowSpan, content: id },
              { rowSpan, content: JSON.stringify(value, null, 2) },
              effect.queues.length > 1 ?
                { rowSpan: effect.queues.length > 0 ? effect.queues.length : 1, content: effect.id } :
                effect.id,
              effect.queues.length > 0 ? printQueueSteps(effect.queues[0]) : '',
              effect.queues.length > 0 ? JSON.stringify(effect.queues[0].result, null, 2) : ''
            ]);
            effect.queues.forEach((q, i) => {
              if (i > 0) {
                statesRows.push([
                  printQueueSteps(q),
                  JSON.stringify(q.result, null, 2)
                ]);
              }
            });
          } else {
            statesRows.push([
              effect.queues.length > 1 ?
                { rowSpan: effect.queues.length > 0 ? effect.queues.length : 1, content: effect.id } :
                effect.id,
              effect.queues.length > 0 ? printQueueSteps(effect.queues[0]) : '',
              effect.queues.length > 0 ? JSON.stringify(effect.queues[0].result, null, 2) : ''
            ]);
            effect.queues.forEach((q, i) => {
              if (i > 0) {
                statesRows.push([
                  printQueueSteps(q),
                  JSON.stringify(q.result, null, 2)
                ]);
              }
            });
          }
        });
      }
    });
    report.riews.forEach(({ id, name, props }) => {
      riewsTable.push([ id, name, JSON.stringify(props, null, 2) ]);
    });
    console.log(JSON.stringify(statesRows, null, 2));
    statesRows.forEach(r => statesTable.push(r));

    // console.log(JSON.stringify(report, null, 2));

    console.log(`${ statesTable.toString() }\n${ riewsTable.toString() }`);
    */
  };

  return api;
}

const logger = Logger();

export default logger;
