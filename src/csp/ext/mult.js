import { OPEN, ENDED, CLOSED } from '../index';

export function mult(ch, to) {
  if (!ch._taps) ch._taps = [];
  if (!ch._isMultTakerFired) {
    ch._isMultTakerFired = true;
    ch._taps = ch._taps.concat(to);
    (function taker() {
      ch.take(v => {
        if (v !== CLOSED && v !== ENDED) {
          let numOfSuccessfulPuts = 0;
          let putFinished = chWithSuccessfulPut => {
            numOfSuccessfulPuts += 1;
            if (numOfSuccessfulPuts >= ch._taps.length) {
              taker();
            }
          };
          ch._taps.forEach((tapCh, idx) => {
            if (ch.state() === OPEN) {
              tapCh.put(v, () => putFinished(ch));
            } else {
              numOfSuccessfulPuts += 1;
              ch._taps.splice(idx, 1);
              putFinished();
            }
          });
        }
      });
    })();
  } else {
    to.forEach(toCh => {
      if (!ch._taps.find(c => toCh.id === c.id)) {
        ch._taps.push(toCh);
      }
    });
  }
}

export function unmult(source, ch) {
  source._taps = (source._taps || []).filter(c => c.id !== ch.id);
}
export function unmultAll(ch) {
  ch._taps = [];
}
