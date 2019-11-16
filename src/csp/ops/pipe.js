import { CLOSED, ENDED, OPEN } from '../buffer/states';

export default function pipe(ch) {
  let pipes = [];

  ch.pipe = (...channels) => {
    let firstTime = pipes.length === 0;
    channels.forEach(c => {
      if (!pipes.includes(c)) {
        pipes.push(c);
      }
    });
    if (firstTime) {
      (async function listen() {
        let v;
        while (v !== CLOSED && v !== ENDED) {
          v = await ch.take();
          pipes.forEach(pipedChannel => {
            if (pipedChannel.state() === OPEN) {
              pipedChannel.put(v);
            }
          });
        }
      })();
    }
    return ch;
  };
}
