import { delay } from '../__helpers__';
import { logger, riew, sput } from '../index';

describe('Given the logger', () => {
  describe('and we call the `snapshot` method', () => {
    it('should return a snapshot containing the status of the system', async () => {
      const viewSpy = jest.fn();
      const loggerSnapshots = jest.fn();
      const myView = function({ value, update, pointless }) {
        if (value === 'Value: 2') {
          setTimeout(() => {
            update(3);
            pointless();
          }, 10);
        }
        viewSpy(value);
      };
      const routine = function*({ state, render }) {
        const counter = state(2);

        counter.select('CCC', value => `Value: ${value}`);
        counter.mutate('UUU', (current, n) => current + n);

        render({ value: 'CCC', update: n => sput('UUU', n) });
      };
      const r = riew(myView, routine).with({
        pointless: () => sput('YYY', 'Hey'),
      });
      loggerSnapshots('1', logger.snapshot());

      r.mount({ a: 'b' });
      loggerSnapshots('2', logger.snapshot());
      r.update({ c: 'd' });

      await delay(20);
      loggerSnapshots('3', logger.snapshot());
      expect(viewSpy).toBeCalledWithArgs(['Value: 2'], ['Value: 5']);
      expect(loggerSnapshots).toBeCalledWithArgs(
        [
          '1',
          [
            {
              id: 'myView_1',
              name: 'myView',
              type: 'RIEW',
              viewData: {},
              children: [
                {
                  id: 'myView_1_view',
                  type: 'CHANNEL',
                  value: [],
                  puts: [],
                  takes: [],
                },
                {
                  id: 'myView_1_props',
                  type: 'CHANNEL',
                  value: [],
                  puts: [],
                  takes: [],
                },
              ],
            },
          ],
        ],
        [
          '2',
          [
            {
              id: 'myView_1',
              name: 'myView',
              type: 'RIEW',
              viewData: {
                a: 'b',
                value: 'Value: 2',
                update: expect.any(Function),
                pointless: expect.any(Function),
              },
              children: [
                {
                  id: 'myView_1_view',
                  type: 'CHANNEL',
                  value: [
                    {
                      pointless: expect.any(Function),
                    },
                  ],
                  puts: [],
                  takes: [],
                },
                {
                  id: 'myView_1_props',
                  type: 'CHANNEL',
                  value: [
                    {
                      a: 'b',
                    },
                  ],
                  puts: [],
                  takes: [],
                },
                {
                  id: 'state_2',
                  type: 'STATE',
                  value: 2,
                  children: [
                    {
                      id: 'state_2_read',
                      type: 'CHANNEL',
                      value: [2],
                      puts: [],
                      takes: [],
                      stateRead: true,
                    },
                    {
                      id: 'CCC',
                      type: 'CHANNEL',
                      value: ['Value: 2'],
                      puts: [],
                      takes: [],
                      stateRead: true,
                    },
                    {
                      id: 'state_2_write',
                      type: 'CHANNEL',
                      value: [],
                      puts: [],
                      takes: [],
                      stateWrite: true,
                    },
                    {
                      id: 'UUU',
                      type: 'CHANNEL',
                      value: [],
                      puts: [],
                      takes: [],
                      stateWrite: true,
                    },
                  ],
                },
              ],
            },
          ],
        ],
        [
          '3',
          [
            {
              id: 'myView_1',
              name: 'myView',
              type: 'RIEW',
              viewData: {
                a: 'b',
                value: 'Value: 5',
                update: expect.any(Function),
                pointless: expect.any(Function),
                c: 'd',
              },
              children: [
                {
                  id: 'myView_1_view',
                  type: 'CHANNEL',
                  value: [
                    {
                      value: 'Value: 5',
                    },
                  ],
                  puts: [],
                  takes: [],
                },
                {
                  id: 'myView_1_props',
                  type: 'CHANNEL',
                  value: [
                    {
                      c: 'd',
                    },
                  ],
                  puts: [],
                  takes: [],
                },
                {
                  id: 'state_2',
                  type: 'STATE',
                  value: 5,
                  children: [
                    {
                      id: 'state_2_read',
                      type: 'CHANNEL',
                      value: [5],
                      puts: [],
                      takes: [],
                      stateRead: true,
                    },
                    {
                      id: 'CCC',
                      type: 'CHANNEL',
                      value: ['Value: 5'],
                      puts: [],
                      takes: [],
                      stateRead: true,
                    },
                    {
                      id: 'state_2_write',
                      type: 'CHANNEL',
                      value: [],
                      puts: [],
                      takes: [],
                      stateWrite: true,
                    },
                    {
                      id: 'UUU',
                      type: 'CHANNEL',
                      value: [3],
                      puts: [],
                      takes: [],
                      stateWrite: true,
                    },
                  ],
                },
              ],
            },
            {
              id: 'YYY',
              type: 'CHANNEL',
              value: [],
              puts: ['Hey'],
              takes: [],
            },
          ],
        ]
      );
    });
  });
});
