import { CLOSED, ENDED, OPEN } from "../buffers/states";
import { chan } from "../channel";

export default function filter(api) {
  api.map = func => {
    const newChan = chan();
    (async function listen() {
      let v;
      while (v !== CLOSED && v !== ENDED && newChan.state() === OPEN) {
        v = await api.take();
        newChan.put(func(v));
      }
    })();
    return newChan;
  };
}
