import { CLOSED, ENDED, OPEN } from "../buffers/states";
import { chainOperations } from "./index";

export default function pipe(ch) {
  let pipes = [];

  ch.pipe = (...channels) => {
    let firstTime = pipes.length === 0;
    pipes = pipes.concat(channels);
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
