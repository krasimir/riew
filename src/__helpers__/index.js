/* eslint-disable max-len */
import { getFuncName } from '../utils';
import { go } from '../index';

const cleanHTML = html =>
  html
    .toString()
    .trim()
    .replace(new RegExp('\\n', 'gi'), '')
    .replace(new RegExp(' {2}', 'g'), '');

export const delay = (time = 0) => new Promise(done => setTimeout(done, time));
export const exerciseHTML = (container, expectation) => {
  expect(cleanHTML(container.innerHTML)).toEqual(cleanHTML(expectation));
};

export function Test(...routines) {
  const log = [];
  routines.map(routine => {
    const rName = getFuncName(routine);
    const logSomething = str => log.push(str);
    log.push(`>${rName}`);
    go(routine, () => log.push(`<${rName}`), { log: logSomething });
  });
  return log;
}
export function exercise(log, expectation, delay, cleanup = () => {}) {
  if (delay) {
    return new Promise(resolve => {
      setTimeout(() => {
        expect(log).toStrictEqual(expectation);
        resolve();
        cleanup();
      }, delay);
    });
  }
  expect(log).toStrictEqual(expectation);
}
