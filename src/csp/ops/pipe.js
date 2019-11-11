import { CLOSED, ENDED, OPEN } from '../buffers/states';

export default function pipe(api) {
  let pipes = [];

  api.pipe = (...channels) => {
    let firstTime = pipes.length === 0;
    pipes = pipes.concat(channels);
    if (firstTime) {
      (async function listen() {
        let v;
        while (v !== CLOSED && v !== ENDED) {
          v = await api.take();
          pipes.forEach(ch => {
            if (ch.state() === OPEN) {
              ch.put(v);
            }
          });
        }
      })();
    }
    return api;
  };
}
