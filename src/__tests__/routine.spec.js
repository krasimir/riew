import routine from '../routine';

describe('Given the `routine` function', () => {

  describe('when we create a routine instance', () => {
    it(`should
      * set the instance to active
      * run the controller function
      * pass render function to the controller function
      * pass util methods to the controller function (isActive)
      * call the view function on every render call`, () => {
      const controllerSpy = jest.fn().mockImplementation(({ render, isActive }) => {
        expect(isActive()).toBe(true);
        render({ foo: 'bar' });
      });
      const viewSpy = jest.fn();
      const instance = routine(controllerSpy, viewSpy);

      instance.in({});

      expect(instance.isActive()).toBe(true);
      expect(viewSpy).toBeCalledTimes(1);
      expect(viewSpy).toBeCalledWith({ foo: 'bar' }, expect.any(Function));
    });
    it('should allow us to wait till the render is done', (done) => {
      const controller = async ({ render }) => {
        await render(null);
        done();
      };
      const c = routine(controller, (props, done) => done());

      c.in({});
    });
    it('should be transparent about what we are passing to the view function', () => {
      const c = routine(async ({ render }) => {
        render('banana');
      }, (what) => {
        expect(what).toBe('banana');
      });

      c.in({});
    });
    describe('when we update the routine from the outside', () => {
      it('should allow us to react on those changes', () => {
        const propsSpy = jest.fn();
        const c = routine(({ props }) => {
          props.stream.pipe(propsSpy);
          propsSpy(props.get());
        });

        c.in({ a: 'b' });
        c.set({ c: 'd' });

        expect(propsSpy).toBeCalledTimes(2);
        expect(propsSpy.mock.calls[0]).toStrictEqual([{ a: 'b' }]);
        expect(propsSpy.mock.calls[1]).toStrictEqual([{ c: 'd' }]);
      });
    });
    describe('when we call the out method', () => {
      it('should mark the instance as not active', () => {
        const c = routine(() => {});

        c.in({});
        expect(c.isActive()).toBe(true);
        c.out();
        expect(c.isActive()).toBe(false);
      });
    });
  });

});
