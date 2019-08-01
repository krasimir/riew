/* eslint-disable react/prop-types */
/** @jsx A */
import { A } from '../../../lib';

import { FillContainer } from './DOM';
import { FILTER_ALL, FILTER_ACTIVE, FILTER_COMPLETED } from './';

export default function Renderer({ todos, filter }) {
  return (
    <FillContainer>
      {
        () => todos
        .filter(({ completed }) => {
          if (filter === FILTER_ALL) return true;
          if (filter === FILTER_ACTIVE) return !completed;
          if (filter === FILTER_COMPLETED) return completed;
          return false;
        }).map((todo, i) => {
          const liClass = todo.editing ? 'editing' : (todo.completed ? 'completed' : '');

          return `
            <li class='${ liClass }'>
              <div class="view">
                <input 
                  class="toggle"
                  type="checkbox"
                  data-index="${ i }"
                  data-toggle
                  ${ todo.completed ? 'checked' : '' }>
                <label data-index="${ i }" data-label>${ todo.label }</label>
                <button
                  class="destroy"
                  data-index="${ i }"
                  data-delete></button>
              </div>
              <input class="edit" value="${ todo.label }" data-index="${ i }" data-edit>
            </li>
          `;
        }).join('')
      }
    </FillContainer>
  );
};
