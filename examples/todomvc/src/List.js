import React from 'react';
import { Routine } from 'rine';
import { TOGGLE } from './constants';

export default Routine(function List({ todos, put }) {
  return (
    <ul className='todo-list'>
      {
        todos.map((todo, i) => {
          const liClass = todo.editing ? 'editing' : (todo.completed ? 'completed' : '');

          return (
            <li className={ liClass } key={ i }>
              <div className='view'>
                <input
                  className='toggle'
                  type='checkbox'
                  checked={ todo.completed }
                  onChange={ () => put(TOGGLE, i) }/>
                <label data-index='${ i }' data-label>{ todo.label }</label>
                <button
                  className='destroy'
                  data-index='${ i }'
                  data-delete></button>
              </div>
              <input className='edit' value='${ todo.label }' data-index='${ i }' data-edit />
            </li>
          );
        })
      }
    </ul>
  );
});
