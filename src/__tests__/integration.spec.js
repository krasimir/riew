import React, { useState } from 'react';
import { render, act, fireEvent } from '@testing-library/react';

import rine from '../index';

xdescribe('Given the Rine library', () => {
  describe('when', () => {
    it('should', async () => {
      const Input = function () {
        const [ text, setText ] = useState('');

        return (
          <React.Fragment>
            <p>{ text }</p>
            <input onChange={ e => setText(e.target.value) } data-testid='input' />
          </React.Fragment>
        );
      };
      const Form = rine(function ({ render }) {
        render(
          <form>
            <Input />
          </form>
        );
      });

      const { debug, getByTestId } = render(<Form />);

      fireEvent.change(getByTestId('input'), { target: { value: 'foobar' } });

      debug();
    });
  });
});
