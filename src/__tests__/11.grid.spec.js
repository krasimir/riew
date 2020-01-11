import Grid from '../grid';
import {
  grid,
  riew,
  chan,
  close,
  state,
  sleep,
  go,
  stop,
  reset,
} from '../index';
import { delay } from '../__helpers__';

describe('Given the grid', () => {
  beforeEach(() => {
    reset();
  });
  describe('when we use the grid', () => {
    xit('should store products and let us free resources', () => {
      const g = new Grid({
        snapshot() {},
      });
      const obj = { id: 'foo', something: 'else' };
      const obj2 = { id: 'bar' };
      const obj3 = { id: 'moo' };

      g.add(obj);
      g.add(obj2);
      g.add(obj3);
      expect(g.nodes()).toHaveLength(3);
      g.remove(obj);
      g.remove(obj2);
      g.remove(obj3);
      expect(g.nodes()).toHaveLength(0);
    });
  });
  describe('when we mount and unmount a riew', () => {
    xit('should add an item to the grid and remove it', () => {
      const r = riew(() => {});

      r.mount();
      expect(grid.nodes().find(({ id }) => r.id === id)).toMatchObject({
        id: r.id,
      });
      r.unmount();
      expect(grid.nodes()).toHaveLength(0);
    });
  });
  describe('when we create and close a channel', () => {
    xit('should add an item to the grid and remove it', () => {
      const c = chan();

      expect(grid.nodes().find(({ id }) => c.id === id)).toMatchObject({
        id: c.id,
      });
      close(c);
      expect(grid.nodes()).toHaveLength(0);
    });
  });
  describe('when we create and state and destroy it', () => {
    xit('should add an item to the grid and remove it', () => {
      const s = state();

      expect(grid.nodes().find(({ id }) => s.id === id)).toMatchObject({
        id: s.id,
      });
      s.destroy();
      expect(grid.nodes()).toHaveLength(0);
    });
  });
  describe('when we run a routine and when it finishes', () => {
    xit('should add an item to the grid and leave it there', async () => {
      const r = go(function*() {
        yield sleep(10);
      });

      expect(grid.nodes().find(({ id }) => r.id === id)).toMatchObject({
        id: r.id,
      });
      await delay(20);
      expect(grid.nodes()[0]).toMatchObject({ id: r.id });
    });
  });
  describe('when we run a routine and stop it', () => {
    xit('should add an item to the grid and remove it', async () => {
      const spy = jest.fn();
      const r = go(function*() {
        yield sleep(10);
        spy();
      });

      expect(grid.nodes().find(({ id }) => r.id === id)).toMatchObject({
        id: r.id,
      });
      r.stop();
      await delay(20);
      expect(grid.nodes()).toHaveLength(0);
      expect(spy).not.toBeCalled();
    });
    xit('should add an item to the grid and remove it', async () => {
      const spy = jest.fn();
      const r = go(function*() {
        yield sleep(10);
        yield stop();
        spy();
      });

      expect(grid.nodes().find(({ id }) => r.id === id)).toMatchObject({
        id: r.id,
      });
      await delay(20);
      expect(grid.nodes()).toHaveLength(0);
      expect(spy).not.toBeCalled();
    });
  });
});
