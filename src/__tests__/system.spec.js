import { createState as state } from '../state';
import system from '../system';
import { delay } from '../__helpers__';

describe('Given the `system` singleton', () => {
  describe('when we do a snapshot', () => {
    it('should generate a snapshot of the currently created object', async () => {
      const s = state('foo');
      const m = s.mutate(async function Hop(value) {
        await delay(5);
        return value.toUpperCase();
      }).pipe(function Trop() {});

      // console.log(JSON.stringify(system.snapshot(), null, 2));
      // m();
      // console.log(JSON.stringify(system.snapshot(), null, 2));
      // await delay(7);
      // console.log(JSON.stringify(system.snapshot(), null, 2));
    });
  });
});
